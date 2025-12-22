/**
 * Composable لإدارة Toast Notifications
 */
import { ref } from 'vue'

const toastState = ref({
    show: false,
    message: '',
    type: 'success',
    duration: 3000
})

export function useToast() {
    /**
     * عرض toast notification
     */
    const showToast = (message, type = 'success', duration = 3000) => {
        toastState.value = {
            show: true,
            message,
            type,
            duration
        }
    }

    /**
     * إخفاء toast
     */
    const hideToast = () => {
        toastState.value.show = false
    }

    /**
     * Toast للنجاح
     */
    const success = (message, duration = 3000) => {
        showToast(message, 'success', duration)
    }

    /**
     * Toast للخطأ
     */
    const error = (message, duration = 4000) => {
        showToast(message, 'error', duration)
    }

    /**
     * Toast للتحذير
     */
    const warning = (message, duration = 3500) => {
        showToast(message, 'warning', duration)
    }

    /**
     * Toast للمعلومات
     */
    const info = (message, duration = 3000) => {
        showToast(message, 'info', duration)
    }

    return {
        toastState,
        showToast,
        hideToast,
        success,
        error,
        warning,
        info
    }
}
