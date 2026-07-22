<template>
  <ele-modal width="480px" title="添加采购" :visible="visible" @update:visible="updateVisible">
    <el-form size="mini" label-width="100px">
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="form.BUY_TIME"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="form.BUY_TIME2"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.COUNT" type="number" placeholder="数量" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.PRICE" type="number" placeholder="价格" />
      </el-form-item>
      <el-form-item label="项目编号">
        <el-input v-model="form.XM_NUM" placeholder="项目编号(选填)" />
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="form.XM_NAME" placeholder="项目名称(选填)" />
      </el-form-item>
      <el-form-item label="项目类型">
        <el-input v-model="form.XM_TYPE" placeholder="项目类型(选填)" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </ele-modal>
</template>

<script>
import { PROD_REGISTRATION_LIMIT_BUY } from '@/api/Home/registration/index';

export default {
  name: 'LimitBuyDialog',
  props: {
    visible: Boolean,
    prodRegistrationCode: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        BUY_TIME: '',
        BUY_TIME2: '',
        COUNT: '',
        PRICE: '',
        XM_NUM: '',
        XM_NAME: '',
        XM_TYPE: ''
      }
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = {
          BUY_TIME: '',
          BUY_TIME2: '',
          COUNT: '',
          PRICE: '',
          XM_NUM: '',
          XM_NAME: '',
          XM_TYPE: ''
        };
      }
    }
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async onSubmit() {
      if (!this.prodRegistrationCode) {
        this.$message.warning('缺少注册证编码');
        return;
      }
      this.loading = true;
      try {
        const res = await PROD_REGISTRATION_LIMIT_BUY({
          PROD_REGISTRATION_CODE: this.prodRegistrationCode,
          COUNT: this.form.COUNT,
          BUY_TIME: this.form.BUY_TIME,
          BUY_TIME2: this.form.BUY_TIME2,
          PRICE: this.form.PRICE,
          XM_NUM: this.form.XM_NUM,
          XM_NAME: this.form.XM_NAME,
          XM_TYPE: this.form.XM_TYPE
        });
        if (res?.code == 200 || res?.code === '200') {
          this.$message.success(res.msg || '添加成功');
          this.updateVisible(false);
          this.$emit('success');
        } else if (res?.code == 301 || res?.code === '301') {
          this.$message.error(res.msg || '登录失效，请重新登录');
        } else {
          this.$message.error(res?.msg || '添加失败');
        }
      } catch (e) {
        this.$message.error(e.message || '添加失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
