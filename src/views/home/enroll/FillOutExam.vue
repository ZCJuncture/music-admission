<template lang="pug">
  .root-fill-out-exam
    .major-select
      span.title-label 报考专业：
      el-cascader(v-if="editable" v-model="model.major" :options="majorList" :props="{value: 'label'}" @change="changeMajor($event)")
      b(v-else-if="model.major[0]") {{model.major[0] + ' / ' + model.major[1]}}
      b(v-else) 未选择

    .wp-card(v-if="model.examInfo")
      el-card.card-first1
        span(slot="header") 初试一轮
        exam-block(ref="first1Exam" :editable="editable" :data="model.examInfo.first1")

      el-card.card-first2
        span(slot="header") 初试二轮
        exam-block(ref="first2Exam" :editable="editable" :data="model.examInfo.first2")

    .wp-card(v-if="model.examInfo")
      el-card.card-second
        span(slot="header") 复试
        exam-block(ref="secondExam" :editable="editable" :data="model.examInfo.second")

      el-card.card-third
        span(slot="header") 三试
        exam-block(ref="thirdExam" :editable="editable" :data="model.examInfo.third")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ExamBlock from '@/components/ExamBlock.vue';
import api from '@/api';

@Component({
  components: { ExamBlock },
})
export default class FillOutExam extends Vue {
  @Prop()
  private editable;
  @Prop()
  private model;

  private majorList: any[] = require('@/assets/major.json');

  public changeMajor(major: string[]) {
    this.model.examInfo = require(`@/assets/examInfo/${major[1]}.json`);
  }

  public validate() {
    if (this.model.major.length === 0) { return false; }

    const first1Valid = (this.$refs.first1Exam as ExamBlock).validate();
    const first2Valid = (this.$refs.first2Exam as ExamBlock).validate();
    const secondValid = (this.$refs.secondExam as ExamBlock).validate();
    const thirdValid = (this.$refs.thirdExam as ExamBlock).validate();

    return first1Valid && first2Valid && secondValid && thirdValid;
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-fill-out-exam {
  .major-select {
    @include center-v;
    height: 50px;
    font-size: 20px;

    .title-label {
      margin-right: 10px;
    }

    .el-cascader__label {
      font-size: 16px;
    }
  }

  .wp-card {
    display: flex;
    margin-top: 20px;

    .card-first1 {
      width: 50%;
      margin-right: 15px;

      .el-card__header {
        background-color: #9d4a9c;
      }
    }

    .card-first2 {
      width: 50%;
      margin-left: 15px;

      .el-card__header {
        background-color: #9d4a9c;
      }
    }

    .card-second {
      width: 50%;
      margin-right: 15px;

      .el-card__header {
        background-color: $color-primary;
      }
    }

    .card-third {
      width: 50%;
      margin-left: 15px;

      .el-card__header {
        background-color: $color-secondary;
      }
    }
  }
}
</style>
