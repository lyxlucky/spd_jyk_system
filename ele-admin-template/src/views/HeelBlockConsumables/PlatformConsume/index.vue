<template>
  <div class="platform-consume">
    <!-- <el-card shadow="always"> -->
    <el-container>
      <el-aside class="platform-consume__pane platform-consume__pane--order">
        <el-card shadow="never">
          <AdvanceReceiptNumberTable @getCurrent="getCurrent"></AdvanceReceiptNumberTable>
        </el-card>
      </el-aside>
      <el-container class="platform-consume__pane platform-consume__pane--grow">
        <el-main>
          <el-card shadow="never">
            <AdvanceReceiptNumberDelTable :ApplyTempTableData="ApplyTempTableData" @selectionData="selectionData"></AdvanceReceiptNumberDelTable>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
    <el-container>
      <el-aside class="platform-consume__pane platform-consume__pane--confirm">
        <el-card shadow="never">
          <VarietyConsumptionTable @getVarietyCurrent="getVarietyCurrent" :ApplyTempTableData="ApplyTempTableData" />
        </el-card>
      </el-aside>
      <el-container class="platform-consume__pane platform-consume__pane--grow">
        <el-main>
          <el-card shadow="never">
            <el-button type="primary" size="mini" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确认申领</el-button>
            <UDIListTable :ApplyTempTableData="VarietyTableData" :mainTableData="ApplyTempTableData" @selectionData="selectionData" />
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AdvanceReceiptNumberTable from './components/AdvanceReceiptNumberTable.vue';
import AdvanceReceiptNumberDelTable from './components/AdvanceReceiptNumberDelTable';
import VarietyConsumptionTable from './components/VarietyConsumptionTable';
import UDIListTable from './components/UDIListTable';
import { KeeptListDeta } from '@/api/KSInventory/ApplyTemp';
export default {
  name: 'ApplyTemp',
  props: ['IntroduceUserDefinedTempSearch'],
  components: {
    AdvanceReceiptNumberTable,
    AdvanceReceiptNumberDelTable,
    VarietyConsumptionTable,
    UDIListTable,
  },
  data() {
    return {
      // 主表数据
      ApplyTempTableData: {},
      // 详情表选择数据
      ApplyTempDataSelData: [],
      // 品种消耗确认表 
      VarietyTableData: [],
    };
  },
  methods: {
    getCurrent(data) {
      this.ApplyTempTableData = data;
    },
    getVarietyCurrent(data) {
      this.VarietyTableData = data;
    },
    addTempVar() {
      // console.log(this.IntroduceUserDefinedTempSearch);
      // console.log(this.ApplyTempDataSelData)
      const loading = this.$messageLoading('添加中...');
      var json = [];
      this.ApplyTempDataSelData.forEach((element) => {
        var data = {};
        data.PLAN_NUMBER = this.IntroduceUserDefinedTempSearch.PlanNum;
        data.ENABLE = element.VAR_ENABLE;
        data.VARIETIE_CODE = element.VarID;
        data.VARIETIE_NAME = element.VarName;
        data.SPECIFICATION_OR_TYPE = element.GG;
        data.UNIT = element.Unit;
        data.MANUFACTURING_ENT_NAME = element.Manufacturing;
        data.AUTH = element.AUTH;
        data.APPLY_QTY = element.TempletQty;
        json.push(data);
      });
      KeeptListDeta(json)
        .then((res) => {
          console.log(res);
          this.$message.success('添加成功');
          loading.close();
          this.$emit('ApplyTempPageChange', false);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error(err);
          loading.close();
        });
      console.log(json);
    },
    selectionData(data) {
      this.ApplyTempDataSelData = data;
    }
  },

  computed: {
    IsDisabled() {
      return this.IntroduceUserDefinedTempSearch == undefined ? true : false;
    }
  },
  mounted() {
    this._fullscreenObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const el = mutation.target;
        if (!el || !el.classList || !el.classList.contains('ele-pro-table')) {
          return;
        }
        const opened = el.classList.contains('ele-pro-table-fullscreen');
        if (opened && el.parentNode !== document.body) {
          const marker = document.createComment('spd-table-fullscreen');
          el.parentNode.insertBefore(marker, el);
          el._spdMarker = marker;
          document.body.appendChild(el);
          this.$nextTick(() => {
            if (el.__vue__ && typeof el.__vue__.doLayout === 'function') {
              el.__vue__.doLayout();
            }
          });
        } else if (!opened && el._spdMarker && el._spdMarker.parentNode) {
          el._spdMarker.parentNode.insertBefore(el, el._spdMarker);
          el._spdMarker.parentNode.removeChild(el._spdMarker);
          el._spdMarker = null;
          this.$nextTick(() => {
            if (el.__vue__ && typeof el.__vue__.doLayout === 'function') {
              el.__vue__.doLayout();
            }
          });
        }
      });
    });
    this._fullscreenObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  },
  beforeDestroy() {
    if (this._fullscreenObserver) {
      this._fullscreenObserver.disconnect();
    }
    document.querySelectorAll('body > .ele-pro-table').forEach((el) => {
      if (el._spdMarker && el._spdMarker.parentNode) {
        el._spdMarker.parentNode.insertBefore(el, el._spdMarker);
        el._spdMarker.parentNode.removeChild(el._spdMarker);
        el._spdMarker = null;
      }
    });
  }
};
</script>


<style scoped lang="scss">
  /* 整页锁在内容区 100% 宽，列多了只在表格内部滚动 */
  .platform-consume {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
  }

  .platform-consume > .el-container {
    flex: 1 1 0;
    width: 100%;
    height: 50%;
    max-height: 50%;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .platform-consume > .el-container + .el-container {
    border-top: 1px solid #ebeef5;
  }

  .platform-consume__pane--order {
    width: 34% !important;
    max-width: 34%;
    flex: 0 0 34%;
  }

  .platform-consume__pane--confirm {
    width: 68% !important;
    max-width: 68%;
    flex: 0 0 68%;
  }

  .platform-consume__pane--grow {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
  }

  :deep(.el-aside),
  :deep(.el-main),
  :deep(.platform-consume__pane--grow) {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0;
    min-height: 0;
    padding: 0;
    overflow: hidden;
  }

  :deep(.el-main) {
    border-left: 1px solid #ebeef5;
  }

  :deep(.el-card) {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    border: none;
    border-radius: 0;
    overflow: hidden;
  }

  :deep(.el-card__header) {
    flex: none;
    padding: 4px 10px;
    font-size: 13px;
    line-height: 22px;
    border-bottom: 1px solid #ebeef5;
  }

  :deep(.el-card__body) {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-height: 0;
    padding: 0;
    overflow: hidden;
  }

  :deep(.ele-body) {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    min-height: 0;
    padding: 4px 8px 0;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* 不要改 el-table 的 display，否则表头和表体会拆开 */
  :deep(.ele-pro-table) {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  :deep(.ele-pro-table.ele-pro-table-fullscreen) {
    position: fixed;
    z-index: 3000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-width: none;
    margin: 0;
    padding: 12px 12px 8px;
    overflow: hidden;
    background: #fff;
    box-sizing: border-box;
  }

  :deep(.ele-table-tool) {
    flex-wrap: wrap;
    align-items: center;
    max-width: 100%;
    margin-bottom: 0;
  }

  :deep(.ele-table-tool-title) {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
  }

  :deep(.ele-table-tool-title-label) {
    flex: none;
    margin-right: 8px;
  }

  :deep(.ele-table-tool-title-label h6) {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 22px;
    color: #303133;
  }

  :deep(.ele-table-tool-title-content) {
    flex: 1 1 auto;
    min-width: 0;
  }

  :deep(.ele-tool) {
    flex: none;
    margin: 0 0 0 6px;
  }

  :deep(.ele-table-tool .el-form) {
    margin: 0;
  }

  :deep(.ele-table-tool .el-form-item) {
    margin: 0 4px 0 0;
  }

  :deep(.order-search) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    min-width: 0;
  }

  :deep(.order-search > .el-input) {
    flex: 1 1 0;
    width: auto;
    min-width: 72px;
  }

  :deep(.ele-table-tool .ele-table-tool-title),
  :deep(.ele-table-tool .ele-tool) {
    margin-top: 0;
    margin-bottom: 0;
  }

  :deep(.el-table th.el-table__cell),
  :deep(.el-table td.el-table__cell) {
    padding: 1px 0;
  }

  :deep(.el-table .cell) {
    line-height: 18px;
    padding-left: 6px;
    padding-right: 6px;
  }

  :deep(.el-table .el-tag) {
    height: 20px;
    line-height: 18px;
    padding: 0 6px;
  }

  :deep(.el-form-item) {
    margin-bottom: 4px;
  }

  /* 分页压成一条，去掉组件自带的 10px 上边距 */
  :deep(.ele-pro-table .el-pagination) {
    margin: 0;
    padding: 2px 0 0;
    font-size: 12px;
    font-weight: normal;
    line-height: 22px;
    white-space: nowrap;
  }

  :deep(.ele-pro-table .el-pagination > *) {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  :deep(.el-pagination button),
  :deep(.el-pagination span:not([class*='suffix'])),
  :deep(.el-pagination .el-pager li) {
    height: 22px;
    min-width: 22px;
    line-height: 22px;
    font-size: 12px;
  }

  :deep(.el-pagination .el-input__inner) {
    height: 22px;
    line-height: 22px;
  }

  :deep(.el-pagination .el-select .el-input) {
    width: 88px;
    margin: 0 4px;
  }
</style>

<style lang="scss">
  /* 挂到 body 后不再受页面层叠影响，盖住顶栏和另外三块 */
  body > .ele-pro-table.ele-pro-table-fullscreen {
    position: fixed !important;
    z-index: 4000 !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 12px 12px 8px !important;
    overflow: hidden !important;
    background: #fff !important;
    box-sizing: border-box !important;
  }
</style>