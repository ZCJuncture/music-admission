<template lang="pug">
  .root-online-pay
    el-table(ref="itemTable" stripe :data="list" v-loading="loadingList")
      el-table-column(type="expand")
        template(v-if="list[scope.$index].record" slot-scope="scope")
          el-table(stripe :data="list[scope.$index].record.orders")
            el-table-column(label="订单号" prop="_id" align="center")

            el-table-column(label="支付方式" align="center")
              template(slot-scope="scope2")
                span(v-if="scope2.row.payType === 'alipay'") 支付宝
                span(v-if="scope2.row.payType === 'wxpay'") 微信

            el-table-column(label="支付账号" prop="payAccount" align="center")

            el-table-column(label="支付时间" align="center")
              template(slot-scope="scope2")
                span(v-if="scope2.row.payDate") {{scope2.row.payDate | datetime}}

            el-table-column(align="center")
              template(v-if="!paid(scope.$index)" slot-scope="scope2")
                el-button(type="success" size="small" @click="continuePay(scope2.row.payType, scope.row._id, scope2.row._id)") 继续支付
                el-button(type="primary" size="small" @click="newPay(scope.row._id)") 更换方式

      el-table-column(label="序号" type="index" align="center" width="100")
      el-table-column(label="收费项" prop="name" align="center")
      el-table-column(label="收费阶段" prop="stage" align="center")

      el-table-column(label="收费金额" align="center")
        template(slot-scope="scope")
          span {{scope.row.amount | currency}}

      el-table-column(label="当前状态" align="center")
        template(slot-scope="scope")
          el-tag(v-if="paid(scope.$index)" type="success") 已支付
          el-tag(v-else type="warning") 未支付
      
      el-table-column(align="center")
        template(slot-scope="scope")
          template(v-if="!paid(scope.$index)")
            el-button(v-if="!list[scope.$index].record" type="success" size="small" @click="newPay(scope.row._id)") 支付
            el-button(v-else type="success" size="small" @click="expandTable(scope.row)") 支付
          el-button(v-else type="primary" size="small" @click="expandTable(scope.row)") 查看

    el-dialog(title="在线支付" width="500px" :visible.sync="dialog.show" :show-close="!dialog.paying" :close-on-click-modal="!dialog.paying" :close-on-press-escape="!dialog.paying")
      .wp-pay(v-if="!dialog.paying")
        span 请选择支付方式：

        .pay-type(@click="getPayInfo('alipay', dialog.itemId)")
          img(src="@/assets/icon-alipay.png")
          span 支付宝
              
        .pay-type(@click="getPayInfo('wxpay', dialog.itemId)")
          img(src="@/assets/icon-wxpay.png")
          span 微信

      .wp-paying(v-else)
        span 支付中，请在新窗口中进行操作

      div(v-if="dialog.paying" slot="footer")
        el-button(@click="resetDialog()") 取消支付
        el-button(type="primary" @click="getPayResult()" :loading="dialog.loading") 完成支付
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Table } from 'element-ui';
import api from '@/api';

@Component({})
export default class OnlinePay extends Vue {
  private loadingList: boolean = false;
  private list: any[] = [];

  private dialog = {
    show: false,
    paying: false,
    loading: false,
    payType: '',
    itemId: '',
    orderId: '',
  };

  public created() {
    this.getPayList();
  }

  public async getPayList() {
    try {
      this.loadingList = true;
      this.list = await api.getPayList();
    } finally {
      this.loadingList = false;
    }
  }

  public paid(index: number) {
    return this.list[index].record && this.list[index].record.paid;
  }

  public newPay(itemId: string) {
    this.dialog.show = true;
    this.dialog.itemId = itemId;
  }

  public continuePay(payType: string, itemId: string, orderId: string) {
    this.dialog.show = true;
    this.dialog.itemId = itemId;
    this.getPayInfo(payType, itemId, orderId);
  }

  public expandTable(item: any) {
    (this.$refs.itemTable as Table).toggleRowExpansion(item);
  }

  public async getPayInfo(payType: string, itemId: string, orderId?: string) {
    const newWindow = window.open() as Window;

    try {
      const result = await api.getPayInfo(payType, itemId, orderId);
      this.dialog.paying = true;
      this.dialog.payType = payType;
      this.dialog.orderId = result.orderId;
      newWindow.location = result.payUrl;
    } catch (e) {
      newWindow.close();
      this.$message.error(e.data);
    }
  }

  public async getPayResult() {
    this.dialog.loading = true;

    try {
      await api.getPayResult(
        this.dialog.payType,
        this.dialog.itemId,
        this.dialog.orderId,
      );

      this.getPayList();
    } finally {
      this.resetDialog();
    }
  }

  public resetDialog() {
    this.dialog.show = false;
    setTimeout(() => {
      this.dialog.paying = false;
      this.dialog.loading = false;
    }, 500);
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-online-pay {
  .el-dialog__body {
    @include center-hv;

    .wp-pay {
      @include center-hv;

      .pay-type {
        @include center-hv;
        margin-left: 30px;
        padding: 10px 20px;
        border: 1px solid lightgrey;
        border-radius: 10px;
        cursor: pointer;

        &:hover {
          background-color: #eee;
        }

        img {
          width: 30px;
          height: 30px;
        }

        span {
          margin-left: 20px;
        }
      }
    }

    .wp-paying {
      @include center-hv;

      span {
        font-size: 20px;
      }
    }
  }
}
</style>
