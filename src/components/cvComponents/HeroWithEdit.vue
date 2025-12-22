<template>
  <div class="hero-edit-wrapper" v-if="isEditMode || isEnabled">
    <!-- المحتوى الأصلي من Hero.vue بدون أي تغيير -->
    <Hero />
    
    <!-- أزرار التحرير - تظهر فقط في Edit Mode -->
    <Transition name="fade">
      <div v-if="isEditMode && isOwner" class="edit-overlay">
        <!-- زر تعديل البيانات الأساسية (الاسم، الوظيفة، النبذة) -->
        <div class="edit-btn-group name-group">
          <EditActionButtons
            contentTooltip="تعديل البيانات الأساسية"
            :has-style="false"
            @edit-content="showContentDialog = true"
          />
        </div>

        <!-- زر تعديل التنسيقات -->
        <div class="edit-btn-group style-group">
          <v-tooltip text="تعديل التنسيقات" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                icon
                color="secondary"
                class="style-btn"
                @click="showStyleDialog = true"
              >
                <v-icon>mdi-palette</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
        
        <!-- زر تفعيل/تعطيل القسم -->
        <div class="edit-btn-group toggle-group">
          <v-tooltip :text="isEnabled ? 'إخفاء القسم' : 'إظهار القسم'" location="top">
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="tooltipProps"
                icon
                :color="isEnabled ? 'success' : 'error'"
                class="toggle-btn"
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

    <!-- Dialog تعديل المحتوى -->
    <HeroContentDialog
      :show="showContentDialog"
      @update:show="showContentDialog = $event"
      :user-data="userStore.user"
      @saved="handleSaved"
    />

    <!-- Dialog تعديل التنسيقات -->
    <HeroStyleDialog
      :show="showStyleDialog"
      @update:show="showStyleDialog = $event"
      :theme-data="userStore.user.theme?.hero || {}"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useEditMode } from '@/composables/useEditMode'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/user'
import Hero from './Hero.vue'
import EditActionButtons from '@/components/edit/EditActionButtons.vue'
import HeroContentDialog from '@/components/edit/HeroContentDialog.vue'
import HeroStyleDialog from '@/components/edit/HeroStyleDialog.vue'

const { isEditMode } = useEditMode()
const { success, error } = useToast()
const userStore = useUserStore()

// التحقق من أن المستخدم الحالي هو صاحب السيرة الذاتية
const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false
const isOwner = computed(() => {
  return userAuthId && userAuthId === userStore.userAll?.user?.id
})

// حالة تفعيل القسم
const isEnabled = computed(() => {
  return userStore.userAll?.user?.theme?.hero?.enabled ?? true
})

const showContentDialog = ref(false)
const showStyleDialog = ref(false)
const toggleLoading = ref(false)

const handleSaved = () => {
  console.log('Hero data saved successfully')
}

// تبديل تفعيل/تعطيل القسم
const toggleSection = async () => {
  toggleLoading.value = true
  
  try {
    const payload = {
      hero: {
        ...userStore.userAll.user.theme.hero,
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
.hero-edit-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.edit-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 100;
}

.edit-btn-group {
  position: absolute;
  pointer-events: all;
  
  /* Glassmorphism container - أكثر وضوحاً */
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

  /* الأزرار داخل المجموعة */
  :deep(.v-btn) {
    min-width: 48px !important;
    width: 48px !important;
    height: 48px !important;
  }
}

/* زر التنسيقات */
.style-btn {
  background: rgba(156, 39, 176, 0.15) !important;
  
  &:hover {
    background: rgba(156, 39, 176, 0.25) !important;
  }
}

/* مواقع الأزرار */
.name-group {
  top: 180px;
  right: 40px;
}

.style-group {
  top: 240px;
  right: 40px;
}

.toggle-group {
  top: 300px;
  right: 40px;
}

/* زر التبديل */
.toggle-btn {
  background: rgba(76, 175, 80, 0.15) !important;
  
  &:hover {
    background: rgba(76, 175, 80, 0.25) !important;
  }
  
  &[color="error"] {
    background: rgba(244, 67, 54, 0.15) !important;
    
    &:hover {
      background: rgba(244, 67, 54, 0.25) !important;
    }
  }
}

/* RTL Support */
:global([dir="rtl"]) {
  .name-group,
  .style-group {
    right: auto;
    left: 40px;
  }
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .name-group {
    top: 120px;
    right: 20px;
  }

  .style-group {
    top: 170px;
    right: 20px;
  }

  :global([dir="rtl"]) {
    .name-group,
    .style-group {
      right: auto;
      left: 20px;
    }
  }

  .edit-btn-group {
    padding: 6px;
  }
}
</style>
