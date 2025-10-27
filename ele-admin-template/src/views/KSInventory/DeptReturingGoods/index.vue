<template>
  <div class="dept-returning-goods-container">
    <el-tabs 
      v-model="activeName" 
      type="border-card"
      class="dept-tabs"
    >
      <el-tab-pane label="二级科室定数包退货" name="first">
        <DeptTwoGoodsDefReturing/>
      </el-tab-pane>
      <el-tab-pane label="二级科室散货退货" name="second">
        <div style="padding: 20px; text-align: center; color: #909399;">待开发</div>
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
      activeName: 'first' // 默认选中第一个tab
    };
  }
};
</script>

<style lang="scss" scoped>
.dept-returning-goods-container {
  padding: 20px;
  height: calc(100vh - 100px);
  overflow: auto;

  .dept-tabs {
    ::v-deep .el-tabs__header {
      margin: 0;
      background-color: #f5f7fa;
      border-radius: 4px 4px 0 0;
      
      .el-tabs__nav {
        border: none;
        display: flex;
        width: 100%;
        
        .el-tabs__item {
          flex: 1;
          text-align: center;
          height: 50px;
          line-height: 50px;
          font-size: 15px;
          font-weight: 500;
          color: #606266;
          position: relative;
          transition: all 0.3s;
          
          &.is-active {
            color: #409eff;
            background-color: #fff;
            border-bottom: 3px solid #409eff;
            font-weight: 600;
          }
          
          &:hover {
            color: #409eff;
            background-color: #f0f9ff;
          }
          
          &:not(.is-active) {
            border-bottom: 1px solid transparent;
          }
        }
        
        .el-tabs__active-bar {
          display: none;
        }
      }
      
      .el-tabs__nav-wrap::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: #e4e7ed;
        z-index: 1;
      }
    }
    
    ::v-deep .el-tabs__content {
      padding: 0;
      margin-top: 0;
      background-color: #fff;
      border-radius: 0 0 4px 4px;
    }
  }
}

// 响应式适配
@media (max-width: 768px) {
  .dept-returning-goods-container {
    padding: 10px;
    
    .dept-tabs {
      ::v-deep .el-tabs__header {
        .el-tabs__item {
          height: 45px;
          line-height: 45px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
