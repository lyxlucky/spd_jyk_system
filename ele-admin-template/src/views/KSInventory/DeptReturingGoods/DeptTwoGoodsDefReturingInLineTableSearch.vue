<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-form-item label="品种编码">
          <el-input
            v-model="where.varCode"
            clearable
            placeholder="品种编码"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="品种名称">
          <el-input
            v-model="where.varName"
            clearable
            placeholder="品种名称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.varSpec"
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
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="批号">
          <el-input
            v-model="where.batch"
            clearable
            placeholder="批号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="医保编码">
          <el-input
            v-model="where.medicalCode"
            clearable
            placeholder="医保编码"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="success" icon="el-icon-check" @click="handleInLineAdd">添加到退货单</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeptTwoGoodsDefReturingInLineTableSearch',
  data() {
    return {
      where: {
        varCode: '',
        varName: '',
        varSpec: '',
        defNoPkgCode: '',
        batch: '',
        medicalCode: ''
      }
    };
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
    handleInLineAdd() {
      this.$emit('handleInLineAdd');
    }
  }
};
</script>
