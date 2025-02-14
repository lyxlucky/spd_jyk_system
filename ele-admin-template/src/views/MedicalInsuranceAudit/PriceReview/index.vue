<template lang="">
  <div>
    <el-container>
      <el-main>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-card shadow="always">
              <div slot="header" class="clearfix">
                <span>申请信息</span>
              </div>
              <!-- 组件 -->
              <priceReviewLeftTable />
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card shadow="always">
              <div slot="header" class="clearfix">
                <span>明细信息</span>
              </div>
              <!-- 组件 -->
              <PriceReviewRightTable />
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import priceReviewLeftTable from './components/PriceReviewLeftTable';
  import PriceReviewRightTable from './components/PriceReviewRightTable';
  export default {
    components: {
      priceReviewLeftTable,
      PriceReviewRightTable
    },
    data() {
      return {};
    }
  };
</script>
<style lang=""></style>
