<template>
  <div class="social-wrapper" v-if="isEditMode || isEnabled">
    <!-- عرض الروابط الموجودة -->
    <div class="socials-display">

      <!-- Website -->
      <div v-if="userStore.userAll.user.website" class="contact-item">
        <v-icon color="#667eea">mdi-web</v-icon>
        <span>{{ userStore.userAll.user.website }}</span>
      </div>

      <!-- Social Links -->
      <div class="social-links-list">
        <div
          v-for="social in socials" 
          :key="social.id"
          class="social-link-item"
          :class="{ 'edit-mode': isEditMode && isOwner }"
        >
          <a :href="social.url" target="_blank" class="social-link-content">
            <v-icon :color="social.icon.color" :icon="social.icon.icon" size="28"/>
            <span class="social-name">{{ getSocialName(social) }}</span>
          </a>
          
          <!-- أزرار التعديل تظهر فقط في edit mode -->
          <div v-if="isEditMode && isOwner" class="social-actions">
            <v-btn
              icon
              size="small"
              color="primary"
              variant="tonal"
              @click="openEditDialog(social)"
            >
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="error"
              variant="tonal"
              @click="confirmDelete(social)"
            >
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    
    <!-- أزرار التحكم في Edit Mode -->
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <!-- زر إضافة سوشيال -->
        <div class="edit-btn-group add-social-btn">
          <v-tooltip text="إضافة رابط سوشيال" location="top">
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
        
        <!-- زر التفعيل/التعطيل -->
        <div class="edit-btn-group toggle-btn-group">
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

    <!-- Dialog إضافة/تعديل -->
    <SocialContentDialog
      :show="showContentDialog"
      @update:show="showContentDialog = $event"
      :social-data="selectedSocial"
      @saved="handleSaved"
    />

    <!-- Dialog تأكيد الحذف -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center">تأكيد الحذف</v-card-title>
        <v-card-text class="text-center">
          هل أنت متأكد من حذف <strong>{{ socialToDelete?.name }}</strong>؟
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="deleteSocial">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { useEditMode } from '@/composables/useEditMode'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/user'
import { deleteItem } from '@/Service/apiService'
import SocialContentDialog from '@/components/edit/SocialContentDialog.vue'

const route = useRoute()
const lang = route.params.lang || 'ar'
const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()

const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)

const socials = computed(() => userStore.userAll?.socials || [])

const isEnabled = computed(() => {
  return userStore.userAll?.user?.theme?.socials?.enabled ?? true
})

const showContentDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedSocial = ref(null)
const socialToDelete = ref(null)
const toggleLoading = ref(false)
const deleteLoading = ref(false)

// Get social name in current language
const getSocialName = (social) => {
  try {
    const name = typeof social.name === 'string' ? JSON.parse(social.name) : social.name
    return lang === 'ar' ? name.ar : name.en
  } catch (e) {
    return social.name
  }
}

const openAddDialog = () => {
  selectedSocial.value = null
  showContentDialog.value = true
}

const openEditDialog = (social) => {
  selectedSocial.value = social
  showContentDialog.value = true
}

const confirmDelete = (social) => {
  socialToDelete.value = social
  showDeleteDialog.value = true
}

const deleteSocial = async () => {
  deleteLoading.value = true
  try {
    await deleteItem('socials', socialToDelete.value.id)
    
    // Refresh data
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    success('تم حذف الرابط بنجاح ✅')
    showDeleteDialog.value = false
    socialToDelete.value = null
  } catch (err) {
    console.error('Error deleting social:', err)
    error('فشل حذف الرابط')
  } finally {
    deleteLoading.value = false
  }
}

const handleSaved = async () => {
  console.log('Social link saved')
}

const toggleSection = async () => {
  toggleLoading.value = true
  
  try {
    const payload = {
      socials: {
        ...userStore.userAll.user.theme.socials,
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
.social-wrapper {
  position: relative;
  padding: 24px;
}

.socials-display {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  font-size: 15px;
}

.social-links-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.social-link-item {
  position: relative;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;

  &:not(.edit-mode) {
    padding: 0;
  }

  &.edit-mode {
    padding: 12px 90px 12px 12px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.4);
  }
}

.social-link-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  text-decoration: none;
  color: inherit;
}

.social-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.social-actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;
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

.add-social-btn {
  :deep(.v-btn) {
    min-width: 56px !important;
    width: 56px !important;
    height: 56px !important;
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

/* RTL Support */
:global([dir="rtl"]) {
  .social-link-item.edit-mode {
    padding: 12px 12px 12px 90px;
  }
  
  .social-actions {
    right: auto;
    left: 8px;
  }
  
  .edit-overlay {
    right: auto;
    left: 20px;
  }
}
</style>
