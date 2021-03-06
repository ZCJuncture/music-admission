<template lang="pug">
  .root-fill-out-credential
    .wp-card
      el-card.card-credential
        span(slot="header") 证件信息

        el-form(ref="credentialForm" :model="model" label-suffix=":" size="small" :show-message="false" hide-required-asterisk)
          el-form-item(required prop="credentialType" label="证件类型" label-width="75px" style="width: 35%")
            el-select(v-if="editable" v-model="model.credentialType")
              el-option(value="身份证")
              el-option(value="军人证")
              el-option(value="签证")
              el-option(value="护照")
            span(v-else) {{model.credentialType}}

          el-form-item(required prop="credentialNumber" label="证件号" label-width="75px" style="width: 65%")
            el-input(v-if="editable" v-model="model.credentialNumber")
            span(v-else) {{model.credentialNumber}}

          el-form-item(required prop="credentialFile" label="证件照" label-width="75px")
            el-upload(v-if="editable && credentialUrl === ''" drag accept="image/*" :action="uploadCredentialUrl" :headers="{token}" :on-success="onCredentialSuccess")
              i.el-icon-upload
              div 将文件拖到此处，或点击上传
            .wp-uploaded(v-else)
              img(:src="credentialUrl")
              el-button(v-if="editable" @click="removeCredential()") 删除

      el-card.card-photo
        span(slot="header") 免冠照片

        el-form(ref="photoForm" :model="model" label-suffix=":" size="small" :show-message="false" hide-required-asterisk)
          el-form-item(required prop="photoFile" label="免冠照片" label-width="75px")
            el-upload(v-if="editable && photoUrl === ''" drag accept="image/*" :action="uploadPhotoUrl" :headers="{token}" :on-success="onPhotoSuccess")
              i.el-icon-upload
              div 将文件拖到此处，或点击上传
            .wp-uploaded(v-else)
              img(:src="photoUrl")
              el-button(v-if="editable" @click="removePhoto()") 删除
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import api from '@/api';

@Component({})
export default class FillOutCredential extends Vue {
  @Prop()
  private editable;
  @Prop()
  private model;

  private uploadCredentialUrl: string = api.uploadImageUrl('credential');
  private uploadPhotoUrl: string = api.uploadImageUrl('photo');
  private token: string = this.$store.state.token;

  private get credentialUrl() {
    const fileName = this.model.credentialFile;
    if (!fileName || fileName === '') {
      return '';
    } else {
      return api.downloadImageUrl(this.model.credentialFile);
    }
  }

  private get photoUrl() {
    const fileName = this.model.photoFile;
    if (!fileName || fileName === '') {
      return '';
    } else {
      return api.downloadImageUrl(this.model.photoFile);
    }
  }

  public onCredentialSuccess(fileName: string) {
    this.model.credentialFile = fileName;
    this.$message.success('证件照已保存');
  }

  public async removeCredential() {
    await this.$confirm('确定要删除证件照吗？', {
      title: '提示',
      type: 'warning',
    });

    try {
      await api.deleteImage('credential', this.model.credentialFile);
      this.model.credentialFile = '';
    } catch (e) {
      this.$message.error(e.data);
    }
  }

  public onPhotoSuccess(fileName: string) {
    this.model.photoFile = fileName;
    this.$message.success('照片已保存');
  }

  public async removePhoto() {
    await this.$confirm('确定要删除照片吗？', {
      title: '提示',
      type: 'warning',
    });

    try {
      await api.deleteImage('photo', this.model.photoFile);
      this.model.photoFile = '';
    } catch (e) {
      this.$message.error(e.data);
    }
  }

  public async validate() {
    const credentialValid = await new Promise((resolve, reject) => {
      (this.$refs.credentialForm as Form).validate((valid: boolean) => {
        resolve(valid);
      });
    });

    const photoValid = await new Promise((resolve, reject) => {
      (this.$refs.photoForm as Form).validate((valid: boolean) => {
        resolve(valid);
      });
    });

    return (credentialValid && photoValid) as boolean;
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-fill-out-credential {
  .wp-card {
    display: flex;

    .card-credential {
      width: 50%;
      margin-right: 15px;

      .el-card__header {
        background-color: #9d4a9c;
      }
    }

    .card-photo {
      width: 50%;
      margin-left: 15px;

      .el-card__header {
        background-color: $color-primary;
      }
    }

    .wp-uploaded {
      @include center-v;

      img {
        height: 180px;
        border-radius: 5px;
      }

      .el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
