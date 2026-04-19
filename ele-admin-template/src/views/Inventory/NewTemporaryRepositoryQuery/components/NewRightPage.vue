<template>
  <div class="ele-body">
    <div class="card-container">
      <div class="left-card">
        <el-card shadow="never">
          <user-search @search="reload" />
          <ele-pro-table
            ref="table1"
            :pageSize="pageSize1"
            :pageSizes="pageSizes1"
            :columns="columns1"
            :datasource="datasource"
            :selection.sync="selection"
            cache-key="NewTemporaryRepositoryQueryT1"
            @row-click="handleTable1RowClick"
          >
            <template v-slot:toolbar></template>
          </ele-pro-table>
        </el-card>
      </div>
      <div class="right-card">
        <el-card shadow="never">
          <UserSearch2 @search="reload2" @exportData="exportHistoryTmp" />
          <ele-pro-table
            ref="table2"
            :pageSize="pageSize2"
            :pageSizes="pageSizes2"
            :columns="columns2"
            :datasource="datasource2"
            :selection.sync="selection"
            cache-key="NewTemporaryRepositoryQueryT2"
          >
            <template v-slot:toolbar></template>
          </ele-pro-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import UserSearch from '../../TemporaryRepositoryQuery/components/rightpage-search.vue';
import UserSearch2 from '../../TemporaryRepositoryQuery/components/rightpage-search2.vue';
import {
  initTemporary1,
  initTemporary2,
  exportHistoryTmpFormPost
} from '@/api/Inventory/NewTemporaryRepositoryQuery';
import { BACK_BASE_URL } from '@/config/setting';

export default {
  name: 'NewTemporaryRepositoryRight',
  components: {
    UserSearch,
    UserSearch2
  },
  data() {
    return {
      selectedDeptTwoName: '',
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
          width: 90
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
          minWidth: 100
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 50
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
        }
      ],
      pageSize1: 10,
      pageSizes1: [10, 20, 50, 100, 9999999],
      pageSize2: 22,
      pageSizes2: [22, 50, 90, 150, 300, 600],
      selection: []
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
      const w = { ...where };
      if (this.selectedDeptTwoName) {
        w.deptName = this.selectedDeptTwoName;
      }
      return initTemporary2({ page, limit, where: w, order }).then((res) => ({
        count: res.total,
        list: res.result
      }));
    },
    reload(where) {
      this.$refs.table1.reload({ page: 1, where });
    },
    reload2(where) {
      this.$refs.table2.reload({ page: 1, where });
    },
    handleTable1RowClick(row) {
      this.selectedDeptTwoName = row.Dept_two_name;
      this.$nextTick(() => {
        if (this.$refs.table2) {
          this.$refs.table2.reload({ page: 1 });
        }
      });
    },
    async exportHistoryTmp(where) {
      const loading = this.$messageLoading('正在导出...');
      try {
        const res = await exportHistoryTmpFormPost({
          condition: where.temporary2_search_inp || '',
          deptName: this.selectedDeptTwoName || '',
          page: 1,
          size: 99999,
          field: '',
          order: '',
          startDate: where.start_time || '',
          endDate: where.end_time || ''
        });
        loading.close();
        const data = res.data;
        if (data.code == 301) {
          this.$message.error(data.msg);
          return;
        }
        if (data.code == 200) {
          if (data.msg === '无数据导出') {
            this.$message.warning(data.msg);
            return;
          }
          const raw = String(data.msg || '');
          const file = raw.replace(/^导出成功-/, '');
          const url = `${BACK_BASE_URL}/Excel/files/${encodeURIComponent(file)}`;
          const form = document.createElement('form');
          form.method = 'get';
          form.action = url;
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          this.$message.success('导出成功');
        } else {
          this.$message.error(data.msg || '导出失败');
        }
      } catch (e) {
        loading.close();
        this.$message.error(e.message || '导出失败');
      }
    }
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  gap: 1mm;
  height: 100%;
}

.left-card {
  width: 25%;
  height: 100%;
}

.right-card {
  width: calc(75% - 1mm);
  height: 100%;
}

.ele-pro-table {
  height: 75vh;
}
</style>
