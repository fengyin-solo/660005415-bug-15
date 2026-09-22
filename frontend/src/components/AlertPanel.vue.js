/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed } from 'vue';
import { useLogStore } from '../store/log';
const store = useLogStore();
const alerts = computed(() => store.result?.alerts || []);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-row']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-row']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-row']} */ ;
/** @type {__VLS_StyleScopedClasses['a-sev']} */ ;
/** @type {__VLS_StyleScopedClasses['critical']} */ ;
/** @type {__VLS_StyleScopedClasses['a-sev']} */ ;
/** @type {__VLS_StyleScopedClasses['high']} */ ;
/** @type {__VLS_StyleScopedClasses['a-sev']} */ ;
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
if (!__VLS_ctx.alerts.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
}
for (const [a] of __VLS_getVForSourceType((__VLS_ctx.alerts.slice(0, 8)))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (a.id),
        ...{ class: "alert-row" },
        ...{ class: (a.severity) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "a-sev" },
        ...{ class: (a.severity) },
    });
    (a.severity.toUpperCase());
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "a-msg" },
    });
    (a.message);
}
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['alert-row']} */ ;
/** @type {__VLS_StyleScopedClasses['a-sev']} */ ;
/** @type {__VLS_StyleScopedClasses['a-msg']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            alerts: alerts,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
