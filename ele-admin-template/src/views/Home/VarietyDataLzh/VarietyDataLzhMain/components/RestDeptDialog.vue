<template>
  <el-dialog
    :title="`授权品种(${varietyCodeNew || varietieCode || ''})`"
    :visible="visible"
    width="1100px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
    @open="onOpen"
  >
    <el-row :gutter="12">
      <el-col :span="9">
        <div class="panel-title">可授权科室</div>
        <div class="toolbar">
          <el-input
            v-model="leftKeyword"
            size="mini"
            clearable
            placeholder="科室名称"
            style="width: 160px"
            @keyup.enter.native="loadLeft"
          />
          <el-button size="mini" type="primary" @click="loadLeft">查询</el-button>
          <el-button size="mini" type="success" :loading="saving" @click="authorize(1)">
            授权科室
          </el-button>
        </div>
        <el-table
          ref="leftTable"
          v-loading="leftLoading"
          :data="leftList"
          height="480"
          size="mini"
          border
          @selection-change="(rows) => (leftSel = rows)"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column prop="DEPT_TWO_NAME" label="科室名称" min-width="140" show-overflow-tooltip />
        </el-table>
      </el-col>
      <el-col :span="15">
        <div class="panel-title">已授权科室</div>
        <div class="toolbar">
          <el-input
            v-model="rightKeyword"
            size="mini"
            clearable
            placeholder="科室名称"
            style="width: 160px"
            @keyup.enter.native="loadRight"
          />
          <el-button size="mini" type="primary" @click="loadRight">查询</el-button>
          <el-button size="mini" type="danger" plain :loading="saving" @click="authorize(0)">
            取消授权
          </el-button>
        </div>
        <el-table
          ref="rightTable"
          v-loading="rightLoading"
          :data="rightList"
          height="480"
          size="mini"
          border
          @selection-change="(rows) => (rightSel = rows)"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column prop="DEPT_TWO_NAME" label="科室名称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="DEPT_TWO_CODE" label="科室编码" min-width="120" show-overflow-tooltip />
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getVarAccredDeptNotIn,
  GetdeptVarAccredit,
  AddDeptVarAccredit
} from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'RestDeptDialog',
  props: {
    visible: Boolean,
    varietieCode: { type: String, default: '' },
    varietyCodeNew: { type: String, default: '' }
  },
  data() {
    return {
      leftKeyword: '',
      rightKeyword: '',
      leftList: [],
      rightList: [],
      leftSel: [],
      rightSel: [],
      leftLoading: false,
      rightLoading: false,
      saving: false
    };
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    onOpen() {
      this.leftKeyword = '';
      this.rightKeyword = '';
      this.loadLeft();
      this.loadRight();
    },
    async loadLeft() {
      if (!this.varietieCode) return;
      this.leftLoading = true;
      try {
        const res = await getVarAccredDeptNotIn({
          varietieCode: this.varietieCode,
          deptName: this.leftKeyword
        });
        this.leftList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.leftList = [];
      } finally {
        this.leftLoading = false;
      }
    },
    async loadRight() {
      if (!this.varietieCode) return;
      this.rightLoading = true;
      try {
        const res = await GetdeptVarAccredit({
          varietieCode: this.varietieCode,
          deptName: this.rightKeyword
        });
        this.rightList = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.rightList = [];
      } finally {
        this.rightLoading = false;
      }
    },
    nickname() {
      return (
        this.$store.state.user?.info?.Nickname ||
        this.$store.state.user?.info?.nickname ||
        this.$store.state.user?.info?.UserName ||
        ''
      );
    },
    async authorize(type) {
      const rows = type === 1 ? this.leftSel : this.rightSel;
      if (!rows.length) {
        this.$message.warning('请选择授权科室');
        return;
      }
      const payload = rows.map((r) => ({
        DEPT_TWO_CODE: r.DEPT_TWO_CODE,
        VARIETIE_CODE: this.varietieCode,
        CREATE_MAN: this.nickname()
      }));
      this.saving = true;
      try {
        const res = await AddDeptVarAccredit(payload, type);
        this.$message.success(res.msg || '保存成功');
        await Promise.all([this.loadLeft(), this.loadRight()]);
      } catch (e) {
        this.$message.error(e.message || '操作失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.panel-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  align-items: center;
}
</style>
