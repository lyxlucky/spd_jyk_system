<template lang="">
  <div>
    <el-main style="padding-top: 10px">
      <el-card shadow="always">
        <JyDeviceTable />
      </el-card>
    </el-main>
  </div>
</template>
<script>
  import JyDeviceTable from './components/JyDeviceTable';
  export default {
    name: 'JykDeviceAnalyze',
    components: {
      JyDeviceTable
    },
    created() {
      this.$notify({
          title: '字段含义',
          dangerouslyUseHTMLString: true,
          duration: 0,
          message: '<div style = "color:red;font-size:15px"><span>耗材使用人次数 = 耗材数量 * 理论人次</span>，</br><span>利用率 = （项目数 / 耗材数量） * 理论人次</span></div>'
        });
    }
  };
</script>
<style lang=""></style>
