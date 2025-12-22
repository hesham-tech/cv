<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="`تعديل ${title}`"
    icon="mdi-pencil"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- الاسم الأول بالعربي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.first_name_ar"
            label="الاسم الأول (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- الاسم الأول بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.first_name_en"
            label="First Name (English)"
            variant="outlined"
            :rules="[v => !!v || 'Field is required']"
          />
        </v-col>

        <!-- الاسم الكامل بالعربي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.last_name_ar"
            label="الاسم الكامل (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- الاسم الكامل بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.last_name_en"
            label="Full Name (English)"
            variant="outlined"
            :rules="[v => !!v || 'Field is required']"
          />
        </v-col>

        <!-- الوظيفة بالعربي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.position_ar"
            label="الوظيفة (عربي)"
            variant="outlined"
          />
        </v-col>

        <!-- الوظيفة بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.position_en"
            label="Position (English)"
            variant="outlined"
          />
        </v-col>

        <!-- النبذة التعريفية بالعربي -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.bio_ar"
            label="النبذة التعريفية (عربي)"
            variant="outlined"
            rows="4"
            dir="rtl"
          />
        </v-col>

        <!-- النبذة التعريفية بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.bio_en"
            label="Bio (English)"
            variant="outlined"
            rows="4"
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
  show: {
    type: Boolean,
    default: false
  },
  userData: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: 'البيانات الأساسية'
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)

const dialogRef = ref(null)

// تحميل البيانات عند فتح Dialog
watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    dialogRef.value.setFormData({
      first_name_ar: props.userData.first_name?.ar || '',
      first_name_en: props.userData.first_name?.en || '',
      last_name_ar: props.userData.last_name?.ar || '',
      last_name_en: props.userData.last_name?.en || '',
      position_ar: props.userData.position?.ar || '',
      position_en: props.userData.position?.en || '',
      bio_ar: props.userData.bio_ar || '',
      bio_en: props.userData.bio_en || ''
    })
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = new FormData()
    payload.append('first_name', JSON.stringify({ 
      ar: formData.first_name_ar, 
      en: formData.first_name_en 
    }))
    payload.append('last_name', JSON.stringify({ 
      ar: formData.last_name_ar, 
      en: formData.last_name_en 
    }))
    payload.append('position', JSON.stringify({ 
      ar: formData.position_ar, 
      en: formData.position_en 
    }))
    payload.append('bio_ar', formData.bio_ar)
    payload.append('bio_en', formData.bio_en)
    payload.append('_method', 'put')

    await axios.post(`users/${props.userData.id}`, payload)
    
    // تحديث Store
    await userStore.fetchUser()
    
    success('تم حفظ البيانات بنجاح ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving hero data:', err)
    error('فشل حفظ البيانات. حاول مرة أخرى')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
