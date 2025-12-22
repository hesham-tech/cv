<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="تنسيقات قسم المهارات"
    icon="mdi-palette"
    icon-color="secondary"
    :loading="loading"
    :has-reset="true"
    :reset-loading="resetLoading"
    @save="handleSave"
    @cancel="handleCancel"
    @reset="handleReset"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- تنسيقات عناوين الأقسام -->
        <v-col cols="12">
          <h3 class="mb-3">عنوان القسم</h3>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.sectionTitle_fontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.sectionTitle_textColor"
            label="لون النص"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.sectionTitle_backgroundColor"
            label="لون الخلفية"
          />
        </v-col>

        <!-- تنسيقات اسم المهارة -->
        <v-col cols="12" class="mt-4">
          <h3 class="mb-3">اسم المهارة</h3>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.mainTitle_fontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.mainTitle_textColor"
            label="لون النص"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.mainTitle_backgroundColor"
            label="لون الخلفية"
          />
        </v-col>
      </v-row>
    </template>
  </BaseEditDialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/user'
import BaseEditDialog from './BaseEditDialog.vue'
import ColorPickerField from './ColorPickerField.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  themeData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const resetLoading = ref(false)
const dialogRef = ref(null)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    const theme = props.themeData
    
    dialogRef.value.setFormData({
      sectionTitle_fontSize: theme.sectionTitle?.fontSize || '',
      sectionTitle_textColor: theme.sectionTitle?.textColor || '',
      sectionTitle_backgroundColor: theme.sectionTitle?.backgroundColor || '',
      
      mainTitle_fontSize: theme.mainTitle?.fontSize || '',
      mainTitle_textColor: theme.mainTitle?.textColor || '',
      mainTitle_backgroundColor: theme.mainTitle?.backgroundColor || ''
    })
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = {
      skills: {
        sectionTitle: {
          fontSize: formData.sectionTitle_fontSize,
          textColor: formData.sectionTitle_textColor,
          backgroundColor: formData.sectionTitle_backgroundColor
        },
        mainTitle: {
          fontSize: formData.mainTitle_fontSize,
          textColor: formData.mainTitle_textColor,
          backgroundColor: formData.mainTitle_backgroundColor
        }
      }
    }

    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    
    success('تم حفظ التنسيقات بنجاح ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving skills theme:', err)
    error('فشل حفظ التنسيقات')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  resetLoading.value = true

  try {
    const payload = {
      skills: null
    }

    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    
    success('تم الإرجاع للإعدادات الافتراضية ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error resetting skills theme:', err)
    error('فشل الإرجاع للافتراضي')
  } finally {
    resetLoading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
