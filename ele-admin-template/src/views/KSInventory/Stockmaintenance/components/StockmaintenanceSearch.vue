<template>
  <div class="stock-maintenance-search">
    <el-form size="small" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="10" class="search-row">
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
          <el-input v-model="where.position" clearable placeholder="请输入库存位置进行搜索" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="where.remark" clearable placeholder="请输入备注内容" />
        </el-col>
        <el-col :span="4">
          <span class="label-inline">所属区域：</span>
          <el-select v-model="where.upShelfState" clearable placeholder="全部" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="合格区" value="1" />
            <el-option label="普通隔离区" value="6" />
            <el-option label="不合格区" value="7" />
            <el-option label="盘损隔离区" value="8" />
            <el-option label="应急库" value="9" />
            <el-option label="拣配锁定区" value="2" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" align="middle" class="search-row second-row">
        <el-col :span="3">
          <span class="label-inline">所属库区：</span>
          <el-select v-model="where.storageId" style="width: 90px">
            <el-option label="全部" value="0" />
            <el-option label="院内" value="1" />
            <el-option label="院外" value="2" />
          </el-select>
        </el-col>
        <el-col :span="6" class="date-range-col">
          <span class="label-inline">有效到期：</span>
          <el-date-picker
            v-model="where.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 140px"
          />
          <span class="date-sep">至</span>
          <el-date-picker
            v-model="where.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 140px"
          />
        </el-col>
        <el-col :span="3" class="stock-day-col">
          <span class="label-inline">在库天数大于：</span>
          <el-input v-model="where.upStockDay" type="number" clearable style="width: 100px" />
        </el-col>
        <el-col :span="8" class="btn-col">
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          <el-button
            v-permission="'export-StockmaintenanceDc'"
            type="primary"
            plain
            :loading="exporting"
            @click="$emit('export')"
          >
            导出
          </el-button>
          <el-button type="primary" plain :loading="notifying" @click="$emit('notify')">
            通知供应商
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
        <el-col :span="5" class="summary-col">
          <span class="summary-line">
            <span class="summary-val">{{ summary.stockPosition || '' }}</span>
            <span v-if="summary.stockPosition || summary.avgday">：</span>
            <span class="summary-val">{{ summary.avgday || '' }}</span>
          </span>
          <span class="summary-hint">库存位置 ： 平均在库天数</span>
        </el-col>
      </el-row>
      <p class="page-tip">
        说明：本页面仅用于查询生产批号已过期的库存品种，包含中心库(合格库、不合格库、隔离库)和各个科室的库存效率统计，平均在库天数查询
      </p>
    </el-form>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { API_BASE_URL, TOKEN_HEADER_NAME } from '@/config/setting';
import { getToken } from '@/utils/token-util';
import { defaultStartDate, defaultEndDate } from '../utils';

export default {
  props: {
    exporting: { type: Boolean, default: false },
    notifying: { type: Boolean, default: false },
    summary: {
      type: Object,
      default: () => ({ avgday: '', stockPosition: '' })
    }
  },
  data() {
    return {
      where: {
        varietie: '',
        supplierName: '',
        batch: '',
        specifications: '',
        position: '',
        remark: '',
        upShelfState: '',
        storageId: '0',
        startDate: defaultStartDate(),
        endDate: defaultEndDate(),
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
.stock-maintenance-search {
  margin-bottom: 8px;
}
.search-row {
  margin-bottom: 8px;
}
.label-inline {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}
.date-sep {
  margin: 0 6px;
  color: #606266;
}
.date-range-col {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.stock-day-col {
  display: flex;
  align-items: center;
}
.btn-col .el-button,
.btn-col .inline-upload {
  margin-right: 6px;
  margin-bottom: 4px;
}
.inline-upload {
  display: inline-block;
}
.summary-col {
  text-align: right;
  font-size: 13px;
}
.summary-line {
  display: block;
  min-height: 20px;
}
.summary-hint {
  display: block;
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 2px;
}
.summary-val {
  color: #303133;
  font-weight: 600;
}
.page-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}
</style>
