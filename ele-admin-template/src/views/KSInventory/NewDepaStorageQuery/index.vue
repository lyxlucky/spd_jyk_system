<template lang="">
  <div>
    <el-container>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
          <DepaStorageQueryTable />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import DepaStorageQueryTable from './components/DepaStorageQueryTable';
  export default {
    name: 'NewDepaStorageQuery',
    components: {
      DepaStorageQueryTable
    },
    data() {
      return {};
    },
    methods: {},
    created() {},
    mounted() {}
  };
</script>
<style lang=""></style>
