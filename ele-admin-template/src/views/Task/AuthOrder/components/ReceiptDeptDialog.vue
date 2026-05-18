<template>
  <el-dialog :title="title" :visible.sync="innerVisible" width="460px" append-to-body @closed="reset">
    <el-form label-width="88px" size="small">
      <el-form-item label="结算科室">
        <el-input :value="deptName" readonly placeholder="请选择科室" style="width: 220px" />
        <el-button size="small" type="primary" style="margin-left: 8px" @click="$emit('pick-dept')">选择科室</el-button>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="innerVisible = false">取消</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="$emit('confirm')">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ReceiptDeptDialog',
  props: {
    visible: Boolean,
    title: { type: String, default: '' },
    deptName: { type: String, default: '' },
    loading: Boolean
  },
  data() {
    return { innerVisible: false };
  },
  watch: {
    visible(v) {
      this.innerVisible = v;
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    reset() {
      this.$emit('reset');
    }
  }
};
</script>
