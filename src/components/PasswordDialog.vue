<template lang="pug">
  el-dialog.root-password-dialog(width="400px" :title="logined ? '修改密码' : '重置密码'" :visible.sync="show")
    el-form(ref="form" :model="model" :rules="rules")
      el-form-item(v-if="!logined" prop="phoneNumber")
        el-input(v-model="model.phoneNumber" placeholder="手机号码")

      el-form-item(v-if="!logined" prop="smsCode")
        el-input(v-model="model.smsCode" placeholder="验证码")
          el-button.btn-code(slot="append" size="small" @click="getSmsCode()" :disabled="countdown > 0")
            span(v-if="countdown === 0") 获取
            span(v-else) {{countdown}}

      el-form-item(v-if="logined" prop="oldPass")
        el-input(v-model="model.oldPass" type="password" placeholder="旧密码")

      el-form-item(prop="newPass")
        el-input(v-model="model.newPass" type="password" placeholder="新密码")

      el-form-item(prop="newPass2")
        el-input(v-model="model.newPass2" type="password" placeholder="确认密码" @keyup.enter.native="confirm()")

    div(slot="footer")
      el-button(@click="show = false") 取消
      el-button(type="primary" @click="confirm()" :loading="loading") 确定
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import MD5 from 'md5.js';
import api from '@/api';

@Component({})
export default class PasswordDialog extends Vue {
  private show: boolean = false;
  private loading: boolean = false;
  private countdown: number = 0;

  private model = {
    phoneNumber: '',
    smsCode: '',
    oldPass: '',
    newPass: '',
    newPass2: '',
  };

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
    oldPass: [
      {
        required: true,
        min: 8,
        max: 20,
        message: '密码长度应在8到20个字符',
        trigger: 'blur',
      },
    ],
    newPass: [
      {
        required: true,
        min: 8,
        max: 20,
        message: '密码长度应在8到20个字符',
        trigger: 'blur',
      },
    ],
    newPass2: [
      {
        validator: (rule: any, value: string, callback) => {
          if (value !== this.model.newPass) {
            callback(new Error('两次密码不一致'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
  };

  private get logined() {
    return this.$store.state.token !== '';
  }

  public showDialog() {
    this.show = true;
  }

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

  public async confirm() {
    (this.$refs.form as Form).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true;

        try {
          if (this.logined) {
            await api.changePassword({
              oldPass: new MD5().update(this.model.oldPass).digest('hex'),
              newPass: new MD5().update(this.model.newPass).digest('hex'),
            });

            this.$message.success('修改成功');
          } else {
            await api.resetPassword({
              phoneNumber: this.model.phoneNumber,
              smsCode: this.model.smsCode,
              newPass: new MD5().update(this.model.newPass).digest('hex'),
            });

            this.$message.success('重置成功');
          }

          this.show = false;
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.loading = false;
        }
      }
    });
  }
}
</script>

<style lang="scss">
@import '../styles';

.root-password-dialog {
  .el-dialog__body {
    padding-bottom: 0;

    .btn-code {
      width: 80px;
      height: 100%;
      font-size: 16px;
    }
  }
}
</style>
