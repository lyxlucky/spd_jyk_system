<template>
  <el-form
    label-width="77px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input
          size="mini"
          clearable
          v-model="where.divrjks2_search_inpName"
          placeholder="请输入科室名称"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <el-input
          size="mini"
          clearable
          v-model="where.divrjks2_search_inp"
          placeholder="品种编码、品种名称、型号规格、定数码、RFID码"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input
          size="mini"
          clearable
          v-model="where.operator"
          placeholder="操作人"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 8, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-download"
            class="ele-btn-icon"
            @click="exportData"
          >
            导出
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      defaultWhere: {
        divrjks2_search_inpName: '',
        divrjks2_search_inp: '',
        operator: ''
      },
      where: {}
    };
  },
  computed: {
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
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
