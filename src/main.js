import { registerPlugins } from '@/plugins';

import App from './App.vue';

import 'animate.css';
import axios from 'axios';
// import '@/Service/apiService';

const BASE_URL = window.location.protocol === 'https:' ? 'https://cv-api.hwnix.com/api/' : 'http://127.0.0.1:8000/api/';
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
axios.defaults.headers.common['Accept'] = 'application/json';

import { createApp } from 'vue';
const app = createApp(App);
registerPlugins(app);
app.mount('#app');
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
userStore.setAuthHeaderNew(localStorage.token).then(() => {
  userStore
    .fetchUser()
    .then(() => {
      userStore.isLoader = false;
      userStore.loadengApi = false;
      userStore.popupError = false;
      console.log(' userStore main js', JSON.parse(JSON.stringify(userStore.user)));
    })
    .catch(() => {
      if (!localStorage.token) {
        userStore.isLoader = false;
        userStore.loadengApi = false;
        userStore.popupError = false;
      }
    });
});
