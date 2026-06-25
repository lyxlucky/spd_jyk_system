<template>
  <div class="ele-body spd-page dept-returning-goods-page">
    <el-tabs v-model="activeName" type="card" class="dept-returning-tabs" size="mini">
      <el-tab-pane label="二级科室定数包退货" name="first">
        <DeptTwoGoodsDefReturing />
      </el-tab-pane>
      <el-tab-pane label="二级科室散货退货" name="second">
        <div class="dept-returning-placeholder">待开发</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DeptTwoGoodsDefReturing from './DeptTwoGoodsDefReturing';

export default {
  name: 'DeptReturingGoods',
  components: {
    DeptTwoGoodsDefReturing
  },
  data() {
    return {
      activeName: 'first'
    };
  }
};
</script>

<style scoped>
.dept-returning-tabs >>> .el-tabs__header {
  margin-bottom: 10px;
}

.dept-returning-tabs >>> .el-tabs__item {
  height: 32px;
  line-height: 32px;
  font-size: 13px;
}

.dept-returning-placeholder {
  padding: 40px 0;
  text-align: center;
  color: #909399;
  font-size: 13px;
}
</style>
