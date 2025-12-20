<template>
  <div class="modern-hero">
    <!-- Animated Gradient Background -->
    <div class="hero-gradient-bg"></div>

    <!-- Image Carousel -->
    <v-carousel 
      v-if="userStore.userAll.user" 
      class="hero-carousel" 
      height="100vh" 
      cycle 
      :show-arrows="false"
      :hide-delimiter-background="userStore.userAll.user.hero.length <= 1"
      :hide-delimiters="userStore.userAll.user.hero.length <= 1" 
      interval="6000"
    >
      <v-carousel-item v-for="(photo, i) in userStore.userAll.user.hero" :key="i">
        <v-img :src="photo.path" height="100%" cover class="hero-image"></v-img>
      </v-carousel-item>
    </v-carousel>

    <!-- Glassmorphic Overlay -->
    <div class="hero-overlay"></div>

    <!-- Content -->
    <div class="hero-content">
      <div class="hero-content-inner animate-fade-in-up">
        <!-- Greeting -->
        <p class="hero-greeting">
          {{ lang === 'en' ? 'Hello, I am 👋' : 'مرحباً، أنا 👋' }}
        </p>

        <!-- Name -->
        <h1 
          v-if="userStore.userAll.user.theme?.hero?.mainTitle?.enabled" 
          class="hero-title"
          :style="userStore.userAll.user.theme?.hero?.mainTitle?.style"
        >
          {{ userStore.userAll.user.last_name[lang] || '' }}
        </h1>

        <!-- Position with typewriter effect -->
        <div class="hero-position-wrapper">
          <p 
            v-if="userStore.userAll.user.theme?.hero?.subTitle?.enabled" 
            class="hero-position"
            :style="userStore.userAll.user.theme?.hero?.subTitle?.style"
          >
            {{ displayedposition }}<span class="cursor-blink">|</span>
          </p>
        </div>

        <!-- Bio -->
        <pre 
          v-if="userStore.userAll.user.theme?.hero?.paragraph?.enabled" 
          class="hero-bio"
          :style="userStore.userAll.user.theme?.hero?.paragraph?.style"
        >{{ lang === 'en' ? userStore.userAll.user.bio_en : userStore.userAll.user.bio_ar }}</pre>

        <!-- CTA Buttons -->
        <div class="hero-buttons">
          <a 
            v-if="userStore.userAll.user.theme?.hero?.buttonWork?.enabled" 
            href="#h-work"
            class="btn-modern btn-primary hero-btn" 
            :style="userStore.userAll.user.theme?.hero?.buttonWork?.style"
          >
            <span>{{ lang === 'en' ? 'View My Work' : 'مشاهدة أعمالي' }}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a 
            v-if="userStore.userAll.user.theme?.hero?.buttonCv?.enabled" 
            class="btn-modern btn-glass hero-btn"
            :style="userStore.userAll.user.theme?.hero?.buttonCv?.style"
          >
            <span>{{ lang === 'en' ? 'Download Resume' : 'تحميل السيرة الذاتية' }}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.5 12.5v3.333a1.667 1.667 0 01-1.667 1.667H4.167A1.667 1.667 0 012.5 15.833V12.5M5.833 8.333L10 12.5m0 0l4.167-4.167M10 12.5V2.5"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>

        <!-- Social Icons -->
        <div v-if="userStore.userAll.user.theme?.socials?.hero?.enabled" class="hero-socials">
          <a 
            v-for="(social, i) in userStore.userAll.socials" 
            :key="i" 
            :href="social.url" 
            target="_blank"
            class="social-icon"
            :aria-label="social.name"
          >
            <v-icon :color="social.icon.color" :icon="social.icon.icon" size="28"></v-icon>
          </a>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div v-show="showscrollIndicator" class="scroll-indicator">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span class="scroll-text">{{ lang === 'en' ? 'Scroll Down' : 'مرر للأسفل' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted, ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const lang = route.params.lang;
const position = ref(userStore.userAll.user.position[lang]);
const speed = 150;
const displayedposition = ref('');

function type() {
  let i = 0;
  function typeChar() {
    if (position.value) {
      if (i < position.value.length) {
        displayedposition.value += position.value.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      } else {
        setTimeout(() => {
          displayedposition.value = '';
          type();
        }, 2000);
      }
    }
  }
  typeChar();
}

const showscrollIndicator = ref(true);

const handleScroll = () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  showscrollIndicator.value = currentScrollTop <= 100;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  type();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.modern-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animated Gradient Background */
.hero-gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  z-index: 1;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Image Carousel */
.hero-carousel {
  position: absolute;
  inset: 0;
  z-index: 2;

  :deep(.v-carousel__controls) {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    padding: 8px 16px;
    bottom: 60px;
  }
}

.hero-image {
  filter: brightness(0.7);
}

/* Glassmorphic Overlay */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur(2px);
  z-index: 3;
}

/* Content */
.hero-content {
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.hero-content-inner {
  max-width: 900px;
  animation-delay: 0.2s;
}

/* Greeting (صغير) */
.hero-greeting {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: var(--font-regular);
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInDown 0.6s ease;
}

/* Title (كبير وبارز) */
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: var(--font-black);
  color: white;
  margin-bottom: 1rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  
  /* Gradient Effect */
  background: linear-gradient(135deg, #ffffff 0%, #a8edea 50%, #fed6e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  /* Shadow للنص */
  filter: drop-shadow(0 4px 20px rgba(168, 237, 234, 0.3));
  
  animation: fadeInUp 0.8s ease 0.3s both;
}

/* Position (متوسط) */
.hero-position-wrapper {
  margin-bottom: 2rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-position {
  font-family: var(--font-body);
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  font-weight: var(--font-medium);
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  display: inline-block;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.3px;
}

.cursor-blink {
  color: rgba(255, 255, 255, 0.9);
  animation: blink 1s step-end infinite;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.9);
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* Bio */
.hero-bio {
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2.5rem;
  max-width: 700px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  white-space: pre-wrap;
}

/* CTA Buttons */
.hero-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: var(--font-semibold);
  min-width: fit-content;
  white-space: nowrap;
  letter-spacing: 0.5px;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;

  svg {
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 10px 30px -10px rgba(102, 126, 234, 0.5);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px -10px rgba(102, 126, 234, 0.7);
  }
}

.btn-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
}

/* Social Icons */
.hero-socials {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.social-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

.scroll-mouse {
  width: 26px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-wheel {
  width: 3px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(12px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -10px);
  }
}

.scroll-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: var(--font-medium);
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    padding: 1.5rem;
  }

  .hero-greeting {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

  .hero-title {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .hero-position-wrapper {
    min-height: 50px;
    margin-bottom: 1.5rem;
  }

  .hero-position {
    font-size: 1.25rem;
  }

  .hero-bio {
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
    margin: 0 auto 2rem;
  }

  .hero-btn {
    width: 100%;
    justify-content: center;
  }

  .hero-socials {
    gap: 1rem;
  }

  .social-icon {
    width: 44px;
    height: 44px;
  }

  .scroll-indicator {
    bottom: 20px;
  }
}

@media (max-width: 480px) {
  .hero-greeting {
    font-size: 0.9rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-position {
    font-size: 1.1rem;
  }

  .hero-bio {
    font-size: 0.85rem;
  }

  .hero-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
}
</style>