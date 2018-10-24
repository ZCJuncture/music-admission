<template lang="pug">
  .root-notice-list
    h1 NoticeList
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class NoticeList extends Vue {}
</script>

<style lang="scss">
@import '../../../styles';
</style>
