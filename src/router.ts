import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import api from '@/api';

Vue.use(Router);

const router = new Router({
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
        {
          path: 'onlinePay',
          component: () => import(/* webpackChunkName: "home" */ './views/home/enroll/OnlinePay.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) { next('/home/brief'); } else { next(); }
});

router.afterEach((to, from) => {
  const array = to.path.split('/');
  const path = array[array.length - 1];
  Vue.bus.emit('routeTo', path);
});

async function isLogin() {
  const token = Vue.cookies.get('token');

  if (!token) { return false; } else { store.commit('setToken', token); }

  try {
    const user = await api.checkStatus();
    store.commit('setUser', user);
    store.commit('setStatus', user.status);
    return true;
  } catch (e) {
    return false;
  }
}

export default router;
