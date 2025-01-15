<!-- 搜索表单 -->
<template>
  <el-form
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item>
          <el-input
            size="mini"
            clearable
            v-model="where.condition"
            placeholder="请输入定数码"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item>
          <el-input
            size="mini"
            clearable
            v-model="where.condition1"
            placeholder="品种名称/规格型号"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="近效期:">
          <el-select size="mini" v-model="where.jxqSatte">
            <el-option label="设置默认" value="-1"></el-option>
            <el-option label="全部" value="0"></el-option>
            <el-option label="1个月" value="1"></el-option>
            <el-option label="3个月" value="3"></el-option>
            <el-option label="6个月" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }" >
        <el-form-item label="已退货:">
          <el-select v-model="where.isHaveTh" >
            <el-option label="不包含" value="0"></el-option>
            <el-option label="包含" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item>
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
            <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-download"
              class="ele-btn-icon"
              @click="exportData"
            >
              导出
            </el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
  export default {
    data() {
      // 默认表单数据
      const defaultWhere = {
        condition: '',
        condition1: '',
        jxqSatte: '3',
        isHaveTh: '0'
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
