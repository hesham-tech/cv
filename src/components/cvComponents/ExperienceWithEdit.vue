<template>
  <div class="experience-edit-wrapper" v-if="isEditMode || isEnabled">
    <Experience />
    
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <div class="edit-btn-group add-btn">
          <v-tooltip text="إضافة خبرة" location="top">
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

    <ExperienceContentDialog
      :show="showContentDialog"
      @update:show="showContentDialog = $event"
      :experienceData="selectedExp"
      @saved="handleSaved"
    />

    <ExperienceStyleDialog
      :show="showStyleDialog"
      @update:show="showStyleDialog = $event"
      @saved="handleSaved"
    />

    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center">تأكيد الحذف</v-card-title>
        <v-card-text class="text-center">هل أنت متأكد من حذف هذه الخبرة؟</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="deleteExperience">حذف</v-btn>
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
import Experience from './Experience.vue'
import ExperienceContentDialog from '@/components/edit/ExperienceContentDialog.vue'
import ExperienceStyleDialog from '@/components/edit/ExperienceStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()

const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)

const experiences = computed(() => userStore.userAll?.experiences || [])
const isEnabled = computed(() => userStore.userAll?.user?.theme?.experiences?.enabled ?? true)

const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedExp = ref(null)
const expToDelete = ref(null)
const toggleLoading = ref(false)
const deleteLoading = ref(false)

const openAddDialog = () => {
  selectedExp.value = null
  showContentDialog.value = true
}

const openEditDialog = (exp) => {
  selectedExp.value = exp
  showContentDialog.value = true
}

const confirmDelete = (exp) => {
  expToDelete.value = exp
  showDeleteDialog.value = true
}

const deleteExperience = async () => {
  deleteLoading.value = true
  try {
    await deleteItem('experiences', expToDelete.value.id)
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    success('تم حذف الخبرة بنجاح ✅')
    showDeleteDialog.value = false
  } catch (err) {
    error('فشل حذف الخبرة')
  } finally {
    deleteLoading.value = false
  }
}

const handleSaved = () => {}

const toggleSection = async () => {
  toggleLoading.value = true
  try {
    const payload = {
      experiences: {
        ...userStore.userAll.user.theme.experiences,
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
.experience-edit-wrapper { position: relative; }
.edit-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  pointer-events: none;
  z-index: 100;
  display: flex;
  gap: 10px;
}
.edit-btn-group {
  pointer-events: all;
  padding: 12px;
  background: rgba(102, 126, 234, 0.15) !important;
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  &:hover {
    background: rgba(102, 126, 234, 0.25) !important;
    transform: scale(1.08);
  }
  :deep(.v-btn) {
    min-width: 48px !important;
    width: 48px !important;
    height: 48px !important;
  }
}
.add-btn :deep(.v-btn) {
  min-width: 56px !important;
  width: 56px !important;
  height: 56px !important;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:global([dir="rtl"]) .edit-overlay {
  right: auto;
  left: 20px;
}
</style>
