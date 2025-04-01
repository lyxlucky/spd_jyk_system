<template>
  <div class="ele-body">
    <!-- <el-button type="danger" size="small" @click="aaa">aaa</el-button> -->
    <!-- 数据表格 -->
    <!-- :rowClickChecked="true"  -->
    <!-- :rowClickCheckedIntelligent="false"  -->
    <ele-pro-table ref="table" :toolStyle="toolStyle" height="40vh" highlight-current-row :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" @selection-change="onSelectionChange" cache-key="KSInventoryBasicDataTable">
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
        <p style="display: flex; justify-content: flex-start; font-size: large">实际申领数量合计: <b>{{ sumNumber }}</b> 实际申领金额合计:
          <b>{{ sumAount }}</b>
        </p>
        <KSDepartmentalPlanDetails-search @Approval="Approval" @exportData="exportData" @search="reload" @ClickReload="ClickReload" :KSDepartmentalPlanDataSearch="KSDepartmentalPlanDataSearch" :selection="selection" @showEditReoad="showEditReoad" :datasourceList="datasourceList" />
      </template>

      <template v-slot:PlanQty="{ row }">
        <el-input v-model="row.PlanQty" :min="0" :max="99999999" :step="1" size="mini" />
        <!-- <el-input-number v-model="row.PlanQty" controls-position="right" @change="handleChange" :min="0" :max="9999" size="mini"></el-input-number> -->
      </template>
      <template v-slot:VarCode="{ row }">
        <el-tag v-if="row.LEFT_APPLY_QTY == 0" type="success">{{
          row.VarCode
        }}</el-tag>
        <el-tag v-else type="danger">{{ row.VarCode }}</el-tag>
      </template>
      <template v-slot:REMARK="{ row }">
        <el-link v-if="row.REMARK == null" type="info" @click="OpenUpApplyPlanBZBox(row.ID)">无</el-link>
        <el-tag v-else type="primary" @click="OpenUpApplyPlanBZBox(row.ID)">{{
          row.REMARK
        }}</el-tag>
      </template>
      <template v-slot:State="{ row }">
        <el-tag v-if="row.State == 0" type="success">新增</el-tag>
        <el-tag v-if="row.State == 1" type="success">已提交</el-tag>
        <el-tag v-if="row.State == 2" type="success">配送中</el-tag>
        <el-tag v-if="row.State == 5" type="success">已审核</el-tag>
        <el-tag v-if="row.State == 10" type="success">强制结束</el-tag>
        <el-tag v-if="
            (row.State == 6 || row.State == 4) &&
            row.SUM_Left_Apply_Qty == row.SUM_Apply_Qty
          " type="success">已审批</el-tag>
        <el-tag v-if="
            row.SUM_Left_Apply_Qty > 0 &&
            row.SUM_Left_Apply_Qty != row.SUM_Apply_Qty
          " type="success">未收全</el-tag>
        <!-- <el-tag v-if="(row.SUM_Left_Apply_Qty == 0)" type="success">已收全</el-tag> -->
        <el-tag v-if="row.SUM_Left_Apply_Qty == 0" type="success">已收全</el-tag>
        <!-- <el-tag v-for="(item) in row" :key="item.PlanNum" size="mini" type="primary" :disable-transitions="true">
          {{ item.State }}
        </el-tag> -->
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
import KSDepartmentalPlanDetailsSearch from './KSDepartmentalPlanDetails-search.vue';
import {
  SerachPlanListDeta,
  UpdateApplyPlanBZ,
  Approval
} from '@/api/KSInventory/KSDepartmentalPlan';
import { utils, writeFile } from 'xlsx';
export default {
  name: 'KSDepartmentalPlanTable',
  props: ['KSDepartmentalPlanData'],
  // inject: ['reload'],
  components: {
    KSDepartmentalPlanDetailsSearch: KSDepartmentalPlanDetailsSearch
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
          slot: 'VarCode',
          label: '品种编码',

          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        // {
        //   prop: 'DEPT_ZDY_VARIETIE_CODE',
        //   label: '自定义编码',

        //   align: 'center',
        //   showOverflowTooltip: true,
        //   width: 120,
        //   show: false,
        //   formatter: (row, column, cellValue) => {
        //     if (cellValue == null) {
        //       return '未定义';
        //     }
        //     return cellValue;
        //   }
        // },
        {
          prop: 'CONTRACT_TYPE',
          label: '合同类型',

          align: 'center',
          showOverflowTooltip: true,
          width: 110,
          show: false,
          formatter: (row, column, cellValue) => {
            if (cellValue == 2) {
              return '临采';
            } else if (cellValue == 1) {
              return '中标';
            } else {
              return '-';
            }
          }
        },
        {
          prop: 'VarName',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          width: 180
        },
        {
          prop: 'GG',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          width: 180
        },
        {
          prop: 'Manufacturing',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          width: 180
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '启用供应商',
          align: 'center',
          showOverflowTooltip: true,
          width: 180
        },
        // {
        //   prop: 'TempQty',
        //   label: '中心库库存',

        //   align: 'center',
        //   showOverflowTooltip: true,
        //   width: 110
        // },
        {
          prop: 'Day_Consume_Qty',
          label: '平均用量(默认近30天)  ',

          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'StockQty',
          label: '中心库库存',

          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'TJ_QTY',
          label: '提交数量',

          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          slot: 'PlanQty',
          // prop: 'PlanQty',
          label: '实际申领数量',

          align: 'center',
          showOverflowTooltip: true,
          width: 160,
          fixed: 'left'
        },
        {
          prop: 'Unit',
          label: '单位',

          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'Price',
          label: '结算价',

          align: 'center',
          showOverflowTooltip: true,
          width: 80,
          formatter: (row, column, cellValue) => {
            return Number(cellValue).toFixed(2);
          }
        },
        {
          slot: 'PAG_TYPE',
          // prop: 'PAG_TYPE',
          label: '包装规格',

          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: '',
          label: '总金额',
          align: 'center',
          showOverflowTooltip: true,
          width: 80,
          formatter: (row, column, cellValue) => {
            return this.$numeral(
              Number(row.Price) * Number(row.PlanQty)
            ).format('0,0.00');
          }
        },
        {
          prop: '',
          label: '已收货数量',

          align: 'center',
          showOverflowTooltip: true,
          width: 100,
          formatter: (row, column, cellValue) => {
            return row.PlanQty - row.LEFT_APPLY_QTY;
          }
        },
        {
          prop: 'IS_NEED_TWO_APP',
          label: '二级审批',

          align: 'center',
          showOverflowTooltip: true,
          width: 110,
          formatter: (row, column, cellValue) => {
            var IS_NEED_TWO_APP = '';
            var STATE = '';
            if (row.IS_NEED_TWO_APP == 0) {
              return '-';
            }
            if (row.IS_NEED_TWO_APP == 1) {
              IS_NEED_TWO_APP = '是';
            }
            if (row.SENCOND_APP_STATE == 0) {
              STATE = '未审批';
            }
            if (row.SENCOND_APP_STATE == 1) {
              STATE = '已审批';
            }
            return IS_NEED_TWO_APP + '/' + STATE;
          }
        },
        {
          // prop: 'REMARK',
          slot: 'REMARK',
          label: '备注',
          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'SPDBZ',
          label: 'SPD备注',

          align: 'center',
          showOverflowTooltip: true,
          width: 110
        }
      ],
      toolbar: false,
      toolStyle: {
        display: 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'flex-end'
      },
      pageSize: 9999999,
      pagerCount: 2,
      pageSizes: [100, 9999999],
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
    Approval() {
      Approval({ PlanNum: this.KSDepartmentalPlanData.PlanNum }).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: 'success',
            message: '审批成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
        this.reload();
      });
    },
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      var Dept_Two_CodeStr = '';
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr =
          Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      }
      where.DeptCode = Dept_Two_CodeStr;
      let data = SerachPlanListDeta({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          this.datasourceList = res.result;
          this.sumNumber = res.sumNumber;
          this.sumAount = res.sumAount;
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
      console.log(this.KSDepartmentalPlanData);
      where.PlanNum = this.KSDepartmentalPlanData.PlanNum;
      this.$refs.table.reload({ page: 1, where: where });
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
          PlanNum: this.KSDepartmentalPlanData.PlanNum
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    OpenUpApplyPlanBZBox(ID) {
      this.$prompt('请输入备注信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern:
        //   /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          const loading = this.$messageLoading('备注提交中..');
          var data = {
            ID,
            REMARK: value
          };
          UpdateApplyPlanBZ(data).then((res) => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '备注成功'
              });
            } else {
              this.$message({
                type: 'error',
                message: res.message
              });
            }
            loading.close();
            var where = {
              PlanNum: ''
            };
            this.reload(where);
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消备注'
          });
        });
    },
    dialogVisibleFun(row) {
      this.dialogVisible = true;
      // row.PlanQty = this.count1*this.count2+
      // this.count3*this.count4;
      this.changeSumByEN(row);
      this.rowData = row;
    },
    exportData(data) {
      console.log(data);
      const loading = this.$messageLoading('正在导出数据...');

      var Dept_Two_CodeStr = '';
      var userDeptList = this.$store.state.user.info.userDept;
      for (let i = 0; i < userDeptList.length; i++) {
        Dept_Two_CodeStr =
          Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
      }

      this.$refs.table.doRequest(({ where, order }) => {
        where.DeptCode = Dept_Two_CodeStr;
        where.SerachName = data.SerachName;
        SerachPlanListDeta({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '品种全称',
                '型号/规格',
                '生产企业名称',
                '申领数量',
                '单位',
                '结算价',
                '供应商名称'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.VarCode,
                d.VarName,
                d.GG,
                d.Manufacturing,
                d.PlanQty,
                d.Unit,
                d.Price,
                d.SUPPLIER_NAME
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '科室计划详情.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
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
      if (this.KSDepartmentalPlanData) {
        var where = {
          PlanNum: this.KSDepartmentalPlanData.PlanNum
        };
      }
      this.$refs.table.reload({ page: 1, where: where });
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
