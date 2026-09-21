<template>
  <div class="ele-body spd-page monthly-query-submit">
    <!-- 查询条件 -->
    <div class="spd-panel spd-panel--search">
      <div class="spd-panel__head">查询条件</div>
      <div class="spd-panel__body query-grid">
        <div class="field-item range">
          <span class="prefix">结算月份</span>
          <el-date-picker
            v-model="q.MONTHLY_TIME_START"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="开始月份"
            clearable
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="q.MONTHLY_TIME_END"
            type="month"
            size="mini"
            value-format="yyyy-MM"
            placeholder="结束月份"
            clearable
          />
        </div>
        <el-input v-model="q.JSDH" size="mini" clearable placeholder="结算单号" @keyup.enter.native="doSearch" />
        <el-select v-model="q.QSSTATE" size="mini" clearable placeholder="发票签收状态">
          <el-option label="已签收" value="1" />
          <el-option label="未签收" value="0" />
        </el-select>
        <el-input v-model="q.MONTHBILLNUM" size="mini" clearable placeholder="发票号" @keyup.enter.native="doSearch" />
        <el-input v-model="q.SUPPLIER_NAME" size="mini" clearable placeholder="供应商名称" @keyup.enter.native="doSearch" />
        <el-input v-model="q.CHARGING_DEPT" size="mini" clearable placeholder="执行科室编码" @keyup.enter.native="doSearch" />
        <el-input v-model="q.DEPT_NAME" size="mini" clearable placeholder="执行科室名称" @keyup.enter.native="doSearch" />
        <el-select v-model="q.CONSUMPTION_TYPE" size="mini" clearable placeholder="消耗类型">
          <el-option label="一出" value="3" />
          <el-option label="二消" value="OTHER" />
        </el-select>
        <el-select v-model="q.IS_GT" size="mini" clearable placeholder="是否跟台">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
        <el-input v-model="q.USE_DEPT" size="mini" clearable placeholder="成本科室" @keyup.enter.native="doSearch" />
        <el-input v-model="q.VARIETIE_CODE_NEW" size="mini" clearable placeholder="品种编码" @keyup.enter.native="doSearch" />
        <el-input v-model="q.VARIETIE_NAME" size="mini" clearable placeholder="品种名称" @keyup.enter.native="doSearch" />
        <el-input v-model="q.SPECIFICATION_OR_TYPE" size="mini" clearable placeholder="规格型号" @keyup.enter.native="doSearch" />
        <el-input v-model="q.BATCH" size="mini" clearable placeholder="批号" @keyup.enter.native="doSearch" />
        <el-input v-model="q.UNIT" size="mini" clearable placeholder="单位" @keyup.enter.native="doSearch" />
        <el-input v-model="q.CLASS_ONE" size="mini" clearable placeholder="一级目录" @keyup.enter.native="doSearch" />
        <el-input v-model="q.CLASS_TWO" size="mini" clearable placeholder="二级目录" @keyup.enter.native="doSearch" />
        <el-input v-model="q.CLASS_THREE" size="mini" clearable placeholder="三级目录" @keyup.enter.native="doSearch" />
        <el-input v-model="q.DELIVERY_NOTE_NUMBER" size="mini" clearable placeholder="入库单号" @keyup.enter.native="doSearch" />
        <el-input v-model="q.YG_ORDER_ID" size="mini" clearable placeholder="阳光平台订单" @keyup.enter.native="doSearch" />
        <el-input v-model="q.YG_ORDER_DETAIL_ID" size="mini" clearable placeholder="阳光平台订单明细" @keyup.enter.native="doSearch" />
        <el-input v-model="q.YG_CODE" size="mini" clearable placeholder="产品码" @keyup.enter.native="doSearch" />
        <el-input v-model="q.YG_SPE_TYPE" size="mini" clearable placeholder="规格型号编码" @keyup.enter.native="doSearch" />
        <el-input v-model="q.OPERATE_MAIN_NUMBER" size="mini" clearable placeholder="申领单号" @keyup.enter.native="doSearch" />
        <el-input v-model="q.DEF_NO_PKG_CODE" size="mini" clearable placeholder="定数码" @keyup.enter.native="doSearch" />
        <el-input v-model="q.TH_OPERATE_MAIN_NUMBER" size="mini" clearable placeholder="原申领单号" @keyup.enter.native="doSearch" />
        <el-input v-model="q.SUPPLY_PRICE" size="mini" clearable placeholder="价格" @keyup.enter.native="doSearch" />
        <el-input v-model="q.GOODS_QTY" size="mini" clearable placeholder="数量" @keyup.enter.native="doSearch" />
        <el-input v-model="q.JE" size="mini" clearable placeholder="金额" @keyup.enter.native="doSearch" />
        <el-select v-model="q.TYPE" size="mini" clearable placeholder="领用类型">
          <el-option label="领用" value="0" />
          <el-option label="退库" value="1" />
        </el-select>
        <el-select v-model="q.ORDER_TYPE" size="mini" clearable placeholder="订单类型">
          <el-option label="普通申领" value="0" />
          <el-option label="其他退货" value="1" />
          <el-option label="跨月退中心库" value="-1" />
          <el-option label="跨月退供应商" value="-2" />
        </el-select>
        <el-select v-model="q.ORDER_JS_TYPE" size="mini" clearable placeholder="入库类型">
          <el-option label="普通" value="0" />
          <el-option label="临购" value="1" />
          <el-option label="临购初始化（医院货主）" value="2" />
          <el-option label="原HERP库存初始化（医院货主）" value="3" />
          <el-option label="经费入库" value="4" />
          <el-option label="初始化一出已结算" value="5" />
        </el-select>
        <el-select v-model="q.HIGH_OR_LOW_CLASS" size="mini" clearable placeholder="高低值">
          <el-option label="高值" value="1" />
          <el-option label="低值" value="0" />
          <el-option label="试剂" value="2" />
        </el-select>
        <el-select v-model="q.CLASSIFIC_PROPERTIES" size="mini" clearable placeholder="分类属性" filterable>
          <el-option
            v-for="item in classificOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="q.IS_EMBEDDED" size="mini" clearable placeholder="是否植入">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
        <el-select v-model="q.IS_JC" size="mini" clearable placeholder="是否集采">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
        <el-select v-model="q.IS_YG" size="mini" clearable placeholder="线上/线下">
          <el-option label="线上" value="1" />
          <el-option label="线下" value="0" />
        </el-select>
        <el-select v-model="q.IS_LC" size="mini" clearable placeholder="是否临购">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
        <el-select v-model="q.USE_APP_STATE" size="mini" clearable placeholder="日清确认状态">
          <el-option label="已确认" value="1" />
          <el-option label="未确认" value="0" />
        </el-select>
        <el-input v-model="q.USE_APP_MAN" size="mini" clearable placeholder="日清确认人" @keyup.enter.native="doSearch" />
        <div class="field-item range">
          <span class="prefix">数据创建时间</span>
          <el-date-picker
            v-model="q.CREATE_TIME_START"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            clearable
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="q.CREATE_TIME_END"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
            clearable
          />
        </div>
        <div class="field-item range">
          <span class="prefix">消耗时间</span>
          <el-date-picker
            v-model="q.OPEARTION_CHARGING_TIME_START"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            clearable
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="q.OPEARTION_CHARGING_TIME_END"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
            clearable
          />
        </div>
        <div class="field-item range">
          <span class="prefix">日清确认</span>
          <el-date-picker
            v-model="q.USE_APP_TIME_START"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            clearable
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="q.USE_APP_TIME_END"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            clearable
          />
        </div>
        <el-select v-model="q.IS_MONTHLY" size="mini" clearable placeholder="是否月结">
          <el-option label="已月结" value="1" />
          <el-option label="未月结" value="0" />
        </el-select>
        <el-select v-model="q.SURE_MONTH_STATE" size="mini" clearable placeholder="月结提交状态">
          <el-option label="已提交" value="1" />
          <el-option label="未提交" value="0" />
        </el-select>
        <el-input v-model="q.SURE_MONTH_MAN" size="mini" clearable placeholder="月结提交人" @keyup.enter.native="doSearch" />
        <div class="field-item range">
          <span class="prefix">月结提交</span>
          <el-date-picker
            v-model="q.SURE_MONTH_TIME_START"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            clearable
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="q.SURE_MONTH_TIME_END"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            clearable
          />
        </div>
      </div>
    </div>

    <!-- 操作 -->
    <div class="spd-panel spd-panel--actions">
      <div class="spd-panel__head spd-panel__head--split">
        <span>操作</span>
        <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
      </div>
      <div class="action-bar">
        <el-button type="primary" size="mini" icon="el-icon-search" :loading="loading" @click="doSearch">
          查询
        </el-button>
        <el-button size="mini" @click="doReset">重置</el-button>
        <el-button type="warning" size="mini" plain :loading="exporting" icon="el-icon-download" @click="exportExcel">
          导出Excel
        </el-button>
        <el-button type="primary" size="mini" plain :loading="approveLoading" @click="approveDayClearing">
          日清确认审核
        </el-button>
        <el-button type="primary" size="mini" plain :loading="approveByQueryLoading" @click="approveDayClearingByQuery">
          批量日清确认审核
        </el-button>
        <el-button type="primary" size="mini" plain @click="openBatchAttachmentDialog">
          批量上传附件
        </el-button>
        <span class="summary-text">
          总数量：<em class="summary-qty">{{ summaryQty }}</em>
          &nbsp;&nbsp;
          总金额：<em class="summary-amount">{{ summaryAmount }}</em>
        </span>
      </div>
    </div>

    <!-- 列表 -->
    <div class="spd-panel spd-table-panel">
      <div class="spd-panel__head">月结查询列表</div>
      <div class="spd-table-panel__wrap">
        <el-table
          ref="table"
          v-loading="loading"
          :data="rows"
          border
          stripe
          size="mini"
          :height="tableHeight"
          @selection-change="onSelectionChange"
          @sort-change="onSortChange"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="60" :index="indexMethod" />
          <el-table-column prop="ID" label="唯一ID" width="90" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="MONTHLY_TIME" label="结算月份" width="110" sortable="custom" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ formatMonth(row.MONTHLY_TIME) }}</template>
          </el-table-column>
          <el-table-column prop="JSDH" label="结算单号" width="100" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="QSSTATE" label="发票签收状态" width="110" sortable="custom">
            <template slot-scope="{ row }">{{ formatQsState(row.QSSTATE) }}</template>
          </el-table-column>
          <el-table-column prop="MONTHBILLNUM" label="发票号" width="150" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SUPPLIER_NAME" label="供应商名称" min-width="180" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="CONSUMPTION_TYPE" label="消耗类型" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatConsumptionType(row.CONSUMPTION_TYPE) }}</template>
          </el-table-column>
          <el-table-column prop="IS_GT" label="是否跟台" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatIsGt(row.IS_GT) }}</template>
          </el-table-column>
          <el-table-column prop="ORDER_JS_TYPE" label="入库类型" width="180" sortable="custom" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ formatOrderJsType(row.ORDER_JS_TYPE) }}</template>
          </el-table-column>
          <el-table-column prop="TYPE" label="类型" width="80" sortable="custom">
            <template slot-scope="{ row }">{{ formatType(row.TYPE) }}</template>
          </el-table-column>
          <el-table-column prop="ORDER_TYPE" label="订单类型" width="130" sortable="custom">
            <template slot-scope="{ row }">{{ formatOrderType(row.ORDER_TYPE) }}</template>
          </el-table-column>
          <el-table-column prop="OPERATE_MAIN_NUMBER" label="申领单号" width="130" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="DEF_NO_PKG_CODE" label="定数码" width="130" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="ORDER_TYPE_MARK" label="退货备注" min-width="160" show-overflow-tooltip>
            <template slot-scope="{ row }">{{ formatReturnRemark(row) }}</template>
          </el-table-column>
          <el-table-column prop="USE_DEPT" label="成本科室" width="140" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="HIGH_OR_LOW_CLASS" label="高低值" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatHighOrLowClass(row.HIGH_OR_LOW_CLASS) }}</template>
          </el-table-column>
          <el-table-column prop="IS_EMBEDDED" label="是否植入" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatYesNo(row.IS_EMBEDDED) }}</template>
          </el-table-column>
          <el-table-column prop="CHARGING_DEPT" label="执行科室编码" width="120" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="DEPT_NAME" label="执行科室名称" width="140" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="120" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="160" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" width="150" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="BATCH" label="批号" width="100" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="UNIT" label="单位" width="70" sortable="custom" />
          <el-table-column prop="CLASS_ONE" label="一级目录" min-width="150" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="CLASS_TWO" label="二级目录" min-width="150" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="CLASS_THREE" label="三级目录" min-width="150" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SUPPLY_PRICE" label="价格" width="90" align="right" sortable="custom">
            <template slot-scope="{ row }">{{ formatDecimal(row.SUPPLY_PRICE) }}</template>
          </el-table-column>
          <el-table-column prop="GOODS_QTY" label="数量" width="90" align="right" sortable="custom">
            <template slot-scope="{ row }">{{ formatDecimal(row.GOODS_QTY) }}</template>
          </el-table-column>
          <el-table-column prop="JE" label="金额" width="90" align="right" sortable="custom">
            <template slot-scope="{ row }">{{ formatDecimal(row.JE) }}</template>
          </el-table-column>
          <el-table-column prop="IS_JC" label="是否集采" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatJc(row.IS_JC) }}</template>
          </el-table-column>
          <el-table-column prop="IS_YG" label="线上/线下" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatYg(row.IS_YG) }}</template>
          </el-table-column>
          <el-table-column prop="IS_LC" label="是否临采" width="90" sortable="custom">
            <template slot-scope="{ row }">{{ formatLc(row.IS_LC) }}</template>
          </el-table-column>
          <el-table-column prop="DELIVERY_NOTE_NUMBER" label="入库单号" width="130" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="CREATE_TIME" label="数据创建时间" width="170" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="OPEARTION_CHARGING_TIME" label="消耗时间" width="170" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SZSE_FJ_PATH" label="附件" width="120">
            <template slot-scope="{ row }">
              <a
                v-if="row.SZSE_FJ_PATH"
                :href="buildAttachmentUrl(row.SZSE_FJ_PATH)"
                target="_blank"
                class="attach-link"
                @click.stop
              >查看附件</a>
            </template>
          </el-table-column>
          <el-table-column prop="SZSE_FJ_MARK" label="附件备注" min-width="160" show-overflow-tooltip />
          <el-table-column prop="USE_APP_STATE" label="日清确认状态" width="110" sortable="custom">
            <template slot-scope="{ row }">{{ formatUseAppState(row.USE_APP_STATE) }}</template>
          </el-table-column>
          <el-table-column prop="USE_APP_MAN" label="日清确认人" width="110" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="USE_APP_TIME" label="日清确认时间" width="150" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SURE_MONTH_STATE" label="月结提交状态" width="110" sortable="custom">
            <template slot-scope="{ row }">{{ formatSureMonthState(row.SURE_MONTH_STATE) }}</template>
          </el-table-column>
          <el-table-column prop="SURE_MONTH_MAN" label="月结提交人" width="110" sortable="custom" show-overflow-tooltip />
          <el-table-column prop="SURE_MONTH_TIME" label="月结提交时间" width="150" sortable="custom" show-overflow-tooltip />
        </el-table>
        <el-pagination
          class="pager"
          small
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="page"
          :page-sizes="[20, 50, 100, 200]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        />
      </div>
    </div>

    <!-- 批量上传附件 -->
    <el-dialog
      title="批量上传附件"
      :visible.sync="attachVisible"
      width="460px"
      append-to-body
      @closed="onAttachClosed"
    >
      <div class="attach-tip">已选中 {{ selectionIds.length }} 条记录</div>
      <el-form size="mini" label-width="72px">
        <el-form-item label="附件">
          <input
            ref="attachFile"
            type="file"
            accept=".jpg,.jpeg,.png,.bmp,.gif,.pdf"
            @change="onAttachFileChange"
          />
          <div class="attach-hint">仅支持图片或 PDF 文件</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="attachRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入附件备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="attachVisible = false">取消</el-button>
        <el-button type="primary" size="mini" :loading="attachLoading" @click="submitAttachment">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/Settle/MonthlyQuerySubmit';
import {
  emptyQuery,
  formatDecimal,
  formatMonth,
  formatQsState,
  formatConsumptionType,
  formatIsGt,
  formatOrderJsType,
  formatOrderType,
  formatYesNo,
  formatHighOrLowClass,
  formatType,
  formatJc,
  formatYg,
  formatLc,
  formatUseAppState,
  formatSureMonthState,
  formatReturnRemark,
  isValidAttachmentFile,
  buildAttachmentUrl,
  parseDispositionFileName,
  downloadBlob
} from './utils';

export default {
  name: 'MonthlyQuerySubmit',
  data() {
    return {
      q: emptyQuery(),
      classificOptions: [],
      rows: [],
      total: 0,
      page: 1,
      pageSize: 20,
      loading: false,
      exporting: false,
      approveLoading: false,
      approveByQueryLoading: false,
      selection: [],
      sortField: '',
      sortOrder: '',
      summaryQty: '0.00',
      summaryAmount: '0.00',
      attachVisible: false,
      attachRemark: '',
      attachFile: null,
      attachLoading: false,
      selectionIds: []
    };
  },
  computed: {
    tableHeight() {
      return 'calc(100vh - 420px)';
    }
  },
  created() {
    this.loadClassificOptions();
    this.loadData();
  },
  methods: {
    formatDecimal,
    formatMonth,
    formatQsState,
    formatConsumptionType,
    formatIsGt,
    formatOrderJsType,
    formatOrderType,
    formatYesNo,
    formatHighOrLowClass,
    formatType,
    formatJc,
    formatYg,
    formatLc,
    formatUseAppState,
    formatSureMonthState,
    formatReturnRemark,
    buildAttachmentUrl,
    indexMethod(index) {
      return (this.page - 1) * this.pageSize + index + 1;
    },
    async loadClassificOptions() {
      try {
        const res = await api.GetClassificProp();
        const list = Array.isArray(res.result) ? res.result : [];
        this.classificOptions = list
          .map((item) => {
            const value = item.CLASSIFIC_PROPERTIES ?? item.Classific_Properties;
            const label = item.CLASSIFIC_NAME ?? item.Classific_Name ?? value;
            if (value == null || value === '') return null;
            return { value: String(value), label: String(label || value) };
          })
          .filter(Boolean);
      } catch (e) {
        /* 下拉失败不阻断页面 */
      }
    },
    getQueryParams() {
      const params = {};
      Object.keys(this.q).forEach((key) => {
        const val = this.q[key];
        params[key] = val == null ? '' : val;
      });
      return {
        ...params,
        SORT_FIELD: this.sortField || '',
        SORT_ORDER: this.sortOrder || '',
        IS_DL: '0',
        page: this.page,
        size: this.pageSize
      };
    },
    async loadData() {
      this.loading = true;
      try {
        const res = await api.SearchMonthDetailSubmit(this.getQueryParams());
        this.rows = res.result || [];
        this.total = res.total || 0;
        const totalQty = res.totalQty != null ? res.totalQty : res.totalqty;
        const totalAmount = res.totalAmount != null ? res.totalAmount : res.totalamount;
        this.summaryQty = formatDecimal(totalQty || 0) || '0.00';
        this.summaryAmount = formatDecimal(totalAmount || 0) || '0.00';
      } catch (e) {
        this.$message.error(e.message || '查询失败');
        this.rows = [];
        this.total = 0;
        this.summaryQty = '0.00';
        this.summaryAmount = '0.00';
      } finally {
        this.loading = false;
      }
    },
    doSearch() {
      this.page = 1;
      this.loadData();
    },
    doReset() {
      this.sortField = '';
      this.sortOrder = '';
      this.q = emptyQuery();
      if (this.$refs.table) {
        this.$refs.table.clearSort();
        this.$refs.table.clearSelection();
      }
      this.doSearch();
    },
    onSelectionChange(rows) {
      this.selection = rows || [];
    },
    onSortChange({ prop, order }) {
      this.sortField = prop || '';
      if (order === 'ascending') this.sortOrder = 'asc';
      else if (order === 'descending') this.sortOrder = 'desc';
      else {
        this.sortField = '';
        this.sortOrder = '';
      }
      this.page = 1;
      this.loadData();
    },
    onSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.loadData();
    },
    onPageChange(page) {
      this.page = page;
      this.loadData();
    },
    collectSelectedIds() {
      return (this.selection || [])
        .map((r) => (r.ID != null ? String(r.ID) : ''))
        .filter(Boolean);
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const res = await api.ExportMonthDetailSubmit(this.getQueryParams());
        const blob = res.data;
        if (blob && blob.type && blob.type.indexOf('application/json') !== -1) {
          const text = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(blob);
          });
          const json = JSON.parse(text);
          this.$message.error(json.msg || json.message || '导出失败');
          return;
        }
        const fileName = parseDispositionFileName(
          res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition']),
          '月结查询与提交.xlsx'
        );
        downloadBlob(blob, fileName);
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    },
    approveDayClearing() {
      const ids = this.collectSelectedIds();
      if (!ids.length) {
        this.$message.warning('请选择需要审核的数据');
        return;
      }
      this.$confirm(`确认审核选中的 ${ids.length} 条记录吗？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.approveLoading = true;
          try {
            const res = await api.ApproveDayClearingSubmit(ids);
            this.$message.success(res.msg || '审核成功');
            this.loadData();
          } catch (e) {
            this.$message.error(e.message || '审核失败');
          } finally {
            this.approveLoading = false;
          }
        })
        .catch(() => {});
    },
    approveDayClearingByQuery() {
      this.$confirm('确认审核当前查询结果的全部数据吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.approveByQueryLoading = true;
          try {
            const res = await api.ApproveDayClearingSubmitByQuery(this.getQueryParams());
            this.$message.success(res.msg || '审核成功');
            this.loadData();
          } catch (e) {
            this.$message.error(e.message || '审核失败');
          } finally {
            this.approveByQueryLoading = false;
          }
        })
        .catch(() => {});
    },
    openBatchAttachmentDialog() {
      const ids = this.collectSelectedIds();
      if (!ids.length) {
        this.$message.warning('请选择需要上传附件的数据');
        return;
      }
      this.selectionIds = ids;
      this.attachRemark = '';
      this.attachFile = null;
      this.attachVisible = true;
      this.$nextTick(() => {
        if (this.$refs.attachFile) this.$refs.attachFile.value = '';
      });
    },
    onAttachFileChange(e) {
      const file = e.target && e.target.files ? e.target.files[0] : null;
      this.attachFile = file || null;
    },
    onAttachClosed() {
      this.attachRemark = '';
      this.attachFile = null;
      this.selectionIds = [];
      if (this.$refs.attachFile) this.$refs.attachFile.value = '';
    },
    async submitAttachment() {
      if (!this.attachFile) {
        this.$message.warning('请选择要上传的附件');
        return;
      }
      if (!isValidAttachmentFile(this.attachFile.name)) {
        this.$message.error('仅支持上传图片或 PDF 文件');
        return;
      }
      this.attachLoading = true;
      try {
        const res = await api.SaveMonthDetailAttachment({
          ids: this.selectionIds,
          remark: (this.attachRemark || '').trim(),
          file: this.attachFile
        });
        this.$message.success(res.msg || '上传成功');
        this.attachVisible = false;
        this.loadData();
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.attachLoading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.monthly-query-submit {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.query-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 6px 8px;
  align-items: center;
  padding: 10px 12px;

  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-date-editor.el-input) {
    width: 100%;
  }
}

.field-item.range {
  grid-column: span 3;
  display: grid;
  grid-template-columns: 72px 1fr 14px 1fr;
  gap: 4px;
  align-items: center;
}

.prefix {
  font-size: 12px;
  color: #666;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
}

.range-split {
  text-align: center;
  color: #999;
  font-size: 12px;
}

.spd-panel--actions .spd-panel__head--split {
  gap: 12px;
}

.action-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: #fafbfc;
}

.summary-text {
  margin-left: 14px;
  font-size: 12px;
  color: #666;
}

.summary-qty {
  color: #1e9fff;
  font-weight: bold;
  font-style: normal;
}

.summary-amount {
  color: #ff5722;
  font-weight: bold;
  font-style: normal;
}

.spd-table-panel__wrap {
  padding: 0 12px 12px;
}

.pager {
  margin-top: 10px;
  text-align: right;
}

.attach-link {
  color: #1e9fff;
}

.attach-tip {
  margin-bottom: 12px;
  color: #666;
  font-size: 13px;
}

.attach-hint {
  margin-top: 6px;
  color: #999;
  font-size: 12px;
}

:deep(.el-table th .cell) {
  white-space: nowrap;
}
</style>
