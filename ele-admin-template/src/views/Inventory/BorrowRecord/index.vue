<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form
        :model="searchForm"
        :inline="true"
        class="ele-form-search"
        size="mini"
        @keyup.enter.native="search"
      >
        <el-form-item label="领用时间" class="date-range-item" style="width: 400px">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input
            v-model="searchForm.OperatePerson"
            placeholder="请输入操作人"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input
            v-model="searchForm.VarietieCode"
            placeholder="请输入品种编码"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input
            v-model="searchForm.VarietieName"
            placeholder="请输入品种名称"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="全部计费">
          <el-select
            v-model="searchForm.IsAllCharged"
            placeholder="全部"
            clearable
            style="width: 120px"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
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

      <!-- 主表（聚合表） -->
      <div style="margin-top: 15px">
        <vxe-table
          ref="mainTable"
          :data="mainTableData"
          :loading="mainTableLoading"
          border
          stripe
          resizable
          size="mini"
          height="400"
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
            title="操作人"
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
            field="ReturnCount"
            title="归还数量"
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
          <vxe-column
            field="IsAllCharged"
            title="全部计费"
            width="100"
            align="center"
            :formatter="formatIsAllCharged"
          />
        </vxe-table>
        <!-- 主表分页 -->
        <vxe-pager
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

      <!-- 明细表 -->
      <div style="margin-top: 30px">
        <div
          style="
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div
            style="
              padding: 10px;
              background-color: #f5f7fa;
              border-radius: 4px;
              flex: 1;
              margin-right: 10px;
            "
          >
            <span style="font-size: 14px; color: #606266">
              <span style="font-weight: bold">当前筛选：</span>
              <span style="color: #409EFF">{{
                currentMainRow
                  ? currentMainRow.VarietCodeNew +
                    ' / ' +
                    currentMainRow.VarietieName +
                    ' / ' +
                    currentMainRow.OperatePerson +
                    ' / ' +
                    currentMainRow.BorrowDate
                  : '请点击主表行查看明细'
              }}</span>
            </span>
          </div>
          <el-button
            type="warning"
            icon="el-icon-download"
            size="small"
            @click="exportDetailTable"
          >
            导出明细
          </el-button>
        </div>
        <vxe-table
          ref="detailTable"
          :data="detailTableData"
          :loading="detailTableLoading"
          border
          stripe
          resizable
          size="mini"
          height="400"
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
            title="操作人"
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
            field="IsCharged"
            title="是否计费"
            width="100"
            align="center"
            :formatter="formatIsCharged"
          />
        </vxe-table>
        <!-- 明细表分页 -->
        <vxe-pager
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
      // 搜索表单
      searchForm: {
        StartTime: '',
        EndTime: '',
        OperatePerson: '',
        VarietieCode: '',
        VarietieName: '',
        DefNoPkgCode: '',
        IsAllCharged: ''
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
    // 获取默认日期范围（本月1日到现在）
    getDefaultDateRange() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const startDateStr = `${year}-${String(month + 1).padStart(2, '0')}-01 00:00:00`;
      const endDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} 23:59:59`;
      return [startDateStr, endDateStr];
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
        OperatePerson: '',
        VarietieCode: '',
        VarietieName: '',
        DefNoPkgCode: '',
        IsAllCharged: ''
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
        if (res.code === 200) {
          this.detailTableData = res.data?.list || [];
          this.detailTablePage.total = res.data?.total || 0;
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
      return cellValue || '';
    },
    // 格式化全部计费
    formatIsAllCharged({ cellValue }) {
      if (cellValue === '1') return '是';
      if (cellValue === '0') return '否';
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
    this.loadMainTableData();
  }
};
</script>


<style scoped>
.ele-form-search {
  margin-bottom: 15px;
}
</style>

<style>
.ele-form-search.el-form--inline
.date-range-item.el-form-item
.el-form-item__content {
  max-width: 320px;
}
</style>
