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
          <el-button type="primary" size="small" @click="dialogTableVisible = true">添加品种</el-button>
          <el-button type="primary" size="small" @click="search">导入模板</el-button>
          <el-button type="primary" size="small" @click="search">导出模板</el-button>
          <el-button type="primary" size="small" @click="search">保存</el-button>
          <el-button type="danger" size="small" @click="removeBatch">删除</el-button>
        </div>
      </el-row>
    </el-form>
    <el-dialog title="授权品种目录" :visible.sync="dialogTableVisible" width='70%'>
      <AuthVarTable :dialogTableVisible="dialogTableVisible" />
    </el-dialog>
  </div>

</template>

<script>
import { DeletePlanDeta } from '@/api/KSInventory/KSDepartmentalPlan';
import AuthVarTable from './AuthVarTable.vue';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection'],
  components: {
    AuthVarTable: AuthVarTable
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
      dialogTableVisible: false
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
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
