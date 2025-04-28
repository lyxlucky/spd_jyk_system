<template>
  <div class="ele-box">
    <!-- 数据表格 -->

    <ele-pro-table
      size="mini"
      ref="table"
      height="12vh"
      highlight-current-row
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
      cache-key="ApplyTempDataTable"
    >
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->

        <AdvanceReceiptNumberDelSearch
          @search="reload"
          @handleAddConsumeItem="handleAddConsumeItem"
          @handleUdiScanAdd="handleUdiScanAdd"
          :ApplyTempTableDataSearch="ApplyTempTableDataSearch"
          :AdvanceReceiptDelcurrent="current"
          :selection="selection"
          @handleSelectAdd="handleSelectAdd"
          :VarietyConsumeptionDataList="VarietyConsumeptionDataList"
        />
        
      </template>

      <!-- <template v-slot:ACTION="{ row }">
        <el-button size="mini" type="primary" @click="handleUpdateCount(row)"
          >修改数量</el-button
        >
      </template> -->
    </ele-pro-table>
    <UDIScanAddDialog
      :AdvanceReceiptNumberCurrent="ApplyTempTableDataSearch"
      :AdvanceReceiptDelcurrent="current"
      :visible.sync="UDIScanAddDialogVisiable"
      @udiScanDialogClose="handleClosed"
    >
    </UDIScanAddDialog>

    <SelectionAddDialog
      :visible.sync="selectionDialogVisible"
    ></SelectionAddDialog>
  </div>
</template>

<style scoped></style>

<script>
  import UDIScanAddDialog from './UDIScanAddDialog.vue';
  import AdvanceReceiptNumberDelSearch from './AdvanceReceiptNumberDelSearch.vue';
  import SelectionAddDialog from './SelectionAddDialog';
  import { addBdszZqsjMainPsDelUse } from '@/api/Task/SurgicalVerification';
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
      UDIScanAddDialog,
      SelectionAddDialog
    },
    data() {
      return {
        // 表格列配置
        columns: [
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
            minWidth: 180,
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
            prop: 'TRUE_PS_QTY',
            label: '配送数量',
            align: 'center',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'USE_COUNT',
            label: '使用数量',
            align: 'center',
            width: 100
          },
        ],
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
        UDIScanAddDialogVisiable: false,
        selectionDialogVisible: false
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
      handleClosed() {
        this.$bus.$emit('UdiScanDialogClosed');
      },

      //勾选添加
      handleSelectAdd() {
        this.selectionDialogVisible = true;
      },

      handleUpdateCount(data) {
        if (data?.TYPE == '1')
          return this.$message.warning('此类型不允许修改数量');
        //prompt
        this.$prompt('请输入数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '请输入数字'
        })
          .then(({ value }) => {
            data.USE_COUNT = value;
            addBdszZqsjMainPsDelUse({
              USE_COUNT: value,
              BDSZ_ZQSJ_PS_ID: data.ID
            })
              .then((res) => {})
              .catch((err) => {
                this.$message.error(err);
              })
              .finally(() => {
                this.reload();
              });
            this.$message.success('修改成功');
            this.reload();
          })
          .catch(() => {
            this.$message.info('取消输入');
          });
      },
      handleUdiScanAdd() {
        if (this.ApplyTempTableData == null) {
          return this.$message.warning('请先选择一条数据');
        }
        this.UDIScanAddDialogVisiable = true;
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
        this.$bus.$emit('AdVanceReceiptNumberDelTableCurrentChange', current);
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
      },
      isUpdateCountEnable() {
        return this?.current?.TYPE == '1';
      }
      // pageSize(){
      //   return localStorage.getItem('SerachTempletDetaPageSize')?localStorage.getItem('SerachTempletDetaPageSize'):10
      // }
    },
    watch: {
      // ApplyTempTableDataSearch() {
      //   var where = {
      //     deliveryNumber: this.ApplyTempTableData.Delivery_Note_Number,
      //     SSBH: this.ApplyTempTableData.SSBH
      //   };
      //   this.$refs.table.reload({ page: 1, where: where });
      // }
    },
    mounted() {
      this.$bus.$on('LoadDeliveryConsumedVarietie', (data) => {
        this.VarietyConsumeptionDataList = data.list;
      });

      this.$bus.$on('AdvanceReceiptNumberTableCurrent', (data) => {
        this.reload(data);
      });

      this.$bus.$on('UdiScanDialogClosed', (current) => {
        this.reload();
      });

      this.$bus.$on('SelectionAddDialogRefresh', () => {
        this.reload();
      });
    },
    created() {
      // this.getdatasource();
    },
    beforeDestroy() {
      this.$bus.$off('LoadDeliveryConsumedVarietie');
      this.$bus.$off('AdVanceReceiptNumberDelTableCurrentChange');
    }
  };
</script>
