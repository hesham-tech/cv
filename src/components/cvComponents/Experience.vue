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
         {{ lang == 'en' ? 'Experiences' : 'الخبرات' }}
       </h2>
       <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
    </div>

    <v-row justify="center">
       <v-col cols="12" md="10">
          <v-timeline align="start" side="end" line-color="secondary" truncate-line="both">
             <v-timeline-item 
                v-for="(item, i) in userStore.userAll.experiences" 
                :key="item.id"
                :dot-color="item.photos[0] ? 'white' : 'primary'"
                size="large"
                elevation="2"
             >
                <template v-slot:icon v-if="item.photos[0]">
                   <v-avatar :image="item.photos[0].path" size="x-large"></v-avatar>
                </template>
                <template v-slot:icon v-else>
                   <v-icon icon="mdi-briefcase-outline" size="small" color="white"></v-icon>
                </template>

                <template v-slot:opposite>
                   <div class="text-caption text-uppercase font-weight-bold text-medium-emphasis mb-2">
                       {{ item.start_date }} — {{ Number(item.end_date[lang]) === 1 ? (lang == 'en' ? 'Present' : 'الآن') : item.end_date[lang] }}
                   </div>
                </template>

                <v-card class="elevation-3" rounded="lg">
                   <v-card-title class="text-h6 font-weight-bold pt-4 text-primary">
                      {{ item.title[lang] }}
                   </v-card-title>
                   <v-card-subtitle class="text-subtitle-1 text-secondary mb-2">
                      <v-icon icon="mdi-domain" size="small" start></v-icon>
                      {{ item.company[lang] }}
                   </v-card-subtitle>
                   <v-card-text class="text-body-2 text-medium-emphasis pb-4">
                      {{ item.description[lang] }}
                   </v-card-text>
                </v-card>
             </v-timeline-item>
          </v-timeline>
       </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
const route = useRoute();
const userStore = useUserStore();
const lang = route.params.lang;
</script>

<style scoped>
/* Timeline overrides if needed */
</style>
