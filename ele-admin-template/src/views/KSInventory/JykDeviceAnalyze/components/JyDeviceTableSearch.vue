<template lang="">
  <div>
    <el-form :inline="true" class="ele-form-search">
      <el-form-item label="" label-width="0px">
        <el-input
          size="mini"
          v-model="where.code"
          placeholder="请输入品种编码"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          size="mini"
          v-model="where.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择开始日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item style="margin-left: 15px">
        <el-date-picker
          size="mini"
          v-model="where.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="search"
          >查询</el-button
        >
      </el-form-item>

      <el-form-item label="">
        <el-button
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="exportData"
          >导出</el-button
        >
      </el-form-item>

      <el-form-item>
        <span>LIS数据从2024-11-12开始接入</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'JyDeviceTableSearch',
    data() {
      const defaultWhere = {
        code: '',
        startDate: '',
        endDate: ''
      };
      return {
        where: { ...defaultWhere },
        pickerOptions: {
          disabledDate(time) {
            // 限制从 2024-01-01 开始
            const startDate = new Date('2024-11-12').getTime();
            return time.getTime() < startDate;
          }
        }
      };
    },
    methods: {
      // 查询
      search() {
        this.$emit('search', this.where);
      },
      exportData() {
        this.$emit('exportData', this.where);
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
