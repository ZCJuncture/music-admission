<template lang="pug">
  .root-fill-out-credential
    .wp-card
      el-card.card-credential
        span(slot="header") 证件信息

        el-form(label-suffix=":" size="small")
          el-form-item(label="证件类型" label-width="75px" style="width: 35%")
            el-select(v-if="editable" v-model="model.credentialType")
              el-option(value="身份证")
              el-option(value="军人证")
              el-option(value="签证")
              el-option(value="护照")
            span(v-else) {{model.credentialType}}

          el-form-item(label="证件号" label-width="75px" style="width: 65%")
            el-input(v-if="editable" v-model="model.credentialNumber")
            span(v-else) {{model.credentialNumber}}

          el-form-item(label="证件照" label-width="75px")
            el-upload(v-if="editable && credentialUrl === ''" drag accept="image/*" :action="uploadUrl" :headers="{token}" :on-success="getCredential")
              i.el-icon-upload
              div 将文件拖到此处，或点击上传
            .wp-uploaded(v-else)
              img(:src="credentialUrl")
              el-button(v-if="editable" @click="removeCredential()") 删除

      el-card.card-photo
        span(slot="header") 免冠照片

        el-form(label-suffix=":" size="small")
          el-form-item(label="近期照片" label-width="75px")
            el-upload(v-if="editable && photoUrl === ''" drag accept="image/*" :action="uploadUrl" :headers="{token}" :on-success="getPhoto")
              i.el-icon-upload
              div 将文件拖到此处，或点击上传
            .wp-uploaded(v-else)
              img(:src="photoUrl")
              el-button(v-if="editable" @click="removePhoto()") 删除
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class FillOutCredential extends Vue {
  @Prop()
  private editable;
  @Prop()
  private model;

  private uploadUrl: string = api.uploadFileUrl();
  private token: string = this.$store.state.token;

  get credentialUrl() {
    const fileName = this.model.credentialFile;
    if (!fileName && fileName === '') {
      return '';
    } else {
      return api.downloadFileUrl(this.model.credentialFile);
    }
  }

  get photoUrl() {
    const fileName = this.model.photoFile;
    if (!fileName && fileName === '') {
      return '';
    } else {
      return api.downloadFileUrl(this.model.photoFile);
    }
  }

  public getCredential(fileName: string) {
    this.model.credentialFile = fileName;
  }

  public async removeCredential() {
    try {
      const a = await this.$confirm('确定要删除证件照吗？', {
        title: '提示',
        type: 'warning',
      });

      await api.deleteFile(this.model.credentialFile);
      this.model.credentialFile = '';
    } catch (e) {
      this.$message.error(e.data);
    }
  }

  public getPhoto(fileName: string) {
    this.model.photoFile = fileName;
  }

  public async removePhoto() {
    try {
      const a = await this.$confirm('确定要删除照片吗？', {
        title: '提示',
        type: 'warning',
      });

      await api.deleteFile(this.model.photoFile);
      this.model.photoFile = '';
    } catch (e) {
      this.$message.error(e.data);
    }
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
