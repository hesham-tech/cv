<template>
  <Transition name="slide-fade">
    <div v-if="show" class="edit-mode-toggle" :class="{ 'is-rtl': isRtl }">
      <v-btn
        :color="isEditMode ? 'primary' : 'grey-darken-1'"
        @click="toggleEditMode"
        class="toggle-btn"
        elevation="8"
        size="large"
      >
        <v-icon :icon="modeIcon" class="me-2"></v-icon>
        <span class="toggle-text">{{ modeText }}</span>
      </v-btn>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEditMode } from '@/composables/useEditMode'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()
const { isEditMode, toggleEditMode, modeText, modeIcon } = useEditMode()

// تحديد اتجاه اللغة
const isRtl = computed(() => route.params.lang === 'ar')
</script>

<style lang="scss" scoped>
.edit-mode-toggle {
  position: fixed;
  top: 20px;
  z-index: 10002;
  
  &:not(.is-rtl) {
    left: 20px;
  }
  
  &.is-rtl {
    right: 20px;
  }
}

.toggle-btn {
  /* تصميم أكثر وضوحاً */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  padding: 16px 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* النص أبيض دائماً */
  color: white !important;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 16px 48px rgba(102, 126, 234, 0.6) !important;
    border-color: rgba(255, 255, 255, 0.8);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  :deep(.v-icon) {
    color: white !important;
  }
}

.toggle-text {
  font-size: 16px;
  white-space: nowrap;
  color: white !important;
  font-weight: 700;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-mode-toggle {
    top: 10px;
    
    &:not(.is-rtl) {
      left: 10px;
    }
    
    &.is-rtl {
      right: 10px;
    }
  }

  .toggle-btn {
    padding: 12px 20px;
    min-width: auto;
  }

  .toggle-text {
    font-size: 14px;
  }
}
</style>
