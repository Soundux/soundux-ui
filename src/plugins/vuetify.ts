import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: { customProperties: true },
    themes: {
      dark: {
        primary: '#52b18c',
      },
      light: {
        primary: '#52b18c',
      },
    },
  },
});
