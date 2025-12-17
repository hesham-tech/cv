<template>
  <transition name="fade-slide">
    <div v-show="showButton" :style="lang === 'en' ? { right: '30px' } : { left: '30px' }" class="scroll-top-button"
      @click="scrollToTop">
      <div class="progress-ring">
        <svg width="60" height="60">
          <defs>
            <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle class="progress-ring-circle-bg" cx="30" cy="30" r="26" />
          <circle class="progress-ring-circle" cx="30" cy="30" r="26" :style="{ strokeDashoffset: progressOffset }" />
        </svg>
        <span class="scroll-icon">↑</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const lang = route.params.lang;
const showButton = ref(false);
const scrollProgress = ref(0);
let lastScrollTop = 0;

const circumference = 2 * Math.PI * 26;
const progressOffset = computed(() => {
  return circumference - (scrollProgress.value / 100) * circumference;
});

const handleScroll = () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.value = (currentScrollTop / windowHeight) * 100;

  if (currentScrollTop > lastScrollTop || currentScrollTop < 300) {
    showButton.value = false;
  } else {
    showButton.value = true;
  }
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
@import '@/styles/modern-design.css';

.scroll-top-button {
  position: fixed;
  bottom: 30px;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 1000;
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-4px);

    .progress-ring-circle {
      stroke: var(--secondary-500);
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.95);
  }
}

.progress-ring {
  position: relative;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  box-shadow: var(--shadow-colored);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-90deg);
  }
}

.progress-ring-circle-bg {
  fill: none;
  stroke: rgba(102, 126, 234, 0.1);
  stroke-width: 3;
}

.progress-ring-circle {
  fill: none;
  stroke: url(#scroll-gradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 163.36;
  transition: stroke-dashoffset 0.1s ease, stroke var(--transition-base);
}

.scroll-icon {
  font-size: 1.5rem;
  font-weight: var(--font-black);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: 1;
}

/* Fade slide transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Add SVG gradient definition */
:deep(svg) {
  defs {
    linearGradient#gradient {
      stop {
        &:first-child {
          stop-color: #667eea;
        }

        &:last-child {
          stop-color: #764ba2;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .scroll-top-button {
    width: 50px;
    height: 50px;
    bottom: 20px;
  }

  .progress-ring {
    width: 50px;
    height: 50px;

    svg {
      width: 50px;
      height: 50px;

      circle {
        r: 21;
      }
    }
  }

  .scroll-icon {
    font-size: 1.25rem;
  }
}
</style>


