<!-- 搜索表单 -->
<template>
  <el-form
    label-width="77px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input
          size="mini"
          clearable
          v-model="where.VarPriceRecode_varScarch"
          placeholder="编码/名称/规格型号"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <!-- <el-input size="mini" clearable v-model="where.VARIETIE_CODE_NEW" placeholder="品种编码/品种名称" /> -->
        <el-date-picker
          v-model="where.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <label>
          处理状态:
          <el-select
            v-model="where.SPECIFICATION_OR_TYPE"
            size="mini"
            placeholder="请选择状态"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option label="未处理" value="未处理"></el-option>
            <el-option label="已处理" value="已处理"></el-option>
          </el-select>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <label>
          新旧价格是否一致:
          <el-select
            v-model="where.SPECIFICATION_OR_TYPE"
            size="mini"
            placeholder="请选择状态"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </label>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >
          <el-button type="success" size="mini" @click="exportData()"
            >标记处理</el-button
          >
          <el-button
            type="success"
            size="mini"
            icon="el-icon-download"
            @click="exportData()"
            >导出</el-button
          >
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
        VarPriceRecode_varScarch: '',
        VARIETIE_CODE_NEW: '',

        SPECIFICATION_OR_TYPE: '未处理' // 默认选中未处理
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
