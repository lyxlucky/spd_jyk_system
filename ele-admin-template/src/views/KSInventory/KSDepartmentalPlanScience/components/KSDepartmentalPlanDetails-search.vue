<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <!-- <el-row :gutter="10" style="display: none">
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="状态：">
          <el-select v-model="where.State" @change="search()">
            <el-option label="显示所有申领品种" value="-1"></el-option>
            <el-option label="仅显示实际申领为空品种" value="0"></el-option>
            <el-option label="仅显示实际申领非空品种" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 11, md: 12 } : { span: 6 }">
        <el-form-item label="平均用量时间段：" label-width="130px">
          <el-date-picker
            v-model="where.dateFrom"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-date-picker
          v-model="where.dateTo"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-col>
    </el-row> -->
    <el-row :gutter="10">
      <el-col :lg="5" :md="12">
        <el-input
          size="mini"
          v-model="where.SerachName"
          placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索"
          clearable
        />
      </el-col>
      <el-col :lg="19" :md="12">
        <div class="ele-form-actions">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="search"
            >查询</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >

          <el-dropdown>
            <el-button size="mini" icon="el-icon-plus" type="primary">
              新增<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="openIntroduceUserDefinedTemp"
                  :disabled="!IsDisabled"
                  >自定义新增</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  type="primary"
                  icon="el-icon-upload"
                  size="mini"
                  @click="showApplyTemp"
                  :disabled="!IsDisabled"
                  >引入模板</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="primary" size="small" @click="openIntroduceOtherTemp" :disabled='!IsDisabled'>引用常规模板</el-button> -->
          <!-- <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>引入历史记录</el-button> -->
          <el-button
            type="primary"
            icon="el-icon-s-check"
            size="mini"
            @click="KeeptApplyDate"
            :disabled="!IsDisabled"
            >暂存申领单</el-button
          >
          <el-button
            type="success"
            size="mini"
            icon="el-icon-finished"
            @click="addPutInListDeta2"
            :disabled="!IsDisabled"
            >保存并提交</el-button
          >
          <!-- <el-button type="primary" size="small" @click="reset" :disabled='IsDisabled'>查询订单情况</el-button> -->
          <!-- <el-button type="primary" size="small" @click="reset" :disabled='IsDisabled'>合并订单</el-button> -->
          <!-- :style="{ display: visibleLine }" -->
          <el-button
            type="success"
            icon="el-icon-s-order"
            size="mini"
            @click="subToExamine"
            :disabled="!IsPutInListDeta"
            >审核申领单</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-s-cooperation"
            v-if="
              ['stzl', 'stzx', 'bd'].includes(HOME_HP) || ENV == 'development'
            "
            size="mini"
            @click="Approval"
            :disabled="!IsToExamine"
            >审批申领单</el-button
          >
          <!-- <el-button type="danger" size="small" @click="removeBatch" :disabled='!IsDisabledByDel'>删除</el-button> -->
          <el-popconfirm
            class="ele-action"
            title="确定删除？"
            @confirm="removeBatch()"
          >
            <template v-slot:reference>
              <!-- <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :underline="false"
                :disabled="!IsDisabledByDel"
                >删除</el-button
              >
            </template>
          </el-popconfirm>

          <el-button
            type="primary"
            icon="el-icon-view"
            size="mini"
            @click="ApplyOperateTipShow = true"
            >查看订单详情</el-button
          >

          <el-dropdown>
            <el-button size="mini" icon="el-icon-s-unfold" type="primary">
              目录<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="BidListShowEdit = true"
                  v-permission="'zhongbiaomulu'"
                  >中标目录</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="VarietyDataLzhLookShow = true"
                  v-permission="'zaiyongmulu'"
                  >在用目录</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="DpetOneAuthWithDeptShow = true"
                  v-permission="'keshimulu'"
                  >科室目录</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            type="primary"
            size="mini"
            @click="DownloadGuide"
            icon="el-icon-question"
            v-permission="'shenlinzhiyin'"
            >申领指引</el-button
          >

          <el-button
            type="primary"
            size="mini"
            icon="el-icon-upload"
            @click="dialogTableVisible2 = true"
            >导入模板</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-download"
            class="ele-btn-icon"
            @click="exportData"
          >
            导出
          </el-button>

          <!-- 绑定费用项 -->
          <!-- <el-button
            type="primary"
            size="mini"
            icon="el-icon-s-grid"
            class="ele-btn-icon"
            @click="handleBindBudget"
            :disabled="!selection || selection.length === 0"
          >
            绑定费用项
          </el-button> -->
        </div>
      </el-col>
    </el-row>
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
            name="PlanNum"
            autocomplete="off"
            placeholder=""
            :value="PlanNum"
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
        <el-button type="primary" size="mini" @click="importFile"
          >确定</el-button
        >
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
    <IntroduceUserDefinedTemp
      :visible.sync="showEdit"
      :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch"
    />
    <IntroduceDefinedTemp :visible.sync="showEdit2" />
    <BidVarInfoDept :visible.sync="BidListShowEdit" />
    <ApplyOperateTip :visible.sync="ApplyOperateTipShow" />
    <VarietyDataLzhLook :visible.sync="VarietyDataLzhLookShow" />
    <DpetOneAuthWithDept :visible.sync="DpetOneAuthWithDeptShow" />
    <el-dialog
      title="授权品种目录"
      :visible.sync="ApplyTempPage"
      width="98%"
      :close-on-click-modal="false"
      append-to-body
      top="1vh"
      class="apply-temp"
    >
      <!-- <AuthVarTable :dialogTableVisible="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" /> -->
      <ApplyTemp
        :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch"
        @ApplyTempPageChange="ApplyTempPageChange"
      />
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>存在申领数量为0的明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="deleteZeroDelAndCommit"
          >剔除并提交</el-button
        >
        <!-- <el-button @click="deleteZeroDelAndCommit2">取 消</el-button> -->
        <el-button size="mini" @click="centerDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- 证件到期提醒对话框 -->
    <ExpiredCertificateDialog
      :visible="expiredCertificateDialogVisible"
      :expiredList="expiredCertificateList"
      @confirm="confirmSubmitWithExpiredCertificates"
      @cancel="handleExpiredCertificateCancel"
    />

    <!-- 绑定费用项对话框 -->
    <el-dialog
      title="绑定费用项"
      :visible.sync="bindBudgetDialogVisible"
      width="80%"
      :close-on-click-modal="false"
      append-to-body
      top="5vh"
    >
      <ele-pro-table
        ref="budgetTable"
        :columns="budgetColumns"
        :datasource="budgetDatasource"
        :selection.sync="budgetSelection"
        :tool-style="{ display: 'none' }"
        height="400px"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        :highlight-current-row="true"
        @selection-change="handleBudgetSelectionChange"
      >
      </ele-pro-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindBudgetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBindBudget">确 定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<style scoped lang="scss">
  .apply-temp {
    :deep(.el-dialog__body) {
      padding: 0;
    }
  }
</style>

<script>
  import { HOME_HP } from '@/config/setting';
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
  import { getBudgets, bindBudget } from '@/api/pekingApplication';
  import IntroduceUserDefinedTemp from '@/views/KSInventory/IntroduceUserDefinedTemp/index.vue';
  import BidVarInfoDept from '@/views/KSInventory/ReferenceComponent/BidVarInfoDept/index.vue';
  import ApplyOperateTip from '@/views/KSInventory/ReferenceComponent/ApplyOperateTip/index.vue';
  import VarietyDataLzhLook from '@/views/KSInventory/ReferenceComponent/VarietyDataLzhLook/index.vue';
  import DpetOneAuthWithDept from '@/views/KSInventory/ReferenceComponent/DpetOneAuthWithDept/index.vue';
  import ApplyTemp from '@/views/KSInventory/ApplyTemp/index.vue';
  import IntroduceDefinedTemp from './aaaaccc.vue';
  import ExpiredCertificateDialog from './ExpiredCertificateDialog.vue';
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
      DpetOneAuthWithDept,
      ExpiredCertificateDialog
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
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        expiredCertificateDialogVisible: false,
        expiredCertificateList: [],
        bindBudgetDialogVisible: false,
        budgetItemList: [],
        budgetSelection: [],
        budgetColumns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            label: '序号',
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'ITEM_ID',
            label: '费用项编码',
            align: 'center',
            showOverflowTooltip: true,
            width: 180
          },
          {
            prop: 'ITEM_COMMENT',
            label: '费用项名称',
            align: 'center',
            showOverflowTooltip: true
          }
        ]
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
      },

      /* 审批申领单 */
      IsToExamine() {
        return (
          this.KSDepartmentalPlanDataSearch.State == '6' ||
          this.KSDepartmentalPlanDataSearch.State == '5'
        );
      },
      ENV() {
        return process.env.NODE_ENV;
      },
      HOME_HP() {
        return HOME_HP;
      }
    },
    watch: {
      showEdit() {
        if (this.showEdit == false) {
          this.$emit('showEditReoad', false);
        }
      },
      KSDepartmentalPlanDataSearch() {
        this.PlanNum = this.KSDepartmentalPlanDataSearch.PlanNum;
        return this.KSDepartmentalPlanDataSearch.PlanNum;
      }
    },
    methods: {
      Approval() {
        this.$emit('Approval', this.where);
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
        // 检查是否为bdrm环境
        if (HOME_HP == 'bdrm') {
          // 检查是否为科研订单，如果是则验证费用项目绑定
          if (this.isResearchOrder()) {
            if (!this.hasBudgetBinding()) {
              this.$message.warning(
                '科研订单必须绑定费用项目才能提交，请先绑定费用项目'
              );
              return;
            }
          }
          // 检查证件到期情况
          console.log(HOME_HP);
          const expiredItems = this.checkExpiredCertificates();
          console.log(expiredItems);
          if (expiredItems.length > 0) {
            this.expiredCertificateList = expiredItems;
            this.expiredCertificateDialogVisible = true;
            return;
          }
        }

        // 执行原有的提交逻辑
        this.executeSubmitLogic();
      },

      // 判断是否为科研订单
      isResearchOrder() {
        // 检查申领单数据中是否有科研项目ID
        return (
          this.KSDepartmentalPlanDataSearch &&
          this.KSDepartmentalPlanDataSearch.SCIENTIFIC_ID
        );
      },

      // 检查是否已绑定费用项目
      hasBudgetBinding() {
        // 检查表格数据源中的所有品种是否都已绑定费用项目
        if (!this.datasourceList || this.datasourceList.length === 0) {
          return false;
        }

        // 检查每个品种是否都有费用项目绑定
        return this.datasourceList.every((item) => {
          // 检查品种是否有费用项目名称字段
          return item.ITEM_NAME && item.ITEM_NAME.trim() !== '';
        });
      },

      // 检查证件到期的方法
      checkExpiredCertificates() {
        const expiredItems = [];
        const currentDate = new Date();

        this.datasourceList.forEach((element) => {
          const expiredTypes = [];

          // 检查注册证到期R
          if (element.REGISTRATION_VALID_DATE) {
            const expiry = new Date(element.REGISTRATION_VALID_DATE);
            console.log(expiry);
            if (expiry <= currentDate) {
              expiredTypes.push('注册证');
            }
          }

          // 检查生产许可证到期
          if (element.MAN_XKZ_END) {
            const expiry = new Date(element.MAN_XKZ_END);
            if (expiry <= currentDate) {
              expiredTypes.push('生产许可证');
            }
          }

          // 检查品种授权到期
          if (element.AUTH_VALID) {
            const expiry = new Date(element.AUTH_VALID);
            if (expiry <= currentDate) {
              expiredTypes.push('品种授权');
            }
          }

          // 检查供应商经营许可证到期
          if (element.BUSINESS_LICENSE_VALID_DATE2) {
            const expiry = new Date(element.BUSINESS_LICENSE_VALID_DATE2);
            if (expiry <= currentDate) {
              expiredTypes.push('供应商经营许可证');
            }
          }

          // 检查集配商经营许可证到期
          if (element.BUSINESS_LICENSE_VALID_DATE) {
            const expiry = new Date(element.BUSINESS_LICENSE_VALID_DATE);
            if (expiry <= currentDate) {
              expiredTypes.push('集配商经营许可证');
            }
          }

          // 如果有到期的证件，添加到列表中
          if (expiredTypes.length > 0) {
            expiredItems.push({
              VarName: element.VarName,
              VarID: element.VarCode,
              GG: element.GG,
              Manufacturing: element.Manufacturing,
              expiredType: expiredTypes.join('、'),
              expiredDate: this.getEarliestExpiredDate(element),
              RegistrationCertificateExpiry: element.REGISTRATION_VALID_DATE,
              ProductionLicenseExpiry: element.MAN_XKZ_END,
              VarietyAuthorizationExpiry: element.AUTH_VALID,
              SupplierBusinessLicenseExpiry:
                element.BUSINESS_LICENSE_VALID_DATE2,
              DistributorBusinessLicenseExpiry:
                element.BUSINESS_LICENSE_VALID_DATE
            });
          }
        });

        return expiredItems;
      },

      // 获取最早的到期日期
      getEarliestExpiredDate(element) {
        const dates = [];
        if (element.REGISTRATION_VALID_DATE)
          dates.push(new Date(element.REGISTRATION_VALID_DATE));
        if (element.MAN_XKZ_END) dates.push(new Date(element.MAN_XKZ_END));
        if (element.AUTH_VALID) dates.push(new Date(element.AUTH_VALID));
        if (element.BUSINESS_LICENSE_VALID_DATE2)
          dates.push(new Date(element.BUSINESS_LICENSE_VALID_DATE2));
        if (element.BUSINESS_LICENSE_VALID_DATE)
          dates.push(new Date(element.BUSINESS_LICENSE_VALID_DATE));

        if (dates.length === 0) return '';

        const earliestDate = new Date(Math.min(...dates));
        return earliestDate.toISOString().split('T')[0];
      },

      // 执行提交逻辑
      executeSubmitLogic() {
        const loading = this.$messageLoading('提交中..');
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
            APPLY_QTY: element.PlanQty,
            SELECTED_SKU_ID: element.SELECTED_SKU_ID
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
              const loading = this.$messageLoading('提交中..');
              isHaveZeroDel(data)
                .then((res) => {
                  loading.close();
                  if (res.code == '200') {
                    this.centerDialogVisible = true;
                  } else {
                    this.deleteZeroDelAndCommit2();
                  }
                })
                .finally(() => {
                  loading.close();
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

      // 确认提交（有到期证件的情况下）
      confirmSubmitWithExpiredCertificates() {
        this.expiredCertificateDialogVisible = false;
        this.executeSubmitLogic();
      },

      // 取消提交（有到期证件的情况下）
      handleExpiredCertificateCancel() {
        this.expiredCertificateDialogVisible = false;
        this.$message.info('已取消提交');
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
        const loading = this.$messageLoading('提交中..');
        PutInListDeta(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.$emit('ClickReload', true);
            //reloadPageTab();
          })
          .catch((err) => {
            loading.close();
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
            this.$emit('ClickReload', true);
            // reloadPageTab();
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
      handleBindBudget() {
        // 打开绑定费用项对话框
        this.bindBudgetDialogVisible = true;
        // 加载费用项数据（这里使用模拟数据，实际应该从API获取）
        this.loadBudgetItems();
      },
      confirmBindBudget() {
        // 确定绑定费用项
        if (!this.budgetSelection || this.budgetSelection.length === 0) {
          this.$message.warning('请选择一个费用项');
          return;
        }

        // 限制只能选择一个费用项
        if (this.budgetSelection.length > 1) {
          this.$message.warning('只能选择一个费用项');
          return;
        }

        // 获取选中的费用项ID
        const budgetIds = String(
          this.budgetSelection.map((item) => item.ITEM_ID)
        );

        const budgetName = String(
          this.budgetSelection.map((item) => item.ITEM_COMMENT)
        );

        // 构建请求数据
        const data = {
          planNum: this.KSDepartmentalPlanDataSearch.PlanNum,
          planDetailId: this.selection.map((item) => item.ID).join(','),
          budgetDetailId: budgetIds,
          budgetDetailName: budgetName
        };

        // 调用绑定费用项API
        const loading = this.$messageLoading('绑定中...');
        bindBudget(data)
          .then((res) => {
            loading.close();
            this.bindBudgetDialogVisible = false;
            this.$message.success(res.msg || '绑定费用项成功');

            // 刷新表格数据
            var where = {
              PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
            };
            this.$emit('search', where);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || '绑定费用项失败');
          });
      },
      loadBudgetItems() {
        // 刷新表格数据
        if (this.$refs.budgetTable) {
          this.$refs.budgetTable.reload();
        }
      },
      budgetDatasource({ page, limit, where, order }) {
        // 调用API获取费用项数据
        return getBudgets({ page, limit, where, order })
          .then((res) => {
            // 处理API返回的数据，确保格式符合ele-pro-table的要求
            if (res.code === 200 && res.data) {
              return {
                count: res.total || res.data.length || 0,
                list: res.data
              };
            } else {
              return {
                count: 0,
                list: []
              };
            }
          })
          .catch((err) => {
            this.$message.error(err.message || '获取费用项数据失败');
            return {
              count: 0,
              list: []
            };
          });
      },
      handleBudgetSelectionChange(selection) {
        // 如果选择了多个，只保留最后一个
        if (selection.length > 1) {
          // 获取当前表格的DOM元素
          const table = this.$refs.budgetTable;
          if (table && table.$refs.table) {
            // 清除所有选择
            table.$refs.table.clearSelection();
            // 选择最后一项
            const lastItem = selection[selection.length - 1];
            table.$refs.table.toggleRowSelection(lastItem, true);
          }
          this.$message.warning('只能选择一个费用项');
        }
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
