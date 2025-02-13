<template>
  <div class="ele-body">
    <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
    <div style="height: 300px;">
      <el-steps direction="vertical" :active="1">
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step>
      </el-steps>
    </div>
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
    reset() {
      console.log(this.KSDepartmentalPlanDataSearch);
    }
  },
  computed: {
    KSDepartmentalPlanDataSearch() {
      return this.KSDepartmentalPlanData;
    }
  },
  watch: {},
  created() {}
};
</script>

<style scoped>
.ele-body {
  padding: 0px;
}
</style>
