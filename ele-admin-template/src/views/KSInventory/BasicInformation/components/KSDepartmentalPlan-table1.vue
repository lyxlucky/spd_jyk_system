
<template>
  <div class="ele-body">
    <el-descriptions class="margin-top" :column="6" border>
      <!-- <template slot="extra">
        <el-button type="primary" size="small">操作</el-button>
      </template> -->
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          病人来源
        </template>
        门诊
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          病案号
        </template>
        18100000000
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          病人姓名
        </template>
        刘礼
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          病人性别
        </template>
        男
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          床号
        </template>
        25
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          收货单号
        </template>
        1825420120
      </el-descriptions-item>

      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          医生使用科室
        </template>
        手术室
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          核算科室
        </template>
        手术室
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          住院科室
        </template>
        手术室
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          HIS申请单号
        </template>
        18544521520
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          手术日期
        </template>
        2023-05-08
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          手术名称
        </template>
        心经导脏射
      </el-descriptions-item>

      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          护士长
        </template>
        李静
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          巡回护士
        </template>
        王慧
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          洗手护士
        </template>
        王慧
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          手术医生
        </template>
        吴时
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          疾病名称
        </template>

      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          手术术间
        </template>
        H1
      </el-descriptions-item>

      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          审核人
        </template>
        李虎
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          审核时间
        </template>
        2023-05-10
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          记账人
        </template>
        刘基
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          记账时间
        </template>

      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          制单人
        </template>
        孔入
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          制单时间
        </template>
        2023-05-15
      </el-descriptions-item>

      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          病人收费
        </template>

      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          是否急症
        </template>
        否
      </el-descriptions-item>
      <el-descriptions-item labelStyle="background: #D7E6FA;">
        <template slot="label">

          备注
        </template>

      </el-descriptions-item>

    </el-descriptions>

  </div>

</template>

<script>
import KSDepartmentalPlanSearch from './KSDepartmentalPlan-search.vue';
import {
  SerachPlanList,
  DeletePlanList,
  SearchHistoryConsumedAndPurchaseDept,
  ReturnInitState
} from '@/api/KSInventory/KSDepartmentalPlan';
import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';
export default {
  name: 'KSDepartmentalPlanTable',
  props: ['IsReload'],
  components: {
    KSDepartmentalPlanSearch
  },
  data() {
    return {
      SerachName: '',
      SerachName2: '',

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
        {
          columnKey: 'action',
          label: '操作',
          width: 120,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'right'
        },
        {
          prop: 'PlanNum',
          label: '申领单号',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Operater',
          label: '申领人',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          // prop: 'State',
          label: '状态',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110,
          slot: 'State'
          // formatter: (row, column, cellValue) => {
          //   if (cellValue === '0') {
          //     return '新增';
          //   } else if (cellValue === '1') {
          //     return '已提交';
          //   } else if (cellValue === '2') {
          //     return '配送中';
          //   } else if (cellValue === '5') {
          //     return '已审核';
          //   } else if (cellValue === '10') {
          //     return '强制结束';
          //   } else if (cellValue === '6' || cellValue === '4') {
          //     return '已审批';
          //   } else {
          //     return '配送中';
          //   }
          // }
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'PlanTime',
          label: '申领时间',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Approval_Time',
          label: '审批时间',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180,
          formatter: (row, column, cellValue) => {
            return this.$util.toDateString(cellValue);
          }
        },
        {
          prop: 'BZ',
          label: '备注',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        }
      ],
      toolbar: false,
      pageSize: 2,
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
      applyPlanSbz: 0,
      applyPlanXhz: 0,
      applyPlanBl: '0%',
      key: 0,
      RenderTabel: true
    };
  },
  mounted() {
    this.$bus.$on('handleCommand', (data) => {
      // this.RenderTabel = !this.RenderTabel;

      this.reload();
      this.RenderTabel = false;
      // 建议加上 nextTick 微任务
      // 否则在同一事件内同时将tableShow设置false和true有可能导致组件渲染失败
      this.$nextTick(function () {
        // 加载
        this.RenderTabel = true;
      });
    });
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
      let data = SerachPlanList({ page, limit, where, order }).then((res) => {
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      });
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    onDone(res) {
      // console.log('res:', res);
      // 例如选中第一条数据
      if (res.data?.length) {
        this.$refs.table.setCurrentRow(res.data[0]);
      }
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    onCurrentChange(current) {
      this.current = current;
      // console.log(current);
      this.$emit('getCurrent', current);
    },

    /* 删除数据 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      DeletePlanList(row)
        .then((res) => {
          this.$message.success(res.msg);
          loading.close();
          // this.$refs.table.reRenderTable();
          this.reload();
          this.$forceUpdate();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    GetConsume() {
      var data = {
        deptTwoCode: this.$store.state.user.info.DeptNow.Dept_Two_Code
      };
      SearchHistoryConsumedAndPurchaseDept(data)
        .then((res) => {
          this.applyPlanSbz = res.result[0].Purchase_Cost.toFixed(2);
          this.applyPlanXhz = res.result[0].Consumed_Cost.toFixed(2);
          if (data.result[0].Purchase_Cost > 0) {
            this.applyPlanBl =
              (
                (data.result[0].Consumed_Cost / data.result[0].Purchase_Cost) *
                100
              ).toFixed(2) + '%';
          } else {
            this.applyPlanBl = 0 + '%';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    ReturnStateBtn(data) {
      // var IDs = data.PlanNum;
      // var IDStr = IDs + ',';
      // IDs.forEach((item) => {
      //   IDStr += item + ',';
      // });
      // IDStr.substring(0, IDStr.length - 1);

      var data2 = {
        IDs: data.PlanNum
      };
      const loading = this.$messageLoading('正在保存。。。');
      ReturnInitState(data2)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          // this.reload();
          // this.$forceUpdate();
          this.key += 1;
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    }
  },
  watch: {
    IsReload() {
      if (this.IsReload == true) {
        this.reload(); // 调用刷新表格的方法
      }
    }
  },
  created() {
    // this.getdatasource();
    this.GetConsume();
  },
  // 取消监听bus事件
  destroyed() {
    // 取消对handleCommand事件的监听
    this.$bus.$off('handleCommand');
  }
};
</script>


<style scoped>
.ele-body {
  padding: 0px;
}

.my-label {
  background: #53be1d;
}

.my-content {
  background: #834646;
}
</style>
