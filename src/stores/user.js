// stores/user.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    userAll: null,
    isAuth: false,
    isLoader: false,
    popupError: false,
    loadengApi: false,
    errorMessag: null,
    defaultThem: {
      enabled: true,
      imag: {
        enabled: true,
      },
      progress: {
        enabled: true,
        backgroundColor: '',
      },
      sectionTitle: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
      },
      mainTitle: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
      },
      subTitle: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
      },
      paragraph: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
      },
      button: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
        borderColor: '',
        borderWidth: '',
        borderRadius: '',
      },
      buttonCv: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
        borderColor: '',
        borderWidth: '',
        borderRadius: '',
      },
      buttonWork: {
        enabled: true,
        backgroundColor: '',
        textColor: '',
        fontSize: '',
        borderColor: '',
        borderWidth: '',
        borderRadius: '',
      },
    },
    // role: null,
  }),

  actions: {
    setAuthHeaderNew(token) {
      this.loadengApi = true;
      return new Promise((resolve, reject) => {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          let userId = 0;
          try {
            if (localStorage.user && localStorage.user !== 'undefined') {
              userId = JSON.parse(localStorage.user).id;
            }
          } catch (e) { console.error('Error parsing user', e); }

          axios
            .get(`users/${userId}`)
            .then(res => {
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              this.user = res.data.data;
              console.log('this.user', this.user);
              if (!this.user.theme.hero) {
                this.user.theme = {
                  hero: this.defaultThem,
                  about: this.defaultThem,
                  skills: this.defaultThem,
                  academics: this.defaultThem,
                  experiences: this.defaultThem,
                  work: this.defaultThem,
                  // services: this.defaultThem,
                  // blog: this.defaultThem,
                  contacts: this.defaultThem,
                };
                axios.post(`users-theme/${userId}`, { theme: this.user.theme, _method: 'put' });
              }
              this.isLoader = false;
              this.isAuth = true;
              this.loadengApi = false;
              resolve();
            })
            .catch(error => {
              console.log('setAuthHeader error', error);
              if (error.message === 'Request failed with status code 401') {
                this.isAuth = false;
                this.loadengApi = false;
                delete axios.defaults.headers.common['Authorization'];
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                location.reload(true);
              } else {
                this.isAuth = false;
                this.loadengApi = false;
                this.popupError = true;
                this.errorMessag = error.message;
                // console.log("error:", error.message);
              }
              reject();
            });
        } else {
          delete axios.defaults.headers.common['Authorization'];
          this.isAuth = false;
          this.isLoader = false;
          // router.push('/login');
        }
      });
    },
    fetchUser() {
      let userId = 0;
      try {
        if (localStorage.user && localStorage.user !== 'undefined') {
          userId = JSON.parse(localStorage.user).id;
        }
      } catch (e) { console.error('Error parsing user', e); }

      return new Promise((resolve, reject) => {
        axios
          .get(`users/${userId}`)
          .then(res => {
            this.user = res.data.data;
            this.isLoader = false;
            this.loadengApi = false;
            this.isAuth = true;
            resolve();
          })
          .catch(error => {
            this.isLoader = false;
            this.loadengApi = false;
            if (error.message === 'Request failed with status code 401') {
              this.isAuth = false;
              delete axios.defaults.headers.common['Authorization'];
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            } else {
              this.isLoader = false;
              this.loadengApi = false;
              this.popupError = true;
              this.errorMessag = error.message;
              // console.log("error:", error.message);
            }
            // console.log("Error", error.message);
            reject(error);
          });
      });
    },
  },
  getters: {
    userName: state => (state.user ? state.user.nameName : 'Guest'),
    role: state => (state.user ? state.user.role : 'Guest'),
  },
});
