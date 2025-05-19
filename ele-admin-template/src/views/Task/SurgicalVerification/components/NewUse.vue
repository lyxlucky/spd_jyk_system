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
      <el-form-item label="手术房间">
        <el-input v-model="form.SSFJ" placeholder="请输入手术房间" clearable />
      </el-form-item>
      <el-form-item label="手术台号">
        <el-input v-model="form.SSTH" placeholder="请输入手术台号" clearable />
      </el-form-item>
      <el-form-item label="病人性别">
        <el-select v-model="form.BRXB" placeholder="请选择性别" clearable>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手术名称">
        <el-input v-model="form.SSMC" placeholder="请输入手术名称" clearable />
      </el-form-item>
      <el-form-item label="手术日期">
        <el-date-picker
          v-model="form.SSRQ"
          type="date"
          placeholder="请选择手术日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="科室名称">
        <el-input v-model="form.KSMC" placeholder="请输入科室名称" clearable />
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
      },
      ApplyTempTableData: {
        type: Object,
        default: () => null
      }
    },
    data() {
      return {
        form: {
          SJBH: '', // 术间编号
          SSFJ: '', // 手术房间
          SSTH: '', // 手术台号
          ZYHM: '', // 住院号
          BRXM: '', // 病人姓名
          BRXB: '', // 病人性别
          SSMC: '', // 手术名称
          SSRQ: '', // 手术日期
          KSMC: '' // 科室名称
        }
      };
    },
    methods: {
      handleSubmit() {
        if (this.selection.length === 0) {
          this.$message.warning('请选择数据');
          return;
        }
        let loading = this.$messageLoading('新增中');
        addNewBdszZq({
          ...this.form,
          data: this.selection
        })
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
