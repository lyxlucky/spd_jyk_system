<template>
  <el-form
    size="small"
    class="ele-form-search no-move-sell-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="10" type="flex" align="middle" class="search-row">
      <el-col :span="4">
        <el-input
          v-model="where.varietie"
          clearable
          placeholder="请输入品种编码/品种全称进行搜索"
        />
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="where.supplierName"
          clearable
          placeholder="请输入供应商名称进行搜索"
        />
      </el-col>
      <el-col :span="3">
        <el-input v-model="where.batch" clearable placeholder="请输入生产批号进行搜索" />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="where.specifications"
          clearable
          placeholder="请输入规格型号进行搜索"
        />
      </el-col>
      <el-col :span="3">
        <el-input v-model="where.remark" clearable placeholder="请输入备注内容" />
      </el-col>
      <el-col :span="2">
        <el-select v-model="where.centralPosition" style="width: 100%">
          <el-option label="全部" value="0" />
          <el-option label="中心库" value="1" />
          <el-option label="科室" value="2" />
        </el-select>
      </el-col>
      <el-col :span="3" class="stock-day-col">
        <span class="label-inline">在库天数大于：</span>
        <el-input v-model="where.upStockDay" type="number" clearable placeholder="" />
      </el-col>
      <el-col :span="5" class="btn-col">
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button type="primary" plain :loading="notifying" @click="$emit('notify')">
          通知供应商
        </el-button>
        <el-button
          v-permission="'export-NoMoveSellDc'"
          type="primary"
          plain
          :loading="exporting"
          @click="$emit('export')"
        >
          导出
        </el-button>
        <el-upload
          class="inline-upload"
          :action="importUrl"
          name="file"
          accept=".xlsx,.xls"
          :show-file-list="false"
          :headers="uploadHeaders"
          :on-success="onImportOk"
          :on-error="onImportErr"
        >
          <el-button type="primary" plain>导入备注</el-button>
        </el-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Message } from 'element-ui';
import { API_BASE_URL, TOKEN_HEADER_NAME } from '@/config/setting';
import { getToken } from '@/utils/token-util';

export default {
  props: {
    exporting: { type: Boolean, default: false },
    notifying: { type: Boolean, default: false }
  },
  data() {
    return {
      where: {
        varietie: '',
        supplierName: '',
        batch: '',
        specifications: '',
        remark: '',
        centralPosition: '0',
        upStockDay: ''
      }
    };
  },
  computed: {
    uploadHeaders() {
      const t = getToken();
      return t ? { [TOKEN_HEADER_NAME]: t } : {};
    },
    importUrl() {
      const t = encodeURIComponent(getToken() || '');
      const base = (API_BASE_URL || '').replace(/\/$/, '');
      return `${base}/VarietieBasicInfo/ImpStockRemark?Token=${t}`;
    }
  },
  methods: {
    getWhere() {
      return { ...this.where };
    },
    search() {
      this.$emit('search', this.getWhere());
    },
    onImportOk(res) {
      if (res?.code == 301) {
        Message.error(res.msg || '登录失效');
        return;
      }
      Message.success(res?.msg || '导入完成');
      this.$emit('search', this.getWhere());
    },
    onImportErr() {
      Message.error('导入失败');
    }
  }
};
</script>

<style scoped>
.no-move-sell-search {
  margin-bottom: 10px;
}
.search-row {
  flex-wrap: wrap;
}
.stock-day-col {
  display: flex;
  align-items: center;
}
.label-inline {
  white-space: nowrap;
  font-size: 13px;
  margin-right: 4px;
  color: #606266;
}
.btn-col .el-button,
.btn-col .inline-upload {
  margin-right: 6px;
  margin-bottom: 4px;
}
.inline-upload {
  display: inline-block;
}
</style>
