<template>
  <v-fab
    v-show="showButton"
    icon="mdi-arrow-up"
    color="secondary"
    location="bottom end"
    size="large"
    position="fixed"
    class="mb-4 me-4 animate__animated animate__fadeInUp"
    @click="scrollToTop"
    elevation="4"
    app
  ></v-fab>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);

const handleScroll = () => {
    // Show button when page is scrolled down 300px
    if (window.scrollY > 300) {
        showButton.value = true;
    } else {
        showButton.value = false;
    }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
