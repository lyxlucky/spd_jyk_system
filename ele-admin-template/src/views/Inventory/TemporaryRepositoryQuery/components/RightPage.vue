<template>
  <div class="temporary-page spd-page">
    <div class="card-container">
      <div class="left-card">
        <user-search @search="reload" />
        <div class="spd-panel spd-table-panel temporary-table-panel">
          <div class="spd-panel__head">科室列表</div>
          <div class="spd-table-panel__wrap">
            <ele-pro-table
              ref="table1"
              class="data-table"
              size="mini"
              :toolbar="false"
              :toolkit="['columns', 'fullscreen']"
              height="calc(100vh - 390px)"
              :pageSize="pageSize"
              :pageSizes="pageSizes"
              :columns="columns1"
              :datasource="datasource"
              :selection.sync="selection"
              cache-key="temporaryRepositoryRightDeptTable"
              @row-click="handleTable1RowClick"
            />
          </div>
        </div>
      </div>
      <div class="right-card">
        <UserSearch2 @search="reload2" />
        <div class="spd-panel spd-table-panel temporary-table-panel">
          <div class="spd-panel__head">出库明细</div>
          <div class="spd-table-panel__wrap">
            <ele-pro-table
              ref="table2"
              class="data-table"
              size="mini"
              :toolbar="false"
              :toolkit="['columns', 'fullscreen']"
              height="calc(100vh - 380px)"
              :pageSize="pageSize"
              :pageSizes="pageSizes"
              :columns="columns2"
              :datasource="datasource2"
              :selection.sync="selection"
              cache-key="temporaryRepositoryRightDetailTable"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './rightpage-search.vue';
import UserSearch2 from './rightpage-search2.vue';
import {
  GetPDAList,
  initTemporary1,
  initTemporary2
} from '@/api/Inventory/TemporaryRepositoryQuery';

export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserSearch2
  },
  data() {
    return {
      columns1: [
        {
          prop: 'Dept_two_name',
          label: '二级科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        }
      ],
      columns2: [
        {
          prop: 'Varietie_Code',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 120,
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
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
          width: 90
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
          width: 120
        },
        {
          prop: 'Serial_Number',
          label: 'UDI码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'Rfid_Code',
          label: 'RFID码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
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
          width: 150
        },
        {
          prop: 'ID',
          label: 'ID',
          align: 'center',
          showOverflowTooltip: true,
          width: -2,
          minWidth: -2,
          type: 'space',
          style: 'display: none'
        }
      ],
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      selection: [],
      selectedDeptTwoName: ''
    };
  },
  methods: {
    datasource({ page, limit, where, order }) {
      return initTemporary1({ page, limit, where, order }).then((res) => ({
        count: res.total,
        list: res.result
      }));
    },
    datasource2({ page, limit, where, order }) {
      if (this.selectedDeptTwoName) {
        where = { ...where, deptName: this.selectedDeptTwoName };
      }
      return initTemporary2({ page, limit, where, order }).then((res) => ({
        count: res.total,
        list: res.result
      }));
    },
    reload(where) {
      this.$refs.table1.reload({ page: 1, where: where });
    },
    reload2(where) {
      this.$refs.table2.reload({ page: 1, where: where });
    },
    handleTable1RowClick(row) {
      this.selectedDeptTwoName = row.Dept_two_name;
      this.reload2();
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table1.doRequest(({ where, order }) => {
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
            const headers = this.columns1
              .filter(column => column.prop)
              .map(column => column.label);
            const array = [headers];
            res.result.forEach((d) => {
              const row = this.columns1
                .filter(column => column.prop)
                .map(column => d[column.prop]);
              array.push(row);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
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
.temporary-page {
  height: 100%;
  min-height: 0;
}

.card-container {
  display: flex;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.left-card {
  width: 25%;
  min-width: 220px;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right-card {
  flex: 1;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.temporary-table-panel {
  flex: 1;
  min-height: 0;
}
</style>
