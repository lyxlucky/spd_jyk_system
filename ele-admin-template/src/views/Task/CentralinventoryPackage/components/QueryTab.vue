<template>
  <div class="cip-query-tab">
    <el-form :inline="true" size="mini" class="filter-row">
      <el-form-item>
        <el-input v-model="filters.bagMakingNumber" placeholder="制包单号/操作人" clearable style="width: 150px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.condition" placeholder="品种编码、名称、生产企业、规格" clearable style="width: 240px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="filters.dateRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 340px"
          @change="reload"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.deliveryNoteNumber" placeholder="入库单号" clearable style="width: 130px" @keyup.enter.native="reload" />
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="mini" class="filter-row" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="filters.defCode" placeholder="定数码" clearable style="width: 130px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.rfidCode" placeholder="RFID码" clearable style="width: 130px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.batch" placeholder="批号" clearable style="width: 120px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.supplierName" placeholder="供应商名称" clearable style="width: 140px" @keyup.enter.native="reload" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.deliveryNoteRfid" clearable placeholder="对应入库单" style="width: 120px" @change="reload">
          <el-option label="全部" value="" />
          <el-option label="RFID标签" value="1" />
          <el-option label="普通标签" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.storageId" clearable placeholder="收货库区" style="width: 120px" @change="reload">
          <el-option v-for="item in storageList" :key="item.ID" :label="item.NAME" :value="String(item.ID)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tip-red">注意：日期搜索为空则默认搜索最近7天</div>
    <div class="local-toolbar spd-toolbar">
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-select v-model="printType" size="mini" style="width: 180px">
            <el-option v-for="item in labelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button size="mini" type="primary" :disabled="!selection.length" @click="handleReprint">补打定数包标签</el-button>
          <el-button size="mini" :disabled="!selection.length" @click="handlePrintOrder">打印制包单号</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <div class="spd-toolbar__btns">
          <el-button v-permission="'export-CentralinventoryPackage-zbdc'" size="mini" @click="handleExport">导出EXCEL</el-button>
        </div>
      </div>
    </div>
    <ele-pro-table
      ref="queryTable"
      size="mini"
      height="calc(100vh - 360px)"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="cipQueryTable"
    >
      <template v-slot:bagTime="{ row }">{{ formatDateTime(row.Bag_Making_Time) }}</template>
      <template v-slot:prodDate="{ row }">{{ formatDate10(row.Batch_Production_Date) }}</template>
      <template v-slot:validDate="{ row }">{{ formatDate10(row.Batch_Validity_Period) }}</template>
      <template v-slot:printState="{ row }">{{ formatPrintUpShelfState(row.Print_Up_Shelf_State) }}</template>
    </ele-pro-table>
  </div>
</template>

<script>
import {
  getStorageList,
  searchBagMakingDefCode,
  exportBagMakingDefCode,
  noTagBagMakingDef
} from '@/api/Task/CentralinventoryPackage';
import {
  LABEL_OPTIONS,
  unwrapData,
  isOkCode,
  formatDate10,
  formatPrintUpShelfState,
  getDefaultQueryRange,
  openExcelFile,
  openQueryReprint,
  openPrintBagMakingOrder
} from '../utils';

export default {
  name: 'QueryTab',
  data() {
    const [dateFrom, dateTo] = getDefaultQueryRange();
    return {
      storageList: [],
      printType: '1',
      labelOptions: LABEL_OPTIONS,
      selection: [],
      filters: {
        bagMakingNumber: '',
        condition: '',
        defCode: '',
        rfidCode: '',
        batch: '',
        supplierName: '',
        deliveryNoteNumber: '',
        deliveryNoteRfid: '',
        storageId: '',
        dateRange: [dateFrom, dateTo],
        field: '',
        order: ''
      },
      columns: [
        { type: 'selection', width: 45, align: 'center' },
        { prop: 'Name', label: '仓库名称', width: 80 },
        { prop: 'Bag_Maker', label: '制包人', width: 70 },
        { prop: 'Bag_Making_Number', label: '制包单号', width: 110, sortable: true },
        { prop: 'Varietie_Code', label: '品种(材料)编码', width: 100, sortable: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 180 },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 140 },
        { prop: 'Unit', label: '单位', width: 50, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 140 },
        { prop: 'Batch', label: '生产批号', width: 100, sortable: true },
        { columnKey: 'bagTime', label: '制包时间', width: 140, slot: 'bagTime', sortable: true },
        { columnKey: 'prodDate', label: '生产日期', width: 90, slot: 'prodDate', sortable: true },
        { columnKey: 'validDate', label: '失效日期', width: 90, slot: 'validDate', sortable: true },
        { prop: 'Coefficient', label: '系数', width: 50, align: 'center', sortable: true },
        { prop: 'Def_No_Pkg_Code', label: '定数码', width: 130, sortable: true },
        { prop: 'PRINT_COUNT', label: '打印次数', width: 80, sortable: true },
        { prop: 'Serial_Number', label: 'UDI码', width: 120, sortable: true },
        { prop: 'RFID_Code', label: 'RFID码', width: 120, sortable: true },
        { columnKey: 'printState', label: '打印上架状态', width: 100, slot: 'printState', sortable: true },
        { prop: 'DELIVERY_NOTE_NUMBER', label: '收货单号', width: 120, sortable: true }
      ]
    };
  },
  mounted() {
    getStorageList().then((res) => {
      const data = unwrapData(res);
      this.storageList = data?.result || [];
    });
  },
  methods: {
    formatDate10,
    formatPrintUpShelfState,
    formatDateTime(val) {
      if (!val) return '';
      return String(val).replace('T', ' ').substr(0, 19);
    },
    buildWhere() {
      const [dateFrom, dateTo] = this.filters.dateRange || ['', ''];
      return {
        ...this.filters,
        dateFrom: dateFrom || '',
        dateTo: dateTo || ''
      };
    },
    datasource({ page, limit, order }) {
      if (order?.sort) {
        this.filters.field = order.sort;
        this.filters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return searchBagMakingDefCode({
        page,
        limit,
        where: this.buildWhere()
      }).then((res) => {
        const data = unwrapData(res);
        if (data?.code === 301 || data?.code === '301') {
          this.$message.error(data.msg || '登录失效');
          return { count: 0, list: [] };
        }
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    reload() {
      this.selection = [];
      this.$refs.queryTable?.reload({ page: 1 });
    },
    handleExport() {
      const loading = this.$loading({ lock: true, text: '正在导出...' });
      exportBagMakingDefCode(this.buildWhere())
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code) && data.msg) {
            openExcelFile(data.msg);
          } else {
            this.$message.error(data?.msg || '导出失败');
          }
        })
        .finally(() => loading.close());
    },
    handleReprint() {
      if (this.printType === '-1') {
        const json = JSON.stringify(
          this.selection.map((row) => ({ Bag_Making_Paln_Batch_Id: row.Batch_Id }))
        );
        const loading = this.$loading({ lock: true });
        noTagBagMakingDef(json)
          .then((res) => {
            const data = unwrapData(res);
            if (data?.code === 400 || data?.code === '400') {
              this.$message.error(data.msg || '操作失败');
            } else if (data?.code === 301 || data?.code === '301') {
              this.$message.error(data.msg || '登录失效');
            } else {
              this.$message.success(data?.msg || '操作成功');
              this.reload();
            }
          })
          .finally(() => loading.close());
        return;
      }
      const storageId = this.selection[0]?.Storage_Id;
      if (!this.selection.every((item) => item.Storage_Id === storageId)) {
        this.$message.warning('不能打印不同仓库的品种');
        return;
      }
      const detailIds = this.selection.map((row) => row.Bag_Making_Detail_Id);
      const url = openQueryReprint(this.printType, detailIds);
      window.open(url);
    },
    handlePrintOrder() {
      const numbers = this.selection.map((row) => row.Bag_Making_Number);
      if (!numbers.length) {
        this.$message.warning('请选择数据');
        return;
      }
      window.open(openPrintBagMakingOrder(numbers));
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 8px;
  gap: 4px;
}
.tip-red {
  color: #f56c6c;
  font-size: 12px;
  margin-bottom: 8px;
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
