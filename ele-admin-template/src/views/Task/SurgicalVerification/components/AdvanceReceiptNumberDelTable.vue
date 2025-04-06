<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- 自定义指令实现当pageSizes改变时触发 -->
    <!-- :pageSize="pageSize" :pageSizes="pageSizes" -->
    <!-- :paginationStyle="paginationStyle" -->
    <AdvanceReceiptNumberDelSearch @search="reload" @exportData="exportData" @handleUdiScanAdd="handleUdiScanAdd"
      @handleAddConsumeItem="handleAddConsumeItem" :ApplyTempTableDataSearch="ApplyTempTableDataSearch"
      :selection="selection" :VarietyConsumeptionDataList="VarietyConsumeptionDataList"
      @showEditReoad="showEditReoad" />
    <!-- :rowClickChecked="true" -->
    <ele-pro-table ref="table" height="25vh" :paginationStyle="paginationStyle" highlight-current-row :stripe="true"
      :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource"
      :selection.sync="selection" @selection-change="onSelectionChange" @current-change="onCurrentChange"
      cache-key="ApplyTempDataTable">
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
        <el-date-picker :disabled="isCurrentRowInputEnabled(row)" size="mini" type="date"
          v-model="row.Batch_Production_Date">2024-12-04</el-date-picker>
      </template>

      <!-- 有效期 -->
      <template v-slot:Batch_Validity_Period="{ row }">
        <el-date-picker size="mini" type="date" v-model="row.Batch_Validity_Period"></el-date-picker>
      </template>

      <!-- 操作列 -->
      <template v-slot:TempletQty="{ row }">
        <el-input style="width: 120px" v-model="row.TempletQty" :min="0" :max="999999999" :step="1" size="mini" />
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
  SerachTempletDeta,
  DeleteTempletDeta
} from '@/api/KSInventory/ApplyTemp';
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
          }
        },
        {
          slot: 'Batch_Validity_Period',
          prop: 'Batch_Validity_Period',
          label: '失效日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130,
          formatter: (row, column, cellValue) => {
            return this.$moment(cellValue).format('YYYY-MM-DD');
          }
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
    datasource({ page, limit, where, order }) {
      where.supplierId = 0;
      where.deliveryNumber = this.ApplyTempTableData.Delivery_Note_Number;
      let data = SearchDeliveryVarietie({ page, limit, where, order }).then(
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
        })
        .catch((err) => {
          this.$message.error(err);
        })
        .finally(() => {
          loading.close();
          this.reload();
          this.$bus.$emit('AdVanceReceiptNumberDelTableReload');
        });
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    remove(row) {
      var data = {
        ID: row.ID
      };

      const loading = this.$messageLoading('删除中...');
      DeleteTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message(res.msg);
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message(err);
        });
    },
    onSelectionChange(selection) {
      this.selection = selection;
      this.$emit('selectionData', selection);
    },
    onCurrentChange(current) {
      this.current = current;
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          UserId: this.$store.state.user.info.ID,
          TempletMasteID: this.ApplyTempTableData.ID
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    isCurrentRowInputEnabled(row) {
      return !this.selection
        .map((item) => {
          return item?.Id;
        })
        .includes(row?.Id);
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.UserId = this.$store.state.user.info.ID;
        where.TempletMasteID = this.ApplyTempTableData.ID;
        SerachTempletDeta({
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
                '模板申领数量',
                '排序',
                '品种全称',
                '规格/型号',
                '单位',
                '结算价',
                '生产企业名称',
                '供应商',
                '散货库存',
                '平均使用数量',
                '包装规格',
                '是否中标'
              ]
            ];
            res.result.forEach((d) => {
              if (d.ZB == 0) {
                d.ZB = '否';
              } else if (d.ZB == 1) {
                d.ZB = '是';
              } else {
                d.ZB = '未知';
              }
              array.push([
                d.VARIETIE_CODE_NEW,
                d.TempletQty,
                d.AUTH,
                d.VarName,
                d.GG,
                d.Unit,
                d.Price,
                d.Manufacturing,
                d.SUPPLIER_NAME,
                d.StockQty,
                d.Day_Consume_Qty,
                d.PAG_TYPE,
                d.ZB
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室申领模板品种.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
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
