<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
       <h3 style="color:#1890FF;">注册证到期</h3>
      <el-row :gutter="15">
      <el-col :span="6">
        <label>
          请选择近过期日期月数:
          <el-select
            v-model="monty1"
            size="mini"
            placeholder="请选择近过期日期月数"
            @change="reload1"
          >
            <el-option label="过期" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="2个月" value="2"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="4个月" value="4"></el-option>
            <el-option label="5个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="7个月" value="7"></el-option>
            <el-option label="8个月" value="8"></el-option>
            <el-option label="9个月" value="9"></el-option>
            <el-option label="10个月" value="10"></el-option>
            <el-option label="11个月" value="11"></el-option>
            <el-option label="12个月" value="12"></el-option>

          </el-select>
        </label>
      </el-col>
    </el-row>
      <ele-pro-table ref="table1" height="25vh" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource1" :selection.sync="selection" cache-key="">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>

    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <h3 style="color:#1890FF;">供应商到期</h3>
      <el-row :gutter="15">
        <el-col :span="3">
        <label>
          <el-select
            v-model="supplierEnum"
            size="mini"
            placeholder="请选择状态"
            @change="reload2"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="营业执照有效期" value="1"></el-option>
            <el-option label="一类的许可证经营有效期" value="5"></el-option>
            <el-option label="二类的许可证经营有效期" value="3"></el-option>
            <el-option label="三类的许可证经营有效期" value="4"></el-option>

          </el-select>
        </label>
      </el-col>
      <el-col :span="6">
        <label>
          请选择近过期日期月数:
          <el-select
            v-model="monty2"
            size="mini"
            placeholder="请选择近过期日期月数"
            @change="reload2"
          >
            <el-option label="过期" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="2个月" value="2"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="4个月" value="4"></el-option>
            <el-option label="5个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="7个月" value="7"></el-option>
            <el-option label="8个月" value="8"></el-option>
            <el-option label="9个月" value="9"></el-option>
            <el-option label="10个月" value="10"></el-option>
            <el-option label="11个月" value="11"></el-option>
            <el-option label="12个月" value="12"></el-option>

          </el-select>
        </label>
      </el-col>
    </el-row>
      <ele-pro-table ref="table2" height="25vh" :pageSize="pageSize2" :pageSizes="pageSizes2" :columns="columns2" :datasource="datasource2" :selection.sync="selection2" cache-key="">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>

    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <h3 style="color:#1890FF;">合同到期</h3>
      <el-row :gutter="15">
        <el-col :span="3">
        <label>
          <el-select
            v-model="contractAuthenum"
            size="mini"
            placeholder="请选择状态"
            @change="reload3"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="合同终止时间" value="1"></el-option>
            <el-option label="质量保证协议书有效期" value="2"></el-option>
            <el-option label="委托书有效期" value="3"></el-option>

          </el-select>
        </label>
      </el-col>
        <label>
          请选择近过期日期月数:
          <el-select
            v-model="monty3"
            size="mini"
            placeholder="请选择近过期日期月数"
            @change="reload3"
          >
            <el-option label="过期" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="2个月" value="2"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="4个月" value="4"></el-option>
            <el-option label="5个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="7个月" value="7"></el-option>
            <el-option label="8个月" value="8"></el-option>
            <el-option label="9个月" value="9"></el-option>
            <el-option label="10个月" value="10"></el-option>
            <el-option label="11个月" value="11"></el-option>
            <el-option label="12个月" value="12"></el-option>

          </el-select>
        </label>
    </el-row>
      <ele-pro-table ref="table3" height="25vh" :pageSize="pageSize3" :pageSizes="pageSizes3" :columns="columns3" :datasource="datasource3" :selection.sync="selection3" cache-key="">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>

    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <h3 style="color:#1890FF;">合同品种授权到期</h3>
      <el-row :gutter="15">
      <el-col :span="6">
        <label>
          请选择近过期日期月数:
          <el-select
            v-model="monty4"
            size="mini"
            placeholder="请选择近过期日期月数"
            @change="reload4"
          >
            <el-option label="过期" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="2个月" value="2"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="4个月" value="4"></el-option>
            <el-option label="5个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="7个月" value="7"></el-option>
            <el-option label="8个月" value="8"></el-option>
            <el-option label="9个月" value="9"></el-option>
            <el-option label="10个月" value="10"></el-option>
            <el-option label="11个月" value="11"></el-option>
            <el-option label="12个月" value="12"></el-option>

          </el-select>
        </label>
      </el-col>
    </el-row>
      <ele-pro-table ref="table4" height="25vh" :pageSize="pageSize4" :pageSizes="pageSizes4" :columns="columns4" :datasource="datasource4" :selection.sync="selection4" cache-key="">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>

    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <h3 style="color:#1890FF;">一级科室品种授权到期</h3>
      <el-row :gutter="15">
      <el-col :span="6">
        <label>
          请选择近过期日期月数:
          <el-select
            v-model="monty5"
            size="mini"
            placeholder="请选择近过期日期月数"
            @change="reload5"
          >
            <el-option label="过期" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="2个月" value="2"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="4个月" value="4"></el-option>
            <el-option label="5个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="7个月" value="7"></el-option>
            <el-option label="8个月" value="8"></el-option>
            <el-option label="9个月" value="9"></el-option>
            <el-option label="10个月" value="10"></el-option>
            <el-option label="11个月" value="11"></el-option>
            <el-option label="12个月" value="12"></el-option>

          </el-select>
        </label>
      </el-col>
    </el-row>
      <ele-pro-table ref="table5" height="25vh" :pageSize="pageSize5" :pageSizes="pageSizes5" :columns="columns5" :datasource="datasource5" :selection.sync="selection5" cache-key="">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>

    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <h3 style="color:#1890FF;">二级科室品种授权到期</h3>
      <el-row :gutter="15">
      <el-col :span="6">
        <label>
          请选择近过期日期月数:
          <el-select
            v-model="monty6"
            size="mini"
            placeholder="请选择近过期日期月数"
            @change="reload6"
          >
            <el-option label="过期" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="2个月" value="2"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="4个月" value="4"></el-option>
            <el-option label="5个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="7个月" value="7"></el-option>
            <el-option label="8个月" value="8"></el-option>
            <el-option label="9个月" value="9"></el-option>
            <el-option label="10个月" value="10"></el-option>
            <el-option label="11个月" value="11"></el-option>
            <el-option label="12个月" value="12"></el-option>

          </el-select>
        </label>
      </el-col>
    </el-row>
      <ele-pro-table ref="table6" height="25vh" :pageSize="pageSize6" :pageSizes="pageSizes6" :columns="columns6" :datasource="datasource6" :selection.sync="selection6" cache-key="">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import {
  SearchProdAuthExpired,
  SearchSupplierAuthExpired,
  SearchContractAuthExpired,
  SearchContractVarietieAuthExpired,
  SearchDeptOneVarietieAuthExpired,
  SearchDeptTwoVarietieAuthExpired,
} from '@/api/Statistics/NewEffectiveTip';
export default {
  name: 'SystemUser',
  components: {
    UserSearch,
   
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 120,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          prop: 'Prod_Registration_Code',
          label: '注册证spd编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Prod_Registration_Name',
          label: '注册证名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'Approval_Number',
          label: '批准文号',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Registration_Issuing_Date',
          label: '注册证发证日期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'Registration_Valid_Date',
          label: '注册证有效日期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: [],
      SPECIFICATION_OR_TYPE: null,
      monty1:'0',

      supplierEnum:'0',
      monty2:'0',
      columns2: [
        {
          prop: 'Supplier_Code',
          label: 'spd供应商编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'Business_License_Valid_Date',
          label: '营业执照有效期',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'RODUCTION_CLASS_1_VALID_DATE',
          label: '一类的许可证经营有效期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'Roduction_Class_2_Valid_Date',
          label: '二类的许可证经营有效期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'Roduction_Class_3_Valid_Date',
          label: '三类的许可证经营有效期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
      ],
      pageSize2: 10,
      pageSizes2: [10, 20, 50, 100, 9999999],
      pagerCount2: 5,
      selection2: [],
      current2: null,

      contractAuthenum:'0',
      monty3:'0',
      columns3: [
        {
          prop: 'Supplier_Code',
          label: '供应商编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'Contract_Code',
          label: '合同编码',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Contract_Name',
          label: '合同名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Contract_Start_Time',
          label: '合同起始时间',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'Contract_End_Time',
          label: '合同终止时间',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
      ],
      pageSize3: 10,
      pageSizes3: [10, 20, 50, 100, 9999999],
      pagerCount3: 5,
      selection3: [],
      current3: null,

      monty4:'0',
      columns4: [
        {
          prop: 'Contract_Code',
          label: '合同编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Contract_Name',
          label: '合同名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Auth_Valid',
          label: '合同到期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'DET_CONTRACT_END',
          label: '合同明细到期',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
      ],
      pageSize4: 10,
      pageSizes4: [10, 20, 50, 100, 9999999],
      pagerCount4: 5,
      selection4: [],
      current4: null,

      
      monty5:'0',
      columns5: [
        {
          prop: 'Dept_One_Code',
          label: '一级科室编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Dept_One_Name',
          label: '一级科室名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'Auth_Valid_Date',
          label: '授权到期',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
              return this.$moment(cellValue).format('YYYY-MM-DD');
            }
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
      ],
      pageSize5: 10,
      pageSizes5: [10, 20, 50, 100, 9999999],
      pagerCount5: 5,
      selection5: [],
      current5: null,

      
      monty6:'0',
      columns6: [
        {
          prop: 'Dept_Two_Code',
          label: '二级科室编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Dept_Two_Name',
          label: '二级科室名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
        },
        {
          prop: 'Auth_Valid_Date',
          label: '授权到期',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
        {
          prop: 'Def_No_Pkg_Coefficient',
          label: '系数',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
        },
      ],
      pageSize6: 10,
      pageSizes6: [10, 20, 50, 100, 9999999],
      pagerCount6: 5,
      selection6: [],
      current6: null,
    };
  },
  methods: {
    /* 表格数据源 */
    datasource1({ page, limit, where, order }) {
      let data = SearchProdAuthExpired({ page, limit, where, order }).then(
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
    /* 刷新表格 */
    reload1(where) {
      var data = {
        monty1 : this.monty1
      }
      this.$refs.table1.reload({ page: 1, where: data });
    },


    datasource2({ page, limit, where, order }) {
      let data = SearchSupplierAuthExpired({ page, limit, where, order }).then(
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
    /* 刷新表格 */
    reload2(where) {
      console.log(where)
      var data = {
        supplierEnum : this.supplierEnum,
        monty : this.monty2,
      }
      this.$refs.table2.reload({ page: 1, where: data });
    },
    
    datasource3({ page, limit, where, order }) {
      let data = SearchContractAuthExpired({ page, limit, where, order }).then(
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
    reload3(where) {
      var data = {
        contractAuthenum : this.contractAuthenum,
        monty : this.monty3,
      }
      this.$refs.table3.reload({ page: 1, where: data });
    },

    
    datasource4({ page, limit, where, order }) {
      let data = SearchContractVarietieAuthExpired({ page, limit, where, order }).then(
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
    reload4(where) {
      var data = {
        monty : this.monty4,
      }
      this.$refs.table4.reload({ page: 1, where: data });
    },
    
    
    datasource5({ page, limit, where, order }) {
      let data = SearchDeptOneVarietieAuthExpired({ page, limit, where, order }).then(
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
    reload5(where) {
      var data = {
        monty : this.monty5,
      }
      this.$refs.table5.reload({ page: 1, where: data });
    },

    
    datasource6({ page, limit, where, order }) {
      let data = SearchDeptTwoVarietieAuthExpired({ page, limit, where, order }).then(
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
    reload6(where) {
      var data = {
        monty : this.monty6,
      }
      this.$refs.table6.reload({ page: 1, where: data });
    },
    // exportData(data) {
    //   const loading = this.$messageLoading('正在导出数据...');
    //   this.$refs.table.doRequest(({ where, order }) => {
    //     where = data;
    //     where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
    //     GetPDAList({
    //       page: 1,
    //       limit: 999999,
    //       where: where,
    //       order: order
    //     })
    //       .then((res) => {
    //         loading.close();
    //         const array = [
    //           [
    //             '品种编码',
    //             '品种id',
    //             '品种名称',
    //             '规格/型号',
    //             '生产企业名称',
    //             '注册证号',
    //             '单位',
    //             '中标价',
    //             '品种类别',
    //             '换算比(试剂)',
    //             '仪器备注',
    //           ]
    //         ];
    //         res.result.forEach((d) => {
    //           array.push([
    //             d.Varietie_Code_New,
    //             d.Varietie_Code,
    //             d.Varietie_Name,
    //             d.Specification_Or_Type,
    //             d.Manufacturing_Ent_Name,
    //             d.APPROVAL_NUMBER,
    //             d.UNIT,
    //             d.Price ,
    //             d.CLASS_NUM,
    //             d.CONVERSION_RATIO,
    //             d.DEVICE_REMARK,
    //             // this.$util.toDateString(d.createTime)
    //           ]);
    //         });
    //         writeFile(
    //           {
    //             SheetNames: ['Sheet1'],
    //             Sheets: {
    //               Sheet1: utils.aoa_to_sheet(array)
    //             }
    //           },
    //           '科室入库品种.xlsx'
    //         );
    //         this.$message.success("导出成功");
    //       })
    //       .catch((e) => {
    //         loading.close();
    //         this.$message.error(e.message);
    //       });
    //   });
    // }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info)
  }
};
</script>
