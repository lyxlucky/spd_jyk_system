<template>
  <div class="ele-body pk-lc-main-page">
    <!-- 上半部分：主单表格 -->
    <div class="half-table">
      <el-card shadow="never">
        <ele-pro-table
          ref="mainTable"
          class="table-main"
          :columns="mainColumns"
          :currentPage="mainPage"
          :pageSize="mainSize"
          :highlightCurrentRow="true"
          :datasource="mainDatasource"
          :row-class-name="mainTableRowClassName"
          @current-change="onMainCurrentChange"
          @size-change="onMainSizeChange"
          height="30vh"
          full-height="calc(100vh - 120px)"
        >
          <template v-slot:stateTag="{ row }">
            <el-tag :type="getStateTagType(row.STATE)" size="small">
              {{ getStateText(row.STATE) }}
            </el-tag>
          </template>
          <template v-slot:mainAction="{ row }">
            <el-button
              size="mini"
              type="info"
              :disabled="row.STATE !== 0 && row.STATE !== -1"
              @click="editMainItem(row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              :disabled="row.STATE !== 0 && row.STATE !== -1"
              @click="submitMainItem(row)"
              style="margin-left: 5px"
              >提交</el-button
            >
            <el-button
              v-if="hasApprovePermission"
              size="mini"
              type="warning"
              :disabled="row.STATE !== 1"
              @click="openApproveDialog(row)"
              style="margin-left: 5px"
              >审批</el-button
            >
            <el-popconfirm
              title="确定删除该申请单？"
              @confirm="deleteMainItem(row)"
            >
              <template v-slot:reference>
                <el-button
                  size="mini"
                  type="danger"
                  style="margin-left: 5px"
                  :disabled="row.STATE !== 0 && row.STATE !== -1"
                  @click.stop
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
          <template v-slot:toolbar>
            <el-form class="form-box" inline size="mini">
              <el-form-item>
                <el-input
                  v-model="mainWhere.id"
                  placeholder="请输入申请单号"
                  clearable
                  @keyup.enter.native="reloadMain"
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="mainWhere.deptTwoCode"
                  placeholder="请选择二级科室"
                  clearable
                  filterable
                  style="width: 180px"
                >
                  <el-option
                    v-for="item in deptTwoOptions"
                    :key="item.DEPT_TWO_CODE"
                    :label="item.DEPT_TWO_NAME"
                    :value="item.DEPT_TWO_CODE"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="mainWhere.searchName"
                  placeholder="物料编码/物料名称/注册证"
                  clearable
                  @keyup.enter.native="reloadMain"
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="mainWhere.state"
                  placeholder="状态筛选"
                  clearable
                  style="width: 120px"
                >
                  <el-option label="新增" :value="0" />
                  <el-option label="已提交" :value="1" />
                  <el-option label="已审批" :value="2" />
                  <el-option label="审批不通过" :value="-1" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="reloadMain"
                  >搜索</el-button
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  @click="openAddMainDialog"
                  >新增主单</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </ele-pro-table>
      </el-card>
    </div>

    <!-- 下半部分：明细表格 -->
    <div class="half-table">
      <el-card shadow="never">
        <ele-pro-table
          ref="dtlTable"
          :columns="dtlColumns"
          :datasource="dtlDatasource"
          :currentPage="dtlPage"
          :pageSize="dtlSize"
          @size-change="onDtlSizeChange"
          :empty-text="selectedMain ? '暂无明细记录' : '请选择主单'"
          height="30vh"
          full-height="calc(100vh - 120px)"
        >
          <template v-slot:lcTimesLink="{ row }">
            <el-link
              v-if="row.LC_TIMES > 0"
              type="primary"
              :underline="true"
              @click="openLcDetailDialog(row)"
            >{{ row.LC_TIMES }}</el-link>
            <span v-else>{{ row.LC_TIMES || 0 }}</span>
          </template>
          <template v-slot:dtlAction="{ row }">
            <el-button
              size="mini"
              type="primary"
              :disabled="!canEditDtl"
              @click="openEditDtlDialog(row)"
              style="margin-right: 5px"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除该明细？"
              @confirm="deleteDtlItem(row)"
            >
              <template v-slot:reference>
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="!canEditDtl"
                  @click.stop
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
          <template v-slot:toolbar>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-plus"
              :disabled="!canEditDtl"
              @click="openProductSelectDialog"
              >新增明细</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-printer"
              :disabled="!selectedMain"
              :loading="printLoading"
              @click="handlePrint"
              >打印</el-button
            >
          </template>
        </ele-pro-table>
      </el-card>
    </div>

    <!-- 新增/编辑主单弹窗 -->
    <el-dialog
      :title="mainDialogTitle"
      :visible.sync="mainDialogVisible"
      width="600px"
      @close="closeMainDialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="mainFormData"
        :rules="mainFormRules"
        ref="mainForm"
        label-width="210px"
      >
        <el-form-item
          label="产品适用范围及应用手术名称"
          prop="SURGICAL_PRO_NAME"
        >
          <el-input
            v-model="mainFormData.SURGICAL_PRO_NAME"
            placeholder="请输入产品适用范围及应用手术名称"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
        <el-form-item label="患者姓名" prop="PATIENT_NAME">
          <el-input
            v-model="mainFormData.PATIENT_NAME"
            placeholder="请输入患者姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="PHONE">
          <el-input
            v-model="mainFormData.PHONE"
            placeholder="请输入联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!isEditMain" label="失效日期" prop="EXPIRATION_TIME">
          <el-date-picker
            v-model="mainFormData.EXPIRATION_TIME"
            type="date"
            placeholder="请选择失效日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手写备注栏" prop="REMARK">
          <el-input
            v-model="mainFormData.REMARK"
            placeholder="请输入备注"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMainDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="submitMainForm"
          :loading="mainFormLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog
      title="审批"
      :visible.sync="approveDialogVisible"
      width="500px"
      @close="closeApproveDialog"
      :close-on-click-modal="false"
    >
      <el-form :model="approveFormData" ref="approveForm" label-width="100px">
        <el-form-item label="审批意见">
          <el-input
            v-model="approveFormData.spRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入审批意见（拒绝时必填）"
          ></el-input>
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            <i class="el-icon-info"></i> 选择"不通过"时必须填写拒绝原因
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeApproveDialog">取 消</el-button>
        <el-button
          type="danger"
          @click="handleApprove(false)"
          :loading="approveLoading"
          >不通过</el-button
        >
        <el-button
          type="success"
          @click="handleApprove(true)"
          :loading="approveLoading"
          >通 过</el-button
        >
      </div>
    </el-dialog>

    <!-- 产品选择弹窗 -->
    <el-dialog
      title="选择物料"
      :visible.sync="productSelectDialogVisible"
      width="1200px"
      top="5vh"
      :close-on-click-modal="false"
      @close="closeProductSelectDialog"
    >
      <div class="product-select-content">
        <ele-pro-table
          ref="productTable"
          height="50vh"
          :stripe="true"
          :rowClickChecked="true"
          :rowClickCheckedIntelligent="false"
          :pageSize="productPageSize"
          :columns="productColumns"
          :datasource="productDatasource"
          :selection.sync="productSelection"
          @selection-change="onProductSelectionChange"
        >
          <template v-slot:planLcTimesInput="{ row }">
            <el-input-number
              v-model="row.PLAN_LC_TIMES"
              :min="1"
              :max="99"
              size="mini"
              controls-position="right"
              disabled
            />
          </template>
          <template v-slot:singleLcNumsInput="{ row }">
            <el-input-number
              v-model="row.SINGLE_LC_NUMS"
              :min="1"
              :max="99"
              size="mini"
              controls-position="right"
              disabled
            />
          </template>
          <template v-slot:toolbar>
            <el-form class="ele-form-search" size="mini" inline>
              <el-form-item>
                <el-input
                  style="width: 200px"
                  v-model="productSearchKeyword"
                  placeholder="请输入物料名称/物料编码/型号规格/生产企业搜索"
                  clearable
                  @keyup.enter.native="reloadProductTable"
                />
              </el-form-item>
              <el-form-item>
      <el-input
        style="width: 200px"
        v-model="productSearchKeyword2"
        placeholder="请输入注册证号"
        clearable
        @keyup.enter.native="reloadProductTable"
      />
    </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="reloadProductTable"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </ele-pro-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeProductSelectDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmAddProducts"
          :loading="addProductsLoading"
          >添加物料 ({{ productSelection.length }})</el-button
        >
      </div>
    </el-dialog>

    <!-- 编辑明细弹窗 -->
    <el-dialog
      title="编辑计划临采次数"
      :visible.sync="editDtlDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      @close="closeEditDtlDialog"
    >
      <el-form
        :model="editDtlFormData"
        :rules="editDtlFormRules"
        ref="editDtlForm"
        label-width="120px"
      >
        <el-form-item label="物料名称">
          <span>{{ editDtlFormData.VARIETIE_NAME }}</span>
        </el-form-item>
        <el-form-item label="规格型号">
          <span>{{ editDtlFormData.SPECIFICATION_OR_TYPE }}</span>
        </el-form-item>
        <el-form-item label="计划临采次数" prop="PLAN_LC_TIMES">
          <el-input-number
            v-model="editDtlFormData.PLAN_LC_TIMES"
            :min="1"
            :max="99"
            controls-position="right"
            :disabled="true"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="单次临采数量" prop="SINGLE_LC_NUMS">
          <el-input-number
            v-model="editDtlFormData.SINGLE_LC_NUMS"
            :min="1"
            :max="99"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEditDtlDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="submitEditDtlForm"
          :loading="editDtlLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 临采详情弹窗 -->
    <el-dialog
      title="临采详情"
      :visible.sync="lcDetailDialogVisible"
      width="700px"
      :close-on-click-modal="false"
      @close="closeLcDetailDialog"
    >
      <div v-if="lcDetailCurrentRow" style="margin-bottom: 15px;">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="物料名称">{{ lcDetailCurrentRow.VARIETIE_NAME }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ lcDetailCurrentRow.SPECIFICATION_OR_TYPE }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <el-table
        :data="lcDetailList"
        v-loading="lcDetailLoading"
        border
        size="small"
        max-height="400px"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="ORDER_NUM" label="订单号" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="QTY" label="数量" width="100" align="center" />
        <el-table-column prop="ORDER_TYPE" label="订单类型" width="120" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="getOrderTypeTagType(row.ORDER_TYPE)" size="small">
              {{ getOrderTypeText(row.ORDER_TYPE) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLcDetailDialog">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 打印组件 -->
    <print-pk-lc
      ref="printComponent"
      :main-data="printMainData"
      :dtl-list="printDtlList"
    />
  </div>
</template>

<script>
  import {
    getMainList,
    getMainById,
    insertMain,
    updateMain,
    deleteMain,
    submitMain,
    approveMain,
    getDtlListByMainId,
    insertDtl,
    updateDtl,
    deleteDtl,
    getExistDeptTwoList,
    SerachAuthVarPkLc,
    GetLcDtlPlanList
  } from '@/api/KSInventory/PkLc';
  import { getUserGroupByName } from '@/api/layout/index';
  import PrintPkLc from './components/PrintPkLc.vue';

  export default {
    name: 'PkLcMain',
    components: {
      PrintPkLc
    },
    data() {
      return {
        // ============ 主单相关 ============
        mainPage: 1,
        mainSize: 10,
        mainWhere: {
          id: null,
          deptTwoCode: null,
          state: null,
          searchName: null
        },
        deptTwoOptions: [],
        mainColumns: [
          {
            prop: 'ID',
            label: '申请单号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '申请科室',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'STATE',
            label: '单据状态',
            width: 110,
            align: 'center',
            slot: 'stateTag'
          },
          {
            prop: 'USERNAME',
            label: '申请人工号',
            width: 100,
            align: 'center'
          },
          {
            prop: 'NICKNAME',
            label: '申请人',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PHONE',
            label: '联系方式',
            minWidth: 130,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SURGICAL_PRO_NAME',
            label: '产品适用范围及应用手术名称',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REMARK',
            label: '手写备注栏',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PATIENT_NAME',
            label: '患者姓名',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'EXPIRATION_TIME',
            label: '失效日期',
            minWidth: 120,
            align: 'center',
            formatter: (row) => this.formatDate(row.EXPIRATION_TIME)
          },
          {
            prop: 'CREATE_TIME',
            label: '申请日期',
            minWidth: 160,
            align: 'center',
            formatter: (row) => this.formatDateTime(row.CREATE_TIME)
          },
          {
            prop: 'APP_MAN',
            label: '审批人',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APP_TIME',
            label: '审批时间',
            minWidth: 160,
            align: 'center',
            formatter: (row) => this.formatDateTime(row.APP_TIME)
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 280,
            align: 'center',
            slot: 'mainAction',
            fixed: 'right'
          }
        ],
        selectedMain: null,
        mainDialogVisible: false,
        mainDialogTitle: '新增主单',
        isEditMain: false,
        mainFormLoading: false,
        mainFormData: {
          ID: null,
          PATIENT_NAME: '',
          PHONE: '',
          SURGICAL_PRO_NAME: '',
          REMARK: '',
          EXPIRATION_TIME: null
        },
        mainFormRules: {
          SURGICAL_PRO_NAME: [
            {
              required: true,
              message: '请输入产品适用范围及应用手术名称',
              trigger: 'blur'
            }
          ],
          PATIENT_NAME: [
            {
              required: true,
              message: '请输入患者姓名',
              trigger: 'blur'
            }
          ],
          EXPIRATION_TIME: [
            {
              required: true,
              message: '请选择失效日期',
              trigger: 'change'
            }
          ]
        },
        // 审批相关
        approveDialogVisible: false,
        approveFormData: {
          id: null,
          spRemark: ''
        },
        approveLoading: false,

        // ============ 明细相关 ============
        dtlPage: 1,
        dtlSize: 10,
        dtlColumns: [
          {
            columnKey: 'index',
            type: 'index',
            width: 60,
            label: '序号',
            align: 'center'
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '物料编码',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '物料名称',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BRAND',
            label: '品牌',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          minWidth: 150,
          align: 'center',
          showOverflowTooltip: true
        },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PRICE',
            label: '价格',
            width: 100,
            align: 'center'
          },
          {
            prop: 'PLAN_LC_TIMES',
            label: '计划临采次数',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SINGLE_LC_NUMS',
            label: '单次临采数量',
            width: 120,
            align: 'center'
          },
          {
            prop: 'LC_TIMES',
            label: '已临采次数',
            width: 120,
            align: 'center',
            slot: 'lcTimesLink'
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 180,
            align: 'center',
            slot: 'dtlAction',
            fixed: 'right'
          }
        ],
        // ============ 编辑明细弹窗相关 ============
        editDtlDialogVisible: false,
        editDtlLoading: false,
        editDtlFormData: {
          ID: null,
          VARIETIE_NAME: '',
          SPECIFICATION_OR_TYPE: '',
          PLAN_LC_TIMES: 10,
          SINGLE_LC_NUMS: 1
        },
        editDtlFormRules: {
          PLAN_LC_TIMES: [
            { required: true, message: '请输入计划临采次数', trigger: 'blur' }
          ],
          SINGLE_LC_NUMS: [
            { required: true, message: '请输入单次临采数量', trigger: 'blur' }
          ]
        },

        // ============ 产品选择弹窗相关 ============
        productSelectDialogVisible: false,
        productSearchKeyword: '',
        productSearchKeyword2: '', // 新增：注册证号搜索条件
        productPageSize: 10,
        productSelection: [],
        addProductsLoading: false,
        productColumns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            columnKey: 'index',
            type: 'index',
            width: 50,
            label: '序号',
            align: 'center'
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '物料编码',
            minWidth: 130,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VARIETIE_NAME',
            label: '物料名称',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Brand',
            label: '品牌',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          }, {
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '型号/规格',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Price',
            label: '价格',
            width: 100,
            align: 'center'
          },
          {
            prop: 'PLAN_LC_TIMES',
            label: '计划临采次数',
            width: 130,
            align: 'center',
            slot: 'planLcTimesInput'
          },
          {
            prop: 'SINGLE_LC_NUMS',
            label: '单次临采数量',
            width: 130,
            align: 'center',
            slot: 'singleLcNumsInput'
          }
        ],

        // ============ 临采详情弹窗相关 ============
        lcDetailDialogVisible: false,
        lcDetailLoading: false,
        lcDetailList: [],
        lcDetailCurrentRow: null,

        // ============ 打印相关 ============
        printLoading: false,
        printMainData: {},
        printDtlList: [],

        // ============ 权限相关 ============
        hasApprovePermission: false
      };
    },
    computed: {
      // 是否可以编辑明细：仅在选中主单且状态为已提交(0)或审批不通过(-1)时可编辑
      canEditDtl() {
        return (
          this.selectedMain &&
          (this.selectedMain.STATE === 0 ||this.selectedMain.STATE === 1 || this.selectedMain.STATE === -1)
        );
      }
    },
    created() {
      this.loadDeptTwoOptions();
      this.checkApprovePermission();
    },
    methods: {
      // 检查是否有审批权限
      async checkApprovePermission() {
        try {
          const username = this.$store.state.user.info?.UserName || '';
          if (!username) return;
          const res = await getUserGroupByName({ username });

          const permissionGroup = res.permission_group || [];
          this.hasApprovePermission = permissionGroup.some(
            (item) => item.Permission_Name === '临采管理审批按钮'
          );

          // 权限检查完成后，如果表格已渲染则强制刷新以更新按钮显示状态
          this.$nextTick(() => {
            if (this.$refs.mainTable) {
              this.$refs.mainTable.$forceUpdate();
            }
          });
        } catch (error) {
          console.error('检查审批权限失败:', error);
          this.hasApprovePermission = false;
        }
      },
      // 加载二级科室选项
      async loadDeptTwoOptions() {
        try {
          const res = await getExistDeptTwoList();
          this.deptTwoOptions = res || [];
        } catch (error) {
          console.error('加载二级科室选项失败:', error);
        }
      },
      // ============ 主单方法 ============
      // 清空主单选中状态和明细数据
      clearMainSelection() {
        this.selectedMain = null;
        this.$nextTick(() => {
          this.$refs.dtlTable && this.$refs.dtlTable.reload();
        });
      },
      mainDatasource({ page, limit }) {
        this.mainPage = page;
        // 主单刷新时清空选中状态
        this.clearMainSelection();
        return getMainList({
          page,
          limit,
          where: this.mainWhere
        })
          .then((res) => {
            return { count: res.total, list: res.result };
          })
          .catch((error) => {
            console.error('获取主单列表失败:', error);
            return { count: 0, list: [] };
          });
      },
      reloadMain() {
        this.$refs.mainTable.reload({ page: 1 });
      },
      onMainCurrentChange(current) {
        if (
          current &&
          (!this.selectedMain || this.selectedMain.ID !== current.ID)
        ) {
          this.selectedMain = current;
          this.dtlPage = 1;
          this.$nextTick(() => {
            this.$refs.dtlTable && this.$refs.dtlTable.reload();
          });
        }
      },
      onMainSizeChange(size) {
        this.mainSize = size;
      },
      mainTableRowClassName({ row }) {
        if (row.STATE === -1) return 'row-reject';
        if (row.STATE === 2) return 'row-approved';
        return '';
      },
      getStateText(state) {
        const map = { 0: '新增', 1: '已提交', 2: '已审批', '-1': '审批不通过' };
        return map[state] || '未知';
      },
      getStateTagType(state) {
        const map = { 0: 'info', 1: 'warning', 2: 'success', '-1': 'danger' };
        return map[state] || 'info';
      },
      formatDateTime(dateTime) {
        if (!dateTime) return '';
        return dateTime.replace('T', ' ');
      },
      formatDate(dateTime) {
        if (!dateTime) return '';
        return dateTime.split('T')[0];
      },
      openAddMainDialog() {
        this.isEditMain = false;
        this.mainDialogTitle = '新增主单';
        this.resetMainForm();
        // 设置失效日期默认为当前自然年的最后一天
        const currentYear = new Date().getFullYear();
        this.mainFormData.EXPIRATION_TIME = `${currentYear}-12-31`;
        this.mainDialogVisible = true;
      },
      editMainItem(row) {
        this.isEditMain = true;
        this.mainDialogTitle = '编辑主单';
        this.mainFormData = {
          ID: row.ID,
          PATIENT_NAME: row.PATIENT_NAME,
          PHONE: row.PHONE,
          SURGICAL_PRO_NAME: row.SURGICAL_PRO_NAME,
          REMARK: row.REMARK,
          EXPIRATION_TIME: row.EXPIRATION_TIME ? row.EXPIRATION_TIME.split('T')[0] : null
        };
        this.mainDialogVisible = true;
      },
      resetMainForm() {
        this.mainFormData = {
          ID: null,
          PATIENT_NAME: '',
          PHONE: '',
          SURGICAL_PRO_NAME: '',
          REMARK: '',
          EXPIRATION_TIME: null
        };
        this.$nextTick(() => {
          this.$refs.mainForm && this.$refs.mainForm.clearValidate();
        });
      },
      closeMainDialog() {
        this.mainDialogVisible = false;
        this.resetMainForm();
      },
      submitMainForm() {
        this.$refs.mainForm.validate(async (valid) => {
          if (!valid) return;
          this.mainFormLoading = true;
          try {
            if (this.isEditMain) {
              const res = await updateMain(this.mainFormData);
              if (res.code === 200) {
                this.$message.success('编辑成功');
                this.closeMainDialog();
                this.$refs.mainTable.reload();
              } else {
                this.$message.error(res.msg || '编辑失败');
              }
            } else {
              const data = {
                ...this.mainFormData,
                DEPT_TWO_CODE:
                  this.$store.state.user.info?.DeptNow?.Dept_Two_Code || ''
              };
              const res = await insertMain(data);
              if (res.code === 200) {
                this.$message.success('新增成功');
                this.closeMainDialog();
                this.$refs.mainTable.reload();
              } else {
                this.$message.error(res.msg || '新增失败');
              }
            }
          } catch (error) {
            this.$message.error('操作失败：' + (error.msg || error));
          } finally {
            this.mainFormLoading = false;
          }
        });
      },
      async submitMainItem(row) {
        try {
          await this.$confirm('确定提交该主单？', '提示', { type: 'warning' });
          const res = await submitMain(row.ID);
          if (res.code === 200) {
            this.$message.success('提交成功');
            this.$refs.mainTable.reload();
          } else {
            this.$message.error(res.msg || '提交失败');
          }
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error('提交失败：' + (error.msg || error));
          }
        }
      },
      async deleteMainItem(row) {
        try {
          const res = await deleteMain(row.ID);
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.$refs.mainTable.reload();
          } else {
            this.$message.error(res.msg || '删除失败');
          }
        } catch (error) {
          this.$message.error('删除失败：' + (error.msg || error));
        }
      },
      // 审批相关
      openApproveDialog(row) {
        this.approveFormData = {
          id: row.ID,
          spRemark: ''
        };
        this.approveDialogVisible = true;
      },
      closeApproveDialog() {
        this.approveDialogVisible = false;
        this.approveFormData = { id: null, spRemark: '' };
      },
      async handleApprove(approved) {
        // 拒绝时必须填写审批意见
        if (!approved && !this.approveFormData.spRemark.trim()) {
          this.$message.warning('拒绝时必须填写拒绝原因');
          return;
        }
        this.approveLoading = true;
        try {
          const res = await approveMain({
            id: this.approveFormData.id,
            state: approved ? 2 : -1, // 2表示通过，-1表示不通过
            spRemark: this.approveFormData.spRemark
          });
          if (res.code === 200) {
            this.$message.success(approved ? '审批通过' : '审批不通过');
            this.closeApproveDialog();
            this.$refs.mainTable.reload();
          } else {
            this.$message.error(res.msg || '审批失败');
          }
        } catch (error) {
          this.$message.error('审批失败：' + (error.msg || error));
        } finally {
          this.approveLoading = false;
        }
      },

      // ============ 明细方法 ============
      dtlDatasource({ page, limit }) {
        if (!this.selectedMain) {
          return Promise.resolve({ count: 0, list: [] });
        }
        this.dtlPage = page;
        return getDtlListByMainId(this.selectedMain.ID)
          .then((list) => {
            // 前端分页（如果后端不支持分页）
            const start = (page - 1) * limit;
            const end = start + limit;
            return { count: list.length, list: list.slice(start, end) };
          })
          .catch((error) => {
            console.error('获取明细列表失败:', error);
            return { count: 0, list: [] };
          });
      },
      onDtlSizeChange(size) {
        this.dtlSize = size;
        this.dtlPage = 1;
        this.$nextTick(() => {
          this.$refs.dtlTable && this.$refs.dtlTable.reload();
        });
      },
      async deleteDtlItem(row) {
        try {
          const res = await deleteDtl(row.ID);
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.$refs.dtlTable.reload();
          } else {
            this.$message.error(res.msg || '删除失败');
          }
        } catch (error) {
          this.$message.error('删除失败：' + (error.msg || error));
        }
      },
      // ============ 编辑明细弹窗方法 ============
      openEditDtlDialog(row) {
        this.editDtlFormData = {
          ID: row.ID,
          VARIETIE_NAME: row.VARIETIE_NAME,
          SPECIFICATION_OR_TYPE: row.SPECIFICATION_OR_TYPE,
          PLAN_LC_TIMES: row.PLAN_LC_TIMES || 10,
          SINGLE_LC_NUMS: row.SINGLE_LC_NUMS || 1
        };
        this.editDtlDialogVisible = true;
      },
      closeEditDtlDialog() {
        this.editDtlDialogVisible = false;
        this.editDtlFormData = {
          ID: null,
          VARIETIE_NAME: '',
          SPECIFICATION_OR_TYPE: '',
          PLAN_LC_TIMES: 10,
          SINGLE_LC_NUMS: 1
        };
      },
      submitEditDtlForm() {
        this.$refs.editDtlForm.validate(async (valid) => {
          if (!valid) return;
          this.editDtlLoading = true;
          try {
            const res = await updateDtl({
              ID: this.editDtlFormData.ID,
              PLAN_LC_TIMES: this.editDtlFormData.PLAN_LC_TIMES,
              SINGLE_LC_NUMS: this.editDtlFormData.SINGLE_LC_NUMS
            });
            if (res.code === 200) {
              this.$message.success('修改成功');
              this.closeEditDtlDialog();
              this.$refs.dtlTable.reload();
            } else {
              this.$message.error(res.msg || '修改失败');
            }
          } catch (error) {
            this.$message.error('修改失败：' + (error.msg || error));
          } finally {
            this.editDtlLoading = false;
          }
        });
      },

      // ============ 产品选择弹窗方法 ============
      openProductSelectDialog() {
        if (!this.selectedMain) {
          this.$message.warning('请先选择主单');
          return;
        }
        this.productSearchKeyword = '';
        this.productSearchKeyword2 = ''; // 新增：重置注册证号
        this.productSelection = [];
        this.productSelectDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.productTable &&
            this.$refs.productTable.reload({ page: 1 });
        });
      },
      closeProductSelectDialog() {
        this.productSelectDialogVisible = false;
        this.productSearchKeyword = '';
        this.productSearchKeyword2 = ''; // 新增：重置注册证号
        this.productSelection = [];
      },
      reloadProductTable() {
        this.$refs.productTable && this.$refs.productTable.reload({ page: 1 });
      },
      productDatasource({ page, limit, where }) {
        const deptCode =
          this.$store.state.user.info?.DeptNow?.Dept_Two_Code || '';
        return SerachAuthVarPkLc({
          page,
          limit,
          where: {
            DeptCode: deptCode,
            SerachName: this.productSearchKeyword,
            manufacturer: this.productSearchKeyword2 // 新增：传递注册证号
          }
        })
          .then((res) => {
            // 为每个产品设置默认计划临采次数为10
            const listWithDefault = (res.result || []).map((item) => ({
              ...item,
              PLAN_LC_TIMES: item.PLAN_LC_TIMES || 10,
              SINGLE_LC_NUMS: item.SINGLE_LC_NUMS || 1
            }));
            return {
              count: res.total,
              list: listWithDefault
            };
          })
          .catch((error) => {
            console.error('获取产品列表失败:', error);
            return { count: 0, list: [] };
          });
      },
      onProductSelectionChange(selection) {
        this.productSelection = selection;
      },
      async confirmAddProducts() {
        if (this.productSelection.length === 0) {
          this.$message.warning('请至少选择一个产品');
          return;
        }
        this.addProductsLoading = true;

        const codes = this.productSelection.map((p) => p.VARIETIE_CODE);
        const times = this.productSelection.map((p) => p.PLAN_LC_TIMES || 10);
        const singleNums = this.productSelection.map((p) => p.SINGLE_LC_NUMS || 1);

        try {
          const res = await insertDtl({
            PK_LC_MAIN_ID: this.selectedMain.ID,
            VARIETIE_CODES: codes,
            PLAN_LC_TIMES: times,
            SINGLE_LC_NUMS: singleNums,
          });
          if (res.code === 200) {
            this.$message.success('成功添加');
            this.closeProductSelectDialog();
            this.$refs.dtlTable.reload();
          } else {
            throw res;
          }
        } catch (error) {
          this.$message.error('添加失败：' + (error.msg || error));
        } finally {
          this.addProductsLoading = false;
        }
      },

      // ============ 临采详情弹窗方法 ============
      async openLcDetailDialog(row) {
        this.lcDetailCurrentRow = row;
        this.lcDetailDialogVisible = true;
        this.lcDetailLoading = true;
        try {
          const list = await GetLcDtlPlanList(row.ID);
          this.lcDetailList = list || [];
        } catch (error) {
          this.$message.error('获取临采详情失败：' + (error.msg || error.message || error));
          this.lcDetailList = [];
        } finally {
          this.lcDetailLoading = false;
        }
      },
      closeLcDetailDialog() {
        this.lcDetailDialogVisible = false;
        this.lcDetailList = [];
        this.lcDetailCurrentRow = null;
      },
      getOrderTypeText(orderType) {
        const map = {
          '1': '备货',
          '2': '跟台',
        };
        return map[orderType] || orderType || '未知';
      },
      getOrderTypeTagType(orderType) {
        const map = {
          '1': 'info',
          '2': 'warning',
        };
        return map[orderType] || 'info';
      },

      // ============ 打印方法 ============
      async handlePrint() {
        if (!this.selectedMain) {
          this.$message.warning('请先选择主单');
          return;
        }
        this.printLoading = true;
        try {
          // 设置主单数据
          this.printMainData = { ...this.selectedMain };
          // 获取明细数据
          const dtlList = await getDtlListByMainId(this.selectedMain.ID);
          this.printDtlList = dtlList || [];

          // 等待DOM更新后下载PDF
          this.$nextTick(async () => {
            try {
              await this.$refs.printComponent.downloadPdf();
              this.$message.success('PDF下载成功');
            } catch (error) {
              this.$message.error('生成PDF失败：' + error.message);
            } finally {
              this.printLoading = false;
            }
          });
        } catch (error) {
          this.$message.error('获取打印数据失败：' + (error.msg || error));
          this.printLoading = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .pk-lc-main-page {
    .half-table {
      margin-bottom: 20px;
    }

    ::v-deep .row-reject {
      background: #fef0f0 !important;
      color: #f56c6c !important;
    }

    ::v-deep .row-approved {
      background: #f0f9eb !important;
      color: #67c23a !important;
    }
  }
</style>
