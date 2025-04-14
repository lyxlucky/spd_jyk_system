<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <AdvanceReceiptNumberDelSearch
      @search="reload"
      @handleAddConsumeItem="handleAddConsumeItem"
      @handleUdiScanAdd="handleUdiScanAdd"
      :ApplyTempTableDataSearch="ApplyTempTableDataSearch"
      :AdvanceReceiptDelcurrent="current"
      :selection="selection"
      :VarietyConsumeptionDataList="VarietyConsumeptionDataList"
    />
    <ele-pro-table
      ref="table"
      :rowClickCheckedIntelligent="false"
      :rowClickChecked="true"
      height="50%"
      :paginationStyle="paginationStyle"
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
      </template>

      <template v-slot:ACTION="{ row }">
        <el-button size="mini" type="primary" @click="handleUpdateCount(row)"
          >修改数量</el-button
        >
      </template>
    </ele-pro-table>
    <UDIScanAddDialog
      :AdvanceReceiptNumberCurrent="ApplyTempTableDataSearch"
      :AdvanceReceiptDelcurrent="current"
      :visible.sync="UDIScanAddDialogVisiable"
      @udiScanDialogClose="handleClosed"
    >
    </UDIScanAddDialog>
  </div>
</template>

<script>
<<<<<<< HEAD
import UDIScanAddDialog from './UDIScanAddDialog.vue';
import AdvanceReceiptNumberDelSearch from './AdvanceReceiptNumberDelSearch.vue';
import { utils, writeFile } from 'xlsx';
import {
  SerachTempletDeta,
  DeleteTempletDeta
} from '@/api/KSInventory/ApplyTemp';
import { getBdSzYyHisSsa } from '@/api/Task/SurgicalVerification';
import {
  SearchDeliveryVarietie,
  AddVarieties
} from '@/api/HeelBlockConsumables/PlatformConsume';
import AdvanceReceiptNumberTable from './AdvanceReceiptNumberTable.vue';
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
          columnKey: 'index',
          type: 'index',
          label: '序',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'Varietie_Code',
          label: '品种(材料)编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'UDI_TOP',
          label: 'UDI_TOP',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'PRICE',
          label: '价格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          prop: 'Receivable',
          label: '预送数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'Netreceipts',
          label: '剩余数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          slot: 'CONSUME_NUM',
          prop: 'Consume_Count',
          label: '消耗数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          fixed: 'right'
        },
        {
          slot: 'Batch',
          prop: 'Batch',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          slot: 'Batch_Production_Date',
          prop: 'Batch_Production_Date',
          label: '生产日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130,
          formatter: (row, column, cellValue) => {
            return this.$moment(cellValue).format('YYYY-MM-DD');
            // return cellValue.substr(0, 10);
=======
  import UDIScanAddDialog from './UDIScanAddDialog.vue';
  import AdvanceReceiptNumberDelSearch from './AdvanceReceiptNumberDelSearch.vue';
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
            fixed: 'right',
            width: 100
          },
          {
            slot: 'ACTION',
            prop: 'ACTION',
            label: '操作',
            align: 'center',
            fixed: 'right',
            width: 100
>>>>>>> 6299298dce3c3a617262213a6a1853f91df066bd
          }
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
<<<<<<< HEAD
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
    datasource({ page, limit, where, order }) {
      where.supplierId = 0;
      where.deliveryNumber = this.ApplyTempTableData.Delivery_Note_Number;
      let data = getBdSzYyHisSsa({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        }
      );
      return data;
    },
    handleUdiScanAdd() {
      this.UDIScanAddDialogVisiable = true;
    },
    handleAddConsumeItem() {
      if (this.selection.length == 0) {
        return this.$message.error('请选择要添加的品种');
      }

      for (const item of this.selection) {
        if (item?.Consume_Count <= 0)
          return this.$message.error(
            `添加失败，品种 [${item.Varietie_Code}${item.Varietie_Name}] 的消耗数量不能为0`
          );
        if (!item?.Batch)
          return this.$message.error(
            `添加失败，品种 [${item.Varietie_Code}${item.Varietie_Name}] 的生产批号不能为空值`
          );
        if (!item?.Batch_Validity_Period)
          return this.$message.error(
            `添加失败，品种 [${item.Varietie_Code}${item.Varietie_Name}] 的有效日期不能为空值`
          );
        if (!item?.Batch_Production_Date)
          return this.$message.error(
            `添加失败，品种 [${item.Varietie_Code}${item.Varietie_Name}] 的生产日期不能为空值`
          );
      }

      const jsonString = this.selection.map((item) => {
        return {
          Id: item.Id,
          Netreceipts: item.Consume_Count,
          Batch: item.Batch,
          Batch_Validity_Period: item.Batch_Validity_Period,
          Batch_Production_Date: item.Batch_Production_Date,
          Varietie_Name: item.Varietie_Name
        };
      });

      const loading = this.$messageLoading('添加中...');
      AddVarieties({ json: JSON.stringify(jsonString) })
        .then((res) => {
          this.$message.success(!res?.msg ? '处理成功' : res?.msg);
=======
      handleClosed() {
        this.$bus.$emit('UdiScanDialogClosed');
      },
      handleUpdateCount(data) {
        if(data?.TYPE == '1') return this.$message.warning('此类型不允许修改数量');
        //prompt
        this.$prompt('请输入数量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9]*$/,
          inputErrorMessage: '请输入数字'
>>>>>>> 6299298dce3c3a617262213a6a1853f91df066bd
        })
          .then(({ value }) => {
            data.USE_COUNT = value;
            addBdszZqsjMainPsDelUse({USE_COUNT: value, BDSZ_ZQSJ_PS_ID: data.ID})
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
      isUpdateCountEnable(){
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

      this.$bus.$on('AdvanceReceiptNumberTableCurrent',(data) => {
        this.reload(data);
      })

      this.$bus.$on('UdiScanDialogClosed', (current) => {
        this.reload()
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
