<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <el-row :gutter="10" style="margin-bottom: 5px;">
      <el-col :lg="5" :md="12">
        <el-input size="mini" v-model="where.BIND_DEF" placeholder="定数包" clearable />
      </el-col>
      <el-col :lg="3" :md="12">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import {
  DeletePlanDeta,
  PutInListDeta,
  ToExamine,
  KeeptListDeta,
  isHaveZeroDel,
  deleteZeroDel,
  ImportTempExcel
} from '@/api/KSInventory/KSDepartmentalPlan';
import { TOKEN_STORE_NAME } from '@/config/setting';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
  components: {},
  data() {
    // 默认表单数据
    const defaultWhere = {
      BIND_DEF: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  watch: {},
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
    /* 批量删除 */
    removeBatch() {
      const loading = this.$messageLoading('删除中..');
      var ID = '';
      this.selection.forEach((item) => {
        ID += item.ID + ',';
      });
      ID.substring(0, ID.length - 1);
      var data = {
        ID
      };
      DeletePlanDeta(data)
        .then((res) => {
          loading.close();
          this.search();
          var where = {
            PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
          };
          this.$emit('search', where);
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    /* 打开自定义新增页面 */
    openIntroduceUserDefinedTemp() {
      this.showEdit = true;
    },
    /* 打开其他模板页面 */
    openIntroduceOtherTemp() {
      this.showEdit2 = true;
    },
    /* 保存并提交  */
    addPutInListDeta() {
      // console.log(this.datasourceList)
      if (
        this.KSDepartmentalPlanDataSearch.PlanNum == null ||
        this.KSDepartmentalPlanDataSearch.PlanNum == undefined ||
        this.KSDepartmentalPlanDataSearch.PlanNum.length == 0
      ) {
        this.$message.warning('请选择需提交的申领单');
        return;
      }
      if (this.datasourceList.length == 0) {
        this.$message.warning('请添加品种');
        return;
      }
      var loading = this.$messageLoading('保存中..');
      var data = {
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
      };
      PutInListDeta(data)
        .then((res) => {
          loading.close();
          this.$message.success('提交成功');
          reloadPageTab();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },

    addPutInListDeta2() {
      const loading = this.$messageLoading('提交中..');
      var list = [];
      this.selection.forEach((element) => {
        var data = {
          ID: element.ID,
          ENABLE: element.ENABLE,
          PLAN_NUMBER: element.PlanNum,
          VARIETIE_CODE: element.VarID,
          VARIETIE_NAME: element.VarName,
          SPECIFICATION_OR_TYPE: element.GG,
          UNIT: element.Unit,
          MANUFACTURING_ENT_NAME: element.Manufacturing,
          APPLY_QTY: element.PlanQty
        };
        list.push(data);
      });
      KeeptListDeta(list)
        .then((res) => {
          loading.close();
          if (res.code == '200') {
            var data = {
              PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
            };
            isHaveZeroDel(data).then((res) => {
              if (res.code == '200') {
                this.centerDialogVisible = true;
              } else {
                this.deleteZeroDelAndCommit2();
              }
            });

            var where = {
              PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
            };
            this.$emit('search', where);
          }
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },

    deleteZeroDelAndCommit() {
      var data = {
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
      };
      deleteZeroDel(data).then((res) => {
        if (res.code == '200') {
          var data = {
            PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
          };
          PutInListDeta(data)
            .then((res) => {
              this.$message.success(res.msg);
              reloadPageTab();
            })
            .catch((err) => {
              this.$message.error(err);
            });
        }
      });
    },

    deleteZeroDelAndCommit2() {
      var data = {
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
      };
      PutInListDeta(data)
        .then((res) => {
          this.$message.success(res.msg);
          this.$emit('ClickReload', true);
          reloadPageTab();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    /* 审批申领单  */
    subToExamine() {
      // console.log(this.$store.state.user);
      var loading = this.$messageLoading('保存中..');
      var data = {
        Operator: this.$store.state.user.info.Nickname,
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
      };
      ToExamine(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          reloadPageTab();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    /* 暂存申领单 */
    KeeptApplyDate() {
      const loading = this.$messageLoading('暂存中..');
      var list = [];
      this.datasourceList.forEach((element) => {
        var data = {
          ID: element.ID,
          ENABLE: element.ENABLE,
          PLAN_NUMBER: element.PlanNum,
          VARIETIE_CODE: element.VarID,
          VARIETIE_NAME: element.VarName,
          SPECIFICATION_OR_TYPE: element.GG,
          UNIT: element.Unit,
          MANUFACTURING_ENT_NAME: element.Manufacturing,
          APPLY_QTY: element.PlanQty
        };
        list.push(data);
      });
      KeeptListDeta(list)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          var where = {
            PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
          };
          this.$emit('search', where);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    DownloadGuide() {
      var url = `${BACK_BASE_URL}/ZL/上药控股SPD科室操作手册.pdf`;
      window.open(url.replace('/undefined', ''));
    },
    IsHide() {
      // console.log(this.HidesubToExamine);
      if (this.HidesubToExamine == false) {
        this.visibleLine = 'none';
      } else {
        this.visibleLine = '';
      }
    },
    exportData() {
      this.$emit('exportData', this.where);
    },
    importFile() {
      // console.log(this.PlanNum);
      if (this.PlanNum.length <= 0) {
        this.$message.warning('请先选择计划单号');
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
          loading.close();
          this.$message.error(err);
        });
    }
  },
  created() {
    // reloadPageTab();
    var permission_group = this.$store.state.user.info.permission_group;
    for (let i = 0; i < permission_group.length; i++) {
      if (permission_group[i].component == 'ApplyPlan_审核') {
        this.HidesubToExamine = true;
        break;
      }
    }
    this.IsHide();
  }
};
</script>

<style scoped>
::v-deep .ele-table-tool-default {
  margin-bottom: 5px;
}
</style>
