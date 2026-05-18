<template>
  <div class="ti-search">
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="科室名称">
        <el-input v-model="where.DEPT_TWO_NAME" clearable placeholder="科室名称" style="width: 200px" />
      </el-form-item>
      <el-form-item label="品种编码">
        <el-input v-model="where.varietie_code" clearable placeholder="品种编码" style="width: 200px" />
      </el-form-item>
      <el-form-item label="品种名称">
        <el-input v-model="where.varietie_name" clearable placeholder="品种名称" style="width: 200px" />
      </el-form-item>
      <el-form-item label="计费编码">
        <el-input v-model="where.charging_code" clearable placeholder="计费编码" style="width: 200px" />
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input
          v-model="where.manufacturing_ent_name"
          clearable
          placeholder="生产企业"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="$emit('search')">查询</el-button>
        <el-button v-permission="'export-TertiaryInventoryDc'" :loading="exporting" @click="$emit('export')">
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const defaultWhere = () => ({
  DEPT_TWO_NAME: '',
  varietie_code: '',
  varietie_name: '',
  charging_code: '',
  manufacturing_ent_name: ''
});

export default {
  name: 'TertiaryInventorySearch',
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
.ti-search {
  margin-bottom: 12px;
}
</style>
