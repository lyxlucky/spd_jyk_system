<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col :lg="4" :md="4">
          <el-input size="mini" v-model="where.VARIETIE_NAME" placeholder="请输入品种名称/生产企业搜索" clearable />
        </el-col>
        <el-col :lg="4" :md="4">
          <el-input size="mini" v-model="where.MAIN_ID" placeholder="生产企业搜索" clearable />
        </el-col>
        <el-col :lg="14" :md="12">
          <div class="ele-form-actions">
            <el-button size="mini" icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>

            <el-button type="primary" size="mini" @click="showDialogTableVisible" icon="el-icon-plus">添加品种</el-button>
            <el-button type="primary" v-if="false" icon="el-icon-plus" size="mini" @click="saveApplyNum">保存</el-button>
            <!-- <el-button type="primary" size="small" @click="search">导入模板</el-button> -->
            <!-- <el-upload action="" :before-upload="importFile" :show-file-list="false" accept=".xls,.xlsx,.csv">
              <el-button>导入excel</el-button>
            </el-upload> -->

            <!-- <el-dropdown>
              <el-button size="mini" icon="el-icon-s-grid" type="primary">
                模板<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="dialogTableVisible2 = true"
                    >导入模板</el-button
                  >
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="primary" size="mini" @click="exportData"
                    >导出模板</el-button
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBatch">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <AuthVarTable :visible.sync="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" />
  </div>
</template>

<script>
import { utils, read } from 'xlsx';
import { TOKEN_STORE_NAME } from '@/config/setting';
import {
  DelNaxtDayApplyPlanTempDel,
  UpNaxtDayApplyPlanTempDelByapplyQtyBatch
} from '@/api/KSInventory/SurgerySchedulingTemp';
import AuthVarTable from './AuthVarTable.vue';
import { DelDeptTwoRegionVar } from '../../../../api/KSInventory/ReservoirArea';
export default {
  props: ['ApplyTempTableDataSearch', 'selection'],
  components: {
    AuthVarTable: AuthVarTable
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      VARIETIE_NAME: ''
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
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    removeBatch() {
      const loading = this.$messageLoading('删除中...');
      var IDS = this.selection.map((item) => item.ID);

      var data = {
        IDS
      };

      DelDeptTwoRegionVar(data)
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
    saveApplyNum() {
      const loading = this.$messageLoading('保存中...');
      var list = this.selection;
      console.log(list);

      UpNaxtDayApplyPlanTempDelByapplyQtyBatch(this.selection)
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
    showDialogTableVisible() {
      if (this.ApplyTempTableDataSearch.REGION_CODE == undefined) {
        this.$message.warning('请选择库区');
        return;
      }
      this.dialogTableVisible = true;
    }
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
