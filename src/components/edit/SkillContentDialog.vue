<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="isEditMode ? 'تعديل مهارة' : 'إضافة مهارة جديدة'"
    icon="mdi-code-tags"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- اسم المهارة بالعربي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.name_ar"
            label="اسم المهارة (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- اسم المهارة بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.name_en"
            label="Skill Name (English)"
            variant="outlined"
            :rules="[v => !!v || 'Field is required']"
          />
        </v-col>

        <!-- الوصف بالعربي -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.description_ar"
            label="الوصف (عربي)"
            variant="outlined"
            rows="3"
            dir="rtl"
          />
        </v-col>

        <!-- الوصف بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.description_en"
            label="Description (English)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- المستوى (النسبة المئوية) -->
        <v-col cols="12">
          <v-slider
            v-model="formData.level"
            label="مستوى الإتقان"
            :min="1"
            :max="100"
            :step="5"
            thumb-label="always"
            color="primary"
          >
            <template #append>
              <v-text-field
                v-model="formData.level"
                type="number"
                variant="outlined"
                density="compact"
                style="width: 80px"
                hide-details
                suffix="%"
              />
            </template>
          </v-slider>
        </v-col>

        <!-- صورة/أيقونة المهارة -->
        <v-col cols="12">
          <imageInput ref="imageInputRef" />
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
  skillData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)
const imageInputRef = ref(null)

const isEditMode = computed(() => !!props.skillData?.id)

// تحميل البيانات عند فتح Dialog
watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.skillData) {
      dialogRef.value.setFormData({
        name_ar: props.skillData.name?.ar || '',
        name_en: props.skillData.name?.en || '',
        description_ar: props.skillData.description?.ar || '',
        description_en: props.skillData.description?.en || '',
        level: props.skillData.level || 50
      })
    } else {
      // بيانات فارغة للإضافة
      dialogRef.value.setFormData({
        name_ar: '',
        name_en: '',
        description_ar: '',
        description_en: '',
        level: 50
      })
    }
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    // Compress images first
    let compressedImages = []
    if (imageInputRef.value) {
      compressedImages = await imageInputRef.value.compressImages()
    }

    const payload = new FormData()
    payload.append('name', JSON.stringify({ 
      ar: formData.name_ar, 
      en: formData.name_en 
    }))
    payload.append('description', JSON.stringify({ 
      ar: formData.description_ar, 
      en: formData.description_en 
    }))
    payload.append('level', formData.level)
    payload.append('user_id', userStore.user.id)

    // Add compressed images
    if (compressedImages.length) {
      compressedImages.forEach(file => {
        payload.append('photos[]', file, file.name)
      })
    }

    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`skills/${props.skillData.id}`, payload)
      success('تم تحديث المهارة بنجاح ✅')
    } else {
      await axios.post('skills', payload)
      success('تمت إضافة المهارة بنجاح ✅')
    }
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving skill:', err)
    error('فشل حفظ المهارة. حاول مرة أخرى')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
