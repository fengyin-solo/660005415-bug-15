/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useLogStore } from '../store/log';
const store = useLogStore();
const chart = ref();
let inst = null;
function update() {
    if (!inst || !store.result)
        return;
    const ws = store.result.windows;
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const data = [];
    ws.forEach((w, i) => { levels.forEach((lv, j) => { data.push([i, j, w.levels[lv] || 0]); }); });
    inst.setOption({
        backgroundColor: 'transparent', grid: { left: 60, right: 15, top: 5, bottom: 25 },
        xAxis: { type: 'category', data: ws.map((_, i) => 'W' + i), axisLabel: { color: '#94a3b8', fontSize: 8 } },
        yAxis: { type: 'category', data: levels, axisLabel: { color: '#94a3b8', fontSize: 9 } },
        visualMap: { min: 0, max: Math.max(...data.map(d => d[2]), 1), inRange: { color: ['#1e293b', '#fef08a', '#ef4444'] }, calculable: false, show: false },
        series: [{ type: 'heatmap', data, label: { show: true, fontSize: 8, color: '#94a3b8' } }], animation: false
    });
}
onMounted(() => { if (chart.value) {
    inst = echarts.init(chart.value);
    update();
} });
watch(() => store.result, update);
onUnmounted(() => inst?.dispose());
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "chart",
    ...{ class: "chart" },
});
/** @type {typeof __VLS_ctx.chart} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            chart: chart,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
