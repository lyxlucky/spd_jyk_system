<template>
  <div class="ele-body spd-page month-dept-cloud-sign">
    <div class="panel-grid">
      <div class="col-left">
        <div class="spd-section">
          <div class="spd-section__head">月结单</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__body">
              <el-form size="mini" class="ele-form-search" label-width="48px" @submit.native.prevent="loadMonthList">
                <el-form-item label="月份">
                  <el-date-picker
                    v-model="monthQuery.month"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月份"
                    clearable
                    style="width: 100%"
                    @change="loadMonthList"
                  />
                </el-form-item>
                <el-form-item label="单号">
                  <el-input v-model="monthQuery.monthNumble" clearable placeholder="月结单号" @keyup.enter.native="loadMonthList" />
                </el-form-item>
                <el-form-item label-width="0" class="ele-form-actions">
                  <el-button type="primary" icon="el-icon-search" @click="loadMonthList">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="spd-panel spd-table-panel">
            <div class="spd-table-panel__wrap">
              <el-table
                v-loading="monthLoading"
                :data="monthRows"
                border
                stripe
                size="mini"
                height="240"
                highlight-current-row
                @current-change="onMonthSelect"
              >
                <el-table-column prop="Monthly_Balance_Number" label="月结单号" min-width="100" show-overflow-tooltip />
                <el-table-column prop="sDate" label="月结月份" width="90" />
              </el-table>
            </div>
          </div>
        </div>

        <div class="spd-section">
          <div class="spd-section__head">科室</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__body">
              <el-form size="mini" :inline="true" class="ele-form-search" @submit.native.prevent="loadDeptList">
                <el-form-item label="科室">
                  <el-input v-model="deptName" clearable placeholder="科室名称" style="width: 140px" @keyup.enter.native="loadDeptList" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="loadDeptList">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="spd-panel spd-table-panel">
            <div class="spd-table-panel__wrap">
              <el-table
                v-loading="deptLoading"
                :data="deptRows"
                border
                stripe
                size="mini"
                height="calc(100vh - 520px)"
                highlight-current-row
                @current-change="onDeptSelect"
              >
                <el-table-column prop="Dept_One_Name" label="一级科室" min-width="70" show-overflow-tooltip />
                <el-table-column prop="SPD_COST_DEPT_NAME" label="二级科室" min-width="90" show-overflow-tooltip />
                <el-table-column label="云签" width="72">
                  <template slot-scope="{ row }">{{ row.statusLabel || '未签' }}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="spd-section mensual-section--stretch">
          <div class="spd-section__head">科室月结明细 · 云签</div>
          <div class="spd-panel spd-panel--search">
            <div class="spd-panel__body">
              <div class="sign-status-bar">
                <span>领用：
                  <el-tag size="mini" :type="signDetail.receiverSigned ? 'success' : 'info'">
                    {{ signDetail.receiverSigned ? `已签 ${signDetail.receiverSignTime || ''}` : '未签' }}
                  </el-tag>
                </span>
                <span>审核人：
                  <el-tag size="mini" :type="signDetail.auditorSigned ? 'success' : 'info'">
                    {{ signDetail.auditorSigned ? `已签 ${signDetail.auditorSignTime || ''}` : '未签' }}
                  </el-tag>
                </span>
                <span class="status-summary">{{ signDetail.statusLabel || '未选择科室' }}</span>
              </div>
              <el-form size="mini" :inline="true" class="ele-form-search" @submit.native.prevent>
                <el-form-item class="ele-form-actions" label-width="0">
                  <el-button type="primary" :disabled="!canOperate" @click="loadPreview">刷新预览</el-button>
                  <el-button type="warning" :disabled="!canOperate" @click="openSign('RECEIVER')">领用云签</el-button>
                  <el-button type="warning" :disabled="!canOperate" @click="openSign('AUDITOR')">审核人云签</el-button>
                  <el-button :disabled="!canOperate || !previewPages.length" @click="printPreview">浏览器打印预览</el-button>
                  <el-button type="primary" :disabled="!canOperate" @click="downloadExcel(true)">下载打印单(带章)</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="spd-panel spd-table-panel preview-panel">
            <div class="spd-panel__head">
              打印单预览（与导出 Excel 版式一致，可直接查看签章位置）
              <span v-if="selectedDept" class="preview-dept">{{ selectedDept.SPD_COST_DEPT_NAME }}</span>
            </div>
            <div v-loading="previewLoading" class="print-preview-wrap">
              <div v-if="!previewPages.length" class="preview-empty">请选择月结单和科室后查看医用耗材月结明细表预览</div>
              <div v-else id="month-dept-print-preview" class="print-preview-sheets">
                <div
                  v-for="page in previewPages"
                  :key="page.pageNo"
                  class="print-sheet"
                >
                  <div class="sheet-title">{{ sheetTitle }}</div>
                  <table class="sheet-table">
                    <thead>
                      <tr>
                        <th class="col-dept">科室</th>
                        <th class="col-no">序号</th>
                        <th class="col-type">结算方式（PDA扫码消耗、his计费消耗、散货申领）</th>
                        <th class="col-name">品种名称</th>
                        <th class="col-spec">规格</th>
                        <th class="col-model">型号</th>
                        <th class="col-unit">计量单位</th>
                        <th class="col-qty">数量</th>
                        <th class="col-price">单价</th>
                        <th class="col-amount">金额</th>
                        <th class="col-cert">注册证号</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, idx) in page.rows" :key="idx">
                        <td>{{ row.DEPT_TWO_NAME }}</td>
                        <td>{{ page.startIndex + idx + 1 }}</td>
                        <td>{{ row.CONSUMPTION_TYPE }}</td>
                        <td class="text-left">{{ row.VARIETIE_NAME }}</td>
                        <td>{{ row.SPECIFICATION_OR_TYPE }}</td>
                        <td />
                        <td>{{ row.UNIT }}</td>
                        <td>{{ row.GOODS_QTY }}</td>
                        <td>{{ formatPrice(row.SUPPLY_PRICE) }}</td>
                        <td>{{ formatMoney(row.GOODS_QTY, row.SUPPLY_PRICE) }}</td>
                        <td>{{ row.APPROVAL_NUMBER }}</td>
                      </tr>
                      <tr class="sum-row">
                        <td colspan="2" />
                        <td>本页小记:</td>
                        <td colspan="4" class="text-left">{{ page.pageAmountText }}</td>
                        <td>{{ page.pageQty }}</td>
                        <td />
                        <td>{{ page.pageAmount }}</td>
                        <td />
                      </tr>
                      <tr class="sum-row">
                        <td colspan="2" />
                        <td>合计金额:</td>
                        <td colspan="4" class="text-left">{{ totalAmountText }}</td>
                        <td>{{ totalQty }}</td>
                        <td />
                        <td>{{ totalAmount }}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                  <div class="sheet-footer">
                    <div class="footer-item">制单：{{ makerName }}</div>
                    <div class="footer-item">审核：黄志石</div>
                    <div class="footer-item stamp-slot">
                      <span class="footer-label">领用：</span>
                      <img v-if="receiverStampSrc" :src="receiverStampSrc" alt="领用签章" class="stamp-img" />
                      <span v-else class="stamp-placeholder">（未签）</span>
                    </div>
                    <div class="footer-item stamp-slot">
                      <span class="footer-label">审核人：</span>
                      <img v-if="auditorStampSrc" :src="auditorStampSrc" alt="审核人签章" class="stamp-img" />
                      <span v-else class="stamp-placeholder">（未签）</span>
                    </div>
                  </div>
                  <div class="sheet-page-no">{{ page.pageNo }}/{{ previewPages.length }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CloudSignQrDialog ref="cloudSignDialog" />
  </div>
</template>

<script>
import * as api from '@/api/Settle/MensualBills';
import CloudSignQrDialog from '@/views/Settle/MensualBills/components/CloudSignQrDialog.vue';
import { openExcelFile } from '@/views/Settle/MensualBills/utils';

const PAGE_SIZE = 12;

function formatMonth(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function getMonthRange(month) {
  const value = month || formatMonth();
  const [y, m] = value.split('-').map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  const mm = String(m).padStart(2, '0');
  const dd = String(lastDay).padStart(2, '0');
  return {
    start: `${y}-${mm}-01`,
    end: `${y}-${mm}-${dd}`
  };
}

function toStampSrc(base64) {
  if (!base64) return '';
  if (base64.startsWith('data:image')) return base64;
  return `data:image/png;base64,${base64}`;
}

function round2(n) {
  return (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
}

/** 金额转中文大写（预览用，与打印单小记展示接近） */
function amountToChinese(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  const head = n < 0 ? '负' : '';
  let num = Math.abs(Number(n) || 0);
  let s = '';
  for (let i = 0; i < fraction.length; i += 1) {
    s += (digit[Math.floor(num * 10 * 10 ** i) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
}

export default {
  name: 'MonthDeptCloudSign',
  components: { CloudSignQrDialog },
  data() {
    return {
      monthQuery: {
        month: formatMonth(),
        monthNumble: ''
      },
      deptName: '',
      monthLoading: false,
      deptLoading: false,
      previewLoading: false,
      monthRows: [],
      deptRows: [],
      previewRows: [],
      previewPages: [],
      sheetTitle: '',
      makerName: '胡帆',
      totalQty: 0,
      totalAmount: '0.00',
      totalAmountText: '',
      receiverStampSrc: '',
      auditorStampSrc: '',
      selectedMonth: null,
      selectedDept: null,
      signDetail: {
        receiverSigned: false,
        auditorSigned: false,
        receiverSignTime: '',
        auditorSignTime: '',
        statusLabel: ''
      }
    };
  },
  computed: {
    canOperate() {
      return !!(this.selectedMonth && this.selectedDept);
    }
  },
  mounted() {
    this.loadMonthList();
  },
  methods: {
    formatPrice(v) {
      return round2(v);
    },
    formatMoney(qty, price) {
      return round2((Number(qty) || 0) * (Number(price) || 0));
    },
    async loadMonthList() {
      this.monthLoading = true;
      try {
        const params = {
          MonthStartDate: '',
          MonthENDDate: '',
          MonthNumble: this.monthQuery.monthNumble || ''
        };
        if (this.monthQuery.month) {
          const range = getMonthRange(this.monthQuery.month);
          params.MonthStartDate = range.start;
          params.MonthENDDate = range.end;
        }
        const res = await api.monthNum(params);
        this.monthRows = res.result || [];
        this.selectedMonth = null;
        this.selectedDept = null;
        this.deptRows = [];
        this.clearPreview();
        this.resetSignDetail();
        if (!this.monthRows.length) {
          const tip = this.monthQuery.month
            ? `未查询到 ${this.monthQuery.month} 的月结单`
            : '未查询到月结单';
          this.$message.info(tip);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.monthLoading = false;
      }
    },
    onMonthSelect(row) {
      this.selectedMonth = row;
      this.selectedDept = null;
      this.deptRows = [];
      this.clearPreview();
      this.resetSignDetail();
      if (row) this.loadDeptList();
    },
    async loadDeptList() {
      if (!this.selectedMonth) {
        this.$message.warning('请先选择月结单');
        return;
      }
      this.deptLoading = true;
      try {
        // onlyUserDept=true：只返回当前登录账号绑定的科室
        const res = await api.getMonthDeptSignStatus(
          this.selectedMonth.ID,
          this.deptName || '',
          true
        );
        this.deptRows = (res.result || []).map((item) => ({
          Dept_One_Name: item.deptOneName || '',
          SPD_COST_DEPT_NAME: item.deptTwoName || '',
          SPD_COST_DEPT_CODE: item.deptTwoCode || '',
          statusLabel: item.statusLabel || '未签',
          receiverSigned: !!item.receiverSigned,
          auditorSigned: !!item.auditorSigned,
          receiverSignTime: item.receiverSignTime || '',
          auditorSignTime: item.auditorSignTime || ''
        }));
        this.selectedDept = null;
        this.clearPreview();
        this.resetSignDetail();
        if (!this.deptRows.length) {
          this.$message.info('当前账号未绑定可用科室，或本月结单下无对应科室数据');
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.deptLoading = false;
      }
    },
    async onDeptSelect(row) {
      this.selectedDept = row;
      if (!row) {
        this.clearPreview();
        this.resetSignDetail();
        return;
      }
      this.applySignDetail(row);
      await this.loadPreview();
    },
    clearPreview() {
      this.previewRows = [];
      this.previewPages = [];
      this.sheetTitle = '';
      this.makerName = '胡帆';
      this.totalQty = 0;
      this.totalAmount = '0.00';
      this.totalAmountText = '';
      this.receiverStampSrc = '';
      this.auditorStampSrc = '';
    },
    resetSignDetail() {
      this.signDetail = {
        receiverSigned: false,
        auditorSigned: false,
        receiverSignTime: '',
        auditorSignTime: '',
        statusLabel: ''
      };
    },
    applySignDetail(row) {
      this.signDetail = {
        receiverSigned: !!row.receiverSigned,
        auditorSigned: !!row.auditorSigned,
        receiverSignTime: row.receiverSignTime || '',
        auditorSignTime: row.auditorSignTime || '',
        statusLabel: row.statusLabel || ''
      };
    },
    async loadSignDetail() {
      if (!this.selectedMonth || !this.selectedDept) return;
      try {
        const res = await api.getDeptSignDetail(
          this.selectedMonth.ID,
          this.selectedDept.SPD_COST_DEPT_CODE
        );
        const d = res.result || {};
        this.signDetail = {
          receiverSigned: !!d.receiverSigned,
          auditorSigned: !!d.auditorSigned,
          receiverSignTime: d.receiverSignTime || '',
          auditorSignTime: d.auditorSignTime || '',
          statusLabel: d.statusLabel || ''
        };
        if (this.selectedDept) {
          this.selectedDept.receiverSigned = this.signDetail.receiverSigned;
          this.selectedDept.auditorSigned = this.signDetail.auditorSigned;
          this.selectedDept.receiverSignTime = this.signDetail.receiverSignTime;
          this.selectedDept.auditorSignTime = this.signDetail.auditorSignTime;
          this.selectedDept.statusLabel = this.signDetail.statusLabel;
        }
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    buildPreviewPages(rows) {
      const list = rows || [];
      let totalQty = 0;
      let totalAmount = 0;
      list.forEach((r) => {
        const qty = Number(r.GOODS_QTY) || 0;
        const price = Number(r.SUPPLY_PRICE) || 0;
        totalQty += qty;
        totalAmount += qty * price;
      });
      this.totalQty = totalQty;
      this.totalAmount = round2(totalAmount);
      this.totalAmountText = amountToChinese(totalAmount);

      const first = list[0] || {};
      const monthTime = (first.MONTHLY_TIME || '').toString();
      const parts = monthTime.split('-');
      const year = parts[0] || '';
      const month = parts[1] || '';
      const deptName = this.selectedDept?.SPD_COST_DEPT_NAME || first.DEPT_TWO_NAME || '';
      this.sheetTitle = `深圳市龙华区妇幼保健院${year}年${month}月医用耗材月结明细表`;
      // 2026-07 起制单人改为洪霞，历史月份仍显示胡帆
      const ym = monthTime.length >= 7 ? monthTime.substring(0, 7) : '';
      this.makerName = ym && ym >= '2026-07' ? '洪霞' : '胡帆';

      if (!list.length) {
        this.previewPages = [];
        return;
      }

      const pageCount = Math.ceil(list.length / PAGE_SIZE);
      const pages = [];
      for (let i = 0; i < pageCount; i += 1) {
        const start = i * PAGE_SIZE;
        const pageRows = list.slice(start, start + PAGE_SIZE);
        let pageQty = 0;
        let pageAmount = 0;
        pageRows.forEach((r) => {
          const qty = Number(r.GOODS_QTY) || 0;
          const price = Number(r.SUPPLY_PRICE) || 0;
          pageQty += qty;
          pageAmount += qty * price;
        });
        pages.push({
          pageNo: i + 1,
          startIndex: start,
          rows: pageRows,
          pageQty,
          pageAmount: round2(pageAmount),
          pageAmountText: amountToChinese(pageAmount)
        });
      }
      this.previewPages = pages;
    },
    async loadPreview() {
      if (!this.selectedMonth || !this.selectedDept) {
        this.$message.warning('请先选择月结单和科室');
        return;
      }
      this.previewLoading = true;
      try {
        const [detailRes, stampRes] = await Promise.all([
          api.getLhfyMonDtlPreview({
            MonthID: this.selectedMonth.ID,
            DeptTwoCode: this.selectedDept.SPD_COST_DEPT_CODE
          }),
          api.getDeptSignStamps(
            this.selectedMonth.ID,
            this.selectedDept.SPD_COST_DEPT_CODE
          )
        ]);
        this.previewRows = detailRes.result || [];
        const stamps = stampRes.result || {};
        this.receiverStampSrc = toStampSrc(stamps.receiverStampBase64);
        this.auditorStampSrc = toStampSrc(stamps.auditorStampBase64);
        this.buildPreviewPages(this.previewRows);
        if (!this.previewRows.length) {
          this.$message.info('该科室暂无月结明细数据');
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.previewLoading = false;
      }
    },
    async openSign(signRole) {
      if (!this.canOperate) return;
      const dialog = this.$refs.cloudSignDialog;
      if (!dialog) {
        this.$message.error('云签组件未就绪');
        return;
      }
      try {
        await dialog.open(
          this.selectedMonth.ID,
          this.selectedDept.SPD_COST_DEPT_CODE,
          signRole
        );
        this.$message.success(signRole === 'RECEIVER' ? '领用签章成功' : '审核人签章成功');
        await this.loadSignDetail();
        await this.loadPreview();
      } catch (e) {
        if (e.message !== '已取消云签认证') {
          this.$message.error(e.message);
        }
      }
    },
    printPreview() {
      if (!this.previewPages.length) {
        this.$message.warning('暂无预览内容');
        return;
      }
      const el = document.getElementById('month-dept-print-preview');
      if (!el) return;
      const win = window.open('', '_blank');
      if (!win) {
        this.$message.warning('浏览器拦截了打印窗口，请允许弹窗后重试');
        return;
      }
      win.document.write(`<!DOCTYPE html><html><head><title>${this.sheetTitle}</title>
<style>
  body { margin: 12px; font-family: "宋体", SimSun, serif; color: #000; }
  .print-sheet { page-break-after: always; margin-bottom: 24px; }
  .print-sheet:last-child { page-break-after: auto; }
  .sheet-title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
  .sheet-table { width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed; }
  .sheet-table th, .sheet-table td { border: 1px solid #000; padding: 4px 3px; text-align: center; vertical-align: middle; word-break: break-all; }
  .text-left { text-align: left !important; }
  .sheet-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 13px; min-height: 48px; }
  .footer-item { flex: 1; display: inline-flex; align-items: center; height: 48px; }
  .stamp-slot { display: inline-flex; align-items: center; }
  .footer-label { flex-shrink: 0; }
  .stamp-img { height: 40px; max-width: 110px; object-fit: contain; margin-left: 4px; vertical-align: middle; }
  .stamp-placeholder { display: inline-block; min-width: 110px; height: 40px; line-height: 40px; margin-left: 4px; visibility: hidden; }
  .sheet-page-no { text-align: center; margin-top: 8px; font-size: 12px; }
</style></head><body>${el.innerHTML}</body></html>`);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
      }, 300);
    },
    async downloadExcel(withStamp) {
      if (!this.canOperate) return;
      const loading = this.$loading({ lock: true, text: withStamp ? '生成带章报表…' : '生成报表…' });
      try {
        const params = {
          MonthID: this.selectedMonth.ID,
          DeptTwoCode: this.selectedDept.SPD_COST_DEPT_CODE
        };
        if (withStamp) {
          params.useCloudSign = '1';
        }
        const res = await api.abdzczhPrint('PrintLhfyMonDtl', params);
        if (res.msg) openExcelFile(res.msg);
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.month-dept-cloud-sign {
  min-height: 0;
}

.panel-grid {
  display: flex;
  gap: 10px;
  min-height: calc(100vh - 140px);
  align-items: stretch;
}

.col-left {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.spd-section {
  background: #fff;
}

.mensual-section--stretch {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .preview-panel {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

.sign-status-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #606266;
}

.status-summary {
  color: #409eff;
  font-weight: 600;
}

.preview-dept {
  margin-left: 8px;
  color: #909399;
  font-weight: normal;
  font-size: 12px;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

.print-preview-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #e9eef5;
  padding: 12px;
}

.preview-empty {
  text-align: center;
  color: #909399;
  padding: 80px 12px;
}

.print-preview-sheets {
  max-width: 1100px;
  margin: 0 auto;
}

.print-sheet {
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 16px 18px 12px;
  margin-bottom: 14px;
}

.sheet-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #303133;
}

.sheet-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
  color: #303133;
}

.sheet-table th,
.sheet-table td {
  border: 1px solid #303133;
  padding: 4px 3px;
  text-align: center;
  vertical-align: middle;
  word-break: break-all;
}

.sheet-table th {
  background: #f5f7fa;
  font-weight: 600;
  line-height: 1.3;
}

.col-dept { width: 8%; }
.col-no { width: 5%; }
.col-type { width: 16%; }
.col-name { width: 16%; }
.col-spec { width: 9%; }
.col-model { width: 6%; }
.col-unit { width: 6%; }
.col-qty { width: 6%; }
.col-price { width: 7%; }
.col-amount { width: 8%; }
.col-cert { width: 13%; }

.text-left {
  text-align: left !important;
}

.sum-row td {
  font-weight: 600;
}

.sheet-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  font-size: 13px;
  gap: 8px;
  min-height: 48px;
}

.footer-item {
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  height: 48px;
  line-height: 1;
}

.stamp-slot {
  display: inline-flex;
  align-items: center;
}

.footer-label {
  flex-shrink: 0;
}

.stamp-img {
  height: 40px;
  max-width: 110px;
  object-fit: contain;
  margin-left: 4px;
  vertical-align: middle;
}

.stamp-placeholder {
  display: inline-block;
  min-width: 110px;
  height: 40px;
  line-height: 40px;
  margin-left: 4px;
  color: #c0c4cc;
  vertical-align: middle;
}

.sheet-page-no {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}
</style>
