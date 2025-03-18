<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col :lg="3" :md="12">
          <el-input size="mini" v-model="where.REGISTRATION_NAME" placeholder="耗材注册证名称" clearable />
        </el-col>

        <el-col :lg="3" :md="12">
          <el-input size="mini" v-model="where.REGISTRATION_NO" placeholder="注册证号" clearable />
        </el-col>

        <el-col :lg="3" :md="12">
          <el-input size="mini" v-model="where.ITEM_NUMBER" placeholder="物料编码" clearable />
        </el-col>

        <el-col :lg="3" :md="12">
          <el-input size="mini" v-model="where.STAND_VALUE" placeholder="规格" clearable />
        </el-col>
        
        <el-col :lg="12" :md="12">
          <div class="ele-form-actions">
            <el-button size="mini" icon="el-icon-search" type="primary" @click="search">查询</el-button>
            <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
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
      HEADER_IFACE_ID: '',
      REGISTRATION_NAME: '',
      REGISTRATION_NO: '',
      ITEM_NUMBER: '',
      STAND_VALUE: ''
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
    showDialogTableVisible(){
      this.dialogTableVisible = true;
    },
    showDialogTableVisible2(){
      this.dialogTableVisible2 = true;
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
