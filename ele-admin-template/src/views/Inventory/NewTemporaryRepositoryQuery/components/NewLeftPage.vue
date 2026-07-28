<template>
  <div class="ele-body">
    <el-card shadow="never">
      <user-search @search="reload" @exportData="exportData" />
      <ele-pro-table
        ref="table"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        cache-key="NewTemporaryRepositoryQueryTable"
      >
        <template v-slot:toolbar>
          <span class="pkg-sum">(共 {{ totalPackages }} 包)</span>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './new-leftpage-search.vue';
import {
  NewSearchDeptTwoDefCodes,
  ExportNewDeptTwoDefList
} from '@/api/Inventory/NewTemporaryRepositoryQuery';

export default {
  name: 'NewTemporaryRepositoryLeft',
  components: { UserSearch },
  mounted() {
    this.$bus.$on('handleCommand', this.onDeptChanged);
  },
  beforeDestroy() {
    this.$bus.$off('handleCommand', this.onDeptChanged);
  },
  data() {
    return {
      totalPackages: 0,
      columns: [
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          sortable: 'custom'
        },
        {
          prop: 'Varietie_Code',
          label: '品种(材料)编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 150,
          sortable: 'custom'
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 60
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Batch',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
          sortable: 'custom'
        },
        {
          prop: 'Coefficient',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          width: 60
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          width: 120,
          sortable: 'custom'
        },
        {
          prop: 'Serial_Number',
          label: 'UDI码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
          sortable: 'custom'
        },
        {
          prop: 'Rfid_Code',
          label: 'RFID码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
          sortable: 'custom'
        },
        {
          prop: 'Operate_Person',
          label: '操作人',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'Operate_Time',
          label: '暂借时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 150,
          sortable: 'custom',
          formatter: (row) => {
            if (!row.Operate_Time) return '';
            return String(row.Operate_Time).replace('T', ' ');
          }
        }
      ],
      pageSize: 15,
      pageSizes: [15, 30, 60, 90, 150, 300, 600]
    };
  },
  methods: {
    onDeptChanged() {
      this.$nextTick(() => {
        this.$refs.table?.reload({ page: 1 });
      });
    },
    datasource({ page, limit, where, order }) {
      const deptTwo = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      const w = { ...where, DEPT_TWO_CODE: deptTwo };
      return NewSearchDeptTwoDefCodes({ page, limit, where: w, order }).then((res) => {
        this.totalPackages = res.total;
        return { count: res.total, list: res.result };
      });
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where });
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      const deptTwo = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      this.$refs.table.doRequest(({ order }) => {
        const where = { ...data, DEPT_TWO_CODE: deptTwo };
        ExportNewDeptTwoDefList({ where, order })
          .then((res) => {
            loading.close();
            const headers = [
              '品种(材料)编码',
              '品种全称',
              '型号/规格',
              '单位',
              '生产企业名称',
              '生产批号',
              '系数',
              '定数码',
              'UDI码',
              'RFID码',
              '操作人',
              '暂借时间'
            ];
            const array = [headers];
            (res.result || []).forEach((d) => {
              array.push([
                d.Varietie_Code,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Unit,
                d.Manufacturing_Ent_Name,
                d.Batch,
                d.Coefficient,
                d.Def_No_Pkg_Code,
                d.Serial_Number,
                d.Rfid_Code,
                d.Operate_Person,
                d.Operate_Time ? String(d.Operate_Time).replace('T', ' ') : ''
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: { Sheet1: utils.aoa_to_sheet(array) }
              },
              '暂借记录.xlsx'
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
.pkg-sum {
  margin-left: 8px;
  color: #666;
  font-size: 13px;
}
</style>
