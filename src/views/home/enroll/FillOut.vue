<template lang="pug">
  .root-fill-out
    el-steps(:space="200" :active="step" process-status="finish" finish-status="success")
      el-step(title="填写个人信息")
      el-step(title="填写证件信息")
      el-step(title="完善考试内容")

    fill-out-person(v-if="step === 0" :editable="editable" :model="model")
    fill-out-credential(v-if="step === 1" :editable="editable" :model="model")
    fill-out-exam(v-if="step === 2" :editable="editable" :model="model")

    .wp-buttons
      el-button(v-if="step > 0" plain type="primary" :disabled="editable" @click="prevStep()") 上一步
      el-button(v-if="editable" type="success" @click="update()" :loading="updating") 保存
      el-button(v-else type="primary" @click="edit()") 编辑
      el-button(v-if="editable && step !== 1" type="danger" @click="cancel()") 取消
      el-button(v-if="step < 2" plain type="primary" :disabled="editable" @click="nextStep()") 下一步
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
  private editable: boolean = true;
  private updating: boolean = false;

  private model = JSON.parse(JSON.stringify(this.$store.state.user));

  public prevStep() {
    this.step--;
  }

  public nextStep() {
    this.step++;
    this.editable = true;
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
      this.$message.success('保存成功');
      this.editable = false;
    } catch (e) {
      this.$message.error('保存失败');
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
