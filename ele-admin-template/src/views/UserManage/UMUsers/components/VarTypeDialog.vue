<template>
  <el-dialog :title="`分配耗材类别 - ${userName}`" :visible.sync="dialogVisible" width="700px" top="8vh" append-to-body :close-on-click-modal="false" @open="loadData">
    <div v-loading="dataLoading" class="um-dialog-body">
    <el-table ref="table" :data="typeList" size="mini" border height="420" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45" align="center" class-name="um-checkbox-col" />
      <el-table-column prop="CLASSIFIC_NAME" label="类别名称" min-width="200" />
    </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUMUvarType, getUvarTypeByUserID, correlationUserVarType } from '@/api/UserManage/UMUsers';

export default {
  name: 'VarTypeDialog',
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
      typeList: [],
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
      this.typeList = [];
      this.selectedIds = [];
      try {
        const [allRes, userRes] = await Promise.all([
          getUMUvarType(),
          getUvarTypeByUserID(this.userId)
        ]);
        this.typeList = allRes.result || [];
        const assigned = (userRes.result || []).map((item) => item.VAR_TYPE_ID);
        this.$nextTick(() => {
          this.typeList.forEach((row) => {
            if (assigned.includes(row.VAR_TYPE_ID)) {
              this.$refs.table?.toggleRowSelection(row, true);
            }
          });
        });
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.dataLoading = false;
      }
    },
    onSelectionChange(rows) {
      this.selectedIds = (rows || []).map((r) => r.VAR_TYPE_ID);
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        await correlationUserVarType(this.userId, this.selectedIds);
        this.$message.success('分配成功');
        this.dialogVisible = false;
        this.$emit('success');
      } catch (e) {
        this.$message.error(e.message || '分配失败');
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
