<template lang="">
  <div class="container">
    <ele-modal
      width="25%"
      title="修改病人信息"
      :visible="visible"
      @update:visible="updateVisible"
      position="center"
      :resizable="true"
      :maxable="true"
      :destroy-on-close="true"
      append-to-body
    >
      <el-form :rules="rules" ref="form" :model="where" label-width="100px">
        <el-form-item label="住院号：">
          <el-input
            type="text"
            size="mini"
            v-model="where.patientNumber"
          ></el-input>
        </el-form-item>

        <el-form-item label="病患姓名：">
          <el-input
            type="text"
            size="mini"
            v-model="where.patientName"
          ></el-input>
        </el-form-item>

        <el-form-item label="手术科室：" prop="deptName">
          <el-select
            size="mini"
            v-model="where.deptName"
            placeholder="请选择手术科室"
          >
            <el-option
              v-for="item in deptTwoList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- template -->
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          icon="el-icon-close"
          @click="updateVisible(false)"
          >取 消</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-check"
          type="primary"
          @click="handleConfirm()"
          >确 定</el-button
        >
      </span>
    </ele-modal>
  </div>
</template>
<script>
  import {
    GetTwoDept,
    upDeliveryInfo
  } from '@/api/HeelBlockConsumables/PreDelivered';
  export default {
    name: 'UpdatePatientInfoDialog',
    props: ['visible'],
    data() {
      const defaultWhere = {
        deptName: '',
        patientNumber: '',
        patientName: ''
      };
      let validateDept = (rule, value, callback) => {
        console.log(value);
        if (value == '') {
          callback(new Error('请选择手术科室'));
        } else {
          callback();
        }
      };
      return {
        where: { ...defaultWhere },
        deptTwoList: [],
        currentRow: {},
        rules: {
          deptName: [{ validator: validateDept, trigger: 'blur' }]
        }
      };
    },
    mounted() {
      this.$bus.$on('UpdatePatientInfohandleUpdate', (data) => {
        this.where.patientNumber = data.Hospitalization_Number;
        this.where.patientName = data.Patient;
        this.currentRow = data;
      });
    },
    created() {
      this.initDeptTwoList();
    },
    methods: {
      initDeptTwoList() {
        GetTwoDept().then((res) => {
          this.deptTwoList = res.result.map((item) => {
            return {
              label: item.DEPT_TWO_NAME,
              value: item.DEPT_TWO_CODE
            };
          });
        });
      },
      handleConfirm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const loading = this.$messageLoading('正在处理..');
            upDeliveryInfo({
              deliveryNumberId: this.currentRow?.Delivery_Note_Number_Id,
              B2B_SPD_DEPT_TWO_CODE: this.where?.deptName,
              HOSPITALIZATION_NUMBER: this.currentRow?.Hospitalization_Number,
              PATIENT: this.currentRow?.Patient
            })
              .then((res) => {
                this.updateVisible(false);
                this.$message({
                  message: res?.msg,
                  type: 'success'
                });
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  type: 'error'
                });
              })
              .finally(() => {
                loading.close();
                this.$emit('search', this.where);
              });
          } else {
            console.log(123123213132);
          }
        });
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      }
    }
  };
</script>
<style lang=""></style>
