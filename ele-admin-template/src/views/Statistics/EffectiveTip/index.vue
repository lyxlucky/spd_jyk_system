<template>
  <div class="ele-body spd-page effective-tip-page">
    <el-card shadow="never">
      <expiry-table-panel
        title="注册证到期"
        cache-key="EffectiveTip1"
        :columns="cols1"
        :fetch-list="fetchProd"
        prod-search-type
        export-permission="export-EffectiveTip-zczdc"
        export-file-name="注册证.xlsx"
        :export-headers="export1Headers"
        :map-export-row="mapExport1"
      />

      <expiry-table-panel
        title="供应商到期"
        cache-key="EffectiveTip2"
        :columns="cols2"
        :fetch-list="fetchSupplier"
        :filter-options="supplierFilterOpts"
        default-extra="0"
        export-permission="export-EffectiveTip-gysdc"
        export-file-name="供应商.xlsx"
        :export-headers="export2Headers"
        :map-export-row="mapExport2"
      />

      <expiry-table-panel
        title="合同到期"
        cache-key="EffectiveTip3"
        :columns="cols3"
        :fetch-list="fetchContract"
        :filter-options="contractFilterOpts"
        default-extra="0"
        export-permission="export-EffectiveTip-htdc"
        export-file-name="供应商合同.xlsx"
        :export-headers="export3Headers"
        :map-export-row="mapExport3"
      />

      <expiry-table-panel
        title="合同品种授权到期"
        cache-key="EffectiveTip4"
        :columns="cols4"
        :fetch-list="fetchContractVarietie"
        export-permission="export-EffectiveTip-htpzdc"
        export-file-name="合同品种授权.xlsx"
        :export-headers="export4Headers"
        :map-export-row="mapExport4"
      />

      <expiry-table-panel
        title="一级科室品种授权到期"
        cache-key="EffectiveTip5"
        :columns="cols5"
        :fetch-list="fetchDeptOne"
        export-permission="export-EffectiveTip-yjksdc"
        export-file-name="一级科室品种授权.xlsx"
        :export-headers="export5Headers"
        :map-export-row="mapExport5"
      />

      <expiry-table-panel
        title="二级科室品种授权到期"
        cache-key="EffectiveTip6"
        :columns="cols6"
        :fetch-list="fetchDeptTwo"
        export-permission="export-EffectiveTip-ejksdc"
        export-file-name="二级科室品种授权.xlsx"
        :export-headers="export6Headers"
        :map-export-row="mapExport6"
      />
    </el-card>
  </div>
</template>

<script>
import ExpiryTablePanel from './components/ExpiryTablePanel.vue';
import { formatDate10 } from './utils';
import {
  searchProdAuthExpired,
  searchSupplierAuthExpired,
  searchContractAuthExpired,
  searchContractVarietieAuthExpired,
  searchDeptOneVarietieAuthExpired,
  searchDeptTwoVarietieAuthExpired
} from '@/api/Statistics/EffectiveTip';

const dateFmt = (row, col, val) => formatDate10(val);

export default {
  name: 'StatisticsEffectiveTip',
  components: { ExpiryTablePanel },
  data() {
    return {
      supplierFilterOpts: [
        { label: '全部', value: '0' },
        { label: '营业执照有效期', value: '1' },
        { label: '一类的许可证经营有效期', value: '5' },
        { label: '二类的许可证经营有效期', value: '3' },
        { label: '三类的许可证经营有效期', value: '4' }
      ],
      contractFilterOpts: [
        { label: '全部', value: '0' },
        { label: '合同终止时间', value: '1' },
        { label: '质量保证协议书有效期', value: '2' },
        { label: '委托书有效期', value: '3' }
      ],
      export1Headers: [
        '注册证spd编码',
        '注册证名称',
        '批准文号',
        '生产企业名称',
        '注册证发证日期',
        '注册证有效日期'
      ],
      export2Headers: [
        'spd供应商编码',
        '供应商名称',
        '营业执照有效期',
        '一类的许可证经营有效期',
        '二类的许可证经营有效期',
        '三类的许可证经营有效期'
      ],
      export3Headers: [
        '供应商编码',
        '供应商名称',
        '合同编码',
        '合同名称',
        '合同起始时间',
        '合同终止时间',
        '质量保证协议书有效期',
        '委托书有效期'
      ],
      export4Headers: [
        '合同编码',
        '合同名称',
        '品种名称',
        '品种编码',
        '规格型号',
        '合同到期',
        '合同明细到期'
      ],
      export5Headers: ['一级科室编码', '一级科室名称', '授权到期', '品种编码', '品种名称', '规格型号'],
      export6Headers: [
        '二级科室编码',
        '二级科室名称',
        '授权到期',
        '品种编码',
        '品种名称',
        '规格型号',
        '系数'
      ],
      cols1: [
        { prop: 'Prod_Registration_Code', label: '注册证spd编码', width: 180, showOverflowTooltip: true },
        { prop: 'Prod_Registration_Name', label: '注册证名称', width: 180, showOverflowTooltip: true },
        { prop: 'Approval_Number', label: '批准文号', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 180, showOverflowTooltip: true },
        {
          prop: 'Registration_Issuing_Date',
          label: '注册证发证日期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        },
        {
          prop: 'Registration_Valid_Date',
          label: '注册证有效日期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        }
      ],
      cols2: [
        { prop: 'Supplier_Code', label: 'spd供应商编码', width: 180, showOverflowTooltip: true },
        { prop: 'Supplier_Name', label: '供应商名称', width: 180, showOverflowTooltip: true },
        {
          prop: 'Business_License_Valid_Date',
          label: '营业执照有效期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        },
        {
          prop: 'RODUCTION_CLASS_1_VALID_DATE',
          label: '一类的许可证经营有效期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        },
        {
          prop: 'Roduction_Class_2_Valid_Date',
          label: '二类的许可证经营有效期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        },
        {
          prop: 'Roduction_Class_3_Valid_Date',
          label: '三类的许可证经营有效期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        }
      ],
      cols3: [
        { prop: 'Supplier_Code', label: '供应商编码', width: 180, showOverflowTooltip: true },
        { prop: 'Supplier_Name', label: '供应商名称', width: 180, showOverflowTooltip: true },
        { prop: 'Contract_Code', label: '合同编码', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Contract_Name', label: '合同名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Contract_Start_Time', label: '合同起始时间', minWidth: 180, formatter: dateFmt },
        {
          prop: 'Contract_End_Time',
          label: '合同终止时间',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        },
        {
          prop: 'Power_Of_Attorney_Valid_Date',
          label: '委托书有效期',
          minWidth: 180,
          sortable: 'custom',
          formatter: dateFmt
        }
      ],
      cols4: [
        { prop: 'Contract_Code', label: '合同编码', width: 180, showOverflowTooltip: true },
        { prop: 'Contract_Name', label: '合同名称', width: 180, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 180, showOverflowTooltip: true },
        {
          prop: 'Auth_Valid',
          label: '合同到期',
          width: 140,
          sortable: 'custom',
          slot: 'Auth_Valid'
        },
        {
          prop: 'DET_CONTRACT_END',
          label: '合同明细到期',
          width: 140,
          sortable: 'custom',
          slot: 'DET_CONTRACT_END'
        }
      ],
      cols5: [
        { prop: 'Dept_One_Code', label: '一级科室编码', width: 180, showOverflowTooltip: true },
        { prop: 'Dept_One_Name', label: '一级科室名称', width: 180, showOverflowTooltip: true },
        { prop: 'Auth_Valid_Date', label: '授权到期', minWidth: 180, sortable: 'custom' },
        { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 180, showOverflowTooltip: true }
      ],
      cols6: [
        { prop: 'Dept_Two_Code', label: '二级科室编码', width: 180, showOverflowTooltip: true },
        { prop: 'Dept_Two_Name', label: '二级科室名称', width: 180, showOverflowTooltip: true },
        { prop: 'Auth_Valid_Date', label: '授权到期', minWidth: 180, sortable: 'custom' },
        { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种名称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Def_No_Pkg_Coefficient', label: '系数', minWidth: 180, showOverflowTooltip: true }
      ]
    };
  },
  methods: {
    fetchProd(q) {
      return searchProdAuthExpired({
        page: q.page,
        size: q.size,
        monty: q.monty,
        field: q.field,
        order: q.order,
        searchType: q.searchType
      });
    },
    fetchSupplier(q) {
      return searchSupplierAuthExpired({
        page: q.page,
        size: q.size,
        monty: q.monty,
        field: q.field,
        order: q.order,
        supplierEnum: q.extra
      });
    },
    fetchContract(q) {
      return searchContractAuthExpired({
        page: q.page,
        size: q.size,
        monty: q.monty,
        field: q.field,
        order: q.order,
        contractAuthenum: q.extra
      });
    },
    fetchContractVarietie(q) {
      return searchContractVarietieAuthExpired(q);
    },
    fetchDeptOne(q) {
      return searchDeptOneVarietieAuthExpired(q);
    },
    fetchDeptTwo(q) {
      return searchDeptTwoVarietieAuthExpired(q);
    },
    mapExport1(r) {
      return [
        r.Prod_Registration_Code,
        r.Prod_Registration_Name,
        r.Approval_Number,
        r.Manufacturing_Ent_Name,
        formatDate10(r.Registration_Issuing_Date),
        formatDate10(r.Registration_Valid_Date)
      ];
    },
    mapExport2(r) {
      return [
        r.Supplier_Code,
        r.Supplier_Name,
        formatDate10(r.Business_License_Valid_Date),
        formatDate10(r.RODUCTION_CLASS_1_VALID_DATE),
        formatDate10(r.Roduction_Class_2_Valid_Date),
        formatDate10(r.Roduction_Class_3_Valid_Date)
      ];
    },
    mapExport3(r) {
      return [
        r.Supplier_Code,
        r.Supplier_Name,
        r.Contract_Code,
        r.Contract_Name,
        r.Contract_Start_Time,
        r.Contract_End_Time,
        r.Qlty_Assurance_Prot_Valid_Date,
        r.Power_Of_Attorney_Valid_Date
      ];
    },
    mapExport4(r) {
      return [
        r.Contract_Code,
        r.Contract_Name,
        r.Varietie_Name,
        r.Varietie_Code_New,
        r.Specification_Or_Type,
        formatDate10(r.Auth_Valid),
        formatDate10(r.DET_CONTRACT_END)
      ];
    },
    mapExport5(r) {
      return [
        r.Dept_One_Code,
        r.Dept_One_Name,
        formatDate10(r.Auth_Valid_Date),
        r.Varietie_Code_New,
        r.Varietie_Name,
        r.Specification_Or_Type
      ];
    },
    mapExport6(r) {
      return [
        r.Dept_Two_Code,
        r.Dept_Two_Name,
        formatDate10(r.Auth_Valid_Date),
        r.Varietie_Code_New,
        r.Varietie_Name,
        r.Specification_Or_Type,
        r.Def_No_Pkg_Coefficient
      ];
    }
  }
};
</script>

<style scoped>
.effective-tip-page ::v-deep .el-card__body {
  padding-top: 8px;
}
</style>
