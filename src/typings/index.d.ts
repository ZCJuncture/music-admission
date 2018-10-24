import 'vue/types/vue';

declare module 'vue/types/vue' {
  interface Vue {
    $bus: VueBus;
    $cookies: VueCookies;
  }

  interface VueConstructor {
    bus: VueBus;
    cookies: VueCookies;
  }
}

interface VueBus {
  on(event: string | string[], callback: (...args: any[]) => void): this;
  once(event: string, callback: (...args: any[]) => void): this;
  off(event?: string | string[], callback?: (...args: any[]) => void): this;
  emit(event: string, ...args: any[]): this;
}

interface VueCookies {
  config(expireTimes: string | number | Date, path?: string): void;
  set(keyName: string, value: any, expireTimes?: string | number | Date,
      path?: string, domain?: string, secure?: boolean): this;
  get(keyName: string): any;
  remove(keyName: string, path?: string, domain?: string): this;
  isKey(keyName: string): boolean;
  keys(): any[];
}
