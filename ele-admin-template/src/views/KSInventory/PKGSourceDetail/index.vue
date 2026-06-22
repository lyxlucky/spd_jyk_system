<template>
  <div class="ele-body spd-page pkg-source-detail">
    <el-card shadow="never">
      <user-search ref="search" @search="reload" />
      <ele-pro-table
        ref="table"
        height="calc(100vh - 240px)"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        highlight-current-row
        :row-class-name="tableRowClass"
        cache-key="KSInventoryPKGSourceDetailTable"
        @current-change="onRowSelect"
        @sort-change="onSortChange"
      >
        <template v-slot:batchValidity="{ row }">
          <span>{{ batchValidityText(row) }}</span>
        </template>
      </ele-pro-table>

      <div class="table_content">
        <table class="ks-source">
          <thead>
            <tr>
              <th width="20"></th>
              <th width="180">操作人</th>
              <th width="180" class="ks-center">时间</th>
              <th width="30"></th>
              <th width="180">作业跟踪</th>
              <th>详细信息</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in traceRows" :key="index">
              <td></td>
              <td class="staff">{{ item.staff }}</td>
              <td class="ks-center">{{ item.time }}</td>
              <td>
                <span class="status-dot" :class="dotClass(item.dot)"></span>
              </td>
              <td>{{ item.jobTracking }}</td>
              <td class="detail-msg">{{ item.msg }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import UserSearch from './components/user-search.vue';
import { searchGs1, traceGs1 } from '@/api/KSInventory/PKGSourceDetail';
import {
  buildTraceDetailRows,
  batchValidityRowClass,
  formatBatchValidity
} from './utils';

export default {
  name: 'KSInventoryPKGSourceDetail',
  components: { UserSearch },
  data() {
    return {
      pageSize: 10,
      pageSizes: [10, 30, 60, 90, 150, 300],
      traceRows: [],
      pkSerialNumber: '',
      lastWhere: null,
      sortField: '',
      sortOrder: '',
      columns: [
        {
          prop: 'Name',
          label: '仓库名称',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'Varietie_Code',
          label: '品种编码',
          sortable: 'custom',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          sortable: 'custom',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          align: 'left',
          minWidth: 200,
          showOverflowTooltip: true
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号规格',
          align: 'left',
          minWidth: 190,
          showOverflowTooltip: true
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          width: 65,
          showOverflowTooltip: true
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'left',
          minWidth: 165,
          showOverflowTooltip: true
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',
          align: 'left',
          minWidth: 165,
          showOverflowTooltip: true
        },
        {
          prop: 'Batch',
          label: '生产批号',
          sortable: 'custom',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          columnKey: 'batchValidity',
          prop: 'Batch_Validity_Period',
          label: '有效到期',
          sortable: 'custom',
          align: 'left',
          width: 120,
          slot: 'batchValidity'
        },
        {
          prop: 'Coefficient',
          label: '系数',
          align: 'center',
          width: 65
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          sortable: 'custom',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'Hospitalization_Number',
          label: '病患号',
          sortable: 'custom',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'Serial_Number',
          label: 'UDI',
          sortable: 'custom',
          align: 'left',
          width: 260,
          showOverflowTooltip: true
        },
        {
          prop: 'Rfid_Code',
          label: 'RFID',
          sortable: 'custom',
          align: 'left',
          width: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'Storage_Id',
          label: '',
          width: 1,
          show: false
        }
      ]
    };
  },
  methods: {
    batchValidityText(row) {
      const f = formatBatchValidity(row);
      if (!f) return '';
      return typeof f === 'string' ? f : f.text;
    },
    tableRowClass({ row }) {
      return batchValidityRowClass(row);
    },
    dotClass(dot) {
      if (dot === 'red') return 'dot-red';
      if (dot === 'green') return 'dot-green';
      return 'dot-gray';
    },
    async datasource({ page, limit, where }) {
      const w = where || this.lastWhere || this.$refs.search?.getWhere?.() || {};
      this.lastWhere = w;
      try {
        const res = await searchGs1({
          page,
          size: limit,
          where: w,
          field: this.sortField,
          order: this.sortOrder
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    onSortChange({ prop, order }) {
      this.sortField = prop || '';
      this.sortOrder =
        order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
      this.reload(this.lastWhere);
    },
    async onRowSelect(row) {
      if (!row) {
        this.traceRows = [];
        return;
      }
      this.pkSerialNumber = row.Serial_Number || '';
      try {
        const res = await traceGs1(row.Def_No_Pkg_Code, row.Storage_Id);
        this.traceRows = buildTraceDetailRows(res.result || [], this.pkSerialNumber);
      } catch (e) {
        Message.error(e.message || '加载追溯明细失败');
        this.traceRows = [];
      }
    }
  }
};
</script>

<style scoped>
.table_content {
  margin-top: 15px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  min-height: 120px;
}

.ks-source {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.ks-source th,
.ks-source td {
  padding: 8px;
  border-bottom: 1px solid #e6e6e6;
}

.ks-source th {
  text-align: center;
  font-weight: normal;
}

.ks-source th:last-child,
.ks-source td.detail-msg {
  text-align: left;
}

.ks-center {
  text-align: center;
}

.staff {
  text-align: left;
}

.status-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-red {
  background-color: #f56c6c;
}

.dot-green {
  background-color: #67c23a;
}

.dot-gray {
  background-color: #909399;
}

::v-deep .ele-pro-table .el-table .pkg-source-row-warning > td {
  background-color: #fdf6ec !important;
}

::v-deep .ele-pro-table .el-table .pkg-source-row-danger > td {
  background-color: #fef0f0 !important;
}
</style>
