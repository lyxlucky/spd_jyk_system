<template>
  <el-dialog title="备注" :visible.sync="innerVisible" width="600px" append-to-body @closed="remark = ''">
    <el-input v-model="remark" type="textarea" :rows="12" placeholder="请输入备注" />
    <div slot="footer">
      <el-button size="small" @click="innerVisible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="loading" @click="submit">发送</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateOrInsertWxtVarInfo } from '@/api/Home/VarietyDataLzhAudit';

export default {
  name: 'VarietyAuditBdSendDialog',
  props: {
    visible: { type: Boolean, default: false },
    rows: { type: Array, default: () => [] }
  },
  data() {
    return {
      remark: '',
      loading: false
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    async submit() {
      if (!this.rows.length) {
        this.$message.warning('请至少选中一行数据');
        return;
      }
      this.loading = true;
      try {
        const payload = this.rows.map((row) => ({ ID: row.ID }));
        const res = await updateOrInsertWxtVarInfo(payload, this.remark);
        this.$alert(res.msg || '操作完成', '提示');
        this.innerVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '发送失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
