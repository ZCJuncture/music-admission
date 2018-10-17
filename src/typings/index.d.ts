import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $cookies: any;
  }

  interface VueConstructor {
    cookies: any;
  }
}
