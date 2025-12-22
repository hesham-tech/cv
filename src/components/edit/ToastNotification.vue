<template>
  <Teleport to="body">
    <Transition name="toast-slide">
      <div
        v-if="show"
        class="toast-notification"
        :class="[`toast-${type}`, { 'toast-rtl': isRtl }]"
        role="alert"
      >
        <div class="toast-icon">
          <v-icon :icon="icon" :color="iconColor" size="24"></v-icon>
        </div>
        <div class="toast-content">
          <p class="toast-message">{{ message }}</p>
        </div>
        <button class="toast-close" @click="close" aria-label="إغلاق">
          <v-icon icon="mdi-close" size="18"></v-icon>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // 3 ثوان
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const route = useRoute()
const isRtl = computed(() => route.params.lang === 'ar')

// تحديد الأيقونة حسب النوع
const icon = computed(() => {
  const icons = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information'
  }
  return icons[props.type]
})

// تحديد لون الأيقونة
const iconColor = computed(() => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return colors[props.type]
})

let timeout = null

// إغلاق تلقائي بعد المدة المحددة
watch(() => props.show, (newValue) => {
  if (newValue) {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

const close = () => {
  if (timeout) clearTimeout(timeout)
  emit('close')
}
</script>

<style lang="scss" scoped>
.toast-notification {
  position: fixed;
  top: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 10003; // أعلى من كل شيء
  border-left: 4px solid;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:not(.toast-rtl) {
    right: 20px;
  }

  &.toast-rtl {
    left: 20px;
    border-left: none;
    border-right: 4px solid;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

/* ألوان حسب النوع */
.toast-success {
  border-color: #4caf50;
}

.toast-error {
  border-color: #f44336;
}

.toast-warning {
  border-color: #ff9800;
}

.toast-info {
  border-color: #2196f3;
}

.toast-icon {
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-message {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.5;
}

.toast-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #333;
  }

  &:active {
    transform: scale(0.95);
  }
}

/* Animations */
.toast-slide-enter-active {
  animation: toast-slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-slide-leave-active {
  animation: toast-slide-out 0.25s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes toast-slide-in {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .toast-notification {
    min-width: auto;
    max-width: calc(100% - 40px);
    left: 20px !important;
    right: 20px !important;
    top: 70px;
  }
}
</style>
