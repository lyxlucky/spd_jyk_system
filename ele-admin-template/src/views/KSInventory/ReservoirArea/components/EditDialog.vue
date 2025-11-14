<template>
  <div>
    <ele-modal
      width="680px"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      :title="'修改模板'"
      @close="handleBeforeClose"
      @update:visible="updateVisible"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="102px">
        <el-form-item label="模板名称:" prop="name">
          <el-input
            clearable
            :maxlength="20"
            v-model="form.name"
            placeholder="请输入模板名称"
          />
        </el-form-item>

        <el-form-item label="模板类别:" prop="type">
          <el-input
            clearable
            :maxlength="20"
            v-model="form.type"
            placeholder="请输入模板类别"
          />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="updateVisible(false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="save">
          保存
        </el-button>
      </template>
    </ele-modal>
  </div>
</template>
<script>
  import { UpdateNaxtDayApplyTemplate } from '@/api/KSInventory/SurgerySchedulingTemp';
  export default {
    name: 'EditDialog',
    props: ['visible', 'current'],
    data() {
      return {
        form: {
          id: '',
          name: '',
          type: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入模板名称', trigger: 'blur' }
          ],
          type: [{ required: true, message: '请输入模板类别', trigger: 'blur' }]
        }
      };
    },
    methods: {
      handleBeforeClose() {
        this.$refs.form.resetFields();
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      save() {
        UpdateNaxtDayApplyTemplate(this.form)
          .then((res) => {
            this.$message.success('修改成功');
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            this.$refs.form.resetFields();
            this.updateVisible(false);
            this.$emit('refresh');
          });
      }
    },
    mounted() {
      this.$bus.$on('SurgerySchedulingEditTemplateName', (data) => {
        this.form.id = data.ID;
        this.form.name = data.TEMPLATE_NAME;
        this.form.type = data.TYPE;
      });
    },
    beforeDestroy() {
      this.$bus.$off('SurgerySchedulingEditTemplateName');
    }
  };
</script>
<style lang=""></style>
