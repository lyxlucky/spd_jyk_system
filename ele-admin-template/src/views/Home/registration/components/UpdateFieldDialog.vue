<template>
  <ele-modal
    width="520px"
    title="更新注册证字段数据"
    :visible="visible"
    @update:visible="updateVisible"
  >
    <el-form size="mini" label-width="120px">
      <el-form-item label="更新字段名：">
        <el-select v-model="updataField" filterable style="width: 100%">
          <el-option v-for="item in fieldOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择文件：">
        <input ref="fileInput" type="file" accept=".xls,.xlsx" @change="onFileChange" />
      </el-form-item>
      <el-form-item>
        <span style="color: #999; font-size: 12px">Excel格式：A列=注册证编号（批准文号），B列=更新值</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </ele-modal>
</template>

<script>
import { ImpProdUpdataField } from '@/api/Home/registration/index';

const FIELD_OPTIONS = [
  { value: '1', label: '原注册证编号' },
  { value: '2', label: '医疗器械注册人或备案人' },
  { value: '3', label: '受托医疗器械生产企业名称' },
  { value: '4', label: '注册证产品名称' },
  { value: '5', label: '生产许可证号' },
  { value: '6', label: '注册证批准日期' },
  { value: '7', label: '生产地址' },
  { value: '8', label: '注册证有效期至' },
  { value: '9', label: '法人' },
  { value: '10', label: '储存条件' },
  { value: '11', label: '国内代理企业' },
  { value: '12', label: '产品类别' },
  { value: '13', label: '进口或国产' },
  { value: '14', label: '管理类别' },
  { value: '15', label: '品牌' },
  { value: '16', label: '监管类别' },
  { value: '17', label: '结构及组成' },
  { value: '18', label: '是否灭菌' },
  { value: '19', label: '适用范围' },
  { value: '20', label: '医用耗材级别' },
  { value: '21', label: '缺项备注' },
          { value: '22', label: '是否启用' },
          { value: '23', label: '产地信息' },
          { value: '24', label: '投标企业' },
          { value: '25', label: '投标企业信用代码' }
];

export default {
  name: 'UpdateFieldDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      updataField: '1',
      file: null,
      loading: false,
      fieldOptions: FIELD_OPTIONS
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.file = null;
        this.updataField = '1';
        if (this.$refs.fileInput) this.$refs.fileInput.value = '';
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    onFileChange(e) {
      this.file = e.target.files?.[0] || null;
    },
    async onSubmit() {
      if (!this.file) {
        this.$message.warning('请选择文件');
        return;
      }
      const name = (this.file.name || '').toLowerCase();
      if (!(name.endsWith('.xls') || name.endsWith('.xlsx'))) {
        this.$message.error('文件格式错误，请上传 .xls 或 .xlsx');
        return;
      }
      this.loading = true;
      try {
        const res = await ImpProdUpdataField(this.file, this.updataField);
        if (res?.code == 200 || res?.code === '200') {
          this.$alert(String(res.msg || '更新成功').replace(/\n/g, '<br/>'), '更新选定字段', {
            dangerouslyUseHTMLString: true,
            type: 'success'
          });
          this.updateVisible(false);
          this.$emit('success');
        } else {
          this.$alert(String(res?.msg || '更新失败').replace(/\n/g, '<br/>'), '更新选定字段', {
            dangerouslyUseHTMLString: true,
            type: 'error'
          });
        }
      } catch (e) {
        this.$message.error(e.message || '更新失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
