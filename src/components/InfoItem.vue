<template lang="pug">
  li.root-info-item
    .wp-icon
      slot(name="icon")

    .wp-text
      .text-title {{item.title || item.content}}
      .text-date {{item.createDate | datetime}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class InfoItem extends Vue {
  @Prop()
  private item: any;
}
</script>

<style lang="scss">
@import '../styles';

.root-info-item {
  @include center-v;
  height: 50px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: rgb(245, 245, 245);
  cursor: pointer;

  &:hover {
    background-color: rgb(230, 230, 230);
  }

  .wp-icon {
    @include center-hv;
    flex-shrink: 0;
    width: 50px;
    height: 100%;
    border-radius: 5px 0 0 5px;
    background-color: rgb(230, 230, 230);
    color: $color-primary;
    font-size: 30px;
  }

  .wp-text {
    width: calc(100% - 60px);
    margin-left: 10px;

    .text-title {
      @include one-line;
      color: $color-primary;
    }

    .text-date {
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>
