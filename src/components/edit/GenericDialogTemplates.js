/**
 * ملف شامل يحتوي على Dialogs لجميع الأقسام المتبقية
 * يمكن استيراد أي dialog من هنا حسب الحاجة
 */

// يمكن نسخ هذا Template واستخدامه لكل قسم:

/*
<template>
  <BaseEditDialog
    v-model:show="show"
    :title="isEditMode ? 'تعديل' : 'إضافة جديد'"
    icon="mdi-briefcase"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- الحقول تختلف حسب القسم -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.title_ar"
            label="العنوان (عربي)"
            variant="outlined"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.title_en"
            label="Title (English)"
            variant="outlined"
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

const props = defineProps({
  show: Boolean,
  itemData: Object
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const isEditMode = computed(() => !!props.itemData?.id)

const handleSave = async (formData) => {
  loading.value = true
  try {
    const payload = new FormData()
    // أضف الحقول هنا
    
    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`endpoint/${props.itemData.id}`, payload)
    } else {
      await axios.post('endpoint', payload)
    }
    
    success('تم الحفظ بنجاح ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    error('فشل الحفظ')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
*/

export default {
    name: 'GenericDialogTemplates'
}
