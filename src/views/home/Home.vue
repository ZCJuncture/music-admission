<template lang="pug">
  el-container.root-home
    el-header
      el-button.btn-menu(type="primary" icon="el-icon-more" @click="isCollapse = !isCollapse")
      img(src="@/assets/logo-header.png")
      h1 中央音乐学院招生系统

      .wp-dropdown
        el-dropdown(@command="handleCommand($event)")
          el-button.btn-dropdown(type="text") {{phoneNumber}}
            i.el-icon-arrow-down.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(command="password") 修改密码
            el-dropdown-item(command="logout") 退出登录

    el-container
      el-aside(width="auto")
        el-menu(router background-color="#545c64" text-color="white" :collapse="isCollapse" default-active="brief")
          el-submenu(index="info")
            template(slot="title")
              i.el-icon-document
              span 信息公告
            el-menu-item(index="brief") 首页
            el-menu-item(index="newsList") 资讯
            el-menu-item(index="noticeList") 通知

          el-submenu(index="enroll")
            template(slot="title")
              i.el-icon-edit
              span 报考流程
            el-menu-item(index="2-1") 信息填报
            el-menu-item(index="2-2") 在线缴费
            el-menu-item(index="2-3") 打印证件

          el-submenu(index="result")
            template(slot="title")
              i.el-icon-search
              span 查询结果
            el-menu-item(index="3-1") 复试查询
            el-menu-item(index="3-2") 快递单号

      el-main
        router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/api';

@Component({})
export default class Home extends Vue {
  private isCollapse: boolean = false;
  private phoneNumber: string = this.$store.state.user.phoneNumber;

  public created() {
    this.$bus.once('tokenExpired', () => {
      this.$message.error('登录状态过期');
      this.logout();
    });
  }

  public async handleCommand(command: string) {
    switch (command) {
      case 'logout':
        try {
          await api.logout();
        } catch (e) {
          this.$message.error(e.data);
        } finally {
          this.logout();
        }
        break;
    }
  }

  private logout() {
    this.$cookies.remove('token');
    this.$store.commit('setToken', '');
    this.$store.commit('setUser', null);
    this.$router.replace('/index/login');
  }
}
</script>

<style lang="scss">
@import '../../styles';

.root-home {
  height: 100%;

  .el-header {
    @include center-v;
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
          font-size: 16px;

          &:hover {
            opacity: 0.8;
          }
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
