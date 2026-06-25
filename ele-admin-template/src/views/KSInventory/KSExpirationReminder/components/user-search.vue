<!-- 搜索表单 -->
<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        class="ele-form-search"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-form-item label="定数码">
          <el-input
            clearable
            style="width: 140px"
            v-model="where.condition"
            placeholder="定数码"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            clearable
            style="width: 160px"
            v-model="where.condition1"
            placeholder="品种名称/规格型号"
          />
        </el-form-item>
        <el-form-item label="近效期">
          <el-select style="width: 110px" v-model="where.jxqSatte">
            <el-option label="设置默认" value="-1" />
            <el-option label="全部" value="0" />
            <el-option label="1个月" value="1" />
            <el-option label="3个月" value="3" />
            <el-option label="6个月" value="6" />
          </el-select>
        </el-form-item>
        <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }" >
        <el-form-item label="已退货:">
          <el-select v-model="where.isHaveTh" >
            <el-option label="不包含" value="0"></el-option>
            <el-option label="包含" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
        <el-form-item class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  const defaultWhere = () => ({
    condition: '',
    condition1: '',
    jxqSatte: '6',
    isHaveTh: '0'
  });

  export default {
    data() {
      return {
        // 表单数据
        where: defaultWhere()
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
        this.where = defaultWhere();
        this.search();
      },
      exportData() {
        this.$emit('exportData', this.where);
      }
    }
  };
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}
</style>
