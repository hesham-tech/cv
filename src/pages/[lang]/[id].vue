<template>
  <div
    :style="{
      direction: lang === 'en' ? 'ltr' : 'rtl',
    }"
  >
    <v-dialog max-width="600" v-model="dialogNoteUser" persistent>
      <v-card class="my-10">
        <v-card-title class="text-center my-10">{{ route.params.id }} لا يوجد سيره زاتية لهاذا المستخدم </v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogHelp">
      <v-card class="elevation-5 text-center card-size">
        <div class="card-content">
          <v-card-title justify="center" color="primary" variant="outlined" class="my-1 mx-1">
            <span class="mdi mdi-lifebuoy"></span> تلميح
          </v-card-title>
          <v-card-text class="mb-4">
            هنا ستري البيانات التي ستقوم بإضافتها من لوحة التحكم <br />
            عن طريق الضغط على زر <v-icon color="info" size="35" icon="mdi-plus-outline"></v-icon> داخل كل قسم.
            <br />
            باستخدام هذا الزر
            <v-icon color="info" size="35" icon="mdi-palette-outline"></v-icon>، يمكنك التحكم في ترتيب الأقسام، وكذلك إظهارها أو إخفاءها حسب رغبتك.
            <br />
            بالإضافة إلى ذلك، يمكنك تخصيص أحجام وألوان النصوص والأزرار بسهولة.
          </v-card-text>
          <v-checkbox-btn
            style="width: fit-content"
            class="text-center ma-auto"
            color="info"
            v-model="checkboxHent"
            label=" لا تظهر التلميح مره اخري  "
          ></v-checkbox-btn>
          <v-card-subtitle color="info"> هذه الرساله لا تظهر عند مشاركة السيره الزاتية الخاصه بك مع الاخرين </v-card-subtitle>
          <v-divider class="my-3"></v-divider>
          <v-btn class="my-3" text="شكرا" @click="closeDialog"></v-btn>
        </div>
      </v-card>
    </v-dialog>
    <div id="h-page" v-if="getData">
      <!-- <div class=""> -->
        <div
          class="box-toggle"
          :style="{
            [lang === 'en' ? 'left' : 'right']: '0',
            width: boxToggleeWidth,
          }"
        >
          <span v-if="btnToggle" @click="funToggled" :class="toggled ? 'mdi mdi-close' : 'mdi mdi-menu'" class="btn-toggle"></span>
          <aside
            v-show="isVisible"
            :class="['animate__animated', animationClassToggle]"
            id="h-aside"
            :style="{ width: asideWidth, [lang === 'en' ? 'left' : 'right']: '0' }"
          >
            <AsideApp />
          </aside>
        </div>
        <div id="h-main" :style="mainMarginStyle">
          <div v-if="btnToggle" :class="{ mainOverlay: toggled }" @click="funToggled"></div>
          <section
            id="h-hero"
            class="h-hero section"
            :style="{ order: userStore.userAll.user.theme.hero?.order - 2 }"
            v-if="userStore.userAll.user.theme.hero?.enabled"
            ref="heroRef"
          >
            <Hero />
          </section>
          <div style="display: flex; flex-direction: column; justify-content: center" class="pa-4">
            <section
              class="h-about section"
              :style="{ order: userStore.userAll.user.theme.about?.order - 2 }"
              v-if="userStore.userAll.user.theme.about?.enabled"
              id="h-about"
              ref="aboutRef"
            >
              <About />
            </section>
            <section
              class="h-skills section"
              :style="{ order: userStore.userAll.user.theme.skills?.order - 2 }"
              v-if="userStore.userAll.user.theme.skills?.enabled"
              id="h-skills"
              ref="skillsRef"
            >
              <Skills />
            </section>
            <section
              class="h-academic section"
              :style="{ order: userStore.userAll.user.theme.academics?.order - 2 }"
              v-if="userStore.userAll.user.theme.academics?.enabled"
              id="h-academic"
              ref="academicRef"
            >
              <Academic />
            </section>
            <section
              class="h-experience section"
              :style="{ order: userStore.userAll.user.theme.experiences?.order - 2 }"
              v-if="userStore.userAll.user.theme.experiences?.enabled"
              id="h-experience"
              ref="experienceRef"
            >
              <Experience />
            </section>
            <section
              :style="{ order: userStore.userAll.user.theme.work?.order - 2 }"
              v-if="userStore.userAll.user.theme.work?.enabled"
              id="h-work"
              class="h-work section"
              ref="workRef"
            >
              <Work />
            </section>
            <section
              :style="{ order: userStore.userAll.user.theme.services?.order - 2 }"
              v-if="userStore.userAll.user.theme.services?.enabled"
              id="h-services"
              class="h-services section"
              ref="servicesRef"
            >
              <Services />
            </section>
            <section
              :style="{ order: userStore.userAll.user.theme.blog?.order - 2 }"
              v-if="userStore.userAll.user.theme.blog?.enabled"
              id="h-blog"
              class="h-blog section"
              ref="blogRef"
            >
              <Blog />
            </section>
            <section
              :style="{ order: userStore.userAll.user.theme.contacts?.order - 2 }"
              v-if="userStore.userAll.user.theme.contacts?.enabled"
              id="h-contact"
              class="h-contact section"
              ref="contactRef"
            >
              <Content />
            </section>
          </div>
        </div>
      <!-- </div> -->
      <ScrollTop />
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ref, onMounted, watch, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
const route = useRoute();
const lang = route.params.lang;
const userStore = useUserStore();
const toggled = ref(true);
const btnToggle = ref(true);
const userAuthId = localStorage.user ? JSON.parse(localStorage.user).id : false;
const userAllData = ref([]);
const getData = ref(false);
const asideWidth = ref('30vw');
const boxToggleeWidth = ref('30vw');
const animationClassToggle = ref(null);
const isVisible = ref(true);
const dialogHelp = ref(false);
const checkboxHent = ref(false);
const dialogNoteUser = ref(false);
const mediaQuery = window.matchMedia('(max-width: 768px)');
const windowWidth = ref(window.innerWidth);

// Computed property للتحقق من حجم الشاشة وتطبيق margin
const mainMarginStyle = computed(() => {
  if (windowWidth.value > 800) {
    return {
      [lang === 'en' ? 'margin-left' : 'margin-right']: '270px'
    };
  }
  return {};
});

userStore.loadengApi = false;
function closeDialog() {
  if (checkboxHent.value) {
    localStorage.hentHero = checkboxHent.value;
  }
  dialogHelp.value = false;
}
onMounted(() => {
  userStore.loadengApi = false;
  window.addEventListener('scroll', setActiveNavItem);
  
  // تتبع تغيير حجم الشاشة
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };
  window.addEventListener('resize', handleResize);
  
  handleMediaChange(mediaQuery); // Initial check
  // mediaQuery.addEventListener('change', handleMediaChange);
  // mediaQuery.addEventListener('resize', handleMediaChange);

  axios
    .get(`users-all/${route.params.id}`)
    .then(res => {
      userAllData.value = res.data.data;
      userStore.userAll = res.data.data;
      console.log('userStore.userAll', userStore.userAll);

      const link = document.querySelector("link[rel='icon']");
      console.log(res.data.data.user.profile_image);

      link.href = res.data.data.user.profile_image;
      // console.log(userStore.userAll.user.profile_image);
      getData.value = true;
      userStore.loadengApi = false;
      userStore.isLoader = false;
      dialogHelp.value = userAuthId === res.data.data.user.id && !localStorage.hentHero;
    })
    .catch(error => {
      // console.log(error);
      dialogNoteUser.value = true;
      userStore.isLoader = false;
      userStore.loadengApi = false;
    });
});

function setActiveNavItem() {
  const navItems = document.querySelectorAll('#nav li');
  const sections = document.querySelectorAll('section');
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPos = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // تحديد الحد الأدنى للتمرير المطلوب لتفعيل القسم
    // تغيير من 0.5 (منتصف الشاشة) إلى 0.1 (أعلى الشاشة)
    const activateThreshold = sectionTop - windowHeight * 0.1;

    if (scrollPos >= activateThreshold && scrollPos < sectionTop + sectionHeight) {
      currentSection = section.id.slice(2);
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.firstElementChild.getAttribute('href') === `#h-${currentSection}`) {
      item.classList.add('active');
    }
  });
}

function funToggled() {
  if (isVisible.value && toggled.value) {
    animationClassToggle.value = 'animate__flipOutY';
    setTimeout(() => {
      toggled.value = false;
      isVisible.value = false;
    }, 400);
  } else {
    animationClassToggle.value = 'animate__flipInY';
    toggled.value = true;
    isVisible.value = true;
    asideWidth.value = '40vw';
  }
}
function handleMediaChange() {
  if (windowWidth.value <= 800) {
    // شاشة صغيرة (أقل من أو تساوي 800px)
    console.log('Screen size: Small (≤800px)');
    toggled.value = false;
    isVisible.value = false;
    boxToggleeWidth.value = 'auto';
    btnToggle.value = true;
  } else {
    // شاشة كبيرة (أكبر من 800px)
    console.log('Screen size: Large (>800px)');
    boxToggleeWidth.value = '20vw';
    asideWidth.value = '100%';
    toggled.value = true;
    btnToggle.value = false;
    isVisible.value = true;
  }
}
watch(
  () => windowWidth.value,
  () => handleMediaChange()
);

handleMediaChange();
</script>
<route lang="yaml">
meta:
  layout: pure
</route>
<style lang="scss">
.h-hero {
  position: static;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 1;
  transform: none;
  height: 100vh;
}

* {
  text-decoration: none;
}
#h-main {
  flex-grow: 1;
  width: auto;
  flex: 1;

}

/* طبقة overlay التي تظهر عند فتح القائمة الجانبية على الشاشات الصغيرة */
/* تسمح بإغلاق القائمة عند النقر عليها */
/* تأثير blur هادئ وبسيط - Glassmorphism */
.mainOverlay {
  background-color: rgba(255, 255, 255, 0.05); /* شفاف جداً مع لمسة بيضاء خفيفة */
  backdrop-filter: blur(8px); /* تأثير blur هادئ */
  -webkit-backdrop-filter: blur(2px); /* دعم Safari */
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99;
  cursor: pointer;
  transition: all 0.3s ease; /* انتقال سلس */
}
#h-main-menu {
  width: 100%;
}
.aside-visible {
  width: 300px;
}

.aside-hidden {
  width: 0px;
}
.container-wrap {
  display: flex;
  position: relative;
}
.box-toggle {
  position: fixed;
  top: 0;
  z-index: 10000; // أعلى من جميع العناصر
}

#h-aside {
  position: fixed !important;
  top: 0;
  height: 100vh;
  width: 270px;
  max-width: 270px;
  background-color: #f0f0f0;
  transition: opacity 0.5s ease, width 1s ease;
  z-index: 9999;
}
@media screen and (max-width: 768px) {
  #h-aside {
    overflow: hidden;
  }
}

.btn-toggle {
  position: absolute;
  top: 0;
  font-size: 60px;
  cursor: pointer;
  display: inline-block;
  color: #3498db;
  z-index: 10001; // أعلى من كل شيء للتأكد أن الزر يظهر دائماً
}
.box-socials {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px;
  div {
    margin: 3px;
  }
}
</style>
