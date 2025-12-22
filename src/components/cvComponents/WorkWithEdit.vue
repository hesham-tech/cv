<template>
  <div class="work-edit-wrapper" v-if="isEditMode || isEnabled">
    <Work />
    
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <div class="edit-btn-group add-btn">
          <v-tooltip text="إضافة مشروع" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" color="success" icon size="large" @click="openAddDialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <div class="edit-btn-group style-btn">
          <v-tooltip text="تعديل التنسيقات" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" icon color="secondary" @click="showStyleDialog = true">
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <div class="edit-btn-group toggle-btn">
          <v-tooltip :text="isEnabled ? 'إخفاء القسم' : 'إظهار القسم'" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" icon :color="isEnabled ? 'success' : 'error'" :loading="toggleLoading" @click="toggleSection">
                <v-icon>{{ isEnabled ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </Transition>

    <WorkContentDialog :show="showContentDialog" @update:show="showContentDialog = $event" :workData="selectedWork" @saved="handleSaved" />
    <WorkStyleDialog :show="showStyleDialog" @update:show="showStyleDialog = $event" @saved="handleSaved" />

    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center">تأكيد الحذف</v-card-title>
        <v-card-text class="text-center">هل أنت متأكد من حذف هذا المشروع؟</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="deleteWork">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useEditMode } from '@/composables/useEditMode'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/user'
import { deleteItem } from '@/Service/apiService'
import Work from './Work.vue'
import WorkContentDialog from '@/components/edit/WorkContentDialog.vue'
import WorkStyleDialog from '@/components/edit/WorkStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()

const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)

const works = computed(() => userStore.userAll?.projects || [])
const isEnabled = computed(() => userStore.userAll?.user?.theme?.work?.enabled ?? true)

const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedWork = ref(null)
const workToDelete = ref(null)
const toggleLoading = ref(false)
const deleteLoading = ref(false)

const openAddDialog = () => {
  selectedWork.value = null
  showContentDialog.value = true
}

const openEditDialog = (work) => {
  selectedWork.value = work
  showContentDialog.value = true
}

const confirmDelete = (work) => {
  workToDelete.value = work
  showDeleteDialog.value = true
}

const deleteWork = async () => {
  deleteLoading.value = true
  try {
    await deleteItem('projects', workToDelete.value.id)
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    success('تم حذف المشروع بنجاح ✅')
    showDeleteDialog.value = false
    workToDelete.value = null
  } catch (err) {
    error('فشل حذف المشروع')
  } finally {
    deleteLoading.value = false
  }
}

const handleSaved = () => {}

const toggleSection = async () => {
  toggleLoading.value = true
  try {
    const payload = {
      work: {
        ...userStore.userAll.user.theme.work,
        enabled: !isEnabled.value
      }
    }
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
.work-edit-wrapper { position: relative; }
.edit-overlay { position: absolute; top: 20px; right: 20px; pointer-events: none; z-index: 100; display: flex; gap: 10px; }
.edit-btn-group {
  pointer-events: all; padding: 12px; background: rgba(102, 126, 234, 0.15) !important; backdrop-filter: blur(12px); border-radius: 16px; border: 2px solid rgba(102, 126, 234, 0.3); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;
  &:hover { background: rgba(102, 126, 234, 0.25) !important; transform: scale(1.08); }
  :deep(.v-btn) { min-width: 48px !important; width: 48px !important; height: 48px !important; }
}
.add-btn :deep(.v-btn) { min-width: 56px !important; width: 56px !important; height: 56px !important; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:global([dir="rtl"]) .edit-overlay { right: auto; left: 20px; }
</style>
