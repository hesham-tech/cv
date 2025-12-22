<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="تعديل قسم من أنا"
    icon="mdi-account-edit"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- عني بالعربي -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.about_ar"
            label="عني (عربي)"
            variant="outlined"
            rows="6"
            dir="rtl"
          />
        </v-col>

        <!-- عني بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.about_en"
            label="About Me (English)"
            variant="outlined"
            rows="6"
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
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    dialogRef.value.setFormData({
      about_ar: props.userData.about_ar || '',
      about_en: props.userData.about_en || ''
    })
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = new FormData()
    payload.append('about_ar', formData.about_ar)
    payload.append('about_en', formData.about_en)
    payload.append('_method', 'put')

    await axios.post(`users/${props.userData.id}`, payload)
    await userStore.fetchUser()
    
    success('تم حفظ البيانات بنجاح ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving about:', err)
    error('فشل حفظ البيانات')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
