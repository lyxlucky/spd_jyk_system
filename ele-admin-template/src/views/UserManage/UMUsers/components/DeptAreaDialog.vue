<template>
  <el-dialog :title="`分配科室库区 - ${userName}`" :visible.sync="dialogVisible" width="800px" top="8vh" append-to-body :close-on-click-modal="false" @open="loadData">
    <div v-loading="dataLoading" class="um-dialog-body">
    <el-table ref="table" :data="regionList" size="mini" border height="420" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="45" align="center" class-name="um-checkbox-col" />
      <el-table-column prop="DEPT_TWO_NAME" label="科室名称" min-width="160" />
      <el-table-column prop="REGION_NAME" label="库区名称" min-width="160" />
    </el-table>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getDeptTwoRegion,
  getDeptTwoRegionByUserID,
  addDeptTwoRegion
} from '@/api/UserManage/UMUsers';

export default {
  name: 'DeptAreaDialog',
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
      regionList: [],
      selectedCodes: []
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
      this.regionList = [];
      this.selectedCodes = [];
      try {
        const [allRes, userRes] = await Promise.all([
          getDeptTwoRegion(this.userId),
          getDeptTwoRegionByUserID(this.userId)
        ]);
        this.regionList = allRes.data || [];
        const assigned = (userRes.result || []).map((item) =>
          String(item.DEPT_TWO_REGION_CODE ?? item.REGION_CODE)
        );
        this.$nextTick(() => {
          this.regionList.forEach((row) => {
            if (assigned.includes(String(row.REGION_CODE))) {
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
      this.selectedCodes = (rows || []).map((r) => r.REGION_CODE);
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        await addDeptTwoRegion(this.userId, this.selectedCodes);
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
