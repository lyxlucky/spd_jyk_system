<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-form-item label="品种">
          <el-input
            v-model="where.varietie"
            clearable
            placeholder="编码/全称"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="where.supplierName"
            clearable
            placeholder="供应商名称"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="生产批号">
          <el-input
            v-model="where.batch"
            clearable
            placeholder="生产批号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.specifications"
            clearable
            placeholder="规格型号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="where.remark"
            clearable
            placeholder="备注内容"
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="库存位置">
          <el-select v-model="where.centralPosition" style="width: 90px">
            <el-option label="全部" value="0" />
            <el-option label="中心库" value="1" />
            <el-option label="科室" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="在库天数">
          <el-input
            v-model="where.upStockDay"
            type="number"
            clearable
            placeholder="大于"
            style="width: 80px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button type="info" :loading="notifying" @click="$emit('notify')">通知供应商</el-button>
          <el-button
            v-permission="'export-NoMoveSellDc'"
            type="success"
            icon="el-icon-download"
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
            <el-button type="warning" plain>导入备注</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
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
.inline-upload {
  display: inline-block;
  margin-left: 6px;
}
</style>
