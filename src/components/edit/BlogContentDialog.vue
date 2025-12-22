<template>
  <BaseEditDialog :show="show" @update:show="$emit('update:show', $event)" :title="isEditMode ? 'تعديل المقال' : 'إضافة مقال'" icon="mdi-post" icon-color="primary" :loading="loading" @save="handleSave" @cancel="handleCancel">
    <template #default="{ formData }">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.titleAr" label="عنوان المقال (عربي)" variant="outlined" :rules="[v => !!v || 'الحقل مطلوب']" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.titleEn" label="Article Title (English)" variant="outlined" :rules="[v => !!v || 'Required']" />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea v-model="formData.contentAr" label="المحتوى (عربي)" variant="outlined" rows="6" />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea v-model="formData.contentEn" label="Content (English)" variant="outlined" rows="6" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.url" label="رابط المقال (URL)" variant="outlined" type="url" placeholder="https://blog.example.com/post" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="formData.date" label="التاريخ" variant="outlined" type="date" />
        </v-col>
        <v-col cols="12">
          <v-file-input v-model="formData.image" label="صورة مميزة" variant="outlined" accept="image/*" prepend-icon="mdi-camera" />
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

const props = defineProps({ show: { type: Boolean, default: false }, blogData: { type: Object, default: null } })
const emit = defineEmits(['update:show', 'saved'])
const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)
const isEditMode = computed(() => !!props.blogData?.id)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.blogData) {
      const title = typeof props.blogData.title === 'string' ? JSON.parse(props.blogData.title) : props.blogData.title
      const content = typeof props.blogData.content === 'string' ? JSON.parse(props.blogData.content) : props.blogData.content || {}
      dialogRef.value.setFormData({
        titleAr: title?.ar || '',
        titleEn: title?.en || '',
        contentAr: content?.ar || '',
        contentEn: content?.en || '',
        url: props.blogData.url || '',
        date: props.blogData.date || '',
        image: null
      })
    } else {
      dialogRef.value.setFormData({ titleAr: '', titleEn: '', contentAr: '', contentEn: '', url: '', date: '', image: null })
    }
  }
})

const handleSave = async (formData) => {
  loading.value = true
  try {
    const payload = new FormData()
    payload.append('title', JSON.stringify({ ar: formData.titleAr, en: formData.titleEn }))
    payload.append('content', JSON.stringify({ ar: formData.contentAr, en: formData.contentEn }))
    payload.append('url', formData.url)
    payload.append('date', formData.date)
    payload.append('user_id', userStore.user.id)
    
    if (formData.image && formData.image.length > 0) {
      payload.append('photos[]', formData.image[0])
    }

    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`blogs/${props.blogData.id}`, payload)
      success('تم تحديث المقال بنجاح ✅')
    } else {
      await axios.post('blogs', payload)
      success('تمت إضافة المقال بنجاح ✅')
    }
    
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    error('فشل حفظ المقال')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => { emit('update:show', false) }
</script>
