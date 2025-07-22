<template lang="">
  <div>
    <el-card class="box-card">
      <!-- tab页面 -->
      <el-tabs :stretch="true" v-model="activeName">
        <el-tab-pane label="二级科室定数包退货" name="first">
          <DeptTwoGoodsDefReturing/>
        </el-tab-pane>
        <!-- <el-tab-pane label="二级科室散货退货" name="second"> </el-tab-pane> -->
      </el-tabs>
    </el-card>
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
        activeName: 'first' // 默认选中第一个tab
      };
    }
  };
</script>
<style lang=""></style>
