import 'core-js/fn/string/starts-with';

import Vue from 'vue';
import VueBus from 'vue-bus';
import VueCookies from 'vue-cookies';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from './router';
import store from './store';
import App from './App.vue';
import './filter';

Vue.use(VueBus);
Vue.use(VueCookies);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
