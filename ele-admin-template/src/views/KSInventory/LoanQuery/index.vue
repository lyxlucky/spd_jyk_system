<template>
  <div class="ele-body spd-page loan-query-page">
    <el-card shadow="never" class="loan-query-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <div class="spd-panel__body">
          <el-form
            ref="searchForm"
            :model="where"
            size="mini"
            :inline="true"
            @keyup.enter.native="handleSearch"
            @submit.native.prevent
          >
            <el-form-item label="批号" prop="BATCH">
              <el-input
                v-model="where.BATCH"
                placeholder="批号"
                clearable
                style="width: 110px"
              />
            </el-form-item>
            <el-form-item label="定数码" prop="DEF_NO_PKG_CODE">
              <el-input
                v-model="where.DEF_NO_PKG_CODE"
                placeholder="定数码"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="科室名称" prop="DEPT_TWO_NAME">
              <el-input
                v-model="where.DEPT_TWO_NAME"
                placeholder="科室名称"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="计费编码" prop="CHARGING_CODE">
              <el-input
                v-model="where.CHARGING_CODE"
                placeholder="计费编码"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item label="品种名称" prop="VARIETIE_NAME">
              <el-input
                v-model="where.VARIETIE_NAME"
                placeholder="品种名称"
                clearable
                style="width: 120px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
              <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">借货查询列表</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            highlight-current-row
            :toolbar="false"
            :header-overflow-hidden="false"
            :height="tableHeight"
            :rowClickChecked="true"
            :pageSize="pageSize"
            :pageSizes="pageSizes"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            cache-key="LoanQueryTable"
            @current-change="onCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetbindUseMachin } from '@/api/KSInventory/LoanQuery/index';

const defaultWhere = () => ({
  BATCH: '',
  DEF_NO_PKG_CODE: '',
  DEPT_TWO_NAME: '',
  CHARGING_CODE: '',
  VARIETIE_NAME: ''
});

export default {
  name: 'LoanQuery',
  data() {
    return {
      where: defaultWhere(),
      tableHeight: 'calc(100vh - 300px)',
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'BATCH',
          label: '批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          prop: 'DEF_NO_PKG_CODE',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '二级科室',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        }
      ],
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      selection: [],
      current: null
    };
  },
  methods: {
    datasource({ page, limit, where, order }) {
      return GetbindUseMachin({ page, limit, where, order }).then((res) => {
        this.formData = res.result;
        return {
          count: res.total,
          list: res.data
        };
      });
    },
    onCurrentChange(current) {
      this.current = current;
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    handleSearch() {
      this.reload(this.where);
    },
    handleReset() {
      this.where = defaultWhere();
      this.reload(this.where);
    }
  },
  mounted() {
    this.$bus.$on('handleCommand', () => {
      this.reload();
    });
  },
  beforeDestroy() {
    this.$bus.$off('handleCommand');
  }
};
</script>

<style scoped>
.loan-query-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loan-query-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
