<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <!-- <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="状态：">
          <el-select v-model="where.State" @change="search()">
            <el-option label="显示所有申领品种" value="-1"></el-option>
            <el-option label="仅显示实际申领为空品种" value="0"></el-option>
            <el-option label="仅显示实际申领非空品种" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
        <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 6 }">
          <el-form-item label="平均用量时间段：" label-width='130px'>
            <el-date-picker v-model="where.dateFrom" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-date-picker v-model="where.dateTo" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
          </el-date-picker>
        </el-col>
        <el-col :lg="8" :md="12">
          <el-form-item label="">
            <el-input v-model="where.SerachName" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索" clearable />
          </el-form-item>
        </el-col>
        <el-col :lg="4" :md="12">
          <div class="ele-form-actions">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script>
import {
  DeletePlanDeta
  // KeeptListDeta,
} from '@/api/KSInventory/KSDepartmentalPlan';
import { GetDistributeDefDetailNum } from '@/api/KSInventory/KSScanCodeRecGood';

export default {
  props: ['ApplyTempTableDataSearch', 'selection'],
  components: {
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      PlanNum: '',
      is_second_app: '',
      SerachName: '',
      dateFrom: '',
      dateTo: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    ApplyTempTableDataID() {
      return this.ApplyTempTableDataSearch;
    }
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
  },
  watch: {
  }
};
</script>
