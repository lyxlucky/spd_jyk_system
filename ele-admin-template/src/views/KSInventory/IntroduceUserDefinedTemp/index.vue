<template >
  <ele-modal width="1400px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="引用自定义模板" @update:visible="updateVisible">
    <div class="ele-body">
      <el-card shadow="never">
        <!-- 搜索表单 -->
        <user-search @search="reload" />
        <!-- 数据表格 -->
        <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="DepaStorageQuery">
          <template v-slot:toolbar>
          </template>
          <!-- 操作列 -->
          <template v-slot:Contract_Type="{ row }">
            <el-tag :type="['', 'success','info'][row.Contract_Type]" :disable-transitions="true">
              {{['中标','临采','未设置'][row.Contract_Type]}}
            </el-tag>
          </template>

          <template v-slot:Storage_ID="{ row }">
            <el-tag :type="['', 'success'][row.Storage_ID]" :disable-transitions="true">
              {{['院内库区', '院外库区'][row.Storage_ID]}}
            </el-tag>
          </template>

          <template v-slot:HIGH_OR_LOW_CLASS_TWO="{ row }">
            <el-tag :type="['', 'success','info'][row.HIGH_OR_LOW_CLASS_TWO]" :disable-transitions="true">
              {{['重点治理', '非重点治理','未设置'][row.HIGH_OR_LOW_CLASS_TWO]}}
            </el-tag>
          </template>
          <template v-slot:IS_BIDDING="{ row }">
            <el-tag :type="['', 'success'][row.IS_BIDDING]" :disable-transitions="true">
              {{['是', '否'][row.IS_BIDDING]}}
            </el-tag>
            <!-- <el-tag v-if="row.IS_BIDDING==1">是</el-tag>
          <el-tag v-if="row.IS_BIDDING==0" type="info">否</el-tag> -->
          </template>
          <template v-slot:action="{ row }">
            <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button>
            <!-- <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-link>
            </template>
          </el-popconfirm> -->
          </template>
        </ele-pro-table>
      </el-card>
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

import {
  pageUsers,
  updateUserStatus,
  updateUserPassword
} from '@/api/system/user';
import { GetDeptInStockDetail } from '@/api/KSInventory/DepaStorageQuery';
export default {
  name: 'IntroduceUserDefinedTemp',
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 上级id
    parentId: Number,
    // 机构数据
    organizationList: Array
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
        // {
        //   columnKey: 'selection',
        //   type: 'selection',
        //   width: 45,
        //   align: 'center',
        //   fixed: 'left'
        // },
        {
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
        //   width: 220,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true
        // },
        {
          slot: 'Contract_Type',
          label: '合同类型',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        // {
        //   slot: 'Storage_ID',
        //   label: '业务发起库区',
        //   sortable: 'custom',
        //   align: 'center',
        //   howOverflowTooltip: true,
        //   minWidth: 110
        // },
        {
          prop: 'SUPPLIER_NAME',
          label: '科室/供应商名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'From_Supplier_Name',
          label: '供应商名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'RECEIVING_TIME',
          label: '入库时间',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种(材料)编码',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 120
          // formatter: (_row, _column, cellValue) => {
          //   console.log(_row);
          //   console.log(_column);
          //   console.log(cellValue);
          //   return this.$util.toDateString(cellValue);
          // }
        },
        // {
        //   prop: 'SPH_ERP_VARIETIE_CODE',
        //   label: '上药HERP编码',
        //   align: 'center',
        //   sortable: 'custom',
        //   width: 120,
        //   showOverflowTooltip: true
        //   // formatter: (_row, _column, cellValue) => {
        //   //   if (cellValue == 1) {
        //   //     return '已绑定';
        //   //     // return ``
        //   //   } else if (cellValue == 0) {
        //   //     return '未绑定';
        //   //   }
        //   // }
        // },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '型号/规格',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'UNIT',
          label: '单位',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业名称',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'MEDICAL_CODE',
          label: '医保码',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Brand',
          label: '品牌',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产时间',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效到期',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'DISINFECTION_BATCH',
          label: '灭菌批号',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'COEFFICIENT',
          label: '系数',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'RECEIVING_QUANTITY',
          label: '入库数量',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'SUPPLY_PRICE',
          label: '消耗价',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'PURCHASE_PRICE',
          label: '采购价',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'GOODS_QTY',
          label: '散货数量',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'BUSINESS_BILL',
          label: '入库单号',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'MARK',
          label: '入库备注',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'HIGH_OR_LOW_CLASS_TWO',
          label: '高低值分类下级属性',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          slot: 'IS_BIDDING',
          label: '是否中标',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'Operator',
          label: '操作人',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
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
      isUpdate: false
      // datasource: [],
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      var Dept_Two_CodeStr = '';
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr =
          Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      }
      where.DeptCode = Dept_Two_CodeStr;
      let data = GetDeptInStockDetail({ page, limit, where, order }).then(
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
