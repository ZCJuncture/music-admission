<template lang="pug">
  .root-fill-out-exam
    h1 exam
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class FillOutExam extends Vue {
  @Prop()
  private editable;
  @Prop()
  private model;
}
</script>

<style lang="scss">
@import '../../../styles';

.root-fill-out-exam {
  height: 100%;
}
</style>
