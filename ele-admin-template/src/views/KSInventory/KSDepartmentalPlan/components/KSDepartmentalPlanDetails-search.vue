<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <el-row :gutter="10" style="display: none">
      <!-- <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="状态：">
          <el-select v-model="where.State" @change="search()">
            <el-option label="显示所有申领品种" value="-1"></el-option>
            <el-option label="仅显示实际申领为空品种" value="0"></el-option>
            <el-option label="仅显示实际申领非空品种" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col v-bind="styleResponsive ? { lg: 11, md: 12 } : { span: 6 }">
        <el-form-item label="平均用量时间段：" label-width='130px'>
          <el-date-picker v-model="where.dateFrom" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-date-picker v-model="where.dateTo" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="6" :md="12">
        <el-form-item label="">
          <el-input v-model="where.SerachName" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="18" :md="12">
        <div class="ele-form-actions">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>

          <el-button type="primary" size="small" @click="openIntroduceUserDefinedTemp" :disabled='!IsDisabled'>自定义新增</el-button>
          <!-- <el-button type="primary" size="small" @click="openIntroduceOtherTemp" :disabled='!IsDisabled'>引用常规模板</el-button> -->
          <el-button type="primary" size="small" @click="showApplyTemp" :disabled='!IsDisabled'>引入模板</el-button>
          <!-- <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>引入历史记录</el-button> -->
          <el-button type="primary" size="small" @click="KeeptApplyDate" :disabled='!IsDisabled'>暂存申领单</el-button>
          <el-button type="success" size="small" @click="addPutInListDeta2" :disabled='!IsDisabled'>保存并提交</el-button>
          <!-- <el-button type="primary" size="small" @click="reset" :disabled='IsDisabled'>查询订单情况</el-button> -->
          <!-- <el-button type="primary" size="small" @click="reset" :disabled='IsDisabled'>合并订单</el-button> -->
          <el-button :style="{ display: visibleLine }" type="success" size="small" @click="subToExamine" :disabled='!IsPutInListDeta'>审核申领单</el-button>
          <!-- <el-button type="primary" size="small" @click="search" :disabled='!IsToExamine'>审批申领单</el-button> -->
          <!-- <el-button type="danger" size="small" @click="removeBatch" :disabled='!IsDisabledByDel'>删除</el-button> -->
          <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
            <template v-slot:reference>
              <!-- <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link> -->
              <el-button type="danger" size="small" :underline="false" :disabled='!IsDisabledByDel'>删除</el-button>
            </template>
          </el-popconfirm>

          <el-button type="primary" size="small" @click="ApplyOperateTipShow=true">查看订单详情</el-button>
          <el-button type="primary" size="small" @click="BidListShowEdit=true">中标目录</el-button>
          <el-button type="primary" size="small" @click="VarietyDataLzhLookShow=true">在用目录</el-button>
          <el-button type="primary" size="small" @click="DpetOneAuthWithDeptShow=true">科室目录</el-button>
          <el-button type="primary" size="small" @click="DownloadGuide">申领指引</el-button>

        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="primary" size="small" @click="dialogTableVisible2=true">导入模板</el-button>
      <el-button type="primary" size="small" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
        导出
      </el-button>
    </el-row>

    <el-dialog title="导入模板品种" :visible.sync="dialogTableVisible2" width='30%'>
      <div style="width:100%;text-align:center">
        <form action="" id="CreateBydFpform">
          <input type="text" style="display:none;" name="PlanNum" autocomplete="off" placeholder="" :value="PlanNum">
          <input type="text" style="display:none;" name="Token" autocomplete="off" placeholder="" :value="Token">

          <div class="layui-form-item">
            <label style="width:170px;">选择文件:</label>
            <input id="FILE" style="height:30px;width:200px;display:inline;margin-left:5px;" name="FILE" type="file" value="" required="required" autocomplete="off">
          </div>
        </form>
        <el-button type="primary" size="small" @click="importFile">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-row :gutter="10">
      <div class="ele-form-actions">
        <el-button type="primary" size="small" @click="openIntroduceUserDefinedTemp" :disabled='!IsDisabled'>自定义新增</el-button>
        <el-button type="primary" size="small" @click="showApplyTemp" :disabled='!IsDisabled'>引入其他模板</el-button>
        <el-button type="primary" size="small" @click="KeeptApplyDate" :disabled='!IsDisabled'>暂存申领单</el-button>
        <el-button type="primary" size="small" @click="addPutInListDeta2" :disabled='!IsDisabled'>保存并提交</el-button>
        <el-button type="primary" size="small" @click="subToExamine" :disabled='!IsPutInListDeta'>审核申领单</el-button>
        <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
          <template v-slot:reference>
            <el-button type="danger" size="small" :underline="false" :disabled='!IsDisabledByDel'>删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-row> -->
    <!-- <el-row :gutter="10">
      <div class="ele-form-actions">
        <el-button type="primary" size="small" @click="subToExamine" :disabled='!IsPutInListDeta'>审核申领单</el-button>
        <el-button type="primary" size="small" @click="search" :disabled='!IsToExamine'>审批申领单</el-button>
        <el-button type="danger" size="small" @click="removeBatch" :disabled='!IsDisabledByDel'>删除</el-button>
        <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
          <template v-slot:reference>
            <el-button type="danger" size="small" :underline="false" :disabled='!IsDisabledByDel'>删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-row> -->
    <IntroduceUserDefinedTemp :visible.sync="showEdit" :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch" />
    <IntroduceDefinedTemp :visible.sync="showEdit2" />
    <BidVarInfoDept :visible.sync="BidListShowEdit" />
    <ApplyOperateTip :visible.sync="ApplyOperateTipShow" />
    <ApplyOperateTip :visible.sync="ApplyOperateTipShow" />
    <VarietyDataLzhLook :visible.sync="VarietyDataLzhLookShow" />
    <DpetOneAuthWithDept :visible.sync="DpetOneAuthWithDeptShow" />
    <el-dialog title="授权品种目录" :visible.sync="ApplyTempPage" width='95%'>
      <!-- <AuthVarTable :dialogTableVisible="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" /> -->
      <ApplyTemp :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch" @ApplyTempPageChange="ApplyTempPageChange" />
    </el-dialog>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>存在申领数量为0的明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteZeroDelAndCommit">剔除并提交</el-button>
        <el-button @click="deleteZeroDelAndCommit2">取 消</el-button>
      </span>
    </el-dialog>
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
import IntroduceUserDefinedTemp from '@/views/KSInventory/IntroduceUserDefinedTemp/index.vue';
import BidVarInfoDept from '@/views/KSInventory/ReferenceComponent/BidVarInfoDept/index.vue';
import ApplyOperateTip from '@/views/KSInventory/ReferenceComponent/ApplyOperateTip/index.vue';
import VarietyDataLzhLook from '@/views/KSInventory/ReferenceComponent/VarietyDataLzhLook/index.vue';
import DpetOneAuthWithDept from '@/views/KSInventory/ReferenceComponent/DpetOneAuthWithDept/index.vue';
import ApplyTemp from '@/views/KSInventory/ApplyTemp/index.vue';
import IntroduceDefinedTemp from './aaaaccc.vue';
import { TOKEN_STORE_NAME } from '@/config/setting';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
  components: {
    IntroduceUserDefinedTemp,
    IntroduceDefinedTemp,
    ApplyTemp,
    BidVarInfoDept,
    ApplyOperateTip,
    VarietyDataLzhLook,
    DpetOneAuthWithDept
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      PlanNum: '',
      is_second_app: '',
      SerachName: '',
      dateFrom: '',
      dateTo: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      showEdit: false,
      showEdit2: false,
      ApplyTempPage: false,
      centerDialogVisible: false,
      BidListShowEdit: false,
      ApplyOperateTipShow: false,
      VarietyDataLzhLookShow: false,
      DpetOneAuthWithDeptShow: false,
      HidesubToExamine: false,
      visibleLine: 'none',
      PlanNum: '',
      dialogTableVisible2: false,
      Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },

    /* 保存提交 */
    IsDisabled() {
      if (this.KSDepartmentalPlanDataSearch) {
        return this.KSDepartmentalPlanDataSearch.State == '0';
      } else {
        return false;
      }
      // return (
      //   this.KSDepartmentalPlanDataSearch.State == '0' &&
      //   (this.KSDepartmentalPlanDataSearch.PlanNum != null ||
      //     this.KSDepartmentalPlanDataSearch.PlanNum != undefined ||
      //     this.KSDepartmentalPlanDataSearch.PlanNum.length != 0)
      // );
    },
    IsDisabledIsNot() {
      return false;
    },
    /* 删除键 */
    IsDisabledByDel() {
      if (this.KSDepartmentalPlanDataSearch) {
        return this.KSDepartmentalPlanDataSearch.State == '0';
      } else {
        return false;
      }
    },

    /* 审核申领单 */
    IsPutInListDeta() {
      if (this.KSDepartmentalPlanDataSearch) {
        return this.KSDepartmentalPlanDataSearch.State == '1';
      } else {
        return false;
      }
    }

    /* 审批申领单 */
    // IsToExamine() {
    //   return this.KSDepartmentalPlanDataSearch.State == '6';
    // }
  },
  watch: {
    showEdit() {
      if (this.showEdit == false) {
        this.$emit('showEditReoad', false);
      }
    },
    KSDepartmentalPlanDataSearch() {
      this.PlanNum = this.KSDepartmentalPlanDataSearch.PlanNum;
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
    showApplyTemp() {
      // console.log(this.KSDepartmentalPlanDataSearch);
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
    /* 其他模板弹出框状态 */
    ApplyTempPageChange(data) {
      this.ApplyTempPage = data;
      var where = {
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
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
      console.log(this.HidesubToExamine);
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
      console.log(this.PlanNum);
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
