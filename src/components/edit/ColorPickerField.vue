<template>
  <div class="color-picker-field">
    <v-text-field
      :model-value="displayValue"
      :label="label"
      variant="outlined"
      readonly
      @click="openPicker"
    >
      <template #prepend-inner>
        <div
          class="color-preview"
          :style="{ backgroundColor: displayValue || '#cccccc' }"
          @click.stop="openPicker"
        />
      </template>
      <template #append-inner>
        <v-btn
          v-if="modelValue"
          icon
          size="x-small"
          variant="text"
          @click.stop="copyColor"
        >
          <v-icon size="18">mdi-content-copy</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-dialog v-model="showPicker" max-width="400">
      <v-card>
        <v-card-title class="text-center">اختر اللون</v-card-title>
        <v-card-text>
          <!-- معاينة اللون القديم والجديد -->
          <div class="color-comparison">
            <div class="color-box">
              <div class="color-label">قديم</div>
              <div
                class="color-sample"
                :style="{ backgroundColor: oldColor || '#cccccc' }"
              />
            </div>
            <div class="color-box">
              <div class="color-label">جديد</div>
              <div
                class="color-sample"
                :style="{ backgroundColor: tempColor || '#cccccc' }"
              />
            </div>
          </div>

          <!-- Color Picker -->
          <v-color-picker
            v-model="tempColor"
            class="ma-auto mt-4"
            show-swatches
            hide-inputs
          />

          <!-- Manual Input -->
          <div class="manual-input mt-4">
            <v-text-field
              v-model="tempColor"
              label="أدخل اللون يدوياً"
              variant="outlined"
              density="compact"
              placeholder="#000000"
            />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="cancelPicker">إلغاء</v-btn>
          <v-btn color="primary" @click="applyColor">موافق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'اللون'
  }
})

const emit = defineEmits(['update:modelValue'])

const { success } = useToast()

const showPicker = ref(false)
const tempColor = ref('')
const oldColor = ref('')

// القيمة المعروضة (إذا كانت null أو فارغة، نعرض نص افتراضي)
const displayValue = computed(() => {
  return props.modelValue || '#cccccc'
})

// فتح ال picker
const openPicker = () => {
  oldColor.value = props.modelValue
  tempColor.value = props.modelValue || '#ffffff'
  showPicker.value = true
}

// إلغاء التغييرات
const cancelPicker = () => {
  tempColor.value = ''
  showPicker.value = false
}

// تطبيق اللون الجديد
const applyColor = () => {
  emit('update:modelValue', tempColor.value)
  showPicker.value = false
}

// نسخ اللون
const copyColor = () => {
  if (props.modelValue) {
    navigator.clipboard.writeText(props.modelValue).then(() => {
      success(`تم نسخ اللون: ${props.modelValue}`)
    })
  }
}
</script>

<style lang="scss" scoped>
.color-picker-field {
  width: 100%;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #999;
  }
}

.color-comparison {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 16px 0;
}

.color-box {
  text-align: center;
}

.color-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.color-sample {
  width: 80px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.manual-input {
  max-width: 100%;
}
</style>
