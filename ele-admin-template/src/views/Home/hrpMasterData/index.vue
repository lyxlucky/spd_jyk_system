<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :span="6">
        <HrpMasterDataTable1
          ref="table1"
          @rowClick="rowClickTable1"
        ></HrpMasterDataTable1>
      </el-col>
      <el-col :span="18">
        <HrpMasterDataTable2 ref="table2"></HrpMasterDataTable2>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // 修改导入语句，去掉花括号
  import HrpMasterDataTable1 from './components/HrpMasterDataTable1';
  import HrpMasterDataTable2 from './components/HrpMasterDataTable2';

  export default {
    components: {
      HrpMasterDataTable1,
      HrpMasterDataTable2 // 添加HrpMasterDataTable2组件注册
    },
    data() {
      return {};
    },
    created() {},
    methods: {
      rowClickTable1(row) {
        // 处理行点击事件
        this.$refs.table2.reload({
          where: row
        }); // 调用子组件的方法加载数据
      },
      handleRowClick(row) {
        // 处理行点击事件
      }
    }
  };
</script>

<style scoped></style>
