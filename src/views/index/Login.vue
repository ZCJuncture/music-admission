<template lang="pug">
  .root-login
    .wp-news(v-loading="loadingNews")
      h2 最新公告
      li(v-for="item in newsList")
        i.el-icon-document
        span.text-title(@click="showNews(item)") {{item.title}}
        .wp-date
          span {{item.createDate | date}}

    .wp-login
      el-form(ref="form" :model="model" :rules="rules")
        el-form-item(prop="phoneNumber")
          el-input(v-model="model.phoneNumber" placeholder="手机号码")
        el-form-item(prop="password")
          el-input(v-model="model.password" placeholder="密码" type="password" @keyup.enter.native="login()")
        el-form-item
          el-button(type="primary" @click="login()" :loading="logining") 登&nbsp;&nbsp;&nbsp;录

      .login-footer
        el-button(type="text") 忘记密码
        el-button.btn-register(type="text" @click="register()") 报名注册

    news-dialog(ref="dialog")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import MD5 from 'md5.js';
import NewsDialog from '@/components/NewsDialog.vue';
import api from '@/api';

@Component({
  components: { NewsDialog },
})
export default class Login extends Vue {
  private loadingNews: boolean = false;
  private newsList: any[] = [];

  private model = {
    phoneNumber: '',
    password: '',
  };

  private logining: boolean = false;

  private rules = {
    phoneNumber: [
      {
        required: true,
        pattern: /^1[345789]\d{9}$/,
        message: '手机号码格式不正确',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        min: 8,
        max: 20,
        message: '密码长度应在8到20个字符',
        trigger: 'blur',
      },
    ],
  };

  public async created() {
    try {
      this.loadingNews = true;
      const { list } = await api.getNewsList();
      this.newsList = list;
    } finally {
      this.loadingNews = false;
    }
  }

  public showNews(item: any) {
    (this.$refs.dialog as NewsDialog).showNews(item);
  }

  public login() {
    (this.$refs.form as Form).validate(async (valid: boolean) => {
      if (valid) {
        this.logining = true;

        try {
          const { token } = await api.login({
            phoneNumber: this.model.phoneNumber,
            password: new MD5().update(this.model.password).digest('hex'),
          });

          this.$cookies.set('token', token);
          this.$store.commit('setToken', token);
          this.$router.replace('/home/brief');
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.logining = false;
        }
      }
    });
  }

  public register() {
    this.$router.replace('register');
  }
}
</script>

<style lang="scss">
@import '../../styles';

.root-login {
  @include center-hv;
  height: 100%;

  .wp-common {
    box-sizing: border-box;
    height: 350px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 5px;
  }

  .wp-news {
    @extend .wp-common;
    width: 540px;
    padding: 25px;
    overflow: hidden;

    h2 {
      margin: 0 0 15px 0;
    }

    li {
      @include center-v;
      margin-top: 10px;

      .text-title {
        margin-left: 5px;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .wp-date {
        flex-grow: 1;
        text-align: right;
        font-size: 14px;
      }
    }
  }

  .wp-login {
    @extend .wp-common;
    width: 400px;
    margin-left: 10%;
    position: relative;

    .el-form {
      padding: 40px;

      .el-input {
        font-size: 18px;
      }

      .el-button {
        width: 100%;
        font-size: 18px;
      }
    }

    .login-footer {
      @include center-hv;
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 0;
      background-color: rgba(220, 220, 220, 0.7);
      border-radius: 5px;

      .el-button {
        font-size: 18px;
      }

      .btn-register {
        margin-left: 20%;
        font-weight: bold;
      }
    }
  }
}
</style>
