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
    const anoms = store.result.anomalies;
    inst.setOption({
        backgroundColor: 'transparent', grid: { left: 40, right: 15, top: 10, bottom: 25 },
        xAxis: { type: 'category', data: anoms.map(a => 'W' + a.windowIndex), axisLabel: { color: '#94a3b8', fontSize: 9 } },
        yAxis: { type: 'value', axisLabel: { color: '#94a3b8' } },
        series: [
            { type: 'line', data: anoms.map(a => a.sigmaScore), name: '3-sigma', itemStyle: { color: '#f97316' }, lineStyle: { width: 1.5 } },
            { type: 'line', data: anoms.map(a => a.iqrScore), name: 'IQR', itemStyle: { color: '#a78bfa' }, lineStyle: { width: 1.5 } }
        ], animation: false, legend: { right: 0, textStyle: { color: '#94a3b8', fontSize: 10 } }
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
