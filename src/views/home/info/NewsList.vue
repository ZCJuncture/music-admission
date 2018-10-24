<template lang="pug">
  .root-news-list
    .wp-option
      el-tabs(type="card")
        el-tab-pane(label="全部")
        el-tab-pane(label="招生公告")

      el-input(v-model="keyword" @keyup.enter.native="getList()")
        el-button(slot="append" icon="el-icon-search" @click="getList()")

    .wp-list(v-loading="loading")
      info-item(v-for="item in list" :key="item._id" :item="item" @click.native="showNews(item)")
        i.el-icon-document(slot="icon")

    include ../../../common/pagination.pug

    news-dialog(ref="dialog")
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import InfoItem from '@/components/InfoItem.vue';
import NewsDialog from '@/components/NewsDialog.vue';
import BaseList from '@/common/BaseList';
import api from '@/api';

@Component({
  components: { InfoItem, NewsDialog },
})
export default class NewsList extends BaseList {
  private keyword: string = '';

  public created() {
    this.getList();
  }

  public getListImpl() {
    return api.getNewsList(this.keyword, this.pageNo, this.pageSize);
  }

  public showNews(item: any) {
    (this.$refs.dialog as NewsDialog).showNews(item);
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-news-list {
  .wp-option {
    @include center-v;

    .el-tabs {
      flex-grow: 1;
    }

    .el-input {
      width: 400px;
      margin-left: 50px;
    }
  }

  .wp-list {
    margin-top: 10px;
  }

  .el-pagination {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
