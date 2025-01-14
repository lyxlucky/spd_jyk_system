<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <!-- <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="状态：">
          <el-select v-model="where.State" @change="search()">
            <el-option label="显示所有申领品种" value="-1"></el-option>
            <el-option label="仅显示实际申领为空品种" value="0"></el-option>
            <el-option label="仅显示实际申领非空品种" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
        <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 6 }">
          <el-form-item label="平均用量时间段：" label-width="130px">
            <el-date-picker
              size="mini"
              v-model="where.dateFrom"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.dateTo"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :lg="8" :md="12">
          <el-input
            size="mini"
            v-model="where.SerachName"
            placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索"
            clearable
          />
        </el-col>
        <el-col :lg="14" :md="12">
          <div class="ele-form-actions">
            <el-button
              size="mini"
              icon="el-icon-search"
              type="primary"
              @click="search"
              >查询</el-button
            >
            <el-button size="mini" icon="el-icon-refresh" @click="reset"
              >重置</el-button
            >

            <el-button
              type="primary"
              size="mini"
              @click="dialogTableVisible = true"
              icon="el-icon-plus"
              >添加品种</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="saveApplyNum"
              >保存</el-button
            >
            <!-- <el-button type="primary" size="small" @click="search">导入模板</el-button> -->
            <!-- <el-upload action="" :before-upload="importFile" :show-file-list="false" accept=".xls,.xlsx,.csv">
              <el-button>导入excel</el-button>
            </el-upload> -->

            <el-dropdown>
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
            </el-dropdown>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeBatch"
              >删除</el-button
            >
          </div>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="10">
        <div class="ele-form-actions">
          <el-button type="primary" size="small" @click="dialogTableVisible = true">添加品种</el-button>
          <el-button type="primary" size="small" @click="saveApplyNum">保存</el-button>
          <el-button type="primary" size="small" @click="search">导入模板</el-button>
          <el-button type="primary" size="small" @click="search">导出模板</el-button>
          <el-button type="danger" size="small" @click="removeBatch">删除</el-button>
        </div>
      </el-row> -->
    </el-form>
    <el-dialog
      title="导入模板品种"
      :visible.sync="dialogTableVisible2"
      width="30%"
    >
      <div style="width: 100%; text-align: center">
        <form action="" id="CreateBydFpform">
          <input
            type="text"
            size="mini"
            style="display: none"
            name="TEMPLET_MAIN_ID"
            autocomplete="off"
            placeholder=""
            :value="TEMPLET_MAIN_ID"
          />
          <input
            type="text"
            size="mini"
            style="display: none"
            name="Token"
            autocomplete="off"
            placeholder=""
            :value="Token"
          />

          <div class="layui-form-item">
            <label style="width: 170px">选择文件:</label>
            <input
              id="FILE"
              size="mini"
              style="
                height: 30px;
                width: 200px;
                display: inline;
                margin-left: 5px;
              "
              name="FILE"
              type="file"
              value=""
              required="required"
              autocomplete="off"
            />
          </div>
        </form>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-check"
          @click="importFile"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <AuthVarTable
      :visible.sync="dialogTableVisible"
      :ApplyTempTableDataID="ApplyTempTableDataID"
    />
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
    props: ['ApplyTempTableDataSearch', 'selection'],
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
        dateFrom: '',
        dateTo: ''
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
