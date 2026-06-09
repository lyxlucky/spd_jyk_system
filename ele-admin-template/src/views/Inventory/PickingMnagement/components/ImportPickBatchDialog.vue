<template>
  <el-dialog
    title="导入定数包"
    :visible="visible"
    width="450px"
    append-to-body
    @update:visible="updateVisible"
  >
    <el-form ref="form" label-width="100px" size="small">
      <el-form-item label="拣配单号">
        <el-input v-model="packNumber" placeholder="请输入拣配单号" />
      </el-form-item>
      <el-form-item label="选择文件">
        <input ref="fileInput" type="file" @change="onFileChange" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { pickBatch } from '@/api/Inventory/PickingMnagement';
import { unwrapData, isOkCode } from '../utils';

export default {
  name: 'ImportPickBatchDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      packNumber: '',
      file: null,
      loading: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.packNumber = '';
        this.file = null;
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    onFileChange(e) {
      this.file = e.target.files?.[0] || null;
    },
    handleSubmit() {
      if (!this.packNumber) {
        this.$message.warning('请输入拣配单号');
        return;
      }
      if (!this.file) {
        this.$message.warning('请选择文件');
        return;
      }
      const formData = new FormData();
      formData.append('Pack_Directive_Mumber', this.packNumber);
      formData.append('FILE', this.file);
      this.loading = true;
      pickBatch(formData)
        .then((res) => {
          const data = unwrapData(res);
          if (data?.code === 301) {
            this.$message.error(data.Msg || data.msg || '登录失效');
            return;
          }
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '导入成功');
            this.updateVisible(false);
            this.$emit('success');
          } else {
            this.$message.error(data?.msg || '导入失败');
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
