<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search" size="mini">
      <el-row :gutter="10">
        <el-col :lg="8" :md="12">
          <el-input size="mini" v-model="where.condition" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索/供应商名称" clearable />
        </el-col>
        <el-col :lg="14" :md="12">
          <div class="ele-form-actions">
            <el-button size="mini" icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>

            <el-button size="mini" type="primary" class="ele-btn-icon" @click="exportData">导出</el-button>
            <!-- <el-button type="primary" size="mini" @click="dialogTableVisible = true" icon="el-icon-plus">添加品种</el-button> -->
            <el-button type="primary" size="mini" @click="InspectionDtbgtTableVisible = true">套包检测</el-button>
            <el-button type="primary" size="mini" @click="SaveBtn">保存修改</el-button>
            <span style="padding-left:10px">{{ '预送货总量：' + preTotal }}</span>
          </div>
        </el-col>
      </el-row>
    </el-form>
    
    <AuthVarTable :visible.sync="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" />
    <InspectionDtbgtTable :visible.sync="InspectionDtbgtTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" />
  </div>
</template>

<script>
import { utils, read } from 'xlsx';
import { TOKEN_STORE_NAME } from '@/config/setting';
import {
  DeletePlanDeta
  // KeeptListDeta,
} from '@/api/KSInventory/KSDepartmentalPlan';
import { KeepTempletDeta, ImportTempExcel } from '@/api/KSInventory/ApplyTemp';
import AuthVarTable from './AuthVarTable.vue';
import InspectionDtbgtTable from './InspectionDtbgtTable.vue';
export default {
  props: ['ApplyTempTableDataSearch', 'selection','preTotal'],
  components: {
    AuthVarTable: AuthVarTable,
    InspectionDtbgtTable
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      condition: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      dialogTableVisible: false,
      InspectionDtbgtTableVisible: false,
      TEMPLET_MAIN_ID: null,
      Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    ApplyTempTableDataID() {
      return this.ApplyTempTableDataSearch;
    }
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    SaveBtn() {
      this.$emit('SaveBtn');
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    removeBatch() {
      console.log(this.selection);
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
  },
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
