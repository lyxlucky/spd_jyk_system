<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="$emit('search')"
        @submit.native.prevent
      >
        <el-form-item label="品种">
          <el-input
            v-model="where.VARIETIE_NAME"
            clearable
            placeholder="编码/名称"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.SPECIFICATION_OR_TYPE"
            clearable
            placeholder="规格型号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input
            v-model="where.SUPPLIER_NAME"
            clearable
            placeholder="供应商"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="注册证号">
          <el-input
            v-model="where.APPROVAL_NUMBER"
            clearable
            placeholder="注册证号"
            style="width: 110px"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="where.MANUFACTURING_ENT_NAME"
            clearable
            placeholder="生产企业"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="批号">
          <el-input
            v-model="where.BATCH"
            clearable
            placeholder="批号"
            style="width: 100px"
          />
        </el-form-item>
        <br />
        <el-form-item label="收货单号">
          <el-input
            v-model="where.RkOrder"
            clearable
            placeholder="收货单号"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            v-model="where.start"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始"
            style="width: 130px"
          />
          <span class="range-split">至</span>
          <el-date-picker
            v-model="where.end"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="月结月份">
          <el-date-picker
            v-model="where.HPTX_MONTH"
            type="month"
            value-format="yyyy-MM"
            placeholder="月结月份"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="入库类型">
          <el-select
            v-model="where.ORDER_JS_TYPE"
            clearable
            placeholder="全部"
            style="width: 110px"
          >
            <el-option
              v-for="item in orderJsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发票签收">
          <el-select
            v-model="where.FP_QS_STATE"
            clearable
            placeholder="全部"
            style="width: 90px"
            @change="$emit('fpqs-change')"
          >
            <el-option label="全部" value="" />
            <el-option label="已签收" value="1" />
            <el-option label="未签收" value="0" />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="$emit('search')">查询</el-button>
          <el-button
            v-permission="'export-VwHptx-hpdc'"
            type="success"
            icon="el-icon-download"
            :loading="exporting"
            @click="$emit('export')"
          >
            导出
          </el-button>
          <el-button
            v-permission="'export-VwHptx-hphzdc'"
            :loading="exportingCollect"
            @click="$emit('export-collect')"
          >
            导出汇总
          </el-button>
          <el-button
            v-permission="'export-VwHptx-hphzdc2'"
            :loading="exportingCollect2"
            @click="$emit('export-collect2')"
          >
            导出汇总2
          </el-button>
          <el-button @click="$emit('edit-invoice')">修改发票</el-button>
          <el-button @click="$emit('receipt', 1)">签收发票</el-button>
          <el-button type="danger" @click="$emit('receipt', 0)">取消签收</el-button>
          <el-button @click="$emit('edit-month')">修改月份</el-button>
          <el-button @click="$emit('edit-order-type')">修改入库类型</el-button>
          <el-button type="danger" @click="$emit('delete')">删除</el-button>
        </el-form-item>
      </el-form>
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
.range-split {
  margin: 0 4px;
  color: #909399;
}
</style>
