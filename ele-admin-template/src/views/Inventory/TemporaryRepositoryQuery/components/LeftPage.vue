<template>
  <div class="temporary-page spd-page">
    <user-search @search="reload" @exportData="exportData" @returnData="returnData" />
    <div class="spd-panel spd-table-panel temporary-table-panel">
      <div class="spd-panel__head spd-panel__head--split">
        <span>暂存库列表</span>
        <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          class="data-table"
          size="mini"
          :toolbar="false"
          :toolkit="['columns', 'fullscreen']"
          height="calc(100vh - 300px)"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="temporaryRepositoryLeftTable"
        >
          <template v-slot:action="{ row }">
            <el-button type="text" size="mini" @click="openEdit(row)">修改</el-button>
          </template>
        </ele-pro-table>
      </div>
    </div>
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './leftpage-search.vue';
import {
  GetPDAList,
  Temporary_supplyRevert
} from '@/api/Inventory/TemporaryRepositoryQuery';

export default {
  name: 'SystemUser',
  components: {
    UserSearch
  },
  data() {
    return {
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Varietie_Code',
          label: '品种(材料)编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
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
          width: 150,
          formatter: (row) => {
            return row.Operate_Time.replace('T', ' ');
          }
        },
        {
          prop: 'Dept_Two_Up_Shelf_Id',
          width: -2,
          minWidth: -2,
          type: 'space',
          style: 'display: none'
        }
      ],
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      selection: [],
      current: null,
      showEdit: false
    };
  },
  methods: {
    datasource({ page, limit, where, order }) {
      return GetPDAList({ page, limit, where, order }).then((res) => ({
        count: res.total,
        list: res.result
      }));
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    async returnData(where) {
      const selectedData = this.selection;
      if (selectedData.length === 0) {
        this.$message.warning('请选择需要归还的行');
        return;
      }
      try {
        const confirmResult = await this.$confirm(
          '确认要归还吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        if (confirmResult) {
          const responseData = await Temporary_supplyRevert(selectedData);
          this.$message.success(responseData);
          if (responseData.code == 200) {
            this.$message.success(responseData.msg);
            this.reload(where);
          } else {
            this.$message.error(responseData.msg);
          }
        }
      } catch (error) {
        if (error.message && error.message.includes('timeout')) {
          // ignore timeout
        }
      }
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
            const headers = this.columns
              .filter(column => column.prop)
              .map(column => column.label);
            const array = [headers];
            res.result.forEach((d) => {
              const row = this.columns
                .filter(column => column.prop)
                .map(column => {
                  if (column.formatter) {
                    return column.formatter(d);
                  }
                  return d[column.prop];
                });
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.temporary-table-panel {
  flex: 1;
  min-height: 0;
}
</style>
