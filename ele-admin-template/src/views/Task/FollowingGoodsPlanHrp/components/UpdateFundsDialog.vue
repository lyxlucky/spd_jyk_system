<template lang="">
  <ele-modal
    :destroy-on-close="true"
    width="500px"
    :visible="visible"
    :close-on-click-modal="false"
    title="修改资金来源"
    @update:visible="updateVisible"
  >
    <div style="justify-content: center; display: flex">
      <el-select v-model="fundsType" placeholder="请选择资金来源">
        <el-option label="自筹资金" value="1" />
        <el-option label="政府补助" value="2" />
        <el-option label="科教项目" value="3" />
        <el-option label="财政+自筹" value="4" />
        <el-option label="财政转款(发改委)" value="5" />
        <el-option label="财政转款(开办费用)" value="6" />
        <el-option label="财政资金" value="7" />
      </el-select>
    </div>
    <template v-slot:footer>
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button size="mini" type="primary" @click="handleConfirmFunds"
        >确定</el-button
      >
    </template>
  </ele-modal>
</template>
<script>
  export default {
    name: 'UpdateFundsDialog',
    props: ['visible'],
    data() {
      return {
        fundsType: '1'
      };
    },
    methods: {
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      handleConfirmFunds() {
        this.$emit('handleConfirmFunds', this.fundsType);
      }
    }
  };
</script>
<style lang=""></style>
