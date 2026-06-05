<template>
  <el-dialog
    custom-class="legacy-layer-dialog"
    title="品种数据"
    :visible.sync="dialogVisible"
    width="92%"
    top="4vh"
    append-to-body
    @opened="onOpened"
    @closed="onClosed"
  >
    <el-form size="small" inline class="toolbar" @submit.native.prevent>
      <el-form-item label="品种">
        <el-input
          v-model="keyword"
          clearable
          placeholder="品种编码/名称"
          style="width: 220px"
          @keyup.enter.native="reloadTable"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reloadTable">查询</el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      height="calc(70vh - 120px)"
      size="small"
      :page-size="30"
      :page-sizes="[20, 30, 50, 100]"
    />
    <div slot="footer" class="footer-center">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="submitting" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { QueryPageLayUI } from '@/api/Home/VarietyDataLzhMain';
import { addLimitDelVar } from '@/api/Home/PrchaseDataV2';

export default {
  name: 'PickVarietyDialog',
  props: {
    visible: { type: Boolean, default: false },
    buyId: { type: [String, Number], default: '' }
  },
  data() {
    return {
      keyword: '',
      selection: [],
      submitting: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    columns() {
      return [
        { type: 'selection', columnKey: 'selection', width: 45, align: 'center' },
        { type: 'index', columnKey: 'index', label: '序号', width: 50, align: 'center' },
        { prop: 'Varietie_Code_New', label: '品种编码', width: 130, showOverflowTooltip: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 180, showOverflowTooltip: true },
        { prop: 'Specification_Or_Type', label: '型号/规格', width: 140, showOverflowTooltip: true },
        { prop: 'Unit', label: '单位', width: 60 },
        { prop: 'Price', label: '价格', width: 80 },
        { prop: 'manufacturing_ent_name', label: '生产企业', minWidth: 140, showOverflowTooltip: true }
      ];
    }
  },
  methods: {
    onOpened() {
      this.reloadTable();
    },
    onClosed() {
      this.keyword = '';
      this.selection = [];
    },
    reloadTable() {
      this.$refs.table?.reload({ page: 1 });
    },
    datasource({ page, limit, where }) {
      const w = {
        varietieCode: this.keyword || '',
        enable: '1',
        ...where
      };
      return QueryPageLayUI({ page, limit, where: w })
        .then((res) => ({
          count: res.total || 0,
          list: res.result || []
        }))
        .catch((e) => {
          Message.error(e.message || '查询失败');
          return { count: 0, list: [] };
        });
    },
    async confirm() {
      if (!this.selection.length) {
        Message.warning('请选择品种');
        return;
      }
      const codes = this.selection
        .map((r) => r.Varietie_Code)
        .filter((c) => c != null && c !== '')
        .join(',');
      if (!codes) {
        Message.warning('所选行缺少品种编码');
        return;
      }
      this.submitting = true;
      try {
        const res = await addLimitDelVar(this.buyId, codes);
        Message.success(res.msg || '添加成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        Message.error(e.message || '添加失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.toolbar {
  margin-bottom: 8px;
}
.footer-center {
  text-align: center;
}
.footer-center .el-button {
  margin: 0 10px;
}
</style>
