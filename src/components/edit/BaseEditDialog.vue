<template>
  <v-dialog
    v-model="internalShow"
    :max-width="maxWidth"
    :fullscreen="xs"
    persistent
    scrollable
  >
    <v-card>
      <!-- Header -->
      <v-card-title class="dialog-header">
        <v-icon :icon="icon" class="me-2" :color="iconColor"></v-icon>
        <span>{{ title }}</span>
      </v-card-title>

      <v-divider />

      <!-- Content -->
      <v-card-text class="dialog-content">
        <v-form ref="formRef" v-model="valid">
          <slot name="default" :formData="formData" :errors="errors" />
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="dialog-actions">
        <div class="actions-left">
          <!-- زر إرجاع للافتراضي -->
          <v-btn
            v-if="hasReset"
            color="warning"
            variant="outlined"
            :loading="resetLoading"
            :disabled="loading"
            @click="handleReset"
          >
            <v-icon class="me-2">mdi-restore</v-icon>
            إرجاع للافتراضي
          </v-btn>
        </div>

        <v-spacer />

        <div class="actions-right">
          <!-- زر إلغاء -->
          <v-btn
            variant="text"
            :disabled="loading || resetLoading"
            @click="handleCancel"
          >
            إلغاء
          </v-btn>

          <!-- زر حفظ -->
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!valid || resetLoading"
            @click="handleSave"
          >
            <v-icon class="me-2">mdi-content-save</v-icon>
            حفظ
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'mdi-pencil'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  maxWidth: {
    type: [String, Number],
    default: 900
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasReset: {
    type: Boolean,
    default: false
  },
  resetLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'save', 'cancel', 'reset'])

const { xs } = useDisplay()
const formRef = ref(null)
const valid = ref(true)
const formData = ref({})
const errors = ref({})

// Sync internal show state with prop
const internalShow = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const handleSave = async () => {
  // التحقق من صحة النموذج
  const { valid: isValid } = await formRef.value.validate()
  
  if (isValid) {
    emit('save', formData.value)
  }
}

const handleCancel = () => {
  // إعادة تعيين النموذج
  if (formRef.value) {
    formRef.value.reset()
  }
  formData.value = {}
  errors.value = {}
  emit('cancel')
  internalShow.value = false
}

const handleReset = () => {
  emit('reset')
}

// Reset form when dialog closes
watch(internalShow, (newValue) => {
  if (!newValue && formRef.value) {
    formRef.value.reset()
    errors.value = {}
  }
})

// Expose methods for parent component
defineExpose({
  formData,
  errors,
  setFormData: (data) => {
    formData.value = { ...data }
  },
  setErrors: (errs) => {
    errors.value = { ...errs }
  }
})
</script>

<style lang="scss" scoped>
.dialog-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dialog-content {
  padding: 24px;
  min-height: 200px;
}

.dialog-actions {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  
  .actions-left,
  .actions-right {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dialog-header {
    font-size: 18px;
    padding: 16px 20px;
  }

  .dialog-content {
    padding: 20px;
  }

  .dialog-actions {
    flex-direction: column;
    gap: 12px;
    
    .actions-left,
    .actions-right {
      width: 100%;
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }
}
</style>
