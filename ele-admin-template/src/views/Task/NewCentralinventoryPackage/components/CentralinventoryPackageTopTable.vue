<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      height="30vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="CentralinventoryPackageTopTable"
    >
      <!-- 表格工具栏 -->
      <template v-slot:toolbar>
        <CentrallinventoryPackageTopTableSearch :selection="selection" @handleAdd="handleAdd" @handleSearch="reload" />
      </template>

      <!-- 系数 -->
      <template v-slot:Coefficients="{ row }">
        <el-select size="mini" v-model="row.Coefficients[0]" placeholder="请选择">
          <el-option
            v-for="item in row.Coefficients"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </template>

      <!-- 制包数量 -->
      <template v-slot:makeQuantity="{ row }">
        <el-input
          size="mini"
          v-model="row.makeQuantity"
          :value="row.makeQuantity || 0"
          :disabled="!selection.map(item => item.Varietie_Id).includes(row.Varietie_Id)"
          placeholder="请输入制包数量"
        />
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { SearchVarietie,LockVarietieQuantity } from '@/api/Task/NewCentralinventoryPackage/index';
  import CentrallinventoryPackageTopTableSearch from './CentrallinventoryPackageTopTableSearch';
  export default {
    name: 'CentralinventoryPackageTopTable',
    components: {
      CentrallinventoryPackageTopTableSearch
    },
    data() {
      const defaultWhere = {};
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
            prop: 'Varietie_Code',
            label: '品种(材料)编码',
            minWidth: 100,
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
            minWidth: 220,
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
            prop: 'Supply_Price',
            align: 'center',
            label: '价格',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'Manufacturing_Ent_Name',
            align: 'center',
            label: '生产企业名称',
            minWidth: 160,
            showOverflowTooltip: true
          },
          {
            prop: 'Batch',
            label: '生产批号',
            minWidth: 100,
            sortable: true,
            showOverflowTooltip: true
          },
          {
            prop: 'Batch_Validity_Period',
            label: '失效日期',
            minWidth: 90,
            formatter: (d, column, cellValue) => {
              var bvp_date = d.Batch_Validity_Period.substr(0, 10);
              var this_date = new Date(bvp_date).getTime();
              var nowDate = new Date().getTime();
              if (this_date - 2592000000 < nowDate) {
                return (
                  d.Batch_Validity_Period.substr(0, 10) +
                  "<i class='centralPKG_yellow'></i>"
                );
              } else {
                return d.Batch_Validity_Period.substr(0, 10);
              }
            },
            sortable: true,
            showOverflowTooltip: true
          },
          {
            prop: 'Supplier_Name',
            label: '供应商',
            minWidth: 160,
            showOverflowTooltip: true
          },
          {
            slot: 'Coefficients',
            label: '系数',
            minWidth: 80,
            showOverflowTooltip: true
          },
          {
            prop: 'Up_Quantity',
            label: '可用散货数量',
            minWidth: 90,
            showOverflowTooltip: true
          },
          {
            slot: 'makeQuantity',
            label: '制包数量',
            minWidth: 90,
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
        let data = SearchVarietie({
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
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      handleAdd(){
        if(this.selection.length == 0) return this.$message.warning('请至少选择一条数据');
        const firstStorageId = this.selection[0]?.Storage_Id;
        const allSame = this.selection.every((item) => item.Storage_Id === firstStorageId);
        if(!allSame) return this.$message.warning('添加失败，不能添加不同仓库的品种');
        this.selection.forEach((item) => {
            if(item.makeQuantity <= 0) return this.$message.warning(`制包失败，品种${item.Varietie_Code} ${item.Varietie_Name}的制包数量不能为0`);
            const batch_validity_period = item.Batch_Validity_Period.substr(0, 10);
            const batch_validity_period_date = new Date(batch_validity_period).getTime();
            const nowDate = new Date().getTime();
            if ((batch_validity_period_date - 432000000) < nowDate) {
                this.$message.warning(`制包失败，品种${item.Varietie_Code} ${item.Varietie_Name}的有效期低于5天`);
            }
        })
        const json = this.selection.map((item) => {
           return "{" + item.Up_Shelf_Id + "," + item.Hidden_Cofficient + "," + item.Hidden_Quantity + "}"
        })
        LockVarietieQuantity({json:json}).then((res) => {
            this.$message.success(res.msg);
            this.$bus.$emit(`${this.$route.path}/TopTableAddItemDone`)
        }).finally(() => {
            this.reload();
        })
      }
    }
  };
</script>
<style lang=""></style>
