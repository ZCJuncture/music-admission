<template lang="pug">
  .root-fill-out
    el-steps(:space="200" :active="step" process-status="finish" finish-status="success")
      el-step(title="填写个人信息")
      el-step(title="填写证件信息")
      el-step(title="填写报考信息")

    fill-out-person(v-show="step === 0" :editable="editable" :model="model")
    fill-out-credential(v-if="maxStep >= 1" v-show="step === 1" :editable="editable" :model="model")
    fill-out-exam(v-if="maxStep >= 2" v-show="step === 2" :editable="editable" :model="model")

    .wp-buttons
      el-button(v-if="step > 0" plain type="primary" @click="prevStep()") 上一步
      el-button(v-if="editable" type="success" @click="update()" :loading="updating") 暂存
      el-button(v-if="!editable && step === 2" type="success") 保存并提交
      el-button(v-if="!editable" type="primary" @click="edit()") 编辑
      el-button(v-if="editable" type="danger" @click="cancel()") 取消
      el-button(v-if="step < 2" plain type="primary" @click="nextStep()") 下一步
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
  private editable: boolean = true;
  private updating: boolean = false;

  private model = JSON.parse(JSON.stringify(this.$store.state.user));

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
      this.$message.error('暂存失败');
    } finally {
      this.updating = false;
    }
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-fill-out {
  .el-steps {
    margin-bottom: 20px;
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
}
</style>
