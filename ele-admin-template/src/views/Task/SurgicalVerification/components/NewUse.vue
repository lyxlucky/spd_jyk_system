<template>
  <div class="ele-box">
    <el-form size="mini" label-position="left">
      <el-form-item label="术间">
        <el-input v-model="form.SJBH" placeholder="请输入术间编号" clearable />
      </el-form-item>
      <el-form-item label="住院号">
        <el-input v-model="form.ZYHM" placeholder="请输入住院号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.BRXM" placeholder="请输入病人姓名" clearable />
      </el-form-item>
      <el-form-item label="手术名称">
        <el-input v-model="form.SSMC" placeholder="请输入手术名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { addNewBdszZq } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'NewUse',
    props: {
      selection: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        form: {
          SJBH: '', // 术间编号
          ZYHM: '', // 住院号
          BRXM: '', // 病人姓名
          SSMC: '' // 手术名称
        }
      };
    },
    methods: {
      handleSubmit() {
        console.log(this.selection);
        let loading = this.$messageLoading('新增中');
        addNewBdszZq({ ...this.form, data: this.selection })
          .then((res) => {
            loading.close();
            this.$message.success('新增成功');
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message);
          });
      }
    }
  };
</script>
<style scoped></style>
