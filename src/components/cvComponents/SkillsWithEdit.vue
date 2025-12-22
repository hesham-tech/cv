<template>
  <div class="skills-edit-wrapper" v-if="isEditMode || isEnabled">
    <!-- المحتوى الأصلي من Skills.vue -->
    <Skills />
    
    <!-- أزرار التحرير -->
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <!-- زر إضافة مهارة جديدة -->
        <div class="edit-btn-group add-skill-btn">
          <v-tooltip text="إضافة مهارة جديدة" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                color="success"
                icon
                size="large"
                elevation="8"
                @click="openAddDialog"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
        
        <!-- زر تعديل التنسيقات -->
        <div class="edit-btn-group style-btn-group">
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
        
        <!-- زر تفعيل/تعطيل القسم -->
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

        <!-- أزرار لكل مهارة -->
        <div
          v-for="(skill, index) in skills"
          :key="skill.id"
          class="skill-actions"
          :style="getSkillPosition(index)"
        >
          <EditActionButtons
            :has-style="false"
            :has-add="false"
            :has-delete="true"
            content-tooltip="تعديل المهارة"
            @edit-content="openEditDialog(skill)"
            @delete="confirmDelete(skill)"
          />
        </div>
      </div>
    </Transition>

    <!-- Dialog إضافة/تعديل مهارة -->
    <SkillContentDialog
      :show="showContentDialog"
      @update:show="showContentDialog = $event"
      :skill-data="selectedSkill"
      @saved="handleSaved"
    />
    
    <!-- Dialog تعديل التنسيقات -->
    <SkillsStyleDialog
      :show="showStyleDialog"
      @update:show="showStyleDialog = $event"
      :theme-data="userStore.userAll?.user?.theme?.skills || {}"
      @saved="handleSaved"
    />

    <!-- Dialog تأكيد الحذف -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 text-center">
          تأكيد الحذف
        </v-card-title>
        <v-card-text class="text-center">
          هل أنت متأكد من حذف المهارة <strong>{{ skillToDelete?.name?.ar }}</strong>؟
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showDeleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="deleteSkill">حذف</v-btn>
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
import Skills from './Skills.vue'
import EditActionButtons from '@/components/edit/EditActionButtons.vue'
import SkillContentDialog from '@/components/edit/SkillContentDialog.vue'
import SkillsStyleDialog from '@/components/edit/SkillsStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()

const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => userAuthId && userAuthId === userStore.userAll?.user?.id)

const skills = computed(() => userStore.userAll?.skills || [])

// حالة تفعيل القسم
const isEnabled = computed(() => {
  return userStore.userAll?.user?.theme?.skills?.enabled ?? true
})

const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedSkill = ref(null)
const skillToDelete = ref(null)
const toggleLoading = ref(false)
const deleteLoading = ref(false)

const openAddDialog = () => {
  selectedSkill.value = null
  showContentDialog.value = true
}

const openEditDialog = (skill) => {
  selectedSkill.value = skill
  showContentDialog.value = true
}

const confirmDelete = (skill) => {
  skillToDelete.value = skill
  showDeleteDialog.value = true
}

const deleteSkill = async () => {
  deleteLoading.value = true
  try {
    await deleteItem('skills', skillToDelete.value.id)
    
    // Update store by refetching
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    success('تم حذف المهارة بنجاح ✅')
    showDeleteDialog.value = false
    skillToDelete.value = null
  } catch (err) {
    console.error('Error deleting skill:', err)
    error('فشل حذف المهارة')
  } finally {
    deleteLoading.value = false
  }
}

const handleSaved = async () => {
  // Refetch data to get updated skills
  try {
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
  } catch (err) {
    console.error('Error refreshing skills:', err)
  }
}

// تبديل تفعيل/تعطيل القسم
const toggleSection = async () => {
  toggleLoading.value = true
  
  try {
    const payload = {
      skills: {
        ...userStore.userAll.user.theme.skills,
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

// حساب موقع أزرار كل مهارة بناءً على الـ index
const getSkillPosition = (index) => {
  const row = Math.floor(index / 3) // assuming 3 skills per row
  const col = index % 3
  
  return {
    top: `${120 + row * 150}px`,
    left: `${50 + col * 33}%`
  }
}
</script>

<style lang="scss" scoped>
.skills-edit-wrapper {
  position: relative;
  width: 100%;
}

.edit-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.edit-btn-group,
.skill-actions {
  position: absolute;
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
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }

  :deep(.v-btn) {
    min-width: 48px !important;
    width: 48px !important;
    height: 48px !important;
  }
}

.add-skill-btn {
  top: 20px;
  right: 20px;
  z-index: 101;
  
  :deep(.v-btn) {
    min-width: 56px !important;
    width: 56px !important;
    height: 56px !important;
  }
}

.style-btn-group {
  top: 20px;
  right: 90px;
}

.toggle-btn-group {
  top: 20px;
  right: 160px;
}

.skill-actions {
  transform-origin: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .add-skill-btn {
    top: 10px;
    right: 10px;
  }
}
</style>
