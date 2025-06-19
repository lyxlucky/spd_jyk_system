<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { updateDocumentTitle } from '@/utils/document-title-util';
  import { mapGetters } from 'vuex';

  export default {
    name: 'App',
    computed: {
      ...mapGetters(['theme']),
      fontSizeClass() {
        return `font-size-${this.theme.fontSize.replace('px', '')}`;
      }
    },
    created() {
      // 恢复主题
      this.$store.dispatch('theme/recoverTheme');
      // 应用字体大小
      this.applyFontSize(this.theme.fontSize);
      // 应用表格密度
      this.applyTableDensity(this.theme.density);
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
      },
      // 应用字体大小
      applyFontSize(size) {
        console.log('Applying font size:', size);
        document.documentElement.style.fontSize = size;
        // 同时设置 body 的字体大小
        document.body.style.fontSize = size;
        // 更新表格字体大小
        this.updateTableFontSize(size);
      },
      // 更新表格字体大小
      updateTableFontSize(size) {
        const style = document.createElement('style');
        style.id = 'table-font-size-style';
        style.textContent = `
          .ele-pro-table .el-table,
          .ele-pro-table .el-table__header th,
          .ele-pro-table .el-table__body td,
          .ele-pro-table .el-pagination {
            font-size: ${size} !important;
          }
        `;
        // 移除旧的样式
        const oldStyle = document.getElementById('table-font-size-style');
        if (oldStyle) {
          oldStyle.remove();
        }
        document.head.appendChild(style);
      },
      // 应用表格密度
      applyTableDensity(density) {
        document.body.classList.remove('table-density-default', 'table-density-middle', 'table-density-compact');
        document.body.classList.add('table-density-' + density);
        // 也可为表格根节点加class，视全局样式而定
      },
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
      },
      'theme.fontSize': {
        handler(newSize) {
          console.log('Font size changed in theme:', newSize);
          this.applyFontSize(newSize);
        },
        immediate: true
      },
      'theme.density': {
        handler(newDensity) {
          this.applyTableDensity(newDensity);
        },
        immediate: true
      }
    }
  };
</script>

<style lang="scss">
  html {
    font-size: 16px;
  }
  
  body {
    font-size: 16px;
  }

  .el-table {
    font-size: 1.1rem;
  }

  /* ele-pro-table 字体大小控制 */
  .ele-pro-table {
    .el-table {
      font-size: v-bind('theme.fontSize');
    }
    .el-table__header th {
      font-size: v-bind('theme.fontSize');
    }
    .el-table__body td {
      font-size: v-bind('theme.fontSize');
    }
    .el-pagination {
      font-size: v-bind('theme.fontSize');
    }
  }

  // 表格密度样式
  .table-density-default .el-table .el-table__row {
    height: 40px;
  }
  .table-density-middle .el-table .el-table__row {
    height: 32px;
  }
  .table-density-compact .el-table .el-table__row {
    height: 24px;
  }
  .table-density-default .el-table .el-table__cell {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .table-density-middle .el-table .el-table__cell {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  .table-density-compact .el-table .el-table__cell {
    padding-top: 1px;
    padding-bottom: 1px;
  }
</style>
