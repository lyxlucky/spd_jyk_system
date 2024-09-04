<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      height="32vh"
      :initLoad="false"
      :toolkit="[]"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="CentralinventoryPackageBottomRightTable"
    >
      <template v-slot:toolbar>
        <el-select size="mini" v-model="where.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button style="margin-left:10px" :disabled='leftTableSelectionEnable' size="mini" type="primary" @click="handlePrint"
          >上架打印</el-button
        >
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import { ShowVarietieDefCodes,UpShelf } from '@/api/Task/NewCentralinventoryPackage/index';
  import { HOME_HP,BACK_BASE_URL } from '@/config/setting';
  export default {
    name: 'CentralinventoryPackageBottomRightTable',
    data() {
      const defaultWhere = {
        value: '3',
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            prop: 'DEF_NO_PKG_CODE',
            align: 'center',
            label: '定数码'
          },
          {
            prop: 'UDI',
            align: 'center',
            label: 'UDI',
            showOverflowTooltip: true
          }
        ],
        pageSize: 20,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        options: [
          {
            value: '1',
            label: '打印二维码标签'
          },
          {
            value: '2',
            label: '打印条码标签'
          },
          {
            value: '5',
            label: '打印条码标签(简易)'
          },
          {
            value: '3',
            label: '二维码标签(100mm*50mm)'
          },
          {
            value: '9',
            label: '新二维码标签(100mm*50mm)'
          },
          {
            value: '4',
            label: '打印二维码标签(扩容)'
          },
          {
            value: '8',
            label: '打印二维码标签(简洁)'
          },
          {
            value: '6',
            label: '打印条码标签(一维)'
          },
          {
            value: '7',
            label: '一体标签打印'
          }
        ],
        leftTableSelection: []
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = ShowVarietieDefCodes({
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
      onCurrentChange(current) {
        this.current = current;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      handleLeftTableChange() {
        this.$bus.$on(`${this.$route.path}/BottomTableCurrentChange`, (row) => {
          const id = row.Bag_Making_Paln_Batch_Id;
          this.where.id = id;
          this.reload(this.where);
        });
      },
      handleLeftTableSelectionChange() {
        this.$bus.$on(`${this.$route.path}/BottomTableSelectionChange`, (selection) => {
          this.leftTableSelection = selection;
        });
      },
      // TODO 打印
      handlePrint(){
        if(this.leftTableSelection.length == 0) return this.$message.warning("请至少选择一条数据");

        const firstStorageId = this.leftTableSelection[0]?.Storage_Id;
        const allSame = this.leftTableSelection.every((item) => item.Storage_Id === firstStorageId);
        if(!allSame) return this.$message.warning('不能打印不同仓库的品种');

        const printId = this.where.value

        const json = JSON.stringify(this.leftTableSelection.map((item) => {
          return item.Bag_Making_Paln_Batch_Id
        }))

        if(printId == "7"){
          UpShelf({ json:json }).then((res) => {
            if(HOME_HP == 'szlh'){
              window.open(BACK_BASE_URL + "api/CentralWarehouseBagMakingMgmt/GetLHReportById?id=" + printId + "&format=pdf&inline=true&json=" + json);
            }else{
              window.open(BACK_BASE_URL + "api/Commons/GetReportById?id=1&format=pdf&inline=true&json=" + json);
            }
          }).catch((err) => {
            this.$message.error(err)
          }).finally(() => {
            this.reload(this.where);
          })
        }else{
          UpShelf({ json:json }).then((res) => {
            if(HOME_HP == 'szlh'){
              window.open(BACK_BASE_URL + "api/CentralWarehouseBagMakingMgmt/GetLHReportById?id=" + printId + "&format=pdf&inline=true&json=" + json);
            }else if(HOME_HP == 'stzx'){
              if(printId == 6){
                 window.open(BACK_BASE_URL + "api/Commons/GetReportById_zbstzx?id=" + printId + "&format=pdf&inline=true&json=" + json + "&hp=" + HOME_HP);
              }else{
                window.open(BACK_BASE_URL + "api/Commons/GetReportById?id=" + printId + "&format=pdf&inline=true&json=" + json);
              }
            }else{
              if (HOME_HP == "fszxy") {
                this.leftTableSelection.forEach((item) => {
                  window.open(BACK_BASE_URL + "api/Commons/GetReportById?id=" + printId + "&format=pdf&inline=true&json=" + "[" + item.Bag_Making_Paln_Batch_Id + "]");
                })
                return;
              }
              window.open(BACK_BASE_URL + "api/Commons/GetReportById?id=" + printId + "&format=pdf&inline=true&json=" + json);
            }
          }).catch((err) => {
            this.$message.error(err)
          }).finally(() => {
            this.reload(this.where);
          })
        }
      }
    },
    created() {
      this.handleLeftTableSelectionChange();
      this.handleLeftTableChange();
    },
    computed:{
      leftTableSelectionEnable(){
        return this.leftTableSelection.length == 0;
      }
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/BottomTableCurrentChange`);
      this.$bus.$off(`${this.$route.path}/BottomTableSelectionChange`);
    }
  };
</script>
<style lang=""></style>
