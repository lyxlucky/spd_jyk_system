<template>
  <div class="ele-body">
    <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
    <!-- 数据表格 -->
    <!-- :rowClickChecked="true"  -->
    <!-- :rowClickCheckedIntelligent="false"  -->
    <ele-pro-table ref="table" :toolStyle="toolStyle" height="40vh" highlight-current-row :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" :rowClickChecked="true" :rowClickCheckedIntelligent="false" @selection-change="onSelectionChange" cache-key="KSInventoryBasicDataTable">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <template v-slot:PAG_TYPE="{ row }">
        <div :id="'PAG_TYPE' + row.ID" :key="row.id" @click="dialogVisibleFun(row)">{{ row.PAG_TYPE }}
        </div>
      </template>
      <!-- 左表头 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->

        <naxtDayApplyPlanDelSearch @UpNaxtDayApplyPlanDel="UpNaxtDayApplyPlanDelFun" @search="reload" @ClickReload="ClickReload" :KSDepartmentalPlanDataSearch="KSDepartmentalPlanDataSearch" :selection="selection" @showEditReoad="showEditReoad" :datasourceList="datasourceList" />
      </template>

      <template v-slot:PlanQty="{ row }">
        <el-input v-model="row.PlanQty" :min="0" :max="99999999" :step="1" size="mini" />
        <!-- <el-input-number v-model="row.PlanQty" controls-position="right" @change="handleChange" :min="0" :max="9999" size="mini"></el-input-number> -->
      </template>
      <template v-slot:APPLY_QTY="{ row }">
        <el-input v-if="row.STATE == 0" type="number" @click.native.stop v-model="row.APPLY_QTY" :min="0" :max="99999999" :step="1" size="mini" />
        <el-input v-else disabled type="number" v-model="row.APPLY_QTY" :min="0" :max="99999999" :step="1" size="mini" />
      </template>
      <template v-slot:REMARK="{ row }">
        <el-input v-if="row.STATE == 0" @click.native.stop type="text" v-model="row.REMARK" size="mini" />
        <el-input v-else disabled type="text" v-model="row.REMARK" size="mini" />
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

    <el-dialog title="包装规格" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-row :gutter="20">
        <el-col :span="24">
          <div style="display: flex">
            <div style="display: flex">
              <label style="width: 120px">中包装数量:</label>
              <el-input type="number" v-model="count1"></el-input>
            </div>
            <div style="display: flex">
              <label style="width: 120px">申请数量:</label>
              <el-input type="number" v-model="count2"></el-input>
            </div>
          </div>
          <div style="display: flex; margin-top: 5px">
            <div style="display: flex">
              <label style="width: 120px">中包装数量:</label>
              <el-input type="number" v-model="count3"></el-input>
            </div>
            <div style="display: flex">
              <label style="width: 120px">申请数量:</label>
              <el-input type="number" v-model="count4"></el-input>
            </div>
          </div>
          <div style="display: flex; margin-top: 5px">
            <div style="display: flex">
              <label style="width: 150px">合计散货绩数量 :</label>
              <el-input type="number" v-model="sum"></el-input>
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import naxtDayApplyPlanDelSearch from './naxtDayApplyPlanDel-search.vue';
import {
  GetNaxtDayApplyPlanDel,
  UpNaxtDayApplyPlanDel
} from '@/api/KSInventory/OperaSchedulingManagement';
import { utils, writeFile } from 'xlsx';
export default {
  name: 'KSDepartmentalPlanTable',
  props: ['KSDepartmentalPlanData'],
  // inject: ['reload'],
  components: {
    naxtDayApplyPlanDelSearch: naxtDayApplyPlanDelSearch
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
          label: '序号',
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
          // prop: 'VarCode',
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true
          // width: 300
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true
          // width: 300
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          showOverflowTooltip: true
          // width: 250
        },
        {
          slot: 'APPLY_QTY',
          // prop: 'APPLY_QTY',
          label: '申请数量',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'JP_APPLY_QTY',
          label: '拣配数量',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          slot: 'REMARK',
          // prop: 'REMARK',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'CREATE_TIME',
          label: '申请时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'CREATE_MAN',
          label: '添加人',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        }
      ],
      toolbar: false,
      toolStyle: {
        display: 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      },
      pageSize: 10,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 999999],
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      datasourceList: [],
      sumNumber: 0,
      sumAount: 0,
      dialogVisible: false,
      input: 1,
      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0,
      sum: 0,
      rowData: null
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetNaxtDayApplyPlanDel({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          this.datasourceList = res.result;
          return tData;
        }
      );
      return data;
    },
    changeSum() {
      this.form2.sum =
        this.form2.count1 * this.form2.count2 +
        this.form2.count3 * this.form2.count4;
    },
    /* 刷新表格 */
    reload(where) {
      where.MAIN_ID = this.KSDepartmentalPlanData.ID;
      this.$refs.table.reload({ page: 1, where });
    },
    ClickReload(IsReload) {
      this.$emit('IsReload', IsReload);
    },
    remove(row) {
      console.log(row);
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    showEditReoad(data) {
      if (data == false) {
        var where = {
          MAIN_ID: this.KSDepartmentalPlanData.ID
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },

    dialogVisibleFun(row) {
      this.dialogVisible = true;
      // row.PlanQty = this.count1*this.count2+
      // this.count3*this.count4;
      this.changeSumByEN(row);
      this.rowData = row;
    },

    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      // .then((_) => {
      //   done();
      // })
      // .catch((_) => {});
    },
    sumAoumt() {
      this.sum = this.count1 * this.count2 + this.count3 * this.count4;
    },
    changeSumByEN(row) {
      console.log(row);
      // console.log(this.rowdata.PlanQty)
      row.PlanQty = this.count1 * this.count2 + this.count3 * this.count4;
      // console.log(this.rowdata)

      console.log(row.PlanQty);
    },
    UpNaxtDayApplyPlanDelFun() {
      console.log(this.datasourceList);
      const loading = this.$messageLoading('保存中..');

      var list = [];
      // this.selection.forEach((element) => {
      //   var data = {
      //     ID: element.ID,
      //     APPLY_QTY: element.APPLY_QTY,
      //     REMARK: element.REMARK
      //   };
      //   list.push(data);
      // });
      this.datasourceList.forEach((element) => {
        var data = {
          ID: element.ID,
          APPLY_QTY: element.APPLY_QTY,
          REMARK: element.REMARK
        };
        list.push(data);
      });

      UpNaxtDayApplyPlanDel(list)
        .then((res) => {
          console.log(res, res);
          loading.close();
          var where = {
            MAIN_ID: this.KSDepartmentalPlanData.ID
          };
          this.$refs.table.reload({ page: 1, where });

          this.$message.success(res.msg);
        })
        .catch((res) => {
          loading.close();
          console.log(1);
          this.$message.error(res.msg);
        });
    }
  },
  computed: {
    KSDepartmentalPlanDataSearch() {
      return this.KSDepartmentalPlanData;
    }
  },
  watch: {
    KSDepartmentalPlanDataSearch() {
      this.$forceUpdate();
      // console.log(this.KSDepartmentalPlanData)
      if (this.KSDepartmentalPlanData) {
        var where = {
          MAIN_ID: this.KSDepartmentalPlanData.ID
        };
      }
      this.$refs.table.reload({ page: 1, where: where });
    },
    datasourceList() {
      this.$bus.$emit('naxtDayApplyPlanDel',this.datasourceList)
    },
    count1() {
      this.sumAoumt();
    },
    count2() {
      this.sumAoumt();
    },
    count3() {
      this.sumAoumt();
    },
    count4() {
      this.sumAoumt();
    },
    sum() {
      console.log(this.sum);
      let className = 'PAG_TYPE' + this.rowData.ID;
      // console.log(className);
      // let aaa = document.getElementsByClassName(className).click();

      let div = document.getElementById(className);
      div.click();
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>

<style scoped>
.ele-body {
  padding: 0px;
}
</style>
