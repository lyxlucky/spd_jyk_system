<template>
  <el-dialog
    title="请输入计划单号明细"
    :visible="visible"
    width="450px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-form label-width="120px" size="small">
      <el-form-item label="计划单号明细id">
        <el-input v-model="planId" placeholder="请输入计划单号明细id" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { glDeptPlanJp } from '@/api/Inventory/PickingMnagement';
import { unwrapData, isOkCode } from '../utils';

export default {
  name: 'LinkPlanDialog',
  props: {
    visible: Boolean,
    detailId: { type: [String, Number], default: '' }
  },
  data() {
    return {
      planId: '',
      loading: false
    };
  },
  watch: {
    visible(val) {
      if (val) this.planId = '';
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    handleSubmit() {
      if (!this.planId) {
        this.$message.warning('请输入计划单号明细id');
        return;
      }
      this.loading = true;
      glDeptPlanJp(this.detailId, this.planId)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code) || data?.msg) {
            this.$message.success(data.msg || '操作成功');
            this.updateVisible(false);
            this.$emit('success');
          } else {
            this.$message.error(data?.msg || '关联失败');
          }
        })
        .catch(() => {
          this.$message.error('关联失败');
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
