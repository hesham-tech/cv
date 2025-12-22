<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="isEditMode ? 'تعديل الشهادة الأكاديمية' : 'إضافة شهادة أكاديمية'"
    icon="mdi-school"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- المؤسسة التعليمية (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.institutionAr"
            label="المؤسسة التعليمية (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- المؤسسة التعليمية (إنجليزي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.institutionEn"
            label="Institution (English)"
            variant="outlined"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>

        <!-- الدرجة العلمية (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.degreeAr"
            label="الدرجة العلمية (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- الدرجة العلمية (إنجليزي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.degreeEn"
            label="Degree (English)"
            variant="outlined"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>

        <!-- التقدير (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.gradeAr"
            label="التقدير (عربي)"
            variant="outlined"
          />
        </v-col>

        <!-- التقدير (إنجليزي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.gradeEn"
            label="Grade/Score (English)"
            variant="outlined"
          />
        </v-col>

        <!-- مجال الدراسة (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.fieldAr"
            label="مجال الدراسة (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- مجال الدراسة (إنجليزي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.fieldEn"
            label="Field of Study (English)"
            variant="outlined"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>

        <!-- تاريخ البداية -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.startDate"
            label="تاريخ البداية"
            variant="outlined"
            type="date"
          />
        </v-col>

        <!-- تاريخ النهاية -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.endDate"
            label="تاريخ النهاية"
            variant="outlined"
            type="date"
            hint="اتركه فارغاً إذا كنت لا تزال تدرس"
            persistent-hint
          />
        </v-col>

        <!-- الوصف (عربي) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.descriptionAr"
            label="الوصف (عربي)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- الوصف (إنجليزي) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.descriptionEn"
            label="Description (English)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- رفع صورة/شعار -->
        <v-col cols="12">
          <v-file-input
            v-model="formData.image"
            label="صورة/شعار المؤسسة"
            variant="outlined"
            accept="image/*"
            prepend-icon="mdi-camera"
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
  academicData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)

const isEditMode = computed(() => !!props.academicData?.id)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.academicData) {
      const institution = typeof props.academicData.institution === 'string' 
        ? JSON.parse(props.academicData.institution) 
        : props.academicData.institution

      const degree = typeof props.academicData.degree === 'string'
        ? JSON.parse(props.academicData.degree)
        : props.academicData.degree

      const grade = typeof props.academicData.grade === 'string'
        ? JSON.parse(props.academicData.grade)
        : props.academicData.grade

      const field = typeof props.academicData.field_of_study === 'string'
        ? JSON.parse(props.academicData.field_of_study)
        : props.academicData.field_of_study

      const description = typeof props.academicData.description === 'string'
        ? JSON.parse(props.academicData.description)
        : props.academicData.description

      dialogRef.value.setFormData({
        institutionAr: institution?.ar || '',
        institutionEn: institution?.en || '',
        degreeAr: degree?.ar || '',
        degreeEn: degree?.en || '',
        gradeAr: grade?.ar || '',
        gradeEn: grade?.en || '',
        fieldAr: field?.ar || '',
        fieldEn: field?.en || '',
        startDate: props.academicData.start_date || '',
        endDate: props.academicData.end_date || '',
        descriptionAr: description?.ar || '',
        descriptionEn: description?.en || '',
        image: null
      })
    } else {
      dialogRef.value.setFormData({
        institutionAr: '',
        institutionEn: '',
        degreeAr: '',
        degreeEn: '',
        gradeAr: '',
        gradeEn: '',
        fieldAr: '',
        fieldEn: '',
        startDate: '',
        endDate: '',
        descriptionAr: '',
        descriptionEn: '',
        image: null
      })
    }
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = new FormData()
    payload.append('institution', JSON.stringify({ ar: formData.institutionAr, en: formData.institutionEn }))
    payload.append('degree', JSON.stringify({ ar: formData.degreeAr, en: formData.degreeEn }))
    payload.append('grade', JSON.stringify({ ar: formData.gradeAr, en: formData.gradeEn }))
    payload.append('field_of_study', JSON.stringify({ ar: formData.fieldAr, en: formData.fieldEn }))
    payload.append('description', JSON.stringify({ ar: formData.descriptionAr, en: formData.descriptionEn }))
    payload.append('start_date', formData.startDate)
    payload.append('end_date', formData.endDate || '')
    payload.append('user_id', userStore.user.id)
    
    if (formData.image && formData.image.length > 0) {
      payload.append('photos[]', formData.image[0])
    }

    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`academics/${props.academicData.id}`, payload)
      success('تم تحديث الشهادة بنجاح ✅')
    } else {
      await axios.post('academics', payload)
      success('تمت إضافة الشهادة بنجاح ✅')
    }
    
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving academic:', err)
    error('فشل حفظ الشهادة')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
