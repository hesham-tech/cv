<template>
  <div class="main-app">
    <loader v-if="userStore.isLoader" />
    <loadengApi v-if="userStore.loadengApi" />
    <popupError v-if="userStore.popupError" />
    <router-view />
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
// import '@/Service/apiService';
// import { fetchItems } from '@/Service/apiService';

const userStore = useUserStore();
// userStore.setAuthHeaderNew(localStorage.token).then(() => {
//   userStore.isAuth = true;
//   userStore
//     .fetchUser()
//     .then(() => {
//       userStore.isLoader = false;
//       userStore.loadengApi = false;
//       userStore.popupError = false;
//       console.log(' userStore App', userStore.user);
//     })
//     .catch(() => {
//       if (!localStorage.token) {
//         userStore.isLoader = false;
//         userStore.loadengApi = false;
//         userStore.popupError = false;
//       }
//     });
// });
onMounted(() => {
  // userStore.loadengApi = true;
});
</script>
<style lang="scss">
body {
  background-color: #f5f5f5;
}

.v-card-subtitle {
  white-space: normal !important;
}

* {
  text-decoration: none;
}

table {
  * {
    border-radius: 0px;
  }
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.sticky-column {
  position: -webkit-sticky;
  position: sticky;
  background-color: #ffffff94;
  left: 0;
  z-index: 10;
}

.text-alert {
  margin: 10px;
  padding: 5px;
  color: red;
  text-align: center;
  font-size: 20px;
  border-radius: 7px;
  background-color: rgb(116 141 128 / 43%);
}

.v-btn--size-small {
  width: 23px !important;
  height: 23px !important;
}

.v-messages__message {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 16px;
  transition: background-color 1s ease;
}

.v-alert--density-default {
  padding: 3px !important;
}

.title-section {
  text-align: center;
  margin-bottom: 20px !important;
  width: 100%;
  margin: auto;

  h2 {
    font-size: 30px;
    color: #333333;
    padding: 10px;
    font-family: 'Source Sans Pro', sans-serif;
  }

  .top,
  .center,
  .bottom {
    height: 1px;
    background-color: #333333;
    margin: auto;
    position: relative;
  }

  .top,
  .bottom {
    width: 50px;
    margin: 1px auto;
  }

  .center {
    width: 150px;
    margin: 4px auto;
  }
}
</style>
