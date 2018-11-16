<template lang="pug">
  .root-fill-out
    .info-title
      el-steps(:space="200" :active="step" process-status="finish" finish-status="success")
        el-step(title="填写个人信息")
        el-step(title="填写证件信息")
        el-step(title="填写报考信息")

      el-alert(show-icon type="warning" :closable="false" title="")
        div 请填报信息后前往缴费，缴费完成后才视为报名成功
        span 若尚未得知高考考号，请务必后续补填
        el-button(type="text" @click="openDialog()") 点击填报

    fill-out-person(ref="person" v-show="step === 0" :editable="editable" :model="model")
    fill-out-credential(ref="credential" v-if="maxStep >= 1" v-show="step === 1" :editable="editable" :model="model")
    fill-out-exam(ref="exam" v-if="maxStep >= 2" v-show="step === 2" :editable="editable" :model="model")

    .wp-buttons
      el-button(v-if="step > 0" plain type="primary" @click="prevStep()") 上一步
      template(v-if="!model.submitted")
        el-button(v-if="step === 2" type="success" @click="submit()" :loading="submitting") 保存并提交
        el-button(v-if="editable" type="success" @click="update()" :loading="updating") 暂存
        el-button(v-if="!editable" type="primary" @click="edit()") 编辑
        el-button(v-if="editable" type="danger" @click="cancel()") 取消
      el-button(v-if="step < 2" plain type="primary" @click="nextStep()") 下一步

    el-dialog(title="信息补填" width="400px" :visible.sync="showDialog")
      el-form(ref="dialogForm" :model="dialogModel" label-suffix=":" size="small" :show-message="false" hide-required-asterisk)
        el-form-item(required prop="collegeExamNo" label="高考考号" label-width="75px")
          el-input(v-model="dialogModel.collegeExamNo")
        el-form-item(required prop="provinceExamNo" label="省联考号" label-width="75px")
          el-input(v-model="dialogModel.provinceExamNo")

      div(slot="footer")
        el-button(size="small" @click="showDialog = false") 取消
        el-button(type="primary" size="small" @click="modify()" :loading="modifying") 确定
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import FillOutPerson from './FillOutPerson.vue';
import FillOutCredential from './FillOutCredential.vue';
import FillOutExam from './FillOutExam.vue';
import api from '@/api';

@Component({
  components: { FillOutPerson, FillOutCredential, FillOutExam },
})
export default class FillOut extends Vue {
  private step: number = 0;
  private maxStep: number = 0;
  private showDialog: boolean = false;
  private updating: boolean = false;
  private submitting: boolean = false;
  private modifying: boolean = false;

  private model: any = JSON.parse(JSON.stringify(this.$store.state.user));
  private dialogModel = { collegeExamNo: '', provinceExamNo: '' };
  private editable: boolean = !this.model.submitted;

  public prevStep() {
    this.step--;
  }

  public nextStep() {
    this.step++;
    this.maxStep = Math.max(this.step, this.maxStep);
  }

  public edit() {
    this.editable = true;
  }

  public cancel() {
    this.editable = false;
    this.model = JSON.parse(JSON.stringify(this.$store.state.user));
  }

  public async update() {
    this.updating = true;

    try {
      await api.updateInfo(this.model);
      this.$store.commit('setUser', this.model);
      this.$message.success('暂存成功');
      this.editable = false;
    } catch (e) {
      this.$message.error(e.data);
    } finally {
      this.updating = false;
    }
  }

  public async submit() {
    let valid: boolean = false;

    valid = await (this.$refs.person as FillOutPerson).validate();
    if (!valid) {
      this.step = 0;
      this.editable = true;
      this.$message.error('个人信息不完整');
      return;
    }

    valid = await (this.$refs.credential as FillOutCredential).validate();
    if (!valid) {
      this.step = 1;
      this.editable = true;
      this.$message.error('证件信息不完整');
      return;
    }

    valid = await (this.$refs.exam as FillOutExam).validate();
    if (!valid) {
      this.step = 2;
      this.editable = true;
      this.$message.error('报考信息不完整');
      return;
    }

    await this.$confirm('保存后将不可更改，确定要提交吗？', {
      title: '提示',
      type: 'warning',
    });

    this.submitting = true;
    this.model.submitted = true;

    try {
      const message = await api.updateInfo(this.model);
      this.$store.commit('setUser', this.model);
      this.$notify.info({ title: '通知', message });
      this.$router.replace('onlinePay');
      this.editable = false;
    } catch (e) {
      this.$message.error(e.data);
      this.model.submitted = false;
    } finally {
      this.submitting = false;
    }
  }

  public openDialog() {
    if (!this.model.submitted) {
      this.$message.warning('报名信息提交后才可补填');
      return;
    }

    this.dialogModel.collegeExamNo = this.model.collegeExamNo;
    this.dialogModel.provinceExamNo = this.model.provinceExamNo;
    this.showDialog = true;
  }

  public modify() {
    (this.$refs.dialogForm as Form).validate(async (valid: boolean) => {
      if (valid) {
        this.modifying = true;

        try {
          await api.modifyInfo(this.dialogModel);
          this.$store.commit(
            'setUser',
            Object.assign(this.model, this.dialogModel),
          );
          this.$message.success('填报成功');
          this.showDialog = false;
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.modifying = false;
        }
      }
    });
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-fill-out {
  .info-title {
    @include center-v;
    height: 70px;
    margin-bottom: 20px;

    .el-steps {
      width: 100%;
    }

    .el-alert {
      .el-button {
        padding: 0;
        margin-left: 5px;
        font-size: 15px;
      }
    }
  }

  .el-card__header {
    padding: 12px 16px;
    color: white;
  }

  .el-form {
    display: flex;
    flex-wrap: wrap;
  }

  .wp-buttons {
    margin-top: 20px;
    text-align: right;

    .el-button {
      margin-left: 20px;
    }
  }

  .el-dialog {
    .el-dialog__body {
      padding: 10px 20px 0 20px;

      .el-form-item__content {
        width: calc(100% + 20px);
      }
    }

    .el-dialog__footer {
      padding-top: 0;
    }
  }
}
</style>
