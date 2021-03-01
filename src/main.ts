import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import i18n from './i18n';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

Vue.use(Toast, {
  // toast options
  position: 'bottom-right',
  timeout: 3000,
  closeOnClick: false,
  // plugin options
  transition: 'Vue-Toastification__fade',
  maxToasts: 3,
  newestOnTop: true,
});

dayjs.extend(duration);

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app');
