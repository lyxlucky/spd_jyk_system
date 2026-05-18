<template>
  <div class="ele-body effective-tip-win-show">
    <contract-maintenance-dialog ref="contractDlg" />

    <!-- 1 -->
    <win-show-section
      ref="blsj"
      title="近三天不良事件上报提醒"
      cache-key="EffectiveTipWinShowBlsj"
      :columns="blsjColumns"
      :datasource="dsBlsj"
      :height="250"
      :page-size="100"
      :page-sizes="[50, 100, 200, 300, 99999]"
      export-permission="export-EffectiveTipWinShow-blsjdc"
      :exporting="exporting.blsj"
      @export="exportBlsj"
      @sort-change="() => onSectionSort('blsj')"
    />

    <!-- 2 -->
    <win-show-section
      ref="bhjh"
      title="备货计划30天内未完全收货合同（近15天）过期"
      cache-key="EffectiveTipWinShowBhjh"
      :columns="bhjhColumns"
      :datasource="dsBhjh"
      :height="395"
      export-permission="export-EffectiveTipWinShow-bhjhdc"
      :exporting="exporting.bhjh"
      @export="exportBhjh"
      @sort-change="() => onSectionSort('bhjh')"
    >
      <template #bhjhConEnd="{ row }">
        <span :class="{ 'text-expired': formatContractExpiryDays(row.CONTRACT_END_TIME).expired }">
          {{ formatContractExpiryDays(row.CONTRACT_END_TIME).text }}
        </span>
      </template>
      <template #bhjhDetEnd="{ row }">
        <span :class="{ 'text-expired': formatContractExpiryDays(row.DET_CONTRACT_END).expired }">
          {{ formatContractExpiryDays(row.DET_CONTRACT_END).text }}
        </span>
      </template>
    </win-show-section>

    <!-- 3 -->
    <win-show-section
      ref="kcxq"
      title="库存效期（近6个月）"
      cache-key="EffectiveTipWinShowKcxq"
      :columns="invColsExpiry"
      :datasource="dsKcxq"
      :height="395"
      export-permission="export-EffectiveTipWinShow-kcxqdc"
      :exporting="exporting.kcxq"
      @export="exportKcxq"
      @sort-change="() => onSectionSort('kcxq')"
    >
      <template #batchValidity="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.Batch_Validity_Period).expired }">
          {{ formatDateWithExpiry(row.Batch_Validity_Period).text }}
        </span>
      </template>
      <template #contractEnd="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.CONTRACT_END_TIME).expired }">
          {{ formatDateWithExpiry(row.CONTRACT_END_TIME).text }}
        </span>
      </template>
    </win-show-section>

    <!-- 4 -->
    <win-show-section
      ref="kcht"
      title="库存合同过期（近3天）"
      cache-key="EffectiveTipWinShowKcht"
      :columns="invColsContract"
      :datasource="dsKcht"
      :height="395"
      export-permission="export-EffectiveTipWinShow-kchtdc"
      :exporting="exporting.kcht"
      @export="exportKcht"
      @sort-change="() => onSectionSort('kcht')"
    >
      <template #inventoryAction="{ row }">
        <el-button type="text" size="small" @click="openContractMaintenance(row)">合同</el-button>
      </template>
      <template #batchValidity="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.Batch_Validity_Period).expired }">
          {{ formatDateWithExpiry(row.Batch_Validity_Period).text }}
        </span>
      </template>
      <template #contractEnd="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.CONTRACT_END_TIME).expired }">
          {{ formatDateWithExpiry(row.CONTRACT_END_TIME).text }}
        </span>
      </template>
      <template #detContractEnd="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.DET_CONTRACT_END).expired }">
          {{ formatDateWithExpiry(row.DET_CONTRACT_END).text }}
        </span>
      </template>
    </win-show-section>

    <!-- 5 -->
    <win-show-section
      ref="zcz"
      title="注册证过期近1月"
      cache-key="EffectiveTipWinShowZcz"
      :columns="prodAuthColumns"
      :datasource="dsProdAuth"
      :height="300"
      export-permission="export-EffectiveTipWinShow-zczdc"
      :exporting="exporting.zcz"
      :table-props="prodAuthTableProps"
      @export="exportZcz"
      @sort-change="() => onSectionSort('zcz')"
    >
      <template #regValid="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.Registration_Valid_Date).expired }">
          {{ formatDateWithExpiry(row.Registration_Valid_Date).text }}
        </span>
      </template>
      <template #regIssue="{ row }">
        {{ formatDate10(row.Registration_Issuing_Date) }}
      </template>
    </win-show-section>

    <!-- 6 -->
    <win-show-section
      ref="gysht"
      title="供应商合同过期（近1个月）"
      cache-key="EffectiveTipWinShowGysht"
      :columns="contractAuthColumns"
      :datasource="dsContractAuth"
      :height="300"
      export-permission="export-EffectiveTipWinShow-gysdc"
      :exporting="exporting.gysht"
      @export="exportGysht"
      @sort-change="() => onSectionSort('gysht')"
    >
      <template #toolbar-left>
        <el-select
          v-model="contractAuthenum"
          size="small"
          style="width: 220px; margin-right: 8px"
          @change="reloadRef('gysht')"
        >
          <el-option label="合同终止时间" value="1" />
          <el-option label="全部" value="0" />
          <el-option label="质量保证协议书有效期" value="2" />
          <el-option label="委托书有效期" value="3" />
        </el-select>
        <el-button size="small" type="danger" plain @click="onDeactivateContractsAll">一键停用到期合同</el-button>
      </template>
      <template #contractStart="{ row }">
        {{ formatDate10(row.Contract_Start_Time) }}
      </template>
      <template #contractEndAuth="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.Contract_End_Time).expired }">
          {{ formatDateWithExpiry(row.Contract_End_Time).text }}
        </span>
      </template>
      <template #poaValid="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.Power_Of_Attorney_Valid_Date).expired }">
          {{ formatDateWithExpiry(row.Power_Of_Attorney_Valid_Date).text }}
        </span>
      </template>
    </win-show-section>

    <!-- 7 -->
    <win-show-section
      ref="gysmx"
      :title="'供应商合同明细过期（' + gysmxDayLabel + '）'"
      cache-key="EffectiveTipWinShowGysmx"
      :columns="contractVarColumns"
      :datasource="dsContractVar"
      :height="265"
      export-permission="export-EffectiveTipWinShow-gysmxdc"
      :exporting="exporting.gysmx"
      @export="exportGysmx"
      @sort-change="() => onSectionSort('gysmx')"
    >
      <template #filters>
        <div style="margin-bottom: 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px">
          <span>开始日期</span>
          <el-date-picker
            v-model="gysmxRangeStart"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="开始日期"
            style="width: 150px"
          />
          <span>—</span>
          <span>结束日期</span>
          <el-date-picker
            v-model="gysmxRangeEnd"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            placeholder="结束日期"
            style="width: 150px"
          />
          <el-button size="small" type="primary" @click="reloadRef('gysmx')">查询</el-button>
        </div>
      </template>
      <template #authValid="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.Auth_Valid).expired }">
          {{ formatDateWithExpiry(row.Auth_Valid).text }}
        </span>
      </template>
      <template #detEnd="{ row }">
        <span :class="{ 'text-expired': formatDateWithExpiry(row.DET_CONTRACT_END).expired }">
          {{ formatDateWithExpiry(row.DET_CONTRACT_END).text }}
        </span>
      </template>
    </win-show-section>

    <!-- 8 -->
    <win-show-section
      ref="gyszz"
      title="供应商资质过期（近1个月）"
      cache-key="EffectiveTipWinShowGyszz"
      :columns="supplierAuthColumns"
      :datasource="dsSupplierAuth"
      :height="300"
      :page-size="9999"
      :page-sizes="[100, 9999, 99999]"
      export-permission="export-EffectiveTipWinShow-gyszzdc"
      :exporting="exporting.gyszz"
      @export="exportGyszz"
      @sort-change="() => onSectionSort('gyszz')"
    >
      <template #toolbar-left>
        <el-select
          v-model="supplierEnum"
          size="small"
          style="width: 240px"
          @change="reloadRef('gyszz')"
        >
          <el-option label="全部" value="0" />
          <el-option label="营业执照有效期" value="1" />
          <el-option label="一类的许可证经营有效期" value="5" />
          <el-option label="二类的许可证经营有效期" value="3" />
          <el-option label="三类的许可证经营有效期" value="4" />
        </el-select>
      </template>
      <template #blDate="{ row }">
        <span :class="{ 'text-expired': supplierDateExpired(row.Business_License_Valid_Date).expired }">
          {{ supplierDateExpired(row.Business_License_Valid_Date).text }}
        </span>
      </template>
      <template #c1Date="{ row }">
        <span :class="{ 'text-expired': supplierDateExpired(row.RODUCTION_CLASS_1_VALID_DATE).expired }">
          {{ supplierDateExpired(row.RODUCTION_CLASS_1_VALID_DATE).text }}
        </span>
      </template>
      <template #c2Date="{ row }">
        <span :class="{ 'text-expired': supplierDateExpired(row.Roduction_Class_2_Valid_Date).expired }">
          {{ supplierDateExpired(row.Roduction_Class_2_Valid_Date).text }}
        </span>
      </template>
      <template #c3Date="{ row }">
        <span :class="{ 'text-expired': supplierDateExpired(row.Roduction_Class_3_Valid_Date).expired }">
          {{ supplierDateExpired(row.Roduction_Class_3_Valid_Date).text }}
        </span>
      </template>
    </win-show-section>

    <!-- 9 -->
    <win-show-section
      ref="pztj"
      title="品种调价信息"
      cache-key="EffectiveTipWinShowPztj"
      :columns="tjVarColumns"
      :datasource="dsTjVar"
      :height="300"
      :page-size="9999"
      :page-sizes="[9999, 99999]"
      export-permission="export-EffectiveTipWinShow-pztjdc"
      :exporting="exporting.pztj"
      :selection.sync="selTjVar"
      @export="exportPztj"
      @sort-change="() => onSectionSort('pztj')"
    >
      <template #toolbar-left>
        <el-button
          v-if="showSendVarBtn"
          size="small"
          type="primary"
          :loading="sendingVar"
          @click="onSendVarieties"
        >
          发送品种
        </el-button>
      </template>
    </win-show-section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';
import {
  searchCentralWarehouse,
  buildInventoryWhere,
  inventoryValidDateTo180Days,
  stockVarContValTip,
  searchProdAuthExpired,
  searchContractAuthExpired,
  searchContractVarietieAuthExpired,
  searchSupplierAuthExpired,
  deactivateContractsAll,
  getVarietyReports,
  buildBlsjPrams,
  getTjVarInfo,
  sendVarStzy,
  sendVarCsyy,
  sendVarStse,
  sendVarStzl
} from '@/api/Statistics/EffectiveTipWinShow';
import WinShowSection from './components/WinShowSection.vue';
import ContractMaintenanceDialog from './components/ContractMaintenanceDialog.vue';
import { createInventoryColumns } from './utils/inventoryColumns';
import {
  formatDate10,
  formatDateWithExpiry,
  formatContractExpiryDays,
  getMonthStartEnd,
  daysBetween,
  upShelfStateName,
  receivePropertyName,
  formatSupplyPrice
} from './utils/format';

const SEND_VAR_HPS = ['stzyyy', 'chrmyy', 'csyy', 'stse', 'stzl'];

export default {
  name: 'EffectiveTipWinShow',
  components: { WinShowSection, ContractMaintenanceDialog },
  data() {
    const { start, end } = getMonthStartEnd();
    return {
      blsjColumns: [
        { type: 'index', label: '序号', width: 50, align: 'center' },
        {
          columnKey: 'blsjRemark',
          label: '原因分析及处置意见',
          minWidth: 100,
          formatter: (row) => (row.REMARK == null ? '无' : row.REMARK)
        },
        { prop: 'REPORT_ID', label: '报告编码', width: 70, align: 'center' },
        { prop: 'REPORT_DATE', label: '报告日期', width: 90 },
        { prop: 'PRODUCT_NAME', label: '产品名称', minWidth: 100 },
        { prop: 'REGISTRATION_NUMBER', label: '注册证号', width: 80 },
        { prop: 'PRODUCT_BATCH_NUMBER', label: '产品批号', width: 90 },
        { prop: 'SPECIFICATION', label: '规格', width: 80 },
        { prop: 'PRODUCT_ID', label: '产品编号', width: 80 },
        { prop: 'PRODUCTION_DATE', label: '生产日期', width: 90, formatter: (r) => formatDate10(r.PRODUCTION_DATE) },
        {
          columnKey: 'blsjEffective',
          label: '有效期至',
          width: 90,
          formatter: (r) => formatDate10(r.EFFECTIVE_DATE)
        },
        { prop: 'MANUFACTURER_NAME', label: '生产企业名称', minWidth: 100 },
        { prop: 'OCCURRENCE_DATE', label: '事件发生日期', width: 110, formatter: (r) => formatDate10(r.OCCURRENCE_DATE) },
        { prop: 'KNOW_DATE', label: '获知日期', width: 90, formatter: (r) => formatDate10(r.KNOW_DATE) },
        { prop: 'DAMAGE_PERFORMANCE', label: '伤害表现', width: 90 },
        { prop: 'NAME', label: '姓名', width: 70 },
        { prop: 'AGE', label: '年龄', width: 50 },
        { prop: 'AGE_TYPE', label: '年龄类型', width: 90 },
        { prop: 'GENDER', label: '性别', width: 50 },
        { prop: 'MECHANICAL_MANIFESTATION', label: '器械故障表现', minWidth: 100 },
        { prop: 'ROLE', label: '作用', width: 70 },
        { prop: 'MACHINE_SERVICE_DATE', label: '机械使用日期', width: 110, formatter: (r) => formatDate10(r.MACHINE_SERVICE_DATE) },
        { prop: 'USE_PLACE', label: '使用场所', width: 90 },
        { prop: 'PLACE_NAME', label: '场所名称', width: 90 },
        { prop: 'USE_PROCESS', label: '使用过程', width: 90 },
        { prop: 'CAUSE_ANALYSIS', label: '原因分析', width: 90 },
        { prop: 'PRELIMINARY_TREATMENT', label: '初步处置', width: 90 },
        { prop: 'REPORTER', label: '报告人', width: 80 },
        { prop: 'REPORT_DEPARTMENT', label: '上报科室', width: 90 },
        { prop: 'CONTACT_PHONE', label: '联系电话', width: 90 },
        { prop: 'REVIEW_STATUS', label: '审核状态', width: 90 }
      ],
      bhjhColumns: [
        { prop: 'CREATOR', label: '备货人', width: 80 },
        { prop: 'Stock_Up_Plan_No', label: '备货计划单号', minWidth: 100 },
        { prop: 'supplier_name', label: '供应商名称', minWidth: 100 },
        {
          prop: 'PLAN_TIME',
          label: '备货日期',
          width: 90,
          formatter: (r) => formatDate10(r.PLAN_TIME)
        },
        {
          columnKey: 'bhjhConEnd',
          prop: 'CONTRACT_END_TIME',
          label: '合同到期',
          width: 140,
          sortable: 'custom',
          slot: 'bhjhConEnd'
        },
        {
          columnKey: 'bhjhDetEnd',
          prop: 'DET_CONTRACT_END',
          label: '合同明细到期',
          width: 140,
          sortable: 'custom',
          slot: 'bhjhDetEnd'
        },
        { prop: 'CONTRACT_NAME', label: '合同名称', minWidth: 120 },
        { prop: 'Varietie_Code_New', label: '品种编码', width: 100 },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 140 },
        { prop: 'Specification_Or_Type', label: '型号/规格', width: 140 },
        { prop: 'Unit', label: '单位', width: 50, align: 'center' },
        {
          prop: 'supply_price',
          label: '价格',
          width: 100,
          align: 'right',
          formatter: (r) => {
            const p = r.supply_price;
            const bl = r.price_bl != null ? Number(r.price_bl) : 2;
            if (p == null || p === '') return '';
            return Number(p).toFixed(bl);
          }
        },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 120 },
        { prop: 'Coefficient', label: '系数', width: 50, align: 'center' },
        {
          columnKey: 'planDefQty',
          label: '备货计划(包)',
          width: 100,
          align: 'center',
          formatter: (r) => r.Stock_Up_Plan_Def_Quantity
        },
        { prop: 'Stock_Up_Plan_Goods_Quantity', label: '折算散货', width: 90, align: 'center' },
        { prop: 'ReceiptQty', label: '收货数量', width: 90, align: 'center' },
        { prop: 'USED_QTY', label: '上月用量', width: 90, align: 'center' },
        { prop: 'AVG_USED_QTY', label: '三月平均量', width: 90, align: 'center' }
      ],
      prodAuthColumns: [
        { prop: 'Prod_Registration_Name', label: '注册证名称', minWidth: 180 },
        { prop: 'Approval_Number', label: '批准文号', minWidth: 180 },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 180 },
        {
          columnKey: 'regValid',
          prop: 'Registration_Valid_Date',
          label: '注册证有效日期',
          minWidth: 180,
          sortable: 'custom',
          slot: 'regValid'
        },
        {
          columnKey: 'regIssue',
          prop: 'Registration_Issuing_Date',
          label: '注册证发证日期',
          minWidth: 180,
          slot: 'regIssue'
        }
      ],
      prodAuthTableProps: {
        defaultSort: { prop: 'Registration_Valid_Date', order: 'ascending' }
      },
      contractAuthColumns: [
        { prop: 'Supplier_Code', label: '供应商编码', width: 120 },
        { prop: 'Supplier_Name', label: '供应商名称', minWidth: 160 },
        { prop: 'Contract_Code', label: '合同编码', minWidth: 160 },
        { prop: 'Contract_Name', label: '合同名称', minWidth: 160 },
        { columnKey: 'contractStart', prop: 'Contract_Start_Time', label: '合同起始时间', minWidth: 140, slot: 'contractStart' },
        {
          columnKey: 'contractEndAuth',
          prop: 'Contract_End_Time',
          label: '合同终止时间',
          minWidth: 140,
          sortable: 'custom',
          slot: 'contractEndAuth'
        },
        {
          columnKey: 'poaValid',
          prop: 'Power_Of_Attorney_Valid_Date',
          label: '委托书有效期',
          minWidth: 140,
          sortable: 'custom',
          slot: 'poaValid'
        }
      ],
      contractVarColumns: [
        { prop: 'Contract_Code', label: '合同编码', minWidth: 140 },
        { prop: 'Contract_Name', label: '合同名称', minWidth: 140 },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 140 },
        { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 140 },
        { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 140 },
        {
          columnKey: 'authValid',
          prop: 'Auth_Valid',
          label: '授权时间',
          minWidth: 140,
          sortable: 'custom',
          slot: 'authValid'
        },
        {
          columnKey: 'detEnd',
          prop: 'DET_CONTRACT_END',
          label: '合同明细终止时间',
          minWidth: 160,
          sortable: 'custom',
          slot: 'detEnd'
        }
      ],
      supplierAuthColumns: [
        { prop: 'Supplier_Code', label: 'spd供应商编码', width: 140 },
        { prop: 'Supplier_Name', label: '供应商名称', minWidth: 160 },
        { columnKey: 'blDate', prop: 'Business_License_Valid_Date', label: '营业执照有效期', minWidth: 170, slot: 'blDate' },
        {
          columnKey: 'c1Date',
          prop: 'RODUCTION_CLASS_1_VALID_DATE',
          label: '一类的许可证经营有效期',
          minWidth: 180,
          slot: 'c1Date'
        },
        {
          columnKey: 'c2Date',
          prop: 'Roduction_Class_2_Valid_Date',
          label: '二类的许可证经营有效期',
          minWidth: 180,
          slot: 'c2Date'
        },
        {
          columnKey: 'c3Date',
          prop: 'Roduction_Class_3_Valid_Date',
          label: '三类的许可证经营有效期',
          minWidth: 180,
          slot: 'c3Date'
        }
      ],
      tjVarColumns: [
        { columnKey: 'selection', type: 'selection', width: 48, align: 'center', fixed: 'left' },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 110 },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140 },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 120 },
        { prop: 'UNIT', label: '单位', width: 70 },
        { prop: 'PRICE', label: '单价', width: 90 },
        { prop: 'APPROVAL_NUMBER', label: '注册证号', minWidth: 120 },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 140 },
        { prop: 'SUPPLIER_NAME', label: '供应商', minWidth: 140 }
      ],
      contractAuthenum: '1',
      supplierEnum: '0',
      gysmxRangeStart: start,
      gysmxRangeEnd: end,
      selTjVar: [],
      exporting: {
        blsj: false,
        bhjh: false,
        kcxq: false,
        kcht: false,
        zcz: false,
        gysht: false,
        gysmx: false,
        gyszz: false,
        pztj: false
      },
      sendingVar: false,
      blsjPrams: buildBlsjPrams()
    };
  },
  computed: {
    ...mapState('user', ['info']),
    hideStorageTwo() {
      const pg = this.info?.permission_group || [];
      return !pg.some((p) => p.Permission_Url === '仓库-二级仓库');
    },
    hidePdaCoun() {
      const pg = this.info?.permission_group || [];
      return !pg.some((p) => p.Permission_Url === '科室结算方式-消耗结算');
    },
    invColsExpiry() {
      return createInventoryColumns({
        hideStorageTwo: this.hideStorageTwo,
        hidePdaCoun: this.hidePdaCoun,
        showAction: false
      });
    },
    invColsContract() {
      const base = createInventoryColumns({
        hideStorageTwo: this.hideStorageTwo,
        hidePdaCoun: this.hidePdaCoun,
        showAction: true
      });
      const i = base.findIndex((c) => c.prop === 'CONTRACT_END_TIME');
      if (i === -1) return base;
      const detCol = {
        prop: 'DET_CONTRACT_END',
        label: '合同到期',
        width: 90,
        sortable: 'custom',
        slot: 'detContractEnd'
      };
      return [...base.slice(0, i + 1), detCol, ...base.slice(i + 1)];
    },
    gysmxDayLabel() {
      if (!this.gysmxRangeStart || !this.gysmxRangeEnd) return '近一个月';
      const n = daysBetween(this.gysmxRangeStart, this.gysmxRangeEnd);
      return `近${n}天`;
    },
    showSendVarBtn() {
      return SEND_VAR_HPS.includes(HOME_HP);
    }
  },
  watch: {
    hideStorageTwo() {
      this.reloadRef('kcxq');
      this.reloadRef('kcht');
    },
    hidePdaCoun() {
      this.reloadRef('kcxq');
      this.reloadRef('kcht');
    }
  },
  methods: {
    formatDate10,
    formatDateWithExpiry,
    formatContractExpiryDays,
    reloadRef(name) {
      const r = this.$refs[name];
      if (r && r.reload) r.reload({ page: 1 });
    },
    onSectionSort(name) {
      this.reloadRef(name);
    },
    getSectionSort(name) {
      const r = this.$refs[name];
      return r && r.getSort ? r.getSort() : { field: '', order: '' };
    },
    supplierDateExpired(v) {
      const s = String(v || '');
      if (s.startsWith('0001-01-01')) return { text: '', expired: false };
      return formatDateWithExpiry(v);
    },
    openContractMaintenance(row) {
      this.$refs.contractDlg?.open(row.Varietie_Code_New || row.Varietie_Code);
    },
    async onDeactivateContractsAll() {
      try {
        await MessageBox.confirm(
          '将停用当前筛选条件下已到期的合同，是否继续？',
          '一键停用到期合同',
          { type: 'warning' }
        );
      } catch {
        return;
      }
      try {
        const res = await searchContractAuthExpired({
          page: 1,
          size: 999999,
          contractAuthenum: '0',
          monty: '0',
          field: '',
          order: ''
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const list = (res.result || []).filter((item) => {
          const t = formatDate10(item.Contract_End_Time);
          if (!t) return false;
          return new Date(t).getTime() <= today.getTime();
        });
        const data = await deactivateContractsAll(JSON.stringify(list));
        Message.success(data.msg || '操作完成');
        this.reloadRef('gysht');
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    async onSendVarieties() {
      if (!this.selTjVar.length) {
        Message.warning('请至少选中一行数据');
        return;
      }
      const json = JSON.stringify(this.selTjVar.map((r) => ({ ID: r.ID })));
      const men = this.info?.User_Name || this.info?.Nick_Name || '';
      this.sendingVar = true;
      try {
        let data;
        switch (HOME_HP) {
          case 'stzyyy':
          case 'chrmyy':
            data = await sendVarStzy(
              JSON.stringify(this.selTjVar.map((r) => ({ VARIETIE_CODE: r.ID })))
            );
            break;
          case 'csyy':
            data = await sendVarCsyy(json);
            break;
          case 'stse':
            data = await sendVarStse(json, men);
            break;
          case 'stzl':
            data = await sendVarStzl(json);
            break;
          default:
            Message.warning('当前院区未配置发送接口');
            return;
        }
        Message.success(data.msg || '已提交');
        this.reloadRef('pztj');
      } catch (e) {
        Message.error(e.message || '发送失败');
      } finally {
        this.sendingVar = false;
      }
    },
    async dsBlsj({ page, limit }) {
      try {
        const res = await getVarietyReports({
          page,
          size: limit,
          pramsObj: this.blsjPrams
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsBhjh({ page, limit }) {
      try {
        const res = await stockVarContValTip({ page, size: limit, days: 15 });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsKcxq({ page, limit }) {
      try {
        const { field, order } = this.getSectionSort('kcxq');
        const w = buildInventoryWhere({
          validDateTo: inventoryValidDateTo180Days(),
          field,
          order,
          STORAGE_ID: ''
        });
        const res = await searchCentralWarehouse({ ...w, page, size: limit });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsKcht({ page, limit }) {
      try {
        const { field, order } = this.getSectionSort('kcht');
        const w = buildInventoryWhere({
          conTime: '2',
          STORAGE_ID: '1',
          field,
          order
        });
        const res = await searchCentralWarehouse({ ...w, page, size: limit });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsProdAuth({ page, limit }) {
      try {
        const { field, order } = this.getSectionSort('zcz');
        const res = await searchProdAuthExpired({
          page,
          size: limit,
          SearchType: '0',
          monty: '1',
          field: field || 'Registration_Valid_Date',
          order: order || 'asc'
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsContractAuth({ page, limit }) {
      try {
        const { field, order } = this.getSectionSort('gysht');
        const res = await searchContractAuthExpired({
          page,
          size: limit,
          contractAuthenum: this.contractAuthenum,
          monty: '0',
          field,
          order
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsContractVar({ page, limit }) {
      try {
        const { field, order } = this.getSectionSort('gysmx');
        const res = await searchContractVarietieAuthExpired({
          page,
          size: limit,
          monty: '1',
          field,
          order,
          authDateStart: this.gysmxRangeStart || '',
          authDateEnd: this.gysmxRangeEnd || ''
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsSupplierAuth({ page, limit }) {
      try {
        const { field, order } = this.getSectionSort('gyszz');
        const res = await searchSupplierAuthExpired({
          page,
          size: limit,
          supplierEnum: this.supplierEnum,
          monty: '0',
          field,
          order
        });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    async dsTjVar({ page, limit }) {
      try {
        const res = await getTjVarInfo({ page, size: limit });
        return { count: res.total || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询失败');
        return { count: 0, list: [] };
      }
    },
    sheetFromRows(headers, rows) {
      return {
        SheetNames: ['Sheet1'],
        Sheets: { Sheet1: utils.aoa_to_sheet([headers, ...rows]) }
      };
    },
    async exportBlsj() {
      this.exporting.blsj = true;
      try {
        const res = await getVarietyReports({
          page: 1,
          size: 100,
          pramsObj: this.blsjPrams
        });
        const headers = [
          '序号',
          '原因分析及处置意见',
          '报告编码',
          '报告日期',
          '产品名称',
          '注册证号',
          '产品批号',
          '规格',
          '产品编号',
          '生产日期',
          '有效期至',
          '生产企业名称',
          '事件发生日期',
          '获知日期',
          '伤害表现',
          '姓名',
          '年龄',
          '年龄类型',
          '性别',
          '器械故障表现',
          '作用',
          '机械使用日期',
          '使用场所',
          '场所名称',
          '使用过程',
          '原因分析',
          '初步处置',
          '报告人',
          '上报科室',
          '联系电话',
          '审核状态'
        ];
        const rows = (res.result || []).map((r, idx) => [
          idx + 1,
          r.REMARK,
          r.REPORT_ID,
          r.REPORT_DATE,
          r.PRODUCT_NAME,
          r.REGISTRATION_NUMBER,
          r.PRODUCT_BATCH_NUMBER,
          r.SPECIFICATION,
          r.PRODUCT_ID,
          r.PRODUCTION_DATE,
          r.EFFECTIVE_DATE,
          r.MANUFACTURER_NAME,
          r.OCCURRENCE_DATE,
          r.KNOW_DATE,
          r.DAMAGE_PERFORMANCE,
          r.NAME,
          r.AGE,
          r.AGE_TYPE,
          r.GENDER,
          r.MECHANICAL_MANIFESTATION,
          r.ROLE,
          r.MACHINE_SERVICE_DATE,
          r.USE_PLACE,
          r.PLACE_NAME,
          r.USE_PROCESS,
          r.CAUSE_ANALYSIS,
          r.PRELIMINARY_TREATMENT,
          r.REPORTER,
          r.REPORT_DEPARTMENT,
          r.CONTACT_PHONE,
          r.REVIEW_STATUS
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出1.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.blsj = false;
      }
    },
    async exportBhjh() {
      this.exporting.bhjh = true;
      try {
        const res = await stockVarContValTip({ page: 1, size: 999999, days: 15 });
        const headers = [
          '备货人',
          '备货计划单号',
          '供应商名称',
          '备货日期',
          '合同到期',
          '合同明细到期',
          '合同名称',
          '品种编码',
          '品种名称',
          '型号/规格',
          '单位',
          '价格',
          '生产企业名称',
          '系数',
          '备货计划(包)',
          '折算散货',
          '收货数量',
          '上月用量',
          '三月平均量'
        ];
        const rows = (res.result || []).map((r) => [
          r.CREATOR,
          r.Stock_Up_Plan_No,
          r.supplier_name,
          r.PLAN_TIME,
          r.CONTRACT_END_TIME,
          r.DET_CONTRACT_END,
          r.CONTRACT_NAME,
          r.Varietie_Code_New,
          r.Varietie_Name,
          r.Specification_Or_Type,
          r.Unit,
          r.supply_price,
          r.Manufacturing_Ent_Name,
          r.Coefficient,
          r.Stock_Up_Plan_Def_Quantity,
          r.Stock_Up_Plan_Goods_Quantity,
          r.ReceiptQty,
          r.USED_QTY,
          r.AVG_USED_QTY
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出3.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.bhjh = false;
      }
    },
    mapInvRowExport(r) {
      return [
        r.Source_Name,
        r.STORAGE_TWO_NAME,
        upShelfStateName(r.Up_Shelf_State, r.Source_Name),
        receivePropertyName(r.Receive_Property),
        r.Varietie_Code_New,
        r.Varietie_Name,
        r.Specification_Or_Type,
        r.Unit,
        r.Goods_Qty,
        r.Manufacturing_Ent_Name,
        r.Supplier_Name,
        r.Batch,
        formatDate10(r.Batch_Production_Date),
        formatDate10(r.Batch_Validity_Period),
        formatDate10(r.CONTRACT_END_TIME),
        r.Coefficient,
        formatSupplyPrice(r),
        r.Def_Qty,
        r.Storaged_Days,
        r.Brand,
        r.Position,
        r.CONTRACT_NAME,
        r.NOTE_DESCRIPTION
      ];
    },
    mapInvRowExportKcht(r) {
      const tail = [
        r.Coefficient,
        formatSupplyPrice(r),
        r.Def_Qty,
        r.Storaged_Days,
        r.Brand,
        r.Position,
        r.CONTRACT_NAME,
        r.NOTE_DESCRIPTION
      ];
      return [
        r.Source_Name,
        r.STORAGE_TWO_NAME,
        upShelfStateName(r.Up_Shelf_State, r.Source_Name),
        receivePropertyName(r.Receive_Property),
        r.Varietie_Code_New,
        r.Varietie_Name,
        r.Specification_Or_Type,
        r.Unit,
        r.Goods_Qty,
        r.Manufacturing_Ent_Name,
        r.Supplier_Name,
        r.Batch,
        formatDate10(r.Batch_Production_Date),
        formatDate10(r.Batch_Validity_Period),
        formatDate10(r.CONTRACT_END_TIME),
        formatDate10(r.DET_CONTRACT_END),
        ...tail
      ];
    },
    async exportKcxq() {
      this.exporting.kcxq = true;
      try {
        const w = buildInventoryWhere({ validDateTo: inventoryValidDateTo180Days(), STORAGE_ID: '1' });
        const res = await searchCentralWarehouse({ ...w, page: 1, size: 999999 });
        const headers = [
          '库房位置',
          '仓库',
          '所属区域',
          '收货类型',
          '品种编码',
          '品种名称',
          '型号/规格',
          '单位',
          '库存散货',
          '生产企业名称',
          '供应商',
          '生产批号',
          '生产日期',
          '有效到期',
          '合同到期',
          '系数',
          '结算价',
          '库存定数包数',
          '在库天数',
          '品牌',
          '货位号',
          '合同名称',
          '备注'
        ];
        const rows = (res.result || []).map((r) => this.mapInvRowExport(r));
        writeFile(this.sheetFromRows(headers, rows), '库存效期（近6个月）.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.kcxq = false;
      }
    },
    async exportKcht() {
      this.exporting.kcht = true;
      try {
        const w = buildInventoryWhere({ conTime: '2', STORAGE_ID: '1' });
        const res = await searchCentralWarehouse({ ...w, page: 1, size: 999999 });
        const headers = [
          '库房位置',
          '仓库',
          '所属区域',
          '收货类型',
          '品种编码',
          '品种名称',
          '型号/规格',
          '单位',
          '库存散货',
          '生产企业名称',
          '供应商',
          '生产批号',
          '生产日期',
          '有效到期',
          '合同到期',
          '合同明细到期',
          '系数',
          '结算价',
          '库存定数包数',
          '在库天数',
          '品牌',
          '货位号',
          '合同名称',
          '备注'
        ];
        const rows = (res.result || []).map((r) => this.mapInvRowExportKcht(r));
        writeFile(this.sheetFromRows(headers, rows), '导出2.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.kcht = false;
      }
    },
    async exportZcz() {
      this.exporting.zcz = true;
      try {
        const res = await searchProdAuthExpired({
          page: 1,
          size: 999999,
          SearchType: '0',
          monty: '1',
          field: 'Registration_Valid_Date',
          order: 'asc'
        });
        const headers = [
          '注册证名称',
          '批准文号',
          '生产企业名称',
          '注册证有效日期',
          '注册证发证日期'
        ];
        const rows = (res.result || []).map((r) => [
          r.Prod_Registration_Name,
          r.Approval_Number,
          r.Manufacturing_Ent_Name,
          formatDate10(r.Registration_Valid_Date),
          formatDate10(r.Registration_Issuing_Date)
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出4.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.zcz = false;
      }
    },
    async exportGysht() {
      this.exporting.gysht = true;
      try {
        const res = await searchContractAuthExpired({
          page: 1,
          size: 999999,
          contractAuthenum: this.contractAuthenum,
          monty: '0',
          field: '',
          order: ''
        });
        const headers = [
          '供应商编码',
          '供应商名称',
          '合同编码',
          '合同名称',
          '合同起始时间',
          '合同终止时间',
          '委托书有效期'
        ];
        const rows = (res.result || []).map((r) => [
          r.Supplier_Code,
          r.Supplier_Name,
          r.Contract_Code,
          r.Contract_Name,
          formatDate10(r.Contract_Start_Time),
          formatDate10(r.Contract_End_Time),
          formatDate10(r.Power_Of_Attorney_Valid_Date)
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出5.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.gysht = false;
      }
    },
    async exportGysmx() {
      this.exporting.gysmx = true;
      try {
        const res = await searchContractVarietieAuthExpired({
          page: 1,
          size: 999999,
          monty: '1',
          field: '',
          order: '',
          authDateStart: this.gysmxRangeStart || '',
          authDateEnd: this.gysmxRangeEnd || ''
        });
        const headers = [
          '合同编码',
          '合同名称',
          '品种名称',
          '品种编码',
          '规格型号',
          '授权时间',
          '合同明细终止时间'
        ];
        const rows = (res.result || []).map((r) => [
          r.Contract_Code,
          r.Contract_Name,
          r.Varietie_Name,
          r.Varietie_Code_New,
          r.Specification_Or_Type,
          formatDate10(r.Auth_Valid),
          formatDate10(r.DET_CONTRACT_END)
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出5_2.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.gysmx = false;
      }
    },
    async exportGyszz() {
      this.exporting.gyszz = true;
      try {
        const res = await searchSupplierAuthExpired({
          page: 1,
          size: 9999,
          supplierEnum: this.supplierEnum,
          monty: '0',
          field: '',
          order: ''
        });
        const headers = [
          'spd供应商编码',
          '供应商名称',
          '营业执照有效期',
          '一类的许可证经营有效期',
          '二类的许可证经营有效期',
          '三类的许可证经营有效期'
        ];
        const rows = (res.result || []).map((r) => [
          r.Supplier_Code,
          r.Supplier_Name,
          formatDate10(r.Business_License_Valid_Date),
          formatDate10(r.RODUCTION_CLASS_1_VALID_DATE),
          formatDate10(r.Roduction_Class_2_Valid_Date),
          formatDate10(r.Roduction_Class_3_Valid_Date)
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出6.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.gyszz = false;
      }
    },
    async exportPztj() {
      this.exporting.pztj = true;
      try {
        const res = await getTjVarInfo({ page: 1, size: 9999 });
        const headers = ['品种编码', '品种名称', '规格型号', '单位', '单价', '注册证号', '生产企业', '供应商'];
        const rows = (res.result || []).map((r) => [
          r.VARIETIE_CODE_NEW,
          r.VARIETIE_NAME,
          r.SPECIFICATION_OR_TYPE,
          r.UNIT,
          r.PRICE,
          r.APPROVAL_NUMBER,
          r.MANUFACTURING_ENT_NAME,
          r.SUPPLIER_NAME
        ]);
        writeFile(this.sheetFromRows(headers, rows), '导出8.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting.pztj = false;
      }
    }
  }
};
</script>

<style scoped>
.effective-tip-win-show ::v-deep .text-expired,
.text-expired {
  color: red;
}
.effective-tip-win-show ::v-deep .el-table td.text-expired {
  color: red;
}
</style>
