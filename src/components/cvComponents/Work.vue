<template>
  <v-container class="py-12">
    <!-- Section Title -->
    <div class="text-center mb-12 animate__animated animate__fadeInUp">
       <h2 
         v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" 
         :style="userStore.userAll.user.theme?.hero?.sectionTitle.style"
         class="text-h4 font-weight-bold text-primary mb-2 text-uppercase"
         style="letter-spacing: 2px;"
       >
         {{ lang == 'en' ? 'My Portfolio' : 'أعمالي' }}
       </h2>
       <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
    </div>

    <!-- Projects Grid -->
    <v-row v-if="userStore.userAll.projects">
      <v-col 
        v-for="(work, index) in userStore.userAll.projects" 
        :key="index" 
        cols="12" 
        md="4"
      >
        <v-hover v-slot="{ isHovering, props }">
           <v-card 
             v-bind="props"
             class="rounded-lg overflow-hidden cursor-pointer" 
             elevation="4"
             @click="showProjectDetails(work)"
           >
              <v-img 
                :src="work.photos[0]?.path" 
                height="240" 
                cover
                class="transition-swing"
                :class="{ 'zoom-effect': isHovering }"
              >
                 <v-overlay
                   :model-value="isHovering"
                   contained
                   scrim="primary"
                   class="align-center justify-center"
                 >
                    <v-btn variant="flat" color="secondary" icon="mdi-magnify-plus-outline"></v-btn>
                 </v-overlay>
              </v-img>

              <div class="pa-4 bg-surface">
                 <h3 class="text-h6 font-weight-bold text-truncate">{{ work.title[lang] }}</h3>
              </div>
           </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Details Dialog -->
    <v-dialog v-model="projectDialog" :fullscreen="xs" max-width="1000" transition="dialog-bottom-transition">
      <v-card class="rounded-xl overflow-hidden">
        <v-toolbar color="surface" elevation="1">
           <v-btn icon="mdi-close" @click="projectDialog = false"></v-btn>
           <v-toolbar-title class="font-weight-bold text-h6">{{ item?.title[lang] }}</v-toolbar-title>
           <v-spacer></v-spacer>
           <v-btn 
             v-if="item?.url" 
             :href="item.url" 
             target="_blank" 
             color="primary" 
             variant="tonal"
             prepend-icon="mdi-open-in-new"
           >
             {{ lang === 'en' ? 'Live Preview' : 'معاينة' }}
           </v-btn>
        </v-toolbar>

        <v-card-text class="pa-6">
           <p class="text-body-1 text-medium-emphasis mb-6">
             {{ item?.description[lang] }}
           </p>

           <!-- Gallery Grid -->
           <v-row v-if="item?.photos?.length">
              <v-col v-for="(photo, idx) in item.photos" :key="idx" cols="12" sm="6" md="4">
                 <v-img 
                   :src="photo.path" 
                   aspect-ratio="1.5" 
                   cover 
                   class="rounded-lg cursor-pointer elevation-2 hover-scale"
                   @click="openCarousel(idx)"
                 ></v-img>
              </v-col>
           </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Fullscreen Carousel -->
    <v-dialog v-model="carouselDialog" fullscreen>
      <v-card color="black" class="d-flex flex-column">
         <v-toolbar color="transparent" theme="dark" absolute>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="carouselDialog = false"></v-btn>
         </v-toolbar>
         
         <div class="flex-grow-1 d-flex align-center">
            <v-carousel v-model="currentImageIndex" hide-delimiters height="100%">
               <v-carousel-item 
                  v-for="(photo, i) in item?.photos" 
                  :key="i"
                  :src="photo.path"
               ></v-carousel-item>
            </v-carousel>
         </div>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const lang = route.params.lang;
const { xs } = useDisplay();
const userStore = useUserStore();

const projectDialog = ref(false); 
const carouselDialog = ref(false); 
const currentImageIndex = ref(0); 
const item = ref(null); 

const showProjectDetails = project => {
  item.value = project;
  projectDialog.value = true;
};

const openCarousel = index => {
  currentImageIndex.value = index;
  carouselDialog.value = true;
};
</script>

<style scoped>
.zoom-effect {
   transform: scale(1.1);
}
.hover-scale {
   transition: transform 0.2s;
}
.hover-scale:hover {
   transform: scale(1.02);
}
</style>
