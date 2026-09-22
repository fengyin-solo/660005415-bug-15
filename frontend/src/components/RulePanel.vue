<template>
  <div class="panel">
    <h4>🧪 检测规则</h4>
    <div class="rule-list">
      <div v-for="r in store.rules" :key="r.id" class="rule-row">
        <el-switch v-model="r.enabled" size="small"/>
        <span class="rule-name">{{ r.name }}</span>
        <el-input-number
          v-if="r.type !== 'keyword'"
          v-model="r.threshold" :min="0" :max="10000" size="small" controls-position="right" class="th-input"/>
        <el-input-number
          v-else
          v-model="r.threshold" :min="1" :max="10000" size="small" controls-position="right" class="th-input"
          title="单窗口命中条数阈值"/>
        <span class="th-unit">{{ r.type === 'level' ? '条ERROR' : r.type === 'count' ? '条/窗口' : '条命中/窗口' }}</span>
      </div>
    </div>

    <div class="kw-block">
      <label>关键词词表（关键词命中 / 条数判定共用；逗号、分号或换行分隔）</label>
      <el-input
        v-model="store.keywords" type="textarea" :rows="2" size="small"
        placeholder="例如：timeout, ERROR, OOM, 连接超时"/>
      <div class="kw-hint">有效关键词 {{ parsedKeywords.length }} 个：<span v-if="parsedKeywords.length">{{ parsedKeywords.join('、') }}</span><span v-else class="warn">（当前为空）</span></div>
    </div>

    <el-alert
      v-if="store.detectError" :title="store.detectError.message" type="error"
      :closable="true" show-icon class="err-alert" @close="store.detectError = null">
      <el-button size="small" type="danger" plain :loading="store.loading" @click="store.detect()">重试</el-button>
    </el-alert>

    <div v-if="store.result?.keywordSummary" class="kw-summary">
      本次命中 <b>{{ store.result.keywordSummary.hitLogs }}</b> 条日志 /
      <b>{{ store.result.keywordSummary.hitWindows }}</b> 个窗口：
      <span v-for="(cnt, kw) in store.result.keywordSummary.byTerm" :key="kw" class="kw-chip"
            :class="{ zero: cnt === 0 }">{{ kw }}×{{ cnt }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLogStore } from '../store/log'
const store = useLogStore()
// 与后端一致的词表归一化规则，用于实时预览有效词
const parsedKeywords = computed(() =>
  store.keywords
    .split(/[,，;；\n\r\t]+/)
    .map(s => s.trim().replace(/^["']|["']$/g, '').trim())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
)
</script>

<style scoped>
.panel{background:#1e293b;border-radius:8px;padding:12px;border:1px solid #334155}
.panel h4{color:#f87171;font-size:13px;margin-bottom:8px}
.rule-list{display:flex;flex-direction:column;gap:6px}
.rule-row{display:flex;align-items:center;gap:8px;font-size:12px}
.rule-name{flex:1;color:#e2e8f0}
.th-input{width:110px}
.th-unit{color:#94a3b8;font-size:10px;min-width:64px}
.kw-block{margin-top:10px}
.kw-block label{display:block;color:#94a3b8;font-size:11px;margin-bottom:4px}
.kw-hint{color:#94a3b8;font-size:10px;margin-top:4px;word-break:break-all}
.kw-hint .warn{color:#fca5a5}
.err-alert{margin-top:8px}
.err-alert :deep(.el-alert__content){display:flex;flex-direction:column;gap:6px;align-items:flex-start}
.kw-summary{margin-top:8px;font-size:11px;color:#cbd5e1;line-height:1.8}
.kw-chip{display:inline-block;background:#0c4a6e55;color:#7dd3fc;border-radius:3px;padding:0 5px;margin:0 3px;font-size:10px}
.kw-chip.zero{color:#64748b;background:#33415555}
</style>
