<template>
  <el-dialog
    :title="`新分配权限 - ${groupName}`"
    :visible.sync="dialogVisible"
    width="640px"
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
        >
          <span slot-scope="{ data }" class="umg-tree-node">
            <el-tag
              v-if="data.permissionType === 'route'"
              size="mini"
              type="primary"
              :disable-transitions="true"
            >
              目录
            </el-tag>
            <el-tag
              v-else-if="data.permissionType === 'button'"
              size="mini"
              type="warning"
              :disable-transitions="true"
            >
              按钮
            </el-tag>
            <el-tag v-else size="mini" type="success" :disable-transitions="true">
              菜单
            </el-tag>
            <span class="umg-tree-label">{{ data.label }}</span>
            <span v-if="data.Permission_Url" class="umg-tree-url">
              {{ data.Permission_Url }}
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="dataLoading"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  correlationGroupsPermissions,
  getPermissionList,
  getPermissionListByGroupsID,
  getPermissionListByTree
} from '@/api/UserManage/UMGroups';
import { buildAssignPermissionTree } from '../utils';

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
    collectAssignableIds(keys) {
      const idSet = new Set();
      const walk = (nodes) => {
        (nodes || []).forEach((node) => {
          if (
            node.permissionType !== 'route' &&
            node.ID != null &&
            !String(node.ID).startsWith('__')
          ) {
            idSet.add(node.ID);
          }
          walk(node.children);
        });
      };
      walk(this.treeData);
      return (keys || []).filter((id) => idSet.has(id));
    },
    async loadData() {
      if (!this.groupId) return;
      this.dataLoading = true;
      this.treeData = [];
      try {
        const [treeRes, listRes, assignedRes] = await Promise.all([
          getPermissionListByTree(),
          getPermissionList(),
          getPermissionListByGroupsID(this.groupId)
        ]);
        this.treeData = buildAssignPermissionTree(
          treeRes.result || [],
          listRes.result || []
        );
        const keys = this.collectAssignableIds(
          (assignedRes.result || []).map((item) => item.ID)
        );
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
      const keys = tree.getCheckedKeys().concat(tree.getHalfCheckedKeys());
      return this.collectAssignableIds(keys);
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        const ok = await correlationGroupsPermissions(
          this.groupId,
          this.collectCheckedIds()
        );
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
.umg-tree-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: calc(100% - 24px);
}
.umg-tree-label {
  flex-shrink: 0;
}
.umg-tree-url {
  color: #909399;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
