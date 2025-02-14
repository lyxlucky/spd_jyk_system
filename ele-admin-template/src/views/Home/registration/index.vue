<template lang="">
  <div>
    <el-container>
      <el-header height="350">
        <el-card shadow="always">
          <registrationTable></registrationTable>
        </el-card>
      </el-header>
      <el-main style="padding-top: 10px">
        <el-card shadow="always">
          <RegistrationDescription></RegistrationDescription>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import registrationTable from './components/RegistrationTable';
  import RegistrationDescription from './components/RegistrationDescription';
  export default {
    name: 'registration',
    components: {
      registrationTable,
      RegistrationDescription
    },
    data() {
      return {};
    }
  };
</script>
<style lang=""></style>
