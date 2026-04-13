<template lang="">
  <ele-modal
    width="85%"
    top="5vh"
    title="修改证照详情"
    :visible="visible"
    :resizable="true"
    :maxable="true"
    @update:visible="updateVisible"
  >
    <div class="container">
      <div v-loading="loading" class="description">
        <el-descriptions
          title="注册证信息"
          :column="2"
          size="mini"
          border
          class="registration-detail-desc"
        >
          <!-- 第1行 -->
          <el-descriptions-item label="注册证产品名称">
            <div
              v-if="!editing.PROD_REGISTRATION_NAME"
              @click="enableEdit('PROD_REGISTRATION_NAME')"
              >{{ this.where.current.PROD_REGISTRATION_NAME }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.PROD_REGISTRATION_NAME"
              @blur="saveEdit('PROD_REGISTRATION_NAME')"
              @keydown.enter="saveEdit('PROD_REGISTRATION_NAME')"
              @keydown.esc="cancelEdit('PROD_REGISTRATION_NAME')"
              :ref="'input-PROD_REGISTRATION_NAME'"
            >
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="医疗器械注册人或备案人">
            {{ this.where.current.MANUFACTURING_ENT_NAME || '空' }}
            <el-button
              type="primary"
              icon="el-icon-zoom-in"
              size="mini"
              style="margin-left: 10px"
              @click="chooseManufacture('0')"
              >选择医疗器械注册人或备案人</el-button
            >
          </el-descriptions-item>

          <!-- 第2行 -->
          <el-descriptions-item label="注册证编号">
            <div
              v-if="!editing.APPROVAL_NUMBER"
              @click="enableEdit('APPROVAL_NUMBER')"
              >{{ this.where.current.APPROVAL_NUMBER }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.APPROVAL_NUMBER"
              @blur="saveEdit('APPROVAL_NUMBER')"
              @keydown.enter="saveEdit('APPROVAL_NUMBER')"
              @keydown.esc="cancelEdit('APPROVAL_NUMBER')"
              :ref="'input-APPROVAL_NUMBER'"
            >
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="受托医疗器械生产企业名称">
            {{ this.where.current.ST_MANUFACTURING_ENT_NAME || '空' }}
            <el-button
              type="primary"
              icon="el-icon-zoom-in"
              size="mini"
              style="margin-left: 10px"
              @click="chooseManufacture('1')"
              >选择受托医疗器械生产企业名称</el-button
            >
          </el-descriptions-item>

          <!-- 第3行：注册证批准日期 | 生产许可证号 -->
          <el-descriptions-item label="注册证批准日期">
            <el-date-picker
              v-model="where.current.REGISTRATION_ISSUING_DATE"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              size="mini"
              style="width: 100%"
            >
            </el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="生产许可证号">
            <div
              v-if="!editing.MANUFACTURING_LICENSE"
              @click="enableEdit('MANUFACTURING_LICENSE')"
              >{{ this.where.current.MANUFACTURING_LICENSE || '空' }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.MANUFACTURING_LICENSE"
              @blur="saveEdit('MANUFACTURING_LICENSE')"
              @keydown.enter="saveEdit('MANUFACTURING_LICENSE')"
              @keydown.esc="cancelEdit('MANUFACTURING_LICENSE')"
              :ref="'input-MANUFACTURING_LICENSE'"
            >
            </el-input>
          </el-descriptions-item>

          <!-- 第4行：注册证有效期至 | 生产地址 -->
          <el-descriptions-item label="注册证有效期至">
            <el-date-picker
              v-model="where.current.REGISTRATION_VALID_DATE"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              size="mini"
              style="width: 100%"
            >
            </el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="生产地址">
            <div
              v-if="!editing.PRODUCTION_SITE"
              @click="enableEdit('PRODUCTION_SITE')"
              >{{ this.where.current.PRODUCTION_SITE || '空' }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.PRODUCTION_SITE"
              @blur="saveEdit('PRODUCTION_SITE')"
              @keydown.enter="saveEdit('PRODUCTION_SITE')"
              @keydown.esc="cancelEdit('PRODUCTION_SITE')"
              :ref="'input-PRODUCTION_SITE'"
            >
            </el-input>
          </el-descriptions-item>

          <!-- 第5行：原注册证编号 | 法人 -->
          <el-descriptions-item label="原注册证编号">
            <div class="old-reg-row">
              <div
                v-if="!editing.OLD_PROD_REGISTRATION_CODE"
                class="old-reg-value"
                @click="enableEdit('OLD_PROD_REGISTRATION_CODE')"
                >{{ this.where.current.OLD_PROD_REGISTRATION_CODE || '空' }}</div
              >
              <el-input
                v-else
                size="mini"
                v-model="where.current.OLD_PROD_REGISTRATION_CODE"
                @blur="saveEdit('OLD_PROD_REGISTRATION_CODE')"
                @keydown.enter="saveEdit('OLD_PROD_REGISTRATION_CODE')"
                @keydown.esc="cancelEdit('OLD_PROD_REGISTRATION_CODE')"
                :ref="'input-OLD_PROD_REGISTRATION_CODE'"
              >
              </el-input>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="法人">
            <div
              v-if="!editing.LEGAL_PERSON"
              @click="enableEdit('LEGAL_PERSON')"
              >{{ this.where.current.LEGAL_PERSON || '空' }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.LEGAL_PERSON"
              @blur="saveEdit('LEGAL_PERSON')"
              @keydown.enter="saveEdit('LEGAL_PERSON')"
              @keydown.esc="cancelEdit('LEGAL_PERSON')"
              :ref="'input-LEGAL_PERSON'"
            >
            </el-input>
          </el-descriptions-item>

          <!-- 第6行：原注册证批准日期(REGISTRATION_ISSUING_DATE) | 国内代理企业 -->
          <el-descriptions-item label="原注册证批准日期">
            <el-date-picker
              v-model="where.current.REGISTRATION_ISSUING_DATE"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              size="mini"
              style="width: 100%"
            >
            </el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="国内代理企业">
            <div
              v-if="!editing.FOREIGN_REGIST_NAME"
              @click="enableEdit('FOREIGN_REGIST_NAME')"
              >{{ this.where.current.FOREIGN_REGIST_NAME || '空' }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.FOREIGN_REGIST_NAME"
              @blur="saveEdit('FOREIGN_REGIST_NAME')"
              @keydown.enter="saveEdit('FOREIGN_REGIST_NAME')"
              @keydown.esc="cancelEdit('FOREIGN_REGIST_NAME')"
              :ref="'input-FOREIGN_REGIST_NAME'"
            >
            </el-input>
          </el-descriptions-item>

          <!-- 第7行：原注册证有效期至(REGISTRATION_VALID_DATE) | 进口或国产 -->
          <el-descriptions-item label="原注册证有效期至">
            <el-date-picker
              v-model="where.current.REGISTRATION_VALID_DATE"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              size="mini"
              style="width: 100%"
            >
            </el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="进口或国产">
            <el-select v-model="where.current.TRADE_TYPE" placeholder="请选择" size="mini">
              <el-option
                v-for="item in prodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>

          <!-- 第8行 -->
          <el-descriptions-item label="储存条件">
            <el-select
              v-model="where.current.STORAGE_CONDITION"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in storageConditionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="品牌">
            <div v-if="!editing.Brand" @click="enableEdit('Brand')">{{
              this.where.current.Brand || '空'
            }}</div>
            <el-input
              v-else
              size="mini"
              v-model="where.current.Brand"
              @blur="saveEdit('Brand')"
              @keydown.enter="saveEdit('Brand')"
              @keydown.esc="cancelEdit('Brand')"
              :ref="'input-Brand'"
            >
            </el-input>
          </el-descriptions-item>

          <!-- 第9行 -->
          <el-descriptions-item label="产品类别">
            <el-select
              v-model="where.current.PROD_BIG_CLASS_CODE"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in productTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value.toString()"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="同步修改关联品种名称">
            <el-switch
              v-model="where.isSync"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              size="mini"
            >
            </el-switch>
          </el-descriptions-item>

          <!-- 第10行 -->
          <el-descriptions-item label="管理类别">
            <el-select
              v-model="where.current.MGMT_CAT_CODE"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in MgmtOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value.toString()"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="是否灭菌">
            <el-select
              v-model="where.current.ONEOFF_STERILIZATION_PACKAGING"
              placeholder="请选择"
              clearable
              size="mini"
            >
              <el-option
                v-for="item in oneoffSterilizationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>

          <!-- 第11行 -->
          <el-descriptions-item label="监管类别">
            <el-select
              v-model="where.current.SUPERVISE_CAT_CODE"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in RegulatoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value.toString()"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="his结束时间">
            <el-date-picker
              v-model="where.current.HIS_PROD_END_TIME"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              size="mini"
              style="width: 100%"
            >
            </el-date-picker>
          </el-descriptions-item>

          <!-- 第12行 -->
          <el-descriptions-item label="是否启用">
            <el-tag size="mini" :type="where.current.ENABLE == '1' ? 'success' : 'info'">
              {{ where.current.ENABLE == '1' ? '启用' : '停用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建日期">
            {{ formatCreateTime(where.current.CREATE_TIME) }}
          </el-descriptions-item>

          <!-- 通栏 -->
          <el-descriptions-item label="结构及组成" :span="2">
            <div
              v-if="!editing.STRUCTURE_COMPOSITION"
              @click="enableEdit('STRUCTURE_COMPOSITION')"
              >{{ this.where.current.STRUCTURE_COMPOSITION || '空' }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.STRUCTURE_COMPOSITION"
              @blur="saveEdit('STRUCTURE_COMPOSITION')"
              @keydown.enter="saveEdit('STRUCTURE_COMPOSITION')"
              @keydown.esc="cancelEdit('STRUCTURE_COMPOSITION')"
              :ref="'input-STRUCTURE_COMPOSITION'"
            >
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="适用范围" :span="2">
            <div
              v-if="!editing.SCOPE_APPLICATION"
              @click="enableEdit('SCOPE_APPLICATION')"
              >{{ this.where.current.SCOPE_APPLICATION || '空' }}</div
            >
            <el-input
              v-else
              size="mini"
              v-model="where.current.SCOPE_APPLICATION"
              @blur="saveEdit('SCOPE_APPLICATION')"
              @keydown.enter="saveEdit('SCOPE_APPLICATION')"
              @keydown.esc="cancelEdit('SCOPE_APPLICATION')"
              :ref="'input-SCOPE_APPLICATION'"
            >
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item label="缺项备注" :span="2">
            <div v-if="!editing.QXBZ" @click="enableEdit('QXBZ')">{{
              this.where.current.QXBZ || '空'
            }}</div>
            <el-input
              v-else
              size="mini"
              v-model="where.current.QXBZ"
              @blur="saveEdit('QXBZ')"
              @keydown.enter="saveEdit('QXBZ')"
              @keydown.esc="cancelEdit('QXBZ')"
              :ref="'input-QXBZ'"
            >
            </el-input>
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions
          title="图片信息"
          :column="3"
          size="mini"
          style="margin-top: 20px"
          border
        >
          <el-descriptions-item :span="3" labelStyle="width:200px">
            <template slot="label">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span>品种注册证</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showPictureInfoTable"
                  icon="el-icon-search"
                  >查看 / {{ this.where.current.XZ_COUNT1 }}</el-button
                >
              </div>
            </template>
            <!-- values -->
            <div class="image-container" v-viewer>
              <div v-for="(image, index) in pictureInfoList" :key="image.ID">
                <img
                  class="image"
                  v-if="
                    image.TYPE == '1' &&
                    !image.PIC_URL.includes('pdf') &&
                    index < 3
                  "
                  :src="BACK_BASE_URL + picturePrefix + image.PIC_URL"
                />
                <el-link
                  class="image"
                  type="primary"
                  v-else-if="
                    image.TYPE == '1' &&
                    image.PIC_URL.includes('pdf') &&
                    index < 3
                  "
                  @click="downloadPDf(image.PIC_URL)"
                  >pdf文件</el-link
                >
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item :span="3" labelStyle="width:200px">
            <template slot="label">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span>品种授权书</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showPictureInfoTable"
                  icon="el-icon-search"
                  >查看 / {{ this.where.current.XZ_COUNT2 }}</el-button
                >
              </div>
            </template>
            <!-- values -->
            <div class="image-container" v-viewer>
              <div v-for="image in pictureInfoList" :key="image.ID">
                <img
                  class="image"
                  v-if="image.TYPE == '2' && !image.PIC_URL.includes('pdf')"
                  :src="BACK_BASE_URL + picturePrefix + image.PIC_URL"
                />
                <el-link
                  class="image"
                  type="primary"
                  v-else-if="image.TYPE == '2' && image.PIC_URL.includes('pdf')"
                  @click="downloadPDf(image.PIC_URL)"
                  >pdf文件</el-link
                >
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item
            :span="3"
            labelStyle="width:200px"
            label="品种包装"
          >
            <template slot="label">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span>品种包装</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showPictureInfoTable"
                  icon="el-icon-search"
                  >查看 / {{ this.where.current.XZ_COUNT3 }}</el-button
                >
              </div>
            </template>
            <!-- values -->
            <div class="image-container" v-viewer>
              <div v-for="image in pictureInfoList" :key="image.ID">
                <img
                  class="image"
                  v-if="image.TYPE == '3' && !image.PIC_URL.includes('pdf')"
                  :src="BACK_BASE_URL + picturePrefix + image.PIC_URL"
                />
                <el-link
                  class="image"
                  type="primary"
                  v-else-if="image.TYPE == '3' && image.PIC_URL.includes('pdf')"
                  @click="downloadPDf(image.PIC_URL)"
                  >pdf文件</el-link
                >
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item
            :span="3"
            labelStyle="width:200px"
            label="品种说明书"
          >
            <template slot="label">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span>品种说明书</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showPictureInfoTable"
                  icon="el-icon-search"
                  >查看 / {{ this.where.current.XZ_COUNT4 }}</el-button
                >
              </div>
            </template>
            <!-- values -->
            <div class="image-container" v-viewer>
              <div v-for="image in pictureInfoList" :key="image.ID">
                <img
                  class="image"
                  v-if="image.TYPE == '4' && !image.PIC_URL.includes('pdf')"
                  :src="BACK_BASE_URL + picturePrefix + image.PIC_URL"
                />
                <el-link
                  class="image"
                  type="primary"
                  v-else-if="image.TYPE == '4' && image.PIC_URL.includes('pdf')"
                  @click="downloadPDf(image.PIC_URL)"
                  >pdf文件</el-link
                >
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item
            :span="3"
            labelStyle="width:200px"
            label="厂家营业执照"
          >
            <template slot="label">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span>厂家营业执照</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showPictureInfoTable"
                  icon="el-icon-search"
                  >查看 / {{ this.where.current.XZ_COUNT5 }}</el-button
                >
              </div>
            </template>
            <!-- values -->
            <div class="image-container" v-viewer>
              <div v-for="image in pictureInfoList" :key="image.ID">
                <img
                  class="image"
                  v-if="image.TYPE == '5' && !image.PIC_URL.includes('pdf')"
                  :src="BACK_BASE_URL + picturePrefix + image.PIC_URL"
                />
                <el-link
                  class="image"
                  type="primary"
                  v-else-if="image.TYPE == '5' && image.PIC_URL.includes('pdf')"
                  @click="downloadPDf(image.PIC_URL)"
                  >pdf文件</el-link
                >
              </div>
            </div>
          </el-descriptions-item>

          <el-descriptions-item
            :span="3"
            labelStyle="width:200px"
            label="厂家生产许可证"
          >
            <template slot="label">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <span>厂家生产许可证</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="showPictureInfoTable"
                  icon="el-icon-search"
                  >查看 / {{ this.where.current.XZ_COUNT6 }}</el-button
                >
              </div>
            </template>
            <!-- values -->
            <div class="image-container" v-viewer>
              <div v-for="(image, index) in pictureInfoList" :key="image.ID">
                <img
                  class="image"
                  v-if="
                    image.TYPE == '6' &&
                    !image.PIC_URL.includes('pdf') &&
                    index < 3
                  "
                  :src="BACK_BASE_URL + picturePrefix + image.PIC_URL"
                />
                <el-link
                  class="image"
                  type="primary"
                  v-else-if="
                    image.TYPE == '6' &&
                    image.PIC_URL.includes('pdf') &&
                    index < 3
                  "
                  @click="downloadPDf(image.PIC_URL)"
                  >pdf文件</el-link
                >
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- template -->
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          icon="el-icon-close"
          @click="updateVisible(false)"
          >取 消</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-check"
          type="primary"
          @click="submitItem"
          >确 定</el-button
        >
      </span>

      <ele-modal
        width="70%"
        title="证照图片审核"
        :visible.sync="pictureInfoListTableisVisible"
        :resizable="true"
        :maxable="true"
        :destroy-on-close="true"
        position="center"
        append-to-body
      >
        <PictureListTable :bottomTableCurrent="tableCurrent" />
      </ele-modal>

      <Manufactory
        :visible.sync="ManufactoryVisible"
        :factoryModalType="factoryModalType"
        @chooseFacotory="chooseFacotory"
      />
    </div>
  </ele-modal>
</template>
<script>
  import {
    GetIdProdInfo,
    GetProTypeList,
    getVarPic,
    GetRegulatoryListByMgmnID,
    GetMgmtListByProTypeID,
    UpDateProdInfo
  } from '@/api/Home/Qualificationcheck/index';
  import { BACK_BASE_URL } from '@/config/setting';
  import PictureListTable from './PictureListTable';
  import Manufactory from './Manufactory';
  export default {
    name: 'RegistrationDetail',
    props: ['tableCurrent', 'visible'],
    components: {
      PictureListTable,
      Manufactory
    },
    data() {
      const defaultWhere = {
        current: {},
        isSync: '0'
      };
      return {
        where: { ...defaultWhere },
        loading: false,
        editing: {
          APPROVAL_NUMBER: false,
          PROD_REGISTRATION_NAME: false,
          OLD_PROD_REGISTRATION_CODE: false,
          MANUFACTURING_ENT_NAME: false,
          FOREIGN_REGIST_NAME: false,
          PRODUCTION_SITE: false,
          MANUFACTURING_LICENSE: false,
          LEGAL_PERSON: false,
          Brand: false,
          SCOPE_APPLICATION: false,
          STRUCTURE_COMPOSITION: false,
          QXBZ: false
        },
        oneoffSterilizationOptions: [
          { value: '1', label: '是' },
          { value: '0', label: '否' }
        ],
        prodOptions: [
          {
            value: '0',
            label: '国产'
          },
          {
            value: '1',
            label: '进口'
          }
        ],
        storageConditionOptions: [
          {
            value: '0',
            label: '常温'
          },
          {
            value: '1',
            label: '阴凉'
          },
          {
            value: '2',
            label: '冷藏(2~8°C)'
          },
          {
            value: '3',
            label: '冷冻'
          }
        ],
        productTypeOptions: [],
        MgmtOptions: [],
        RegulatoryOptions: [],
        pictureInfoList: [],
        picturePrefix: '/Upload/ProPic/',
        pictureInfoListTableisVisible: false,
        ManufactoryVisible: false,
        factoryModalType: ''
      };
    },
    methods: {
      enableEdit(field) {
        this.$set(this.editing, field, true);
        this.$nextTick(() => {
          const inputRef = this.$refs[`input-${field}`];
          if (inputRef && inputRef.focus) {
            inputRef.focus();
          }
        });
      },
      submitItem() {
        //产品类别
        const selectedProductOption = this.productTypeOptions.find(
          (option) => option.value == this.where.current.PROD_BIG_CLASS_CODE
        ).label;
        //管理类别
        const selectedMgmtOption = this.MgmtOptions.find(
          (option) => option.value == this.where.current.MGMT_CAT_CODE
        ).label;
        //管理类别
        const selectedRegulatoryOption = this.RegulatoryOptions.find(
          (option) => option.value == this.where.current.SUPERVISE_CAT_CODE
        ).label;
        this.loading = true;
        UpDateProdInfo({
          where: this.where,
          EDITPROD_PROD: selectedProductOption,
          EDITPROD_MGMT: selectedMgmtOption,
          EDITPROD_REG: selectedRegulatoryOption
        }).then((res) => {
          this.loading = false;
          this.updateVisible(false);
          if(!res.data) return this.$message.error('处理失败');
          this.$message.success('处理成功');
        });
      },
      saveEdit(field) {
        this.$set(this.editing, field, false);
        // 在这里可以添加保存更改的逻辑，例如发送请求到服务器
        //console.log(`Saved ${field}:`, this.where.current[field]);
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      cancelEdit(field) {
        this.$set(this.editing, field, false);
      },
      chooseManufacture(data) {
        this.factoryModalType = data;
        this.ManufactoryVisible = true;
      },
      initRegulatoryList() {
        return new Promise((resolve, reject) => {
          GetRegulatoryListByMgmnID(this.where.current.MGMT_CAT_CODE)
            .then((res) => {
              if (res.code == 200) {
                this.RegulatoryOptions = res.result.map((item) => ({
                  value: item.Regulatory_id,
                  label: item.Regulatory_Cat_Code + item.Regulatory_Cat_Name
                }));
                resolve();
              } else {
                reject(new Error('Failed to fetch product type list'));
              }
            })
            .catch((error) => {
              this.$message.error(error);
              reject(error);
            });
        });
      },
      initMgmtList() {
        return new Promise((resolve, reject) => {
          GetMgmtListByProTypeID(this.where.current.PROD_BIG_CLASS_CODE)
            .then((res) => {
              if (res.code == 200) {
                this.MgmtOptions = res.result.map((item) => ({
                  value: item.Mgmt_Cat_Code,
                  label: item.Mgmt_Cat_Name
                }));
                resolve();
              } else {
                reject(new Error('Failed to fetch product type list'));
              }
            })
            .catch((error) => {
              this.$message.error(error);
              reject(error);
            });
        });
      },
      initProdInfoItem(data) {
        return new Promise((resolve, reject) => {
          GetIdProdInfo(data.PROD_REGISTRATION_CODE)
            .then((res) => {
              if (res.code == 200) {
                this.where.current = res.result;
                resolve();
              } else {
                reject(new Error('Failed to fetch product info'));
              }
            })
            .catch((error) => {
              this.$message.error(error);
              reject(error);
            });
        });
      },
      productTypeInit() {
        return new Promise((resolve, reject) => {
          this.loading = true;
          GetProTypeList()
            .then((res) => {
              if (res.code == 200) {
                this.productTypeOptions = res.result.map((item) => ({
                  value: item.Prod_Big_Class_Code,
                  label: item.Prod_Big_Class_Name
                }));
                resolve();
              } else {
                reject(new Error('Failed to fetch product type list'));
              }
            })
            .catch((error) => {
              this.$message.error(error);
              reject(error);
            });
        });
      },
      //获取图片信息
      getPictureInfo(data) {
        return new Promise((resolve, reject) => {
          getVarPic(data.PROD_REGISTRATION_CODE2)
            .then((res) => {
              this.pictureInfoList = res.result;
              resolve();
            })
            .catch((error) => {
              this.$message.error(error);
              reject(error);
            });
          this.loading = false;
        });
      },
      //下载pdf
      downloadPDf(url) {
        let pdfUrl = BACK_BASE_URL + this.picturePrefix + url;
        window.open(pdfUrl);
      },
      showPictureInfoTable() {
        this.pictureInfoListTableisVisible = true;
      },
      chooseFacotory(data) {
        if (!data.current) return this.$message.warning('请至少选择一条数据');
        this.ManufactoryVisible = false;
        if (data.type == '0') {
          this.where.current.MANUFACTURING_ENT_NAME =
            data.current.MANUFACTURING_ENT_NAME;
        } else {
          this.where.current.ST_MANUFACTURING_ENT_NAME =
            data.current.MANUFACTURING_ENT_NAME;
        }
      },
      formatCreateTime(val) {
        if (val == null || val === '') return '';
        if (this.$moment) {
          return this.$moment(val).format('YYYY-MM-DD');
        }
        const s = String(val);
        return s.length >= 10 ? s.substring(0, 10) : s;
      }
    },
    watch: {
      tableCurrent(newValue) {
        this.productTypeInit()
          .then(() => {
            return this.initProdInfoItem(newValue);
          })
          .then(() => {
            return this.initRegulatoryList();
          })
          .then(() => {
            return this.initMgmtList();
          })
          .then(() => {
            return this.getPictureInfo(newValue);
          })
          .catch((error) => {
            console.error('Error in initializeData:', error);
            // 关闭加载动画
            this.loading = false;
          });
      }
    },
    created() {},
    mounted() {},
    computed: {
      BACK_BASE_URL() {
        return BACK_BASE_URL;
      }
    }
  };
</script>
<style scoped>
  .registration-detail-desc {
    width: 100%;
  }
  .registration-detail-desc ::v-deep .el-descriptions__table {
    width: 100%;
    table-layout: fixed;
  }
  .old-reg-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .old-reg-value {
    flex: 1;
    min-width: 0;
  }
  .old-reg-hint {
    color: #909399;
    font-size: 12px;
    white-space: nowrap;
  }
  .image {
    height: 28px;
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
