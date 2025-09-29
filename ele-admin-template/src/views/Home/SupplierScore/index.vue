<template>
  <div class="ele-body supplier-score-page">
    <!-- 顶部类型Tab -->
    <div class="header vendor-type-tabs">
      <span
        v-for="type in vendorTypes"
        :key="type"
        @click="onVendorTypeTabClick(type)"
        :class="{ active: where.vendorType === type }"
      >
        {{ type }}
      </span>
    </div>
    <div class="half-table">
      <el-card shadow="never">
        <!-- 数据表格 -->
        <ele-pro-table
          ref="table"
          class="table-supplier-score"
          :columns="columns"
          :currentPage="page"
          :pageSize="size"
          :highlightCurrentRow="true"
          :datasource="datasource"
          :row-class-name="tableRowClassName"
          :selection.sync="selection"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
          height="30vh"
          full-height="calc(100vh - 120px)"
        >
          <template v-slot:action="{ row }">
            <el-button
              size="mini"
              type="primary"
              @click.stop="editItem(row)"
              style="margin-right: 4px;"
            >编辑</el-button>

            <el-popconfirm
              title="确定撤回？"
              @confirm="handleRevoke(row)"
            >
              <template v-slot:reference>
                <el-button
                  size="mini"
                  type="warning"
                  :disabled="row.STATUS !== '1'"
                  style="margin-right: 4px;"
                  @click.stop
                >撤回</el-button>
              </template>
            </el-popconfirm>

            <el-popconfirm
              title="确定删除？"
              @confirm="deleteItem(row)"
            >
              <template v-slot:reference>
                <el-button
                  size="mini"
                  type="danger"
                  style="margin-right: 4px;"
                  @click.stop
                >删除</el-button>
              </template>
            </el-popconfirm>
          </template>
          <template v-slot:toolbar>
            <!-- 搜索表单 -->
            <el-form class="form-box" inline>
              <el-form-item>
                <el-input
                  size="mini"
                  v-model="where.keyword"
                  placeholder="请输入服务机构或供应商名称"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-search"
                  @click="reload"
                >
                  搜索
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-plus"
                  @click="openAddDialog"
                >
                  新增
                </el-button>
              </el-form-item>
              <el-form-item v-if="scoreButtonPermission">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-star-on"
                  :disabled="!selectedSupplier"
                  @click="openScoreDialog"
                >评分</el-button>
              </el-form-item>
              <el-form-item v-if="where.vendorType === '供应商'">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-refresh"
                  :loading="syncLoading"
                  @click="syncSuppliers"
                >
                  同步
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="mini"
                  icon="el-icon-download"
                  @click="downloadTemplate"
                >
                  模板下载
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-upload
                  action="#"
                  :show-file-list="false"
                  :before-upload="() => false"
                  :on-change="handleImportExcel"
                  accept=".xlsx"
                >
                  <el-button size="mini" icon="el-icon-upload2">导入</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="success" icon="el-icon-download" @click="handleExportAll">导出</el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-document"
                  @click="openExportAllSuppliersScoreDialog"
                >导出全部供应商分数</el-button>
              </el-form-item>
            </el-form>
          </template>
        </ele-pro-table>
      </el-card>
    </div>
    <!-- 导出全部供应商分数 年份选择弹窗 -->
    <el-dialog
      title="选择年份"
      :visible.sync="exportAllScoreDialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="评分年份">
          <el-date-picker
            v-model="exportAllScoreYear"
            type="year"
            placeholder="选择年份"
            :clearable="false"
            style="width: 200px;"
            value-format="yyyy"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeExportAllSuppliersScoreDialog">取 消</el-button>
        <el-button type="primary" @click="confirmExportAllSuppliersScore" :loading="exportingAllScore">确 定</el-button>
      </div>
    </el-dialog>
    <div class="half-table">
      <el-card v-if="selectedSupplier || true" shadow="never">
        <ele-pro-table
          ref="scoreTable"
          :columns="scoreRecordColumns"
          :datasource="scoreRecordDatasource"
          :currentPage="scoreRecordPage"
          :pageSize="scoreRecordPageSize"
          @size-change="onScoreRecordPageSizeChange"
          :empty-text="selectedSupplier ? '暂无评分记录' : '请选择供应商'"
          height="30vh"
          full-height="calc(100vh - 120px)"
        >
          <template v-slot:scoreRecordAction="{ row }">
            <el-button
              size="mini"
              type="primary"
              @click.stop="viewScoreDetail(row)"
              style="margin-right: 4px;"
            >详情</el-button>
            <el-button
              size="mini"
              type="success"
              @click.stop="handleExportWord(row)"
              style="margin-right: 4px;margin-left: 0px;"
            >导出</el-button>
            <el-popconfirm
              title="确定删除此评分批次？"
              @confirm="deleteScoreBatch(row)"
            >
              <template v-slot:reference>
                <el-button
                  size="mini"
                  type="danger"
                  @click.stop
                >删除</el-button>
              </template>
            </el-popconfirm>
          </template>
          <template v-slot:toolbar>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-download"
              :disabled="!selectedSupplier"
              @click="handleExportAllScoreRecords"
            >
              导出全部评分记录
            </el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-document"
              :disabled="!selectedSupplier"
              @click="openExportScoreDialog"
              style="margin-left: 8px;"
            >
              导出供应商分数
            </el-button>
          </template>
        </ele-pro-table>
      </el-card>
    </div>
    <!-- 导出分数年份选择弹窗 -->
    <el-dialog
      title="选择年份"
      :visible.sync="exportScoreDialogVisible"
      width="360px"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="评分年份">
          <el-date-picker
            v-model="exportScoreYear"
            type="year"
            placeholder="选择年份"
            :clearable="false"
            style="width: 200px;"
            value-format="yyyy"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeExportScoreDialog">取 消</el-button>
        <el-button type="primary" @click="confirmExportSupplierScore" :loading="exportingScore">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      @close="closeDialog"
    >
      <el-form
        :model="formData"
        :rules="formRules"
        ref="form"
        label-width="165px"
      >
        <el-form-item label="注册编码" prop="Supplier_Code">
          <el-input
            v-model="formData.Supplier_Code"
            placeholder="请输入注册编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务机构或供应商名称" prop="Supplier_Name">
          <el-input
            v-model="formData.Supplier_Name"
            placeholder="请输入服务机构或供应商名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务或供应项目" prop="SUPPLY_ITEMS">
          <el-input
            v-model="formData.SUPPLY_ITEMS"
            placeholder="请输入服务或供应项目"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="ADDRESS">
          <el-input
            v-model="formData.ADDRESS"
            placeholder="请输入地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系信息" prop="CONTACT_INFO">
          <el-input
            v-model="formData.CONTACT_INFO"
            placeholder="请输入联系信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 评分详情弹窗 -->
    <el-dialog
      title="评分详情"
      :visible.sync="scoreDetailVisible"
      width="1000px"
      @close="closeScoreDetail"
      :close-on-click-modal="false"
    >
      <div v-loading="scoreDetailLoading">
        <div v-if="scoreDetailData">
          <!-- <el-descriptions :column="2" border>
            <el-descriptions-item label="评分时间">{{ scoreDetailData.Batch.EVAL_TIME }}</el-descriptions-item>
            <el-descriptions-item label="评分人">{{ scoreDetailData.Batch.EVALUATOR_NAME }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ scoreDetailData.Batch.REMARK || '无' }}</el-descriptions-item>
          </el-descriptions> -->

          <el-table
            :data="processedScoreDetailData"
            height="500px"
            style="margin-top: 20px;"
            border
            :span-method="mergeScoreDetailRows"
          >
            <el-table-column prop="CATEGORY_NAME" label="评审内容" min-width="100" align="center" />
            <el-table-column prop="ITEM_NAME" label="评分项" min-width="260" />
            <el-table-column prop="SCORE" label="评分" min-width="200" align="center" >
              <template v-slot="{ row }">
                <span v-if="row.ITEM_TYPE === '评分'">{{ row.SCORE }}</span>
                <span v-else-if="row.ITEM_TYPE === '选择'">{{ row.SCORE === 1 ? '是' : '否' }}</span>
                <span v-else-if="row.ITEM_TYPE === '文本'">{{ row.TEXT || '' }}</span>
                <span v-else>{{ row.SCORE }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScoreDetail">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 评分弹窗 -->
    <el-dialog
      :title="`${where?.vendorType || ''}评分`"
      :visible.sync="scoreDialogVisible"
      top="5vh"
      width="900px"
      @close="closeScoreDialog"
      :close-on-click-modal="false"
    >
      <div v-loading="scoreRulesLoading" class="score-dialog-content">
        <div style="margin-bottom: 16px;">
          <el-form :inline="true" label-width="80px">
            <el-form-item label="评分年份">
              <el-date-picker
                v-model="scoreYear"
                type="year"
                placeholder="选择年份"
                :clearable="false"
                style="width: 120px;"
                value-format="yyyy"
              />
            </el-form-item>
          </el-form>
        </div>

        <div v-if="selectedSupplier && scoreRules.length > 0">
          <!-- 评分规则和实时分数显示 -->
          <el-descriptions title="评分信息" :column="2" border style="margin-bottom: 16px;" v-if="showCurrentScore">
            <el-descriptions-item label="评分标准">
              <div class="score-standard">
                <el-tag type="primary" size="small">80-100分：合格供应商</el-tag>
                <el-tag type="success" size="small">60-80分：供应商须改进</el-tag>
                <el-tag type="danger" size="small">60分以下：不合格供应商</el-tag>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="当前总分">
              <div class="score-display">
                <span class="score-number">{{ currentTotalScore }}</span>
                <span class="score-unit">分</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>

          <el-table :data="groupedScoreRules" border height="500px">
            <el-table-column prop="CATEGORY_NAME" label="评审内容" min-width="120" align="center" />
            <el-table-column label="评分项" min-width="580">
              <template v-slot="{ row }">
                <div v-for="(item, index) in row.items" :key="index" class="score-item">
                  <div class="item-name">
                    <span>{{ item.ITEM_NAME }}</span>
                    <span v-if="item.ITEM_TYPE === '评分'" class="score-range">（ {{ item.MIN_SCORE }} ~ {{ item.MAX_SCORE }}分）</span>
                  </div>
                  <div class="item-input">
                    <!-- 评分型 -->
                    <el-input-number
                      v-if="item.ITEM_TYPE === '评分'"
                      v-model="item.score"
                      :min="0"
                      :max="item.MAX_SCORE || 100"
                      :step="1"
                      size="mini"
                      style="width: 100px;"
                      placeholder="请输入分数"
                    ></el-input-number>

                    <!-- 选择型 -->
                    <el-radio-group
                      v-else-if="item.ITEM_TYPE === '选择'"
                      v-model="item.score"
                      size="mini"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>

                    <!-- 文本型 -->
                    <el-input
                      v-else-if="item.ITEM_TYPE === '文本'"
                      v-model="item.text"
                      size="mini"
                      style="width: 260px;"
                      placeholder="请输入文本内容"
                      type="textarea"
                      :rows="2"
                      maxlength="200"
                      show-word-limit
                    ></el-input>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScoreDialog">取 消</el-button>
        <el-button type="primary" @click="submitScore" :loading="scoreSubmitting">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  ::v-deep .row-disabled {
    background: #f5f5f5 !important;
    color: #b0b0b0 !important;
  }


  .half-table {
    margin-bottom: 20px;
  }
  .vendor-type-tabs {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .vendor-type-tabs span {
    flex: 1;
    text-align: center;
    padding: 5px 0;
    cursor: pointer;
    position: relative;
    font-size: 16px;
    color: #333;
    transition: color 0.2s;
  }
  .vendor-type-tabs span.active {
    color: #007bff;
    font-weight: bold;
  }
  .vendor-type-tabs span.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #007bff;
  }
  .el-form-item {
    //gap: 10px;
    margin-bottom: 0;
  }
  .where-type {
    width: 10rem;
  }

  // 评分弹窗样式
  .score-dialog-content {
    min-height: 300px;
    display: flex;
    flex-direction: column;
  }

  .score-item {
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    min-height: 40px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .score-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .item-name {
    flex: 1;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
    word-break: break-word;
    margin-right: 16px;
  }

  .score-range {
    color: #666;
    font-size: 12px;
    font-weight: normal;
  }

  .item-input {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
  }

  .item-input .el-textarea {
    width: 100%;
  }

  .item-input .el-textarea__inner {
    font-size: 12px;
  }

  // 评分标准样式
  .score-standard {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .score-standard .el-tag {
    margin: 2px 0;
  }

  // 分数显示样式
  .score-display {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .score-number {
    font-size: 20px;
    font-weight: bold;
    color: #409eff;
  }

  .score-unit {
    font-size: 14px;
    color: #606266;
  }

  .score-progress {
    font-size: 12px;
    color: #909399;
    margin-left: 8px;
  }


</style>

<script>
  import {
    apiSupplierScoreGetList,
    addSupplierScore,
    updateSupplierScore,
    deleteSupplierScore,
    getSupplierScoreRecords,
    getVendorScoreBatchDetail,
    deleteVendorScoreBatch,
    getVendorScoreRules,
    createVendorScoreRecord,
    batchImportSuppliers,
    syncSuppliers,
    updateVendorStatus
  } from '@/api/Home/supplierScore';
  import { Loading } from 'element-ui';
  import * as XLSX from 'xlsx';
  import { saveAs } from 'file-saver';
  import store from '@/store';

  export default {  
    data() {
      return {
        vendorTypes: ['供应商', '服务商', '计量供应商', '第三方检验机构'],
        //表格数据源
        supplierScoreList: [],
        selection: [],
        // 条件
        where: {
          keyword: '',
          vendorType: '供应商' // 默认显示供应商类型
        },
        //页
        page: 1,
        size: 20,
        // 弹窗相关
        dialogVisible: false,
        dialogTitle: '新增供应商',
        isEdit: false,
        formData: {
          ID: '',
          Supplier_Code: '',
          Supplier_Name: '',
          VENDOR_TYPE: '供应商',
          SUPPLY_ITEMS: '',
          ADDRESS: '',
          CONTACT_INFO: ''
        },
        formRules: {
          Supplier_Code: [
            { required: true, message: '请输入注册编码', trigger: 'blur' }
          ],
          Supplier_Name: [
            { required: true, message: '请输入服务机构或供应商名称', trigger: 'blur' }
          ],
          VENDOR_TYPE: [
            { required: true, message: '请选择供应商类型', trigger: 'change' }
          ],
          SUPPLY_ITEMS: [
            { required: true, message: '请输入服务或供应项目', trigger: 'blur' }
          ]
        },
        //字段列表
        columns: [
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
            width: 66,
            label: '序号',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SUPPLIER_CODE',
            label: '供应商编码',
            minWidth: 160,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGISTER_NO',
            label: '注册编码',
            minWidth: 120,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VENDOR_NAME',
            label: '服务机构或供应商名称',
            minWidth: 300,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SUPPLY_ITEMS',
            label: '服务或供应项目',
            minWidth: 200,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ADDRESS',
            label: '地址',
            minWidth: 200,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'CONTACT_INFO',
            label: '联系信息',
            minWidth: 150,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'CREATE_TIME',
            label: '创建时间',
            minWidth: 120,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            formatter: (row) => this.formatDateTime(row.CREATE_TIME)
          },
          {
            prop: 'UPDATE_TIME',
            label: '更新时间',
            minWidth: 120,
            sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            formatter: (row) => this.formatDateTime(row.UPDATE_TIME)
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 220,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true,
            fixed: 'right'
          }
        ],
        selectedSupplier: null,
        scoreRecordList: [],
        scoreRecordTotal: 0,
        scoreRecordPage: 1,
        scoreRecordPageSize: 10,
        scoreRecordLoading: false,
        scoreRecordColumns: [
          { prop: 'EVALUATOR_NAME', label: '评分人', minWidth: 120, align: 'center' },
          { prop: 'EVAL_YEAR', label: '评分年份', minWidth: 120, align: 'center' },
          { prop: 'EVAL_TIME', label: '评分时间', minWidth: 160, align: 'center', formatter: (row) => this.formatDateTime(row.EVAL_TIME) },
          { prop: 'TOTAL_SCORE', label: '得分', minWidth: 100, align: 'center', formatter: (row) => this.calculateTotalScore(row) },
          { prop: 'REMARK', label: '备注', minWidth: 200, align: 'center', showOverflowTooltip: true },
          {
            columnKey: 'action',
            label: '操作',
            width: 220,
            align: 'center',
            slot: 'scoreRecordAction'
          }
        ],
        scoreDetailVisible: false,
        scoreDetailData: null,
        scoreDialogVisible: false,
        scoreFormData: {},
        scoreFormRules: {},
        scoreRules: [],
        scoreSubmitting: false,
        scoreYear: String(new Date().getFullYear()),
        scoreRulesLoading: false,
        groupedScoreRules: [],
        scoreDetailLoading: false,
        syncLoading: false,
        // 导出分数弹窗
        exportScoreDialogVisible: false,
        exportScoreYear: String(new Date().getFullYear()),
        exportingScore: false,
        // 导出全部供应商分数
        exportAllScoreDialogVisible: false,
        exportAllScoreYear: String(new Date().getFullYear()),
        exportingAllScore: false,
      };
    },
    computed: {
      processedScoreDetailData() {
        if (!this.scoreDetailData || !this.scoreDetailData.Records) {
          return [];
        }

        const records = this.scoreDetailData.Records;
        const categoryMap = new Map();

        // 统计每个分类的数量和起始位置
        records.forEach((record, index) => {
          const category = record.CATEGORY_NAME || '未分类'; // 处理空分类名
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { firstIndex: index, count: 0, indices: [] });
          }
          categoryMap.get(category).count++;
          categoryMap.get(category).indices.push(index);
        });

        // 为每条记录添加合并信息
        return records.map((record, index) => {
          const category = record.CATEGORY_NAME || '未分类';
          const categoryInfo = categoryMap.get(category);

          return {
            ...record,
            _isFirstInCategory: index === categoryInfo.firstIndex,
            _categoryRowspan: categoryInfo.count
          };
        });
      },
      scoreButtonPermission() {
        // 权限控制逻辑
        const deptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        const vendorType = this.where.vendorType;
        // 检验科本部
        if (deptCode === '501') {
          return vendorType === '服务商' || vendorType === '计量供应商' || vendorType === '第三方检验机构';
        }
        // 检验科下属专业组
        const subGroupCodes = ['1722', '1730', '1726', '1725', '1723', '1724', '1727', '1728', '1731'];
        if (subGroupCodes.includes(deptCode)) {
          return vendorType === '供应商';
        }
        // 其他科室默认不可评分
        return false;
      },
      showCurrentScore () {
        const vendorType = this.where.vendorType;
        return vendorType === '供应商' || vendorType === '第三方检验机构评分';
      },
      // 计算当前总分
      currentTotalScore() {
        if (!this.scoreRules || this.scoreRules.length === 0) {
          return 0;
        }

        return this.scoreRules.reduce((total, rule) => {
          // 只统计评分型的项目，且必须有分数
          if (rule.ITEM_TYPE === '评分' && rule.score !== null && rule.score !== undefined && rule.score !== '') {
            return total + (Number(rule.score) || 0);
          }
          return total;
        }, 0);
      },
    },

    mounted() {
      // 页面初始不自动选中供应商
      // 监听科室切换事件
      if (this.$bus && this.$bus.$on) {
        this.$bus.$on('handleCommand', this.handleDeptChange);
      }
    },
    beforeDestroy() {
      // 注销事件监听，防止内存泄漏
      if (this.$bus && this.$bus.$off) {
        this.$bus.$off('handleCommand', this.handleDeptChange);
      }
    },
    methods: {
      datasource({ page, limit, where, order }) {
        console.log(page, limit, where, order);
        where.keyword = this.where.keyword;
        where.vendorType = this.where.vendorType;
        let deptCode = null;
        if (this.where.vendorType === '供应商') {
          deptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        }
        let data = apiSupplierScoreGetList({ page, limit, where, order }, deptCode).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      reload() {
        this.$refs.table.reload({ page: 1, where: this.where });
      },
      handleDeptChange() {
        this.selectedSupplier = null;
        this.reload();
      },
      onCurrentChange(current) {
        // 只有当真正选择了不同的供应商时才刷新评分记录
        if (current && (!this.selectedSupplier || this.selectedSupplier.ID !== current.ID)) {
          this.selectedSupplier = current;
          this.scoreRecordPage = 1;
          this.$nextTick(() => {
            this.$refs.scoreTable && this.$refs.scoreTable.reload();
          });
        }
      },
      onSizeChange(e) {
        console.log(e);
      },
      // 打开新增弹窗
      openAddDialog() {
        this.isEdit = false;
        this.dialogTitle = '新增' + this.where.vendorType;
        this.resetForm();
        this.dialogVisible = true;
      },
      // 编辑项目
      editItem(row) {
        this.isEdit = true;
        this.dialogTitle = '编辑' + this.where.vendorType;

        // 将后端数据映射到前端表单
        this.formData = {
          ID: row.ID,
          Supplier_Code: row.REGISTER_NO,
          Supplier_Name: row.VENDOR_NAME,
          VENDOR_TYPE: row.VENDOR_TYPE,
          SUPPLY_ITEMS: row.SUPPLY_ITEMS,
          ADDRESS: row.ADDRESS,
          CONTACT_INFO: row.CONTACT_INFO
        };
        this.dialogVisible = true;
      },
      // 删除项目
      deleteItem(row) {
        deleteSupplierScore({
          ID: row.ID
        })
          .then((res) => {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.reload();
            } else {
              this.$message.error(res.msg || '删除失败');
            }
          })
          .catch((err) => {
            this.$message.error('删除失败');
          });
      },
      // 重置表单
      resetForm() {
        this.formData = {
          ID: '',
          Supplier_Code: '',
          Supplier_Name: '',
          VENDOR_TYPE: this.where.vendorType,
          SUPPLY_ITEMS: '',
          ADDRESS: '',
          CONTACT_INFO: ''
        };
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate();
        });
      },
      // 关闭弹窗
      closeDialog() {
        this.dialogVisible = false;
        this.resetForm();
      },
      // 提交表单
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const submitData = {
              DEPT_TWO_CODE: this.where.vendorType === '供应商' ? this.$store.state.user.info.DeptNow.Dept_Two_Code : null,
              ...this.formData
            };

            const api = this.isEdit ? updateSupplierScore : addSupplierScore;

            api(submitData)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success(this.isEdit ? '更新成功' : '添加成功');
                  this.closeDialog();
                  this.reload();
                } else {
                  this.$message.error(
                    res.msg || (this.isEdit ? '更新失败' : '添加失败')
                  );
                }
              })
              .catch((err) => {
                this.$message.error(this.isEdit ? '更新失败' : '添加失败');
              });
          }
        });
      },
      async initDefaultSupplier() {
        // 移除自动选中逻辑，保留空表格
        this.selectedSupplier = null;
        this.scoreRecordList = [];
        this.scoreRecordTotal = 0;
      },
      scoreRecordDatasource({ page, limit }) {
        if (!this.selectedSupplier) {
          console.log('No selected supplier');
          return { count: 0, list: [] };
        }

        console.log('Fetching score records for vendor:', this.selectedSupplier.ID, 'page:', page, 'limit:', limit);

        return getSupplierScoreRecords({
          vendorId: this.selectedSupplier.ID,
          pageIndex: page,
          pageSize: limit
        })
          .then(res => {
            console.log('API response:', res);

            // 新的数据结构：res.result是批次列表，每个批次包含Batch和Records
            // 为了表格显示，我们需要将Batch信息提取到顶层
            const formattedList = res.result.map(item => ({
              ...item.Batch,
              Records: item.Records,
              Batch: item.Batch // 保留原始Batch引用
            }));

            console.log('Formatted list:', formattedList);

            this.scoreRecordList = formattedList;
            this.scoreRecordTotal = res.total;
            return { count: res.total, list: formattedList };
          })
          .catch(error => {
            console.error('Error fetching score records:', error);
            return { count: 0, list: [] };
          });
      },
      onScoreRecordPageChange(page) {
        // 只有当页码真正改变时才刷新
        if (this.scoreRecordPage !== page) {
          this.scoreRecordPage = page;
          this.$nextTick(() => {
            this.$refs.scoreTable && this.$refs.scoreTable.reload();
          });
        }
      },
      onScoreRecordPageSizeChange(size) {
        this.scoreRecordPageSize = size;
        this.scoreRecordPage = 1;
        this.$nextTick(() => {
          this.$refs.scoreTable && this.$refs.scoreTable.reload();
        });
      },
      fetchScoreRecords() {
        if (!this.selectedSupplier) return;
        this.scoreRecordLoading = true;
        getSupplierScoreRecords({
          vendorId: this.selectedSupplier.ID,
          pageIndex: this.scoreRecordPage,
          pageSize: this.scoreRecordPageSize
        })
          .then(res => {
            // 新的数据结构：res.result是批次列表
            // 为了表格显示，我们需要将Batch信息提取到顶层
            const formattedList = res.result.map(item => ({
              ...item.Batch,
              Records: item.Records,
              Batch: item.Batch // 保留原始Batch引用
            }));
            this.scoreRecordList = formattedList;
            this.scoreRecordTotal = res.total;
          })
          .finally(() => {
            this.scoreRecordLoading = false;
          });
      },
      openScoreDialog() {
        if (!this.selectedSupplier) {
          this.$message.warning('请先选择供应商');
          return;
        }
        this.loadScoreRules();
        this.scoreDialogVisible = true;
      },
      // 加载评分规则
      async loadScoreRules() {
        this.scoreRulesLoading = true;
        try {
          const rules = await getVendorScoreRules(this.selectedSupplier.VENDOR_TYPE);
          console.log('Loaded score rules:', rules);

                  // 初始化评分规则，确保每个规则都有score和text属性
        this.scoreRules = rules.map(rule => ({
          ...rule,
          score: null, // 初始化为null而不是0
          text: null // 文本型数据使用text字段
        }));

          console.log('Initialized score rules:', this.scoreRules);

          // 分组评分规则
          this.groupedScoreRules = this.groupScoreRules(this.scoreRules);
        } catch (error) {
          console.error('Error loading score rules:', error);
          this.$message.error('获取评分规则失败：' + error.message);
        } finally {
          this.scoreRulesLoading = false;
        }
      },
      // 查看评分详情
      async viewScoreDetail(row) {
        try {
          this.scoreDetailLoading = true;
          const detailData = await getVendorScoreBatchDetail(row.ID);
          this.scoreDetailData = detailData;
          this.scoreDetailVisible = true;
        } catch (error) {
          this.$message.error('获取评分详情失败：' + error.message);
        } finally {
          this.scoreDetailLoading = false;
        }
      },
      // 关闭评分详情
      closeScoreDetail() {
        this.scoreDetailVisible = false;
        this.scoreDetailData = null;
      },
      // 删除评分批次
      deleteScoreBatch(row) {
        deleteVendorScoreBatch(row.ID)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success('删除成功');
              this.$nextTick(() => {
                this.$refs.scoreTable && this.$refs.scoreTable.reload();
              });
            } else {
              this.$message.error(res.msg || '删除失败');
            }
          })
          .catch((err) => {
            this.$message.error('删除失败：' + err.message);
          });
      },
      // 关闭评分弹窗
      closeScoreDialog() {
        this.scoreDialogVisible = false;
        this.scoreFormData = {};
        this.scoreRules = [];
        this.groupedScoreRules = [];
      },
      // 提交评分
      async submitScore() {
        // 从分组数据中提取所有评分项
        const allScoreRules = this.groupedScoreRules.reduce((acc, group) => {
          return acc.concat(group.items);
        }, []);

        // 检查是否所有项目都已评分
        const unScoredItems = allScoreRules.filter(rule => {
          if (rule.ITEM_TYPE === '文本') {
            return rule.text === undefined || rule.text === null || rule.text === '';
          } else {
            return rule.score === undefined || rule.score === null || rule.score === '' || rule.score < 0;
          }
        });

        if (unScoredItems.length > 0) {
          this.$message.warning('请完成所有评分项目的评分');
          return;
        }
        if (!this.scoreYear) {
          this.$message.warning('请选择评分年份');
          return;
        }
        this.scoreSubmitting = true;
        try {
          // 构建批次数据
          const batchData = {
            VENDOR_ID: this.selectedSupplier.ID,
            EVALUATOR_ID: this.$store.state.user.info.ID,
            EVALUATOR_NAME: this.$store.state.user.info.Nickname,
            EVAL_YEAR: Number(this.scoreYear),
            REMARK: ''
          };

          // 构建记录数据
          const records = allScoreRules.map(rule => ({
            RULE_ID: rule.ID,
            CATEGORY_NAME: rule.CATEGORY_NAME,
            ITEM_NAME: rule.ITEM_NAME,
            ITEM_TYPE: rule.ITEM_TYPE,
            SCORE: rule.ITEM_TYPE === '文本' ? null : rule.score,
            TEXT: rule.ITEM_TYPE === '文本' ? rule.text : null
          }));

          const submitData = {
            Batch: batchData,
            Records: records
          };

          const result = await createVendorScoreRecord(submitData);
          this.$message.success('评分提交成功');
          this.closeScoreDialog();

          // 刷新评分记录列表
          this.$nextTick(() => {
            this.selectedSupplier.STATUS = '1';
            this.$refs.scoreTable && this.$refs.scoreTable.reload();
          });
        } catch (error) {
          this.$message.error('评分提交失败：' + error.message);
        } finally {
          this.scoreSubmitting = false;
        }
      },
      async handleExportWord(row) {
        const batch = row || this.scoreRecordList[0];
        if (!batch) {
          this.$message.warning('暂无评分记录');
          return;
        }
        try {
          const detail = await getVendorScoreBatchDetail(batch.ID);
          // 基本信息
          const data = {
            supplierName: this.selectedSupplier.VENDOR_NAME,
            supplierCode: this.selectedSupplier.REGISTER_NO,
            supplierType: this.selectedSupplier.VENDOR_TYPE,
            supplierItems: this.selectedSupplier.SUPPLY_ITEMS,
            supplierAddress: this.selectedSupplier.ADDRESS,
            supplierContactInfo: this.selectedSupplier.CONTACT_INFO,
            evaluator: detail.Batch.EVALUATOR_NAME,
            evalTime: this.formatDateTime(detail.Batch.EVAL_TIME),
            year: detail.Batch.EVAL_YEAR,
            no: detail.Batch.ID,
          };
          // 处理每一项
          let yesNoIdx = 1;
          let scoreIdx = 1;
          let remarkIdx = 1;
          let textIdx = 1;

          detail.Records.forEach((item) => {
            if (item.ITEM_TYPE === '选择') {
              if (item.SCORE === 1 || item.SCORE === '是') {
                data[`yesBox${yesNoIdx}`] = '☑';
                data[`noBox${yesNoIdx}`] = '□';
              } else {
                data[`yesBox${yesNoIdx}`] = '□';
                data[`noBox${yesNoIdx}`] = '☑';
              }
              yesNoIdx++;
            } else if (item.ITEM_TYPE === '文本') {
              data[`text${textIdx}`] = item.TEXT;
              textIdx++;
            } else {
              data[`score${scoreIdx}`] = item.SCORE;
              if (this.where.vendorType === '第三方检验机构') {
                data[`remark${remarkIdx}`] = item.REMARK || '';
                remarkIdx++;
              }
              scoreIdx++;
            }
          });
          console.log(data);
          let templateUrl;
          if (this.selectedSupplier.VENDOR_TYPE === '供应商') {
            templateUrl = `${process.env.BASE_URL}score-template/供应商评分表.docx`;
          } else if (this.selectedSupplier.VENDOR_TYPE === '服务商') {
            templateUrl = `${process.env.BASE_URL}score-template/服务商评分表.docx`;
          } else if (this.selectedSupplier.VENDOR_TYPE === '计量供应商') {
            templateUrl = `${process.env.BASE_URL}score-template/计量供应商评分表.docx`;
          } else if (this.selectedSupplier.VENDOR_TYPE === '第三方检验机构') {
            templateUrl = `${process.env.BASE_URL}score-template/第三方检验机构评分表.docx`;
          } else {
            throw new Error('不支持的供应商类型');
          }
          const { exportWordFromTemplate } = await import('@/utils/word-util');
          await exportWordFromTemplate(templateUrl, data, `${this.selectedSupplier.VENDOR_NAME}_评分表_${detail.Batch.EVAL_YEAR}.docx`);
        } catch (e) {
          this.$message.error('导出失败：' + (e.message || e));
        }
      },
      downloadTemplate() {
        const header = [
          ['服务机构或供应商名称', '服务或供应项目', '注册情况', '地址', '联系方式']
        ];
        const worksheet = XLSX.utils.aoa_to_sheet(header);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '模板');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '导入模板.xlsx');
      },
      async handleImportExcel(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const [header, ...rows] = json;
          // 可做表头校验
          const suppliers = rows
            .filter(row => row.length > 0)
            .map(row => ({
              VENDOR_NAME: row[0] || '',
              SUPPLY_ITEMS: row[1] || '',
              REGISTER_NO: row[2] || '',
              ADDRESS: row[3] || '',
              CONTACT_INFO: row[4] || '',
              VENDOR_TYPE: this.where.vendorType,
              DEPT_TWO_CODE: this.where.vendorType === '供应商' ? this.$store.state.user.info.DeptNow.Dept_Two_Code : null
            }));
          if (suppliers.length === 0) {
            this.$message.warning('没有有效数据');
            return;
          }
          try {
            const res = await batchImportSuppliers(suppliers);
            if (res.code === 200) {
              this.$message.success(`导入成功：${res.data.SuccessCount} 条，失败：${res.data.FailedCount} 条`);
              if (res.data.FailedCount > 0) {
                this.$alert('失败明细：<br>' + res.data.FailedRows.join('<br>'), '部分导入失败', { dangerouslyUseHTMLString: true });
              }
              this.reload();
            } else {
              this.$message.error('导入失败：' + (res.msg || '未知错误'));
            }
          } catch (e) {
            this.$message.error('导入异常：' + (e.message || e));
          }
        };
        reader.readAsArrayBuffer(file.raw);
      },
      onVendorTypeTabClick(type) {
        if (this.where.vendorType !== type) {
          this.where.vendorType = type;
          this.selectedSupplier = null;
          this.reload();
        }
      },
      groupScoreRules(rules) {
        const groups = {};
        rules.forEach(rule => {
          if (!groups[rule.CATEGORY_NAME]) {
            groups[rule.CATEGORY_NAME] = { CATEGORY_NAME: rule.CATEGORY_NAME, items: [] };
          }
          groups[rule.CATEGORY_NAME].items.push(rule);
        });
        return Object.values(groups);
      },
      // 合并表格行方法
      mergeScoreDetailRows({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) { // 只对第一列（评审内容）进行合并
          if (row._isFirstInCategory && row._categoryRowspan > 0) {
            return { rowspan: row._categoryRowspan, colspan: 1 };
          } else {
            return { rowspan: 0, colspan: 0 };
          }
        }
        return { rowspan: 1, colspan: 1 }; // 其他列正常显示
      },
      // 格式化时间，将T替换为空格
      formatDateTime(dateTime) {
        if (!dateTime) return '';
        return dateTime.replace('T', ' ');
      },
      // 计算总分
      calculateTotalScore(row) {
        if (!row.Records || !Array.isArray(row.Records)) {
          return '0';
        }

        const totalScore = row.Records.reduce((total, record) => {
          // 只统计评分型的项目
          if (record.ITEM_TYPE === '评分' && record.SCORE !== null && record.SCORE !== undefined && record.SCORE !== '') {
            return total + (Number(record.SCORE) || 0);
          }
          return total;
        }, 0);

        return totalScore.toString();
      },
      async syncSuppliers() {
        this.syncLoading = true;
        try {
          const deptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
          const res = await syncSuppliers(deptCode);
          if (res.code === 200) {
            if (res.data.TotalCount) {
              this.$message.success(`同步成功：总数 ${res.data.TotalCount}，成功 ${res.data.SuccessCount}，失败 ${res.data.FailedCount}`);
              if (res.data.FailedCount > 0 && res.data.FailedSuppliers && res.data.FailedSuppliers.length > 0) {
                this.$alert('失败明细：<br>' + res.data.FailedSuppliers.join('<br>'), '部分同步失败', { dangerouslyUseHTMLString: true });
              }
            } else {
              this.$message.info('暂无需要同步的供应商数据');
            }
            this.reload();
          } else {
            this.$message.error('同步失败：' + (res.msg || '未知错误'));
          }
        } catch (e) {
          this.$message.error('同步异常：' + (e.message || e));
        } finally {
          this.syncLoading = false;
        }
      },
      tableRowClassName({ row }) {
        return row.STATUS === '1' ? 'row-disabled' : '';
      },
      async handleRevoke(row) {
        try {
          const res = await updateVendorStatus({ id: row.ID, status: '0' });
          if (res.code === 200) {
            this.$message.success('撤回成功');
            this.reload();
          } else {
            this.$message.error(res.msg || '撤回失败');
          }
        } catch (e) {
          this.$message.error('撤回异常：' + (e.message || e));
        }
      },
      handleExport(row) {
        // 只导出关键信息
        const exportData = [
          {
            '供应商名称': row.VENDOR_NAME,
            '供应商编码': row.SUPPLIER_CODE,
            '注册编码': row.REGISTER_NO,
            '类型': row.VENDOR_TYPE,
            '服务或供应项目': row.SUPPLY_ITEMS,
            '地址': row.ADDRESS,
            '联系方式': row.CONTACT_INFO
          }
        ];
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '供应商信息');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${row.VENDOR_NAME}_信息导出.xlsx`);
      },
      async handleExportAll() {
        try {
          let exportRows = [];
          if (this.selection && this.selection.length > 0) {
            exportRows = this.selection;
          } else {
            const deptCode = this.where.vendorType === '供应商' ? this.$store.state.user.info.DeptNow.Dept_Two_Code : null;
            const res = await apiSupplierScoreGetList({ page: 1, limit: 99999, where: this.where }, deptCode);
            exportRows = res.result || [];
          }
          const exportData = exportRows.map(row => ({
            '供应商名称': row.VENDOR_NAME,
            '供应商编码': row.SUPPLIER_CODE,
            '注册编码': row.REGISTER_NO,
            '类型': row.VENDOR_TYPE,
            '服务或供应项目': row.SUPPLY_ITEMS,
            '地址': row.ADDRESS,
            '联系方式': row.CONTACT_INFO
          }));
          if (!exportData.length) {
            this.$message.warning('没有可导出的数据');
            return;
          }
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, `${this.where.vendorType}信息`);
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${this.where.vendorType}信息导出.xlsx`);
        } catch (e) {
          this.$message.error('导出失败：' + (e.message || e));
        }
      },
      // 导出全部评分记录
      async handleExportAllScoreRecords() {
        if (!this.selectedSupplier) {
          this.$message.warning('请先选择供应商');
          return;
        }

        try {
          // 获取所有评分记录（99999条）
          const res = await getSupplierScoreRecords({
            vendorId: this.selectedSupplier.ID,
            pageIndex: 1,
            pageSize: 99999
          });

          if (!res.result || res.result.length === 0) {
            this.$message.warning('该供应商暂无评分记录');
            return;
          }

          // 处理数据，每个批次为一行
          const exportData = res.result.map(batchItem => {
            const batch = batchItem.Batch;
            const records = batchItem.Records || [];

            // 计算总分
            const totalScore = records.reduce((total, record) => {
              if (record.ITEM_TYPE === '评分' && record.SCORE !== null && record.SCORE !== undefined && record.SCORE !== '') {
                return total + (Number(record.SCORE) || 0);
              }
              return total;
            }, 0);

            return {
              '评分人': batch.EVALUATOR_NAME,
              '评分年份': batch.EVAL_YEAR,
              '评分时间': this.formatDateTime(batch.EVAL_TIME),
              '得分': totalScore,
              '备注': batch.REMARK || ''
            };
          });

          if (exportData.length === 0) {
            this.$message.warning('没有可导出的评分数据');
            return;
          }

          // 创建Excel文件
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, '评分记录');

          // 设置列宽
          const columnWidths = [
            { wch: 12 }, // 评分人
            { wch: 10 }, // 评分年份
            { wch: 20 }, // 评分时间
            { wch: 8 },  // 得分
            { wch: 30 }  // 备注
          ];
          worksheet['!cols'] = columnWidths;

          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const fileName = `${this.selectedSupplier.VENDOR_NAME}_评分记录.xlsx`;
          saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);

          this.$message.success(`成功导出 ${exportData.length} 条评分记录`);
        } catch (e) {
          this.$message.error('导出评分记录失败：' + (e.message || e));
        }
      },
      // 导出全部供应商分数（所选年份），使用 Promise.all 汇总
      openExportAllSuppliersScoreDialog() {
        this.exportAllScoreYear = String(new Date().getFullYear());
        this.exportAllScoreDialogVisible = true;
      },
      closeExportAllSuppliersScoreDialog() {
        this.exportAllScoreDialogVisible = false;
      },
      async confirmExportAllSuppliersScore() {
        if (!this.exportAllScoreYear) {
          this.$message.warning('请选择年份');
          return;
        }
        this.exportingAllScore = true;
        try {
          const targetYear = Number(this.exportAllScoreYear);

          // 获取全部供应商列表（按当前筛选条件/类型），尽量大页
          const deptCode = this.where.vendorType === '供应商' ? this.$store.state.user.info.DeptNow.Dept_Two_Code : null;
          const listRes = await apiSupplierScoreGetList({ page: 1, limit: 99999, where: this.where }, deptCode);
          const allSuppliers = listRes.result || [];
          if (!allSuppliers.length) {
            this.$message.warning('没有可导出的供应商');
            return;
          }

          // 并发获取每个供应商的评分记录
          const promises = allSuppliers.map(s => getSupplierScoreRecords({ vendorId: s.ID, pageIndex: 1, pageSize: 99999 })
            .then(res => ({ supplier: s, records: res.result || [] }))
            .catch(() => ({ supplier: s, records: [] }))
          );
          const results = await Promise.all(promises);

          // 组装导出数据，按年份筛选并计算总分
          const exportData = results.map(({ supplier, records }) => {
            const yearItem = records.find(item => item.Batch && Number(item.Batch.EVAL_YEAR) === targetYear);
            let scoreCell = '';
            if (yearItem && Array.isArray(yearItem.Records)) {
              const totalScore = yearItem.Records.reduce((total, record) => {
                if (record.ITEM_TYPE === '评分' && record.SCORE !== null && record.SCORE !== undefined && record.SCORE !== '') {
                  return total + (Number(record.SCORE) || 0);
                }
                return total;
              }, 0);
              scoreCell = totalScore === 0 ? 0 : totalScore; // 有记录则显示累计分(可为0)，无记录则空白
            }
            return {
              '供应商名称': supplier.VENDOR_NAME,
              '供应商编码': supplier.SUPPLIER_CODE,
              '注册编码': supplier.REGISTER_NO,
              '类型': supplier.VENDOR_TYPE,
              '服务或供应项目': supplier.SUPPLY_ITEMS,
              '地址': supplier.ADDRESS,
              '联系方式': supplier.CONTACT_INFO,
              '评分年份': targetYear,
              '得分': scoreCell
            };
          });

          // 导出 Excel
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, `${this.where.vendorType}分数`);
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const fileName = `${this.where.vendorType}_分数_${this.exportAllScoreYear}.xlsx`;
          saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);

          this.$message.success(`成功导出 ${exportData.length} 条记录`);
          this.closeExportAllSuppliersScoreDialog();
        } catch (e) {
          this.$message.error('导出失败：' + (e.message || e));
        } finally {
          this.exportingAllScore = false;
        }
      },
      // 导出指定年份的供应商分数
      openExportScoreDialog() {
        if (!this.selectedSupplier) {
          this.$message.warning('请先选择供应商');
          return;
        }
        this.exportScoreYear = String(new Date().getFullYear());
        this.exportScoreDialogVisible = true;
      },
      closeExportScoreDialog() {
        this.exportScoreDialogVisible = false;
      },
      async confirmExportSupplierScore() {
        if (!this.selectedSupplier) {
          this.$message.warning('请先选择供应商');
          return;
        }
        if (!this.exportScoreYear) {
          this.$message.warning('请选择年份');
          return;
        }
        this.exportingScore = true;
        try {
          const res = await getSupplierScoreRecords({
            vendorId: this.selectedSupplier.ID,
            pageIndex: 1,
            pageSize: 99999
          });
          const targetYear = Number(this.exportScoreYear);
          const yearBatch = (res.result || []).find(item => item.Batch && Number(item.Batch.EVAL_YEAR) === targetYear);
          if (!yearBatch) {
            this.$message.warning('该年份暂无评分记录');
            return;
          }
          const totalScore = (yearBatch.Records || []).reduce((total, record) => {
            if (record.ITEM_TYPE === '评分' && record.SCORE !== null && record.SCORE !== undefined && record.SCORE !== '') {
              return total + (Number(record.SCORE) || 0);
            }
            return total;
          }, 0);

          const exportRow = [{
            '供应商名称': this.selectedSupplier.VENDOR_NAME,
            '供应商编码': this.selectedSupplier.SUPPLIER_CODE,
            '注册编码': this.selectedSupplier.REGISTER_NO,
            '类型': this.selectedSupplier.VENDOR_TYPE,
            '服务或供应项目': this.selectedSupplier.SUPPLY_ITEMS,
            '地址': this.selectedSupplier.ADDRESS,
            '联系方式': this.selectedSupplier.CONTACT_INFO,
            '评分年份': targetYear,
            '得分': totalScore
          }];

          const worksheet = XLSX.utils.json_to_sheet(exportRow);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, '供应商分数');
          const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const fileName = `${this.selectedSupplier.VENDOR_NAME}_分数_${this.exportScoreYear}.xlsx`;
          saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
          this.$message.success('导出成功');
          this.closeExportScoreDialog();
        } catch (e) {
          this.$message.error('导出失败：' + (e.message || e));
        } finally {
          this.exportingScore = false;
        }
      },
    }
  };
</script>
