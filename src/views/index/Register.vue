<template lang="pug">
  .root-register
    .wp-register
      .wp-logo
        img(src="@/assets/logo-register.png")

      el-form(ref="form" :model="model" :rules="rules")
        .input-title
          h2 考生报名
          .wp-btn-back
            el-button.btn-back(type="text" icon="el-icon-back" @click="back()") 返回

        el-form-item(prop="phoneNumber")
          el-input(v-model="model.phoneNumber" placeholder="手机号码")

        el-form-item(prop="smsCode")
          el-input(v-model="model.smsCode" placeholder="验证码")
            el-button.btn-code(slot="append" size="small" @click="getSmsCode()" :disabled="countdown > 0")
              span(v-if="countdown === 0") 获取
              span(v-else) {{countdown}}

        el-form-item(prop="password")
          el-input(v-model="model.password" placeholder="密码" type="password")

        el-form-item(prop="password2")
          el-input(v-model="model.password2" placeholder="确认密码" type="password" @keyup.enter.native="register()")

        el-form-item
          el-button.btn-register(type="primary" @click="register()" :loading="registering") 注&nbsp;&nbsp;&nbsp;册
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import MD5 from 'md5.js';
import api from '@/api';

@Component({})
export default class Register extends Vue {
  private model = {
    phoneNumber: '',
    smsCode: '',
    password: '',
    password2: '',
  };

  private countdown: number = 0;
  private registering: boolean = false;

  private rules = {
    phoneNumber: [
      {
        required: true,
        pattern: /^1[345789]\d{9}$/,
        message: '手机号码格式不正确',
        trigger: 'blur',
      },
    ],
    smsCode: [
      {
        required: true,
        pattern: /^\d{6}$/,
        message: '验证码应为6位数字',
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
    password2: [
      {
        validator: (rule: any, value: string, callback) => {
          if (value !== this.model.password) {
            callback(new Error('两次密码不一致'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  };

  public getSmsCode() {
    if (!/^1[345789]\d{9}$/.test(this.model.phoneNumber)) {
      this.$message.warning('手机号码格式不正确');
      return;
    }

    this.countdown = 60;
    const interval = setInterval(() => {
      if (--this.countdown === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  public register() {
    (this.$refs.form as Form).validate(async (valid: boolean) => {
      if (valid) {
        this.registering = true;

        try {
          await api.register({
            phoneNumber: this.model.phoneNumber,
            password: new MD5().update(this.model.password).digest('hex'),
          });

          this.$message.success('注册成功');
          this.$router.replace('login');
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.registering = false;
        }
      }
    });
  }

  public back() {
    this.$router.replace('login');
  }
}
</script>

<style lang="scss">
@import '../../styles';

.root-register {
  @include center-hv;
  height: 100%;

  .wp-register {
    @include center-v;
    box-sizing: border-box;
    width: 850px;
    height: 450px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 5px;

    .wp-logo {
      @include center-hv;
      width: 350px;
      height: 100%;

      img {
        width: 280px;
      }
    }

    .el-form {
      flex-grow: 1;
      padding: 60px;

      .input-title {
        @include center-v;
        color: $color-primary;

        .wp-btn-back {
          flex-grow: 1;
          text-align: right;

          .btn-back {
            font-size: 18px;
          }
        }
      }

      .el-form-item {
        margin-bottom: 18px;

        .el-input {
          font-size: 18px;
        }

        .btn-code {
          width: 80px;
          height: 100%;
          font-size: 16px;
        }

        .btn-register {
          width: 100%;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
