<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="تعديل تنسيقات قسم التعليم"
    icon="mdi-palette"
    icon-color="secondary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
    @reset="handleReset"
    :show-reset="true"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- عنوان القسم -->
        <v-col cols="12">
          <h3 class="text-h6 mb-4">عنوان القسم</h3>
          <v-text-field
            v-model="formData.titleFontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
          <ColorPickerField
            v-model="formData.titleColor"
            label="لون العنوان"
            :original-color="originalTheme?.title?.color"
          />
        </v-col>

        <v-divider class="my-4" />

        <!-- النص الأساسي -->
        <v-col cols="12">
          <h3 class="text-h6 mb-4">النص الأساسي</h3>
          <v-text-field
            v-model="formData.textFontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
          <ColorPickerField
            v-model="formData.textColor"
            label="لون النص"
            :original-color="originalTheme?.text?.color"
          />
        </v-col>
      </v-row>
    </template>
  </BaseEditDialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/user'
import BaseEditDialog from './BaseEditDialog.vue'
import ColorPickerField from './ColorPickerField.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)

const originalTheme = computed(() => userStore.userAll?.user?.theme?.academics)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    const theme = originalTheme.value || {}
    dialogRef.value.setFormData({
      titleFontSize: theme.title?.fontSize || 32,
      titleColor: theme.title?.color || '#333333',
      textFontSize: theme.text?.fontSize || 16,
      textColor: theme.text?.color || '#666666'
    })
  }
})

const handleSave = async (formData) => {
  loading.value = true
  
  try {
    const payload = {
      academics: {
        ...originalTheme.value,
        title: {
          fontSize: formData.titleFontSize,
          color: formData.titleColor
        },
        text: {
          fontSize: formData.textFontSize,
          color: formData.textColor
        }
      }
    }
    
    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    
    success('تم تحديث التنسيقات بنجاح ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving theme:', err)
    error('فشل حفظ التنسيقات')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  loading.value = true
  
  try {
    const payload = {
      academics: {
        ...originalTheme.value,
        title: null,
        text: null
      }
    }
    
    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    await userStore.fetchUser()
    
    success('تم إرجاع التنسيقات للافتراضي ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error resetting theme:', err)
    error('فشل إرجاع التنسيقات')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
