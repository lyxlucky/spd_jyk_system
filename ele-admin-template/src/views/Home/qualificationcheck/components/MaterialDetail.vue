<template lang="">
  <div>
    <el-descriptions title="业务员信息" :column="3" border>
      <el-descriptions-item label="业务员姓名">{{current?.Contact_Person ? current?.Contact_Person : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="业务员身份证号">{{current?.YWY_PEO_ID ? current?.YWY_PEO_ID : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="业务员联系电话">{{current?.Contact_Phone ? current?.Contact_Phone : '暂无'}}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="供应商信息" :column="3" border>
      <!-- 先判断是否未空值，再判断类型 -->
      <el-descriptions-item label="供应商性质">{{(current?.Supplier_Nature ? current?.Supplier_Nature : '暂无') == '0' ? '经营型' : '生产型' }}</el-descriptions-item>
      <el-descriptions-item label="供应商编码">{{current?.Supplier_Code ? current?.Supplier_Code : '暂无'}}</el-descriptions-item>
      <!-- as the same -->
      <el-descriptions-item label="冷链器械供应条件">{{(current?.Cold_Chain_Apparatus_Supply ? current?.Cold_Chain_Apparatus_Supply : '暂无') == '0' ? '具备' : '不具备'}}</el-descriptions-item>
      <!-- as the same -->
      <el-descriptions-item label="停止配送">{{(current?.STOP_SEND ? current?.STOP_SEND : '暂无') == 1 ? '是' : '否' }}</el-descriptions-item>
      <el-descriptions-item label="社会统一信用代码">{{current?.SOCIAL_CREDIT_CODE ? current?.SOCIAL_CREDIT_CODE : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="企业电话">{{current?.Contact_Phone2 ? current?.Contact_Phone2 : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="企业地址">{{current?.Licence_File_Full_Name ? current?.Licence_File_Full_Name : '暂无'}}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
  export default {
    name: 'MaterialDetail',
    props: ['current'],
    data() {
      return {};
    },
    methods: {},
    created(){
    }
  };
</script>
<style lang=""></style>
