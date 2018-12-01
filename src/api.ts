import Vue from 'vue';
import axios, { AxiosPromise } from 'axios';
import store from '@/store';

class Api {
  private HOST: string = process.env.NODE_ENV === 'development' ?
    'http://localhost:7001/' : '/api/';

  private FILE_HOST: string = process.env.NODE_ENV === 'development' ?
    'http://localhost:7001/' : 'http://101.200.60.188:7001/';

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

  public resetPassword(data: any) {
    return this.post('user/resetPassword', data);
  }

  public changePassword(data: any) {
    return this.post('user/changePassword', data);
  }

  public getNewsList(keyword?: string | null, pageNo?: number, pageSize?: number) {
    return this.get('news/getNewsList', { keyword, pageNo, pageSize });
  }

  public getNoticeList(keyword?: string | null, pageNo?: number, pageSize?: number) {
    return this.get('notice/getNoticeList', { keyword, pageNo, pageSize });
  }

  public getMajorList() {
    return this.get('enroll/getMajorList');
  }

  public getExamInfo(major: string) {
    return this.get('enroll/getExamInfo', { major });
  }

  public updateInfo(data: any) {
    return this.post('enroll/updateInfo', data);
  }

  public modifyInfo(data: any) {
    return this.post('enroll/modifyInfo', data);
  }

  public uploadImageUrl(type: string) {
    return this.FILE_HOST + `enroll/uploadImage?type=${type}`;
  }

  public downloadImageUrl(fileName: string) {
    return this.FILE_HOST + `enroll/downloadImage?token=${store.state.token}&fileName=${fileName}`;
  }

  public deleteImage(type: string, fileName: string) {
    return this.get('enroll/deleteImage', { type, fileName }, this.FILE_HOST);
  }

  public getPayList() {
    return this.get('pay/getPayList');
  }

  public getPayInfo(payType: string, itemId: string, orderId?: string | null) {
    return this.get('pay/getPayInfo', { payType, itemId, orderId });
  }

  public getPayResult(payType: string, orderId: string) {
    return this.get('pay/getPayResult', { payType, orderId });
  }

  public printTicket() {
    return this.get('enroll/printTicket');
  }

  private get(url: string, params?: any, host = this.HOST) {
    const promise: AxiosPromise = axios.get(
      host + url,
      {
        headers: {
          token: store.state.token,
        },
        params,
      },
    );
    return this.handleResult(promise);
  }

  private post(url: string, data: any, host = this.HOST) {
    const promise: AxiosPromise = axios.post(
      host + url,
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
      if (e.response.status === 403) {
        Vue.bus.emit('tokenExpired');
      }
      throw e.response;
    }
  }
}

export default new Api();
