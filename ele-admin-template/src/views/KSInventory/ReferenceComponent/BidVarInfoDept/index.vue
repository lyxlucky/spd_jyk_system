<template >
  <ele-modal width="1600px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="中标目录" @update:visible="updateVisible">
    <div class="ele-body">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <!-- 数据表格 -->
        <ele-pro-table ref="table" height="600px" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :rowClickChecked="true" :rowClickCheckedIntelligent="false" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="DepaStorageQuery">
          <template v-slot:toolbar>
            <user-search @search="reload" @exportData="exportData" />
          </template>
          <!-- 操作列 -->
          <template v-slot:APPLY_QTY="{ row }">
            <el-form-item label="">
              <el-input v-model="row.APPLY_QTY"></el-input>
            </el-form-item>
          </template>
        </ele-pro-table>
      </el-card>
      <!-- <div class="ele-footer" style="display: flex;justify-content: center;">
        <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="addKSKSDepartmentalPlanData()">
          确定添加
        </el-button>
      </div> -->

      <!-- 编辑弹窗 -->
      <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
      <!-- 导入弹窗 -->
      <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
    </div>
  </ele-modal>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';

import { searchBID_VAR_INFO } from '@/api/KSInventory/BidVarInfoDept';
import {
  SerachPlanList,
  KeeptListDeta
} from '@/api/KSInventory/IntroduceUserDefinedTemp';
export default {
  name: 'IntroduceUserDefinedTemp',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    IntroduceUserDefinedTempSearch: Object
  },
  components: {
    UserSearch,
    UserEdit
    // UserImport
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
        // {
        //   columnKey: 'index',
        //   type: 'index',
        //   width: 45,
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 220,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true
        // },
        {
          prop: 'IS_NEED_ADD',
          label: '在用状态',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: (_row, _column, cellValue) => {
            if (cellValue != null) {
              return '启用';
            }
            if (cellValue == '1') {
              return (
                '已申请' + '/' + _row.SQ_DEPT_NAME + '/' + _row.SQ_DEPT_MAN
              );
            } else if (cellValue == '0') {
              return '未使用';
            } else {
              return '未使用';
            }
          }
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '材料编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        // {
        //   prop: 'DEPT_ZDY_VARIETIE_CODE',
        //   label: '自定义编码',
        //   // sortable: 'custom',
        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 80,
        //   formatter: (_row, _column, cellValue) => {
        //     if (cellValue == null) {
        //       cellValue = '未定义';
        //     }
        //     return cellValue;
        //   }
        // },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '型号/规格',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产厂家',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'PRICE',
          label: '单价',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'BRAND',
          label: '品牌',
          width: 80,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'PKG_GG',
          label: '包装规格',
          width: 180,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'USE_DEPT',
          label: '使用科室',
          width: 180,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SUP_NAME',
          label: '供应商',
          width: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SUP_PEOPLE',
          label: '联系人',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SEND_TYPE',
          label: '送货方式（快递\\配送）',
          width: 150,
          align: 'center',
          // fixed: 'right',
          showOverflowTooltip: true
        },
        {
          prop: 'SUPPORTING_EQU',
          label: '配套设备',
          align: 'center',
          width: 150,
          showOverflowTooltip: true,
          show: false
        },
        {
          prop: 'SUPPORTING_EQU_BRAND',
          label: '配套设备品牌',
          align: 'center',
          width: 100,
          showOverflowTooltip: true,
          show: false
        },
        {
          prop: 'SUPPORTING_EQU_XH',
          label: '配套设备型号',
          align: 'center',
          width: 120,
          showOverflowTooltip: true,
          show: false
        },
        {
          prop: 'HIGH_OR_LOW_CLASS',
          label: '是否高值',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (_row, _column, cellValue) => {
            if (cellValue == '1') {
              return '是';
            } else if (cellValue == '0') {
              return '否';
            } else {
              return '未知';
            }
          }
        },
        {
          prop: 'IS_IN_COUNTRY_IMPORT',
          label: '国家高值医用耗材重点治理',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (_row, _column, cellValue) => {
            if (cellValue == '1') {
              return '是';
            } else if (cellValue == '0') {
              return '否';
            } else {
              return '未知';
            }
          }
        },
        {
          prop: 'HIGH_CLASS_XH',
          label: '重点治理序号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        }
      ],
      toolbar: false,
      pageSize: 15,
      pageSizes: [15, 50, 100, 200, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      isUpdate: false,

      // 添加品种数量
      APPLY_QTY: 0
      // datasource: [],
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      // where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      // where.DeptCode = this.IntroduceUserDefinedTempSearch.PlanDept;
      let data = searchBID_VAR_INFO({ page, limit, where, order }).then(
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
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    addKSKSDepartmentalPlanData() {
      const loading = this.$messageLoading('添加中..');
      this.selection.forEach((element) => {
        element.PLAN_NUMBER = this.IntroduceUserDefinedTempSearch.PlanNum;
      });
      KeeptListDeta(this.selection).then((res) => {
        loading.close();
        this.updateVisible(false);
        this.$message.success(res.msg);
      });
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        searchBID_VAR_INFO({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '备注',
                '导入时间',
                'SPD编码',
                'SPD中标价',
                'SPD库存',
                'SPD库存价',
                'SPD单位',
                '状态',
                '启用状态',
                '合同编码',
                '合同生效日期',
                '合同失效日期',
                '品种编码',
                '注册证名称',
                '注册证号',
                '型号',
                '规格',
                '生产厂家',
                '单位',
                '单价',
                '国家医保编码',
                '市平台编码',
                '市平台规格型号码',
                '品种名称',
                '品牌',
                '包装规格',
                '使用科室',
                '供应商',
                '联系人',
                '联系方式',
                '送货方式(快递配送)',
                '配套设备',
                '配套设备品牌',
                '配套设备型号',
                '是否高值',
                '国家高值医用耗材重点治理',
                '重点治理序号'
              ]
            ];
            res.result.forEach((d) => {
              if (d.IS_USE == null) {
                d.IS_USE = '0';
              }
              if (d.IS_ENABLE == null) {
                d.IS_ENABLE = '0';
              }
              if (d.HIGH_OR_LOW_CLASS == null) {
                d.HIGH_OR_LOW_CLASS = '0';
              }
              if (d.IS_IN_COUNTRY_IMPORT == null) {
                d.IS_IN_COUNTRY_IMPORT = '0';
              }
              array.push([
                d.REMARK,
                d.CREATE_BATCH,
                d.SPD_VARIETIE_CODE_NEW,
                d.SPD_PRICE,
                d.QTY,
                d.SUPPLY_PRICE,
                d.SPD_UNIT,
                d.IS_USE.replace('1', '使用').replace('0', '弃用'),
                d.IS_ENABLE.replace('1', '是').replace('0', '否'),
                d.CONTRACT_CODE,
                d.CONTRACT_START.substring(0, 10),
                d.CONTRACT_END.substring(0, 10),
                d.VARIETIE_CODE_NEW,
                d.PROD_REGISTRATION_NAME,
                d.APPROVAL_NUMBER,
                d.XH,
                d.GG,
                d.MANUFACTURING_ENT_NAME,
                d.UNIT,
                d.PRICE,
                d.MEDICAL_CODE,
                d.CITY_VAR_CODE,
                d.CITY_SPE_CODE,
                d.VARIETIE_NAME,
                d.BRAND,
                d.PKG_GG,
                d.USE_DEPT,
                d.SUP_NAME,
                d.SUP_PEOPLE,
                d.SUP_PHONE,
                d.SEND_TYPE,
                d.SUPPORTING_EQU,
                d.SUPPORTING_EQU_BRAND,
                d.SUPPORTING_EQU_XH,
                d.HIGH_OR_LOW_CLASS.replace('1', '是').replace('0', '否'),
                d.IS_IN_COUNTRY_IMPORT.replace('1', '是').replace('0', '否')
                // this.$util.toDateString(d.createTime)
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '中标目录.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        if (this.data) {
          this.$util.assignObject(this.form, this.data);
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        // this.$refs.form.clearValidate();
        this.form = { ...this.defaultForm };
      }
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
