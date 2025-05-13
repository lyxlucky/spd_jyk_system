<template lang="">
  <ele-modal
    width="40%"
    height="60%"
    title="修改用户信息"
    :visible="visible"
    :append-to-body="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form
      ref="form"
      :model="where.parentCurrentRow"
      @keyup.enter.native="save"
    >
      <el-row>
        <el-col v-bind="styleResponsive ? { lg: 22, md: 24 } : { span: 24 }">
          <el-form-item prop="SSFJ" label="术间：">
            <el-input
              v-model="where.parentCurrentRow.SSFJ"
              size="mini"
              placeholder="请输入术间"
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 22, md: 24 } : { span: 24 }">
          <el-form-item prop="SSTH" label="手术台号：">
            <el-input
              v-model="where.parentCurrentRow.SSTH"
              size="mini"
              placeholder="请输入手术台号"
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 22, md: 24 } : { span: 24 }">
          <el-form-item prop="ZYHM" label="住院号：">
            <el-input
              size="mini"
              v-model="where.parentCurrentRow.ZYHM"
              placeholder="请输入住院号"
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 22, md: 24 } : { span: 24 }">
          <el-form-item prop="BRXM" label="姓名：">
            <el-input
              size="mini"
              v-model="where.parentCurrentRow.BRXM"
              placeholder="请输入姓名"
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 22, md: 24 } : { span: 24 }">
          <el-form-item prop="SSMC" label="手术名称：">
            <el-input
              size="mini"
              v-model="where.parentCurrentRow.SSMC"
              placeholder="请输入手术名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template v-slot:footer>
      <el-button type="primary" size="mini" @click="handleApprove"
        >确定</el-button
      >
      <el-button type="info" size="mini" @click="updateVisible(false)"
        >取消</el-button
      >
    </template>
  </ele-modal>
</template>
<script>
  import { updateBdSzHisSurgery } from '@/api/Task/OPSConsumables';
  export default {
    name: 'UpdateUserInfoDialog',
    props: ['visible'],
    data() {
      const defaultWhere = {
        parentCurrentRow: null
      };
      return {
        styleResponsive: false,
        where: {
          ...defaultWhere
        }
      };
    },
    methods: {
      handleApprove() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            updateBdSzHisSurgery({ where: this.where.parentCurrentRow })
              .then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                }
              })
              .catch((err) => {
                this.$message.error(err?.msg);
              })
              .finally(() => {
                this.updateVisible(false);
                this.$emit('reload');
              });
          } else {
            return false;
          }
        });
      },

      updateVisible(value) {
        this.$emit('update:visible', value);
      }
    },
    mounted() {
      this.$bus.$on('OPSConsumablesTableRowCurrent', (data) => {
        this.where.parentCurrentRow = data;
      });

      this.$bus.$on('AdvanceReceiptNumberTableDialogCurrent', (data) => {
        this.where.parentCurrentRow = data;
      });
    }
  };
</script>
<style lang=""></style>
