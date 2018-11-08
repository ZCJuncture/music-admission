<template lang="pug">
  .root-fill-out-exam
    .major-select
      span.title-label 报考专业：
      el-cascader(v-if="editable" v-model="model.major" :options="majorList" :props="{value: 'label'}" @change="changeMajor($event)")
      b(v-else) {{model.major[0] + ' / ' + model.major[1]}}

    .wp-card(v-if="model.examInfo")
      el-card.card-first1
        span(slot="header") 初试一轮
        exam-block(:editable="editable" :data="model.examInfo.first1")

      el-card.card-first2
        span(slot="header") 初试二轮
        exam-block(:editable="editable" :data="model.examInfo.first2")

    .wp-card(v-if="model.examInfo")
      el-card.card-second
        span(slot="header") 复试
        exam-block(:editable="editable" :data="model.examInfo.second")

      el-card.card-third
        span(slot="header") 三试
        exam-block(:editable="editable" :data="model.examInfo.third")
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
