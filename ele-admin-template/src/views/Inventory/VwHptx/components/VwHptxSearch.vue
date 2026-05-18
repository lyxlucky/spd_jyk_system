<template>
  <div class="vwhptx-search">
    <el-form size="mini" label-width="100px" @submit.native.prevent>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="品种编码/名称">
            <el-input v-model="where.VARIETIE_NAME" clearable placeholder="请输入品种编码或名称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="规格型号">
            <el-input v-model="where.SPECIFICATION_OR_TYPE" clearable placeholder="请输入规格型号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="供应商">
            <el-input v-model="where.SUPPLIER_NAME" clearable placeholder="请输入供应商" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="注册证号">
            <el-input v-model="where.APPROVAL_NUMBER" clearable placeholder="请输入注册证号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="产地">
            <el-input v-model="where.MANUFACTURING_ENT_NAME" clearable placeholder="请输入产地" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="批号">
            <el-input v-model="where.BATCH" clearable placeholder="请输入批号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="收货单号">
            <el-input v-model="where.RkOrder" clearable placeholder="请输入收货单号" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="入库时间">
            <div class="range-inputs">
              <el-date-picker
                v-model="where.start"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="yyyy-MM-dd"
                style="width: 100%"
              />
              <span class="range-split">至</span>
              <el-date-picker
                v-model="where.end"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="yyyy-MM-dd"
                style="width: 100%"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="月结月份">
            <el-date-picker
              v-model="where.HPTX_MONTH"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择月结月份"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="入库类型">
            <el-select v-model="where.ORDER_JS_TYPE" clearable placeholder="全部入库类型" style="width: 100%">
              <el-option
                v-for="item in orderJsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="发票签收">
            <el-select
              v-model="where.FP_QS_STATE"
              clearable
              placeholder="全部"
              style="width: 100%"
              @change="$emit('fpqs-change')"
            >
              <el-option label="全部" value="" />
              <el-option label="已签收" value="1" />
              <el-option label="未签收" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="action-row">
      <el-button type="primary" size="mini" icon="el-icon-search" @click="$emit('search')">查询</el-button>
      <el-button
        v-permission="'export-VwHptx-hpdc'"
        size="mini"
        :loading="exporting"
        @click="$emit('export')"
      >导出</el-button>
      <el-button
        v-permission="'export-VwHptx-hphzdc'"
        size="mini"
        :loading="exportingCollect"
        @click="$emit('export-collect')"
      >导出汇总</el-button>
      <el-button
        v-permission="'export-VwHptx-hphzdc2'"
        size="mini"
        :loading="exportingCollect2"
        @click="$emit('export-collect2')"
      >导出汇总2</el-button>
      <el-button size="mini" @click="$emit('edit-invoice')">修改发票</el-button>
      <el-button size="mini" @click="$emit('receipt', 1)">签收发票</el-button>
      <el-button size="mini" type="danger" @click="$emit('receipt', 0)">取消签收</el-button>
      <el-button size="mini" @click="$emit('edit-month')">修改月份</el-button>
      <el-button size="mini" @click="$emit('edit-order-type')">修改入库类型</el-button>
      <el-button size="mini" type="danger" @click="$emit('delete')">删除</el-button>
    </div>
  </div>
</template>

<script>
import { ORDER_JS_TYPE_OPTIONS } from '../utils';

const defaultWhere = () => ({
  VARIETIE_NAME: '',
  SPECIFICATION_OR_TYPE: '',
  SUPPLIER_NAME: '',
  APPROVAL_NUMBER: '',
  MANUFACTURING_ENT_NAME: '',
  BATCH: '',
  RkOrder: '',
  start: '',
  end: '',
  HPTX_MONTH: '',
  ORDER_JS_TYPE: '',
  FP_QS_STATE: ''
});

export default {
  name: 'VwHptxSearch',
  props: {
    exporting: Boolean,
    exportingCollect: Boolean,
    exportingCollect2: Boolean
  },
  data() {
    return {
      where: defaultWhere(),
      orderJsTypeOptions: ORDER_JS_TYPE_OPTIONS
    };
  },
  methods: {
    getWhere() {
      return { ...this.where };
    }
  }
};
</script>

<style scoped>
.vwhptx-search .range-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
}
.vwhptx-search .range-split {
  flex-shrink: 0;
  color: #666;
}
.vwhptx-search .action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 8px;
  margin-bottom: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>
