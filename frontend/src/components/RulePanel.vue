<template>
  <div class="rule-bar">
    <span class="bar-title">🚨 告警规则</span>
    <div class="rule-list">
      <div v-for="rule in store.rules" :key="rule.id" class="rule-item">
        <el-checkbox v-model="rule.enabled">{{ rule.name }}</el-checkbox>
        <el-input-number v-model="rule.threshold" :min="0" :max="9999" size="small" controls-position="right" style="width:110px"/>
        <span class="th-unit">{{ rule.type === 'keyword' ? '命中条数>' : '阈值>' }}</span>

        <el-popover v-if="rule.type === 'keyword'" placement="bottom" :width="320" trigger="click">
          <template #reference>
            <el-button size="small" text type="primary">
              词表({{ (rule.keywords || []).length }})
            </el-button>
          </template>
          <div class="kw-editor">
            <div class="kw-tip">每行一个关键词，也可用逗号 / 顿号 / 分号分隔（支持中文），留空将提示异常</div>
            <el-input
              v-model="kwDrafts[rule.id]"
              type="textarea"
              :rows="5"
              :autosize="{ minRows: 4, maxRows: 10 }"
              placeholder="例如：&#10;timeout&#10;OOM&#10;连接超时"
            />
            <div class="kw-actions">
              <el-button size="small" @click="syncFromRule(rule)">重置</el-button>
              <el-button size="small" type="primary" @click="saveKeywords(rule)">保存词表</el-button>
            </div>
          </div>
        </el-popover>

        <span v-if="hitSummary(rule.id)" class="hit-badge">
          本轮命中 {{ hitSummary(rule.id)!.count }} 条 / {{ hitSummary(rule.id)!.windows }} 窗口
        </span>
      </div>
    </div>

    <div v-for="err in store.result?.errors || []" :key="err.code + err.ruleId" class="rule-error">
      <span>⚠ {{ err.message }}</span>
      <el-button size="small" type="danger" plain :loading="store.loading" @click="store.detect()">重试检测</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useLogStore } from '../store/log'
import type { AlertRule } from '../types'

const store = useLogStore()
const kwDrafts = reactive<Record<number, string>>({})

function syncFromRule(rule: AlertRule) {
  kwDrafts[rule.id] = (rule.keywords || []).join('\n')
}

function saveKeywords(rule: AlertRule) {
  const raw = kwDrafts[rule.id] ?? ''
  const list = raw.split(/[\n,，;；、]+/).map(s => s.trim()).filter(Boolean)
  rule.keywords = [...new Set(list)]
  kwDrafts[rule.id] = rule.keywords.join('\n')
}

// Pre-fill the textarea draft the first time a rule is rendered
for (const r of store.rules) {
  if (r.type === 'keyword') syncFromRule(r)
}

function hitSummary(ruleId: number) {
  const hits = (store.result?.keywordHits || []).filter(h => h.ruleId === ruleId)
  if (!hits.length) return null
  return {
    windows: hits.length,
    count: hits.reduce((sum, h) => sum + h.count, 0)
  }
}
</script>

<style scoped>
.rule-bar{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:8px 20px;background:#1e293b;border-bottom:1px solid #334155}
.bar-title{color:#f87171;font-size:13px;font-weight:600;white-space:nowrap}
.rule-list{display:flex;flex-wrap:wrap;gap:16px;flex:1;min-width:300px}
.rule-item{display:flex;align-items:center;gap:6px;font-size:12px;color:#cbd5e1}
.th-unit{color:#64748b;font-size:11px}
.hit-badge{color:#fbbf24;font-size:11px;background:#78350f33;padding:1px 6px;border-radius:3px;white-space:nowrap}
.rule-error{display:flex;align-items:center;gap:10px;width:100%;color:#fca5a5;font-size:12px;background:#7f1d1d33;border:1px solid #7f1d1d;border-radius:4px;padding:4px 10px}
.kw-editor{display:flex;flex-direction:column;gap:8px}
.kw-tip{color:#94a3b8;font-size:11px;line-height:1.5}
.kw-actions{display:flex;justify-content:flex-end;gap:8px}
:deep(.el-checkbox){color:#cbd5e1;height:auto}
</style>
