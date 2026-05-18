<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="innerVisible"
    width="1200px"
    top="4vh"
    append-to-body
    :destroy-on-close="true"
    @open="onOpen"
    @closed="onClosed"
  >
    <div class="udi-toolbar">
      <el-input
        v-model="query.serialNumber"
        size="small"
        clearable
        placeholder="UDI"
        style="width: 160px"
        @keyup.enter.native="load(true)"
      />
      <el-input
        v-model="query.createMan"
        size="small"
        clearable
        placeholder="创建人"
        style="width: 160px"
        @keyup.enter.native="load(true)"
      />
      <el-button size="small" type="primary" icon="el-icon-search" :loading="loading" @click="load(true)">查询</el-button>
      <el-button size="small" type="danger" :disabled="!selection.length" :loading="deleting" @click="onDelete">删除</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="rows"
      border
      stripe
      size="small"
      height="62vh"
      @selection-change="selection = $event"
    >
      <el-table-column type="selection" width="48" align="center" />
      <el-table-column type="index" label="序号" width="56" align="center" />
      <el-table-column prop="BATCH_ID" label="批号ID" width="100" show-overflow-tooltip />
      <el-table-column prop="SERIAL_NUMBER" label="UDI" min-width="200" show-overflow-tooltip />
      <el-table-column prop="QTY" label="数量" width="72" align="center" />
      <el-table-column label="创建时间" width="160" show-overflow-tooltip>
        <template slot-scope="{ row }">{{ fmtDateTime(row.CREATE_TIME) }}</template>
      </el-table-column>
      <el-table-column prop="CREATE_MAN" label="创建人" width="100" show-overflow-tooltip />
      <el-table-column label="是否制包" width="88" align="center">
        <template slot-scope="{ row }">{{ fmtMakeDef(row.IS_MAKE_DEF) }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total > pageSize"
      class="pager"
      small
      layout="total, prev, pager, next, sizes"
      :total="total"
      :page-size.sync="pageSize"
      :current-page.sync="page"
      :page-sizes="[30, 50, 100, 200]"
      @size-change="load(true)"
      @current-change="load"
    />
  </el-dialog>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import * as api from '@/api/Inventory/CentreBankWatchUdi';

function fmtDateTime(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 19);
}

function fmtMakeDef(v) {
  if (v == 0 || v === '0') return '未制包';
  if (v == 1 || v === '1') return '已制包';
  return v ?? '';
}

export default {
  name: 'CentreBankWatchUdiDialog',
  props: {
    visible: Boolean,
    /** 批号/明细 ID，对应接口 BATCH_ID */
    batchId: { type: [String, Number], default: '' },
    title: { type: String, default: '' }
  },
  data() {
    return {
      innerVisible: false,
      loading: false,
      deleting: false,
      query: { serialNumber: '', createMan: '' },
      rows: [],
      selection: [],
      page: 1,
      pageSize: 100,
      total: 0
    };
  },
  computed: {
    dialogTitle() {
      if (this.title) return this.title;
      const id = this.batchId != null && this.batchId !== '' ? this.batchId : '';
      return id ? `${id} 查看UDI` : '查看UDI';
    }
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    fmtDateTime,
    fmtMakeDef,
    onOpen() {
      if (!this.batchId) {
        Message.warning('缺少批号标识，无法查询 UDI');
        return;
      }
      this.load(true);
    },
    onClosed() {
      this.query = { serialNumber: '', createMan: '' };
      this.rows = [];
      this.selection = [];
      this.page = 1;
      this.total = 0;
    },
    async load(resetPage) {
      if (!this.batchId) return;
      if (resetPage) this.page = 1;
      this.loading = true;
      try {
        const res = await api.getShUdiData({
          batchId: String(this.batchId),
          serialNumber: this.query.serialNumber,
          createMan: this.query.createMan,
          page: this.page,
          size: this.pageSize
        });
        this.rows = res.result || [];
        this.total = res.total ?? this.rows.length;
      } catch (e) {
        Message.error(e.message || '加载 UDI 失败');
        this.rows = [];
        this.total = 0;
      } finally {
        this.loading = false;
      }
    },
    async onDelete() {
      if (!this.selection.length) {
        Message.warning('请选中要删除的数据');
        return;
      }
      try {
        await MessageBox.confirm('确认要删除此数据吗？', '提示', { type: 'warning' });
        const ids = this.selection.map((r) => r.ID).filter(Boolean).join(',');
        this.deleting = true;
        await api.delShUdiData(ids);
        Message.success('删除成功');
        await this.load();
        this.$emit('deleted');
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '删除失败');
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>

<style scoped>
.udi-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
  align-items: center;
}
.pager {
  margin-top: 10px;
  text-align: right;
}
</style>
