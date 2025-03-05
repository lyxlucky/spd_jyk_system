<template>
  <ele-modal :destroy-on-close="true" width="1400px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="引用自定义模板" @update:visible="updateVisible">
    <div class="ele-body" style="height:75vh">
      <!-- 数据表格 -->
      <ele-pro-table ref="table" height="50vh" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="ApplyTempDataTable">
        <!-- 表头工具栏 -->
        <!-- 右表头 -->
        <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
        <!-- 左表头 -->
        <template v-slot:toolbar>
          <h2>总数量：{{TotalNum}},总金额{{TotalMoney}}</h2> 
        </template>

        <!-- 操作列 -->
        <template v-slot:action="{ row }">
          <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-link>
            </template>
          </el-popconfirm>
        </template>
      </ele-pro-table>
    </div>
  </ele-modal>
</template>

<script>
// import ApplyTempDataSearch from './ApplyTempDataSearch.vue';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import {
  SerachTempletDeta,
  DeleteTempletDeta,
  SerachAuthVar,
  CreateTempletDeta
} from '@/api/KSInventory/ApplyTemp';
import { getFinanceAuditByItem } from '@/api/Settle/InvoiceManagement';
export default {
  name: 'AuthVarTable',
  props: ['MONTHBILLNUM', 'visible'],
  components: {
    // ApplyTempDataSearch: ApplyTempDataSearch
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
        //   width: 80,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'right'
        // },
        {
          prop: 'VARIETIE_CODE',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'QTY',
          label: '数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'PRICE',
          label: '单价',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'TotalMoney',
          label: '总金额',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          formatter: (_row, _column, cellValue) => {
            return _row.QTY * _row.PRICE;
          }
        }
      ],
      toolbar: false,
      pageSize: 10,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
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
      SerachName: '',
      isUpdate: false,
      TotalNum: 0,
      TotalMoney: 0
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.id = this.MONTHBILLNUM;
      let data = getFinanceAuditByItem({ page, limit, where, order }).then(
        (res) => {
          this.TotalNum = 0;
          this.TotalMoney = 0;
          res.result.forEach((item) => {
            this.TotalNum += item.QTY;
            this.TotalMoney += item.QTY * item.PRICE;
          });
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        }
      );
      return data;
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 刷新表格 */
    reload(where) {
      // console.log(this.ApplyTempTableData);
      // console.log(this.$store.state.user.info);
      this.$refs.table.reload({ page: 1, where: where });
    },
    remove(row) {
      var data = {
        ID: row.ID
      };

      const loading = this.$messageLoading('删除中...');
      DeleteTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message(res.msg);
          this.reload();
        })
        .catch((err) => {
          loading.close();
          this.$message(err);
        });
    },
    onSelectionChange(selection) {
      this.selection = selection;
      // console.log(this.selection);
    },
    addTempVar() {
      const loading = this.$messageLoading('添加中...');
      this.selection.forEach((element) => {
        element.APPLY_TEMPLET_MAIN_ID = this.ApplyTempTableDataID.ID;
      });
      CreateTempletDeta(this.selection)
        .then((res) => {
          this.$message.success(res.msg);
          this.updateVisible(false);
          loading.close();
        })
        .catch((err) => {
          this.$message.error(err);
          loading.close();
        });
    }
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ApplyTempTableData;
    }
  },
  watch: {
    ApplyTempTableDataSearch() {
      var where = {
        PlanNum: this.ApplyTempTableData.PlanNum
      };
      this.$refs.table.reload({ page: 1, where: where });
    },
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
