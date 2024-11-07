<template lang="">
  <div>
    <el-descriptions title="供应商信息" :column="3" border>
      <!-- 先判断是否未空值，再判断类型 -->
      <el-descriptions-item label="供应商名称" :span='1'>{{(current?.Supplier_Name ? current?.Supplier_Name : '暂无')}}</el-descriptions-item>
      <el-descriptions-item label="社会统一信用代码" :span='2'>{{current?.SOCIAL_CREDIT_CODE ? current?.SOCIAL_CREDIT_CODE : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="企业地址">{{current?.Licence_File_Full_Name ? current?.Licence_File_Full_Name : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="企业电话">{{current?.Contact_Phone2 ? current?.Contact_Phone2 : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="供应商性质">{{(current?.Supplier_Nature ? current?.Supplier_Nature : '暂无') == '0' ? '经营型' : '生产型' }}</el-descriptions-item>
      <el-descriptions-item label="供应商编码">{{current?.Supplier_Code ? current?.Supplier_Code : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="冷链器械供应条件">{{(current?.Cold_Chain_Apparatus_Supply ? current?.Cold_Chain_Apparatus_Supply : '暂无') == '0' ? '具备' : '不具备'}}</el-descriptions-item>
      <el-descriptions-item label="停止配送">{{(current?.STOP_SEND ? current?.STOP_SEND : '暂无') == 1 ? '是' : '否' }}</el-descriptions-item>
      <el-descriptions-item label="最大开票金额" :span='3'>{{(current?.INVOICE_LIMIT_PRICE ? current?.INVOICE_LIMIT_PRICE : '暂无') }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="许可证信息" :column="3" border>
      <el-descriptions-item label="营业执照效期" :span='1'>
        <el-link
          v-if="current?.Business_License_Valid_Date == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            current?.BUSINESS_LICENSE_PIC != '' &&
            current?.BUSINESS_LICENSE_PIC != null &&
            current?.Business_License_Valid_Date != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(current?.BUSINESS_LICENSE_PIC)"
          >{{ current?.Business_License_Valid_Date ? current?.Business_License_Valid_Date.substring(0, 10) : "暂无" }}</el-link
        >
        <el-link v-else>{{
          current?.Business_License_Valid_Date ? current?.Business_License_Valid_Date.substring(0, 10) : "暂无"
        }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="一类的许可证经营有效期" :span='1'>
        <el-link
          v-if="current.RODUCTION_CLASS_1_VALID_DATE == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            current?.RODUCTION_CLASS_1_PIC != '' &&
            current?.RODUCTION_CLASS_1_PIC != null &&
            current?.RODUCTION_CLASS_1_VALID_DATE != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(current?.RODUCTION_CLASS_1_PIC)"
          >{{ current?.RODUCTION_CLASS_1_VALID_DATE ? current?.RODUCTION_CLASS_1_VALID_DATE.substring(0, 10) : "暂无" }}</el-link
        >
        <el-link v-else>{{
          current?.RODUCTION_CLASS_1_VALID_DATE ? current?.RODUCTION_CLASS_1_VALID_DATE.substring(0, 10) : "暂无"
        }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="二类的许可证经营有效期" :span='1'>
        <el-link
          v-if="current?.Roduction_class_2_Valid_Date == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            current?.RODUCTION_CLASS_2_PIC != '' &&
            current?.RODUCTION_CLASS_2_PIC != null &&
            current?.Roduction_class_2_Valid_Date != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(current?.RODUCTION_CLASS_2_PIC)"
          >{{ current?.Roduction_class_2_Valid_Date ? current?.Roduction_class_2_Valid_Date.substring(0, 10) : "暂无" }}</el-link
        >
        <el-link v-else>{{
          current?.Roduction_class_2_Valid_Date ? current?.Roduction_class_2_Valid_Date.substring(0, 10) : "暂无"
        }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="三类的许可证经营有效期" :span='1'>
        <el-link
          v-if="current?.Roduction_class_3_Valid_Date == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            current?.RODUCTION_CLASS_3_PIC != '' &&
            current?.RODUCTION_CLASS_3_PIC != null &&
            current?.Roduction_class_3_Valid_Date != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(current?.RODUCTION_CLASS_3_PIC)"
          >{{ current?.Roduction_class_3_Valid_Date ? current?.Roduction_class_3_Valid_Date.substring(0, 10) : "暂无" }}</el-link
        >
        <el-link v-else>{{
          current?.Roduction_class_3_Valid_Date ? current?.Roduction_class_3_Valid_Date.substring(0, 10) : "暂无"
        }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="体外诊断试剂经营许可证有效期" :span='1'>
        <el-link v-if="current?.DR_VALID_DATE == '0001-01-01T00:00:00'"></el-link>
        <el-link
          v-else-if="
            current?.DR_PIC != '' &&
            current?.DR_PIC != null &&
            current?.DR_VALID_DATE != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(current?.DR_PIC)"
          >{{ current?.DR_VALID_DATE ? current?.DR_VALID_DATE.substring(0, 10) : "暂无" }}</el-link
        >
        <el-link v-else>{{ current?.DR_VALID_DATE.substring(0, 10) }}</el-link>
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="备注信息" :column="2" border>
      <el-descriptions-item label="缺项备注" :span='1'>{{ current?.QXBZ ? current?.QXBZ : '暂无' }}</el-descriptions-item>
      <el-descriptions-item label="品牌备注" :span='1'>{{ current?.BRAND_BZ ? current?.BRAND_BZ : '暂无' }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions title="业务员信息" :column="3" border>
      <el-descriptions-item label="业务员姓名">{{current?.Contact_Person ? current?.Contact_Person : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="业务员身份证号">{{current?.YWY_PEO_ID ? current?.YWY_PEO_ID : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="业务员联系电话">{{current?.Contact_Phone ? current?.Contact_Phone : '暂无'}}</el-descriptions-item>
      <el-descriptions-item label="业务员委托书有效期" :span='1'>
        <el-link v-if="current.WTS_VALID_DATE == '0001-01-01T00:00:00'"></el-link>
        <el-link
          v-else-if="
            current?.WTS_PIC != '' &&
            current?.WTS_PIC != null &&
            current?.WTS_VALID_DATE != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(current?.WTS_PIC)"
          >{{ current?.WTS_VALID_DATE ? current?.WTS_VALID_DATE.substring(0, 10) : "暂无" }}</el-link
        >
        <el-link v-else>{{ current?.WTS_VALID_DATE ? current?.WTS_VALID_DATE.substring(0, 10) : "暂无" }}</el-link>
      </el-descriptions-item>
    </el-descriptions>

  </div>
</template>
<script>
  import { BACK_BASE_URL } from '@/config/setting';
  export default {
    name: 'MaterialDetail',
    props: ['current'],
    data() {
      return {
        imageSrcPre: '/Upload/ProPic/',
      };
    },
    methods: {
      showImage(src) {
        let imageSrc = BACK_BASE_URL + this.imageSrcPre + src;
        this.$viewerApi({
          images: [imageSrc]
        })
      },
    },
    computed: {
    },
    created(){
    }
  };
</script>
<style lang=""></style>
