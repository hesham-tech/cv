<template>
  <div class="blog-edit-wrapper" v-if="isEditMode || isEnabled">
    <Blog />
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <div class="edit-btn-group add-btn"><v-tooltip text="إضافة مقال" location="top"><template #activator="{ props: tooltipProps }"><v-btn v-bind="tooltipProps" color="success" icon size="large" @click="openAddDialog"><v-icon>mdi-plus</v-icon></v-btn></template></v-tooltip></div>
        <div class="edit-btn-group style-btn"><v-tooltip text="تعديل التنسيقات" location="top"><template #activator="{ props: tooltipProps }"><v-btn v-bind="tooltipProps" icon color="secondary" @click="showStyleDialog = true"><v-icon>mdi-palette</v-icon></v-btn></template></v-tooltip></div>
        <div class="edit-btn-group toggle-btn"><v-tooltip :text="isEnabled ? 'إخفاء القسم' : 'إظهار القسم'" location="top"><template #activator="{ props: tooltipProps }"><v-btn v-bind="tooltipProps" icon :color="isEnabled ? 'success' : 'error'" :loading="toggleLoading" @click="toggleSection"><v-icon>{{ isEnabled ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon></v-btn></template></v-tooltip></div>
      </div>
    </Transition>
    <BlogContentDialog :show="showContentDialog" @update:show="showContentDialog = $event" :blogData="selectedBlog" @saved="handleSaved" />
    <BlogStyleDialog :show="showStyleDialog" @update:show="showStyleDialog = $event" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useEditMode } from '@/composables/useEditMode'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/user'
import Blog from './Blog.vue'
import BlogContentDialog from '@/components/edit/BlogContentDialog.vue'
import BlogStyleDialog from '@/components/edit/BlogStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()
const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)
const isEnabled = computed(() => userStore.userAll?.user?.theme?.blog?.enabled ?? true)
const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const selectedBlog = ref(null)
const toggleLoading = ref(false)

const openAddDialog = () => { selectedBlog.value = null; showContentDialog.value = true }
const handleSaved = () => {}
const toggleSection = async () => {
  toggleLoading.value = true
  try {
    const payload = { blog: { ...userStore.userAll.user.theme.blog, enabled: !isEnabled.value } }
    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    success(isEnabled.value ? 'تم إظهار القسم ✅' : 'تم إخفاء القسم')
  } catch (err) {
    error('فشل تحديث حالة القسم')
  } finally {
    toggleLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.blog-edit-wrapper { position: relative; }
.edit-overlay { position: absolute; top: 20px; right: 20px; pointer-events: none; z-index: 100; display: flex; gap: 10px; }
.edit-btn-group { pointer-events: all; padding: 12px; background: rgba(102, 126, 234, 0.15) !important; backdrop-filter: blur(12px); border-radius: 16px; border: 2px solid rgba(102, 126, 234, 0.3); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); transition: all 0.3s ease; &:hover { background: rgba(102, 126, 234, 0.25) !important; transform: scale(1.08); } :deep(.v-btn) { min-width: 48px !important; width: 48px !important; height: 48px !important; } }
.add-btn :deep(.v-btn) { min-width: 56px !important; width: 56px !important; height: 56px !important; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:global([dir="rtl"]) .edit-overlay { right: auto; left: 20px; }
</style>
