<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search" :inline="true" size="mini" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="where.VARIETIE_CODE_NEW"
          placeholder="请输入品种名称/品种编码"
          clearable
        />
      </el-form-item>
      <!-- <el-col :lg="5" :md="12">
          <el-input size="mini" v-model="where.zcz" placeholder="请输入注册证/生产企业/批准文号" clearable />
        </el-col> -->
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search"
          >查询</el-button
        >
      </el-form-item>
      <!-- <el-form-item>
        <el-button
          :disabled="isUdiScanEnabld"
          icon="el-icon-paperclip"
          type="primary"
          @click="handleUdiScanAdd"
          >扫码添加</el-button
        >
      </el-form-item> -->
      <el-form-item>
        <el-button
          :disabled="isUdiScanEnabld"
          icon="el-icon-circle-check"
          type="primary"
          @click="handleSelectAdd"
          >耗材清单</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="isUdiScanEnabld"
          icon="el-icon-check"
          type="info"
          @click="handleCatTransferLog"
          >转单记录</el-button
        >
      </el-form-item>

      <el-form-item class="info-box">
        <div
          v-show="
            ApplyTempTableData && Object.keys(ApplyTempTableData).length != 0
          "
        >
          术间:<el-tag size="mini">{{ ApplyTempTableData?.SSFJ }}</el-tag
          >手术台号:<el-tag size="mini">{{ ApplyTempTableData?.SSTH }}</el-tag
          >住院号:<el-tag size="mini">{{ ApplyTempTableData?.ZYHM }}</el-tag
          >姓名:<el-tag size="mini">{{ tipsContent }}</el-tag>
        </div>
      </el-form-item>
    </el-form>
    <!-- <AuthVarTable
      :visible.sync="dialogTableVisible"
      :ApplyTempTableDataID="ApplyTempTableDataID"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
  :deep(.info-box > .el-form-item__content) {
    max-width: none !important;
  }
</style>

<script>
  import { utils, read } from 'xlsx';
  import { BACK_BASE_URL, HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
  import { DeletePlanDeta } from '@/api/KSInventory/KSDepartmentalPlan';
  import {
    KeepTempletDeta,
    ImportTempExcel
  } from '@/api/KSInventory/ApplyTemp';
  import { isHvaeChargCode } from '@/api/HeelBlockConsumables/PlatformConsume';
  import AuthVarTable from './AuthVarTable.vue';
  export default {
    props: [
      'ApplyTempTableDataSearch',
      'selection',
      'VarietyConsumeptionDataList',
      'AdvanceReceiptDelcurrent',
      'ApplyTempTableData'
    ],
    components: {
      AuthVarTable: AuthVarTable
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        Token: '',
        VARIETIE_CODE_NEW: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        dialogTableVisible: false,
        dialogTableVisible2: false,
        TEMPLET_MAIN_ID: null,
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        AdvanceNumberTableCurrent: null
      };
    },
    computed: {
      isUdiScanEnabld() {
        if (this?.AdvanceNumberTableCurrent != null) {
          return false;
        }
        return true;
      },
      tipsContent() {
        return this.ApplyTempTableData?.BRXM;
        // if (
        //   !this.ApplyTempTableData &&
        //   Object.keys(this.ApplyTempTableData).length == 0
        // ) {
        //   return '';
        // }
        // let BRXM = this.ApplyTempTableData?.BRXM;
        // if (!BRXM) {
        //   return '';
        // }
        // if (BRXM.length == 1) {
        //   return BRXM + '*';
        // }
        // if (BRXM.length == 2) {
        //   return BRXM[0] + '*';
        // }

        // const firstChar = BRXM[0];
        // const lastChar = BRXM[BRXM.length - 1];
        // const middleStars = '*'.repeat(BRXM.length - 2);
        // return firstChar + middleStars + lastChar;
      },
      isAddVarietieEnable() {
        return (
          1 == Number(this?.ApplyTempTableDataSearch?.Receive_Receipt_State)
        );
      },
      isPrintDefNoPkgCodeEnable() {
        return [3, 4].includes(
          Number(this?.ApplyTempTableDataSearch?.Receive_Receipt_State)
        );
      },
      isLeftTableCurrent() {
        return this?.ApplyTempTableDataSearch?.Receive_Receipt_State;
      },
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      ApplyTempTableDataID() {
        return this.ApplyTempTableDataSearch;
      }
    },
    methods: {
      handleUdiScanAdd() {
        this.$emit('handleUdiScanAdd');
      },
      handleCatTransferLog() {
        this.$emit('handleCatTransferLog');
      },
      handleSelectAdd() {
        this.$emit('handleSelectAdd');
      },
      handleIsHaveChargCode(jsonString) {
        return new Promise((resolve, reject) => {
          isHvaeChargCode({
            json: jsonString,
            DELIVERY_NOTE_NUMBER:
              this.ApplyTempTableDataSearch?.Delivery_Note_Number
          })
            .then((res) => {
              this.$message.success(res.msg);
              resolve(res.data);
            })
            .catch((err) => {
              this.$message.error(err);
              reject(err);
            });
        });
      },

      handleDefNoPkgCodePrint(jsonString) {
        return new Promise((resolve, reject) => {
          window.open(
            `${BACK_BASE_URL}/api/B2BVarietieConsumeApprove/GetTags?id=5&format=pdf&inline=true&json=${JSON.stringify(
              jsonString
            )}&deliveryNumberId=${
              this.ApplyTempTableDataSearch?.Delivery_Note_Number
            }&title=${HOME_HP}&Token=${sessionStorage.Token}`
          );
          resolve();
        });
      },

      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      handleAddConsumeItem() {
        this.$emit('handleAddConsumeItem');
      },
      removeBatch() {
        var ID = '';
        this.selection.forEach((item) => {
          ID += item.ID + ',';
        });
        ID.substring(0, ID.length - 1);
        var data = {
          ID
        };
        DeletePlanDeta(data).then((res) => {
          console.log(res);
        });
      },
      saveApplyNum() {
        const loading = this.$messageLoading('保存中...');
        var list = this.selection;
        for (let i = 0; i < list.length; i++) {
          list[i].BigBoxCount = '0';
          list[i].MinBoxCount = '0';
        }
        KeepTempletDeta(list)
          .then((res) => {
            loading.close();
            this.$emit('search', this.where);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      exportData() {
        this.$emit('exportData', this.where);
      },
      importFile() {
        if (this.TEMPLET_MAIN_ID == null) {
          this.$message.warning('请先选择模板');
          return;
        }
        const loading = this.$messageLoading('导入中...');
        var formData = new FormData(document.getElementById('CreateBydFpform'));
        ImportTempExcel(formData)
          .then((res) => {
            loading.close();
            this.dialogTableVisible2 = false;
            this.$message.success(res.msg);
            this.$emit('search', this.where);
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }
    },
    created() {},
    watch: {
      ApplyTempTableDataSearch() {
        this.TEMPLET_MAIN_ID = this.ApplyTempTableDataSearch?.ID;
      },
      dialogTableVisible() {
        if (this.dialogTableVisible == false) {
          this.$emit('showEditReoad', false);
        }
      }
    },
    mounted() {
      this.$bus.$on('AdvanceReceiptNumberTableCurrent', (data) => {
        this.AdvanceNumberTableCurrent = data;
      });
    }
  };
</script>
