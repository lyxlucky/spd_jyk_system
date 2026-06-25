<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="品种编码">
        <el-input
          v-model="where.code"
          placeholder="请输入品种编码"
          clearable
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="是否定标">
        <el-select v-model="where.status" style="width: 110px" @change="search">
          <el-option label="全部" value="" />
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否已读">
        <el-select v-model="where.isShow" style="width: 110px" @change="search">
          <el-option label="全部" value="" />
          <el-option label="已读" value="1" />
          <el-option label="未读" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-check" @click="handleMakeRead">已读</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'KsNewBatchReminderTableSearch',
    data() {
      const defaultWhere = {
        code: '',
        status: '',
        isShow: '0'
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      },
      handleMakeRead() {
        this.$emit('makeRead', this.where);
      }
    }
  };
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
