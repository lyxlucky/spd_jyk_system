<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="$emit('search')"
        @submit.native.prevent
      >
        <el-form-item label="品种编码">
          <el-input
            v-model="where.newcode"
            clearable
            placeholder="品种编码"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.specification_or_type"
            clearable
            placeholder="规格型号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="批号">
          <el-input
            v-model="where.batch"
            clearable
            placeholder="批号"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="申领单号">
          <el-input
            v-model="where.delivery_number"
            clearable
            placeholder="申领单号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="批准文号">
          <el-input
            v-model="where.approval_number"
            clearable
            placeholder="批准文号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="where.manufacturing_ent_name"
            clearable
            placeholder="生产企业"
            style="width: 110px"
          />
        </el-form-item>
        <br />
        <el-form-item label="供应商">
          <el-input
            v-model="where.supplier_name"
            clearable
            placeholder="供应商"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="where.TimeStart"
            type="month"
            value-format="yyyy-MM"
            placeholder="开始"
            style="width: 110px"
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="where.TimeEnd"
            type="month"
            value-format="yyyy-MM"
            placeholder="结束"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="$emit('search')">查询</el-button>
          <el-button
            v-permission="'export-ThirdInventoryQueryDc'"
            type="success"
            icon="el-icon-download"
            :loading="exporting"
            @click="$emit('export')"
          >
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const defaultWhere = () => ({
  newcode: '',
  specification_or_type: '',
  batch: '',
  delivery_number: '',
  approval_number: '',
  manufacturing_ent_name: '',
  supplier_name: '',
  TimeStart: '',
  TimeEnd: ''
});

export default {
  name: 'ThirdInventoryQuerySearch',
  props: {
    exporting: Boolean
  },
  data() {
    return {
      where: defaultWhere()
    };
  },
  methods: {
    getWhere() {
      return { ...this.where };
    }
  }
};
</script>

<style scoped>
.range-split {
  margin: 0 4px;
  color: #909399;
}
</style>
