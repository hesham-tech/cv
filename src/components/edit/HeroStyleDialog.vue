<template>
  <BaseEditDialog
    :show="show"
    @update:show="$emit('update:show', $event)"
    title="تنسيقات قسم الرئيسية"
    icon="mdi-palette"
    icon-color="secondary"
    :loading="loading"
    :has-reset="true"
    :reset-loading="resetLoading"
    @save="handleSave"
    @cancel="handleCancel"
    @reset="handleReset"
  >
    <template #default="{ formData }">
      <v-row>
        <!-- تنسيقات عناوين الأقسام -->
        <v-col cols="12">
          <h3 class="mb-3">عناوين الأقسام</h3>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.sectionTitle_fontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.sectionTitle_textColor"
            label="لون النص"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.sectionTitle_backgroundColor"
            label="لون الخلفية"
          />
       </v-col>

        <!-- تنسيقات الاسم -->
        <v-col cols="12" class="mt-4">
          <h3 class="mb-3">الاسم وجملة الترحيب</h3>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.mainTitle_fontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.mainTitle_textColor"
            label="لون النص"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.mainTitle_backgroundColor"
            label="لون الخلفية"
          />
        </v-col>

        <!-- تنسيقات الوظيفة -->
        <v-col cols="12" class="mt-4">
          <h3 class="mb-3">الوظيفة</h3>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.subTitle_fontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.subTitle_textColor"
            label="لون النص"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.subTitle_backgroundColor"
            label="لون الخلفية"
          />
        </v-col>

        <!-- تنسيقات النبذة -->
        <v-col cols="12" class="mt-4">
          <h3 class="mb-3">النبذة التعريفية</h3>
          <v-divider class="mb-4" />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="formData.paragraph_fontSize"
            label="حجم الخط"
            variant="outlined"
            type="number"
            suffix="px"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.paragraph_textColor"
            label="لون النص"
          />
        </v-col>

        <v-col cols="12" md="4">
          <ColorPickerField
            v-model="formData.paragraph_backgroundColor"
            label="لون الخلفية"
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
import ColorPickerField from './ColorPickerField.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  themeData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:show', 'saved'])

const userStore = useUserStore()
const { success, error } = useToast()
const loading = ref(false)
const resetLoading = ref(false)
const dialogRef = ref(null)

// تحميل البيانات عند فتح Dialog
watch(() => props.show, (newValue) => {
  if (newValue && dialogRef.value) {
    const theme = props.themeData
    
    dialogRef.value.setFormData({
      // Section Title
      sectionTitle_fontSize: theme.sectionTitle?.fontSize || '',
      sectionTitle_textColor: theme.sectionTitle?.textColor || '',
      sectionTitle_backgroundColor: theme.sectionTitle?.backgroundColor || '',
      
      // Main Title
      mainTitle_fontSize: theme.mainTitle?.fontSize || '',
      mainTitle_textColor: theme.mainTitle?.textColor || '',
      mainTitle_backgroundColor: theme.mainTitle?.backgroundColor || '',
      
      // Sub Title
      subTitle_fontSize: theme.subTitle?.fontSize || '',
      subTitle_textColor: theme.subTitle?.textColor || '',
      subTitle_backgroundColor: theme.subTitle?.backgroundColor || '',
      
      // Paragraph
      paragraph_fontSize: theme.paragraph?.fontSize || '',
      paragraph_textColor: theme.paragraph?.textColor || '',
      paragraph_backgroundColor: theme.paragraph?.backgroundColor || ''
    })
  }
})

const handleSave = async (formData) => {
  loading.value = true

  try {
    const payload = {
      hero: {
        sectionTitle: {
          fontSize: formData.sectionTitle_fontSize,
          textColor: formData.sectionTitle_textColor,
          backgroundColor: formData.sectionTitle_backgroundColor
        },
        mainTitle: {
          fontSize: formData.mainTitle_fontSize,
          textColor: formData.mainTitle_textColor,
          backgroundColor: formData.mainTitle_backgroundColor
        },
        subTitle: {
          fontSize: formData.subTitle_fontSize,
          textColor: formData.subTitle_textColor,
          backgroundColor: formData.subTitle_backgroundColor
        },
        paragraph: {
          fontSize: formData.paragraph_fontSize,
          textColor: formData.paragraph_textColor,
          backgroundColor: formData.paragraph_backgroundColor
        }
      }
    }

    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    
    // تحديث Store
    await userStore.fetchUser()
    
    success('تم حفظ التنسيقات بنجاح ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error saving hero theme:', err)
    error('فشل حفظ التنسيقات. حاول مرة أخرى')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  resetLoading.value = true

  try {
    // إرسال null لإرجاع القيم للافتراضية
    const payload = {
      hero: null
    }

    await axios.patch(`users/${userStore.user.id}/theme`, payload)
    
    // تحديث Store
    await userStore.fetchUser()
    
    success('تم الإرجاع للإعدادات الافتراضية ✅')
    emit('saved')
    emit('update:show', false)
  } catch (err) {
    console.error('Error resetting hero theme:', err)
    error('فشل الإرجاع للافتراضي. حاول مرة أخرى')
  } finally {
    resetLoading.value = false
  }
}

const handleCancel = () => {
  emit('update:show', false)
}
</script>
