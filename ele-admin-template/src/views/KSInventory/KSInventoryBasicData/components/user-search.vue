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
        <el-form-item label="品种">
          <el-input
            clearable
            style="width: 140px"
            v-model="where.Varietie_Code_New"
            placeholder="编码/名称"
          />
        </el-form-item>
        <el-form-item label="注册证">
          <el-input
            clearable
            style="width: 120px"
            v-model="where.APPROVAL_NUMBER"
            placeholder="注册证号"
          />
        </el-form-item>
        <el-form-item label="包装规格">
          <el-input
            clearable
            style="width: 120px"
            v-model="where.Specification_Or_Type"
            placeholder="包装规格"
          />
        </el-form-item>
        <el-form-item label="使用科室">
          <el-input
            clearable
            style="width: 110px"
            v-model="where.settlementDept"
            placeholder="有使用科室"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            clearable
            style="width: 120px"
            v-model="where.Manufacturing_Ent_Name"
            placeholder="生产企业"
          />
        </el-form-item>
        <el-form-item label="主动补货">
          <el-select
            style="width: 90px"
            v-model="where.isDeptTwoAuth"
            @change="search()"
          >
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-select style="width: 90px" v-model="where.type" @change="search()">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="高低值">
          <el-select
            style="width: 90px"
            v-model="where.HIGH_OR_LOW_CLASS"
            placeholder="全部"
            clearable
            @change="search()"
          >
            <el-option label="全部" value="" />
            <el-option label="低值" value="0" />
            <el-option label="高值" value="1" />
            <el-option label="试剂" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="openEdit2()">修改上下限</el-button>
          <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  const defaultWhere = () => ({
    Varietie_Code_New: '',
    APPROVAL_NUMBER: '',
    Manufacturing_Ent_Name: '',
    Specification_Or_Type: '',
    CLASS_NUM: '',
    DEVICE_REMARK: '',
    Dept_One_Code: '',
    isDeptTwoAuth: '',
    type: '1',
    settlementDept: '',
    HIGH_OR_LOW_CLASS: '2'
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
      openEdit2() {
        this.$emit('openEdit2', this.where);
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
