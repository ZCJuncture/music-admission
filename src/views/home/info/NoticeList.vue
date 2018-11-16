<template lang="pug">
  .root-notice-list
    .wp-option
      el-input(v-model="keyword" @keyup.enter.native="getList()")
        el-button(slot="append" icon="el-icon-search" @click="getList()")

    .wp-list(v-loading="loading")
      info-item(v-for="item in list" :key="item._id" :item="item" @click.native="showNews(item)")
        i.el-icon-bell(slot="icon")

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
export default class NoticeList extends BaseList {
  private keyword: string | null = null;

  public created() {
    this.getList();
  }

  public getListImpl() {
    return api.getNoticeList(this.keyword, this.pageNo, this.pageSize);
  }

  public showNews(item: any) {
    (this.$refs.dialog as NewsDialog).showNews(item);
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-notice-list {
  .wp-option {
    @include center-v;
    height: 60px;

    .el-input {
      width: 400px;
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
