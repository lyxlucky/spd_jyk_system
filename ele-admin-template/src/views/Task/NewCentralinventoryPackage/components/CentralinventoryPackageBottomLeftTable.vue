<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      @selection-change="onSelectionChange"
      height="30vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :current.sync="current"
      :selection.sync="selection"
      cache-key="CentralinventoryPackageBottomLeftTable"
    >
      <template v-slot:Bag_Making_State="{ row }">
        <el-tag v-if="row.Bag_Making_State == 1" size="mini" type="success"
          >已制包</el-tag
        >
        <el-tag v-if="row.Bag_Making_State == 0" size="mini" type="danger"
          >未制包</el-tag
        >
        <el-tag v-else size="mini" type="warning">未知项</el-tag>
      </template>

      <!-- 表格工具栏 -->
      <template v-slot:toolbar>
        <CentralinventoryPackageBottomLeftTableSearch :selection="selection" @handleDelete="handleDelete" @handleAdd="reload" />
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { LoadLockedVarieties,UnlockVarietieQuantity } from '@/api/Task/NewCentralinventoryPackage/index';
  import CentralinventoryPackageBottomLeftTableSearch from './CentralinventoryPackageBottomLeftTableSearch';
  export default {
    name: 'CentralinventoryPackageBottomLeftTable',
    components: {
        CentralinventoryPackageBottomLeftTableSearch
    },
    data() {
      const defaultWhere = {
        search: ''
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center'
          },
          {
            prop: 'Name',
            label: '仓库名称',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'Bag_Maker',
            label: '制包人',
            minWidth: 70,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Code',
            label: '品种(材料)编码',
            minWidth: 90,
            showOverflowTooltip: true
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            minWidth: 115,
            showOverflowTooltip: true
          },
          {
            prop: 'Unit',
            align: 'center',
            label: '单位',
            minWidth: 50,
            showOverflowTooltip: true
          },
          {
            prop: 'Manufacturing_Ent_Name',
            align: 'center',
            label: '生产企业名称',
            minWidth: 140,
            showOverflowTooltip: true
          },
          {
            prop: 'Batch',
            label: '生产批号',
            minWidth: 75,
            showOverflowTooltip: true
          },
          {
            prop: 'Batch_Production_Date',
            label: '生产日期',
            minWidth: 75,
            showOverflowTooltip: true,
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'Batch_Validity_Period',
            label: '失效日期',
            minWidth: 75,
            showOverflowTooltip: true,
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD')
                : '';
            }
          },
          {
            prop: 'Supplier_Name',
            label: '供应商',
            minWidth: 140,
            showOverflowTooltip: true
          },
          {
            prop: 'Coefficient',
            label: '系数',
            minWidth: 50,
            showOverflowTooltip: true
          },
          {
            prop: 'Bag_Making_Number',
            label: '制包单号',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'Pack_Plan_Quantity',
            label: '制包数量',
            minWidth: 60,
            showOverflowTooltip: true
          },
          {
            slot: 'Bag_Making_State',
            label: '是否制包',
            align: 'center',
            minWidth: 60,
            showOverflowTooltip: true
          }
        ],
        pageSize: 20,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = LoadLockedVarieties({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      onCurrentChange(row) {
        this.$bus.$emit(`${this.$route.path}/BottomTableCurrentChange`, row);
        this.current = row;
      },
      onSelectionChange(selection){
        this.$bus.$emit(`${this.$route.path}/BottomTableSelectionChange`, selection);
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      lisentAddItemDone() {
        this.$bus.$on(`${this.$route.path}/TopTableAddItemDone`, () => {
          this.reload(this.where);
        });
      },
      handleDelete(){
        if(this.selection.length == 0) return this.$message.warning("请至少选择一条数据");
        const loading = this.$messageLoading('正在处理...');
        const json = this.selection.map((item) => {
           return "{" + item.Bag_Making_Paln_Batch_Id + "}"
        }) 
        UnlockVarietieQuantity({json:json}).then((res) => {
            this.$message.success(res.msg);
        }).catch((err) => {
            this.$message.error(err);
        }).finally(() => {
            loading.close();
            this.reload(this.where);
        })
      }
    },
    created() {
      this.lisentAddItemDone();
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/TopTableAddItemDone`);
    }
  };
</script>
<style lang=""></style>
