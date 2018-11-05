import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import api from '@/api';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/index',
      component: () => import(/* webpackChunkName: "index" */ './views/index/Index.vue'),
      beforeEnter: async (to, from, next) => {
        if (!await isLogin()) { next(); } else { next({ path: '/home/brief', replace: true }); }
      },
      children: [
        {
          path: 'login',
          component: () => import(/* webpackChunkName: "index" */ './views/index/Login.vue'),
        },
        {
          path: 'register',
          component: () => import(/* webpackChunkName: "index" */ './views/index/Register.vue'),
        },
      ],
    },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "home" */ './views/home/Home.vue'),
      beforeEnter: async (to, from, next) => {
        if (await isLogin()) { next(); } else { next({ path: '/index/login', replace: true }); }
      },
      children: [
        {
          path: 'brief',
          component: () => import(/* webpackChunkName: "home" */ './views/home/info/Brief.vue'),
        },
        {
          path: 'newsList',
          component: () => import(/* webpackChunkName: "home" */ './views/home/info/NewsList.vue'),
        },
        {
          path: 'noticeList',
          component: () => import(/* webpackChunkName: "home" */ './views/home/info/NoticeList.vue'),
        },
        {
          path: 'fillOut',
          component: () => import(/* webpackChunkName: "home" */ './views/home/enroll/FillOut.vue'),
        },
      ],
    },
    {
      path: '/',
      redirect: '/home/brief',
    },
  ],
});

async function isLogin() {
  const token = Vue.cookies.get('token');

  if (!token) { return false; } else { store.state.token = token; }

  try {
    const user = await api.checkStatus();
    store.commit('setUser', user);
    return true;
  } catch (e) {
    return false;
  }
}
