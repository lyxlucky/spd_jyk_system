<template>
  <el-form
    :model="form"
    ref="form"
    :inline="true"
    class="ele-form-search"
    size="mini"
    @submit.native.prevent="$emit('search')"
  >
    <el-form-item prop="DeptName">
      <el-input
        v-model="form.DeptName"
        placeholder="请输入科室名称"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="varCode">
      <el-input
        v-model="form.varCode"
        placeholder="请输入品种编码"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="varName">
      <el-input
        v-model="form.varName"
        placeholder="请输入品种名称"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="chargingCode">
      <el-input
        v-model="form.chargingCode"
        placeholder="请输入计费编码"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="spec">
      <el-input
        v-model="form.spec"
        placeholder="请输入规格型号"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="manufacter">
      <el-input
        v-model="form.manufacter"
        placeholder="请输入生产企业"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="prodRegistrationCode">
      <el-input
        v-model="form.prodRegistrationCode"
        placeholder="请输入批准文号"
        clearable
        @keyup.enter.native="$emit('search')"
      />
    </el-form-item>
    <el-form-item prop="stockZero" label="库存数量">
      <el-select v-model="form.stockZero" placeholder="库存数量筛选" clearable>
        <el-option label="全部" value="" />
        <el-option label="库存数量为零" value="1" />
        <el-option label="库存数量不为零" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item class="ele-form-actions">
      <el-button type="primary" :loading="loading" @click="$emit('search')">
        查询
      </el-button>
      <el-button type="success" :loading="exporting" @click="$emit('export')">
        导出
      </el-button>
      <el-button type="info" @click="$emit('kc-summary')">库存汇总</el-button>
    </el-form-item>
    <el-form-item>
      <el-dropdown
        split-button
        type="warning"
        size="mini"
        @click="triggerUpload"
        @command="handleUploadCommand"
      >
        上传初始化库存
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="download">
            <i class="el-icon-download" /> 下载模板
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-upload
        ref="upload"
        class="upload-hidden"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :data="uploadData"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        accept=".xlsx,.xls"
      />
    </el-form-item>
  </el-form>
</template>

<script>
  import { TOKEN_STORE_NAME, API_BASE_URL } from '@/config/setting';

  export default {
    name: 'ThirdStockQuerySearch',
    props: {
      loading: Boolean,
      exporting: Boolean
    },
    data() {
      return {
        form: {
          DeptName: '',
          varCode: '',
          varName: '',
          chargingCode: '',
          spec: '',
          manufacter: '',
          prodRegistrationCode: '',
          stockZero: ''
        },
        uploadUrl: API_BASE_URL + '/lhfy/uploadThirdInventory',
        uploadHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('token') || ''
        },
        uploadData: {
          Token: sessionStorage.getItem(TOKEN_STORE_NAME)
        }
      };
    },
    methods: {
      getWhere() {
        return { ...this.form };
      },
      triggerUpload() {
        const uploadInner = this.$refs.upload?.$refs['upload-inner'];
        if (uploadInner) {
          uploadInner.handleClick();
        }
      },
      handleUploadCommand(command) {
        if (command === 'download') {
          this.downloadTemplate();
        }
      },
      async downloadTemplate() {
        try {
          const ExcelJS = (await import('exceljs')).default;
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet('三级库初始化库存');
          sheet.columns = [
            { width: 14 },
            { width: 14 },
            { width: 10 },
            { width: 10 },
            { width: 16 },
            { width: 12 }
          ];
          const thinBorder = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          };
          const headerRow = sheet.addRow([
            '科室编码',
            '计费编码',
            '数量',
            '类型',
            '定数包号',
            '入库类型'
          ]);
          headerRow.height = 22;
          headerRow.eachCell((cell) => {
            cell.font = { bold: true, size: 10 };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFD9E1F2' }
            };
            cell.border = thinBorder;
          });
          const exampleRow = sheet.addRow([
            'D001',
            'JF001',
            '10',
            '散货',
            '-',
            '普通入库'
          ]);
          exampleRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = thinBorder;
          });
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '三级库初始化库存模板.xlsx';
          a.click();
          URL.revokeObjectURL(url);
        } catch (e) {
          this.$message.error('下载模板失败，请稍后重试');
        }
      },
      beforeUpload(file) {
        const isExcel =
          file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel';
        if (!isExcel) {
          this.$message.error('只能上传Excel文件!');
          return false;
        }
        this.$message.info(`开始上传文件: ${file.name}`);
        return true;
      },
      handleUploadSuccess(response) {
        if (response.code === 200) {
          this.$message.success('文件上传成功!');
          this.$emit('upload-success');
        } else {
          this.$message.error(`文件上传失败: ${response.msg}`);
        }
      },
      handleUploadError(err) {
        this.$message.error(`文件上传失败: ${err.msg || '未知错误'}`);
      }
    }
  };
</script>

<style lang="scss" scoped>
  :deep(.ele-form-search .el-input--mini .el-input__inner) {
    width: 140px;
  }

  .upload-hidden {
    display: none;
  }
</style>
