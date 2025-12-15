<template>
  <v-app :theme="userStore.userAll?.user?.theme?.mode || 'light'" class="cv-app">
    <div
      v-if="getData"
      :style="{ direction: lang === 'en' ? 'ltr' : 'rtl' }"
      class="fill-height d-flex flex-column"
    >
        <!-- Desktop Header / Navbar -->
        <v-app-bar 
            v-if="!isMobile" 
            :elevation="isScrolled ? 4 : 0"
            :color="isScrolled ? 'surface' : 'transparent'"
            class="px-4 transition-all"
            :class="{ 'glass-header': isScrolled }"
            height="80"
            fixed
        >
             <!-- Logo / Name -->
            <div 
                class="d-flex align-center cursor-pointer logo-transition" 
                @click="scrollTo('#h-hero')"
                :class="{ 'opacity-100': isScrolled, 'opacity-90': !isScrolled }"
            >
                 <v-avatar
                    v-if="userStore.userAll.user.profile_image"
                    :image="userStore.userAll.user.profile_image"
                    size="50"
                    class="me-3 border"
                    :class="{ 'elevation-2': isScrolled }"
                  ></v-avatar>
                 <div>
                     <h1 class="text-h6 font-weight-bold" :class="{'text-white': !isScrolled && isHeroDark, 'text-high-emphasis': isScrolled || !isHeroDark}">
                         {{ userStore.userAll.user.first_name[lang] }}
                     </h1>
                     <div class="text-caption" :class="{'text-grey-lighten-1': !isScrolled && isHeroDark, 'text-medium-emphasis': isScrolled || !isHeroDark}">
                         {{ userStore.userAll.user.position[lang] }}
                     </div>
                 </div>
            </div>

            <v-spacer></v-spacer>

             <!-- Desktop Navigation -->
            <div class="d-flex gap-2 nav-container pa-1 rounded-pill" :class="{ 'bg-surface-variant': !isScrolled && isHeroDark, 'glass-nav': isScrolled }">
                <v-btn
                    v-for="(item, i) in menuItems"
                    :key="i"
                    @click="scrollTo(item.href)"
                    :variant="activeSection === item.key ? 'tonal' : 'text'"
                    rounded="pill"
                    class="text-capitalize font-weight-bold px-4 transition-colors"
                    :color="activeSection === item.key ? 'primary' : ''"
                    :class="{ 
                        'text-white': !isScrolled && isHeroDark && activeSection !== item.key,
                        'text-medium-emphasis': (isScrolled || !isHeroDark) && activeSection !== item.key
                    }"
                >
                    {{ item.text }}
                </v-btn>
            </div>
            
            <v-spacer></v-spacer>
             <!-- Desktop Socials / Theme Toggle -->
               <v-btn 
                 icon 
                 @click="toggleTheme" 
                 :class="{'text-white': !isScrolled && isHeroDark, 'text-high-emphasis': isScrolled || !isHeroDark}"
               >
                 <v-icon>mdi-theme-light-dark</v-icon>
               </v-btn>

        </v-app-bar>


      <!-- Mobile Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :location="lang === 'en' ? 'left' : 'right'"
        temporary
        width="280"
        v-if="isMobile"
        class="glass-drawer"
      >
        <div class="d-flex flex-column h-100 pa-4">
            <!-- Mobile Drawer Header -->
            <div class="text-center mb-6 mt-4">
                 <v-avatar
                    v-if="userStore.userAll.user.profile_image"
                    :image="userStore.userAll.user.profile_image"
                    size="100"
                    class="mb-3 elevation-5 border-lg"
                    color="primary"
                  ></v-avatar>
                 <h2 class="text-h6 font-weight-bold">{{ userStore.userAll.user.first_name[lang] }}</h2>
                 <div class="text-caption text-medium-emphasis">{{ userStore.userAll.user.position[lang] }}</div>
            </div>
            
            <v-divider class="mb-4"></v-divider>

            <v-list nav density="comfortable" class="flex-grow-1">
                <v-list-item
                    v-for="(item, i) in menuItems"
                    :key="i"
                    @click="scrollTo(item.href); drawer = false"
                    :title="item.text"
                    :prepend-icon="item.icon"
                    rounded="xl"
                    :active="activeSection === item.key"
                    color="primary"
                    class="mb-2 font-weight-medium"
                ></v-list-item>
            </v-list>
            
            <div class="text-center py-4">
                <v-btn icon="mdi-theme-light-dark" variant="tonal" color="primary" @click="toggleTheme"></v-btn>
            </div>
        </div>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main class="bg-background flex-grow-1 position-relative">
          <!-- Mobile Menu Toggle (Fixed) -->
          <v-app-bar v-if="isMobile" color="surface" elevation="2" density="compact" class="glass-header">
             <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
             <v-toolbar-title class="text-subtitle-1 font-weight-bold">
                 {{ userStore.userAll.user.first_name[lang] }}
             </v-toolbar-title>
             <v-spacer></v-spacer>
          </v-app-bar>

        <div id="h-main" class="d-flex flex-column h-100">
          <!-- Hero Section -->
          <section
            id="h-hero"
            class="section"
            v-if="userStore.userAll.user.theme.hero?.enabled"
            :style="{ order: userStore.userAll.user.theme.hero?.order - 2 }"
          >
            <Hero />
          </section>

          <!-- Dynamic Sections -->
          <div class="content-container pa-4 pa-md-8 mx-auto w-100" style="max-width: 1200px;">
            <section
              v-for="section in sections"
              :key="section.id"
              :id="section.id"
              class="section mb-16 scroll-mt-24" 
              v-show="section.enabled"
              :style="{ order: section.order }"
            >
              <component :is="section.component" />
            </section>
          </div>
        </div>
      </v-main>

      <!-- Footer (Global) -->
      <v-footer class="bg-surface text-center d-flex flex-column py-12 border-t">
          <div class="d-flex justify-center gap-4 mb-6 flex-wrap" v-if="userStore.userAll.socials">
             <v-btn
                v-for="(social, i) in userStore.userAll.socials"
                :key="i"
                :href="social.url"
                target="_blank"
                variant="flat"
                icon
                size="large"
                :color="social.icon.color || 'surface-variant'"
                class="social-btn elevation-2"
              >
                <v-icon :icon="social.icon.icon" size="24"></v-icon>
              </v-btn>
          </div>
          
          <v-divider class="mb-6 w-25 mx-auto"></v-divider>

          <div class="text-body-1 font-weight-medium mb-2">
               &copy; {{ new Date().getFullYear() }} 
               <span class="text-primary">{{ userStore.userAll.user.first_name[lang] }}</span>. 
               All Rights Reserved.
          </div>
          <div class="text-caption text-disabled d-flex align-center gap-1">
             Made with <v-icon icon="mdi-heart" color="error" size="small"></v-icon> by 
             <a href="#" class="text-primary text-decoration-none font-weight-bold hover-link">Hesham Mohamed</a>
          </div>

          <ScrollTop />
      </v-footer>


      <!-- Dialogs -->
      <v-dialog max-width="500" v-model="dialogNoteUser" persistent>
        <v-card class="pa-6 text-center rounded-xl">
          <v-icon icon="mdi-account-off" size="64" color="error" class="mb-4"></v-icon>
          <v-card-title class="text-h5 mb-2">{{ route.params.id }}</v-card-title>
          <v-card-text class="text-body-1">لا يوجد سيره ذاتية لهذا المستخدم</v-card-text>
        </v-card>
      </v-dialog>

       <v-dialog v-model="dialogHelp" max-width="600">
        <v-card class="rounded-xl pa-2">
            <v-card-title class="d-flex align-center gap-2 text-primary">
                <v-icon icon="mdi-lifebuoy" color="primary"></v-icon>
                تلميح
            </v-card-title>
            <v-card-text>
                <p class="mb-4 text-body-1">
                    هنا ستري البيانات التي ستقوم بإضافتها من لوحة التحكم.<br>
                    يمكنك التحكم في ترتيب الأقسام وإظهارها أو إخفائها بسهولة.
                </p>
                <v-checkbox
                    v-model="checkboxHent"
                    label="لا تظهر هذا التلميح مرة أخرى"
                    color="primary"
                    hide-details
                ></v-checkbox>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="elevated" @click="closeDialog">حسناً، فهمت</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    
    <!-- Loading State -->
    <div v-else class="d-flex justify-center align-center fill-height bg-background">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </div>
  </v-app>
</template>

<script setup>
import axios from 'axios';
import { useDisplay } from 'vuetify';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { useTheme } from 'vuetify';

// Components
import About from '@/components/cvComponents/About.vue';
import Skills from '@/components/cvComponents/Skills.vue';
import Academic from '@/components/cvComponents/Academic.vue';
import Experience from '@/components/cvComponents/Experience.vue';
import Work from '@/components/cvComponents/Work.vue';
import Services from '@/components/cvComponents/Services.vue';
import Blog from '@/components/cvComponents/Blog.vue';
import Content from '@/components/cvComponents/Content.vue';
import ScrollTop from '@/components/cvComponents/ScrollTop.vue';
import Hero from '@/components/cvComponents/Hero.vue';


// State
const route = useRoute();
const userStore = useUserStore();
const { mobile } = useDisplay();
const lang = route.params.lang;
const theme = useTheme();

const drawer = ref(false);
const isMobile = computed(() => mobile.value);
const getData = ref(false);
const dialogHelp = ref(false);
const dialogNoteUser = ref(false);
const checkboxHent = ref(false);
const activeSection = ref('hero');
const isScrolled = ref(false);

const isHeroDark = computed(() => {
    // Assumption: Hero has a dark background/image. 
    // In a real usage, this might depend on theme config, but for now we assume Dark overlay.
    return true; 
});

let userAuthId = false;
try {
  if (localStorage.user && localStorage.user !== 'undefined') {
    userAuthId = JSON.parse(localStorage.user).id;
  }
} catch (e) {
  console.error('Error parsing user data:', e);
}

// Menu Items Logic
const menuItems = computed(() => {
    if (!userStore.userAll?.user?.theme) return [];
    
    const themeConfig = userStore.userAll.user.theme;
    const isEn = lang === 'en';
    
    const items = [
        { key: 'hero', href: '#h-hero', text: isEn ? 'Home' : 'الرئيسية', icon: 'mdi-home-outline' },
        { key: 'about', href: '#h-about', text: isEn ? 'About' : 'عني', icon: 'mdi-account-outline' },
        { key: 'services', href: '#h-services', text: isEn ? 'Services' : 'الخدمات', icon: 'mdi-briefcase-outline' },
        { key: 'skills', href: '#h-skills', text: isEn ? 'Skills' : 'المهارات', icon: 'mdi-star-outline' },
        { key: 'academics', href: '#h-academic', text: isEn ? 'Education' : 'التعليم', icon: 'mdi-school-outline' },
        { key: 'experiences', href: '#h-experience', text: isEn ? 'Experience' : 'الخبرة', icon: 'mdi-history' },
        { key: 'work', href: '#h-work', text: isEn ? 'Work' : 'الأعمال', icon: 'mdi-laptop' },
        { key: 'blog', href: '#h-blog', text: isEn ? 'Blog' : 'مدونة', icon: 'mdi-post-outline' },
        { key: 'contacts', href: '#h-contact', text: isEn ? 'Contact' : 'اتصل بنا', icon: 'mdi-email-outline' },
    ];

    return items
        .filter(item => themeConfig[item.key]?.enabled)
        .map(item => ({
            ...item,
            order: themeConfig[item.key]?.order || 0,
            enabled: themeConfig[item.key]?.enabled
        }))
        .sort((a, b) => a.order - b.order);
});

// Sections Mapping
const sections = computed(() => {
    if (!userStore.userAll?.user?.theme) return [];
    const theme = userStore.userAll.user.theme;
    return [
        { id: 'h-about', component: About, enabled: theme.about?.enabled, order: theme.about?.order },
        { id: 'h-skills', component: Skills, enabled: theme.skills?.enabled, order: theme.skills?.order },
        { id: 'h-academic', component: Academic, enabled: theme.academics?.enabled, order: theme.academics?.order },
        { id: 'h-experience', component: Experience, enabled: theme.experiences?.enabled, order: theme.experiences?.order },
        { id: 'h-work', component: Work, enabled: theme.work?.enabled, order: theme.work?.order },
        { id: 'h-services', component: Services, enabled: theme.services?.enabled, order: theme.services?.order },
        { id: 'h-blog', component: Blog, enabled: theme.blog?.enabled, order: theme.blog?.order },
        { id: 'h-contact', component: Content, enabled: theme.contacts?.enabled, order: theme.contacts?.order },
    ].sort((a, b) => (a.order || 0) - (b.order || 0));
});


function closeDialog() {
  if (checkboxHent.value) {
    localStorage.hentHero = checkboxHent.value;
  }
  dialogHelp.value = false;
}

const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if(el) {
        // Offset for the fixed header
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
        });
    }
}

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

// Scroll Spy & Sticky Header Logic
let observer = null;
const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

const setupIntersectionObserver = () => {
    const options = {
        root: null,
        rootMargin: '-30% 0px -45% 0px', // Wider detection zone
        threshold: 0
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const map = {
                    'h-hero': 'hero',
                    'h-about': 'about',
                    'h-services': 'services',
                    'h-skills': 'skills',
                    'h-academic': 'academics',
                    'h-experience': 'experiences',
                    'h-work': 'work',
                    'h-blog': 'blog',
                    'h-contact': 'contacts'
                };
                
                if (map[id]) {
                    activeSection.value = map[id];
                }
            }
        });
    }, options);

    const heroEl = document.getElementById('h-hero');
    if(heroEl) observer.observe(heroEl);

    sections.value.forEach(section => {
        const el = document.getElementById(section.id);
        if(el) observer.observe(el);
    });
};

onMounted(() => {
  window.scrollTo(0, 0);
  window.addEventListener('scroll', handleScroll);
  
  axios.get(`users-all/${route.params.id}`)
    .then(res => {
      userStore.userAll = res.data.data;
      
      const link = document.querySelector("link[rel='icon']");
      if(link && res.data.data.user.profile_image) {
          link.href = res.data.data.user.profile_image;
      }

      getData.value = true;
      userStore.isLoader = false;
      dialogHelp.value = userAuthId === res.data.data.user.id && !localStorage.hentHero;
      
      // Init visuals after data load
      nextTick(() => {
          AOS.init();
          setupIntersectionObserver();
      });
    })
    .catch(error => {
      console.error(error);
      dialogNoteUser.value = true;
      userStore.isLoader = false;
    });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if(observer) observer.disconnect();
});

// Watch mobile state
watch(isMobile, (val) => {
    if(!val) drawer.value = false;
});

</script>

<route lang="yaml">
meta:
  layout: pure
</route>

<style lang="scss">
// Premium Enhancements
.transition-all {
    transition: all 0.3s ease;
}
.transition-colors {
    transition: color 0.3s ease, background-color 0.3s ease;
}

.glass-header {
    backdrop-filter: blur(12px);
    background: rgba(var(--v-theme-surface), 0.85) !important;
    border-bottom: 1px solid rgba(var(--v-border-color), 0.05);
}

.glass-drawer {
    backdrop-filter: blur(10px) !important;
    background: rgba(var(--v-theme-surface), 0.95) !important;
}

.scroll-mt-24 {
    scroll-margin-top: 100px; /* Offset for sticky header */
}

.cursor-pointer {
    cursor: pointer;
}

.social-btn {
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &:hover {
        transform: translateY(-5px);
    }
}

.hover-link:hover {
    text-decoration: underline !important;
}

html {
    scroll-behavior: smooth;
    overflow-x: hidden;
}
</style>
