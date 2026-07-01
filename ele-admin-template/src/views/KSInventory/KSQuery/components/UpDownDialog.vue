<template>
  <el-dialog
    title="修改品种上下限"
    :visible.sync="dialogVisible"
    width="320px"
    append-to-body
    @closed="onClosed"
  >
    <el-form label-width="60px" size="small">
      <el-form-item label="上限">
        <el-input v-model="up" placeholder="请输入上限" />
      </el-form-item>
      <el-form-item label="下限">
        <el-input v-model="down" placeholder="请输入下限" />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" :loading="submitting" @click="submit">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { upDownKsQuery } from '@/api/KSInventory/KSQuery';

export default {
  name: 'KSQueryUpDownDialog',
  props: {
    visible: Boolean,
    row: Object
  },
  data() {
    return {
      up: '',
      down: '',
      submitting: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.row) {
        this.up = this.row.Upper != null ? String(this.row.Upper) : '';
        this.down = this.row.Lower != null ? String(this.row.Lower) : '';
      }
    }
  },
  methods: {
    onClosed() {
      this.up = '';
      this.down = '';
    },
    async submit() {
      if (!this.row) {
        this.$message.warning('请先在上方表格选择品种');
        return;
      }
      const nickname = this.$store.state.user?.info?.Nickname || '';
      const dept = this.$store.state.user?.info?.DeptNow || {};
      const payload = [
        {
          dept_two_code: dept.Dept_Two_Code,
          dept_two_name: this.row.Source_Name || dept.Dept_Two_Name,
          VarietieCode: this.row.Varietie_Code,
          Varietie_Name: this.row.Varietie_Name,
          Varietie_Code_New: this.row.Varietie_Code_New,
          Coefficient: this.row.Coefficient,
          nickname,
          up: this.up,
          down: this.down
        }
      ];
      this.submitting = true;
      try {
        const res = await upDownKsQuery(payload);
        this.$message.success(res.msg || '提交成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>
