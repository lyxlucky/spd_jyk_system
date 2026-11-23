<template>
  <el-form class="inventory-jyk-search" size="mini" :inline="true" @keyup.enter.native="search" @submit.native.prevent>
        <el-form-item label="定数码">
          <el-input
            v-model="where.condition"
            clearable
            placeholder="请输入定数码"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
</template>

<script>
export default {
  data() {
    return {
      defaultWhere: {
        sourceFrom: '',
        batchId: '',
        varietieCode: '',
        batch: '',
        coefficient: '',
        currUpShelfState: '',
        condition: '',
        storageId: ''
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
    }
  }
};
</script>
