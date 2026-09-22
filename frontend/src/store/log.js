import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import axios from 'axios';
const RULES_KEY = 'lad:rules';
const RESULT_KEY = 'lad:result';
const DEFAULT_RULES = [
    { id: 1, name: '高频ERROR', type: 'level', threshold: 5, enabled: true },
    { id: 2, name: '异常流量', type: 'count', threshold: 200, enabled: false },
    { id: 3, name: '关键词命中', type: 'keyword', threshold: 0, enabled: false, keywords: ['timeout', 'OOM', '异常'] }
];
function loadRules() {
    try {
        const saved = JSON.parse(localStorage.getItem(RULES_KEY) || 'null');
        if (!Array.isArray(saved) || !saved.length)
            return DEFAULT_RULES.map(r => ({ ...r }));
        // Merge by id so newly introduced defaults are kept while saved state wins
        return DEFAULT_RULES.map(def => {
            const hit = saved.find(r => r && r.id === def.id);
            return hit ? { ...def, ...hit } : { ...def };
        });
    }
    catch {
        return DEFAULT_RULES.map(r => ({ ...r }));
    }
}
function loadResult() {
    try {
        const saved = JSON.parse(localStorage.getItem(RESULT_KEY) || 'null');
        return saved && Array.isArray(saved.logs) ? saved : null;
    }
    catch {
        return null;
    }
}
export const useLogStore = defineStore('log', () => {
    const result = ref(loadResult());
    const loading = ref(false);
    const searchQuery = ref('');
    const logType = ref('nginx');
    const rules = ref(loadRules());
    watch(rules, (val) => {
        localStorage.setItem(RULES_KEY, JSON.stringify(val));
    }, { deep: true });
    watch(result, (val) => {
        if (val)
            localStorage.setItem(RESULT_KEY, JSON.stringify(val));
    }, { deep: true });
    async function generate() {
        loading.value = true;
        try {
            const { data } = await axios.post('/api/generate', { type: logType.value, count: 1000 });
            result.value = data;
        }
        finally {
            loading.value = false;
        }
    }
    async function detect() {
        if (!result.value)
            return;
        loading.value = true;
        try {
            const { data } = await axios.post('/api/detect', {
                logs: result.value.logs,
                rules: rules.value.filter(r => r.enabled),
                query: searchQuery.value
            });
            result.value = data;
        }
        finally {
            loading.value = false;
        }
    }
    return { result, loading, searchQuery, logType, rules, generate, detect };
});
