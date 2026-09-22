/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { reactive } from 'vue';
import { useLogStore } from '../store/log';
const store = useLogStore();
const kwDrafts = reactive({});
function syncFromRule(rule) {
    kwDrafts[rule.id] = (rule.keywords || []).join('\n');
}
function saveKeywords(rule) {
    const raw = kwDrafts[rule.id] ?? '';
    const list = raw.split(/[\n,，;；、]+/).map(s => s.trim()).filter(Boolean);
    rule.keywords = [...new Set(list)];
    kwDrafts[rule.id] = rule.keywords.join('\n');
}
// Pre-fill the textarea draft the first time a rule is rendered
for (const r of store.rules) {
    if (r.type === 'keyword')
        syncFromRule(r);
}
function hitSummary(ruleId) {
    const hits = (store.result?.keywordHits || []).filter(h => h.ruleId === ruleId);
    if (!hits.length)
        return null;
    return {
        windows: hits.length,
        count: hits.reduce((sum, h) => sum + h.count, 0)
    };
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-bar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "bar-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rule-list" },
});
for (const [rule] of __VLS_getVForSourceType((__VLS_ctx.store.rules))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (rule.id),
        ...{ class: "rule-item" },
    });
    const __VLS_0 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        modelValue: (rule.enabled),
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (rule.enabled),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    (rule.name);
    var __VLS_3;
    const __VLS_4 = {}.ElInputNumber;
    /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        modelValue: (rule.threshold),
        min: (0),
        max: (9999),
        size: "small",
        controlsPosition: "right",
        ...{ style: {} },
    }));
    const __VLS_6 = __VLS_5({
        modelValue: (rule.threshold),
        min: (0),
        max: (9999),
        size: "small",
        controlsPosition: "right",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "th-unit" },
    });
    (rule.type === 'keyword' ? '命中条数>' : '阈值>');
    if (rule.type === 'keyword') {
        const __VLS_8 = {}.ElPopover;
        /** @type {[typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, typeof __VLS_components.ElPopover, typeof __VLS_components.elPopover, ]} */ ;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
            placement: "bottom",
            width: (320),
            trigger: "click",
        }));
        const __VLS_10 = __VLS_9({
            placement: "bottom",
            width: (320),
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        __VLS_11.slots.default;
        {
            const { reference: __VLS_thisSlot } = __VLS_11.slots;
            const __VLS_12 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
                size: "small",
                text: true,
                type: "primary",
            }));
            const __VLS_14 = __VLS_13({
                size: "small",
                text: true,
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            __VLS_15.slots.default;
            ((rule.keywords || []).length);
            var __VLS_15;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "kw-editor" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "kw-tip" },
        });
        const __VLS_16 = {}.ElInput;
        /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            modelValue: (__VLS_ctx.kwDrafts[rule.id]),
            type: "textarea",
            rows: (5),
            autosize: ({ minRows: 4, maxRows: 10 }),
            placeholder: "例如：&#10;timeout&#10;OOM&#10;连接超时",
        }));
        const __VLS_18 = __VLS_17({
            modelValue: (__VLS_ctx.kwDrafts[rule.id]),
            type: "textarea",
            rows: (5),
            autosize: ({ minRows: 4, maxRows: 10 }),
            placeholder: "例如：&#10;timeout&#10;OOM&#10;连接超时",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "kw-actions" },
        });
        const __VLS_20 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_22 = __VLS_21({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        let __VLS_24;
        let __VLS_25;
        let __VLS_26;
        const __VLS_27 = {
            onClick: (...[$event]) => {
                if (!(rule.type === 'keyword'))
                    return;
                __VLS_ctx.syncFromRule(rule);
            }
        };
        __VLS_23.slots.default;
        var __VLS_23;
        const __VLS_28 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
        }));
        const __VLS_30 = __VLS_29({
            ...{ 'onClick': {} },
            size: "small",
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        let __VLS_32;
        let __VLS_33;
        let __VLS_34;
        const __VLS_35 = {
            onClick: (...[$event]) => {
                if (!(rule.type === 'keyword'))
                    return;
                __VLS_ctx.saveKeywords(rule);
            }
        };
        __VLS_31.slots.default;
        var __VLS_31;
        var __VLS_11;
    }
    if (__VLS_ctx.hitSummary(rule.id)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "hit-badge" },
        });
        (__VLS_ctx.hitSummary(rule.id).count);
        (__VLS_ctx.hitSummary(rule.id).windows);
    }
}
for (const [err] of __VLS_getVForSourceType((__VLS_ctx.store.result?.errors || []))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (err.code + err.ruleId),
        ...{ class: "rule-error" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (err.message);
    const __VLS_36 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        loading: (__VLS_ctx.store.loading),
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        size: "small",
        type: "danger",
        plain: true,
        loading: (__VLS_ctx.store.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_40;
    let __VLS_41;
    let __VLS_42;
    const __VLS_43 = {
        onClick: (...[$event]) => {
            __VLS_ctx.store.detect();
        }
    };
    __VLS_39.slots.default;
    var __VLS_39;
}
/** @type {__VLS_StyleScopedClasses['rule-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['bar-title']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-list']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-item']} */ ;
/** @type {__VLS_StyleScopedClasses['th-unit']} */ ;
/** @type {__VLS_StyleScopedClasses['kw-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['kw-tip']} */ ;
/** @type {__VLS_StyleScopedClasses['kw-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['hit-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['rule-error']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            kwDrafts: kwDrafts,
            syncFromRule: syncFromRule,
            saveKeywords: saveKeywords,
            hitSummary: hitSummary,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
