<template lang="">
  <div>
    <el-container>
      <el-header height="350">
        <el-card shadow="always">
          <QualificationTopTable></QualificationTopTable>
        </el-card>
      </el-header>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
          <QualificationBottomTable></QualificationBottomTable>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import QualificationTopTable from './components/QualificationTopTable';
  import QualificationBottomTable from './components/QualificationBottomTable';
  export default {
    name: 'QualificationCheck',
    components: {
      QualificationTopTable,
      QualificationBottomTable
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/QualificationTopTable/Current`)
    }
  };
</script>
<style lang=""></style>
