<template>
  <el-dialog
    :title="isUpdate ? '修改字典类型' : '添加字典类型'"
    :visible="visible"
    width="520px"
    :destroy-on-close="true"
    custom-class="ele-dialog-form"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="类型编码" prop="dictTypeCode">
        <el-input
          v-model="form.dictTypeCode"
          placeholder="唯一编码"
          maxlength="64"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="类型名称" prop="dictTypeName">
        <el-input
          v-model="form.dictTypeName"
          placeholder="显示名称"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="1">正常</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序号" prop="sortNum">
        <el-input-number v-model="form.sortNum" :min="0" :max="999999" controls-position="right" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="3" maxlength="500" show-word-limit />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { dictTypeSave } from '@/api/system/dict-management';

  export default {
    props: {
      visible: Boolean,
      data: Object
    },
    data() {
      return {
        loading: false,
        form: this.getEmptyForm(),
        rules: {
          dictTypeCode: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
          dictTypeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
        }
      };
    },
    computed: {
      isUpdate() {
        const d = this.data;
        if (!d) return false;
        const id = d.DictTypeId != null ? d.DictTypeId : d.dictTypeId;
        return id != null && Number(id) > 0;
      }
    },
    watch: {
      visible(val) {
        if (val) {
          const d = this.data;
          const id = d && (d.DictTypeId != null ? d.DictTypeId : d.dictTypeId);
          if (d && id != null && Number(id) > 0) {
            const st = d.Status != null ? d.Status : d.status;
            const sn = d.SortNum != null ? d.SortNum : d.sortNum;
            this.form = {
              dictTypeId: id,
              dictTypeCode: d.DictTypeCode || d.dictTypeCode || '',
              dictTypeName: d.DictTypeName || d.dictTypeName || '',
              remark: d.Remark || d.remark || '',
              status: st != null ? String(st) : '1',
              sortNum: sn != null ? Number(sn) : 0
            };
          } else {
            this.form = this.getEmptyForm();
          }
          this.$nextTick(() => {
            if (this.$refs.form) {
              this.$refs.form.clearValidate();
            }
          });
        }
      }
    },
    methods: {
      getEmptyForm() {
        return {
          dictTypeId: 0,
          dictTypeCode: '',
          dictTypeName: '',
          remark: '',
          status: '1',
          sortNum: 0
        };
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      save() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return;
          }
          this.loading = true;
          dictTypeSave({
            dictTypeId: this.isUpdate ? this.form.dictTypeId : 0,
            dictTypeCode: this.form.dictTypeCode,
            dictTypeName: this.form.dictTypeName,
            remark: this.form.remark,
            status: this.form.status,
            sortNum: this.form.sortNum
          })
            .then(() => {
              this.loading = false;
              this.$message.success('保存成功');
              this.updateVisible(false);
              this.$emit('done');
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error(e.message || '保存失败');
            });
        });
      }
    }
  };
</script>
