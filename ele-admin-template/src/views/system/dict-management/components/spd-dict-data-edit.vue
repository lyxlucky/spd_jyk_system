<template>
  <el-dialog
    :title="isUpdate ? '修改字典项' : '添加字典项'"
    :visible="visible"
    width="560px"
    :destroy-on-close="true"
    append-to-body
    custom-class="ele-dialog-form spd-dict-data-edit-dialog"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="字典值" prop="DictValue">
        <el-input v-model="form.DictValue" placeholder="存储值" maxlength="128" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="字典标签" prop="DictLabel">
        <el-input v-model="form.DictLabel" placeholder="显示标签" maxlength="256" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="标签色" prop="TagColor">
        <el-input v-model="form.TagColor" placeholder="success / primary / #409EFF" maxlength="64" clearable />
      </el-form-item>
      <el-form-item label="标签效果" prop="TagEffect">
        <el-select v-model="form.TagEffect" placeholder="可选" clearable style="width: 100%">
          <el-option label="plain" value="plain" />
          <el-option label="dark" value="dark" />
          <el-option label="light" value="light" />
        </el-select>
      </el-form-item>
      <el-form-item label="列表样式类" prop="ListCssClass">
        <el-input v-model="form.ListCssClass" placeholder="CSS class" maxlength="128" clearable />
      </el-form-item>
      <el-form-item label="扩展 JSON" prop="ExtJson">
        <el-input v-model="form.ExtJson" type="textarea" :rows="2" maxlength="4000" show-word-limit />
      </el-form-item>
      <el-form-item label="状态" prop="Status">
        <el-radio-group v-model="form.Status">
          <el-radio label="1">正常</el-radio>
          <el-radio label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序号" prop="SortNum">
        <el-input-number v-model="form.SortNum" :min="0" :max="999999" controls-position="right" />
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-input v-model="form.Remark" type="textarea" :rows="2" maxlength="500" show-word-limit />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { dictDataSave } from '@/api/system/dict-management';

  export default {
    props: {
      visible: Boolean,
      data: Object,
      dictTypeId: [Number, String]
    },
    data() {
      return {
        loading: false,
        form: this.getEmptyForm(),
        rules: {
          DictValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
          DictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }]
        }
      };
    },
    computed: {
      isUpdate() {
        return this.data && this.data.DictDataId != null && Number(this.data.DictDataId) > 0;
      }
    },
    watch: {
      visible(val) {
        if (val) {
          const tid = this.dictTypeId != null ? Number(this.dictTypeId) : 0;
          if (this.data && this.data.DictDataId != null && Number(this.data.DictDataId) > 0) {
            this.form = {
              DictDataId: this.data.DictDataId,
              DictTypeId: this.data.DictTypeId != null ? Number(this.data.DictTypeId) : tid,
              DictValue: this.data.DictValue || '',
              DictLabel: this.data.DictLabel || '',
              TagColor: this.data.TagColor || '',
              TagEffect: this.data.TagEffect || '',
              ListCssClass: this.data.ListCssClass || '',
              ExtJson: this.data.ExtJson || '',
              Remark: this.data.Remark || '',
              Status: this.data.Status != null ? String(this.data.Status) : '1',
              SortNum: this.data.SortNum != null ? Number(this.data.SortNum) : 0
            };
          } else {
            this.form = this.getEmptyForm();
            this.form.DictTypeId = tid;
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
          DictDataId: 0,
          DictTypeId: 0,
          DictValue: '',
          DictLabel: '',
          TagColor: '',
          TagEffect: '',
          ListCssClass: '',
          ExtJson: '',
          Remark: '',
          Status: '1',
          SortNum: 0
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
          const tid = this.form.DictTypeId != null ? Number(this.form.DictTypeId) : 0;
          if (!tid) {
            this.$message.error('缺少字典类型');
            return;
          }
          this.loading = true;
          dictDataSave({
            dictDataId: this.isUpdate ? this.form.DictDataId : 0,
            dictTypeId: tid,
            dictValue: this.form.DictValue,
            dictLabel: this.form.DictLabel,
            tagColor: this.form.TagColor,
            tagEffect: this.form.TagEffect,
            listCssClass: this.form.ListCssClass,
            extJson: this.form.ExtJson,
            remark: this.form.Remark,
            status: this.form.Status,
            sortNum: this.form.SortNum
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
