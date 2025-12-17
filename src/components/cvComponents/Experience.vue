<template>
  <div class="modern-experience">
    <div class="experience-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" class="section-title gradient-text"
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style">
          {{ lang == 'en' ? 'Experience' : 'الخبرات' }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <!-- Experience Timeline -->
      <div class="experience-timeline">
        <div v-for="(item, index) in userStore.userAll.experiences" :key="item.id" class="experience-item"
          :style="{ '--index': index }">
          <!-- Icon/Avatar -->
          <div class="experience-icon">
            <v-avatar v-if="item.photos?.[0]" size="60" class="experience-avatar">
              <v-img :src="item.photos[0].path"></v-img>
            </v-avatar>
            <div v-else class="default-icon">💼</div>
          </div>

          <!-- Content Card -->
          <div class="experience-card glass-card">
            <!-- Date Badge -->
            <div class="date-badge">
              <span class="date-icon">📅</span>
              <span class="date-text">{{ item.start_date }}</span>
              <span class="date-separator">→</span>
              <span class="date-text">
                {{ Number(item.end_date[lang]) === 1 ? (lang == 'en' ? 'Present' : 'حتى الآن') : item.end_date[lang] }}
              </span>
            </div>

            <!-- Title & Company -->
            <h3 class="experience-title">{{ item.title[lang] }}</h3>
            <h4 class="experience-company">{{ item.company[lang] }}</h4>

            <!-- Description -->
            <p class="experience-description">{{ item.description[lang] }}</p>

            <!-- Current Job Indicator -->
            <div v-if="Number(item.end_date[lang]) === 1" class="current-badge">
              <span class="pulse-dot"></span>
              <span>{{ lang == 'en' ? 'Current Position' : 'الوظيفة الحالية' }}</span>
            </div>
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
@import '@/styles/modern-design.css';

.modern-experience {
  padding: var(--space-8) var(--space-6);
}

.experience-container {
  max-width: 900px;
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
.experience-timeline {
  position: relative;
  padding-left: var(--space-12);

  &::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--gradient-primary);
  }
}

.experience-item {
  position: relative;
  margin-bottom: var(--space-10);
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
  animation: fadeInUp calc(0.2s * var(--index)) ease;
}

.experience-icon {
  position: absolute;
  left: -46px;
  top: 0;
  z-index: 2;
}

.experience-avatar {
  border: 3px solid white;
  box-shadow: 0 0 0 4px var(--primary-600), var(--shadow-lg);
}

.default-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  border-radius: 50%;
  font-size: 28px;
  box-shadow: 0 0 0 4px white, var(--shadow-lg);
}

.experience-card {
  flex: 1;
  padding: var(--space-6);
  transition: all var(--transition-base);

  &:hover {
    transform: translateX(8px);
    box-shadow: var(--shadow-colored-lg);
  }
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: rgba(102, 126, 234, 0.1);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
  color: var(--primary-700);
  font-weight: var(--font-medium);
}

.date-icon {
  font-size: var(--text-base);
}

.date-separator {
  color: var(--primary-500);
}

.experience-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.experience-company {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--primary-600);
  margin-bottom: var(--space-4);
}

.experience-description {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.current-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--radius-full);
  color: rgb(21, 128, 61);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: rgb(34, 197, 94);
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modern-experience {
    padding: var(--space-6) var(--space-4);
  }

  .experience-timeline {
    padding-left: var(--space-10);

    &::before {
      left: 20px;
    }
  }

  .experience-icon {
    left: -36px;
  }

  .experience-avatar,
  .default-icon {
    width: 50px !important;
    height: 50px !important;
    font-size: 24px;
  }

  .experience-card {
    padding: var(--space-4);

    &:hover {
      transform: translateX(4px);
    }
  }
}
</style>
