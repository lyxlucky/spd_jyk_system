<template lang="">
  <div>
    <el-descriptions title="注册证产品详情" :column="4" border>
      <el-descriptions-item label="注册证名称：">{{
        current.PROD_REGISTRATION_NAME
      }}</el-descriptions-item>
      <el-descriptions-item label="批准文号：">{{
        current.APPROVAL_NUMBER
      }}</el-descriptions-item>
      <el-descriptions-item label="发证日期：">{{
        this.$moment(current.REGISTRATION_ISSUING_DATE).format('YYYY-MM-DD')
      }}</el-descriptions-item>
      <el-descriptions-item label="档案位置：">{{
        current.LICENCE_FILE_PATH
      }}</el-descriptions-item>

      <!-- 第二行 -->
      <el-descriptions-item label="产品类别：">{{
        current.PROD_BIG_CLASS_NAME
      }}</el-descriptions-item>
      <el-descriptions-item label="生产企业名称：">{{
        current?.MANUFACTURING_ENT_NAME + '|' + current?.FOREIGN_REGIST_NAME
      }}</el-descriptions-item>
      <el-descriptions-item label="有效到期：">{{
        this.$moment(current.REGISTRATION_VALID_DATE).format('YYYY-MM-DD')
      }}</el-descriptions-item>
      <el-descriptions-item label="备注：">{{
        current.NOTE_DESCRIPTION
      }}</el-descriptions-item>

      <!-- 第三行 -->
      <el-descriptions-item label="管理类别：">{{
        current.MGMT_CAT_NAME
      }}</el-descriptions-item>
      <el-descriptions-item label="生产许可证号：">{{
        current.MANUFACTURING_LICENSE
      }}</el-descriptions-item>
      <el-descriptions-item label="创建日期：">{{
        this.$moment(current.CREATE_TIME).format('YYYY-MM-DD')
      }}</el-descriptions-item>
      <el-descriptions-item label="国外注册人：">{{
        current.FOREIGN_REGIST_NAME
      }}</el-descriptions-item>

      <!-- 第四行 -->
      <el-descriptions-item label="监管类别：">{{
        current.REGULATORY_CAT_NAME
      }}</el-descriptions-item>
      <el-descriptions-item label="进口或国产：">{{
        current.TRADE_TYPE == 1 ? '进口' : '国产'
      }}</el-descriptions-item>
      <el-descriptions-item label="最近更新时间：">{{
        this.$moment(current.LAST_UPDATE_TIME).format('YYYY-MM-DD')
      }}</el-descriptions-item>
      <el-descriptions-item label="品牌：">{{
        current.Brand
      }}</el-descriptions-item>
    </el-descriptions>

    <!-- 第二大行 -->
    <el-descriptions title="证照详情" :column="4" border>
      <el-descriptions-item label="注册证图片：">
        <div class="image-container" v-viewer>
          <template v-for="(item, index) in varPicCurrent">
            <div :key="index" v-if="item.TYPE == 1">
              <img
                class="image"
                v-if="item?.PIC_URL && !item.PIC_URL.includes('pdf')"
                :src="BACK_BASE_URL + picturePrefix + item?.PIC_URL"
              />
              <el-link type="primary" v-else @click="downloadPDf(item?.PIC_URL)"
                >pdf文件</el-link
              >
            </div>
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="品种说明书：">
        <div class="image-container" v-viewer>
          <template v-for="(item, index) in varPicCurrent">
            <div :key="index" v-if="item.TYPE == 2">
              <img
                class="image"
                v-if="item?.PIC_URL && !item.PIC_URL.includes('pdf')"
                :src="BACK_BASE_URL + picturePrefix + item?.PIC_URL"
              />
              <el-link type="primary" v-else @click="downloadPDf(item?.PIC_URL)"
                >pdf文件</el-link
              >
            </div>
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="包装图片：">
        <div class="image-container" v-viewer>
          <template v-for="(item, index) in varPicCurrent">
            <div :key="index" v-if="item.TYPE == 3">
              <img
                class="image"
                v-if="item?.PIC_URL && !item.PIC_URL.includes('pdf')"
                :src="BACK_BASE_URL + picturePrefix + item?.PIC_URL"
              />
              <el-link type="primary" v-else @click="downloadPDf(item?.PIC_URL)"
                >pdf文件</el-link
              >
            </div>
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="品种授权书：">
        <div class="image-container" v-viewer>
          <template v-for="(item, index) in varPicCurrent">
            <div :key="index" v-if="item.TYPE == 3">
              <img
                class="image"
                v-if="item?.PIC_URL && !item.PIC_URL.includes('pdf')"
                :src="BACK_BASE_URL + picturePrefix + item?.PIC_URL"
              />
              <el-link type="primary" v-else @click="downloadPDf(item?.PIC_URL)"
                >pdf文件</el-link
              >
            </div>
          </template>
        </div>
      </el-descriptions-item>

      <el-descriptions-item label="厂家营业执照：">
        <div class="image-container" v-viewer>
          <template v-for="(item, index) in varPicCurrent">
            <div :key="index" v-if="item.TYPE == 3">
              <img
                class="image"
                v-if="item?.PIC_URL && !item.PIC_URL.includes('pdf')"
                :src="BACK_BASE_URL + picturePrefix + item?.PIC_URL"
              />
              <el-link type="primary" v-else @click="downloadPDf(item?.PIC_URL)"
                >pdf文件</el-link
              >
            </div>
          </template>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="厂家生产许可证：">
        <div class="image-container" v-viewer>
          <template v-for="(item, index) in varPicCurrent">
            <div :key="index" v-if="item.TYPE == 3">
              <img
                class="image"
                v-if="item?.PIC_URL && !item.PIC_URL.includes('pdf')"
                :src="BACK_BASE_URL + picturePrefix + item?.PIC_URL"
              />
              <el-link type="primary" v-else @click="downloadPDf(item?.PIC_URL)"
                >pdf文件</el-link
              >
            </div>
          </template>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<script>
  import { BACK_BASE_URL } from '@/config/setting';
  import { getVarPic } from '@/api/Home/registration/index';
  export default {
    name: 'registrationDescription',
    data() {
      return {
        current: {},
        varPicCurrent: [],
        picturePrefix: '/Upload/ProPic/'
      };
    },
    methods: {
      downloadPDf(url) {
        let pdfUrl = BACK_BASE_URL + this.picturePrefix + url;
        window.open(pdfUrl);
      }
    },
    computed: {
      BACK_BASE_URL() {
        return BACK_BASE_URL;
      }
    },
    created() {},
    mounted() {
      this.$bus.$on(`${this.$route.path}/handleCurrent`, (val) => {
        this.current = val;
        getVarPic({ code: val.PROD_REGISTRATION_CODE }).then((res) => {
          if (res.code == 200) {
            this.varPicCurrent = res.result;
          }
        });
      });
    },
    beforeDestroy() {}
  };
</script>
<style scoped>
  .image {
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px; /* 图片之间的间距 */
    max-width: 100%; /* 可根据需要设置最大宽度 */
  }
  .image-container {
    display: flex; /* 使用 Flexbox 布局 */
    flex-wrap: wrap; /* 允许图片换行 */
  }
</style>
