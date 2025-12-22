<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="isEditMode ? 'تعديل الخدمة' : 'إضافة خدمة'"
    icon="mdi-cog"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.titleAr" label="اسم الخدمة (عربي)" variant="outlined" :rules="[v => !!v || 'الحقل مطلوب']" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.titleEn" label="Service Title (English)" variant="outlined" :rules="[v => !!v || 'Required']" />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea v-model="formData.descriptionAr" label="الوصف (عربي)" variant="outlined" rows="4" />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea v-model="formData.descriptionEn" label="Description (English)" variant="outlined" rows="4" />
        </v-col>
        <v-col cols="12">
          <v-file-input v-model="formData.image" label="أيقونة/صورة الخدمة" variant="outlined" accept="image/*" prepend-icon="mdi-camera" />
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
  show: { type: Boolean, default: false },
  serviceData: { type: Object, default: null }
})

const emit = defineEmits(['update:show', 'saved'])
const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)
const isEditMode = computed(() => !!props.serviceData?.id)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.serviceData) {
      const title = typeof props.serviceData.title === 'string' ? JSON.parse(props.serviceData.title) : props.serviceData.title
      const description = typeof props.serviceData.description === 'string' ? JSON.parse(props.serviceData.description) : props.serviceData.description || {}
      dialogRef.value.setFormData({
        titleAr: title?.ar || '',
        titleEn: title?.en || '',
        descriptionAr: description?.ar || '',
        descriptionEn: description?.en || '',
        image: null
      })
    } else {
      dialogRef.value.setFormData({ titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', image: null })
    }
  }
})

const handleSave = async (formData) => {
  loading.value = true
  try {
    const payload = new FormData()
    payload.append('title', JSON.stringify({ ar: formData.titleAr, en: formData.titleEn }))
    payload.append('description', JSON.stringify({ ar: formData.descriptionAr, en: formData.descriptionEn }))
    payload.append('user_id', userStore.user.id)
    
    if (formData.image && formData.image.length > 0) {
      payload.append('photos[]', formData.image[0])
    }

    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`services/${props.serviceData.id}`, payload)
      success('تم تحديث الخدمة بنجاح ✅')
    } else {
      await axios.post('services', payload)
      success('تمت إضافة الخدمة بنجاح ✅')
    }
    
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    error('فشل حفظ الخدمة')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => { emit('update:show', false) }
</script>
