<template>
  <div class="modern-services">
    <div class="services-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 class="section-title gradient-text">
          {{ lang === 'en' ? 'Services' : 'الخدمات' }}
        </h2>
        <p class="section-subtitle">
          {{ lang === 'en' ? 'What I Can Do For You' : 'ما يمكنني تقديمه لك' }}
        </p>
        <div class="title-underline"></div>
      </div>

      <!-- Services Grid -->
      <div class="services-grid">
        <div class="service-card glass-card">
          <div class="service-icon" style="--icon-color: #667eea">
            <span class="icon-emoji">💡</span>
          </div>
          <h3 class="service-title">{{ lang === 'en' ? 'Innovative Ideas' : 'أفكار إبداعية' }}</h3>
          <p class="service-description">
            {{ lang === 'en' ? 'Creative solutions to transform your vision into reality with cutting-edge technology' :
              'حلول إبداعية لتحويل رؤيتك إلى واقع باستخدام أحدث التقنيات' }}
          </p>
        </div>

        <div class="service-card glass-card">
          <div class="service-icon" style="--icon-color: #764ba2">
            <span class="icon-emoji">💻</span>
          </div>
          <h3 class="service-title">{{ lang === 'en' ? 'Software Development' : 'تطوير البرمجيات' }}</h3>
          <p class="service-description">
            {{ lang === 'en' ? 'Full-stack development with modern frameworks and best practices' : 'تطوير متكامل باستخدام أحدث الأطر والممارسات' }}
          </p>
        </div>

        <div class="service-card glass-card">
          <div class="service-icon" style="--icon-color: #f093fb">
            <span class="icon-emoji">📱</span>
          </div>
          <h3 class="service-title">{{ lang === 'en' ? 'Mobile Applications' : 'تطبيقات الجوال' }}</h3>
          <p class="service-description">
            {{ lang === 'en' ? 'Cross-platform mobile apps with native performance and beautiful UI' : 'تطبيقات جوال متعددة المنصات بأداء وتصميم ممتاز' }}
          </p>
        </div>

        <div class="service-card glass-card">
          <div class="service-icon" style="--icon-color: #4facfe">
            <span class="icon-emoji">🎨</span>
          </div>
          <h3 class="service-title">{{ lang === 'en' ? 'UI/UX Design' : 'تصميم واجهات المستخدم' }}</h3>
          <p class="service-description">
            {{ lang === 'en' ? 'User-centered design that creates engaging and intuitive experiences' : 'تصميم يركز على المستخدم لتجربة جذابة وسهلة' }}
          </p>
        </div>

        <div class="service-card glass-card">
          <div class="service-icon" style="--icon-color: #54a0ff">
            <span class="icon-emoji">☁️</span>
          </div>
          <h3 class="service-title">{{ lang === 'en' ? 'Cloud Solutions' : 'الحلول السحابية' }}</h3>
          <p class="service-description">
            {{ lang === 'en' ? 'Scalable cloud infrastructure and deployment strategies' : 'بنية تحتية سحابية قابلة للتوسع واستراتيجيات نشر' }}
          </p>
        </div>

        <div class="service-card glass-card">
          <div class="service-icon" style="--icon-color: #48dbfb">
            <span class="icon-emoji">🔧</span>
          </div>
          <h3 class="service-title">{{ lang === 'en' ? 'Consulting' : 'الاستشارات' }}</h3>
          <p class="service-description">
            {{ lang === 'en' ? 'Technical consulting and strategic planning for your projects' : 'استشارات تقنية وتخطيط استراتيجي لمشاريعك' }}
          </p>
        </div>
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
.modern-services {
  padding: var(--space-8) var(--space-6);
  background: linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.05) 100%);
}

.services-container {
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.service-card {
  padding: var(--space-8);
  text-align: center;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--icon-color, var(--primary-600));
    transform: scaleX(0);
    transition: transform var(--transition-base);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-colored-lg);

    &::before {
      transform: scaleX(1);
    }

    .service-icon {
      transform: scale(1.1) rotateY(360deg);
    }
  }
}

.service-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto var(--space-5);
  background: var(--icon-color, var(--primary-600));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  .icon-emoji {
    font-size: 3rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
}

.service-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}

.service-description {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .modern-services {
    padding: var(--space-6) var(--space-4);
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .service-card {
    padding: var(--space-6);
  }
}
</style>
