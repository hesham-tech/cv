<template>
  <div class="hero-wrapper position-relative" style="height: 100vh;">
      <v-carousel
        v-if="userStore.userAll.user"
        height="100%"
        hide-delimiters
        :show-arrows="false"
        cycle
        :interval="6000"
      >
        <v-carousel-item
          v-for="(photo, i) in userStore.userAll.user.hero"
          :key="i"
          :src="photo.path"
          cover
        >
          <div class="d-flex fill-height bg-gradient-overlay"></div>
        </v-carousel-item>
      </v-carousel>

      <!-- Content Overlay -->
      <div class="hero-content d-flex flex-column justify-center align-center text-center">
        
        <!-- Main Title -->
        <h1 
          v-if="userStore.userAll.user.theme?.hero?.mainTitle.enabled" 
          class="text-h3 text-md-h2 text-lg-h1 font-weight-bold text-white mb-4 animate__animated animate__fadeInDown"
          style="text-shadow: 2px 2px 8px rgba(0,0,0,0.5);"
        >
          {{ lang === 'en' ? 'Hello, I am' : 'مرحبا، أنا' }}
          <span class="text-secondary">{{ userStore.userAll.user.first_name[lang] }}</span>
        </h1>

        <!-- Sub Title / Position (Typing Effect) -->
        <div 
           v-if="userStore.userAll.user.theme?.hero.subTitle.enabled"
           class="text-h5 text-md-h4 text-grey-lighten-1 mb-6 font-weight-light"
           style="min-height: 1.5em;"
        >
           {{ displayedposition }}<span class="cursor-blink">|</span>
        </div>

        <!-- Bio Paragraph -->
        <p 
          v-if="userStore.userAll.user.theme?.hero.paragraph.enabled"
          class="text-body-1 text-md-h6 text-grey-lighten-2 mb-8 mx-auto px-4"
          style="max-width: 800px; line-height: 1.8;"
        >
          {{ lang === 'en' ? userStore.userAll.user.bio_en : userStore.userAll.user.bio_ar }}
        </p>

        <!-- CTA Buttons -->
        <div class="d-flex gap-4 flex-wrap justify-center animate__animated animate__fadeInUp animate__delay-1s">
            <v-btn
              v-if="userStore.userAll.user.theme?.hero.buttonWork?.enabled"
              href="#h-work"
              color="primary"
              size="x-large"
              rounded="pill"
              elevation="4"
              class="text-capitalize px-8"
              prepend-icon="mdi-briefcase-outline"
            >
               {{ lang === 'en' ? 'View Work' : 'أعمالي' }}
            </v-btn>

            <v-btn
              v-if="userStore.userAll.user.theme?.hero.buttonCv?.enabled"
              color="white"
              variant="outlined"
              size="x-large"
              rounded="pill"
              class="text-capitalize px-8"
              prepend-icon="mdi-download"
            >
               {{ lang === 'en' ? 'Resume' : 'السيرة الذاتية' }}
            </v-btn>
        </div>

        <!-- Socials -->
        <div v-if="userStore.userAll.user.theme.socials?.hero.enabled" class="d-flex gap-2 mt-8">
            <v-btn
              v-for="(social, i) in userStore.userAll.socials" 
              :key="i"
              :href="social.url"
              target="_blank"
              icon
              variant="text"
              color="white"
            >
                <v-icon size="large" :icon="social.icon.icon"></v-icon>
            </v-btn>
        </div>

        <!-- Scroll Indicator -->
        <div 
          v-show="showscrollIndicator" 
          class="scroll-indicator position-absolute bottom-0 mb-8 animate__animated animate__fadeIn animate__delay-2s"
          @click="scrollToAbout"
          style="cursor: pointer"
        >
            <div class="d-flex flex-column align-center mouse-scroll">
                <span class="text-caption text-uppercase text-grey-lighten-2 mb-2" style="letter-spacing: 2px;">Scroll</span>
                <v-icon icon="mdi-chevron-down" color="secondary" class="animate-bounce" size="large"></v-icon>
            </div>
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
const speed = 100;
const displayedposition = ref('');
const showscrollIndicator = ref(true);

// Typing Effect
let typingTimeout;
function type() {
  let i = 0;
  displayedposition.value = ''; // Reset
  
  function typeChar() {
    if (position.value && i < position.value.length) {
      displayedposition.value += position.value.charAt(i);
      i++;
      typingTimeout = setTimeout(typeChar, speed);
    } else {
        // Loop
        typingTimeout = setTimeout(() => {
            type();
        }, 3000);
    }
  }
  typeChar();
}

const handleScroll = () => {
  showscrollIndicator.value = window.pageYOffset < 100;
};

const scrollToAbout = () => {
    const aboutSection = document.getElementById('h-about');
    if(aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  type();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if(typingTimeout) clearTimeout(typingTimeout);
});
</script>

<style lang="scss" scoped>
.hero-wrapper {
    overflow: hidden;
}

.bg-gradient-overlay {
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.4) 0%,
        rgba(0, 0, 0, 0.7) 60%,
        rgba(0, 0, 0, 0.9) 100%
    );
}

.hero-content {
    position: absolute;
    inset: 0;
    z-index: 2;
    padding: 2rem;
}

.cursor-blink {
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

.animate-bounce {
    animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
