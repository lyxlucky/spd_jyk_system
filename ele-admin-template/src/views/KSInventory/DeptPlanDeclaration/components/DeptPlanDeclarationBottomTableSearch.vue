<!-- 搜索表单 -->

<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input v-model="where.VARIETIE_CODE_NEW" placeholder="编码/名称/规格" clearable />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input v-model="where.MANUFACTURING_ENT_NAME" placeholder="生产企业" clearable />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input v-model="where.APPROVAL_NUMBER" placeholder="注册证号" clearable />
          </el-form-item>
        </el-col>

        <el-col style="padding-top: 2px;" v-bind="styleResponsive ? { lg: 10, md: 2 } : { span: 6 }">
          <div class="ele-form-actions">
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <el-button type="primary" size="small" @click="addPlanItemVisiable = true">添加计划品种</el-button>
            <el-button type="primary" size="small" @click="updateDeptPlantTableDetailVisible = true"
              :disabled='updateIsDisabled'>修改明细</el-button>
            <el-button type="danger" size="small" @click="deleteBottomTableItems" :disabled='IsDisabled'>剔除</el-button>
            <!-- <el-button type="primary" size="small" @click="exportPrintSheet">打印计划表</el-button> -->
            <el-button type="primary" size="small" @click="QuotationPlanVisible = true">引用计划模板</el-button>
            <!-- <el-button type="primary" size="small" :disabled="excelBottomTableIsabled"
              @click="excelBottomTable">导出计划表</el-button> -->
            <el-button type="primary" size="small" :disabled='TopTableDisabled' @click="exportData">导出</el-button>
            <el-upload :on-success="uploadSuccess" style="float: right;" :show-file-list="false" :action="uploadUrl" ref='upload' :limit="1">
              <el-button size="small" icon="el-icon-_upload" type="primary">导入</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </el-form>


    <!-- 修改明细对话框 -->
    <!-- :before-close="where.updateDeptPlantTableDetailClose" -->
    <el-dialog title="修改明细" center @close="updateDeptPlantTableDetailDialogClose"
      :visible.sync="updateDeptPlantTableDetailVisible" width="20%" :before-close="updateDeptPlantTableDetailClose">

      <el-form :model="where.BottomTableCurrent" :rules="updateDetailRules" ref="updateDeptPlantTableDetailRef"
        label-width="100px" class="updateDeptPlantTableDetailForm">

        <el-form-item label="计划数量" prop="PLAN_NUM">
          <el-input v-model="where.BottomTableCurrent.PLAN_NUM" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="备注：" prop="REMARK">
          <el-input v-model="where.BottomTableCurrent.REMARK" placeholder="请输入备注"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitUpdateDeptPlanForm()">保存</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <!-- 添加计划品种 -->
    <AddPlanItem @addItemDone="addItemDone" :visible.sync="addPlanItemVisiable" />

    <!-- 引用计划模板 -->
    <QuotationPlan :visible.sync="QuotationPlanVisible" />

  </div>
</template>

<script>
import AddPlanItem from '@/views/KSInventory/DeptPlanDeclaration/components/AddPlanItem.vue';
import QuotationPlan from '@/views/KSInventory/DeptPlanDeclaration/components/QuotationPlan.vue';
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';

import {
  ExcelDeptPlanTableBottom,
  updateDeptPlantTableDetails
} from '@/api/KSInventory/DeptPlanDeclaration';

export default {
  props: [
    'DeptPlanDeclarationTopTableCurrent',
    'selection',
    'datasourceList',
    'TopTableSelection',
    'current'
  ],
  components: {
    AddPlanItem,
    QuotationPlan
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      DEPT_PLAN_NEW_MAIN_ID: '',
      VARIETIE_CODE_NEW: '',
      MANUFACTURING_ENT_NAME: '',
      APPROVAL_NUMBER: '',
      BottomTableCurrent: {
        PLAN_NUM: 0,
        REMARK: "",
        ID: ""
      }
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      showEdit: false,
      showEdit2: false,
      ApplyTempPage: false,
      centerDialogVisible: false,
      visibleLine: 'none',
      addPlanItemVisiable: false,
      updateDeptPlantTableDetailVisible: false,
      QuotationPlanVisible: false,
      uploadUrl: `${BACK_BASE_URL}${API_BASE_URL}/DeptPlanDec/ImportDeptPDDel`,
      updateDetailRules: {
        PLAN_NUM: [
          { required: true, message: '请输入计划数量', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' }
          // 备注不能为空
        ]
      }
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },

    excelBottomTableIsabled() {
      // return false
      return this.TopTableSelection.length === 0;
    },

    /* 保存提交 */
    IsDisabled() {
      return this.selection.length === 0;
    },
    TopTableDisabled() {
      return (this.TopTableSelection.length == 0 && this.datasourceList.length == 0)
    },
    IsDisabledIsNot() {
      return false;
    },
    /* 删除键 */
    IsDisabledByDel() {
      if (this.DeptPlanDeclarationTopTableCurrent) {
        return this.DeptPlanDeclarationTopTableCurrent.State == '0';
      } else {
        return false;
      }
    },
    updateIsDisabled() {
      return this.selection.length != 1;
    },
    /* 审核申领单 */
    IsPutInListDeta() {
      if (this.DeptPlanDeclarationTopTableCurrent) {
        return this.DeptPlanDeclarationTopTableCurrent.State == '1';
      } else {
        return false;
      }
    }
  },
  watch: {
    showEdit() {
      if (this.showEdit == false) {
        this.$emit('showEditReoad', false);
      }
    },
    current() {
      if (this.current != null) {
        this.where.BottomTableCurrent.PLAN_NUM = this.current.PLAN_NUM
        this.where.BottomTableCurrent.REMARK = this.current.REMARK
        this.where.BottomTableCurrent.ID = this.current.ID
      }
    }
  },
  methods: {
    updateDeptPlantTableDetailDialogClose() {
      this.where.updateDeptPlantTableDetail = {}
    },
    addItemDone() {
      this.addPlanItemVisiable = false;
      this.$emit('addPlanItemDone', "")
    },
    //修改明细
    submitUpdateDeptPlanForm() {
      let data = {
        "where": this.where.BottomTableCurrent,
      }
      updateDeptPlantTableDetails(data).then(res => {
        this.$message.success(res.msg);
        this.updateDeptPlantTableDetailVisible = false;
        this.$emit("search")
      }).catch(err => {
        this.$message.error(err);
      })
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
      // DeletePlanDeta(data)
      //   .then((res) => {
      //     loading.close();
      //     this.search();
      //     var where = {
      //       ID: this.DeptPlanDeclarationTopTableCurrent.ID
      //     };
      //     this.$emit('search', where);
      //     this.$message.success(res.msg);
      //   })
      //   .catch((err) => {
      //     loading.close();
      //     this.$message.error(err);
      //   });
    },
    showApplyTemp() {
      // console.log(this.DeptPlanDeclarationTopTableCurrent);
      this.ApplyTempPage = true;
    },
    /* 打开其他模板页面 */
    openIntroduceOtherTemp() {
      this.showEdit2 = true;
    },
    /* 保存并提交  */
    addPutInListDeta() {
      // console.log(this.datasourceList)
      if (
        this.DeptPlanDeclarationTopTableCurrent.PlanNum == null ||
        this.DeptPlanDeclarationTopTableCurrent.PlanNum == undefined ||
        this.DeptPlanDeclarationTopTableCurrent.PlanNum.length == 0
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
        PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      };
      // PutInListDeta(data)
      //   .then((res) => {
      //     loading.close();
      //     this.$message.success('提交成功');
      //     reloadPageTab();
      //   })
      //   .catch((err) => {
      //     loading.close();
      //     this.$message.error(err);
      //   });
    },

    uploadSuccess(response, file, fileList){
      this.$refs.upload.clearFiles()
      this.$emit("uploadSuccess")
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
      // KeeptListDeta(list)
      //   .then((res) => {
      //     loading.close();
      //     if (res.code == '200') {
      //       var data = {
      //         PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      //       };
      //       isHaveZeroDel(data).then((res) => {
      //         if (res.code == '200') {
      //           this.centerDialogVisible = true;
      //         } else {
      //           this.deleteZeroDelAndCommit2();
      //         }
      //       });

      //       var where = {
      //         PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      //       };
      //       this.$emit('search', where);
      //     }
      //   })
      //   .catch((err) => {
      //     loading.close();
      //     this.$message.error(err);
      //   });
    },

    deleteZeroDelAndCommit() {
      var data = {
        PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      };
      // deleteZeroDel(data).then((res) => {
      //   if (res.code == '200') {
      //     var data = {
      //       PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      //     };
      //     PutInListDeta(data)
      //       .then((res) => {
      //         this.$message.success(res.msg);
      //         reloadPageTab();
      //       })
      //       .catch((err) => {
      //         this.$message.error(err);
      //       });
      //   }
      // });
    },

    deleteZeroDelAndCommit2() {
      var data = {
        PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      };
      // PutInListDeta(data)
      //   .then((res) => {
      //     this.$message.success(res.msg);
      //     this.$emit('ClickReload', true);
      //     reloadPageTab();
      //   })
      //   .catch((err) => {
      //     this.$message.error(err);
      //   });
    },
    /* 审批申领单  */
    subToExamine() {
      // console.log(this.$store.state.user);
      var loading = this.$messageLoading('保存中..');
      var data = {
        Operator: this.$store.state.user.info.Nickname,
        PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      };
      // ToExamine(data)
      //   .then((res) => {
      //     loading.close();
      //     this.$message.success(res.msg);
      //     reloadPageTab();
      //   })
      //   .catch((err) => {
      //     loading.close();
      //     this.$message.error(err);
      //   });
    },
    /* 其他模板弹出框状态 */
    ApplyTempPageChange(data) {
      this.ApplyTempPage = data;
      var where = {
        PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      };
      this.$emit('search', where);
    },
    /* 暂存申领单 */
    KeeptApplyDate() {
      const loading = this.$messageLoading('暂存中..');
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
      // KeeptListDeta(list)
      //   .then((res) => {
      //     loading.close();
      //     this.$message.success(res.msg);
      //     var where = {
      //       PlanNum: this.DeptPlanDeclarationTopTableCurrent.PlanNum
      //     };
      //     this.$emit('search', where);
      //   })
      //   .catch((err) => {
      //     loading.close();
      //     this.$message.error(err);
      //   });
    },
    DownloadGuide() {
      var url = `${BACK_BASE_URL}/ZL/上药控股SPD科室操作手册.pdf`;
      window.open(url.replace('/undefined', ''));
    },
    IsHide() {
      console.log(this.HidesubToExamine);
      if (this.HidesubToExamine == false) {
        this.visibleLine = 'none';
      } else {
        this.visibleLine = '';
      }
    },
    exportData() {
      this.$emit("exportData", this.where)
    },
    updateDeptPlantTableDetailClose() {
      // this.where.BottomTableCurrent = {};
      this.$refs.updateDeptPlantTableDetailRef.clearValidate()
      this.updateDeptPlantTableDetailVisible = false;
    },
    exportPrintSheet() {
      this.$emit("exportPrintSheet", this.where)
    },
    deleteBottomTableItems() {
      this.$emit("deleteBottomTableItems", this.selection)
    },
    excelBottomTable() {
      let data = {
        "selection": this.TopTableSelection,
        "data": this.where
      }
      this.$emit("excelBottomTable", data)
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
    this.IsHide()
  },
};
</script>
