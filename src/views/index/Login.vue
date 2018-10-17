<template lang="pug">
  .root-login
    .wp-news
      h2 最新公告
      h3 111
      h3 222

    .wp-login
      el-form(ref="form" :model="model" :rules="rules")
        el-form-item(prop="phoneNumber")
          el-input(v-model="model.phoneNumber" placeholder="手机号码")
        el-form-item(prop="password")
          el-input(v-model="model.password" placeholder="密码" type="password")
        el-form-item
          el-button(type="primary" @click="login()" :loading="logining") 登&nbsp;&nbsp;&nbsp;录

      .login-footer
        el-button(type="text" @click="register()") 忘记密码
        el-button.btn-register(type="text" @click="register()") 报名注册
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import * as crypto from 'crypto-browserify';
import api from '@/api';

@Component({})
export default class Login extends Vue {
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

  public login(): void {
    (this.$refs.form as Form).validate(async (valid: boolean) => {
      if (valid) {
        this.logining = true;

        try {
          const md5 = crypto.createHash('md5');
          md5.update(this.model.password);
          const cryptoString: string = md5.digest('hex');

          const { token } = await api.login({
            phoneNumber: this.model.phoneNumber,
            password: cryptoString,
          });

          this.$cookies.set('token', token);
          this.$store.commit('setToken', token);
          this.$router.replace('/home');
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.logining = false;
        }
      }
    });
  }

  public register(): void {
    this.$router.replace('register');
  }
}
</script>

<style lang="scss">
@import '../../styles';

.root-login {
  @extend .center-hv;
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
    padding: 20px;
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
      @extend .center-hv;
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
