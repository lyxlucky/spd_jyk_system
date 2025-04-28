<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { updateDocumentTitle } from '@/utils/document-title-util';

  export default {
    name: 'App',
    created() {
      // 恢复主题
      this.$store.dispatch('theme/recoverTheme');
    },
    // provide() {
    //   return {
    //     reloadAll: this.reloadAll
    //   };
    // },
    methods: {
      /* 路由切换更新浏览器标题 */
      setDocumentTitle() {
        updateDocumentTitle(
          this.$route,
          (key) => this.$t(key),
          this.$store.state.theme.tabs
        );
      }
      // reloadAll() {
      //   this.isRouterAlive = false;
      //   this.$nextTick(() => {
      //     this.isRouterAlive = true;
      //   });
      // }
    },
    watch: {
      '$i18n.locale'() {
        this.setDocumentTitle();
      },
      $route() {
        this.setDocumentTitle();
      }
    }
  };
</script>

<style lang="scss">
  // ::v-deep .ele-table-tool-default {
  //   padding: 0;
  // }
  .ele-box {
    background-color: white;
    height: 100%;
    box-sizing: border-box;
  }
  .ele-box .ele-box {
    padding: 10px;
  }

  .ele-box,
  .ele-box .ele-pro-table {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ele-box .el-table {
    flex: 1; // 移除 flex-basis: 0
    display: flex;
    flex-direction: column;
  }
  .ele-box .el-table .el-table__body-wrapper {
    flex: 1;
    overflow: auto;
    flex-basis: 0;
    max-height: calc(100vh - 200px); // 添加最大高度限制
  }
  .ele-box .ele-pro-table .el-pagination {
    margin-top: 7px !important;
    padding: 0px 0; // 使用padding替代flex-basis
    box-sizing: border-box;
  }
</style>
