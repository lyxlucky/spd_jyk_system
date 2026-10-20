<template>
  <el-dialog
    :visible.sync="visibleSync"
    :title="title || '耗材使用明细'"
    width="1180px"
    append-to-body
    :close-on-click-modal="true"
    @open="onOpen"
  >
    <div class="material-detail-toolbar">
      <span class="material-detail-selection">已选 {{ selection.length }} 条</span>
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        :loading="deleting"
        :disabled="!selection.length"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </div>
    <ele-pro-table
      ref="table"
      class="data-table"
      size="mini"
      border
      stripe
      row-key="ID"
      :toolbar="false"
      :header-overflow-hidden="false"
      :height="tableHeight"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :page-size="50"
      :page-sizes="[10, 50, 100, 150, 200, 300, 999999]"
      cache-key="WarehouseAreaThreeInventoryDetailTable"
    >
      <template v-slot:materialDetailAction="{ row }">
        <el-link type="danger" :underline="false" :disabled="deleting" @click.stop="handleDelete(row)">
          删除
        </el-link>
      </template>
    </ele-pro-table>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getMaterialDetailColumns } from '../columns';
import { deleteMaterialDetails, getMaterialDetail } from '@/api/Inventory/WarehouseAreaThreeInventory';

export default {
  name: 'MaterialDetailDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '' },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      columns: getMaterialDetailColumns(),
      tableHeight: '470px',
      selection: [],
      deleting: false
    };
  },
  computed: {
    visibleSync: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      }
    }
  },
  methods: {
    // 弹窗打开后重新加载明细表格。
    onOpen() {
      this.selection = [];
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.reload({ page: 1 });
      });
    },
    // 删除单条明细。
    async handleDelete(row) {
      await this.removeMaterialDetails([row]);
    },
    // 删除当前勾选的全部明细。
    async handleBatchDelete() {
      await this.removeMaterialDetails(this.selection);
    },
    // 统一执行软删除并在成功后刷新明细表格。
    async removeMaterialDetails(rows) {
      const ids = (rows || [])
        .map((row) => row?.ID)
        .filter((id) => id != null && String(id) !== '0');
      const uniqueIds = Array.from(new Set(ids));
      if (!uniqueIds.length) {
        Message.warning('请选择需要删除的明细');
        return;
      }

      const count = uniqueIds.length;
      const confirmText =
        count > 1
          ? `确定要批量删除选中的 ${count} 条库存明细吗？删除后不再显示。`
          : '确定要删除这条库存明细吗？删除后不再显示。';
      try {
        await this.$confirm(confirmText, '提示', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        });
        this.deleting = true;
        const res = await deleteMaterialDetails(uniqueIds, this.filters);
        Message.success(res.msg || `已删除 ${count} 条明细`);
        this.selection = [];
        this.$refs.table && this.$refs.table.reload({ page: 1 });
      } catch (e) {
        if (e === 'cancel' || e === 'close') return;
        Message.error(e.message || '删除失败');
      } finally {
        this.deleting = false;
      }
    },
    // 三级库库存流水明细表格数据源。
    async datasource({ page, limit }) {
      if (!this.filters?.AREA_CODE) {
        return { count: 0, list: [] };
      }
      try {
        const res = await getMaterialDetail(this.filters, page || 1, limit || 50);
        return { count: res.total || res.count || 0, list: res.result || [] };
      } catch (e) {
        Message.error(e.message || '查询明细失败');
        return { count: 0, list: [] };
      }
    }
  }
};
</script>

<style scoped>
.material-detail-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 8px;
}

.material-detail-selection {
  color: #606266;
  font-size: 12px;
}

:deep(.el-table th .cell) {
  white-space: nowrap;
}
</style>
