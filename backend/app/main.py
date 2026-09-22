import re, math, time, random
from typing import Union, List, Optional
import numpy as np
from collections import defaultdict, Counter
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Log Anomaly Detector")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

LOG_TEMPLATES = {
    "nginx": {
        "pattern": r'(?P<timestamp>\S+ \+\d{4}) (?P<source>\S+) (?P<level>\w+) (?P<message>.+)',
        "generator": lambda: {
            "timestamp": f"{random.randint(1,28):02d}/{'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split()[random.randint(0,11)]}/{2024}:{random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d} +0000",
            "source": random.choice(["nginx", "api-gateway", "load-balancer"]),
            "level": random.choices(["INFO", "WARN", "ERROR", "DEBUG"], weights=[50, 15, 5, 30])[0],
            "message": random.choice([
                'GET /api/users 200 0.032s', 'POST /api/orders 201 0.145s', 'GET /api/products 304 0.008s',
                'GET /static/main.js 200 0.002s', 'POST /api/login 401 0.023s', 'GET /admin 403 0.005s',
                'GET /api/health 200 0.001s', 'GET /api/orders?page=2 200 0.056s', 'connection timeout upstream',
                'SSL handshake failed', 'worker process exited on signal 9', 'upstream server unavailable'
            ])
        }
    },
    "apache": {
        "pattern": r'\[(?P<timestamp>[^\]]+)\] \[(?P<level>\w+)\] \[(?P<source>\S+)\] (?P<message>.+)',
        "generator": lambda: {
            "timestamp": f"{'Sun Mon Tue Wed Thu Fri Sat'.split()[random.randint(0,6)]} {'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split()[random.randint(0,11)]} {random.randint(1,28):02d} {random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d} {2024}",
            "source": random.choice(["httpd", "mod_ssl", "mod_rewrite"]),
            "level": random.choices(["notice", "warn", "error", "info"], weights=[40, 15, 5, 40])[0],
            "message": random.choice(["server configured", "caught SIGTERM", "resuming normal ops", "request exceeded limit",
                        "file does not exist", "client denied by server", "Invalid method in request"])
        }
    },
    "json_app": {
        "pattern": None,
        "generator": lambda: {
            "timestamp": f"{2024}-{random.randint(1,12):02d}-{random.randint(1,28):02d}T{random.randint(0,23):02d}:{random.randint(0,59):02d}:{random.randint(0,59):02d}.{random.randint(0,999):03d}Z",
            "source": random.choice(["user-service", "order-service", "payment-service", "auth-service"]),
            "level": random.choices(["INFO", "WARN", "ERROR", "DEBUG"], weights=[45, 20, 5, 30])[0],
            "message": random.choice([
                'User login successful user_id=10' + str(random.randint(100, 999)),
                'Order created order_id=ORD-' + str(random.randint(10000, 99999)),
                'Payment processed amount=' + str(random.randint(10, 999)),
                'Database connection pool exhausted',
                'Cache miss for key user_session_' + str(random.randint(100, 999)),
                'Circuit breaker opened for service payment',
                'Request latency exceeds threshold 5000ms',
                'NullPointerException at com.app.controller.UserController.getProfile'
            ])
        }
    },
    "custom": {
        "pattern": None,
        "generator": lambda: {
            "timestamp": str(int(time.time() - random.randint(0, 86400))),
            "source": random.choice(["cron", "systemd", "kernel", "docker"]),
            "level": random.choices(["info", "warning", "error", "debug"], weights=[40, 20, 5, 35])[0],
            "message": random.choice(["OOM killer invoked", "disk usage above 90%", "container restarted", "NTP sync lost",
                        "process oom_score_adj=500", "firewall rule updated", "mount point not found"])
        }
    }
}


class GenerateRequest(BaseModel):
    type: str = "nginx"
    count: int = 1000


class DetectRequest(BaseModel):
    logs: list
    rules: list = []
    query: str = ""
    # 词表允许字符串（前端文本框，逗号/分号/换行分隔）或列表
    keywords: Optional[Union[List, str]] = None


def normalize_keywords(raw):
    """词表统一归一化：支持字符串（逗号/分号/空白/换行分隔）或列表，
    去重保序、去除包裹引号。中文关键词（含中文的整项）原样保留。"""
    if raw is None:
        return []
    if isinstance(raw, str):
        tokens = re.split(r'[,，;；\n\r\t]+', raw)
    else:
        tokens = []
        for item in raw:
            if item is None:
                continue
            tokens.extend(re.split(r'[,，;；\n\r\t]+', str(item)))
    result = []
    seen = set()
    for tok in tokens:
        kw = tok.strip().strip('"\'').strip()
        if kw and kw not in seen:
            seen.add(kw)
            result.append(kw)
    return result


@app.post("/api/generate")
def generate_logs(req: GenerateRequest):
    tmpl = LOG_TEMPLATES.get(req.type, LOG_TEMPLATES["nginx"])
    logs = []
    for i in range(req.count):
        entry = tmpl["generator"]()
        logs.append({
            "id": i + 1,
            "timestamp": entry["timestamp"],
            "level": entry["level"],
            "source": entry["source"],
            "message": entry["message"],
            "raw": f"[{entry['timestamp']}] [{entry['level']}] [{entry['source']}] {entry['message']}"
        })
    return analyze_logs(logs, [], "")


@app.post("/api/detect")
def detect_anomalies(req: DetectRequest):
    try:
        return analyze_logs(req.logs, req.rules, req.query, req.keywords)
    except ValueError as e:
        # 词表为空或全部被过滤掉：返回结构化异常说明，前端据此提示并支持重试
        raise HTTPException(status_code=400, detail={
            "code": "EMPTY_KEYWORDS",
            "message": str(e)
        })


def analyze_logs(logs_data, rules, query, keywords_raw=None):
    logs = logs_data
    n = len(logs)

    # 第三条规则（关键词命中）。条数类判定与逐词命中共用同一份词表
    keyword_rules = [r for r in rules if isinstance(r, dict) and r.get("type") == "keyword"]
    keyword_vocab = []
    if keyword_rules:
        # 字符串词表（文本框输入）整体交给归一化按分隔符拆分，不能 list() 逐字符拆散
        if isinstance(keywords_raw, str):
            vocab_terms = [keywords_raw]
        else:
            vocab_terms = list(keywords_raw or [])
        for r in keyword_rules:
            kw_field = r.get("keywords", [])
            if isinstance(kw_field, str):
                vocab_terms.append(kw_field)
            elif kw_field:
                vocab_terms.extend(kw_field)
        keyword_vocab = normalize_keywords(vocab_terms)
        if not keyword_vocab:
            raise ValueError(
                "关键词词表为空：请填写至少一个有效关键词后重试（多个关键词可用逗号、分号或换行分隔）"
            )
        keyword_threshold = max(1, int(keyword_rules[0].get("threshold", 1) or 1))
    keyword_active = bool(keyword_rules) and bool(keyword_vocab)
    keyword_lower = [k.lower() for k in keyword_vocab]

    # 逐日志关键词命中（纯子串匹配，不区分 ASCII 大小写，中文按原文匹配）；
    # 同一份匹配结果同时服务于"命中条目"与"条数类窗口判定"
    per_keyword_hits = Counter()
    if keyword_active:
        for log in logs:
            raw_lower = str(log.get("raw", "")).lower()
            matched = [kw for kw, kw_l in zip(keyword_vocab, keyword_lower) if kw_l in raw_lower]
            log["matchedKeywords"] = matched
            if matched:
                per_keyword_hits.update(matched)

    # Time windows (1min each for demonstration)
    window_size = 20
    windows = []
    for i in range(0, n, window_size):
        chunk = logs[i:i + window_size]
        levels = Counter(l["level"] for l in chunk)
        sources = Counter(l["source"] for l in chunk)
        hit_logs = [l for l in chunk if l.get("matchedKeywords")]
        window_hits = Counter(k for l in hit_logs for k in l["matchedKeywords"])
        windows.append({
            "start": i, "end": min(i + window_size, n),
            "count": len(chunk),
            "levels": dict(levels),
            "sources": dict(sources),
            "keywordHits": len(hit_logs),
            "keywordByTerm": dict(window_hits)
        })

    # 3-sigma + IQR anomaly detection
    counts = [w["count"] for w in windows]
    mean = float(np.mean(counts))
    std = float(np.std(counts)) if len(counts) > 1 else 1.0
    q1 = float(np.percentile(counts, 25)) if len(counts) > 3 else mean - std
    q3 = float(np.percentile(counts, 75)) if len(counts) > 3 else mean + std
    iqr = q3 - q1 if q3 > q1 else 1.0

    anomalies = []
    for i, w in enumerate(windows):
        sigma_score = abs(w["count"] - mean) / max(std, 1e-5)
        iqr_low = q1 - 1.5 * iqr
        iqr_high = q3 + 1.5 * iqr
        iqr_score = 0.0
        if w["count"] < iqr_low or w["count"] > iqr_high:
            iqr_score = min(10.0, abs(w["count"] - (mean)) / max(iqr, 1e-5))
        anomalies.append({
            "windowIndex": i,
            "sigmaScore": round(sigma_score, 2),
            "iqrScore": round(iqr_score, 2),
            "isAnomaly": sigma_score > 2.5 or iqr_score > 3.0,
            "timestamp": logs[i * window_size]["timestamp"] if i * window_size < len(logs) else ""
        })

    # Alert rules
    alerts = []
    keyword_rule_name = keyword_rules[0].get("name", "关键词命中") if keyword_active else ""
    for i, rule in enumerate(rules):
        rule = rule if isinstance(rule, dict) else {}
        for w in windows:
            if rule.get("type") == "level" and w["levels"].get("ERROR", 0) > rule.get("threshold", 5):
                alerts.append({
                    "id": len(alerts) + 1, "ruleName": rule.get("name", "高频ERROR"),
                    "severity": "high", "message": f"窗口{w['start']}内ERROR日志{w['levels']['ERROR']}条超过阈值{rule.get('threshold',5)}",
                    "timestamp": time.strftime("%H:%M:%S")
                })
            if rule.get("type") == "count" and w["count"] > rule.get("threshold", 200):
                alerts.append({
                    "id": len(alerts) + 1, "ruleName": rule.get("name", "异常流量"),
                    "severity": "medium", "message": f"窗口{w['start']}日志量{w['count']}超过阈值",
                    "timestamp": time.strftime("%H:%M:%S")
                })
            # 关键词条数类判定：与逐词命中共用同一份词表与同一次匹配结果
            if rule.get("type") == "keyword" and keyword_active and w["keywordHits"] >= keyword_threshold:
                top_terms = sorted(w["keywordByTerm"].items(), key=lambda x: x[1], reverse=True)
                terms_desc = "、".join(f"{t}×{c}" for t, c in top_terms[:3])
                alerts.append({
                    "id": len(alerts) + 1, "ruleName": rule.get("name", "关键词命中"),
                    "severity": "medium",
                    "message": f"窗口{w['start']}关键词命中{w['keywordHits']}条日志（{terms_desc}），达到条数阈值{keyword_threshold}",
                    "timestamp": time.strftime("%H:%M:%S")
                })

    # 逐关键词命中告警（同一关键词命中多条日志时给出总条数与分布窗口数），
    # 与窗口条数判定互为依据
    if keyword_active:
        for kw in keyword_vocab:
            hit_count = per_keyword_hits.get(kw, 0)
            if hit_count > 0:
                hit_windows = sum(1 for w in windows if w["keywordByTerm"].get(kw))
                alerts.append({
                    "id": len(alerts) + 1, "ruleName": keyword_rule_name,
                    "severity": "info",
                    "message": f"关键词「{kw}」共命中{hit_count}条日志，分布于{hit_windows}个窗口",
                    "timestamp": time.strftime("%H:%M:%S")
                })

    # Full-text search with TF-IDF
    if query:
        query_terms = query.lower().split()
        scored = []
        for log in logs:
            raw_lower = log["raw"].lower()
            score = sum(1 for t in query_terms if t in raw_lower)
            if score > 0:
                scored.append((score, log))
        logs = [l for _, l in sorted(scored, key=lambda x: x[0], reverse=True)]

    # 关键词规则启用时命中条目优先展示，保证命中日志一定出现在结果列表中
    if keyword_active:
        logs = sorted(logs, key=lambda l: (-len(l.get("matchedKeywords") or []), l.get("id", 0)))

    # Add non-rule alerts for high anomaly windows  
    for a in anomalies:
        if a["isAnomaly"]:
            alerts.append({
                "id": len(alerts) + 1, "ruleName": "统计异常检测",
                "severity": "critical" if a["sigmaScore"] > 4 else "high",
                "message": f"窗口{a['windowIndex']}: 3-sigma={a['sigmaScore']}, IQR={a['iqrScore']}",
                "timestamp": a["timestamp"]
            })

    keyword_summary = None
    if keyword_active:
        hit_log_count = sum(1 for l in logs if l.get("matchedKeywords"))
        keyword_summary = {
            "keywords": keyword_vocab,
            "hitLogs": hit_log_count,
            "hitWindows": sum(1 for w in windows if w["keywordHits"] > 0),
            "byTerm": {kw: per_keyword_hits.get(kw, 0) for kw in keyword_vocab},
            "threshold": keyword_threshold
        }

    return {
        "logs": logs[:200],
        "windows": windows,
        "anomalies": anomalies,
        "alerts": alerts[:50],
        "totalLogs": n,
        "keywordSummary": keyword_summary
    }