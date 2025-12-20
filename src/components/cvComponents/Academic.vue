<template>
  <div class="modern-academic">
    <div class="academic-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" class="section-title gradient-text"
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style">
          {{ lang == 'en' ? 'Education' : 'التعليم' }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <!-- Timeline -->
      <div class="timeline">
        <div v-for="(item, index) in userStore.userAll.academics" :key="item.id" class="timeline-item"
          :class="{ 'timeline-item-left': index % 2 === 0, 'timeline-item-right': index % 2 !== 0 }">
          <!-- Timeline dot -->
          <div class="timeline-dot">
            <div class="dot-inner"></div>
          </div>

          <!-- Content Card -->
          <div class="timeline-card glass-card">
            <!-- Institution -->
            <h3 class="institution-name">{{ item.institution[lang] }}</h3>

            <!-- Degree & Field -->
            <div class="degree-info">
              <span class="degree-badge">{{ item.degree[lang] }}</span>
              <span class="field-text">{{ item.field_of_study[lang] }}</span>
            </div>

            <!-- Dates -->
            <div class="date-range">
              <span class="date-icon">📅</span>
              <span>{{ item.start_date }} - {{ item.end_date }}</span>
            </div>

            <!-- Grade -->
            <div v-if="item.grade" class="grade-info">
              <span class="grade-label">{{ lang === 'en' ? 'Grade' : 'التقدير' }}:</span>
              <span class="grade-value">{{ item.grade[lang] }}</span>
            </div>

            <!-- Image -->
            <v-img v-if="userStore.userAll.user.theme?.academics?.imag.enabled && item.photos?.length"
              :src="item.photos[0].path" class="academic-image" cover aspect-ratio="16/9"></v-img>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const lang = route.params.lang;
</script>

<style lang="scss" scoped>
.modern-academic {
  padding: var(--space-8) var(--space-6);
}

.academic-container {
  max-width: 1000px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: var(--font-black);
  margin-bottom: var(--space-4);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  margin: 0 auto;
  border-radius: var(--radius-full);
}

/* Timeline */
.timeline {
  position: relative;
  padding: var(--space-8) 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--gradient-primary);
    transform: translateX(-50%);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: var(--space-12);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-6);
  align-items: center;
}

.timeline-item-left .timeline-card {
  grid-column: 1;
  /* انيميشن: دخول من اليسار */
  /* ملاحظة: هذا الانيميشن معرف في modern-design.css */
  animation: slideInLeft 0.6s ease;
}

.timeline-item-right .timeline-card {
  grid-column: 3;
  /* انيميشن: دخول من اليمين */
  /* ملاحظة: هذا الانيميشن معرف في modern-design.css */
  animation: slideInRight 0.6s ease;
}

.timeline-dot {
  grid-column: 2;
  width: 24px;
  height: 24px;
  background: white;
  border: 3px solid var(--primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.1);
  transition: all var(--transition-base);

  &:hover {
    transform: scale(1.3);
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0.2);
  }
}

.dot-inner {
  width: 10px;
  height: 10px;
  background: var(--primary-600);
  border-radius: 50%;
}

.timeline-card {
  padding: var(--space-6);
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-colored-lg);
  }
}

.institution-name {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.degree-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  align-items: center;
}

.degree-badge {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.field-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.date-range {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.date-icon {
  font-size: var(--text-lg);
}

.grade-info {
  margin-bottom: var(--space-4);
  font-size: var(--text-base);
}

.grade-label {
  color: var(--text-secondary);
  margin-right: var(--space-2);
}

.grade-value {
  color: var(--primary-600);
  font-weight: var(--font-semibold);
}

.academic-image {
  margin-top: var(--space-4);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .modern-academic {
    padding: var(--space-6) var(--space-4);
  }

  .timeline {
    padding-left: var(--space-8);

    &::before {
      left: 12px;
    }
  }

  .timeline-item {
    grid-template-columns: auto 1fr;
    gap: var(--space-4);
  }

  .timeline-item-left .timeline-card,
  .timeline-item-right .timeline-card {
    grid-column: 2;
  }

  .timeline-dot {
    grid-column: 1;
    grid-row: 1;
  }
}
</style>
