<template lang="pug">
  el-form.root-exam-block(label-suffix=":" size="small")
    template(v-for="item in data")
      .exam-title(v-if="item.type === 'title'")
        el-tag(v-if="item.interview") 面试
        el-tag(v-else type="warning") 笔试
        b {{item.title + '：'}}
        span 具体考试内容及要求详见招生简章

      .exam-text(v-if="item.type === 'text' && !item.hide") {{item.text}}

      el-form-item(v-if="item.type === 'cascader'" label="主试乐器" label-width="75px" style="width: 100%")
        el-cascader(v-if="editable" v-model="item.value" :options="instrumentList" :props="{value: 'label'}" @change="changeInstrument(item)")
        span(v-else) {{item.value[1]}}

      el-form-item(v-if="item.type === 'select' && !item.hide" :label="item.label" :label-width="item.labelWidth" style="width: 100%")
        el-select(v-if="editable" v-model="item.value" @change="changeSelection(item)")
          el-option(v-for="option in item.options" :value="option.value")
        span(v-else) {{item.value}}

      template(v-if="item.type === 'input' && !item.hide")
        el-form-item(:label="item.label" :label-width="item.labelWidth" style="width: 60%")
          el-input(v-if="editable" v-model="item.value")
          span(v-else) {{item.value}}

        el-form-item(label="作者" label-width="60px" style="width: 40%")
          el-input(v-if="editable" v-model="item.author")
          span(v-else) {{item.author}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ExamBlock extends Vue {
  private static instrumentList = require('@/assets/major.json').slice(4, 7);
  private instrumentList: any[] = ExamBlock.instrumentList;

  @Prop()
  private editable;
  @Prop()
  private data: any;

  public changeInstrument(item: any) {
    const isPiano = item.value[1] === '钢琴';
    const shouldShow = isPiano ? item.piano : item.others;
    const shouldHide = isPiano
      ? item.others.filter(key => item.piano.indexOf(key) === -1)
      : item.piano.filter(key => item.others.indexOf(key) === -1);

    for (const index of shouldShow) {
      this.data[index].hide = false;
    }
    for (const index of shouldHide) {
      this.data[index].hide = true;
    }

    this.$forceUpdate();
  }

  public changeSelection(item: any) {
    for (const option of item.options) {
      if (option.value === item.value) {
        for (const index of option.show) {
          this.data[index].hide = false;
        }

        const shouldHide = item.range.filter(
          key => option.show.indexOf(key) === -1,
        );
        for (const index of shouldHide) {
          this.data[index].hide = true;
        }

        return;
      }
    }
  }

  public validate() {
    for (const item of this.data) {
      if (!item.hide) {
        continue;
      }

      switch (item.type) {
        case 'cascader':
          if (item.value.length === 0) {
            return false;
          }
          break;
        case 'select':
        case 'input':
          if (item.value === '') {
            return false;
          }
          break;
      }
    }

    return true;
  }
}
</script>

<style lang="scss">
@import '../styles';

.root-exam-block {
  .exam-title {
    margin-bottom: 15px;

    .el-tag {
      font-size: 13px;
      margin-right: 10px;
    }
  }

  .exam-text {
    font-size: 14px;
    color: #606266;
  }
}
</style>
