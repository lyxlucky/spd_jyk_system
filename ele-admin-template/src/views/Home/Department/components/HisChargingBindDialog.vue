<template>
  <el-dialog custom-class="legacy-layer-dialog" title="关联计费科室" :visible.sync="visible" width="480px" append-to-body @closed="onClosed">
    <div v-loading="listLoading" class="dialog-form-wrap" element-loading-text="加载中...">
      <el-form label-width="120px" size="small">
        <el-form-item label="所属一级科室">
          <span>{{ deptOneName }}</span>
        </el-form-item>
        <el-form-item label="计费科室" required>
          <el-select v-model="chargingDeptId" filterable placeholder="请选择" style="width: 100%" :disabled="listLoading">
            <el-option v-for="item in options" :key="item.Id" :label="item.Charging_Dept_Name" :value="String(item.Id)" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="footer-center">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="loading" :disabled="listLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';

export default {
  name: 'HisChargingBindDialog',
  data() {
    return {
      visible: false,
      listLoading: false,
      loading: false,
      deptOneCode: '',
      deptOneName: '',
      chargingDeptId: '',
      options: []
    };
  },
  methods: {
    /** 先弹出再拉计费科室列表（与旧 layer.open 后 ajax 一致） */
    async open(deptOneCode, deptOneName) {
      this.deptOneCode = deptOneCode;
      this.deptOneName = deptOneName;
      this.chargingDeptId = '';
      this.options = [];
      this.visible = true;
      this.listLoading = true;
      try {
        this.options = await api.loadChargingDepts();
      } catch (e) {
        Message.error(e.message || '加载计费科室失败');
        this.visible = false;
      } finally {
        this.listLoading = false;
      }
    },
    onClosed() {
      this.listLoading = false;
      this.options = [];
      this.chargingDeptId = '';
    },
    async submit() {
      if (!this.chargingDeptId) {
        Message.warning('请选择计费科室');
        return;
      }
      this.loading = true;
      try {
        await api.bindChargingDept(this.chargingDeptId, this.deptOneCode, this.deptOneName);
        Message.success('添加成功');
        this.visible = false;
        this.$emit('saved');
      } catch (e) {
        Message.error(e.message || '关联失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.dialog-form-wrap {
  min-height: 80px;
}
.footer-center {
  text-align: center;
}
.footer-center .el-button {
  margin: 0 10px;
}
</style>

<style>
.legacy-layer-dialog .el-dialog__body {
  padding: 12px 16px 8px;
  background: #fafafa;
}
</style>
