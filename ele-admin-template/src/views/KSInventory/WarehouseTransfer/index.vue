<template lang="">
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-card shadow="always">
              <div slot="header" class="clearfix">
                <span>调库主单列表</span>
              </div>
              <!-- 组件 -->
              <WarehouseTransferLeftTable />
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card shadow="always">
              <div slot="header" class="clearfix">
                <span>调库品种明细列表</span>
              </div>
             <!-- 组件 -->
              <WarehouseTransferMiddleTable />
            </el-card>
          </el-col>
          <el-col :span="7">
            <el-card shadow="always">
              <div slot="header" class="clearfix">
                <span>调库定数包列表</span>
              </div>
              <!-- 组件 -->
               <WarehouseTransferRightTable />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import WarehouseTransferLeftTable from './components/WarehouseTransferLeftTable'
import WarehouseTransferMiddleTable from './components/WarehouseTransferMiddleTable'
import WarehouseTransferRightTable from './components/WarehouseTransferRightTable'
  export default {
    name: 'WarehouseTransferIndex',
    components: {
      WarehouseTransferLeftTable,
      WarehouseTransferMiddleTable,
      WarehouseTransferRightTable
    },
    beforeDestroy(){
      this.$bus.$off('QuoteTemplateAllDone')
    }
  };
</script>
<style lang=""></style>
