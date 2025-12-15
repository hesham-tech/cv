<template>
  <v-container class="py-12" id="contact-section">
    <!-- Section Title -->
    <div class="text-center mb-12 animate__animated animate__fadeInUp">
       <h2 
         v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" 
         :style="userStore.userAll.user.theme?.hero?.sectionTitle.style"
         class="text-h4 font-weight-bold text-primary mb-2 text-uppercase"
         style="letter-spacing: 2px;"
       >
         {{ lang == 'en' ? 'Get In Touch' : 'تواصل معي' }}
       </h2>
       <v-divider class="mx-auto border-opacity-100" color="secondary" length="60" thickness="4"></v-divider>
    </div>

    <v-row class="stretch-row">
      <!-- Contact Info -->
      <v-col cols="12" md="5" lg="4">
        <v-card class="h-100 rounded-xl pa-8 bg-primary text-white" elevation="4">
           <h3 class="text-h5 font-weight-bold mb-6">
             {{ lang === 'en' ? 'Contact Information' : 'بيانات التواصل' }}
           </h3>
           <p class="text-body-1 opacity-80 mb-8">
             {{ lang === 'en' ? 'Feel free to reach out for collaborations or just a friendly hello!' : 'لا تتردد في التواصل معي للتعاون أو للاستفسار!' }}
           </p>

           <div class="d-flex align-center mb-6">
              <v-avatar color="white" size="48" class="me-4 text-primary">
                 <v-icon icon="mdi-email-outline" size="24"></v-icon>
              </v-avatar>
              <div>
                 <div class="text-caption text-uppercase opacity-70">{{ lang === 'en' ? 'Email' : 'البريد الإلكتروني' }}</div>
                 <a :href="'mailto:' + userStore.userAll.user.email" class="text-white text-decoration-none font-weight-medium">
                    {{ userStore.userAll.user.email }}
                 </a>
              </div>
           </div>

           <div class="d-flex align-center mb-6">
              <v-avatar color="white" size="48" class="me-4 text-primary">
                 <v-icon icon="mdi-map-marker-outline" size="24"></v-icon>
              </v-avatar>
              <div>
                 <div class="text-caption text-uppercase opacity-70">{{ lang === 'en' ? 'Location' : 'الموقع' }}</div>
                 <div class="font-weight-medium text-white">
                    {{ userStore.userAll.user.address[lang] }}
                 </div>
              </div>
           </div>

           <div class="d-flex align-center mb-6">
              <v-avatar color="white" size="48" class="me-4 text-primary">
                 <v-icon icon="mdi-phone-outline" size="24"></v-icon>
              </v-avatar>
              <div>
                 <div class="text-caption text-uppercase opacity-70">{{ lang === 'en' ? 'Phone' : 'الهاتف' }}</div>
                 <a :href="'tel:' + userStore.userAll.user.phone" class="text-white text-decoration-none font-weight-medium">
                    {{ userStore.userAll.user.phone }}
                 </a>
              </div>
           </div>
        </v-card>
      </v-col>

      <!-- Contact Form -->
      <v-col cols="12" md="7" lg="8">
        <v-card class="h-100 rounded-xl pa-8" elevation="2">
           <h3 class="text-h5 font-weight-bold mb-6 text-primary">
             {{ lang === 'en' ? 'Send a Message' : 'أرسل رسالة' }}
           </h3>
           
           <v-form ref="form" v-model="valid">
             <v-row>
               <v-col cols="12" md="6">
                  <v-text-field
                    v-model="name[lang]"
                    :label="lang === 'en' ? 'Name' : 'الاسم'"
                    variant="outlined"
                    color="primary"
                    rounded="lg"
                    density="comfortable"
                    :rules="nameRules"
                  ></v-text-field>
               </v-col>
               <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.phone"
                    :label="lang === 'en' ? 'Phone' : 'رقم الهاتف'"
                    variant="outlined"
                     color="primary"
                    rounded="lg"
                    density="comfortable"
                    type="number"
                    :rules="phoneRules"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-text-field
                    v-model="item.email"
                    :label="lang === 'en' ? 'Email' : 'البريد الإلكتروني'"
                    variant="outlined"
                     color="primary"
                    rounded="lg"
                    density="comfortable"
                    type="email"
                    :rules="emailRules"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-text-field
                    v-model="subject[lang]"
                    :label="lang === 'en' ? 'Subject' : 'الموضوع'"
                    variant="outlined"
                     color="primary"
                    rounded="lg"
                    density="comfortable"
                    :rules="subjectRules"
                  ></v-text-field>
               </v-col>
               <v-col cols="12">
                  <v-textarea
                    v-model="message[lang]"
                    :label="lang === 'en' ? 'Message' : 'الرسالة'"
                    variant="outlined"
                     color="primary"
                    rounded="lg"
                    rows="5"
                    :rules="messageRules"
                  ></v-textarea>
               </v-col>
             </v-row>

             <div class="mt-4">
               <v-btn
                 @click="sendItems"
                 color="primary"
                 size="x-large"
                 rounded="pill"
                 :loading="loading"
                 :disabled="!valid"
                 block
               >
                 {{ lang === 'en' ? 'Send Message' : 'إرسال الرسالة' }}
                 <v-icon icon="mdi-send" end class="ms-2"></v-icon>
               </v-btn>
             </div>
           </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Feedback -->
    <v-snackbar
      v-model="sendDialog"
      color="success"
      location="top"
      timer="3000"
    >
      <div class="d-flex align-center">
         <v-icon icon="mdi-check-circle" start></v-icon>
         <span class="text-subtitle-1">{{ lang === 'en' ? 'Message sent successfully!' : 'تم إرسال الرسالة بنجاح!' }}</span>
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="sendDialog = false">Close</v-btn>
      </template>
    </v-snackbar>
    
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { notifyError } from '@/Service/notifyService';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

const loading = ref(false);
const userStore = useUserStore();
const route = useRoute();
const lang = route.params.lang;

const item = ref({});
const name = ref({});
const subject = ref({});
const message = ref({});
const valid = ref(false);
const sendDialog = ref(false);

// Validation Rules
const nameRules = [v => !!v || (lang === 'en' ? 'Name is required' : 'الاسم مطلوب')];
const phoneRules = [
  v => !!v || (lang === 'en' ? 'Phone is required' : 'رقم الهاتف مطلوب'),
  v => (v && v.length >= 8) || (lang === 'en' ? 'Phone invalid' : 'رقم الهاتف غير صحيح'), 
];
const emailRules = [
  v => !!v || (lang === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب'),
  v => /.+@.+\..+/.test(v) || (lang === 'en' ? 'Email must be valid' : 'يجب أن يكون البريد الإلكتروني صالحًا'),
];
const subjectRules = [v => !!v || (lang === 'en' ? 'Subject is required' : 'الموضوع مطلوب')];
const messageRules = [v => !!v || (lang === 'en' ? 'Message is required' : 'الرسالة مطلوبة')];

function sendItems() {
  if (valid.value) {
    item.value.name = JSON.stringify(name.value);
    item.value.subject = JSON.stringify(subject.value);
    item.value.message = JSON.stringify(message.value);
    item.value.user_id = userStore.userAll.user.id;
    
    loading.value = true;
    
    axios
      .post(`contacts`, item.value)
      .then(() => {
        loading.value = false;
        // Reset form
        item.value = {};
        name.value = {};
        subject.value = {};
        message.value = {};
        sendDialog.value = true;
      })
      .catch((err) => {
        loading.value = false;
         console.error(err);
        notifyError('هناك خطا ما حاول مره اخري');
      });
  }
}
</script>

<style scoped>
.stretch-row {
   align-items: stretch;
}
</style>
