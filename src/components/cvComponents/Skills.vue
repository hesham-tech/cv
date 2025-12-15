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
         {{ lang == 'en' ? 'Skills' : 'المهارات' }}
       </h2>
       <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
    </div>

    <v-row>
      <v-col 
        v-for="(skill, index) in userStore.userAll.skills" 
        :key="index" 
        cols="6" 
        sm="4"
        md="3"
        class="d-flex justify-center"
      >
        <v-card 
           @click="funSelectedSkill(skill)"
           class="d-flex flex-column align-center text-center pa-6 rounded-xl hover-scale cursor-pointer w-100 h-100"
           elevation="2"
           color="surface"
        >
           <!-- Skill Content w/ Progress -->
           <div class="position-relative d-flex align-center justify-center mb-4">
              <!-- Progress Circle -->
              <v-progress-circular
                 v-if="userStore.userAll.user.theme?.skills.progress.enabled"
                 :model-value="skill.level"
                 :rotate="-90"
                 :size="100"
                 :width="8"
                 :color="userStore.userAll.user.theme?.skills.progress.backgroundColor || 'secondary'"
                 bg-color="grey-lighten-4"
              >
                  <!-- Avatar Inside -->
                  <v-avatar size="80" v-if="userStore.userAll.user.theme?.skills.imag.enabled && skill.photos[0]">
                     <v-img :src="skill.photos[0]?.path" cover></v-img>
                  </v-avatar>
                  <span v-else class="text-h6 font-weight-bold">{{ skill.level }}%</span>
              </v-progress-circular>

               <!-- Avatar Only if Progress Disabled -->
               <v-avatar size="90" v-else-if="userStore.userAll.user.theme?.skills.imag.enabled && skill.photos[0]">
                  <v-img :src="skill.photos[0]?.path" cover class="elevation-2"></v-img>
               </v-avatar>
           </div>

           <!-- Skill Name -->
           <h3 
             v-if="userStore.userAll.user.theme?.skills.mainTitle.enabled"
             :style="userStore.userAll.user.theme?.skills.mainTitle.style"
             class="text-h6 font-weight-bold mb-1"
           >
              {{ skill.name[lang] }}
           </h3>
        </v-card>
      </v-col>
    </v-row>

    <!-- Skill Dialog -->
    <v-dialog v-model="dialogSkill" max-width="500">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
           <span class="text-h5 font-weight-bold">{{ selectedSkill?.name[lang] }}</span>
           <v-btn icon="mdi-close" variant="text" size="small" @click="dialogSkill = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="text-center pt-2 pb-6">
            <v-avatar v-if="selectedSkill?.photos[0]" size="100" class="mb-6 elevation-4">
               <v-img :src="selectedSkill?.photos[0]?.path" cover></v-img>
            </v-avatar>

            <div class="d-flex align-center mb-6 px-4" v-if="userStore.userAll.user.theme?.skills.progress.enabled">
               <v-progress-linear
                 :model-value="selectedSkill?.level"
                 height="12"
                 rounded
                 striped
                 :color="userStore.userAll.user.theme?.skills.progress.backgroundColor || 'secondary'"
               ></v-progress-linear>
               <span class="ms-4 font-weight-bold">{{ selectedSkill?.level }}%</span>
            </div>

            <p 
               v-if="userStore.userAll.user.theme?.skills.subTitle.enabled && selectedSkill?.description[lang]"
               :style="userStore.userAll.user.theme?.skills.subTitle.style"
               class="text-body-1 text-medium-emphasis px-2"
               style="white-space: pre-wrap;"
            >
               {{ selectedSkill?.description[lang] }}
            </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const lang = route.params.lang;
const selectedSkill = ref(null);
const dialogSkill = ref(false);

function funSelectedSkill(skill) {
  selectedSkill.value = skill;
  dialogSkill.value = true;
}
</script>

<style scoped>
.hover-scale {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-scale:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>
