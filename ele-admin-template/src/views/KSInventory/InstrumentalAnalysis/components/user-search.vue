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
        <el-form-item label="机械号">
          <el-input
            v-model="where.BIND_MACHINE"
            clearable
            placeholder="机械号"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="where.VARIETIE_CODE_NEW"
            clearable
            placeholder="编码/名称"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.SPECIFICATION_OR_TYPE"
            clearable
            placeholder="规格型号"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const defaultWhere = () => ({
  BIND_MACHINE: '',
  VARIETIE_CODE_NEW: '',
  SPECIFICATION_OR_TYPE: ''
});

export default {
  data() {
    return {
      where: defaultWhere()
    };
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
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
