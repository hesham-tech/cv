<template>
  <div class="edit-action-buttons" v-if="isEditMode">
    <!-- زر تعديل المحتوى -->
    <v-tooltip :text="contentTooltip" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon
          size="small"
          color="primary"
          class="action-btn edit-content-btn"
          @click="$emit('edit-content')"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- زر تعديل التنسيقات -->
    <v-tooltip v-if="hasStyle" text="تعديل التنسيقات" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon
          size="small"
          color="secondary"
          class="action-btn edit-style-btn"
          @click="$emit('edit-style')"
        >
          <v-icon>mdi-palette</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- زر إضافة عنصر جديد -->
    <v-tooltip v-if="hasAdd" text="إضافة عنصر جديد" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon
          size="small"
          color="success"
          class="action-btn add-btn"
          @click="$emit('add')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- زر حذف -->
    <v-tooltip v-if="hasDelete" text="حذف" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon
          size="small"
          color="error"
          class="action-btn delete-btn"
          @click="$emit('delete')"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <!-- زر إرجاع للافتراضي -->
    <v-tooltip v-if="hasReset" text="إرجاع للإعدادات الافتراضية" location="top">
      <template v-slot:activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          icon
          size="small"
          color="warning"
          class="action-btn reset-btn"
          @click="$emit('reset')"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEditMode } from '@/composables/useEditMode'

const props = defineProps({
  // نوع العنصر
  elementType: {
    type: String,
    default: 'text' // text, section, list
  },
  // هل يحتوي على تنسيقات
  hasStyle: {
    type: Boolean,
    default: true
  },
  // هل يحتوي على زر إضافة
  hasAdd: {
    type: Boolean,
    default: false
  },
  // هل يحتوي على زر حذف
  hasDelete: {
    type: Boolean,
    default: false
  },
  // هل يحتوي على زر إرجاع للافتراضي
  hasReset: {
    type: Boolean,
    default: false
  },
  // نص tooltip مخصص للمحتوى
  contentTooltip: {
    type: String,
    default: 'تعديل المحتوى'
  }
})

defineEmits(['edit-content', 'edit-style', 'add', 'delete', 'reset'])

const { isEditMode } = useEditMode()
</script>


