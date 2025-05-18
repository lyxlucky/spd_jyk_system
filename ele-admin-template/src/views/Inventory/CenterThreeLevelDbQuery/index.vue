<template>
  <div class="ele-container">
    <CenterThreeLevelDbQueryTable1></CenterThreeLevelDbQueryTable1>
  </div>
</template>

<script>
  import CenterThreeLevelDbQueryTable1 from './components/CenterThreeLevelDbQueryTable1.vue';
  export default {
    name: 'CenterThreeLevelDbQuery',
    components: {
      CenterThreeLevelDbQueryTable1
    },
    data() {
      return {};
    },
    methods: {},
    created() {}
  };
</script>

<style scoped lang="scss">
  @import url('@/styles/common.scss');
</style>
