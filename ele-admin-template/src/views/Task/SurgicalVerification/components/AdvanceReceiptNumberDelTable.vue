<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- 自定义指令实现当pageSizes改变时触发 -->
    <!-- :pageSize="pageSize" :pageSizes="pageSizes" -->
    <!-- :paginationStyle="paginationStyle" -->
    <AdvanceReceiptNumberDelSearch @search="reload" @handleAddConsumeItem="handleAddConsumeItem" :ApplyTempTableDataSearch="ApplyTempTableDataSearch" :selection="selection" :VarietyConsumeptionDataList="VarietyConsumeptionDataList" />
    <!-- :rowClickChecked="true" -->
    <ele-pro-table ref="table" :rowClickCheckedIntelligent="false" :rowClickChecked="true" height="60vh" :paginationStyle="paginationStyle" highlight-current-row :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" @current-change="onCurrentChange" cache-key="ApplyTempDataTable">
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
      </template>

      <!-- 消耗数量 -->
      <template v-slot:CONSUME_NUM="{ row }">
        <el-input :disabled="isCurrentRowInputEnabled(row)" size="mini" v-model="row.Consume_Count"></el-input>
      </template>

      <!-- 批号 -->
      <template v-slot:Batch="{ row }">
        <el-input :disabled="isCurrentRowInputEnabled(row)" size="mini" v-model="row.Batch"></el-input>
      </template>

      <!-- 生产日期 -->
      <template v-slot:Batch_Production_Date="{ row }">
        <el-date-picker :disabled="isCurrentRowInputEnabled(row)" size="mini" type="date" v-model="row.Batch_Production_Date">2024-12-04</el-date-picker>
      </template>

      <!-- 有效期 -->
      <template v-slot:Batch_Validity_Period="{ row }">
        <el-date-picker size="mini" type="date" v-model="row.Batch_Validity_Period"></el-date-picker>
      </template>

      <!-- 操作列 -->
      <template v-slot:USE_COUNT="{ row }">
        <el-input style="width: 70px" v-model="row.USE_COUNT" type="number" :min="0" :max="999999999" :step="1" size="mini" />
      </template>
      <template v-slot:AUTH="{ row }">
        <el-input style="width: 120px" v-model="row.AUTH" :min="0" :max="999999999" :step="1" size="mini" />
      </template>
      <template v-slot:action="{ row }">
        <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
      </template>
    </ele-pro-table>
    <UDIScanAddDialog :AdvanceReceiptNumberCurrent="ApplyTempTableData" :visible.sync="UDIScanAddDialogVisiable">
    </UDIScanAddDialog>
  </div>
</template>

<script>
import UDIScanAddDialog from './UDIScanAddDialog.vue';
import AdvanceReceiptNumberDelSearch from './AdvanceReceiptNumberDelSearch.vue';
import { utils, writeFile } from 'xlsx';

import {
  getBdszZgsjMainPsDel,
  updateBdszZqsjMainPsDelUse
} from '@/api/Task/SurgicalVerification';
export default {
  name: 'ApplyTempDataTable',
  props: ['ApplyTempTableData'],
  components: {
    AdvanceReceiptNumberDelSearch,
    UDIScanAddDialog
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          width: 130
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          width: 120
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          minWidth: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          width: 150,
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          width: 80
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          width: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          slot: 'USE_COUNT',
          label: '使用数量',
          align: 'center',
          fixed: 'right',
          width: 100
        }
      ],
      paginationStyle: {
        height: '18px',
        padding: '0px 0px 5px 0px',
        'margin-top': '-5px'
      },
      toolbar: false,
      pageSize: 50,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: [],
      VarietyConsumeptionDataList: [],
      UDIScanAddDialogVisiable: false
    };
  },
  methods: {
    /* 表格数据源 */
    async datasource({ page, limit, where, order }) {
      console.log(this.ApplyTempTableData);
      where.BDSZ_ZQSJ_ID = this.ApplyTempTableData.ID;
      let data = getBdszZgsjMainPsDel({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.data
          };
          return tData;
        }
      );
      return data;
    },

    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },

    onSelectionChange(selection) {
      this.selection = selection;
      this.$emit('selectionData', selection);
    },
    onCurrentChange(current) {
      this.current = current;
    },

    handleAddConsumeItem() {
      const loading = this.$messageLoading('修改中...');
      updateBdszZqsjMainPsDelUse(this.selection)
        .then((res) => {
          this.reload();
          this.$message.success(res.msg);
        })
        .catch((err) => {
          this.$message.error(err);
        })
        .finally(() => {
          loading.close();
        });
    }
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ApplyTempTableData;
    }
    // pageSize(){
    //   return localStorage.getItem('SerachTempletDetaPageSize')?localStorage.getItem('SerachTempletDetaPageSize'):10
    // }
  },
  watch: {
    ApplyTempTableDataSearch() {
      var where = {
        deliveryNumber: this.ApplyTempTableData.Delivery_Note_Number
      };
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  mounted() {
    this.$bus.$on('LoadDeliveryConsumedVarietie', (data) => {
      this.VarietyConsumeptionDataList = data.list;
    });
  },
  created() {
    // this.getdatasource();
  },
  beforeDestroy() {
    this.$bus.$off('LoadDeliveryConsumedVarietie');
    this.$bus.$off('AdVanceReceiptNumberDelTableReload');
  }
};
</script>
