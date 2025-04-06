<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col :lg="5" :md="12">
          <el-input size="mini" v-model="where.condition" placeholder="请输入品种名称/品种编码/型号规格" clearable />
        </el-col>
        <el-col :lg="5" :md="12">
          <el-input size="mini" v-model="where.zcz" placeholder="请输入注册证/生产企业/批准文号" clearable />
        </el-col>
        <el-col :lg="12" :md="12">
          <div class="ele-form-actions">
            <el-button size="mini" icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button size="mini" type="primary" @click="handleAddConsumeItem">添加</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- <AuthVarTable
      :visible.sync="dialogTableVisible"
      :ApplyTempTableDataID="ApplyTempTableDataID"
    /> -->
  </div>
</template>

<script>
import { utils, read } from 'xlsx';
import { BACK_BASE_URL, HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';
import {
  DeletePlanDeta
  // KeeptListDeta,
} from '@/api/KSInventory/KSDepartmentalPlan';
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
    'VarietyConsumeptionDataList'
  ],
  components: {
    AuthVarTable: AuthVarTable
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      condition: '',
      zcz: '',
      udi: '',
      deliveryNumber: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      dialogTableVisible: false,
      dialogTableVisible2: false,
      TEMPLET_MAIN_ID: null,
      Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
  },
  computed: {
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
          )}&deliveryNumberId=${this.ApplyTempTableDataSearch?.Delivery_Note_Number
          }&title=${HOME_HP}&Token=${sessionStorage.Token}`
        );
        resolve();
      });
    },

    //查看定数码标签
    handleCatDefNoPkgCode() {
      const loading = this.$messageLoading('加载中...');
      const jsonString = this.VarietyConsumeptionDataList?.map((item) => {
        return item?.Id;
      });
      this.handleIsHaveChargCode(jsonString)
        .then((res) => {
          this.handleDefNoPkgCodePrint(jsonString);
        })
        .finally(() => {
          loading.close();
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
  created() { },
  watch: {
    ApplyTempTableDataSearch() {
      this.TEMPLET_MAIN_ID = this.ApplyTempTableDataSearch.ID;
    },
    dialogTableVisible() {
      if (this.dialogTableVisible == false) {
        this.$emit('showEditReoad', false);
      }
    }
  }
};
</script>
