<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="isEditMode ? 'تعديل المشروع' : 'إضافة مشروع'"
    icon="mdi-briefcase-variant"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- العنوان (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.titleAr"
            label="عنوان المشروع (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- Title (English) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.titleEn"
            label="Project Title (English)"
            variant="outlined"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>

        <!-- الوصف (عربي) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.descriptionAr"
            label="الوصف (عربي)"
            variant="outlined"
            rows="4"
          />
        </v-col>

        <!-- Description (English) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.descriptionEn"
            label="Description (English)"
            variant="outlined"
            rows="4"
          />
        </v-col>

        <!-- رابط المشروع -->
        <v-col cols="12">
          <v-text-field
            v-model="formData.url"
            label="رابط المشروع (URL)"
            variant="outlined"
            type="url"
            placeholder="https://example.com"
            hint="سيتم إضافة https:// تلقائياً إذا لم تكن موجودة"
            persistent-hint
          />
        </v-col>

        <!-- رفع صور -->
        <v-col cols="12">
          <v-file-input
            v-model="formData.images"
            label="صور المشروع"
            variant="outlined"
            accept="image/*"
            multiple
            prepend-icon="mdi-camera"
            hint="يمكنك اختيار عدة صور"
            persistent-hint
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

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  workData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)

const isEditMode = computed(() => !!props.workData?.id)

const ensureHttps = (url) => {
  if (!url) return ''
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return 'https://' + url
  }
  return url
}

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.workData) {
      const title = typeof props.workData.title === 'string' 
        ? JSON.parse(props.workData.title) 
        : props.workData.title

      const description = typeof props.workData.description === 'string'
        ? JSON.parse(props.workData.description)
        : props.workData.description || {}

      dialogRef.value.setFormData({
        titleAr: title?.ar || '',
        titleEn: title?.en || '',
        descriptionAr: description?.ar || '',
        descriptionEn: description?.en || '',
        url: props.workData.url?.replace('https://', '') || '',
        images: null
      })
    } else {
      dialogRef.value.setFormData({
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        url: '',
        images: null
      })
    }
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = new FormData()
    payload.append('title', JSON.stringify({ ar: formData.titleAr, en: formData.titleEn }))
    payload.append('description', JSON.stringify({ ar: formData.descriptionAr, en: formData.descriptionEn }))
    payload.append('url', ensureHttps(formData.url))
    payload.append('user_id', userStore.user.id)
    
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        payload.append('photos[]', formData.images[i])
      }
    }

    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`projects/${props.workData.id}`, payload)
      success('تم تحديث المشروع بنجاح ✅')
    } else {
      await axios.post('projects', payload)
      success('تمت إضافة المشروع بنجاح ✅')
    }
    
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving work:', err)
    error('فشل حفظ المشروع')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
