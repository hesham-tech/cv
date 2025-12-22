<template>
  <div class="modern-contact">
    <!-- Success Dialog -->
    <v-dialog v-model="sendDialog" max-width="500">
      <v-card class="dialog-card glass-card">
        <div class="success-content">
          <div class="success-icon">
            <span class="icon-emoji">✅</span>
          </div>
          <h3 class="success-title">{{ lang === 'en' ? 'Message Sent!' : 'تم إرسال الرسالة!' }}</h3>
          <p class="success-text">
            {{ lang === 'en' ? 'Thank you for contacting me. I will get back to you soon!' : 'شكراً لتواصلك معي. سأرد عليك قريباً!' }}
          </p>
          <v-btn @click="sendDialog = false" class="btn-modern btn-primary">
            {{ lang === 'en' ? 'OK' : 'موافق' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <div class="contact-container">
      <!-- Section Title -->
      <div class="section-header">
        <h2 v-if="userStore.userAll.user.theme?.hero?.sectionTitle.enabled" class="section-title gradient-text"
          :style="userStore.userAll.user.theme?.hero?.sectionTitle.style">
          {{ lang == 'en' ? 'Get In Touch' : 'تواصل معي' }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <div class="contact-grid">
        <!-- Contact Info -->
        <div class="contact-info glass-card">
          <h3 class="info-title">{{ lang === 'en' ? 'Contact Information' : 'معلومات التواصل' }}</h3>

          <div class="info-item">
            <div class="info-icon">
              <v-icon icon="mdi-email" color="white" size="24"></v-icon>
            </div>
            <div class="info-content">
              <h4 class="info-label">{{ lang === 'en' ? 'Email' : 'البريد الإلكتروني' }}</h4>
              <a :href="'mailto:' + userStore.userAll.user.email" class="info-link">
                {{ userStore.userAll.user.email }}
              </a>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <v-icon icon="mdi-phone" color="white" size="24"></v-icon>
            </div>
            <div class="info-content">
              <h4 class="info-label">{{ lang === 'en' ? 'Phone' : 'الهاتف' }}</h4>
              <a :href="'tel:' + userStore.userAll.user.phone" class="info-link">
                {{ userStore.userAll.user.phone }}
              </a>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <v-icon icon="mdi-map-marker" color="white" size="24"></v-icon>
            </div>
            <div class="info-content">
              <h4 class="info-label">{{ lang === 'en' ? 'Location' : 'الموقع' }}</h4>
              <p class="info-text">{{ userStore.userAll.user.address[lang] }}</p>
            </div>
          </div>
          
          <!-- Social Links integrated here -->
          <div class="social-section mt-6">
            <SocialWithEdit />
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form glass-card">
          <h3 class="form-title">{{ lang === 'en' ? 'Send Message' : 'إرسال رسالة' }}</h3>

          <v-form ref="form" v-model="valid">
            <v-text-field v-model="name[lang]" :label="lang === 'en' ? 'Name' : 'الاسم'" :rules="nameRules"
              variant="outlined" class="modern-input" :loading="loading"></v-text-field>

            <v-text-field v-model="item.phone" :label="lang === 'en' ? 'Phone' : 'رقم الهاتف'" :rules="phoneRules"
              type="number" variant="outlined" class="modern-input" :loading="loading"></v-text-field>

            <v-text-field v-model="item.email" :label="lang === 'en' ? 'Email' : 'البريد الإلكتروني'"
              :rules="emailRules" type="email" variant="outlined" class="modern-input"
              :loading="loading"></v-text-field>

            <v-text-field v-model="subject[lang]" :label="lang === 'en' ? 'Subject' : 'الموضوع'" :rules="subjectRules"
              variant="outlined" class="modern-input" :loading="loading"></v-text-field>

            <v-textarea v-model="message[lang]" :label="lang === 'en' ? 'Message' : 'الرسالة'" :rules="messageRules"
              rows="5" variant="outlined" class="modern-input" :loading="loading"></v-textarea>

            <v-btn @click="sendItems" :disabled="!valid || loading" :loading="loading"
              class="btn-modern btn-primary send-btn" block>
              <v-icon icon="mdi-send" start></v-icon>
              {{ lang === 'en' ? 'Send Message' : 'إرسال الرسالة' }}
            </v-btn>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { notifyError } from '@/Service/notifyService';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import SocialWithEdit from './SocialWithEdit.vue';

const userStore = useUserStore();
const route = useRoute();
const lang = route.params.lang;
const loading = ref(false);
const item = ref({});
const name = ref({});
const subject = ref({});
const message = ref({});
const valid = ref(false);
const sendDialog = ref(false);

const nameRules = [v => !!v || (lang === 'en' ? 'Name is required' : 'الاسم مطلوب')];
const phoneRules = [
  v => !!v || (lang === 'en' ? 'Phone is required' : 'رقم الهاتف مطلوب'),
  v => (v && v.length === 11) || (lang === 'en' ? 'Phone must be 11 digits' : 'يجب أن يحتوي رقم الهاتف على 11 رقم'),
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
        item.value = {};
        name.value = {};
        subject.value = {};
        message.value = {};
        sendDialog.value = true;
      })
      .catch(() => {
        loading.value = false;
        notifyError(lang === 'en' ? 'An error occurred. Please try again.' : 'حدث خطأ ما. حاول مرة أخرى');
      });
  }
}
</script>

<style lang="scss" scoped>
.modern-contact {
  padding: var(--space-8) var(--space-6);
}

.contact-container {
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-8);
}

/* Contact Info */
.contact-info {
  padding: var(--space-8);
  height: fit-content;
}

.info-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.info-item {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  &:last-child {
    margin-bottom: 0;
  }
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-colored);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-link,
.info-text {
  font-size: var(--text-lg);
  color: var(--text-primary);
  text-decoration: none;
  transition: color var(--transition-base);
}

.info-link:hover {
  color: var(--primary-600);
}

/* Social Section */
.social-section {
  padding-top: var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  :deep(.social-wrapper) {
    padding: 0;
  }
  
  :deep(.socials-display) {
    gap: 12px;
  }
  
  :deep(.contact-item) {
    background: rgba(102, 126, 234, 0.08);
    padding: 10px 14px;
  }
  
  :deep(.social-links-list) {
    margin-top: 12px;
  }
}

/* Contact Form */
.contact-form {
  padding: var(--space-8);
}

.form-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.modern-input {
  margin-bottom: var(--space-4);

  :deep(.v-field) {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: var(--radius-lg);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  :deep(.v-field--focused) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.send-btn {
  margin-top: var(--space-4);
  font-size: var(--text-lg);
  padding: var(--space-6) var(--space-8);
}

/* Success Dialog */
.dialog-card {
  padding: var(--space-8);
  text-align: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.success-icon {
  width: 100px;
  height: 100px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* انيميشن: تكبير مع ارتداد عند ظهور رسالة النجاح */
  animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: var(--shadow-colored-lg);

  .icon-emoji {
    font-size: 3rem;
  }
}

/* ====================
   انيميشن: تكبير مع ارتداد
   الوظيفة: يخلق تأثير ظهور ديناميكي بارتداد خفيف
   المدة: 0.5 ثانية
   الاستخدام: لأيقونة نجاح إرسال الرسالة
   ==================== */
@keyframes scaleIn {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

.success-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.success-text {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  max-width: 400px;
}

/* Responsive */
@media (max-width: 768px) {
  .modern-contact {
    padding: var(--space-6) var(--space-4);
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  .contact-info,
  .contact-form {
    padding: var(--space-6);
  }
}
</style>
