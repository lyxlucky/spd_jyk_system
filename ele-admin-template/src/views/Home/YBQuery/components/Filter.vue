<template>
  <div class="yb-query-filter">
    <el-form :model="form" :rules="rules" ref="form" inline="inline">
      <el-form-item label="计费科室">
        <el-input v-model="form.deptName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="品种">
        <el-input
          v-model="form.varietieName"
          clearable
          placeholder="请输入品种名称或编码"
        />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="form.supplierName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="发送时间" prop="sendDateStart">
        <el-date-picker
          v-model="form.sendDateStart"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="-" prop="sendDateEnd">
        <el-date-picker
          v-model="form.sendDateEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.state" placeholder="请选择" clearable>
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="queryLoading"
          @click="handleSearch"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button
          icon="el-icon-download"
          :loading="exportLoading"
          @click="handleExport"
          >导出</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'YBQueryFilter',
    data() {
      return {
        form: {
          deptName: '',
          varietieName: '',
          supplierName: '',
          sendDateStart: '',
          sendDateEnd: '',
          state: ''
        },
        rules: {
          sendDateStart: [
            { required: true, message: '请选择开始日期', trigger: 'blur' }
          ],
          sendDateEnd: [
            { required: true, message: '请选择结束日期', trigger: 'blur' }
          ]
        },
        queryLoading: false,
        exportLoading: false
      };
    },
    created() {
      this.reset();
    },
    methods: {
      reset() {
        const today = new Date();
        const todayStr =
          today.getFullYear() +
          '-' +
          String(today.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(today.getDate()).padStart(2, '0');
        const last7DaysStart = new Date(
          today.getTime() - 6 * 24 * 60 * 60 * 1000
        );
        const last7DaysStartTime =
          last7DaysStart.getFullYear() +
          '-' +
          String(last7DaysStart.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(last7DaysStart.getDate()).padStart(2, '0');
        this.form = {
          sendDateStart: last7DaysStartTime,
          sendDateEnd: todayStr,
          state: '',
          deptName: '',
          varietieName: '',
          supplierName: ''
        };
      },
      handleSearch() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const { sendDateStart, sendDateEnd } = this.form;
            if (new Date(sendDateStart) > new Date(sendDateEnd)) {
              this.$message.error('开始日期不能晚于结束日期');
              return;
            }
            this.$emit('search', this.form);
          }
        });
      },
      handleReset() {
        this.reset();
        this.$refs.form?.resetFields();
        this.$emit('search', this.form);
      },
      handleExport() {
        this.$emit('export', this.form);
      }
    }
  };
</script>
<style scoped lang="scss">
  .yb-query-filter {
    margin-bottom: -8px;
  }
</style>
