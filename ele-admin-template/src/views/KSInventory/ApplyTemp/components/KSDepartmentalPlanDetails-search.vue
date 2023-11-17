<!-- 搜索表单 -->
<template>
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
      <el-col v-bind="styleResponsive ? { lg: 11, md: 12 } : { span: 6 }">
        <el-form-item label="平均用量时间段：" label-width='130px'>
          <el-date-picker v-model="where.dateFrom" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-date-picker v-model="where.dateTo" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="12" :md="12">
        <el-form-item label="">
          <el-input v-model="where.SerachName" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="12" :md="12">
        <div class="ele-form-actions">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <div class="ele-form-actions">
        <el-button type="primary" size="small" @click="search" :disabled='!IsDisabled'>自定义新增</el-button>
        <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>引用常规模板</el-button>
        <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>引入其他模板</el-button>
        <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>引入历史记录</el-button>
        <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>暂存申领单</el-button>
        <el-button type="primary" size="small" @click="reset" :disabled='!IsDisabled'>保存并提交</el-button>
        <!-- <el-button type="primary" size="small" @click="reset" :disabled='IsDisabled'>查询订单情况</el-button> -->
        <!-- <el-button type="primary" size="small" @click="reset" :disabled='IsDisabled'>合并订单</el-button> -->
      </div>
    </el-row>
    <el-row :gutter="10">
      <div class="ele-form-actions">
        <el-button type="primary" size="small" @click="search">审核申领单</el-button>
        <el-button type="primary" size="small" @click="search">审批申领单</el-button>
        <el-button type="danger" size="small" @click="removeBatch" :disabled='!IsDisabledByDel'>删除</el-button>
      </div>
    </el-row>
  </el-form>
</template>

<script>
import { DeletePlanDeta } from '@/api/KSInventory/KSDepartmentalPlan';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection'],
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
      value1: '',
      value2: ''
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    IsDisabled() {
      return (
        this.KSDepartmentalPlanDataSearch.State == '0' &&
        (this.KSDepartmentalPlanDataSearch.PlanNum != null ||
          this.KSDepartmentalPlanDataSearch.PlanNum != undefined ||
          this.KSDepartmentalPlanDataSearch.PlanNum.length != 0)
      );
    },
    IsDisabledByDel() {
      return this.KSDepartmentalPlanDataSearch.State == '0';
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
    removeBatch() {
      console.log(this.selection);
      var ID = '';
      this.selection.forEach((item) => {
        ID += item.ID + ',';
      });
      ID.substring(0, ID.length - 1);
      var data = {
        ID
      };
      DeletePlanDeta(data).then((res) => {
        console.log(res);
      });
    }
  }
};
</script>
