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
        <el-form-item label="科室名称">
          <el-input
            v-model="where.DEPT_TWO_NAME"
            clearable
            placeholder="科室名称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input
            v-model="where.varietie_code"
            clearable
            placeholder="品种编码"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input
            v-model="where.varietie_name"
            clearable
            placeholder="品种名称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="计费编码">
          <el-input
            v-model="where.charging_code"
            clearable
            placeholder="计费编码"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="where.manufacturing_ent_name"
            clearable
            placeholder="生产企业"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="$emit('search')">查询</el-button>
          <el-button
            v-permission="'export-TertiaryInventoryDc'"
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
