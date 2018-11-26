<template lang="pug">
  el-container.root-print-ticket
    .wp-grid
      el-row.title-header 中央音乐学院本科招生2020年专业考试报名信息

      el-row
        el-col(:span="20")
          el-row.title-big 个人信息
          el-row
            el-col.title-small(:span="5") 姓名
            el-col.content(:span="7") {{model.name}}
            el-col.title-small(:span="5") 证件号码
            el-col.content(:span="7") {{model.credentialNumber}}
          el-row
            el-col.title-small(:span="5") 性别
            el-col.content(:span="7") {{model.sex}}
            el-col.title-small(:span="5") 出生日期
            el-col.content(:span="7") {{model.birthday | date}}
          el-row
            el-col.title-small(:span="5") 民族
            el-col.content(:span="7") {{model.nation}}
            el-col.title-small(:span="5") 生源地
            el-col.content(:span="7") {{model.hometown[0] + ' ' + model.hometown[1]}}
          el-row
            el-col.title-small(:span="5") 政治面貌
            el-col.content(:span="7") {{model.politics}}
            el-col.title-small(:span="5") 毕业院校
            el-col.content(:span="7") {{model.school}}
        el-col.wp-photo(:span="4")
          img(:src="photoUrl")

      el-row
        el-col.title-big(:span="12") 报考专业信息
        el-col.title-big(:span="12") 高考考生信息
      el-row
        el-col.title-small(:span="5") 报考专业
        el-col.content(:span="7") {{model.major[0] + ' ' + model.major[1]}}
        el-col.title-small(:span="5") 高考考号
        el-col.content(:span="7") {{model.collegeExamNo}}

      el-row.title-big 考试科目及曲目
      el-table(:data="exam")
        el-table-column(label="考试科目" prop="title" align="center" width="250px")
        el-table-column(label="考试形式" align="center" width="100px")
          template(slot-scope="scope")
            span(v-if="scope.row.interview === true") 面试
            span(v-if="scope.row.interview === false") 笔试
        el-table-column(label="考试内容" align="center")
          template(v-if="scope.row.label" slot-scope="scope")
            span {{scope.row.label + '：' + scope.row.value}}

      el-row.title-big 联系方式
      el-row
        el-col.title-small(:span="4") 手机号
        el-col.content(:span="5") {{model.phoneNumber2}}
        el-col.title-small(:span="4") 邮寄地址
        el-col.content(:span="11") {{model.address}}
      el-row
        el-col.title-small(:span="3") 邮政编码
        el-col.content(:span="5") {{model.postcode}}
        el-col.title-small(:span="3") 收件人
        el-col.content(:span="5") {{model.receiver}}
        el-col.title-small(:span="3") 联系电话
        el-col.content(:span="5") {{model.receiverContact}}

      el-row.wp-footer
        el-col(:span="5") {{model.hometown[0]}}
        el-col(:span="5") {{model.name}}
        el-col(:span="7")
          img#barcode
        el-col(:span="7")
          span 准考证号
          span(style="margin-top: 10px") {{model.examNo}}

    .wp-print
      el-button.noprint(icon="el-icon-printer" @click="print()" :disabled="status < 20") 打印
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import JsBarcode from 'jsbarcode';
import api from '@/api';

@Component({})
export default class PrintTicket extends Vue {
  private model: any = this.$store.state.user;
  private exam: any[] = [];

  private get status() {
    return this.$store.state.status;
  }

  private get photoUrl() {
    const fileName = this.model.photoFile;
    if (!fileName || fileName === '') {
      return '';
    } else {
      return api.downloadImageUrl(this.model.photoFile);
    }
  }

  private created() {
    this.exam = this.exam
      .concat(
        this.model.examInfo.first1,
        this.model.examInfo.first2,
        this.model.examInfo.second,
        this.model.examInfo.third,
      )
      .filter((item) => {
        return !item.hide && item.type !== 'text';
      });
  }

  private mounted() {
    JsBarcode('#barcode', this.model.examNo);
  }

  private async print() {
    window.print();
    if (this.status === 20) {
      await api.printTicket();
    }
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-print-ticket {
  @include center-hv;

  .wp-grid {
    width: 700px;
    padding: 10px;
    border: 1px solid lightgrey;

    .el-row {
      width: 100%;
      margin-top: 5px;
    }

    .content {
      padding: 3px;
      text-align: center;
    }

    .title-header {
      @extend .content;
      font-size: 26px;
    }

    .title-base {
      @extend .content;
      background-color: #eee;
    }

    .title-big {
      @extend .title-base;
      font-size: 18px;
    }

    .title-small {
      @extend .title-base;
      font-size: 16px;
    }

    .wp-photo {
      @include center-hv;
      height: 160px;

      img {
        width: 80%;
      }
    }

    th {
      padding: 5px;
    }

    td {
      padding: 3px;
      border: 0;
    }

    .wp-footer {
      height: 100px;
      margin-top: 10px;

      .el-col {
        @include center-hv;
        flex-direction: column;
        height: 100%;
        font-size: 26px;

        #barcode {
          height: 100px;
        }

        span {
          font-size: 22px;
        }
      }
    }
  }

  .wp-print {
    position: fixed;
    top: 150px;
    right: 50px;

    .el-button {
      font-size: 18px;
    }
  }

  @media print {
    .wp-grid {
      padding: 0;
      border: 0;
    }

    .wp-print {
      display: none;
    }
  }
}
</style>
