<template>
  <div class="modern-skills">
    <div class="skills-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" class="section-title gradient-text"
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style">
          {{ lang == 'en' ? 'My Skills' : 'مهاراتي' }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <!-- Skills Grid -->
      <div class="skills-grid">
        <div v-for="(skill, index) in userStore.userAll.skills" :key="index" @click="funSelectedSkill(skill)"
          class="skill-card glass-card" :style="{ '--index': index }">
          <!-- Skill Image & Progress -->
          <div class="skill-image-wrapper">
            <div class="skill-image-border"></div>
            <v-avatar v-if="userStore.userAll.user.theme?.skills.imag.enabled" size="100" class="skill-avatar">
              <v-img :src="skill.photos[0]?.path" alt="Skill Image" class="skill-image"></v-img>
            </v-avatar>

            <!-- Circular Progress -->
            <v-progress-circular v-if="userStore.userAll.user.theme?.skills.progress.enabled" class="skill-progress"
              :model-value="skill.level" :rotate="-90" :size="130" :width="8"
              :color="userStore.userAll.user.theme?.skills.progress.backgroundColor || '#667eea'">
              <span class="progress-text">{{ skill?.level }}%</span>
            </v-progress-circular>
          </div>

          <!-- Skill Name -->
          <h3 v-if="userStore.userAll.user.theme?.skills.mainTitle.enabled"
            :style="userStore.userAll.user.theme?.skills.mainTitle.style" class="skill-name">
            {{ skill.name[lang] }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Skill Detail Dialog -->
    <v-dialog v-model="dialogSkill" max-width="550px" class="skill-dialog">
      <v-card class="dialog-card glass-card">
        <!-- Close Button -->
        <v-btn icon="mdi-close" class="close-btn" @click="dialogSkill = false" size="small" color="primary"
          variant="text"></v-btn>

        <!-- Dialog Content -->
        <div class="dialog-content">
          <!-- Skill Image -->
          <v-avatar v-if="selectedSkill?.photos?.[0]" size="120" class="dialog-avatar">
            <v-img :src="selectedSkill?.photos[0]?.path" alt="Skill Image"></v-img>
          </v-avatar>

          <!-- Skill Name -->
          <h2 class="dialog-title">{{ selectedSkill?.name[lang] }}</h2>

          <!-- Progress Bar -->
          <v-progress-linear v-if="userStore.userAll.user.theme?.skills.subTitle.enabled" class="skill-progress-bar"
            :model-value="selectedSkill?.level"
            :color="userStore.userAll.user.theme?.skills.progress.backgroundColor || '#667eea'" height="10" rounded>
            <template v-slot:default>
              <strong>{{ selectedSkill?.level }}%</strong>
            </template>
          </v-progress-linear>

          <!-- Description -->
          <pre v-if="userStore.userAll.user.theme?.skills.subTitle.enabled"
            :style="userStore.userAll.user.theme?.skills.subTitle.style" class="dialog-description">{{
              selectedSkill?.description[lang] }}</pre>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const lang = route.params.lang;
const selectedSkill = ref(null);
const dialogSkill = ref(false);

function funSelectedSkill(skill) {
  selectedSkill.value = skill;
  dialogSkill.value = true;
}
</script>

<style lang="scss" scoped>
@import '@/styles/modern-design.css';

.modern-skills {
  padding: var(--space-8) var(--space-6);
}

.skills-container {
  max-width: 1200px;
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-6);
}

.skill-card {
  padding: var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  animation: fadeInUp calc(0.1s * var(--index)) ease;
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: var(--shadow-colored-lg);

    .skill-image-border {
      animation: rotateGradient 2s linear infinite;
    }
  }
}

.skill-image-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-image-border {
  position: absolute;
  inset: -4px;
  background: var(--gradient-primary);
  border-radius: 50%;
  z-index: 0;
}

.skill-avatar {
  position: relative;
  z-index: 1;
  border: 3px solid white;
  box-shadow: var(--shadow-lg);
}

.skill-image {
  opacity: 0.9;
}

.skill-progress {
  position: absolute;
  inset: 0;
  margin: auto;
  z-index: 2;
}

.progress-text {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--primary-600);
}

.skill-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

/* Dialog Styles */
.dialog-card {
  padding: var(--space-8);
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 10;
}

.dialog-content {
  text-align: center;
}

.dialog-avatar {
  margin-bottom: var(--space-4);
  border: 4px solid var(--primary-200);
  box-shadow: var(--shadow-xl);
}

.dialog-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.skill-progress-bar {
  margin: 0 auto var(--space-6);
  max-width: 400px;
  border-radius: var(--radius-full);
  overflow: hidden;

  :deep(.v-progress-linear__determinate) {
    background: var(--gradient-primary);
  }
}

.dialog-description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  white-space: pre-wrap;
  margin: 0;
}

@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .modern-skills {
    padding: var(--space-6) var(--space-4);
  }

  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-4);
  }

  .skill-card {
    padding: var(--space-4);
  }

  .skill-image-wrapper {
    width: 110px;
    height: 110px;
  }

  .skill-avatar {
    width: 80px !important;
    height: 80px !important;
  }

  .skill-progress {
    :deep(.v-progress-circular) {
      width: 110px !important;
      height: 110px !important;
    }
  }
}
</style>
