<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search" inline>
      <el-form-item label="平均用量时间段：" >
        <el-date-picker
          size="mini"
          v-model="where.dateRange"
          type="daterange"
          style="width: 200px"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input
          size="mini"
          v-model="where.SerachName"
          style="width: 200px"
          placeholder="品名/编码/型号规格/生产企业"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button size="mini" class="ele-btn-icon" icon="el-icon-search" type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" class="ele-btn-icon" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item v-if="!IsDisabled">
        <el-button
          type="primary"
          size="mini"
          class="ele-btn-icon"
          @click="addTempVar"
          :style="{ display: IsDisabled == true ? 'none' : '' }"
        >
          确认申领
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="showDialogTableVisible"
          icon="el-icon-plus"
          class="ele-btn-icon"
          >添加品种</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="ele-btn-icon"
          size="mini"
          @click="saveApplyNum"
          >保存</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-dropdown>
          <el-button size="mini" icon="el-icon-s-grid" class="ele-btn-icon" type="primary">
            模板<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="margin-bottom: 4px;">
              <el-button
                type="primary"
                size="mini"
                @click="showDialogTableVisible2"
                >导入模板</el-button
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="primary" size="mini" @click="exportData"
                >导出模板</el-button
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item v-if="false">
        <el-button
          type="danger"
          icon="el-icon-delete"
          class="ele-btn-icon"
          size="mini"
          @click="removeBatch"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog title="导入模板品种" :visible.sync="dialogTableVisible2" width="30%">
      <div style="width: 100%; text-align: center">
        <form action="" id="CreateBydFpform">
          <input type="text" size="mini" style="display: none" name="TEMPLET_MAIN_ID" autocomplete="off" placeholder=""
            :value="TEMPLET_MAIN_ID" />
          <input type="text" size="mini" style="display: none" name="Token" autocomplete="off" placeholder=""
            :value="Token" />

          <div class="layui-form-item">
            <label style="width: 170px">选择文件:</label>
            <input id="FILE" size="mini" style="
                height: 30px;
                width: 200px;
                display: inline;
                margin-left: 5px;
              " name="FILE" type="file" value="" required="required" autocomplete="off" />
          </div>
        </form>
        <el-button type="primary" size="mini" icon="el-icon-check" @click="importFile">确定</el-button>
      </div>
    </el-dialog>
    <AuthVarTable :visible.sync="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" />
  </div>
</template>

<script>
import { utils, read } from 'xlsx';
import { TOKEN_STORE_NAME } from '@/config/setting';
import {
  DeletePlanDeta
  // KeeptListDeta,
} from '@/api/KSInventory/KSDepartmentalPlan';
import {
  KeepTempletDeta,
  ImportTempExcel
} from '@/api/KSInventory/ApplyTemp';
import AuthVarTable from './AuthVarTable.vue';
export default {
  props: ['ApplyTempTableDataSearch', 'selection', 'IntroduceUserDefinedTempSearch'],
  components: {
    AuthVarTable: AuthVarTable
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      PlanNum: '',
      is_second_app: '',
      SerachName: '',
      dateRange: this.getDefaultDateRange()
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
    },
    IsDisabled() {
      return this.IntroduceUserDefinedTempSearch == undefined ? true : false;
    }
  },
  methods: {
    getDefaultDateRange() {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      return [
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      ];
    },
    showDialogTableVisible(){
      this.dialogTableVisible = true;
    },
    showDialogTableVisible2(){
      this.dialogTableVisible2 = true;
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
    addTempVar() {
      this.$emit('addTempVar');
    },
    removeBatch() {
      this.$emit('removeBatch');
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
