<template>
  <el-dialog
    title="创建退购单"
    :visible="visible"
    width="480px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-form label-width="100px" size="small">
      <el-form-item label="是否含实物">
        <el-select v-model="form.isHaveGoods" style="width: 100%">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateReturnDialog',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data() {
    return {
      form: { isHaveGoods: '1', remark: '' }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = { isHaveGoods: '1', remark: '' };
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    handleSubmit() {
      this.$emit('submit', { ...this.form });
    }
  }
};
</script>
