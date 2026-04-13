<template>
  <div ref="pageRoot" class="ele-body supervise-page">
    <el-row ref="superviseRow" type="flex" align="stretch" :gutter="6" class="supervise-row">
      <!-- 产品类别 -->
      <el-col :xs="24" :sm="24" :md="4">
        <el-card ref="sideCard" shadow="never" class="supervise-card">
          <div slot="header" class="card-header">
            <span>产品类别</span>
            <el-button type="primary" size="mini" @click="openProdDialog">创建</el-button>
          </div>
          <div ref="sideTableWrap" class="supervise-table-wrap">
          <vxe-table
            ref="prodTable"
            :data="proTypeList"
            :loading="prodLoading"
            border
            stripe
            size="mini"
            :height="sideTableHeight"
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
        </el-card>
      </el-col>

      <!-- 管理类别 -->
      <el-col :xs="24" :sm="24" :md="10">
        <el-card shadow="never" class="supervise-card">
          <div slot="header" class="card-header">
            <span>管理类别</span>
            <el-button type="primary" size="mini" :disabled="!prodCode" @click="openMgmtDialog">创建</el-button>
          </div>
          <div class="supervise-table-wrap">
          <vxe-table
            ref="mgmtTable"
            :data="mgmtList"
            :loading="mgmtLoading"
            border
            stripe
            size="mini"
            :height="sideTableHeight"
            :row-config="{ isHover: true, isCurrent: true, keyField: 'Mgmt_Cat_Code' }"
            :column-config="{ resizable: true }"
            :checkbox-config="{ highlight: true }"
            show-overflow
            @current-change="onMgmtCurrentChange"
            @checkbox-change="onMgmtCheckboxChange"
            @checkbox-all="onMgmtCheckboxAll"
          >
            <vxe-column type="checkbox" width="44" align="center" />
            <vxe-column field="Prod_Big_Class_Name" title="产品类别" min-width="90" show-overflow />
            <vxe-column field="Mgmt_Cat_Name" title="管理类别" min-width="90" show-overflow />
            <vxe-column title="" width="132" align="center">
              <template #default="{ row }">
                <el-button
                  type="text"
                  icon="el-icon-setting"
                  title="品种证件必填"
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
        </el-card>
      </el-col>

      <!-- 监管类别 -->
      <el-col :xs="24" :sm="24" :md="10">
        <el-card ref="regCard" shadow="never" class="supervise-card supervise-card--reg">
          <div slot="header" class="card-header card-header--toolbar">
            <span>监管类别</span>
            <div class="toolbar-right">
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
          </div>
          <div class="reg-card-main">
          <div ref="regTableWrap" class="supervise-table-wrap supervise-table-wrap--grow">
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
            <vxe-column field="Prod_Big_Class_Name" title="产品类别" min-width="100" show-overflow />
            <vxe-column field="Mgmt_Cat_Name" title="管理类别" min-width="90" show-overflow />
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
          </div>
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
        </el-card>
      </el-col>
    </el-row>

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

    <!-- 管理类别：品种证件必填配置 -->
    <el-drawer
      :title="docRuleDrawerTitle"
      :visible.sync="docRuleDrawerVisible"
      direction="rtl"
      size="520px"
      append-to-body
      custom-class="doc-rule-drawer"
      @closed="onDocRuleDrawerClosed"
    >
      <div v-loading="docRuleLoading" class="doc-rule-drawer-body">
        <p v-if="docRuleHint" class="doc-rule-hint">{{ docRuleHint }}</p>
        <el-table
          v-if="docRuleLines.length"
          :data="docRuleLines"
          border
          size="small"
          max-height="calc(100vh - 220px)"
          row-key="dictValue"
        >
          <el-table-column prop="dictLabel" label="证件类型" min-width="220" show-overflow-tooltip />
          <el-table-column label="必填" width="88" align="center">
            <template slot-scope="{ row }">
              <el-switch v-model="row.required" />
            </template>
          </el-table-column>
        </el-table>
        <div v-else-if="!docRuleLoading && docRuleDrawerVisible" class="doc-rule-empty">
          暂无字典项。请先在「字典管理」中维护类型 <code>VARIETY_DOC_TYPE</code> 下的证件选项。
        </div>
      </div>
      <div class="doc-rule-drawer-footer">
        <el-button @click="docRuleDrawerVisible = false">取消</el-button>
        <el-button type="primary" :loading="docRuleSaving" :disabled="docRuleLoading" @click="saveDocRules">
          保存
        </el-button>
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
        sideTableHeight: 360,
        regTableHeight: 400,
        layoutTimer: null,
        /** 品种证件必填 Drawer */
        docRuleDrawerVisible: false,
        docRuleMgmtRow: null,
        docRuleLoading: false,
        docRuleSaving: false,
        docRuleLines: [],
        docRuleHint: ''
      };
    },
    computed: {
      docRuleDrawerTitle() {
        const n = this.docRuleMgmtRow && this.docRuleMgmtRow.Mgmt_Cat_Name;
        return n ? `品种证件必填 · ${n}` : '品种证件必填';
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
        const rowRef = this.$refs.superviseRow;
        const rowEl = rowRef && (rowRef.$el || rowRef);
        if (rowEl) {
          ro.observe(rowEl);
        }
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
       * 优先用卡片 body 实际高度；未铺开时用视口回退。
       */
      updateTableHeights() {
        const measure = () => {
          const sideWrap = this.$refs.sideTableWrap;
          const regWrap = this.$refs.regTableWrap;

          if (sideWrap && sideWrap.clientHeight > 8) {
            this.sideTableHeight = Math.max(120, Math.floor(sideWrap.clientHeight));
          } else {
            this.sideTableHeight = this.fallbackSideTableHeight();
          }

          if (regWrap && regWrap.clientHeight > 8) {
            this.regTableHeight = Math.max(120, Math.floor(regWrap.clientHeight));
          } else {
            this.regTableHeight = this.fallbackRegTableHeight(this.$refs.regPagerWrap);
          }

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
      /** 卡片尚未铺开时的视口估算（与样式里 --supervise-vh-offset 一致思路） */
      fallbackSideTableHeight() {
        const root = this.$refs.pageRoot;
        if (!root || !root.getBoundingClientRect) {
          return 360;
        }
        const top = root.getBoundingClientRect().top;
        const avail = Math.max(0, window.innerHeight - top - 16);
        const estHeader = 48;
        return Math.max(200, Math.floor(avail - estHeader));
      },
      fallbackRegTableHeight(pagerEl) {
        const root = this.$refs.pageRoot;
        if (!root || !root.getBoundingClientRect) {
          return 400;
        }
        const top = root.getBoundingClientRect().top;
        const avail = Math.max(0, window.innerHeight - top - 16);
        const estHeader = 88;
        const ph = pagerEl && pagerEl.offsetHeight ? pagerEl.offsetHeight : 42;
        return Math.max(200, Math.floor(avail - estHeader - ph - 6));
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
      openDocRuleDrawer(row) {
        this.docRuleMgmtRow = row;
        this.docRuleHint = '';
        this.docRuleLines = [];
        this.docRuleDrawerVisible = true;
        this.loadDocRuleData();
      },
      onDocRuleDrawerClosed() {
        this.docRuleMgmtRow = null;
        this.docRuleHint = '';
        this.docRuleLines = [];
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
          const merged = await dictDataByTypeCode({
            dictTypeCode: VARIETY_DOC_TYPE_CODE,
            status: '1',
            size: 500,
            mgmtCatCode
          });
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
            this.docRuleHint = '未找到字典类型 VARIETY_DOC_TYPE，请先在字典管理中新增该类型。';
            return;
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

          this.docRuleLines = sorted.map((d) => {
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
        } catch (e) {
          Message.error(e.message || '加载证件配置失败');
        } finally {
          this.docRuleLoading = false;
        }
      },
      async saveDocRules() {
        const row = this.docRuleMgmtRow;
        if (!row || !this.docRuleLines.length) {
          this.docRuleDrawerVisible = false;
          return;
        }
        const mgmtCatCode = Number(row.Mgmt_Cat_Code);
        const requiredDictValues = this.docRuleLines.filter((l) => l.required).map((l) => l.dictValue);
        this.docRuleSaving = true;
        try {
          await mgmtCatVarietyDocRuleSync({
            mgmtCatCode,
            dictTypeCode: VARIETY_DOC_TYPE_CODE,
            requiredDictValues
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
    box-sizing: border-box;
    /* 整页占满内容区：顶栏+页签约 90px，可按实际改 */
    height: calc(100vh - 96px);
    min-height: 320px;
    display: flex;
    flex-direction: column;

    .supervise-row {
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
    }

    .supervise-row > .el-col {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .supervise-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      margin-bottom: 12px;

      ::v-deep .el-card__body {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    }

    .supervise-table-wrap {
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
    }

    .supervise-table-wrap--grow {
      flex: 1 1 auto;
      min-height: 0;
    }

    .reg-card-main {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .supervise-card--reg {
      ::v-deep .el-card__body {
        padding-bottom: 8px;
      }
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
    }

    .card-header--toolbar {
      flex-wrap: wrap;
      gap: 8px;
    }

    .toolbar-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    .search-input {
      width: 140px;
    }

    .pagination-wrap {
      flex-shrink: 0;
      margin-top: 8px;
      padding-top: 4px;
      display: flex;
      justify-content: flex-end;
    }

    .danger-btn {
      color: #f56c6c;
    }
  }

  /* Drawer 根节点在 body 上，用非 scoped 或 deep */
</style>

<style lang="scss">
  .doc-rule-drawer {
    .el-drawer__body {
      padding: 0 20px 16px;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
    }
  }

  .doc-rule-drawer-body {
    flex: 1;
    min-height: 120px;
    overflow: auto;
  }

  .doc-rule-hint {
    margin: 0 0 12px;
    font-size: 13px;
    color: #e6a23c;
    line-height: 1.5;
  }

  .doc-rule-empty {
    padding: 24px 8px;
    font-size: 13px;
    color: #909399;
    line-height: 1.6;

    code {
      font-size: 12px;
    }
  }

  .doc-rule-drawer-footer {
    flex-shrink: 0;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
</style>
