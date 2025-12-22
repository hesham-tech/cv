<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="isEditMode ? 'تعديل الخبرة' : 'إضافة خبرة'"
    icon="mdi-briefcase"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- المسمى الوظيفي (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.titleAr"
            label="المسمى الوظيفي (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- Job Title (English) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.titleEn"
            label="Job Title (English)"
            variant="outlined"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>

        <!-- الشركة (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.companyAr"
            label="الشركة (عربي)"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- Company (English) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.companyEn"
            label="Company (English)"
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
            rows="3"
          />
        </v-col>

        <!-- Description (English) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.descriptionEn"
            label="Description (English)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- المسؤوليات (عربي) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.responsibilitiesAr"
            label="المسؤوليات (عربي)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- Responsibilities (English) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.responsibilitiesEn"
            label="Responsibilities (English)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- الإنجازات (عربي) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.achievementsAr"
            label="الإنجازات (عربي)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- Achievements (English) -->
        <v-col cols="12" md="6">
          <v-textarea
            v-model="formData.achievementsEn"
            label="Achievements (English)"
            variant="outlined"
            rows="3"
          />
        </v-col>

        <!-- نوع الوظيفة (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.employmentTypeAr"
            label="نوع الوظيفة (عربي)"
            variant="outlined"
            hint="مثال: دوام كامل، دوام جزئي"
            persistent-hint
          />
        </v-col>

        <!-- Employment Type (English) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.employmentTypeEn"
            label="Employment Type (English)"
            variant="outlined"
            hint="Example: Full-time, Part-time"
            persistent-hint
          />
        </v-col>

        <!-- المجال (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.industryAr"
            label="المجال (عربي)"
            variant="outlined"
          />
        </v-col>

        <!-- Industry (English) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.industryEn"
            label="Industry (English)"
            variant="outlined"
          />
        </v-col>

        <!-- الموقع (عربي) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.locationAr"
            label="الموقع (عربي)"
            variant="outlined"
          />
        </v-col>

        <!-- Location (English) -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.locationEn"
            label="Location (English)"
            variant="outlined"
          />
        </v-col>

        <!-- تاريخ البداية -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.startDate"
            label="تاريخ البداية"
            variant="outlined"
            type="date"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- تاريخ النهاية -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.endDate"
            label="تاريخ النهاية"
            variant="outlined"
            type="date"
            :disabled="formData.isCurrent"
          />
          <v-checkbox
            v-model="formData.isCurrent"
            label="العمل حالياً"
            hide-details
          />
        </v-col>

        <!-- رفع صورة/شعار -->
        <v-col cols="12">
          <v-file-input
            v-model="formData.image"
            label="صورة/شعار الشركة"
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
  experienceData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)

const isEditMode = computed(() => !!props.experienceData?.id)

watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.experienceData) {
      const title = typeof props.experienceData.title === 'string' 
        ? JSON.parse(props.experienceData.title) 
        : props.experienceData.title

      const company = typeof props.experienceData.company === 'string'
        ? JSON.parse(props.experienceData.company)
        : props.experienceData.company

      const description = typeof props.experienceData.description === 'string'
        ? JSON.parse(props.experienceData.description)
        : props.experienceData.description || {}

      const responsibilities = typeof props.experienceData.responsibilities === 'string'
        ? JSON.parse(props.experienceData.responsibilities)
        : props.experienceData.responsibilities || {}

      const achievements = typeof props.experienceData.achievements === 'string'
        ? JSON.parse(props.experienceData.achievements)
        : props.experienceData.achievements || {}

      const employmentType = typeof props.experienceData.employment_type === 'string'
        ? JSON.parse(props.experienceData.employment_type)
        : props.experienceData.employment_type || {}

      const industry = typeof props.experienceData.industry === 'string'
        ? JSON.parse(props.experienceData.industry)
        : props.experienceData.industry || {}

      const location = typeof props.experienceData.location === 'string'
        ? JSON.parse(props.experienceData.location)
        : props.experienceData.location || {}

      dialogRef.value.setFormData({
        titleAr: title?.ar || '',
        titleEn: title?.en || '',
        companyAr: company?.ar || '',
        companyEn: company?.en || '',
        descriptionAr: description?.ar || '',
        descriptionEn: description?.en || '',
        responsibilitiesAr: responsibilities?.ar || '',
        responsibilitiesEn: responsibilities?.en || '',
        achievementsAr: achievements?.ar || '',
        achievementsEn: achievements?.en || '',
        employmentTypeAr: employmentType?.ar || '',
        employmentTypeEn: employmentType?.en || '',
        industryAr: industry?.ar || '',
        industryEn: industry?.en || '',
        locationAr: location?.ar || '',
        locationEn: location?.en || '',
        startDate: props.experienceData.start_date || '',
        endDate: props.experienceData.end_date || '',
        isCurrent: props.experienceData.is_current || false,
        image: null
      })
    } else {
      dialogRef.value.setFormData({
        titleAr: '',
        titleEn: '',
        companyAr: '',
        companyEn: '',
        descriptionAr: '',
        descriptionEn: '',
        responsibilitiesAr: '',
        responsibilitiesEn: '',
        achievementsAr: '',
        achievementsEn: '',
        employmentTypeAr: '',
        employmentTypeEn: '',
        industryAr: '',
        industryEn: '',
        locationAr: '',
        locationEn: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        image: null
      })
    }
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = new FormData()
    payload.append('title', JSON.stringify({ ar: formData.titleAr, en: formData.titleEn }))
    payload.append('company', JSON.stringify({ ar: formData.companyAr, en: formData.companyEn }))
    payload.append('description', JSON.stringify({ ar: formData.descriptionAr, en: formData.descriptionEn }))
    payload.append('responsibilities', JSON.stringify({ ar: formData.responsibilitiesAr, en: formData.responsibilitiesEn }))
    payload.append('achievements', JSON.stringify({ ar: formData.achievementsAr, en: formData.achievementsEn }))
    payload.append('employment_type', JSON.stringify({ ar: formData.employmentTypeAr, en: formData.employmentTypeEn }))
    payload.append('industry', JSON.stringify({ ar: formData.industryAr, en: formData.industryEn }))
    payload.append('location', JSON.stringify({ ar: formData.locationAr, en: formData.locationEn }))
    payload.append('start_date', formData.startDate)
    payload.append('end_date', formData.endDate || '')
    payload.append('is_current', formData.isCurrent ? 1 : 0)
    payload.append('user_id', userStore.user.id)
    
    if (formData.image && formData.image.length > 0) {
      payload.append('photos[]', formData.image[0])
    }

    if (isEditMode.value) {
      payload.append('_method', 'put')
      await axios.post(`experiences/${props.experienceData.id}`, payload)
      success('تم تحديث الخبرة بنجاح ✅')
    } else {
      await axios.post('experiences', payload)
      success('تمت إضافة الخبرة بنجاح ✅')
    }
    
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving experience:', err)
    error('فشل حفظ الخبرة')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
