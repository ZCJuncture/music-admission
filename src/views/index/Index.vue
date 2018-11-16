<template lang="pug">
  el-container.root-index(:style="{ backgroundImage: background }")
    el-header(height="80px")
      img(src="@/assets/logo-header.png")
      h1 中央音乐学院招生系统

    el-main
      router-view

    el-footer(height="auto")
     p 中央音乐学院招生办 版权所有
     p 电话：010-66425504 传真：010-66410968
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Index extends Vue {
  private background: string = 'url(' + require('@/assets/bg-index.jpg') + ')';
}
</script>

<style lang="scss">
@import '../../styles';

.root-index {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;

  .el-header {
    @include center-v;
    background-color: rgba(255, 255, 255, 0.7);

    img {
      width: 60px;
      height: 60px;
      margin-left: 100px;
    }

    h1 {
      margin-left: 20px;
      font-size: 26px;
    }
  }

  .el-main {
    height: 100%;
  }

  .el-footer {
    color: white;
    text-align: center;
  }
}
</style>
