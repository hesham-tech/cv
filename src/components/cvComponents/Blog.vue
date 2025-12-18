<template>
  <div class="modern-blog">
    <div class="blog-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 class="section-title gradient-text">
          {{ lang === 'en' ? 'Blog' : 'المدونة' }}
        </h2>
        <p class="section-subtitle">
          {{ lang === 'en' ? 'Latest Thoughts & Ideas' : 'أحدث الأفكار والمقالات' }}
        </p>
        <div class="title-underline"></div>
      </div>

      <!-- Coming Soon Message -->
      <div class="coming-soon glass-card">
        <div class="coming-soon-icon">
          <span class="icon-emoji">📝</span>
        </div>
        <h3 class="coming-soon-title">
          {{ lang === 'en' ? 'Coming Soon!' : 'قريباً!' }}
        </h3>
        <p class="coming-soon-text">
          {{ lang === 'en'
            ? 'I\'m working on some amazing content to share with you. Stay tuned for insightful articles and tutorials!'
            : 'أعمل على محتوى رائع لمشاركته معك. ترقب مقالات ودروس مفيدة قريباً!'
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const lang = route.params.lang;
</script>

<style lang="scss" scoped>
.modern-blog {
  padding: var(--space-8) var(--space-6);
  min-height: 400px;
  display: flex;
  align-items: center;
}

.blog-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
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

.section-subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: var(--gradient-primary);
  margin: 0 auto;
  border-radius: var(--radius-full);
}

.coming-soon {
  padding: var(--space-12);
  text-align: center;
  animation: fadeInUp 0.8s ease;
}

.coming-soon-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
  box-shadow: var(--shadow-colored-lg);

  .icon-emoji {
    font-size: 4rem;
  }
}

.coming-soon-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-black);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-4);
}

.coming-soon-text {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .modern-blog {
    padding: var(--space-6) var(--space-4);
  }

  .coming-soon {
    padding: var(--space-8);
  }

  .coming-soon-icon {
    width: 100px;
    height: 100px;

    .icon-emoji {
      font-size: 3rem;
    }
  }
}
</style>
