<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-form-item label="二级科室">
          <el-input
            v-model="where.deptTwoName"
            clearable
            placeholder="科室名称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="where.varietie"
            clearable
            placeholder="编码/名称"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.specType"
            clearable
            placeholder="规格型号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="定数码">
          <el-input
            v-model="where.defNoPkgCode"
            clearable
            placeholder="定数码"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="合同编码">
          <el-input
            v-model="where.contractCode"
            clearable
            placeholder="合同编码"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="where.supplierName"
            clearable
            placeholder="供应商名称"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button type="info">消耗</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultWhere: {
        deptTwoName: '',
        varietie: '',
        specType: '',
        defNoPkgCode: '',
        contractCode: '',
        supplierName: ''
      },
      where: {}
    };
  },
  created() {
    this.where = { ...this.defaultWhere };
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
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
