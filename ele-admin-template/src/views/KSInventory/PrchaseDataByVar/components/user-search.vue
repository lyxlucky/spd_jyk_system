<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="注册证名称:" label-width="100px">
          <el-input clearable v-model="where.PROD_REGISTRATION_NAME" placeholder="注册证名称:" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="注册证号:" label-width="100px">
          <el-input clearable v-model="where.APPROVAL_NUMBER" placeholder="注册证号:" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="采购数量:" label-width="90px">
          <el-select v-model="where.CountState" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="等于消耗" value="0"></el-option>
            <el-option label="大于消耗" value="1"></el-option>
            <el-option label="小于消耗" value="2"></el-option>
            <el-option label="大于等于消耗" value="3"></el-option>
            <el-option label="小于等于消耗" value="4"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="结束日期:" label-width="90px">
          <el-select v-model="where.last" @change="search()">
            <el-option label="未过期" value="0"></el-option>
            <el-option label="全部" value=""></el-option>
            <el-option label="已过期" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="起始:" label-width='70px'>
          <el-date-picker v-model="where.statrTime" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-date-picker v-model="where.endTime" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="结束:" label-width='70px'>
          <el-date-picker v-model="where.statrTime2" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-date-picker v-model="where.endTime2" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
        </el-date-picker>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="来源:" label-width="70px">
          <el-input clearable v-model="where.SOURCE_FROM" placeholder="来源:" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="生产企业:" label-width="120px">
          <el-input clearable v-model="where.MANUFACTURING_ENT_NAME" placeholder="生产企业:" />
        </el-form-item>
      </el-col>
      <el-col style="padding-left: 10px" v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
            导出
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      PROD_REGISTRATION_NAME: '',
      MANUFACTURING_ENT_NAME: '',
      SOURCE_FROM: '',
      APPROVAL_NUMBER: '',
      STATE: '',
      statrTime: '',
      endTime: '',
      statrTime2: '',
      endTime2: '',
      CountState: '',
      last: '0'
    };
    return {
      // 表单数据
      where: { ...defaultWhere }
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
    exportData() {
      this.$emit('exportData', this.where);
    }
  }
};
</script>
