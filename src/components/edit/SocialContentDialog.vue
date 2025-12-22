<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    :title="isEditMode ? 'تعديل رابط' : 'إضافة رابط سوشيال'"
    icon="mdi-link-variant"
    icon-color="primary"
    :loading="loading"
    @save="handleSave"
    @cancel="handleCancel"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- اختيار المنصة -->
        <v-col cols="12" md="6">
          <v-select
            v-model="formData.selectedPlatform"
            :items="socialPlatforms"
            item-title="name"
            item-value="icon"
            label="اختر منصة السوشيال"
            variant="outlined"
            return-object
            @update:modelValue="onPlatformChange(formData)"
          >
            <template #prepend>
              <v-icon :icon="formData.selectedPlatform?.icon || 'mdi-web'" :color="formData.selectedPlatform?.color" />
            </template>
          </v-select>
        </v-col>

        <!-- اسم المنصة بالعربي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.nameAr"
            label="الاسم بالعربي"
            variant="outlined"
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- اسم المنصة بالإنجليزي -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.nameEn"
            label="Name (English)"
            variant="outlined"
            :rules="[v => !!v || 'Required']"
          />
        </v-col>

        <!-- الرابط -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.url"
            label="الرابط (URL)"
            variant="outlined"
            type="url"
            placeholder="example.com"
            hint="سيتم إضافة https:// تلقائياً"
            persistent-hint
            :rules="[v => !!v || 'الحقل مطلوب']"
          />
        </v-col>

        <!-- معاينة الأيقونة -->
        <v-col cols="12" class="text-center">
          <v-card variant="outlined" class="pa-6">
            <p class="text-caption mb-2">معاينة:</p>
            <v-icon 
              :icon="formData.selectedPlatform?.icon || 'mdi-link'" 
              :color="formData.selectedPlatform?.color || 'primary'"
              size="48"
            />
            <p class="text-caption mt-2">
              {{ formData.nameAr || formData.selectedPlatform?.namear || 'اسم المنصة' }}
            </p>
          </v-card>
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
  socialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const dialogRef = ref(null)

const isEditMode = computed(() => !!props.socialData?.id)

// قائمة المنصات المحددة مسبقاً (من SocialForm.vue)
const socialPlatforms = [
  { name: 'Facebook', icon: 'mdi-facebook', color: '#1877F2', namear: 'فيس بوك' },
  { name: 'Twitter', icon: 'mdi-twitter', color: '#1DA1F2', namear: 'تويتر' },
  { name: 'Instagram', icon: 'mdi-instagram', color: '#E4405F', namear: 'انستجرام' },
  { name: 'Linked In', icon: 'mdi-linkedin', color: '#0077B5', namear: 'لينكيد ان' },
  { name: 'YouTube', icon: 'mdi-youtube', color: '#FF0000', namear: 'يوتيوب' },
  { name: 'Web Site', icon: 'mdi-web', color: '#000000', namear: 'موقع شخصي' },
  { name: 'GitHub', icon: 'mdi-github', color: '#333333', namear: 'جيت هب' }
]

// عند تغيير المنصة، حدّث الأسماء
const onPlatformChange = (formData) => {
  if (formData.selectedPlatform) {
    formData.nameEn = formData.selectedPlatform.name
    formData.nameAr = formData.selectedPlatform.namear
  }
}

// تحميل البيانات عند فتح Dialog
watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    if (props.socialData) {
      // تحرير - تحميل البيانات الموجودة
      const socialName = typeof props.socialData.name === 'string' 
        ? JSON.parse(props.socialData.name) 
        : props.socialData.name
      
      const socialIcon = typeof props.socialData.icon === 'string'
        ? JSON.parse(props.socialData.icon)
        : props.socialData.icon

      // العثور على المنصة المطابقة
      const platform = socialPlatforms.find(p => p.icon === socialIcon.icon) || socialPlatforms[5]

      dialogRef.value.setFormData({
        selectedPlatform: platform,
        nameAr: socialName.ar || '',
        nameEn: socialName.en || '',
        url: props.socialData.url?.replace('https://', '') || ''
      })
    } else {
      // إضافة جديدة - بيانات فارغة
      dialogRef.value.setFormData({
        selectedPlatform: socialPlatforms[0],
        nameAr: socialPlatforms[0].namear,
        nameEn: socialPlatforms[0].name,
        url: ''
      })
    }
  }
})

// إضافة https:// إذا لم تكن موجودة
const ensureHttps = (url) => {
  if (!url) return ''
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return 'https://' + url
  }
  return url
}

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = {
      name: JSON.stringify({
        ar: formData.nameAr,
        en: formData.nameEn
      }),
      icon: JSON.stringify({
        icon: formData.selectedPlatform.icon,
        color: formData.selectedPlatform.color
      }),
      url: ensureHttps(formData.url),
      user_id: userStore.user.id
    }

    if (isEditMode.value) {
      await axios.put(`socials/${props.socialData.id}`, payload)
      success('تم تحديث الرابط بنجاح ✅')
    } else {
      await axios.post('socials', payload)
      success('تمت إضافة الرابط بنجاح ✅')
    }
    
    // Refresh data
    const res = await axios.get(`users-all/${userStore.userAll.user.username}`)
    userStore.userAll = res.data.data
    
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving social link:', err)
    error('فشل حفظ الرابط')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
