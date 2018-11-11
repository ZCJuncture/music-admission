<template lang="pug">
  .root-online-pay
    el-button(@click="test") test
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class OnlinePay extends Vue {
  public async test() {
    const newWindow = window.open();
    const url = await api.getAlipayUrl();
    (newWindow as any).location = url;
  }
}
</script>

<style lang="scss">
@import '../../../styles';

.root-online-pay {
  height: 100%;
}
</style>
