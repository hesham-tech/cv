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
         {{ lang == 'en' ? 'My Expertise' : 'خدماتي' }}
       </h2>
       <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
    </div>

    <v-row>
      <!-- Innovative Ideas -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 pa-6 text-center rounded-xl hover-card" elevation="2">
          <div class="mb-4 d-inline-block pa-4 bg-primary-lighten-5 rounded-circle">
             <v-icon icon="mdi-lightbulb-on-outline" size="48" color="primary"></v-icon>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Innovative Ideas</h3>
          <p class="text-body-2 text-medium-emphasis">
            Creative solutions tailored to unique business challenges and goals.
          </p>
        </v-card>
      </v-col>

      <!-- Software -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 pa-6 text-center rounded-xl hover-card" elevation="2">
          <div class="mb-4 d-inline-block pa-4 bg-primary-lighten-5 rounded-circle">
             <v-icon icon="mdi-code-braces" size="48" color="secondary"></v-icon>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Software Development</h3>
          <p class="text-body-2 text-medium-emphasis">
            Building robust and scalable software applications for various platforms.
          </p>
        </v-card>
      </v-col>

      <!-- Application -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 pa-6 text-center rounded-xl hover-card" elevation="2">
           <div class="mb-4 d-inline-block pa-4 bg-primary-lighten-5 rounded-circle">
             <v-icon icon="mdi-cellphone-link" size="48" color="info"></v-icon>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Mobile Apps</h3>
          <p class="text-body-2 text-medium-emphasis">
             Developing intuitive and engaging mobile applications for iOS and Android.
          </p>
        </v-card>
      </v-col>

      <!-- Graphic Design -->
      <v-col cols="12" sm="6" md="4">
        <v-card class="h-100 pa-6 text-center rounded-xl hover-card" elevation="2">
           <div class="mb-4 d-inline-block pa-4 bg-primary-lighten-5 rounded-circle">
             <v-icon icon="mdi-palette-outline" size="48" color="warning"></v-icon>
          </div>
           <h3 class="text-h6 font-weight-bold mb-2">Graphic Design</h3>
          <p class="text-body-2 text-medium-emphasis">
             Crafting visually stunning designs that communicate your brand message.
          </p>
        </v-card>
      </v-col>

       <!-- Data Analysis (Reusing Software slot for variety if needed, or keeping generic) -->
      <v-col cols="12" sm="6" md="4">
         <v-card class="h-100 pa-6 text-center rounded-xl hover-card" elevation="2">
           <div class="mb-4 d-inline-block pa-4 bg-primary-lighten-5 rounded-circle">
             <v-icon icon="mdi-database-search-outline" size="48" color="success"></v-icon>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Data Analysis</h3>
          <p class="text-body-2 text-medium-emphasis">
             Turning complex data into actionable insights for better decision making.
          </p>
        </v-card>
      </v-col>

       <!-- Support -->
      <v-col cols="12" sm="6" md="4">
         <v-card class="h-100 pa-6 text-center rounded-xl hover-card" elevation="2">
           <div class="mb-4 d-inline-block pa-4 bg-primary-lighten-5 rounded-circle">
             <v-icon icon="mdi-headset" size="48" color="error"></v-icon>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Technical Support</h3>
          <p class="text-body-2 text-medium-emphasis">
             Providing ongoing support and maintenance to ensure system stability.
          </p>
        </v-card>
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
.hover-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>
