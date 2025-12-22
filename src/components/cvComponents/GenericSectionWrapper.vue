<template>
  <div class="section-edit-wrapper">
    <component :is="originalComponent" />
    
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <div class="edit-btn-group">
          <EditActionButtons
            :has-style="false"
            :has-add="true"
            :has-delete="false"
            content-tooltip="تعديل/إضافة"
            @edit-content="$emit('edit-content')"
            @add="$emit('add')"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEditMode } from '@/composables/useEditMode'
import { useUserStore } from '@/stores/user'
import EditActionButtons from '@/components/edit/EditActionButtons.vue'

const props = defineProps({
  originalComponent: {
    type: Object,
    required: true
  }
})

defineEmits(['edit-content', 'add'])

const { isEditMode } = useEditMode()
const userStore = useUserStore()

const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)
</script>

<style lang="scss" scoped>
.section-edit-wrapper {
  position: relative;
}

.edit-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.edit-btn-group {
  position: absolute;
  top: 20px;
  right: 20px;
  pointer-events: all;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
