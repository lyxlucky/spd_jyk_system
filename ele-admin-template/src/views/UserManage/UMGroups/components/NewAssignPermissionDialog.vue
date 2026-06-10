<template>
  <el-dialog
    :title="`新分配权限 - ${groupName}`"
    :visible.sync="dialogVisible"
    width="520px"
    append-to-body
    :close-on-click-modal="false"
    @open="loadData"
    @closed="resetState"
  >
    <div v-loading="dataLoading" class="umg-tree-wrap">
      <el-scrollbar style="height: 420px" wrap-style="overflow-x: hidden;">
        <el-tree
          ref="tree"
          show-checkbox
          node-key="ID"
          :data="treeData"
          :props="{ label: 'label', children: 'children' }"
          :default-expand-all="true"
        />
      </el-scrollbar>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  correlationGroupsPermissions,
  getPermissionListByGroupsID,
  getPermissionListByTree
} from '@/api/UserManage/UMGroups';
import { mapPermissionTree } from '../utils';

export default {
  name: 'NewAssignPermissionDialog',
  props: {
    visible: Boolean,
    groupId: [Number, String],
    groupName: String
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      submitting: false,
      treeData: []
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
    resetState() {
      this.treeData = [];
    },
    async loadData() {
      if (!this.groupId) return;
      this.dataLoading = true;
      this.treeData = [];
      try {
        const [treeRes, assignedRes] = await Promise.all([
          getPermissionListByTree(),
          getPermissionListByGroupsID(this.groupId)
        ]);
        this.treeData = mapPermissionTree(treeRes.result || []);
        const keys = (assignedRes.result || []).map((item) => item.ID);
        this.$nextTick(() => {
          this.$refs.tree?.setCheckedKeys(keys);
        });
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.dialogVisible = false;
      } finally {
        this.dataLoading = false;
      }
    },
    collectCheckedIds() {
      const tree = this.$refs.tree;
      if (!tree) return [];
      return tree.getCheckedKeys().concat(tree.getHalfCheckedKeys());
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        const ok = await correlationGroupsPermissions(this.groupId, this.collectCheckedIds());
        if (ok === true || ok === 'true') {
          this.$message.success('提交成功');
          this.dialogVisible = false;
          this.$emit('success');
        } else {
          this.$message.error('提交失败');
        }
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.umg-tree-wrap {
  min-height: 420px;
}
</style>
