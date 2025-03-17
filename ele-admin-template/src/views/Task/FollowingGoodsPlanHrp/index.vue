<template>
  <div class="ele-body">
    <el-row>
      <el-col :span="8">
        <StatusSummaryStatistics ref="table1" @onClickRow="clickTableRow1" />
      </el-col>
      <el-col :span="16">
        <StockPlanItemDetail ref="table2" :currentTableRow="currentTableRow" :currentTableRow3="currentTableRow3"  @onClickRow="clickTableRow2"/>
      </el-col>
    </el-row>
    <el-row>
      
      <el-col :span="24">
        <StockPlanOrderList ref="table3" :currentTableRow2="currentTableRow2" :currentTableRow="currentTableRow" @onRowClick="clickTableRow3"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import StatusSummaryStatistics from './components/StatusSummaryStatistics.vue'
import StockPlanItemDetail from './components/StockPlanItemDetail.vue'
import StockPlanOrderList from './components/StockPlanOrderList.vue'
export default {
  name: 'FollowingGoodsPlanHrp',
  components: {
    StatusSummaryStatistics,
    StockPlanItemDetail,
    StockPlanOrderList
  },
  data() {
    return {
      //表1选中行
      currentTableRow: {},
      //表2选中行
      currentTableRow2: {},
      // 表3选中行
      currentTableRow3: {},
    }
  },
  methods: {
    clickTableRow1(row) {
      this.currentTableRow = row
      this.currentTableRow2 = {}
      this.currentTableRow3 = {}
      this.$refs.table2.handleSearch()
      this.$refs.table3.handleSearch()
    },
    clickTableRow2(row) {
      // console.log(row)
      this.currentTableRow2 = row
      this.$refs.table3.handleSearch()
    },
    clickTableRow3(row) {
      this.currentTableRow3 = row
      this.$refs.table2.handleSearch()
    },

  }
}
</script>

<style scoped>

</style>