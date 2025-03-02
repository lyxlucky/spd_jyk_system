<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <!-- 自定义指令实现当pageSizes改变时触发 -->
    <!-- :pageSize="pageSize" :pageSizes="pageSizes" -->
    <PreDeliveredDelSearch @search="reload" @exportData="exportData" @SaveBtn="SaveFun" :ApplyTempTableDataSearch="ApplyTempTableDataSearch" :selection="selection" @showEditReoad="showEditReoad" />
    <ele-pro-table ref="table" height="60vh" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="PreDeliveredDelTable">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <!-- <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button> -->
      </template>

      <!-- 操作列 -->
      <template v-slot:STATE="{ row }">
        <el-tag v-if="row.STATE=='-1' || row.STATE=='2'" type="danger">{{row.CONTRACT_END_TIME}}</el-tag>
        <el-tag v-else-if="row.STATE=='1'" type="warning">{{row.CONTRACT_END_TIME}}</el-tag>
        <el-tag v-else>{{row.CONTRACT_END_TIME}}</el-tag>
      </template>

      <template v-slot:Batch="{ row }">
        <el-input size="mini" v-model="row.Batch"></el-input>
      </template>
      <template v-slot:Batch_Production_Date="{ row }">
        <el-input size="mini" v-model="row.Batch_Production_Date"></el-input>
      </template>
      <template v-slot:Batch_Validity_Period="{ row }">
        <el-input size="mini" v-model="row.Batch_Validity_Period"></el-input>
      </template>
      <template v-slot:Receivable="{ row }">
        <el-input size="mini" v-model="row.Receivable"></el-input>
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
  </div>
</template>

<script>
import PreDeliveredDelSearch from './PreDeliveredDelSearch.vue';
import { utils, writeFile } from 'xlsx';
import {
  SerachTempletDeta,
  DeleteTempletDeta
} from '@/api/KSInventory/ApplyTemp';

import { Save } from '@/api/HeelBlockConsumables/PreDelivered';

import { SearchDeliveryVarietie } from '@/api/HeelBlockConsumables/PreDelivered';
export default {
  name: 'PreDeliveredDelTable',
  props: ['PreDeliveredTableData'],
  components: {
    PreDeliveredDelSearch
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
          minWidth: 120
        },

        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          slot: 'STATE',
          label: '合同效期',
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
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',

          align: 'left',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          slot: 'Batch',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          slot: 'Batch_Production_Date',
          label: '生产日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          slot: 'Batch_Validity_Period',
          label: '失效日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          slot: 'Receivable',
          label: '预送散货数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'ORDER_TYPE',
          label: '订单类型',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 90,
          formatter: (row, column, cellValue) => {
            if (cellValue == 0) {
              return '线下采购';
            } else if (cellValue == 1) {
              return '线上采购';
            }
          }
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
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.deliveryNumberId =
        this.PreDeliveredTableData.Delivery_Note_Number_Id;
      let data = SearchDeliveryVarietie({ page, limit, where, order }).then(
        (res) => {
          for (let i = 0; i < res.result.length; i++) {
            res.result[i].Batch_Production_Date = res.result[
              i
            ].Batch_Production_Date.substring(0, 10);
            res.result[i].Batch_Validity_Period = res.result[
              i
            ].Batch_Production_Date.substring(0, 10);
          }
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      // console.log(this.ApplyTempTableData);
      // console.log(this.$store.state.user.info);
      this.$refs.table.reload({ page: 1, where: where });
    },
    SaveFun() {
      if (this.selection.length <= 0) {
        this.$message.warning('请选择一条数据');
        return;
      }
      console.log(this.selection);
      var arrList = [];
      for (var i = 0; i < this.selection.length; i++) {
        var obj = this.selection[i];
        if (obj.Receivable < 0) {
          this.$store.message.warning(
            `保存失败，品种 [${obj.Varietie_Code}/${obj.Varietie_Name}]的预送散货数量不能小于0`
          );
          return;
        }
        var Array = {};
        Array.Dtl_Id = this.selection[i].Dtl_Id;
        Array.Receivable = this.selection[i].Receivable;
        Array.Batch = this.selection[i].Batch;
        Array.Batch_Production_Date = this.selection[i].Batch_Production_Date;
        Array.Batch_Validity_Period = this.selection[i].Batch_Validity_Period;
        arrList.push(Array);
      }
      var json = JSON.stringify(arrList);

      const loading = this.$messageLoading('保存中...');

      var data = {
        staff: this.$store.state.user.info.Nickname,
        dtlArgsJson: json
      };
      Save(data)
        .then((res) => {
          this.$message.success(res.msg);
          loading.close();
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
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
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where.deliveryNumberId =
          this.PreDeliveredTableData.Delivery_Note_Number_Id;
        SearchDeliveryVarietie({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种(材料)编码',
                '合同效期',
                '品种全称',
                '注册证号',
                '注册证名称',
                '型号/规格',
                '单位',
                '生产企业名称',
                '供应商名称',
                '生产批号',
                '生产日期',
                '失效日期',
                '预送散货数量',
                '订单类型'
              ]
            ];
            res.result.forEach((d) => {
              if (d.ORDER_TYPE == 0) {
                d.ORDER_TYPE = '线下采购';
              } else if (d.ORDER_TYPE == 1) {
                d.ORDER_TYPE = '线上采购';
              } else {
                d.ORDER_TYPE = '';
              }
              array.push([
                d.Varietie_Code,
                d.CONTRACT_END_TIME,
                d.Varietie_Name,
                d.APPROVAL_NUMBER,
                d.PROD_REGISTRATION_NAME,
                d.Specification_Or_Type,
                d.Unit,
                d.Manufacturing_Ent_Name,
                d.Supplier_Name,
                d.Batch,
                d.Batch_Production_Date,
                d.Batch_Validity_Period,
                d.Receivable,
                d.ORDER_TYPE
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
              '病患使用详情.xlsx'
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
      return this.PreDeliveredTableData;
    }
    // pageSize(){
    //   return localStorage.getItem('SerachTempletDetaPageSize')?localStorage.getItem('SerachTempletDetaPageSize'):10
    // }
  },
  watch: {
    ApplyTempTableDataSearch() {
      console.log(this.PreDeliveredTableData);
      var where = {
        deliveryNumberId: this.PreDeliveredTableData.Delivery_Note_Number_Id
      };
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
