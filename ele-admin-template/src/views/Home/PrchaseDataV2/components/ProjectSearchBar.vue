<template>
  <div class="project-search-bar">
    <el-form
      size="small"
      inline
      label-width="auto"
      class="search-form"
      @keyup.enter.native="onSearch"
      @submit.native.prevent
    >
      <div class="search-row">
        <el-form-item label="注册证名称">
          <el-input v-model="form.PROD_REGISTRATION_NAME" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input v-model="form.APPROVAL_NUMBER" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="采购数量">
          <el-select v-model="form.CountState" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="等于消耗" value="0" />
            <el-option label="大于消耗" value="1" />
            <el-option label="小于消耗" value="2" />
            <el-option label="大于等于消耗" value="3" />
            <el-option label="小于等于消耗" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-select v-model="form.last" style="width: 100px">
            <el-option label="未过期" value="0" />
            <el-option label="全部" value="" />
            <el-option label="已过期" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="起始日期">
          <el-date-picker
            v-model="buyTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="终止日期">
          <el-date-picker
            v-model="endTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 240px"
          />
        </el-form-item>
      </div>
      <div class="search-row">
        <el-form-item label="来源">
          <el-input v-model="form.SOURCE_FROM" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.PRICE" clearable style="width: 90px" />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="form.MANUFACTURING_ENT_NAME"
            placeholder="生产企业/备注"
            clearable
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="form.VARIETIE_CODE_NEW"
            placeholder="名称/编码"
            clearable
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item v-if="deptMode" label="科室">
          <el-input v-model="form.DeptQuery" placeholder="名称/编码" clearable style="width: 130px" />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-select v-model="form.XM_NAME" filterable clearable style="width: 140px">
            <el-option label="全部" value="" />
            <el-option v-for="o in xmNameOptions" :key="'n' + o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目编码">
          <el-select v-model="form.XM_NUM" filterable clearable style="width: 140px">
            <el-option label="全部" value="" />
            <el-option v-for="o in xmNumOptions" :key="'c' + o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select v-model="form.XM_TYPE" filterable clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option v-for="o in xmTypeOptions" :key="'t' + o" :label="o" :value="o" />
          </el-select>
        </el-form-item>
        <el-form-item label="消耗时间">
          <el-date-picker
            v-model="consumeTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            style="width: 240px"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="toolbar-actions">
      <el-button type="primary" icon="el-icon-search" size="small" @click="onSearch">查询</el-button>
      <el-button icon="el-icon-refresh" size="small" @click="onReset">重置</el-button>
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
import { defaultWhere } from '../utils';

export default {
  props: {
    value: { type: Object, required: true },
    deptMode: { type: Boolean, default: false },
    xmNameOptions: { type: Array, default: () => [] },
    xmNumOptions: { type: Array, default: () => [] },
    xmTypeOptions: { type: Array, default: () => [] }
  },
  computed: {
    form: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit('input', v);
      }
    },
    buyTimeRange: {
      get() {
        const { statrTime, endTime } = this.form;
        return statrTime && endTime ? [statrTime, endTime] : null;
      },
      set(val) {
        this.form.statrTime = val && val.length === 2 ? val[0] : '';
        this.form.endTime = val && val.length === 2 ? val[1] : '';
      }
    },
    endTimeRange: {
      get() {
        const { statrTime2, endTime2 } = this.form;
        return statrTime2 && endTime2 ? [statrTime2, endTime2] : null;
      },
      set(val) {
        this.form.statrTime2 = val && val.length === 2 ? val[0] : '';
        this.form.endTime2 = val && val.length === 2 ? val[1] : '';
      }
    },
    consumeTimeRange: {
      get() {
        const { statrTime3, endTime3 } = this.form;
        return statrTime3 && endTime3 ? [statrTime3, endTime3] : null;
      },
      set(val) {
        this.form.statrTime3 = val && val.length === 2 ? val[0] : '';
        this.form.endTime3 = val && val.length === 2 ? val[1] : '';
      }
    }
  },
  methods: {
    onSearch() {
      this.$emit('search');
    },
    onReset() {
      this.$emit('input', defaultWhere());
      this.$emit('search');
    }
  }
};
</script>

<style lang="scss" scoped>
.project-search-bar {
  margin-bottom: 8px;
}

.search-form {
  display: block;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 4px;

  & + & {
    margin-top: 4px;
  }
}

.search-form :deep(.el-form-item) {
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
  margin-bottom: 0;
}

.search-form :deep(.el-form-item__label) {
  white-space: nowrap;
  padding-right: 6px;
  float: none;
}

.search-form :deep(.el-form-item__content) {
  display: inline-flex;
  align-items: center;
  line-height: 32px;
  max-width: none;
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
</style>
