<template>
  <!-- Dialog لعرض تفاصيل المشروع -->
  <v-dialog v-model="projectDialog" :fullscreen="xs" max-width="900">
    <v-card class="modern-dialog glass-card">
      <v-icon @click="projectDialog = false" class="icon-close" size="40" color="white" icon="mdi-close"></v-icon>
      <v-row>
        <v-col cols="12">
          <h3 class="dialog-title">{{ item.title[lang] }}</h3>
          <div class="title-divider"></div>
        </v-col>
        <v-col cols="12">
          <p class="dialog-description">{{ item.description[lang] }}</p>
        </v-col>
        <v-col cols="12">
          <a :href="item.url" target="_blank" class="btn-modern btn-primary">
            {{ lang === 'en' ? 'Live Preview' : 'معاينة حية' }}
            <v-icon icon="mdi-web" end></v-icon>
          </a>
        </v-col>
        <v-col cols="12">
          <p class="image-hint">{{ lang === 'en' ? 'Click any image for full view' : 'انقر على أي صورة لعرضها بالكامل'
            }}</p>
          <div class="box-imag">
            <img v-for="(image, index) in item.photos" :key="index" :src="image.path" alt="Image"
              @click="openCarousel(index)" />
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>

  <!-- Dialog لعرض الصور باستخدام Carousel -->
  <v-dialog v-model="carouselDialog" :fullscreen="xs" max-width="900">
    <v-card class="carousel-wrapper">
      <v-icon @click="carouselDialog = false" class="icon-close" size="40" color="white" icon="mdi-close"></v-icon>
      <v-carousel progress="primary" height="100vh" v-model="currentImageIndex">
        <template v-slot:prev="{ props }">
          <v-btn color="success" variant="elevated" @click="props.onClick" icon>
            <v-icon size="40" icon="mdi-chevron-left"></v-icon>
          </v-btn>
        </template>
        <template v-slot:next="{ props }">
          <v-btn color="info" variant="elevated" @click="props.onClick" icon>
            <v-icon size="40" icon="mdi-chevron-right"></v-icon>
          </v-btn>
        </template>
        <v-carousel-item class="carousel-imag" v-for="(image, index) in item.photos" :key="index"
          :src="image.path"></v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>

  <!-- عرض المشاريع -->
  <div class="modern-work">
    <div class="work-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" class="section-title gradient-text"
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style">
          {{ lang == 'en' ? 'My Work' : 'أعمالي' }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <!-- Projects Grid -->
      <div class="work-grid" v-if="userStore.userAll.projects">
        <div v-for="(work, index) in userStore.userAll.projects" :key="index" class="work-card glass-card"
          @click="showProjectDetails(work)" :style="{ '--index': index }">
          <div class="work-image-wrapper">
            <v-img :src="work.photos[0].path" height="250px" cover class="work-image"></v-img>
            <div class="work-overlay">
              <div class="overlay-content">
                <v-icon size="50" color="white" icon="mdi-open-in-new"></v-icon>
                <p>{{ lang === 'en' ? 'View Details' : 'عرض التفاصيل' }}</p>
              </div>
            </div>
          </div>
          <div class="work-content">
            <h3 class="work-title">{{ work.title[lang] }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const lang = route.params.lang;

const projectDialog = ref(false);
const carouselDialog = ref(false);
const currentImageIndex = ref(0);
const item = ref(null);

const { xs } = useDisplay();
const userStore = useUserStore();

const showProjectDetails = project => {
  item.value = project;
  projectDialog.value = true;
};

const openCarousel = index => {
  currentImageIndex.value = index;
  carouselDialog.value = true;
};
</script>

<style lang="scss" scoped>
.modern-work {
  padding: var(--space-8) var(--space-6);
}

.work-container {
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

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}

.work-card {
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  transition: all var(--transition-base);
  animation: fadeInUp calc(0.1s * var(--index)) ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-colored-lg);

    .work-image {
      transform: scale(1.1);
    }

    .work-overlay {
      opacity: 1;
    }
  }
}

.work-image-wrapper {
  position: relative;
  overflow: hidden;
}

.work-image {
  transition: transform 0.5s ease;
}

.work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
  opacity: 0;
  transition: opacity var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
  color: white;

  p {
    margin-top: var(--space-3);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
  }
}

.work-content {
  padding: var(--space-5);
}

.work-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

/* Dialog Styles */
.modern-dialog {
  padding: var(--space-8);
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-black);
  color: var(--text-primary);
  text-align: center;
  margin-bottom: var(--space-2);
}

.title-divider {
  width: 60px;
  height: 3px;
  background: var(--gradient-primary);
  margin: 0 auto var(--space-6);
  border-radius: var(--radius-full);
}

.dialog-description {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--space-6);
}

.image-hint {
  text-align: center;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.box-imag {
  column-count: 1;
  column-gap: 10px;
  padding: 10px;
}

.box-imag img {
  width: 100%;
  height: auto;
  display: block;
  margin-bottom: 10px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-xl);
  }
}

@media (min-width: 30rem) {
  .box-imag {
    column-count: 2;
  }
}

@media (min-width: 48rem) {
  .box-imag {
    column-count: 3;
  }
}

.icon-close {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  position: fixed;
  border-radius: 50%;
  top: 20px;
  right: 20px;
  z-index: 100;
  padding: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
}

.carousel-wrapper {
  background: black;
}

.carousel-imag {
  height: 100%;
  width: auto;
  background-color: #000;
}

@media (max-width: 768px) {
  .modern-work {
    padding: var(--space-6) var(--space-4);
  }

  .work-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .modern-dialog {
    padding: var(--space-6);
  }
}
</style>
