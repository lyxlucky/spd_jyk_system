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
        <el-form-item label="关键字">
          <el-input
            v-model="where.temporary2_search_inp"
            clearable
            placeholder="编码/名称/领出人/定数码"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="计划开始">
          <el-date-picker
            v-model="where.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            style="width: 135px"
          />
        </el-form-item>
        <el-form-item label="-">
          <el-date-picker
            v-model="where.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            style="width: 135px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
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
        temporary2_search_inp: '',
        deptName: '',
        start_time: '',
        end_time: ''
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
    exportData() {
      this.$emit('exportData', this.where);
    }
  }
};
</script>
