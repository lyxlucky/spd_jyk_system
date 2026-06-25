<template>
  <div class="ele-body spd-page borrow-record-page">
    <el-card shadow="never" class="borrow-record-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <div class="spd-panel__body">
          <el-form
            :model="searchForm"
            size="mini"
            :inline="true"
            @keyup.enter.native="search"
            @submit.native.prevent
          >
            <el-form-item label="领用时间">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 340px"
              />
            </el-form-item>
            <el-form-item label="领用人">
              <el-input
                v-model="searchForm.OperatePerson"
                placeholder="领用人"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="品种编码">
              <el-input
                v-model="searchForm.VarietieCode"
                placeholder="品种编码"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="品种名称">
              <el-input
                v-model="searchForm.VarietieName"
                placeholder="品种名称"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="规格型号">
              <el-input
                v-model="searchForm.Spec"
                placeholder="规格型号"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="定数码">
              <el-input
                v-model="searchForm.DefNoPkgCode"
                placeholder="定数码"
                clearable
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="计费人">
              <el-input
                v-model="searchForm.ChargePerson"
                placeholder="计费人"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                class="ele-btn-icon"
                type="primary"
                icon="el-icon-search"
                @click="search"
              >
                搜索
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="ele-btn-icon" icon="el-icon-refresh" @click="reset">
                重置
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                class="ele-btn-icon"
                type="warning"
                icon="el-icon-download"
                @click="exportMainTable"
              >
                导出汇总
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">领用汇总</div>
        <div class="spd-table-panel__wrap borrow-record-table-wrap">
          <vxe-table
            ref="mainTable"
            class="data-table"
            :data="mainTableData"
            :loading="mainTableLoading"
            border
            stripe
            resizable
            size="mini"
            height="360"
            highlight-current-row
            :virtual-y-config="{ enabled: true, gt: 100 }"
            @current-change="onMainTableCurrentChange"
            @row-click="onMainTableRowClick"
          >
            <vxe-column type="seq" title="序号" width="60" align="center" />
            <vxe-column
              field="VarietCodeNew"
              title="品种编码"
              min-width="120"
              show-overflow
              sortable
            />
            <vxe-column
              field="VarietieName"
              title="品种名称"
              min-width="150"
              show-overflow
              sortable
            />
            <vxe-column
              field="Spec"
              title="规格型号"
              min-width="120"
              show-overflow
            />
            <vxe-column field="Unit" title="单位" width="80" align="center" />
            <vxe-column
              field="OperatePerson"
              title="领用人"
              width="100"
              align="center"
              sortable
            />
            <vxe-column
              field="BorrowDate"
              title="领用日期"
              width="120"
              align="center"
              sortable
            />
            <vxe-column
              field="BorrowCount"
              title="暂借数量"
              width="100"
              align="right"
              sortable
            />
            <vxe-column
              field="ChargedCount"
              title="计费数量"
              width="100"
              align="right"
              sortable
            />
            <vxe-column
              field="PendingCount"
              title="未归还"
              width="100"
              align="right"
              sortable
            />
          </vxe-table>
          <vxe-pager
            size="mini"
            :current-page="mainTablePage.page"
            :page-size="mainTablePage.size"
            :total="mainTablePage.total"
            :page-sizes="[100, 500, 2000, 5000]"
            :layouts="[
              'PrevJump',
              'PrevPage',
              'Number',
              'NextPage',
              'NextJump',
              'Sizes',
              'FullJump',
              'Total'
            ]"
            @page-change="onMainTablePageChange"
          />
        </div>
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head spd-panel__head--split">
          <span>领用明细</span>
          <span class="borrow-record-detail-head">
            <span class="spd-panel__head-meta">
              {{
                currentMainRow
                  ? currentMainRow.VarietCodeNew +
                    ' / ' +
                    currentMainRow.VarietieName +
                    ' / ' +
                    currentMainRow.OperatePerson +
                    ' / ' +
                    currentMainRow.BorrowDate
                  : '请点击主表行查看明细'
              }}
            </span>
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="exportDetailTable"
            >
              导出明细
            </el-button>
          </span>
        </div>
        <div class="spd-table-panel__wrap borrow-record-table-wrap">
          <vxe-table
            ref="detailTable"
            class="data-table"
            :data="detailTableData"
            :loading="detailTableLoading"
            border
            stripe
            resizable
            size="mini"
            height="360"
            :column-config="{ drag: true }"
            :virtual-y-config="{ enabled: true, gt: 100 }"
          >
            <vxe-column type="seq" title="序号" width="60" align="center" />
            <vxe-column
              field="DefNoPkgCode"
              title="定数码"
              min-width="140"
              show-overflow
              sortable
            />
            <vxe-column
              field="VarietCodeNew"
              title="品种编码"
              min-width="120"
              show-overflow
            />
            <vxe-column
              field="VarietieName"
              title="品种名称"
              min-width="150"
              show-overflow
            />
            <vxe-column
              field="Spec"
              title="规格型号"
              min-width="120"
              show-overflow
            />
            <vxe-column field="Batch" title="批号" width="120" show-overflow />
            <vxe-column
              v-if="false"
              field="SerialNumber"
              title="SN码"
              width="150"
              show-overflow
            />
            <vxe-column
              v-if="false"
              field="RfidCode"
              title="RFID码"
              width="120"
              show-overflow
            />
            <vxe-column
              field="OperatePerson"
              title="领用人"
              width="100"
              align="center"
            />
            <vxe-column
              field="OperateType"
              title="操作类型"
              width="100"
              align="center"
              :formatter="formatOperateType"
            />
            <vxe-column
              field="BorrowTime"
              title="暂借时间"
              width="160"
              align="center"
              :formatter="formatDateTime"
              sortable
            />
            <vxe-column
              field="ReturnTime"
              title="归还时间"
              width="160"
              align="center"
              :formatter="formatDateTime"
              sortable
            />
            <vxe-column
              field="DeptTwoName"
              title="科室"
              min-width="120"
              show-overflow
            />
            <vxe-column
              field="Ssbh"
              title="手术编号"
              width="150"
              show-overflow
            />
            <vxe-column
              field="Zdmc"
              title="主刀医生"
              width="100"
              align="center"
            />
            <vxe-column
              field="PatientName"
              title="病人姓名"
              width="100"
              align="center"
              show-overflow
            />
            <vxe-column
              field="PatientNumber"
              title="住院号"
              width="120"
              align="center"
              show-overflow
            />
            <vxe-column
              field="ChargePerson"
              title="计费人"
              width="100"
              align="center"
            />
            <vxe-column
              field="ChargeTime"
              title="计费时间"
              width="160"
              align="center"
              :formatter="formatDateTime"
              sortable
            />
            <vxe-column
              field="IsCharged"
              title="是否计费"
              width="100"
              align="center"
              :formatter="formatIsCharged"
            />
          </vxe-table>
          <vxe-pager
            size="mini"
            :current-page="detailTablePage.page"
            :page-size="detailTablePage.size"
            :total="detailTablePage.total"
            :page-sizes="[100, 500, 2000, 5000]"
            :layouts="[
              'PrevJump',
              'PrevPage',
              'Number',
              'NextPage',
              'NextJump',
              'Sizes',
              'FullJump',
              'Total'
            ]"
            @page-change="onDetailTablePageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getSummaryList,
  getDetailList
} from '@/api/Inventory/BorrowRecord';

export default {
  name: 'BorrowRecord',
  data() {
    return {
      tableHeight: 'calc((100vh - 360px) / 2)',
      // 搜索表单
      searchForm: {
        StartTime: '',
        EndTime: '',
        OperatePerson: '',
        VarietieCode: '',
        VarietieName: '',
        Spec: '',
        DefNoPkgCode: '',
        ChargePerson: ''
      },
      dateRange: null,
      // 主表
      mainTableData: [],
      mainTableLoading: false,
      mainTablePage: {
        page: 1,
        size: 2000,
        total: 0
      },
      currentMainRow: null,
      // 明细表
      detailTableData: [],
      detailTableLoading: false,
      detailTablePage: {
        page: 1,
        size: 2000,
        total: 0
      }
    };
  },
  methods: {
    // 获取默认日期范围（当天）
    getDefaultDateRange() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      return [`${dateStr} 00:00:00`, `${dateStr} 23:59:59`];
    },
    // 搜索
    search() {
      if (this.dateRange && this.dateRange.length === 2) {
        this.searchForm.StartTime = this.dateRange[0];
        this.searchForm.EndTime = this.dateRange[1];
      } else {
        this.searchForm.StartTime = '';
        this.searchForm.EndTime = '';
      }
      this.mainTablePage.page = 1;
      this.currentMainRow = null;
      this.detailTableData = [];
      this.detailTablePage.total = 0;
      this.loadMainTableData();
    },
    // 重置
    reset() {
      this.searchForm = {
        StartTime: '',
        EndTime: '',
        OperatePerson: this.$store.state.user.info.Nickname || '',
        VarietieCode: '',
        VarietieName: '',
        Spec: '',
        DefNoPkgCode: '',
        ChargePerson: ''
      };
      this.dateRange = this.getDefaultDateRange();
      this.mainTablePage.page = 1;
      this.currentMainRow = null;
      this.detailTableData = [];
      this.detailTablePage.total = 0;
      this.search();
    },
    // 加载主表数据
    async loadMainTableData() {
      this.mainTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          page: this.mainTablePage.page,
          size: this.mainTablePage.size
        };
        const res = await getSummaryList(params);
        if (res.code === 200) {
          this.mainTableData = res.data?.list || [];
          this.mainTablePage.total = res.data?.total || 0;
        } else {
          this.$message.error(res.msg || '加载数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载数据失败');
      } finally {
        this.mainTableLoading = false;
      }
    },
    // 加载明细表数据
    async loadDetailTableData() {
      if (!this.currentMainRow) {
        this.detailTableData = [];
        this.detailTablePage.total = 0;
        return;
      }
      this.detailTableLoading = true;
      try {
        const params = {
          ...this.searchForm,
          VarietieCode: this.currentMainRow.VarietCodeNew,
          OperatePerson: this.currentMainRow.OperatePerson,
          StartTime: this.currentMainRow.BorrowDate + ' 00:00:00',
          EndTime: this.currentMainRow.BorrowDate + ' 23:59:59',
          page: this.detailTablePage.page,
          size: this.detailTablePage.size
        };
        const res = await getDetailList(params);
        console.log(res);
        if (res.code === 200) {
          this.detailTableData = res.data?.list || [];
          this.detailTablePage.total = res.data?.total || 0;
          console.log(this.detailTableData);
        } else {
          this.$message.error(res.msg || '加载明细数据失败');
        }
      } catch (error) {
        this.$message.error(error.message || '加载明细数据失败');
      } finally {
        this.detailTableLoading = false;
      }
    },
    // 主表分页变化
    onMainTablePageChange({ currentPage, pageSize }) {
      this.mainTablePage.page = currentPage;
      this.mainTablePage.size = pageSize;
      this.loadMainTableData();
    },
    // 明细表分页变化
    onDetailTablePageChange({ currentPage, pageSize }) {
      this.detailTablePage.page = currentPage;
      this.detailTablePage.size = pageSize;
      this.loadDetailTableData();
    },
    // 主表当前行变化
    onMainTableCurrentChange({ row }) {
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      this.loadDetailTableData();
    },
    // 主表行点击
    onMainTableRowClick({ row }) {
      if (!row) return;
      this.currentMainRow = row;
      this.detailTablePage.page = 1;
      this.$nextTick(() => {
        if (this.$refs.mainTable) {
          this.$refs.mainTable.setCurrentRow(row);
        }
      });
      this.loadDetailTableData();
    },
    // 格式化操作类型
    formatOperateType({ cellValue }) {
      if (cellValue === 'BORROW') return '暂借';
      if (cellValue === 'RETURN') return '归还';
      if (cellValue === 'CHARGE') return '已计费';
      return cellValue || '';
    },
    // 格式化是否计费
    formatIsCharged({ cellValue }) {
      if (cellValue === '1' || cellValue === 1) return '是';
      if (cellValue === '0' || cellValue === 0) return '否';
      return cellValue || '';
    },
    // 格式化日期时间
    formatDateTime({ cellValue }) {
      if (!cellValue) return '';
      if (typeof cellValue === 'string') {
        return cellValue.replace('T', ' ');
      }
      const date = new Date(cellValue);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    // 导出主表
    exportMainTable() {
      if (!this.mainTableData || this.mainTableData.length === 0) {
        this.$message.warning('暂无数据可导出');
        return;
      }
      this.$refs.mainTable.exportData({
        type: 'xlsx',
        filename: '领用记录汇总表',
        sheetName: '汇总数据',
        isHeader: true,
        isFooter: false
      });
    },
    // 导出明细表
    exportDetailTable() {
      if (!this.detailTableData || this.detailTableData.length === 0) {
        this.$message.warning('暂无数据可导出');
        return;
      }
      this.$refs.detailTable.exportData({
        type: 'xlsx',
        filename: '领用记录明细表',
        sheetName: '明细数据',
        isHeader: true,
        isFooter: false
      });
    }
  },
  created() {
    this.dateRange = this.getDefaultDateRange();
    if (this.dateRange && this.dateRange.length === 2) {
      this.searchForm.StartTime = this.dateRange[0];
      this.searchForm.EndTime = this.dateRange[1];
    }
    this.searchForm.OperatePerson = this.$store.state.user.info.Nickname || '';
    this.loadMainTableData();
  }
};
</script>


<style scoped>
.borrow-record-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.borrow-record-page .spd-table-panel {
  flex: 1;
  min-height: 0;
}

.borrow-record-table-wrap {
  display: flex;
  flex-direction: column;
  min-height: calc((100vh - 360px) / 2 + 36px);
}

.borrow-record-table-wrap .data-table {
  flex: 1;
  min-height: calc((100vh - 360px) / 2);
}

.borrow-record-detail-head {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: normal;
}

.borrow-record-page >>> .vxe-table .vxe-header--column .vxe-cell {
  white-space: nowrap;
}

.borrow-record-page >>> .vxe-table--render-default .vxe-table--body-wrapper {
  min-height: calc((100vh - 360px) / 2 - 40px);
}
</style>
