import axios, { AxiosPromise } from 'axios';
import store from '@/store';

class Api {
  // private HOST: string = 'http://localhost:7001/';
  private HOST: string = 'http://123.206.27.201:7001/';

  public checkStatus() {
    return this.get('user/checkStatus');
  }

  public register(data: any) {
    return this.post('user/register', data);
  }

  public login(data: any) {
    return this.post('user/login', data);
  }

  public logout() {
    return this.get('user/logout');
  }

  private get(url: string) {
    const promise: AxiosPromise = axios.get(
      this.HOST + url,
      {
        headers: {
          token: store.state.token,
        },
      },
    );
    return this.handleResult(promise);
  }

  private post(url: string, data: any) {
    const promise: AxiosPromise = axios.post(
      this.HOST + url,
      data,
      {
        headers: {
          token: store.state.token,
        },
      },
    );
    return this.handleResult(promise);
  }

  private async handleResult(promise: AxiosPromise) {
    try {
      const resp: any = await promise;
      return resp.data;
    } catch (e) {
      // if (e.response.status === 403) {

      // } else {
      //   throw e.response;
      // }
      throw e.response;
    }
  }
}

export default new Api();
