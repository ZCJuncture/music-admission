<template lang="pug">
  .root-brief
    .wp-shortcut
      el-button.btn-enroll(icon="el-icon-edit" @click="routeTo('fillOut')") 考生报名
      el-button.btn-result(icon="el-icon-search" @click="mock()") 查询成绩

      el-steps(align-center :active="step" process-status="finish" finish-status="success")
        el-step(title="信息填报")
        el-step(title="初试缴费")
        el-step(title="打印准考证")
        el-step(title="初试中")
        el-step(title="复试缴费")
        el-step(title="复试中")
        el-step(title="三试中")
        el-step(title="录取通过")

    .wp-card
      el-card.card-news(v-loading="loadingNews")
        .card-header(slot="header")
          i.el-icon-document
          span 资讯
          .wp-button
            el-button(type="text" @click="routeTo('newsList')") 更多

        info-item(v-for="item in newsList" :key="item._id" :item="item" @click.native="showNews(item)")
          i.el-icon-document(slot="icon")

      el-card.card-notice
        .card-header(slot="header")
          i.el-icon-bell
          span 通知
          .wp-button
            el-button(type="text" @click="routeTo('noticeList')") 更多

        info-item(v-for="item in noticeList" :key="item._id" :item="item" @click.native="showNews(item)")
          i.el-icon-bell(slot="icon")

    news-dialog(ref="dialog")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoItem from '@/components/InfoItem.vue';
import NewsDialog from '@/components/NewsDialog.vue';
import api from '@/api';

@Component({
  components: { InfoItem, NewsDialog },
})
export default class Brief extends Vue {
  private loadingNews: boolean = false;
  private loadingNotice: boolean = false;
  private newsList: any[] = [];
  private noticeList: any[] = [];

  private get step() {
    return this.$store.state.status / 10;
  }

  public async created() {
    this.getNewsList();
    this.getNoticeList();
  }

  public async getNewsList() {
    try {
      this.loadingNews = true;
      const { list } = await api.getNewsList();
      this.newsList = list;
    } catch (e) {
      this.$message.error(e.data);
    } finally {
      this.loadingNews = false;
    }
  }

  public async getNoticeList() {
    try {
      this.loadingNotice = true;
      const { list } = await api.getNoticeList();
      this.noticeList = list;
    } catch (e) {
      this.$message.error(e.data);
    } finally {
      this.loadingNotice = false;
    }
  }

  public showNews(item: any) {
    (this.$refs.dialog as NewsDialog).showNews(item);
  }

  public routeTo(path: string) {
    this.$router.push(path);
  }

  public mock() {
    this.$message.warning('您还未进入该流程');
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-brief {
  height: 100%;

  .wp-shortcut {
    @include center-v;
    height: 100px;

    .el-button {
      @include center-hv;
      flex-shrink: 0;
      width: 200px;
      height: 100%;
      font-size: 20px;

      i {
        font-size: 40px;
        margin-right: 10px;
      }
    }

    .btn-enroll {
      @include button-color(rgb(171, 132, 101));
    }

    .btn-result {
      @include button-color(rgb(132, 124, 197));
      margin-left: 20px;
    }

    .el-steps {
      width: 100%;
      margin-left: 20px;
    }
  }

  .wp-card {
    display: flex;
    height: calc(100% - 120px);
    margin-top: 20px;

    .el-card {
      width: 50%;
      height: 100%;

      .el-card__header {
        padding: 12px 16px;
        color: white;

        .card-header {
          @include center-v;

          span {
            margin-left: 5px;
          }

          .wp-button {
            flex-grow: 1;
            text-align: right;

            .el-button {
              padding: 0;
              color: white;

              &:hover {
                opacity: 0.8;
              }
            }
          }
        }
      }

      .el-card__body {
        padding: 15px;
        overflow: hidden;
      }
    }

    .card-news {
      margin-right: 15px;

      .el-card__header {
        background-color: $color-primary;
      }
    }

    .card-notice {
      margin-left: 15px;

      .el-card__header {
        background-color: $color-secondary;
      }
    }
  }
}
</style>
