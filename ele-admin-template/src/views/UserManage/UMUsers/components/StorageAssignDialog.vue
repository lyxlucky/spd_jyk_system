<template>
  <el-dialog :title="`分配院区 - ${userName}`" :visible.sync="dialogVisible" width="700px" top="8vh" append-to-body :close-on-click-modal="false" @open="loadData">
    <div v-loading="dataLoading" class="um-dialog-body">
    <el-table ref="table" :data="storageList" size="mini" border height="420" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45" align="center" class-name="um-checkbox-col" />
      <el-table-column prop="Name" label="院区名称" width="180" />
      <el-table-column prop="Address" label="地址" min-width="200" show-overflow-tooltip>
        <template slot-scope="{ row }">{{ row.Address || '暂无' }}</template>
      </el-table-column>
    </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAllStorage, deliveryStorage } from '@/api/UserManage/UMUsers';

export default {
  name: 'StorageAssignDialog',
  props: {
    visible: Boolean,
    userId: [Number, String],
    userName: String
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      storageList: [],
      selectedIds: []
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    async loadData() {
      this.dataLoading = true;
      this.storageList = [];
      this.selectedIds = [];
      try {
        const res = await getAllStorage();
        this.storageList = res.data || [];
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.dataLoading = false;
      }
    },
    onSelectionChange(rows) {
      this.selectedIds = (rows || []).map((r) => r.ID);
    },
    async handleSubmit() {
      if (!this.selectedIds.length) {
        this.$message.warning('请先选择院区');
        return;
      }
      this.submitting = true;
      try {
        const res = await deliveryStorage(this.userId, this.selectedIds.join(','));
        if (res.code == 200) {
          this.$message.success('院区选择成功');
          this.dialogVisible = false;
          this.$emit('success');
        } else {
          this.$message.error(res.msg || '操作失败');
        }
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.um-dialog-body {
  min-height: 420px;
}
:deep(.um-checkbox-col .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
</style>
