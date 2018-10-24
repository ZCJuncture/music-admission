<template lang="pug">
  el-dialog.root-news-dialog(width="70%" :title="obj.title" :visible.sync="show")
    span.text-publisher 发布者：{{obj.publisher}}
    span.text-date {{obj.createDate | datetime}}
    .wp-content {{obj.content}}

    div(slot="footer")
      el-button(type="primary" @click="show = false") 关闭
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class NewsDialog extends Vue {
  private show: boolean = false;
  private obj: any = {};

  public showNews(obj: any) {
    this.show = true;
    this.obj = obj;
  }
}
</script>

<style lang="scss">
@import '../styles';

.root-news-dialog {
  .el-dialog__body {
    padding-top: 0;

    .text-publisher {
      color: #b9b9b9;
    }

    .text-date {
      color: #b9b9b9;
      margin-left: 10px;
    }

    .wp-content {
      font-size: 18px;
      margin-top: 20px;
    }
  }
}
</style>
