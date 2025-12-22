<template>
  <div class="modern-aside">
    <!-- Profile Section -->
    <div class="aside-profile">
      <div class="profile-image-wrapper" v-if="userStore.userAll.user.theme.hero?.imag?.enabled">
        <div class="profile-image-border"></div>
        <img :src="userStore.userAll.user.profile_image" alt="Profile" class="profile-image" />
      </div>
      <h2 class="profile-name">{{ userStore.userAll.user.first_name[lang] }}</h2>
      <p class="profile-position">{{ userStore.userAll.user.position[lang] }}</p>
    </div>

    <!-- Navigation -->
    <nav class="aside-navigation">
      <ul id="nav">
        <li class="nav-item active" :style="{ order: userStore.userAll.user.theme.hero?.order - 2 }"
          v-if="userStore.userAll.user.theme.hero?.enabled">
          <a href="#h-hero" class="nav-link">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">{{ lang == 'en' ? 'Home' : 'الرئيسية' }}</span>
          </a>
        </li>
        <li class="nav-item" :style="{ order: userStore.userAll.user.theme.about?.order - 2 }"
          v-if="userStore.userAll.user.theme.about?.enabled">
          <a href="#h-about" class="nav-link">
            <span class="nav-icon">👤</span>
            <span class="nav-text">{{ lang == 'en' ? 'About' : 'عني' }}</span>
          </a>
        </li>
        <li class="nav-item" v-if="userStore.userAll.user.theme.services?.enabled"
          :style="{ order: userStore.userAll.user.theme.services?.order - 2 }">
          <a href="#h-services" class="nav-link">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">{{ lang == 'en' ? 'Services' : 'الخدمات' }}</span>
          </a>
        </li>
        <li class="nav-item" v-if="userStore.userAll.user.theme.skills?.enabled"
          :style="{ order: userStore.userAll.user.theme.skills?.order - 2 }">
          <a href="#h-skills" class="nav-link">
            <span class="nav-icon">💡</span>
            <span class="nav-text">{{ lang == 'en' ? 'Skills' : 'المهارات' }}</span>
          </a>
        </li>
        <li class="nav-item" :style="{ order: userStore.userAll.user.theme.academics?.order - 2 }"
          v-if="userStore.userAll.user.theme.academics?.enabled">
          <a href="#h-academic" class="nav-link">
            <span class="nav-icon">🎓</span>
            <span class="nav-text">{{ lang == 'en' ? 'Education' : 'التعليم' }}</span>
          </a>
        </li>
        <li class="nav-item" :style="{ order: userStore.userAll.user.theme.experiences?.order - 2 }"
          v-if="userStore.userAll.user.theme.experiences?.enabled">
          <a href="#h-experience" class="nav-link">
            <span class="nav-icon">💼</span>
            <span class="nav-text">{{ lang == 'en' ? 'Experience' : 'الخبرة' }}</span>
          </a>
        </li>
        <li class="nav-item" v-if="userStore.userAll.user.theme.work?.enabled"
          :style="{ order: userStore.userAll.user.theme.work?.order - 2 }">
          <a href="#h-work" class="nav-link">
            <span class="nav-icon">🎨</span>
            <span class="nav-text">{{ lang == 'en' ? 'Work' : 'الأعمال' }}</span>
          </a>
        </li>
        <li class="nav-item" v-if="userStore.userAll.user.theme.blog?.enabled"
          :style="{ order: userStore.userAll.user.theme.blog?.order - 2 }">
          <a href="#h-blog" class="nav-link">
            <span class="nav-icon">📝</span>
            <span class="nav-text">{{ lang == 'en' ? 'Blog' : 'مدونة' }}</span>
          </a>
        </li>
        <li class="nav-item" v-if="userStore.userAll.user.theme.contacts?.enabled"
          :style="{ order: userStore.userAll.user.theme.contacts?.order - 2 }">
          <a href="#h-contact" class="nav-link">
            <span class="nav-icon">📧</span>
            <span class="nav-text">{{ lang == 'en' ? 'Contact' : 'اتصل بنا' }}</span>
          </a>
        </li>
      </ul>
    </nav>

          <div v-if="userStore.userAll.user.theme.socials" class="box-socials">
        <div v-if="userStore.userAll.user.theme.socials?.aside?.enabled" class="box-socials">
          <div v-for="(social, i) in userStore.userAll.socials" :key="i">
            <!-- <p>{{ social.icon }}</p> -->
            <a :href="social.url" target="_blank">
              <v-icon :color="social.icon.color" :icon="social.icon.icon"></v-icon>
            </a>
          </div>
        </div>
      </div>

    <!-- Footer -->
    <div class="aside-footer">
      <!-- Social Icons -->
      <div v-if="userStore.userAll.user.theme.socials?.aside?.enabled" class="aside-socials">
        <a v-for="(social, i) in userStore.userAll.socials" :key="i" :href="social.url" target="_blank"
          class="social-link">
          <v-icon :color="social.icon.color" :icon="social.icon.icon" size="22"></v-icon>
        </a>
      </div>

      <!-- Copyright -->
      <div class="copyright">
        <div>Made with ❤️</div>
        <div class="creator">by <a href="https://h.com" target="_blank">Hesham Mohamed</a></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

const route = useRoute();
const lang = route.params.lang;
const userStore = useUserStore();

onMounted(() => {
  // userStore.fetchUser().then(() => {
  //   console.log(userStore.user.profile_image);
  // });
});
</script>

<style lang="scss" scoped>
.modern-aside {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  border-radius: 0 !important;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(100px);
    z-index: 0;
  }
}

/* Profile Section */
.aside-profile {
  // padding: 3rem 2rem 2rem;
    text-align: center;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    justify-content: center;
}

.profile-image-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 10px auto 0px auto;
  flex-shrink: 0;
}

.profile-image-border {
  position: absolute;
  inset: -4px;
  background: linear-gradient(135deg, #a8edea, #fed6e3, #f093fb, #a8edea);
  border-radius: 50%;
  /* انيميشن: دوران الحدود المتدرجة حول صورة البروفايل */
  // animation: rotateGradient 10s linear infinite;
}

.profile-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.profile-name {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: var(--font-bold);
  color: white;
  margin: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.profile-position {
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: var(--font-medium);
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Navigation */
.aside-navigation {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  position: relative;
  z-index: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
}

#nav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.25rem .50rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: var(--font-medium);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  /* الخط الجانبي للـ hover */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #a8edea, #fed6e3);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  /* حالة الـ Hover */
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    transform: translateX(8px);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      transform: scaleY(1);
    }
  }
}

/* حالة الـ Active - مختلفة تماماً عن الـ Hover */
.nav-item.active .nav-link {
  background: linear-gradient(135deg, 
    rgba(168, 237, 234, 0.25) 0%, 
    rgba(254, 214, 227, 0.25) 100%
  );
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 4px 15px rgba(168, 237, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateX(0); /* لا يتحرك */
  font-weight: var(--font-semibold); /* أثقل */

  /* إخفاء الخط الجانبي في Active */
  &::before {
    display: none;
  }

  /* إضافة توهج خفيف */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, 
      rgba(168, 237, 234, 0.1), 
      rgba(254, 214, 227, 0.1)
    );
    opacity: 1;
  }

  /* الأيقونة تأخذ التدرج اللوني */
  .nav-icon {
    background: linear-gradient(135deg, #a8edea, #fed6e3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(168, 237, 234, 0.4));
  }

  /* عند hover على Active */
  &:hover {
    transform: translateX(0); /* يبقى ثابت */
    background: linear-gradient(135deg, 
      rgba(168, 237, 234, 0.3) 0%, 
      rgba(254, 214, 227, 0.3) 100%
    );
    box-shadow: 
      0 6px 20px rgba(168, 237, 234, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
}

.nav-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}
.nav-text {
  flex: 1;
}

/* Footer */
.aside-footer {
  padding: 1rem 1rem;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.aside-socials {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.social-link {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
}

.copyright {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;

  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: var(--font-semibold);
    transition: color 0.3s ease;

    &:hover {
      color: white;
    }
  }
}

.creator {
  margin-top: 0.25rem;
}

/* Animations */
/* ====================
   انيميشن: تعويم (ارتفاع وانخفاض)
   الوظيفة: حركة ناعمة للأعلى والأسفل لخلق حيوية
   المدة: يتم تعريفه في العنصر المستخدم
   ملاحظة: هذا الانيميشن غير مستخدم حالياً
   ==================== */
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* ====================
   انيميشن: دوران التدرج اللوني
   الوظيفة: يدور الخلفية المتدرجة 360 درجة لخلق تأثير متحرك
   المدة: 10 ثوان، يتكرر للأبد
   الاستخدام: لحدود صورة البروفايل في الـ Sidebar
   ==================== */
@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media screen and (max-width: 600px) {
  .profile-image-wrapper {
    width: 120px;
    height: 120px;
  }

  .profile-name {
    font-size: 1.5rem;
  }

  .profile-position {
    font-size: 0.85rem;
  }

  .nav-link {
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
  }

  .nav-icon {
    font-size: 1.1rem;
  }
}

/* Medium screens - ensure centering */
@media screen and (min-width: 601px) and (max-width: 1090px) {
  .aside-profile {
    align-items: center;
    justify-content: center;
  }
  
  .profile-image-wrapper {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
