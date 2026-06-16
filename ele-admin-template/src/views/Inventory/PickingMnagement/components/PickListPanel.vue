<template>
  <el-card shadow="never">
    <div slot="header">定数包拣配指示单列表</div>
    <div class="panel-tip">注意：默认加载一个月的拣配单</div>
    <el-form :inline="true" size="mini" class="filter-row">
      <el-form-item label="拣配状态">
        <el-select v-model="form.PackState" style="width: 110px" @change="handleSearch">
          <el-option label="全部" :value="-1" />
          <el-option label="未拣配" :value="0" />
          <el-option label="已短拣" :value="1" />
          <el-option label="已全拣" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="转单状态">
        <el-select v-model="form.TransferState" style="width: 120px" @change="handleSearch">
          <el-option label="全部" :value="-1" />
          <el-option label="已转补货单" :value="0" />
          <el-option label="未转补货单" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="院区">
        <el-select
          v-model="form.storageId"
          placeholder="全部"
          clearable
          style="width: 120px"
          @change="handleSearch"
        >
          <el-option
            v-for="item in storageList"
            :key="item.ID"
            :label="item.NAME"
            :value="String(item.ID)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          @change="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.DeptCode"
          placeholder="科室编码/名称/库区"
          clearable
          style="width: 160px"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="form.PackNumber"
          placeholder="拣配单号"
          clearable
          style="width: 140px"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="local-toolbar spd-toolbar">
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button type="primary" size="mini" :disabled="!canOperatePick" @click="handleCompletePick">
            完成拣配
          </el-button>
          <el-button size="mini" :disabled="!canOperatePick" @click="handleCancelPick">
            取消拣配
          </el-button>
          <el-button
            v-if="hp.showKubao"
            size="mini"
            :disabled="!selectedRow"
            @click="handleSendKubao"
          >
            发送库宝
          </el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button size="mini" :disabled="!selectedRow" @click="handlePrintPick">打印拣配指示单</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button v-permission="'export-PickingMnagement-jpddc'" size="mini" @click="handleExport">
            导出
          </el-button>
          <el-button size="mini" @click="importVisible = true">导入定数包</el-button>
        </div>
      </div>
    </div>
    <ele-pro-table
      ref="table"
      size="mini"
      height="320px"
      highlight-current-row
      :columns="columns"
      :datasource="datasource"
      cache-key="pickingMnagementPickList"
      @row-click="handleRowClick"
    >
      <template v-slot:action="{ row }">
        <el-button
          v-if="String(row.Transfer_State) === '1'"
          type="text"
          icon="el-icon-delete"
          style="color: #f56c6c"
          @click.stop="handleDelete(row)"
        />
        <i v-else class="el-icon-delete" style="color: #c0c4cc; cursor: not-allowed" />
      </template>
    </ele-pro-table>
    <ImportPickBatchDialog :visible.sync="importVisible" @success="handleSearch" />
  </el-card>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import {
  searchPickList,
  getStorageList,
  deletePickList,
  completeByDirectiveNumber,
  cancelPickList,
  sendBDRobot,
  createPickExcel
} from '@/api/Inventory/PickingMnagement';
import {
  formatDateTime,
  formatPackState,
  formatTransferState,
  getDefaultMonthRange,
  openExcelFile,
  canCompletePick,
  unwrapData,
  isOkCode,
  pickingHpFlags
} from '../utils';
import ImportPickBatchDialog from './ImportPickBatchDialog.vue';

export default {
  name: 'PickListPanel',
  components: { ImportPickBatchDialog },
  data() {
    const [start, end] = getDefaultMonthRange();
    return {
      hp: pickingHpFlags,
      storageList: [],
      selectedRow: null,
      importVisible: false,
      form: {
        PackState: -1,
        TransferState: -1,
        storageId: '',
        dateRange: [start, end],
        DeptCode: '',
        PackNumber: '',
        field: '',
        order: ''
      },
      columns: [
        { prop: 'Pack_Directive_Number', label: '拣配单号', minWidth: 150, sortable: 'custom' },
        { prop: 'Dept_Two_Name', label: '配送科室', minWidth: 100, sortable: 'custom' },
        { prop: 'Creater', label: '创建人', width: 80 },
        {
          prop: 'Create_Time',
          label: '创建时间',
          width: 150,
          sortable: 'custom',
          formatter: (row) => formatDateTime(row.Create_Time)
        },
        {
          prop: 'Pack_State',
          label: '拣配状态',
          width: 90,
          sortable: 'custom',
          formatter: (row) => formatPackState(row.Pack_State)
        },
        {
          prop: 'Pack_Time',
          label: '拣配时间',
          width: 150,
          sortable: 'custom',
          formatter: (row) => formatDateTime(row.Pack_Time)
        },
        { prop: 'Packer', label: '拣配人', width: 80 },
        {
          prop: 'Transfer_State',
          label: '转单状态',
          width: 100,
          sortable: 'custom',
          formatter: (row) => formatTransferState(row.Transfer_State)
        },
        { prop: 'Print_Count', label: '打印次数', width: 80 },
        {
          columnKey: 'action',
          label: '选项',
          width: 70,
          align: 'center',
          slot: 'action'
        }
      ]
    };
  },
  computed: {
    canOperatePick() {
      return this.selectedRow && canCompletePick(this.selectedRow.Pack_State);
    }
  },
  mounted() {
    this.loadStorage();
  },
  methods: {
    loadStorage() {
      getStorageList().then((res) => {
        const data = unwrapData(res);
        this.storageList = data?.result || [];
      });
    },
    buildWhere() {
      const [start, end] = this.form.dateRange || ['', ''];
      return {
        DeptCode: this.form.DeptCode,
        PackNumber: this.form.PackNumber,
        StateDate: start || '',
        EndDate: end || '',
        PackState: this.form.PackState,
        TransferState: this.form.TransferState,
        storageId: this.form.storageId,
        field: this.form.field,
        order: this.form.order
      };
    },
    datasource({ page, limit, where, order }) {
      if (order?.sort) {
        this.form.field = order.sort;
        this.form.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return searchPickList({
        page,
        limit,
        where: { ...this.buildWhere(), ...(where || {}) }
      }).then((res) => {
        const data = unwrapData(res);
        return {
          count: data.total || 0,
          list: data.result || []
        };
      });
    },
    handleSearch() {
      this.$refs.table?.reload({ page: 1 });
    },
    handleRowClick(row) {
      this.selectedRow = row;
      this.$emit('pick-selected', row);
    },
    handleDelete(row) {
      if (String(row.Transfer_State) !== '1') return;
      this.$confirm('确定删除此行吗?', '提示', { type: 'warning' }).then(() => {
        deletePickList(row.ID).then((res) => {
          const data = unwrapData(res);
          if (data === 200 || data === '200') {
            this.$message.success('删除成功');
            this.handleSearch();
          } else if (data === 301 || data === '301') {
            this.$message.error('登录失效，请重新登录');
          }
        });
      });
    },
    handleCompletePick() {
      const num = this.selectedRow?.Pack_Directive_Number;
      if (!num) {
        this.$message.warning('请选择拣配单');
        return;
      }
      this.$confirm(
        `确定要完成拣配单${num}吗？系统会根据已拣数量自动判断短拣或全拣。`,
        '提示',
        { type: 'warning' }
      ).then(() => {
        const loading = this.$loading({ lock: true, text: '处理中...' });
        completeByDirectiveNumber(num)
          .then((res) => {
            const data = unwrapData(res);
            if (isOkCode(data?.code)) {
              this.$message.success(data.msg || '操作成功');
              this.handleSearch();
              this.$parent.$refs.deliveryList?.handleSearch();
            } else if (data?.code === 301) {
              this.$message.error('登录失效，请重新登录');
            } else {
              this.$message.error(data?.msg || '操作失败');
            }
          })
          .finally(() => loading.close());
      });
    },
    handleCancelPick() {
      const id = this.selectedRow?.ID;
      if (!id) return;
      this.$confirm('确定要取消拣配吗?', '提示', { type: 'warning' }).then(() => {
        const loading = this.$loading({ lock: true, text: '处理中...' });
        cancelPickList(id)
          .then((res) => {
            const data = unwrapData(res);
            if (isOkCode(data?.code)) {
              this.$message.success(data.msg || '取消成功');
              this.handleSearch();
            } else {
              this.$message.error(data?.msg || '操作失败');
            }
          })
          .finally(() => loading.close());
      });
    },
    handleSendKubao() {
      const num = this.selectedRow?.Pack_Directive_Number;
      if (!num) {
        this.$message.warning('请先选择拣配单');
        return;
      }
      const loading = this.$loading({ lock: true, text: '发送中...' });
      sendBDRobot(num)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '发送成功');
          } else {
            this.$message.error(data?.msg || '发送失败');
          }
        })
        .finally(() => loading.close());
    },
    handlePrintPick() {
      const num = this.selectedRow?.Pack_Directive_Number;
      const dept = this.selectedRow?.Dept_Two_Name || '';
      if (!num) {
        this.$message.warning('请选择要打印的拣配指示单');
        return;
      }
      const loading = this.$loading({ lock: true, text: '生成中...' });
      createPickExcel(num, dept)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            openExcelFile(data.msg);
          } else {
            this.$message.error(data?.msg || '生成失败');
          }
        })
        .finally(() => loading.close());
    },
    async handleExport() {
      const loading = this.$loading({ lock: true, text: '导出中...' });
      try {
        const res = await searchPickList({ page: 1, limit: 999999, where: this.buildWhere() });
        const data = unwrapData(res);
        if (!isOkCode(data?.code)) {
          this.$message.error(data?.msg || '导出失败');
          return;
        }
        const rows = (data.result || []).map((item) => [
          item.Pack_Directive_Number,
          item.Dept_Two_Name,
          item.Creater,
          formatDateTime(item.Create_Time),
          formatPackState(item.Pack_State),
          formatDateTime(item.Pack_Time),
          item.Packer,
          formatTransferState(item.Transfer_State),
          item.Print_Count
        ]);
        const sheet = utils.aoa_to_sheet([
          [
            '拣配单号',
            '配送科室',
            '创建人',
            '创建时间',
            '拣配状态',
            '拣配时间',
            '拣配人',
            '转单状态',
            '打印次数'
          ],
          ...rows
        ]);
        writeFile({ SheetNames: ['拣配单'], Sheets: { 拣配单: sheet } }, '拣配单信息.xlsx');
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-tip {
  color: #f56c6c;
  font-size: 12px;
  margin-bottom: 8px;
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
  gap: 4px;
}
.local-toolbar {
  margin-bottom: 8px;
}
.local-toolbar.spd-toolbar {
  padding: 0;
}
.local-toolbar .spd-toolbar__divider {
  min-height: 24px;
  margin: 0 8px;
}
</style>
