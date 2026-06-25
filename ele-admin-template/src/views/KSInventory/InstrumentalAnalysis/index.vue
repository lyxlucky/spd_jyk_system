<template>
  <div class="ele-body spd-page instrumental-analysis-page">
    <el-card shadow="never" class="instrumental-analysis-card">
      <user-search @search="reload" @exportData="exportData" />
      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">仪器分析列表</div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            :height="tableHeight"
            :pageSize="pageSize"
            :pageSizes="pageSizes"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            cache-key="InstrumentalAnalysisTable"
          >
            <template v-slot:action="{ row }">
              <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
                修改
              </el-link>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import { GetPDAList } from '@/api/KSInventory/InstrumentalAnalysis';

export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserEdit
  },
  data() {
    return {
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
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'BIND_MACHINE',
          label: '机械号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格/型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'UNIT',
          label: '单位',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SUM',
          label: '数量',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'LIS_COUNT',
          label: 'PAD扫码数量',
          align: 'center',
          sortable: 'custom',
          width: 120,
          showOverflowTooltip: true
        }
      ],
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      selection: [],
      current: null,
      showEdit: false,
      showImport: false,
      data: []
    };
  },
  methods: {
    datasource({ page, limit, where, order }) {
      return GetPDAList({ page, limit, where, order }).then((res) => {
        return res.result;
      });
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    openImport() {
      this.showImport = true;
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        GetPDAList({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '品种id',
                '品种名称',
                '规格/型号',
                '生产企业名称',
                '注册证号',
                '单位',
                '中标价',
                '品种类别',
                '换算比(试剂)',
                '仪器备注'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.Varietie_Code_New,
                d.Varietie_Code,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Manufacturing_Ent_Name,
                d.APPROVAL_NUMBER,
                d.UNIT,
                d.Price,
                d.CLASS_NUM,
                d.CONVERSION_RATIO,
                d.DEVICE_REMARK
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室入库品种.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  }
};
</script>

<style scoped>
.instrumental-analysis-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.instrumental-analysis-page >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
