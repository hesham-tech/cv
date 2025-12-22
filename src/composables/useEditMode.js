/**
 * Composable لإدارة حالة وضع التحرير
 * يستخدم عبر التطبيق للتحكم في إظهار/إخفاء أزرار التحرير
 */
import { ref, computed } from 'vue'

// حالة عامة مشتركة عبر كل التطبيق
const isEditMode = ref(false)

export function useEditMode() {
    /**
     * تبديل وضع التحرير
     */
    const toggleEditMode = () => {
        isEditMode.value = !isEditMode.value
    }

    /**
     * تفعيل وضع التحرير
     */
    const enableEditMode = () => {
        isEditMode.value = true
    }

    /**
     * تعطيل وضع التحرير
     */
    const disableEditMode = () => {
        isEditMode.value = false
    }

    /**
     * نص الزر حسب الحالة
     */
    const modeText = computed(() => {
        return isEditMode.value ? 'وضع التحرير' : 'وضع المعاينة'
    })

    /**
     * أيقونة الزر حسب الحالة
     */
    const modeIcon = computed(() => {
        return isEditMode.value ? 'mdi-pencil' : 'mdi-eye'
    })

    return {
        isEditMode,
        toggleEditMode,
        enableEditMode,
        disableEditMode,
        modeText,
        modeIcon
    }
}
