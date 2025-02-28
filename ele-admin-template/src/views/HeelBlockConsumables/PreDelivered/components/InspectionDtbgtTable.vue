<template>
  <ele-modal :destroy-on-close="true" width="1400px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form" title="套包检测" @update:visible="updateVisible">
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
          <el-form class="ele-form-search">
            <el-row :gutter="10">
              <el-col :lg="5" :md="12">
                <el-form-item label="">
                  <el-input size="mini" v-model="SEARCH_VALUE" placeholder="" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="4" :md="12">
                <el-form-item label="">
                  <el-select v-model="TB_TYPE2" size="mini" placeholder="请选择状态">
                    <el-option label="套包类型-全部" value="0"></el-option>
                    <el-option label="普通套包" value="1"></el-option>
                    <el-option label="脊柱套包" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="14" :md="10">
                <div class="ele-form-actions">
                  <el-button type="primary" @click="reload" size="mini">查询</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>

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
import { searchTbMainZyYp } from '@/api/HeelBlockConsumables/PreDelivered';
export default {
  name: 'AuthVarTable',
  props: ['ApplyTempTableDataID', 'visible'],
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
          prop: 'TB_NAME',
          label: '套包名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'TB_JF_CODE',
          label: '套包计费编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'TB_YG_CODE',
          label: '套包编码',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'TB_REMARK',
          label: '备注',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'PJ_COUNT',
          label: '配件数',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PJ_HAVE_COUNT',
          label: '订单满足配件数',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'PJ_CY_COUNT',
          label: '配件差异数',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (row, column, cellValue) => {
            return cellValue.replace('T', '');
            // return this.$util.toDateString(cellValue);
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
      SEARCH_VALUE: '',
      TB_TYPE2: '0',
      orderNum: '',
      isUpdate: false
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      console.log(this.ApplyTempTableDataID)
      where.SEARCH_VALUE = this.SEARCH_VALUE ? this.SEARCH_VALUE : '';
      where.TB_TYPE2 = this.TB_TYPE2 ? this.TB_TYPE2 : '';
      where.orderNum = this.ApplyTempTableDataID.Delivery_Note_Number;
      let data = searchTbMainZyYp({ page, limit, where, order }).then((res) => {
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      });
      return data;
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    onSelectionChange(selection) {
      this.selection = selection;
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
