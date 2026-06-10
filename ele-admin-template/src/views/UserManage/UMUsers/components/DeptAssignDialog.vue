<template>
  <el-dialog :title="`分配科室 - ${userName}`" :visible.sync="dialogVisible" width="1200px" top="5vh" append-to-body :close-on-click-modal="false" @open="initData">
    <div v-loading="dataLoading" class="um-dialog-body-lg">
    <el-row :gutter="12">
      <el-col :span="11">
        <div class="panel-title">全部科室</div>
        <el-input v-model="deptKeyword" size="mini" placeholder="搜索科室名称" clearable style="width: 220px; margin-bottom: 8px" @keyup.enter.native="loadAllDepts" />
        <el-button size="mini" type="primary" icon="el-icon-search" :loading="allDeptLoading" @click="loadAllDepts">查询</el-button>
        <div v-loading="allDeptLoading" class="dept-table-wrap">
        <el-table
          ref="allTable"
          :data="allDeptList"
          size="mini"
          border
          height="460"
          :row-class-name="allRowClass"
          @selection-change="onAllSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" class-name="um-checkbox-col" :selectable="isAllRowSelectable" />
          <el-table-column prop="Dept_Two_Name" label="科室名称" min-width="140" />
          <el-table-column label="启用状态" width="90" align="center">
            <template slot-scope="{ row }">{{ formatDeptEnable(row.Enable) }}</template>
          </el-table-column>
        </el-table>
        </div>
      </el-col>
      <el-col :span="2" class="transfer-actions">
        <el-button size="mini" @click="addSelected">添加 &gt;</el-button>
        <el-button size="mini" @click="removeSelected"> &lt; 移除</el-button>
      </el-col>
      <el-col :span="11">
        <div class="panel-title">已授权科室</div>
        <el-table
          ref="selectedTable"
          :data="selectedDeptList"
          size="mini"
          border
          height="492"
          @selection-change="onSelectedSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" class-name="um-checkbox-col" />
          <el-table-column label="序号" width="90" align="center">
            <template slot-scope="{ row }">
              <el-input-number v-model="row.Priority" :min="1" :controls="false" size="mini" style="width: 70px" />
            </template>
          </el-table-column>
          <el-table-column prop="Dept_Two_Name" label="科室名称" min-width="140" />
          <el-table-column label="启用状态" width="90" align="center">
            <template slot-scope="{ row }">{{ formatDeptEnable(row.Enable) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" size="mini" @click="removeOne(row.Dept_Two_Code)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" :disabled="dataLoading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getDeptTwoByUserID,
  getDeptListPage,
  correlationUserDept
} from '@/api/UserManage/UMUsers';
import { formatDeptEnable, normalizePriority } from '../utils';

export default {
  name: 'DeptAssignDialog',
  props: {
    visible: Boolean,
    userId: [Number, String],
    userName: String
  },
  data() {
    return {
      dialogVisible: false,
      dataLoading: false,
      allDeptLoading: false,
      submitting: false,
      deptKeyword: '',
      allDeptList: [],
      selectedDeptList: [],
      selectedMap: {},
      allSelection: [],
      selectedSelection: []
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
    formatDeptEnable,
    async initData() {
      this.deptKeyword = '';
      this.dataLoading = true;
      this.allDeptList = [];
      this.selectedDeptList = [];
      try {
        const res = await getDeptTwoByUserID(this.userId);
        this.selectedDeptList = (res.result || []).map((item, index) => ({
          Dept_Two_Code: String(item.Dept_Two_Code),
          Dept_Two_Name: item.Dept_Two_Name,
          Enable: item.Enable,
          Priority: normalizePriority(item.Priority, index + 1)
        }));
        this.rebuildMap();
        await this.loadAllDepts();
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.dataLoading = false;
      }
    },
    rebuildMap() {
      this.selectedMap = {};
      this.selectedDeptList.forEach((item) => {
        this.selectedMap[item.Dept_Two_Code] = true;
      });
    },
    async loadAllDepts() {
      this.allDeptLoading = true;
      try {
        const res = await getDeptListPage(this.deptKeyword, this.userId, 'asc');
        this.allDeptList = (res.result || []).map((item) => ({
          ...item,
          Dept_Two_Code: String(item.Dept_Two_Code)
        }));
      } catch (e) {
        this.$message.error(e.message || '加载科室失败');
      } finally {
        this.allDeptLoading = false;
      }
    },
    isAllRowSelectable(row) {
      return !this.selectedMap[row.Dept_Two_Code];
    },
    allRowClass({ row }) {
      return this.selectedMap[row.Dept_Two_Code] ? 'assigned-row' : '';
    },
    onAllSelectionChange(rows) {
      this.allSelection = rows || [];
    },
    onSelectedSelectionChange(rows) {
      this.selectedSelection = rows || [];
    },
    getNextPriority() {
      if (!this.selectedDeptList.length) return 1;
      return Math.max(...this.selectedDeptList.map((d) => normalizePriority(d.Priority, 1))) + 1;
    },
    addSelected() {
      if (!this.allSelection.length) {
        this.$message.warning('请选择未授权的科室');
        return;
      }
      let added = 0;
      this.allSelection.forEach((row) => {
        const code = String(row.Dept_Two_Code);
        if (this.selectedMap[code]) return;
        this.selectedDeptList.push({
          Dept_Two_Code: code,
          Dept_Two_Name: row.Dept_Two_Name,
          Enable: row.Enable,
          Priority: this.getNextPriority()
        });
        this.selectedMap[code] = true;
        added += 1;
      });
      if (!added) {
        this.$message.warning('请选择未授权的科室');
      }
    },
    removeSelected() {
      if (!this.selectedSelection.length) {
        this.$message.warning('请选择要移除的科室');
        return;
      }
      this.selectedSelection.forEach((row) => this.removeOne(row.Dept_Two_Code, true));
      this.selectedSelection = [];
    },
    removeOne(code, silent) {
      code = String(code);
      this.selectedDeptList = this.selectedDeptList.filter((item) => String(item.Dept_Two_Code) !== code);
      delete this.selectedMap[code];
      if (!silent) {
        this.loadAllDepts();
      }
    },
    async handleSubmit() {
      this.submitting = true;
      try {
        const payload = this.selectedDeptList.map((item, index) => ({
          Dept_Two_Code: String(item.Dept_Two_Code),
          Priority: normalizePriority(item.Priority, index + 1)
        }));
        await correlationUserDept(this.userId, payload);
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
.um-dialog-body-lg {
  min-height: 500px;
}
.dept-table-wrap {
  min-height: 460px;
}
.panel-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.transfer-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-top: 180px;
}
:deep(.assigned-row) {
  color: #999;
  background: #f7f7f7;
}
:deep(.um-checkbox-col .cell) {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
</style>
