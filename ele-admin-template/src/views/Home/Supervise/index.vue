<template>
  <div ref="pageRoot" class="supervise-page">
    <div ref="prodPane" class="supervise-pane supervise-pane--prod">
      <div class="supervise-tool">
        <span class="supervise-title">产品类别</span>
        <el-button type="primary" size="mini" @click="openProdDialog">创建</el-button>
      </div>
          <vxe-table
            ref="prodTable"
            :data="proTypeList"
            :loading="prodLoading"
            border
            stripe
            size="mini"
            :height="prodTableHeight"
            :row-config="{ isHover: true, isCurrent: true, keyField: 'Prod_Big_Class_Code' }"
            :column-config="{ resizable: true }"
            show-overflow
            @current-change="onProdCurrentChange"
          >
            <vxe-column field="Prod_Big_Class_Name" title="名称" min-width="120" show-overflow />
            <vxe-column title="" width="52" align="center">
              <template #default="{ row }">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="danger-btn"
                  @click.stop="onDeleteProd(row)"
                />
              </template>
            </vxe-column>
          </vxe-table>
    </div>

    <div ref="mgmtPane" class="supervise-pane supervise-pane--mgmt">
      <div class="supervise-tool">
        <span class="supervise-title">管理类别</span>
        <el-button type="primary" size="mini" :disabled="!prodCode" @click="openMgmtDialog">创建</el-button>
      </div>
          <vxe-table
            ref="mgmtTable"
            :data="mgmtList"
            :loading="mgmtLoading"
            border
            stripe
            size="mini"
            :height="mgmtTableHeight"
            :row-config="{ isHover: true, isCurrent: true, keyField: 'Mgmt_Cat_Code' }"
            :column-config="{ resizable: true }"
            :checkbox-config="{ highlight: true }"
            show-overflow
            @current-change="onMgmtCurrentChange"
            @checkbox-change="onMgmtCheckboxChange"
            @checkbox-all="onMgmtCheckboxAll"
          >
            <vxe-column type="checkbox" width="44" align="center" />
            <vxe-column field="Prod_Big_Class_Name" title="产品类别" min-width="90" show-overflow align="center" />
            <vxe-column field="Mgmt_Cat_Name" title="管理类别" min-width="90" show-overflow align="center" />
            <vxe-column title="" width="132" align="center">
              <template #default="{ row }">
                <el-button
                  type="text"
                  icon="el-icon-setting"
                  title="供应/品种证件必填"
                  @click.stop="openDocRuleDrawer(row)"
                />
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="danger-btn"
                  title="删除"
                  @click.stop="onDeleteMgmt(row)"
                />
              </template>
            </vxe-column>
          </vxe-table>
    </div>

    <div ref="regPane" class="supervise-pane supervise-pane--reg">
      <div class="supervise-tool">
        <span class="supervise-title">监管类别</span>
        <el-input
          v-model="keyword"
          size="mini"
          clearable
          placeholder="搜索关键词"
          class="search-input"
          @keyup.enter.native="onSearch"
        />
        <el-button type="primary" size="mini" @click="onSearch">搜索</el-button>
        <el-button type="primary" size="mini" plain :disabled="!prodCode" @click="openRegDialog">创建</el-button>
        <el-button size="mini" @click="onExport">导出三大类别</el-button>
      </div>
          <vxe-table
            ref="regTable"
            :data="regulatoryList"
            :loading="regLoading"
            border
            stripe
            size="mini"
            :height="regTableHeight"
            :row-config="{ isHover: true }"
            :column-config="{ resizable: true }"
            show-overflow
          >
            <vxe-column field="Prod_Big_Class_Name" title="产品类别" min-width="100" show-overflow align="center" />
            <vxe-column field="Mgmt_Cat_Name" title="管理类别" min-width="90" show-overflow align="center" />
            <vxe-column field="Regulatory_Cat_Code" title="监管类别编码" width="110" />
            <vxe-column field="Regulatory_Cat_Name" title="监管类别名称" min-width="120" show-overflow />
            <vxe-column title="" width="52" align="center" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="danger-btn"
                  @click.stop="onDeleteReg(row)"
                />
              </template>
            </vxe-column>
          </vxe-table>
          <div ref="regPagerWrap" class="pagination-wrap">
            <el-pagination
              small
              background
              layout="total, prev, pager, next"
              :current-page.sync="page"
              :page-size="pageSize"
              :total="regulatoryTotal"
              @current-change="onPageChange"
            />
          </div>
    </div>

    <!-- 创建产品类别 -->
    <el-dialog title="创建产品类别" :visible.sync="prodDialog" width="480px" append-to-body @closed="prodForm.name = ''">
      <el-form label-width="100px" @submit.native.prevent>
        <el-form-item label="产品类别" required>
          <el-input v-model="prodForm.name" maxlength="50" placeholder="请输入产品类别名称" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="prodDialog = false">取消</el-button>
        <el-button type="primary" :loading="prodSubmitting" @click="submitProd">确定</el-button>
      </span>
    </el-dialog>

    <!-- 创建管理类别 -->
    <el-dialog title="创建管理类别" :visible.sync="mgmtDialog" width="520px" append-to-body @closed="resetMgmtForm">
      <el-form label-width="100px" @submit.native.prevent>
        <el-form-item label="产品类别" required>
          <el-select v-model="mgmtForm.prodCode" filterable placeholder="请选择" style="width: 100%">
            <el-option
              v-for="p in proTypeList"
              :key="p.Prod_Big_Class_Code"
              :label="p.Prod_Big_Class_Name"
              :value="p.Prod_Big_Class_Code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管理类别" required>
          <el-input v-model="mgmtForm.name" maxlength="50" placeholder="请输入管理类别名称" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="mgmtDialog = false">取消</el-button>
        <el-button type="primary" :loading="mgmtSubmitting" @click="submitMgmt">确定</el-button>
      </span>
    </el-dialog>

    <!-- 创建监管类别 -->
    <el-dialog title="创建监管类别" :visible.sync="regDialog" width="560px" append-to-body @open="onRegDialogOpen" @closed="resetRegForm">
      <el-form label-width="120px" @submit.native.prevent>
        <el-form-item label="产品类别" required>
          <el-select v-model="regForm.prodCode" filterable placeholder="请选择" style="width: 100%" @change="onRegProdChange">
            <el-option
              v-for="p in proTypeList"
              :key="p.Prod_Big_Class_Code"
              :label="p.Prod_Big_Class_Name"
              :value="p.Prod_Big_Class_Code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="管理类别" required>
          <el-select
            v-model="regForm.mgmtCode"
            filterable
            placeholder="请选择"
            style="width: 100%"
            :loading="regMgmtLoading"
          >
            <el-option
              v-for="m in regMgmtOptions"
              :key="m.Mgmt_Cat_Code"
              :label="m.Mgmt_Cat_Name"
              :value="m.Mgmt_Cat_Code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="监管类别编码" required>
          <el-input v-model="regForm.code" maxlength="20" placeholder="仅数字" clearable @input="onRegCodeInput" />
        </el-form-item>
        <el-form-item label="监管类别名称" required>
          <el-input v-model="regForm.name" maxlength="200" placeholder="请输入名称" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="regDialog = false">取消</el-button>
        <el-button type="primary" :loading="regSubmitting" @click="submitReg">确定</el-button>
      </span>
    </el-dialog>

    <!-- 管理类别：供应证件 + 品种证件必填配置 -->
    <el-drawer
      :visible.sync="docRuleDrawerVisible"
      direction="rtl"
      size="640px"
      append-to-body
      custom-class="doc-rule-drawer"
      @closed="onDocRuleDrawerClosed"
    >
      <template slot="title">
        <div class="doc-rule-drawer-heading">
          <div class="doc-rule-drawer-heading-main">{{ docRuleDrawerTitle }}</div>
        </div>
      </template>

      <div v-loading="docRuleLoading" class="doc-rule-drawer-inner">
        <el-alert
          v-if="docRuleHint && docRuleDrawerVisible"
          class="doc-rule-alert"
          type="warning"
          :closable="false"
          show-icon
          :title="docRuleHint"
        />

        <div class="doc-rule-scroll">
          <section class="doc-rule-panel doc-rule-panel--supplier" aria-labelledby="doc-rule-supplier-title">
            <header class="doc-rule-panel-head">
              <span class="doc-rule-panel-chip doc-rule-panel-chip--supplier" aria-hidden="true">供应</span>
              <div class="doc-rule-panel-head-text">
                <h3 id="doc-rule-supplier-title" class="doc-rule-panel-title">供应证件类型</h3>
              </div>
              <span class="doc-rule-panel-count">{{ docRuleSupplierLines.length }} 项</span>
            </header>
            <div class="doc-rule-panel-body">
              <el-table
                v-if="docRuleSupplierLines.length"
                :data="docRuleSupplierLines"
                border
                stripe
                size="small"
                class="doc-rule-table"
                row-key="dictValue"
              >
                <el-table-column prop="dictLabel" label="证件 / 资料项" min-width="208" show-overflow-tooltip />
                <el-table-column label="必填" width="96" align="center" header-align="center">
                  <template slot-scope="{ row }">
                    <el-switch
                      v-model="row.required"
                      active-color="#13ce66"
                      :aria-label="`供应：${row.dictLabel}是否必填`"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </section>

          <section class="doc-rule-panel doc-rule-panel--variety" aria-labelledby="doc-rule-variety-title">
            <header class="doc-rule-panel-head">
              <span class="doc-rule-panel-chip doc-rule-panel-chip--variety" aria-hidden="true">品种</span>
              <div class="doc-rule-panel-head-text">
                <h3 id="doc-rule-variety-title" class="doc-rule-panel-title">品种证件类型</h3>
              </div>
              <span class="doc-rule-panel-count">{{ docRuleVarietyLines.length }} 项</span>
            </header>
            <div class="doc-rule-panel-body">
              <el-table
                v-if="docRuleVarietyLines.length"
                :data="docRuleVarietyLines"
                border
                stripe
                size="small"
                class="doc-rule-table"
                row-key="dictValue"
              >
                <el-table-column prop="dictLabel" label="证件 / 资料项" min-width="208" show-overflow-tooltip />
                <el-table-column label="必填" width="96" align="center" header-align="center">
                  <template slot-scope="{ row }">
                    <el-switch
                      v-model="row.required"
                      active-color="#13ce66"
                      :aria-label="`品种：${row.dictLabel}是否必填`"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </section>
        </div>
      </div>

      <div class="doc-rule-drawer-footer">
        <span class="doc-rule-footer-hint">保存将依次写入两套证件必填规则。</span>
        <div class="doc-rule-footer-actions">
          <el-button size="medium" plain @click="docRuleDrawerVisible = false">取 消</el-button>
          <el-button
            size="medium"
            type="primary"
            :loading="docRuleSaving"
            :disabled="docRuleLoading"
            @click="saveDocRules"
          >
            {{ docRuleSaving ? '保存中…' : '保 存' }}
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { MessageBox, Message } from 'element-ui';
  import { BACK_BASE_URL } from '@/config/setting';
  import { dictDataByTypeCode } from '@/api/system/dict-management';
  import {
    getProTypeList,
    getMgmtListByProTypeID,
    getRegulatoryList,
    getRegulatoryListByMgmnID,
    insertProType,
    insertMgmt,
    insertRegulatory,
    deleteProType,
    deleteMgmt,
    deleteRegulatory,
    exportBig3Class,
    mgmtCatVarietyDocRuleSync
  } from '@/api/Home/Supervise';

  const VARIETY_DOC_TYPE_CODE = 'VARIETY_DOC_TYPE';
  const SUPPLIER_DOC_TYPE_CODE = 'SUPPLIER_DOC_TYPE';

  export default {
    name: 'Supervise',
    data() {
      return {
        prodLoading: false,
        mgmtLoading: false,
        regLoading: false,
        proTypeList: [],
        mgmtList: [],
        /** 管理类别表格多选行 */
        mgmtCheckedRows: [],
        regulatoryList: [],
        prodCode: null,
        mgmtCatCode: '',
        keyword: '',
        page: 1,
        pageSize: 10,
        regulatoryTotal: 0,
        prodDialog: false,
        prodForm: { name: '' },
        prodSubmitting: false,
        mgmtDialog: false,
        mgmtForm: { prodCode: null, name: '' },
        mgmtSubmitting: false,
        regDialog: false,
        regForm: { prodCode: null, mgmtCode: null, code: '', name: '' },
        regMgmtOptions: [],
        regMgmtLoading: false,
        regSubmitting: false,
        prodTableHeight: 160,
        mgmtTableHeight: 160,
        regTableHeight: 160,
        layoutTimer: null,
        /** 供应/品种证件必填 Drawer */
        docRuleDrawerVisible: false,
        docRuleMgmtRow: null,
        docRuleLoading: false,
        docRuleSaving: false,
        docRuleSupplierLines: [],
        docRuleVarietyLines: [],
        docRuleHint: ''
      };
    },
    computed: {
      docRuleDrawerTitle() {
        const n = this.docRuleMgmtRow && this.docRuleMgmtRow.Mgmt_Cat_Name;
        return n ? `供应/品种证件必填 · ${n}` : '供应/品种证件必填';
      }
    },
    created() {
      this.bootstrapSupervisePage();
    },
    mounted() {
      this.scheduleLayout();
      this.resizeHandler = () => this.scheduleLayout();
      window.addEventListener('resize', this.resizeHandler);
      this.$nextTick(() => {
        if (typeof ResizeObserver === 'undefined') {
          return;
        }
        this.resizeObserver = new ResizeObserver(() => this.scheduleLayout());
        const ro = this.resizeObserver;
        if (this.$refs.pageRoot) {
          ro.observe(this.$refs.pageRoot);
        }
        ['prodPane', 'mgmtPane', 'regPane'].forEach((name) => {
          if (this.$refs[name]) ro.observe(this.$refs[name]);
        });
      });
      if (this.$bus) {
        this._onBusOpenVarietyDocRule = () => {
          this.tryConsumeOpenVarietyDocRuleFromStorage();
        };
        this.$bus.$on('ele-open-variety-doc-rule', this._onBusOpenVarietyDocRule);
      }
    },
    activated() {
      this.scheduleLayout();
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ele_open_variety_doc_rule')) {
        this.$nextTick(() => this.tryConsumeOpenVarietyDocRuleFromStorage());
      }
    },
    beforeDestroy() {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
      }
      if (this.layoutTimer) {
        clearTimeout(this.layoutTimer);
        this.layoutTimer = null;
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.$bus && this._onBusOpenVarietyDocRule) {
        this.$bus.$off('ele-open-variety-doc-rule', this._onBusOpenVarietyDocRule);
        this._onBusOpenVarietyDocRule = null;
      }
    },
    methods: {
      /** 防抖：布局稳定后再量 DOM，避免连续 resize 抖动 */
      scheduleLayout() {
        if (this.layoutTimer) {
          clearTimeout(this.layoutTimer);
        }
        this.layoutTimer = setTimeout(() => {
          this.updateTableHeights();
        }, 72);
      },
      /**
       * 按各栏剩余高度计算表格，分页留在监管类别栏内部。
       */
      updateTableHeights() {
        const measure = () => {
          const prod = this.measurePaneHeight(this.$refs.prodPane);
          const mgmt = this.measurePaneHeight(this.$refs.mgmtPane);
          const reg = this.measurePaneHeight(this.$refs.regPane);
          if (prod != null) this.prodTableHeight = prod;
          if (mgmt != null) this.mgmtTableHeight = mgmt;
          if (reg != null) this.regTableHeight = reg;

          ['prodTable', 'mgmtTable', 'regTable'].forEach((k) => {
            const t = this.$refs[k];
            if (t && typeof t.recalculate === 'function') {
              t.recalculate();
            }
          });
        };

        this.$nextTick(() => {
          requestAnimationFrame(() => {
            this.$nextTick(measure);
          });
        });
      },
      measurePaneHeight(pane) {
        if (!pane || pane.clientHeight < 80) return null;
        const style = window.getComputedStyle(pane);
        let used =
          (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
        let sawTable = false;
        Array.from(pane.children).forEach((child) => {
          if (child.classList && child.classList.contains('vxe-table')) {
            sawTable = true;
            return;
          }
          const childStyle = window.getComputedStyle(child);
          used +=
            child.offsetHeight +
            (parseFloat(childStyle.marginTop) || 0) +
            (parseFloat(childStyle.marginBottom) || 0);
        });
        if (!sawTable) return null;
        return Math.max(36, Math.floor(pane.clientHeight - used - 2));
      },
      regulatoryId(row) {
        return row.Regulatory_id != null ? row.Regulatory_id : row.Regulatory_Id;
      },
      async loadProTypes() {
        this.prodLoading = true;
        try {
          const res = await getProTypeList();
          this.proTypeList = res.result || [];
        } catch (e) {
          Message.error(e.message || '加载产品类别失败');
        } finally {
          this.prodLoading = false;
          this.scheduleLayout();
        }
      },
      /** 首屏加载产品类别后，处理从注册证页跳转带来的「打开品种证件必填」 */
      async bootstrapSupervisePage() {
        await this.loadProTypes();
        await this.$nextTick();
        await this.tryConsumeOpenVarietyDocRuleFromStorage();
      },
      /**
       * 读取 sessionStorage，选中对应产品类别、管理类别行并打开品种证件必填 Drawer
       */
      async tryConsumeOpenVarietyDocRuleFromStorage() {
        let raw;
        try {
          raw = sessionStorage.getItem('ele_open_variety_doc_rule');
        } catch (e) {
          return;
        }
        if (!raw) {
          return;
        }
        let payload;
        try {
          payload = JSON.parse(raw);
        } catch (e) {
          sessionStorage.removeItem('ele_open_variety_doc_rule');
          return;
        }
        const { prodBigClassCode, mgmtCatCode } = payload || {};
        if (!prodBigClassCode || !mgmtCatCode) {
          sessionStorage.removeItem('ele_open_variety_doc_rule');
          return;
        }
        sessionStorage.removeItem('ele_open_variety_doc_rule');

        if (!this.proTypeList || !this.proTypeList.length) {
          await this.loadProTypes();
        }
        const prodRow = (this.proTypeList || []).find(
          (r) => String(r.Prod_Big_Class_Code) === String(prodBigClassCode)
        );
        if (!prodRow) {
          Message.warning('未找到对应的产品类别，请先在「监管类别维护」中维护');
          return;
        }
        const pt = this.$refs.prodTable;
        if (pt && pt.setCurrentRow) {
          pt.setCurrentRow(prodRow);
        }
        this.prodCode = prodRow.Prod_Big_Class_Code;
        await this.loadMgmtByProd(this.prodCode, mgmtCatCode);
        const mgmtRow = (this.mgmtList || []).find(
          (m) => String(m.Mgmt_Cat_Code) === String(mgmtCatCode)
        );
        if (!mgmtRow) {
          Message.warning('未找到对应的管理类别，请先在「三大类别管理」中维护');
          return;
        }
        this.openDocRuleDrawer(mgmtRow);
      },
      onProdCurrentChange({ row }) {
        if (!row) {
          return;
        }
        this.prodCode = row.Prod_Big_Class_Code;
        this.loadMgmtByProd(this.prodCode);
      },
      /**
       * @param {string|number} code 产品类别编码
       * @param {string|number} [selectMgmtCatCode] 若传入，则选中该管理类别行（否则选中第一条）
       */
      async loadMgmtByProd(code, selectMgmtCatCode) {
        this.mgmtLoading = true;
        this.mgmtList = [];
        this.mgmtCheckedRows = [];
        this.mgmtCatCode = '';
        this.regulatoryList = [];
        this.regulatoryTotal = 0;
        try {
          const res = await getMgmtListByProTypeID(code);
          this.mgmtList = res.result || [];
        } catch (e) {
          Message.error(e.message || '加载管理类别失败');
        } finally {
          this.mgmtLoading = false;
          this.scheduleLayout();
        }
        await this.$nextTick();
        const mt = this.$refs.mgmtTable;
        if (mt && mt.clearCheckboxRow) {
          mt.clearCheckboxRow();
        }
        if (this.mgmtList.length) {
          let target = this.mgmtList[0];
          if (selectMgmtCatCode != null && selectMgmtCatCode !== '') {
            const found = this.mgmtList.find(
              (m) => String(m.Mgmt_Cat_Code) === String(selectMgmtCatCode)
            );
            if (found) {
              target = found;
            }
          }
          if (mt && mt.setCurrentRow) {
            mt.setCurrentRow(target);
          }
          this.mgmtCatCode = String(target.Mgmt_Cat_Code);
          this.page = 1;
          this.fetchRegulatory(1);
        }
      },
      onMgmtCurrentChange({ row }) {
        if (!row) {
          return;
        }
        this.mgmtCatCode = String(row.Mgmt_Cat_Code);
        this.page = 1;
        this.fetchRegulatory(1);
      },
      syncMgmtCheckboxRecords() {
        const mt = this.$refs.mgmtTable;
        if (mt && typeof mt.getCheckboxRecords === 'function') {
          this.mgmtCheckedRows = mt.getCheckboxRecords() || [];
        } else {
          this.mgmtCheckedRows = [];
        }
      },
      onMgmtCheckboxChange() {
        this.syncMgmtCheckboxRecords();
      },
      onMgmtCheckboxAll() {
        this.syncMgmtCheckboxRecords();
      },
      async fetchRegulatory(p) {
        const page = p != null ? p : this.page;
        this.page = page;
        this.regLoading = true;
        try {
          let res;
          if (this.mgmtCatCode && this.mgmtCatCode !== 'null') {
            res = await getRegulatoryListByMgmnID({
              mgmtCatCode: this.mgmtCatCode,
              keyword: this.keyword,
              page,
              size: this.pageSize
            });
          } else {
            res = await getRegulatoryList({
              keyword: this.keyword,
              page,
              size: this.pageSize
            });
          }
          this.regulatoryList = res.result || [];
          this.regulatoryTotal = res.total != null ? res.total : 0;
        } catch (e) {
          Message.error(e.message || '加载监管类别失败');
        } finally {
          this.regLoading = false;
          this.scheduleLayout();
        }
      },
      onSearch() {
        this.page = 1;
        this.fetchRegulatory(1);
      },
      onPageChange(p) {
        this.fetchRegulatory(p);
      },
      openProdDialog() {
        this.prodForm.name = '';
        this.prodDialog = true;
      },
      async submitProd() {
        const name = (this.prodForm.name || '').trim();
        if (!name) {
          Message.warning('请输入产品类别名称');
          return;
        }
        this.prodSubmitting = true;
        try {
          const data = await insertProType(name);
          if (data === 301) {
            Message.error('登录失效');
            return;
          }
          if (typeof data === 'number' && data > 0) {
            Message.success('添加成功');
            this.prodDialog = false;
            await this.loadProTypes();
          } else {
            Message.warning('添加失败，请检查是否名称重复');
          }
        } catch (e) {
          Message.error(e.message || '请求失败');
        } finally {
          this.prodSubmitting = false;
        }
      },
      openMgmtDialog() {
        this.mgmtForm = {
          prodCode: this.prodCode,
          name: ''
        };
        this.mgmtDialog = true;
      },
      resetMgmtForm() {
        this.mgmtForm = { prodCode: null, name: '' };
      },
      async submitMgmt() {
        const { prodCode, name } = this.mgmtForm;
        if (prodCode == null || !(String(name || '').trim())) {
          Message.warning('请选择产品类别并填写管理类别');
          return;
        }
        this.mgmtSubmitting = true;
        try {
          const data = await insertMgmt(String(name).trim(), prodCode);
          if (data === 301) {
            Message.error('登录失效');
            return;
          }
          if (typeof data === 'number' && data > 0) {
            Message.success('添加成功');
            this.mgmtDialog = false;
            if (this.prodCode) {
              await this.loadMgmtByProd(this.prodCode);
            }
          } else {
            Message.warning('添加失败，请检查是否名称重复');
          }
        } catch (e) {
          Message.error(e.message || '请求失败');
        } finally {
          this.mgmtSubmitting = false;
        }
      },
      openRegDialog() {
        this.regForm = {
          prodCode: this.prodCode,
          mgmtCode: null,
          code: '',
          name: ''
        };
        this.regMgmtOptions = [];
        this.regDialog = true;
      },
      onRegDialogOpen() {
        if (this.regForm.prodCode != null) {
          this.loadRegMgmtOptions(this.regForm.prodCode);
        }
      },
      resetRegForm() {
        this.regForm = { prodCode: null, mgmtCode: null, code: '', name: '' };
        this.regMgmtOptions = [];
      },
      async onRegProdChange(code) {
        this.regForm.mgmtCode = null;
        await this.loadRegMgmtOptions(code);
      },
      async loadRegMgmtOptions(prodBigClassCode) {
        if (prodBigClassCode == null) {
          this.regMgmtOptions = [];
          return;
        }
        this.regMgmtLoading = true;
        try {
          const res = await getMgmtListByProTypeID(prodBigClassCode);
          this.regMgmtOptions = res.result || [];
          if (this.regMgmtOptions.length && this.regForm.mgmtCode == null) {
            this.regForm.mgmtCode = this.regMgmtOptions[0].Mgmt_Cat_Code;
          }
        } catch (e) {
          Message.error(e.message || '加载管理类别失败');
        } finally {
          this.regMgmtLoading = false;
        }
      },
      onRegCodeInput(val) {
        this.regForm.code = String(val).replace(/\D/g, '');
      },
      async submitReg() {
        const { prodCode, mgmtCode, code, name } = this.regForm;
        if (prodCode == null || mgmtCode == null || !String(code).trim() || !String(name).trim()) {
          Message.warning('请完整填写表单');
          return;
        }
        this.regSubmitting = true;
        try {
          const data = await insertRegulatory(
            Number(code),
            String(name).trim(),
            Number(mgmtCode)
          );
          if (data === 301) {
            Message.error('登录失效');
            return;
          }
          if (typeof data === 'number' && data <= 0) {
            Message.warning('添加失败，请检查编码是否重复');
            return;
          }
          Message.success('添加成功');
          this.regDialog = false;
          await this.fetchRegulatory(this.page);
        } catch (e) {
          Message.error(e.message || '请求失败');
        } finally {
          this.regSubmitting = false;
        }
      },
      onDeleteProd(row) {
        MessageBox.confirm('是否删除此项产品类别？', '提示', { type: 'warning' })
          .then(async () => {
            try {
              const res = await deleteProType(row.Prod_Big_Class_Code);
              if (res.code === 200 || res.code === '200') {
                Message.success(res.msg || '删除成功');
                if (this.prodCode === row.Prod_Big_Class_Code) {
                  this.prodCode = null;
                  this.mgmtList = [];
                  this.mgmtCheckedRows = [];
                  this.mgmtCatCode = '';
                  this.regulatoryList = [];
                  this.regulatoryTotal = 0;
                }
                await this.loadProTypes();
              } else {
                Message.warning(res.msg || '删除失败');
              }
            } catch (e) {
              Message.error(e.message || '删除失败');
            }
          })
          .catch(() => {});
      },
      onDeleteMgmt(row) {
        MessageBox.confirm('是否删除此项管理类别？', '提示', { type: 'warning' })
          .then(async () => {
            try {
              const res = await deleteMgmt(row.Mgmt_Cat_Code);
              if (res.code === 200 || res.code === '200') {
                Message.success(res.msg || '删除成功');
                if (this.prodCode) {
                  await this.loadMgmtByProd(this.prodCode);
                }
              } else {
                Message.warning(res.msg || '删除失败');
              }
            } catch (e) {
              Message.error(e.message || '删除失败');
            }
          })
          .catch(() => {});
      },
      onDeleteReg(row) {
        const id = this.regulatoryId(row);
        MessageBox.confirm('是否删除此项监管类别？', '提示', { type: 'warning' })
          .then(async () => {
            try {
              const res = await deleteRegulatory(id);
              if (res.code === 200 || res.code === '200') {
                Message.success(res.msg || '删除成功');
                await this.fetchRegulatory(this.page);
              } else {
                Message.warning(res.msg || '删除失败');
              }
            } catch (e) {
              Message.error(e.message || '删除失败');
            }
          })
          .catch(() => {});
      },
      async onExport() {
        const loading = this.$loading({ lock: true, text: '导出中…' });
        try {
          const res = await exportBig3Class();
          if (res.code === 301 || res.code === '301') {
            Message.error(res.msg || '登录失效');
            return;
          }
          if (res.code === 200 || res.code === '200') {
            const file = res.msg;
            if (file) {
              const url = `${BACK_BASE_URL}/Excel/files/${encodeURIComponent(file)}`;
              window.open(url, '_blank');
            } else {
              Message.warning('未返回文件名');
            }
          } else {
            Message.warning(res.msg || '导出失败');
          }
        } catch (e) {
          Message.error(e.message || '导出失败');
        } finally {
          loading.close();
        }
      },
      /** 解析 ApiResponse / 旧版 JObject 中的列表数据 */
      apiListPayload(res) {
        if (!res) {
          return [];
        }
        if (Array.isArray(res.data)) {
          return res.data;
        }
        if (Array.isArray(res.result)) {
          return res.result;
        }
        return [];
      },
      /** DictDataByTypeCode 附带 rules 时的列表（兼容 Put 键小写） */
      apiRulesPayload(res) {
        if (!res) {
          return [];
        }
        if (Array.isArray(res.rules)) {
          return res.rules;
        }
        if (Array.isArray(res.Rules)) {
          return res.Rules;
        }
        return [];
      },
      buildDocRuleLinesFromMerged(merged) {
        const dictTypeRow =
          merged &&
          (merged.dictType != null
            ? merged.dictType
            : merged.dicttype != null
              ? merged.dicttype
              : null);
        const dictTypeId =
          dictTypeRow &&
          (dictTypeRow.DictTypeId != null ? dictTypeRow.DictTypeId : dictTypeRow.dictTypeId);
        if (dictTypeId == null || dictTypeId === '') {
          return { lines: [], missingType: true };
        }

        const dictRows = this.apiListPayload(merged);
        const sorted = [...dictRows].sort((a, b) => {
          const sa = Number(a.SortNum != null ? a.SortNum : a.sortNum) || 0;
          const sb = Number(b.SortNum != null ? b.SortNum : b.sortNum) || 0;
          if (sa !== sb) {
            return sa - sb;
          }
          const ida = Number(a.DictDataId != null ? a.DictDataId : a.dictDataId) || 0;
          const idb = Number(b.DictDataId != null ? b.DictDataId : b.dictDataId) || 0;
          return ida - idb;
        });

        const rules = this.apiRulesPayload(merged);
        const ruleByValue = new Map();
        rules.forEach((r) => {
          const v = r.DictValue != null ? String(r.DictValue) : String(r.dictValue || '');
          if (v) {
            ruleByValue.set(v, r);
          }
        });

        const lines = sorted.map((d) => {
          const dv = String(d.DictValue != null ? d.DictValue : d.dictValue || '');
          const label = d.DictLabel != null ? d.DictLabel : d.dictLabel || dv;
          const existing = ruleByValue.get(dv);
          const ruleId =
            existing &&
            (existing.RuleId != null ? existing.RuleId : existing.ruleId != null ? existing.ruleId : null);
          const isReq =
            existing &&
            String(existing.IsRequired != null ? existing.IsRequired : existing.isRequired || '') === '1';
          return {
            dictValue: dv,
            dictLabel: label,
            ruleId: ruleId != null && ruleId !== '' ? Number(ruleId) : null,
            required: !!isReq
          };
        });

        return { lines, missingType: false };
      },
      openDocRuleDrawer(row) {
        this.docRuleMgmtRow = row;
        this.docRuleHint = '';
        this.docRuleSupplierLines = [];
        this.docRuleVarietyLines = [];
        this.docRuleDrawerVisible = true;
        this.loadDocRuleData();
      },
      onDocRuleDrawerClosed() {
        this.docRuleMgmtRow = null;
        this.docRuleHint = '';
        this.docRuleSupplierLines = [];
        this.docRuleVarietyLines = [];
      },
      async loadDocRuleData() {
        const row = this.docRuleMgmtRow;
        if (!row) {
          return;
        }
        const mgmtCatCode = Number(row.Mgmt_Cat_Code);
        this.docRuleLoading = true;
        this.docRuleHint = '';
        try {
          const [supplierMerged, varietyMerged] = await Promise.all([
            dictDataByTypeCode({
              dictTypeCode: SUPPLIER_DOC_TYPE_CODE,
              status: '1',
              size: 500,
              mgmtCatCode
            }),
            dictDataByTypeCode({
              dictTypeCode: VARIETY_DOC_TYPE_CODE,
              status: '1',
              size: 500,
              mgmtCatCode
            })
          ]);

          const supplierBuilt = this.buildDocRuleLinesFromMerged(supplierMerged);
          const varietyBuilt = this.buildDocRuleLinesFromMerged(varietyMerged);
          this.docRuleSupplierLines = supplierBuilt.lines;
          this.docRuleVarietyLines = varietyBuilt.lines;

          const missingCodes = [];
          if (supplierBuilt.missingType) {
            missingCodes.push(SUPPLIER_DOC_TYPE_CODE);
          }
          if (varietyBuilt.missingType) {
            missingCodes.push(VARIETY_DOC_TYPE_CODE);
          }
          if (missingCodes.length) {
            this.docRuleHint = `未找到字典类型：${missingCodes.join('、')}，请先在字典管理中新增该类型及字典项。`;
          }
        } catch (e) {
          Message.error(e.message || '加载证件配置失败');
        } finally {
          this.docRuleLoading = false;
        }
      },
      async saveDocRules() {
        const row = this.docRuleMgmtRow;
        if (!row) {
          this.docRuleDrawerVisible = false;
          return;
        }
        const mgmtCatCode = Number(row.Mgmt_Cat_Code);
        const supplierRequired = this.docRuleSupplierLines.filter((l) => l.required).map((l) => l.dictValue);
        const varietyRequired = this.docRuleVarietyLines.filter((l) => l.required).map((l) => l.dictValue);
        this.docRuleSaving = true;
        try {
          await mgmtCatVarietyDocRuleSync({
            mgmtCatCode,
            dictTypeCode: SUPPLIER_DOC_TYPE_CODE,
            requiredDictValues: supplierRequired
          });
          await mgmtCatVarietyDocRuleSync({
            mgmtCatCode,
            dictTypeCode: VARIETY_DOC_TYPE_CODE,
            requiredDictValues: varietyRequired
          });
          Message.success('保存成功');
          this.docRuleDrawerVisible = false;
        } catch (e) {
          Message.error(e.message || '保存失败');
        } finally {
          this.docRuleSaving = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .supervise-page {
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    min-height: 0;
    overflow: hidden;
    background: #fff;
    --vxe-ui-table-row-height-mini: 22px;
    --vxe-ui-table-cell-padding-mini: 1px 6px;
  }

  .supervise-pane {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  .supervise-pane--prod {
    flex: 0 0 17%;
    width: 17%;
  }

  .supervise-pane--mgmt {
    flex: 0 0 41%;
    width: 41%;
    border-left: 1px solid #ebeef5;
  }

  .supervise-pane--reg {
    flex: 1 1 auto;
    border-left: 1px solid #ebeef5;
  }

  .supervise-tool {
    display: flex;
    flex: none;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    padding: 2px 8px 0;
    box-sizing: border-box;
  }

  .supervise-title {
    flex: none;
    margin-right: 4px;
    font-size: 13px;
    font-weight: 600;
    line-height: 28px;
    color: #303133;
  }

  .search-input {
    width: 140px;
  }

  .pagination-wrap {
    flex: none;
    display: flex;
    justify-content: flex-end;
    margin: 0;
    padding: 2px 8px 0 0;
  }

  .supervise-page ::v-deep .vxe-table--render-default.size--mini .vxe-header--column,
  .supervise-page ::v-deep .vxe-table--render-default.size--mini .vxe-body--column {
    padding: 1px 0;
  }

  .supervise-page ::v-deep .vxe-body--row,
  .supervise-page ::v-deep .vxe-header--row {
    height: 22px !important;
  }

  .supervise-page ::v-deep .vxe-cell {
    line-height: 18px;
    padding-top: 1px !important;
    padding-bottom: 1px !important;
  }

  .supervise-page ::v-deep .el-pagination {
    margin: 0;
    padding: 0;
  }

  .supervise-page ::v-deep .el-pagination > * {
    margin-top: 0 !important;
  }

  .supervise-page ::v-deep .el-pagination .el-input__inner,
  .supervise-page ::v-deep .el-pagination button,
  .supervise-page ::v-deep .el-pager li {
    height: 22px;
    line-height: 22px;
    min-width: 22px;
  }

  .supervise-page ::v-deep .vxe-cell .el-button {
    height: 18px;
    padding: 0 2px;
    font-size: 13px;
    line-height: 18px;
  }

  .danger-btn {
    color: #f56c6c;
  }
</style>

<style lang="scss">
  /* 证件必填抽屉：分区面板、表格与底部栏 */
  .doc-rule-drawer {
    &.el-drawer {
      display: flex;
      flex-direction: column;
    }

    .el-drawer__body {
      padding: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      height: 100%;
      box-sizing: border-box;
    }

    .el-drawer__header {
      align-items: flex-start;
      padding: 18px 20px 12px;
      margin-bottom: 0;
      border-bottom: 1px solid #ebeef5;
    }

    .el-drawer__title {
      flex: 1;
      line-height: inherit;
    }

    .el-drawer__close-btn {
      margin-top: 2px;
    }
  }

  .doc-rule-drawer-heading {
    padding-right: 8px;
  }

  .doc-rule-drawer-heading-main {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    line-height: 1.35;
  }

  .doc-rule-drawer-heading-sub {
    margin-top: 6px;
    font-size: 12px;
    font-weight: normal;
    color: #909399;
    line-height: 1.5;
    max-width: 36em;
  }

  .doc-rule-drawer-inner {
    position: relative;
    flex: 1;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 20px;
  }

  .doc-rule-alert {
    flex-shrink: 0;
    margin: 14px 0 4px;

    .el-alert__title {
      font-size: 13px;
      line-height: 1.5;
      font-weight: normal;
    }

    .el-alert__content {
      padding-right: 0;
    }
  }

  .doc-rule-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 0 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .doc-rule-panel {
    flex-shrink: 0;
    background: linear-gradient(180deg, #fbfcfd 0%, #f6f8fa 100%);
    border: 1px solid #e4e7ed;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .doc-rule-panel-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.75);
    border-bottom: 1px solid #ebeef5;
  }

  .doc-rule-panel-chip {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .doc-rule-panel-chip--supplier {
    color: #409eff;
    background: rgba(64, 158, 255, 0.12);
  }

  .doc-rule-panel-chip--variety {
    color: #67c23a;
    background: rgba(103, 194, 58, 0.14);
  }

  .doc-rule-panel-head-text {
    flex: 1;
    min-width: 0;
  }

  .doc-rule-panel-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    line-height: 1.4;
  }

  .doc-rule-panel-desc {
    margin: 4px 0 0;
    font-size: 12px;
    color: #909399;
    line-height: 1.4;

    code {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 4px;
      background: #f0f2f5;
      color: #606266;
    }
  }

  .doc-rule-panel-count {
    flex-shrink: 0;
    font-size: 12px;
    color: #909399;
    padding: 2px 8px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #ebeef5;
  }

  .doc-rule-panel-body {
    padding: 0;

    .doc-rule-table.el-table {
      background: transparent;
    }

    .el-table__header th {
      background: #fafbfc !important;
      font-weight: 600;
      font-size: 12px;
      color: #606266;
      padding: 8px 0;
    }

    .el-table__body td {
      padding: 6px 0;
      font-size: 13px;
    }
  }

  .doc-rule-panel-empty {
    padding: 28px 20px 32px;
    text-align: center;
  }

  .doc-rule-panel-empty-icon {
    display: block;
    margin: 0 auto 12px;
    font-size: 40px;
    color: #c0c4cc;
    line-height: 1;
  }

  .doc-rule-empty-lead {
    margin: 0;
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
  }

  .doc-rule-empty-code-wrap {
    margin: 10px 0 0;
  }

  .doc-rule-empty-code {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 4px;
    background: #f0f2f5;
    color: #303133;
  }

  .doc-rule-drawer-footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 20px;
    margin: 0;
    border-top: 1px solid #ebeef5;
    background: #fafafa;
    box-sizing: border-box;
  }

  .doc-rule-footer-hint {
    font-size: 12px;
    color: #909399;
    line-height: 1.4;
    max-width: 52%;
    min-width: 200px;
  }

  .doc-rule-footer-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
  }
</style>
