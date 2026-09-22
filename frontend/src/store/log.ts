import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import axios from 'axios'
import type { AnalysisResult, AlertRule } from '@/types'

const LS_RULES = 'lad.rules'
const LS_KEYWORDS = 'lad.keywords'
const LS_RESULT = 'lad.result'

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

const defaultRules: AlertRule[] = [
  { id:1, name:'高频ERROR', type:'level', threshold:5, enabled:true },
  { id:2, name:'异常流量', type:'count', threshold:200, enabled:false },
  { id:3, name:'关键词命中', type:'keyword', threshold:1, enabled:true }
]

export const useLogStore = defineStore('log', () => {
  const result = ref<AnalysisResult | null>(loadJSON<AnalysisResult | null>(LS_RESULT, null))
  const loading = ref(false)
  const searchQuery = ref('')
  const logType = ref('nginx')
  const rules = ref<AlertRule[]>(loadJSON<AlertRule[]>(LS_RULES, defaultRules))
  // 条数类判定与关键词命中共用的同一份词表
  const keywords = ref<string>(loadJSON<string>(LS_KEYWORDS, 'timeout,ERROR,OOM'))
  // 词表异常说明（后端返回的 EMPTY_KEYWORDS 等错误）
  const detectError = ref<{ code: string; message: string } | null>(null)

  // 勾选状态、词表、检测结果持久化，刷新页面后不丢
  watch(rules, v => localStorage.setItem(LS_RULES, JSON.stringify(v)), { deep: true })
  watch(keywords, v => localStorage.setItem(LS_KEYWORDS, JSON.stringify(v)))
  watch(result, v => localStorage.setItem(LS_RESULT, JSON.stringify(v)), { deep: true })

  async function generate() {
    loading.value=true
    detectError.value = null
    try {
      const {data} = await axios.post('/api/generate',{type:logType.value,count:1000})
      result.value=data
    } finally { loading.value=false }
  }

  async function detect() {
    if (!result.value) return
    loading.value=true
    detectError.value = null
    try {
      const {data} = await axios.post('/api/detect',{
        logs:result.value.logs,
        rules:rules.value.filter(r=>r.enabled),
        query:searchQuery.value,
        keywords
      })
      result.value=data
    } catch (e: any) {
      const detail = e?.response?.data?.detail
      detectError.value = typeof detail === 'object' && detail !== null
        ? { code: detail.code || 'DETECT_FAILED', message: detail.message || '检测失败，请重试' }
        : { code: 'DETECT_FAILED', message: typeof detail === 'string' ? detail : '检测失败，请重试' }
    } finally { loading.value=false }
  }

  return { result, loading, searchQuery, logType, rules, keywords, detectError, generate, detect }
})
