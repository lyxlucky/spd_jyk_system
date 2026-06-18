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
        <el-form-item label="科室名称">
          <el-input
            v-model="where.divrjks2_search_inpName"
            clearable
            placeholder="请输入科室名称"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="关键字">
          <el-input
            v-model="where.divrjks2_search_inp"
            clearable
            placeholder="编码/名称/规格/定数码/RFID"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="暂借日期">
          <el-date-picker
            v-model="where.timerange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button type="info" icon="el-icon-upload" @click="returnData">归还</el-button>
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
        divrjks2_search_inpName: '',
        divrjks2_search_inp: '',
        timerange: []
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
    },
    returnData() {
      this.$emit('returnData', this.where);
    }
  }
};
</script>
