<template>
  <div class="modern-about">
    <div class="about-card glass-card">
      <!-- Section Title -->
      <div class="section-header">
        <h2 v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" class="section-title gradient-text"
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style">
          {{ lang == 'en' ? 'About Me' : 'عني' }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <!-- Main Title -->
      <h3 v-if="userStore.userAll.user.theme?.about?.mainTitle.enabled"
        :style="userStore.userAll.user.theme?.about?.mainTitle.style" class="about-heading">
        {{ lang == 'en' ? 'Who Am I?' : 'من أنا؟' }}
      </h3>

      <!-- Subtitle -->
      <p v-if="userStore.userAll.user.theme?.about.subTitle.enabled"
        :style="userStore.userAll.user.theme.about.subTitle.style" class="about-intro">
        <strong>{{ `${lang === 'en' ? 'Hello, I am' : 'مرحباً، أنا'} ${userStore.userAll.user.last_name[lang] || ''}`
        }}</strong>
      </p>

      <!-- Bio -->
      <pre v-if="userStore.userAll.user.theme?.about.paragraph.enabled"
        :style="userStore.userAll.user.theme.about.paragraph.style"
        class="about-bio">{{ lang === 'en' ? userStore.userAll.user.about_en : userStore.userAll.user.about_ar }}</pre>

      <!-- Social Icons -->
      <div v-if="userStore.userAll.user.theme.socials?.about?.enabled" class="about-socials">
        <a v-for="(social, i) in userStore.userAll.socials" :key="i" :href="social.url" target="_blank"
          class="social-link">
          <v-icon :color="social.icon.color" :icon="social.icon.icon" size="26"></v-icon>
        </a>
      </div>

      <!-- CTA Button -->
      <div v-if="userStore.userAll.user.theme?.about.button?.enabled" class="about-cta">
        <a href="#h-contact" class="btn-modern btn-primary">
          {{ lang == 'en' ? 'Contact Me' : 'تواصل معي' }}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
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

.modern-about {
  padding: var(--space-8) var(--space-6);
}

.about-card {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-12);
  animation: fadeInUp 0.8s ease;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-10);
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
  animation: expandWidth 0.8s ease;
}

@keyframes expandWidth {
  from {
    width: 0;
  }

  to {
    width: 80px;
  }
}

.about-heading {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  text-align: center;
}

.about-intro {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-6);

  strong {
    color: var(--primary-600);
    font-weight: var(--font-semibold);
  }
}

.about-bio {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
  white-space: pre-wrap;
  text-align: center;
}

.about-socials {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.social-link {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--gradient-primary);
    border-radius: 50%;
    opacity: 0;
    transition: opacity var(--transition-base);
    z-index: -1;
  }

  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: var(--shadow-colored);

    &::before {
      opacity: 1;
    }
  }
}

.about-cta {
  text-align: center;

  .btn-modern {
    padding: var(--space-4) var(--space-8);
    font-size: var(--text-lg);

    svg {
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateX(4px);
    }
  }
}

@media (max-width: 768px) {
  .modern-about {
    padding: var(--space-6) var(--space-4);
  }

  .about-card {
    padding: var(--space-8);
  }

  .social-link {
    width: 44px;
    height: 44px;
  }
}
</style>
