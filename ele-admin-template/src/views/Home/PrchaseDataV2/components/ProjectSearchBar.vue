<template>
  <el-form size="small" inline class="search-bar" @submit.native.prevent>
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
    <el-form-item label="起始">
      <el-date-picker v-model="form.statrTime" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
    </el-form-item>
    <el-form-item label="至">
      <el-date-picker v-model="form.endTime" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
    </el-form-item>
    <el-form-item label="结束">
      <el-date-picker v-model="form.statrTime2" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
    </el-form-item>
    <el-form-item label="至">
      <el-date-picker v-model="form.endTime2" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
    </el-form-item>
    <br />
    <el-form-item>
      <el-input v-model="form.SOURCE_FROM" placeholder="来源" clearable style="width: 140px" />
    </el-form-item>
    <el-form-item>
      <el-input v-model="form.PRICE" placeholder="价格" clearable style="width: 90px" />
    </el-form-item>
    <el-form-item>
      <el-input
        v-model="form.MANUFACTURING_ENT_NAME"
        placeholder="生产企业/备注"
        clearable
        style="width: 150px"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        v-model="form.VARIETIE_CODE_NEW"
        placeholder="品种名称/编码"
        clearable
        style="width: 150px"
      />
    </el-form-item>
    <el-form-item v-if="deptMode">
      <el-input v-model="form.DeptQuery" placeholder="科室名称/编码" clearable style="width: 150px" />
    </el-form-item>
    <el-form-item label="项目名称">
      <el-select v-model="form.XM_NAME" filterable clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option v-for="o in xmNameOptions" :key="'n' + o" :label="o" :value="o" />
      </el-select>
    </el-form-item>
    <el-form-item label="项目编码">
      <el-select v-model="form.XM_NUM" filterable clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option v-for="o in xmNumOptions" :key="'c' + o" :label="o" :value="o" />
      </el-select>
    </el-form-item>
    <el-form-item label="项目类型">
      <el-select v-model="form.XM_TYPE" filterable clearable style="width: 150px">
        <el-option label="全部" value="" />
        <el-option v-for="o in xmTypeOptions" :key="'t' + o" :label="o" :value="o" />
      </el-select>
    </el-form-item>
    <el-form-item label="消耗时间">
      <el-date-picker v-model="form.statrTime3" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
    </el-form-item>
    <el-form-item label="至">
      <el-date-picker v-model="form.endTime3" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="$emit('search')">查询</el-button>
    </el-form-item>
    <slot name="actions" />
  </el-form>
</template>

<script>
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
    }
  }
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 8px;
}
</style>
