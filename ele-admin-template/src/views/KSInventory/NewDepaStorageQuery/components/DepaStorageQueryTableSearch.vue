<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input
              size="mini"
              v-model="where.name"
              placeholder="请输入规格型号/品种编码/品种全称"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input
              size="mini"
              v-model="where.packagerSpec"
              placeholder="请输入规格型号"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input
              size="mini"
              v-model="where.batch"
              placeholder="请输入生产批号"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input
              size="mini"
              v-model="where.type"
              placeholder="请输入入库类型"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input
              size="mini"
              v-model="where.code"
              placeholder="请输入库单号"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input
              size="mini"
              v-model="where.factory"
              placeholder="生产企业"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 2 } : { span: 4 }">
          <el-date-picker
            v-model="where.time"
            size="mini"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 6, md: 2 } : { span: 6 }">
          <div class="ele-form-actions">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="search"
              >查询</el-button
            >
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="exportExcel()"
              >导出Excel</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-_scan"
              size="mini"
              @click="scanInbound"
              >扫单入库</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-form>
  <scanInbound :visible.sync="scanInboundVisible"></scanInbound>
  </div>
</template>
<script>
  import scanInbound from './ScanInbound';
  export default {
    name: 'DepaStorageQueryTableSearch',
    components: {
      scanInbound
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        name: '',
        packagerSpec: '',
        batch: '',
        type: '',
        code: '',
        factory: '',
        time: []
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        scanInboundVisible: false
      };
    },
    methods: {
      // 查询
      search() {
        this.$emit('search', this.where);
      },
      // 导出Excel
      exportExcel() {
        this.$emit('exportExcel', this.where);
      },
      scanInbound() {
        this.scanInboundVisible = true;
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    created() {}
  };
</script>
<style lang=""></style>
