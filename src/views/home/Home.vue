<template lang="pug">
  el-container.root-home
    el-header
      el-button.btn-menu(type="primary" icon="el-icon-more" @click="isCollapse = !isCollapse")
      img(src="@/assets/logo-header.png")
      h1 中央音乐学院招生系统

      .wp-dropdown
        el-dropdown(@command="handleCommand($event)")
          el-button.btn-dropdown(type="text") 下拉菜单
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="logout") 退出登录

    el-container
      el-aside(width="auto")
        el-menu(background-color="#545c64" text-color="white" :collapse="isCollapse")
          el-submenu(index="1")
            template(slot="title")
              i.el-icon-location
              span(slot="title") 导航一
            el-menu-item(index="1-1") 选项1
            el-menu-item(index="1-2") 选项2

      el-main
        router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class Home extends Vue {
  private isCollapse: boolean = false;

  private async handleCommand(command: string) {
    switch (command) {
      case 'logout':
        try {
          await api.logout();
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.$cookies.remove('token');
          this.$router.replace('/index/login');
        }
        break;
    }
  }
}
</script>

<style lang="scss">
@import '../../styles';

.root-home {
  height: 100%;

  .el-header {
    @extend .center-v;
    padding: 0;
    background-color: $color-primary;

    .btn-menu {
      width: 65px;
      height: 100%;
      background-color: darken($color-primary, 5%);
      border-color: darken($color-primary, 5%);
    }

    img {
      width: 45px;
      height: 45px;
      margin-left: 20px;
    }

    h1 {
      margin-left: 10px;
      font-size: 20px;
      color: white;
    }

    .wp-dropdown {
      flex-grow: 1;
      text-align: right;

      .el-dropdown {
        margin-right: 50px;

        .btn-dropdown {
          color: white;
        }
      }
    }
  }

  .el-aside {
    background-color: #545c64;

    .el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
  }
}
</style>
