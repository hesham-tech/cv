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
         {{ lang == 'en' ? 'Education' : 'التعليم' }}
       </h2>
       <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-expansion-panels variant="popout" class="pa-4">
          <v-expansion-panel 
            v-for="item in userStore.userAll.academics" 
            :key="item.id"
            elevation="2"
            rounded="xl"
            bg-color="surface"
          >
            <v-expansion-panel-title>
               <div class="d-flex flex-column flex-md-row align-start align-md-center w-100">
                  <span class="text-h6 font-weight-bold text-primary mb-1 mb-md-0 me-md-4">
                    {{ item.institution[lang] }}
                  </span>
                  <span class="text-subtitle-1 text-medium-emphasis">
                    {{ item.field_of_study[lang] }}
                  </span>
               </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-container class="pa-0">
                 <v-row align="center">
                    <!-- Details Column -->
                    <v-col cols="12" md="8">
                       <v-list density="compact" bg-color="transparent">
                          <!-- Degree -->
                          <v-list-item v-if="item.degree">
                             <template v-slot:prepend>
                               <v-icon icon="mdi-certificate-outline" color="secondary" class="me-3"></v-icon>
                             </template>
                             <v-list-item-title class="font-weight-medium">
                               {{ lang === 'en' ? 'Degree' : 'الدرجة' }}: 
                               <span class="text-medium-emphasis">{{ item.degree[lang] }}</span>
                             </v-list-item-title>
                          </v-list-item>

                          <!-- Grade -->
                           <v-list-item v-if="item.grade">
                             <template v-slot:prepend>
                               <v-icon icon="mdi-star-circle-outline" color="secondary" class="me-3"></v-icon>
                             </template>
                             <v-list-item-title class="font-weight-medium">
                               {{ lang === 'en' ? 'Grade' : 'التقدير' }}: 
                               <span class="text-medium-emphasis">{{ item.grade[lang] }}</span>
                             </v-list-item-title>
                          </v-list-item>

                          <!-- Dates -->
                          <v-list-item>
                             <template v-slot:prepend>
                               <v-icon icon="mdi-calendar-range" color="secondary" class="me-3"></v-icon>
                             </template>
                             <v-list-item-title class="font-weight-medium">
                                {{ item.start_date || 'N/A' }} — {{ item.end_date || (lang === 'en' ? 'Present' : 'الآن') }}
                             </v-list-item-title>
                          </v-list-item>
                       </v-list>
                    </v-col>

                    <!-- Image Column -->
                    <v-col cols="12" md="4" v-if="userStore.userAll.user.theme?.academics?.imag.enabled && item.photos?.length">
                       <v-card class="rounded-lg" elevation="2">
                          <v-img
                            :src="item.photos[0].path"
                            aspect-ratio="1.5"
                            cover
                          ></v-img>
                       </v-card>
                    </v-col>
                 </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
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
/* Add any styles if needed */
</style>
