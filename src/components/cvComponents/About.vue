<template>
  <v-container class="py-12">
    <v-card class="mx-auto rounded-xl pa-8 border-none" elevation="0" color="transparent" max-width="1000">
      
      <!-- Section Title -->
      <div class="text-center mb-10 animate__animated animate__fadeInUp">
        <h2 
          v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" 
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style"
          class="text-h4 font-weight-bold text-primary mb-2 text-uppercase"
          style="letter-spacing: 2px;"
        >
          {{ lang == 'en' ? 'About Me' : 'عنّي' }}
        </h2>
        <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
      </div>

      <v-row align="center">
        <!-- Content Column -->
        <v-col cols="12" md="8" class="mx-auto text-center" >
            <h3
              v-if="userStore.userAll.user.theme?.about?.mainTitle.enabled"
              :style="userStore.userAll.user.theme?.about?.mainTitle.style"
              class="text-h5 font-weight-medium mb-4"
            >
              {{ lang == 'en' ? 'Who Am I?' : 'من أنا؟' }}
            </h3>

            <div 
              v-if="userStore.userAll.user.theme?.about.subTitle.enabled" 
              :style="userStore.userAll.user.theme.about.subTitle.style"
              class="text-h6 text-medium-emphasis mb-6"
            >
              <strong>
                {{ lang === 'en' ? 'Hello, I am' : 'مرحبا، أنا' }} 
                <span class="text-secondary">{{ userStore.userAll.user.last_name[lang] || ' ' }}</span>
              </strong>
            </div>

            <p 
              v-if="userStore.userAll.user.theme?.about.paragraph.enabled" 
              :style="userStore.userAll.user.theme.about.paragraph.style"
              class="text-body-1 text-medium-emphasis mb-8"
              style="line-height: 1.8; white-space: pre-wrap;"
            >
              {{ lang === 'en' ? userStore.userAll.user.about_en : userStore.userAll.user.about_ar }}
            </p>

            <!-- Socials & CTA -->
            <div class="d-flex flex-column align-center gap-4">
               <!-- Social Icons -->
               <div 
                  v-if="userStore.userAll.user.theme.socials?.about?.enabled" 
                  class="d-flex gap-2 mb-4 flex-wrap justify-center"
               >
                  <v-btn
                    v-for="(social, i) in userStore.userAll.socials"
                    :key="i"
                    :href="social.url"
                    target="_blank"
                    icon
                    variant="tonal"
                    :color="social.icon.color"
                    size="small"
                  >
                    <v-icon :icon="social.icon.icon"></v-icon>
                  </v-btn>
               </div>

               <!-- Contact Button -->
               <div v-if="userStore.userAll.user.theme?.about.button?.enabled">
                  <v-btn
                    href="#h-contact"
                    color="primary"
                    size="large"
                    rounded="pill"
                    prepend-icon="mdi-email-outline"
                    class="px-8"
                    :style="userStore.userAll.user.theme.about.button.style"
                  >
                    {{ lang == 'en' ? 'Contact Me' : 'تواصل معي' }}
                  </v-btn>
               </div>
            </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
const route = useRoute();
const userStore = useUserStore();
const lang = route.params.lang;
</script>
