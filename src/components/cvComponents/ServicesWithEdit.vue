<template>
  <div class="services-edit-wrapper" v-if="isEditMode || isEnabled">
    <Services />
    
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <div class="edit-btn-group add-btn">
          <v-tooltip text="إضافة خدمة" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" color="success" icon size="large" @click="openAddDialog"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
          </v-tooltip>
        </div>
        <div class="edit-btn-group style-btn">
          <v-tooltip text="تعديل التنسيقات" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" icon color="secondary" @click="showStyleDialog = true"><v-icon>mdi-palette</v-icon></v-btn>
            </template>
          </v-tooltip>
        </div>
        <div class="edit-btn-group toggle-btn">
          <v-tooltip :text="isEnabled ? 'إخفاء القسم' : 'إظهار القسم'" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn v-bind="tooltipProps" icon :color="isEnabled ? 'success' : 'error'" :loading="toggleLoading" @click="toggleSection"><v-icon>{{ isEnabled ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon></v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>
    </Transition>

    <!-- Edit/Delete buttons for each service -->
    <div v-if="isEditMode && isOwner" class="services-items-wrapper">
      <div v-for="(service, index) in services" :key="service.id" class="service-item-actions" :style="getItemPosition(index)">
        <v-btn icon size="small" color="primary" variant="tonal" @click="openEditDialog(service)">
          <v-icon size="18">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" color="error" variant="tonal" @click="confirmDelete(service)">
          <v-icon size="18">mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <ServicesContentDialog :show="showContentDialog" @update:show="showContentDialog = $event" :serviceData="selectedService" @saved="handleSaved" />
    <ServicesStyleDialog :show="showStyleDialog" @update:show="showStyleDialog = $event" @saved="handleSaved" />

    <!-- Delete Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center">تأكيد الحذف</v-card-title>
        <v-card-text class="text-center">هل أنت متأكد من حذف هذه الخدمة؟</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="deleteService">حذف</v-btn>
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
import Services from './Services.vue'
import ServicesContentDialog from '@/components/edit/ServicesContentDialog.vue'
import ServicesStyleDialog from '@/components/edit/ServicesStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()
const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)
const isEnabled = computed(() => userStore.userAll?.user?.theme?.services?.enabled ?? true)
const services = computed(() => userStore.userAll?.services || [])

const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedService = ref(null)
const serviceToDelete = ref(null)
const toggleLoading = ref(false)
const deleteLoading = ref(false)

const openAddDialog = () => { selectedService.value = null; showContentDialog.value = true }

const openEditDialog = (service) => {
  selectedService.value = service
  showContentDialog.value = true
}

const confirmDelete = (service) => {
  serviceToDelete.value = service
  showDeleteDialog.value = true
}

const deleteService = async () => {
  deleteLoading.value = true
  try {
    await deleteItem('services', serviceToDelete.value.id)
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    success('تم حذف الخدمة بنجاح ✅')
    showDeleteDialog.value = false
    serviceToDelete.value = null
  } catch (err) {
    error('فشل حذف الخدمة')
  } finally {
    deleteLoading.value = false
  }
}

const handleSaved = () => {}

const toggleSection = async () => {
  toggleLoading.value = true
  try {
    const payload = { services: { ...userStore.userAll.user.theme.services, enabled: !isEnabled.value } }
    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    success(isEnabled.value ? 'تم إظهار القسم ✅' : 'تم إخفاء القسم')
  } catch (err) {
    error('فشل تحديث حالة القسم')
  } finally {
    toggleLoading.value = false
  }
}

// Position buttons for each service card
const getItemPosition = (index) => {
  const row = Math.floor(index / 3) // 3 items per row
  const col = index % 3
  return {
    top: `${180 + (row * 380)}px`, // Adjust based on card height
    left: `${20 + (col * 33.33)}%` // Adjust based on grid columns
  }
}
</script>

<style lang="scss" scoped>
.services-edit-wrapper { position: relative; }
.edit-overlay { position: absolute; top: 20px; right: 20px; pointer-events: none; z-index: 100; display: flex; gap: 10px; }
.edit-btn-group {
  pointer-events: all; padding: 12px; background: rgba(102, 126, 234, 0.15) !important; backdrop-filter: blur(12px); border-radius: 16px; border: 2px solid rgba(102, 126, 234, 0.3); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); transition: all 0.3s ease;
  &:hover { background: rgba(102, 126, 234, 0.25) !important; transform: scale(1.08); }
  :deep(.v-btn) { min-width: 48px !important; width: 48px !important; height: 48px !important; }
}
.add-btn :deep(.v-btn) { min-width: 56px !important; width: 56px !important; height: 56px !important; }

.services-items-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 50;
}

.service-item-actions {
  position: absolute;
  display: flex;
  gap: 8px;
  pointer-events: all;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
}

.services-edit-wrapper:hover .service-item-actions {
  opacity: 1;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
:global([dir="rtl"]) .edit-overlay { right: auto; left: 20px; }
</style>
