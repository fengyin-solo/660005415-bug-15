<template>
  <div class="panel" style="height:100%">
    <h4>📋 日志流 ({{ store.result?.totalLogs || 0 }} 条)</h4>
    <div class="table-wrap">
      <el-table :data="store.result?.logs||[]" size="small" max-height="400" stripe :row-class-name="rowClass">
        <el-table-column prop="id" label="#" width="50"/>
        <el-table-column prop="timestamp" label="时间" width="150"/>
        <el-table-column prop="level" label="级别" width="70">
          <template #default="{row}"><el-tag size="small" :type="row.level==='ERROR'||row.level==='error'?'danger':row.level==='WARN'||row.level==='warn'?'warning':'info'">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="120"/>
        <el-table-column prop="message" label="消息" show-overflow-tooltip/>
        <el-table-column label="命中" width="130">
          <template #default="{row}">
            <el-tag
              v-for="kw in row.matchedKeywords || []"
              :key="kw"
              size="small"
              type="danger"
              effect="plain"
              class="kw-tag"
            >{{ kw }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useLogStore } from '../store/log'
import type { LogEntry } from '../types'
const store = useLogStore()
function rowClass({ row }: { row: LogEntry }) {
  return row.matchedKeywords && row.matchedKeywords.length ? 'kw-hit-row' : ''
}
</script>
<style scoped>.panel{background:#1e293b;border-radius:8px;padding:12px;height:100%;border:1px solid #334155}.panel h4{color:#38bdf8;font-size:13px;margin-bottom:8px}.table-wrap{height:calc(100% - 30px);overflow:auto}.kw-tag{margin:1px 2px 1px 0}:deep(.kw-hit-row){background:#7f1d1d26 !important}</style>
