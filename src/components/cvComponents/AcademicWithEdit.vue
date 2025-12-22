<template>
  <div class="academic-edit-wrapper" v-if="isEditMode || isEnabled">
    <Academic />
    
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <!-- Add New Button -->
        <div class="edit-btn-group add-btn">
          <v-tooltip text="إضافة شهادة أكاديمية" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                color="success"
                icon
                size="large"
                @click="openAddDialog"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <!-- Style Button -->
        <div class="edit-btn-group style-btn">
          <v-tooltip text="تعديل التنسيقات" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                icon
                color="secondary"
                @click="showStyleDialog = true"
              >
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <!-- Toggle Button -->
        <div class="edit-btn-group toggle-btn">
          <v-tooltip :text="isEnabled ? 'إخفاء القسم' : 'إظهار القسم'" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                icon
                :color="isEnabled ? 'success' : 'error'"
                :loading="toggleLoading"
                @click="toggleSection"
              >
                <v-icon>{{ isEnabled ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </Transition>

    <!-- Individual Academic Item Edit/Delete Buttons -->
    <div v-if="isEditMode && isOwner" v-for="(academic, index) in academics" :key="academic.id" class="academic-item-actions">
      <v-btn
        icon
        size="small"
        color="primary"
        variant="tonal"
        @click="openEditDialog(academic)"
      >
        <v-icon size="18">mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        icon
        size="small"
        color="error"
        variant="tonal"
        @click="confirmDelete(academic)"
      >
        <v-icon size="18">mdi-delete</v-icon>
      </v-btn>
    </div>

    <!-- Content Dialog -->
    <AcademicContentDialog
      :show="showContentDialog"
      @update:show="showContentDialog = $event"
      :academicData="selectedAcademic"
      @saved="handleSaved"
    />

    <!-- Style Dialog -->
    <AcademicStyleDialog
      :show="showStyleDialog"
      @update:show="showStyleDialog = $event"
      @saved="handleSaved"
    />

    <!-- Delete Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center">تأكيد الحذف</v-card-title>
        <v-card-text class="text-center">
          هل أنت متأكد من حذف هذه الشهادة؟
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="deleteAcademic">حذف</v-btn>
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
import Academic from './Academic.vue'
import AcademicContentDialog from '@/components/edit/AcademicContentDialog.vue'
import AcademicStyleDialog from '@/components/edit/AcademicStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()

const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)

const academics = computed(() => userStore.userAll?.academics || [])

const isEnabled = computed(() => {
  return userStore.userAll?.user?.theme?.academics?.enabled ?? true
})

const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedAcademic = ref(null)
const academicToDelete = ref(null)
const toggleLoading = ref(false)
const deleteLoading = ref(false)

const openAddDialog = () => {
  selectedAcademic.value = null
  showContentDialog.value = true
}

const openEditDialog = (academic) => {
  selectedAcademic.value = academic
  showContentDialog.value = true
}

const confirmDelete = (academic) => {
  academicToDelete.value = academic
  showDeleteDialog.value = true
}

const deleteAcademic = async () => {
  deleteLoading.value = true
  try {
    await deleteItem('academics', academicToDelete.value.id)
    
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    success('تم حذف الشهادة بنجاح ✅')
    showDeleteDialog.value = false
    academicToDelete.value = null
  } catch (err) {
    console.error('Error deleting academic:', err)
    error('فشل حذف الشهادة')
  } finally {
    deleteLoading.value = false
  }
}

const handleSaved = () => {
  console.log('Academic saved')
}

const toggleSection = async () => {
  toggleLoading.value = true
  
  try {
    const payload = {
      academics: {
        ...userStore.userAll.user.theme.academics,
        enabled: !isEnabled.value
      }
    }
    
    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    
    success(isEnabled.value ? 'تم إظهار القسم ✅' : 'تم إخفاء القسم')
  } catch (err) {
    console.error('Error toggling section:', err)
    error('فشل تحديث حالة القسم')
  } finally {
    toggleLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.academic-edit-wrapper {
  position: relative;
}

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

.add-btn {
  :deep(.v-btn) {
    min-width: 56px !important;
    width: 56px !important;
    height: 56px !important;
  }
}

.academic-item-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  z-index: 50;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RTL Support */
:global([dir="rtl"]) {
  .edit-overlay {
    right: auto;
    left: 20px;
  }
  
  .academic-item-actions {
    left: auto;
    right: 10px;
  }
}
</style>
