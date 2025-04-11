<template>
  <div>
    <ele-pro-table
      ref="table"
      size="mini"
      :columns="columns"
      height="50vh"
      @selection-change="onSelectionChange"
      highlight-current-row
      :datasource="datasource"
    >
      <template v-slot:ACTION="{ row }">
        <el-input-number
          v-model="row.ADD_QTY"
          :min="0"
          :max="9999999"
          size="mini"
          style="width: 100px"
        ></el-input-number>
      </template>
    </ele-pro-table>
    <el-form size="mini">
      <el-form-item>
        <el-button
          type="primary"
          :disabled="selection.length == 0"
          size="mini"
          @click="handleAddGoodsUpShelf"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    searchVarietieBatchIds,
    addBdszZqsjMainPsDel
  } from '@/api/Task/OPSConsumables';
  export default {
    name: 'OPSPlanConsumablesOperateTable',
    components: {},
    props: {
      currentRow: {
        type: Object,
        default: () => {}
      }
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
            prop: 'Name',
            label: '库区名称',
            align: 'center',
            width: 120
          },
          {
            prop: 'Varietie_Name',
            label: '品名',
            align: 'center',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Code_New',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'Varietie_Code',
            label: '品种编码ID',
            align: 'center',
            width: 120
          },
          {
            prop: 'Batch_Id',
            label: '批次号',
            align: 'center',
            width: 120
          },
          {
            prop: 'Batch',
            label: '批次',
            align: 'center',
            width: 100
          },
          {
            prop: 'Supply_Price',
            label: '结算价',
            align: 'center',
            width: 100
          },
          {
            prop: 'Contract_Code',
            label: '合同编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'Supplier_Code',
            label: '供应商编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'Supplier_Name',
            label: '供应商名称',
            align: 'center',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'Up_Shelf_Quantity',
            label: '上架数量',
            align: 'center',
            width: 100
          },
          {
            prop: 'Batch_Production_Date',
            label: '生产日期',
            align: 'center',
            width: 120,
            formatter: (row) => {
              return row.Batch_Production_Date
                ? this.$moment(row.Batch_Production_Date).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'Batch_Validity_Period',
            label: '有效期',
            align: 'center',
            width: 120,
            formatter: (row) => {
              return row.Batch_Validity_Period
                ? this.$moment(row.Batch_Validity_Period).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'Priority_Weight',
            label: '优先权重',
            align: 'center',
            width: 100
          },
          {
            slot: 'ACTION',
            prop: 'ACTION',
            align: 'center',
            label: '数量',
            width: 150
          }
        ],
        selection: [],
        ParentCurrentRow: null
      };
    },
    methods: {
      //确定
      sure() {
        // addBdszZqsjMainPsDel(this.$refs.table.tableData).then((data) => {
        //   this.$message.success(data.msg);
        // });
      },
      datasource({ page, limit, where }) {
        // 这里不实现具体方法，仅返回空数据结构
        where.varietie = this.currentRow.VARIETIE_CODE;
        return searchVarietieBatchIds({ where })
          .then((data) => {
            const resultList = (data.result || []).map((item) => ({
              ...item,
              ADD_QTY: 0
            }));
            return {
              list: resultList,
              count: data.total
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      reload() {
        this.$refs.table.reload({ page: 1 });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      handleAddGoodsUpShelf() {
        const loading = this.$messageLoading('提交中...');
        const jsonData = this.selection.map((item) => {
          return {
            BDSZ_ZQSJ_ID: this.ParentCurrentRow.ID,
            PS_COUNT: item.ADD_QTY,
            BATCH_ID: item.Batch_Id,
            Token: sessionStorage.Token,
            TYPE:"0"
          };
        });
        addBdszZqsjMainPsDel(jsonData)
          .then((data) => {
            this.$message.success(data.msg);
            this.$emit("OPSPlanConsumablesOperateCloseDialog")
          })
          .catch((err) => {
            this.$message.error(err.msg);
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    mounted() {
      this.$bus.$on('OPSPlanConsumablesTableRowClick', (row) => {
        console.log(row);
        this.ParentCurrentRow = row;
      });
    },
    beforeDestroy() {
      this.$bus.$off('OPSPlanConsumablesTableRowClick');
    }
  };
</script>

<style scoped></style>
