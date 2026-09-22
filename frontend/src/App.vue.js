/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import LogTable from './components/LogTable.vue';
import RulePanel from './components/RulePanel.vue';
import AnomalyChart from './components/AnomalyChart.vue';
import AlertPanel from './components/AlertPanel.vue';
import TrendChart from './components/TrendChart.vue';
import HeatmapChart from './components/HeatmapChart.vue';
import { useLogStore } from './store/log';
const store = useLogStore();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-root" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "top-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar" },
});
const __VLS_0 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.store.logType),
    size: "small",
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.store.logType),
    size: "small",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
for (const [t] of __VLS_getVForSourceType((['nginx', 'apache', 'json_app', 'custom']))) {
    const __VLS_4 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (t),
        label: (t),
        value: (t),
    }));
    const __VLS_6 = __VLS_5({
        key: (t),
        label: (t),
        value: (t),
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
var __VLS_3;
const __VLS_8 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.store.searchQuery),
    placeholder: "搜索关键词...",
    size: "small",
    ...{ style: {} },
    clearable: true,
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.store.searchQuery),
    placeholder: "搜索关键词...",
    size: "small",
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_12 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    size: "small",
    loading: (__VLS_ctx.store.loading),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    size: "small",
    loading: (__VLS_ctx.store.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.generate();
    }
};
__VLS_15.slots.default;
var __VLS_15;
const __VLS_20 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    ...{ 'onClick': {} },
    size: "small",
    type: "warning",
    disabled: (!__VLS_ctx.store.result),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onClick': {} },
    size: "small",
    type: "warning",
    disabled: (!__VLS_ctx.store.result),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_24;
let __VLS_25;
let __VLS_26;
const __VLS_27 = {
    onClick: (...[$event]) => {
        __VLS_ctx.store.detect();
    }
};
__VLS_23.slots.default;
var __VLS_23;
/** @type {[typeof RulePanel, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(RulePanel, new RulePanel({}));
const __VLS_29 = __VLS_28({}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "main-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-col" },
});
/** @type {[typeof LogTable, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(LogTable, new LogTable({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "grid-col" },
});
/** @type {[typeof AnomalyChart, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(AnomalyChart, new AnomalyChart({}));
const __VLS_35 = __VLS_34({}, ...__VLS_functionalComponentArgsRest(__VLS_34));
/** @type {[typeof AlertPanel, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(AlertPanel, new AlertPanel({}));
const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "bottom-row" },
});
/** @type {[typeof TrendChart, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(TrendChart, new TrendChart({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
/** @type {[typeof HeatmapChart, ]} */ ;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent(HeatmapChart, new HeatmapChart({}));
const __VLS_44 = __VLS_43({}, ...__VLS_functionalComponentArgsRest(__VLS_43));
/** @type {__VLS_StyleScopedClasses['app-root']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['main-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-col']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-row']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            LogTable: LogTable,
            RulePanel: RulePanel,
            AnomalyChart: AnomalyChart,
            AlertPanel: AlertPanel,
            TrendChart: TrendChart,
            HeatmapChart: HeatmapChart,
            store: store,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
