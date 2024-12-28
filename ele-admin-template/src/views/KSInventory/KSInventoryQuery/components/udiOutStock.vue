<template lang="">
  <div class="">
    <ele-modal
      width="30%"
      @opened="
        () => {
          this.$refs.firstUdi.focus();
        }
      "
      :destroy-on-close="true"
      :visible="visible"
      :close-on-click-modal="false"
      custom-class="ele-dialog-form"
      title="UDI出库"
      @update:visible="updateVisible"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="" prop="" style="display: none">
          <el-input
            clearable
            :maxlength="20"
            :disabled="true"
            v-model="form.VARIETIE_CODE"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="品种名称:" prop="">
          <el-input
            clearable
            :maxlength="20"
            :disabled="true"
            v-model="form.VARIETIE_NAME"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="品种编码:" prop="">
          <el-input
            clearable
            :maxlength="20"
            :disabled="true"
            v-model="form.VARIETIE_CODE_NEW"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="批号:" prop="">
          <el-input
            clearable
            :maxlength="20"
            :disabled="true"
            v-model="form.BATCH"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="有效期:" prop="">
          <el-input
            clearable
            :maxlength="20"
            :disabled="true"
            v-model="form.BATCH_VALIDITY_PERIOD"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="库存数量:" prop="">
          <el-input
            clearable
            :maxlength="20"
            :disabled="true"
            v-model="form.COUNT"
          />
        </el-form-item>
        <el-form-item label="出库数量:" prop="qty">
          <el-input
            clearable
            :maxlength="20"
            v-model="form.qty"
            placeholder="出库数量"
          />
        </el-form-item>
        <el-form-item label="备注:" prop="">
          <el-input
            clearable
            :maxlength="20"
            v-model="form.mark"
            placeholder="备注"
          />
        </el-form-item>
        <el-form-item label="UDI扫码">
          <el-input
            placeholder="请输入UDI"
            v-model="where.firstUdi"
            ref="firstUdi"
            @change="getUdiInfo"
            class="input-with-select"
          >
            <el-switch slot="prepend" v-model="where.isMultiUdi"></el-switch>
          </el-input>
          <el-input
            placeholder="请输入第二段UDI"
            v-model="where.secondUdi"
            @change="getUdiInfo"
            ref="secondUdi"
            class="input-with-select"
          >
          </el-input>
        </el-form-item>
      </el-form>
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
          @click="submitWithUdi"
          type="primary"
          >确 定</el-button
        >
      </span>
    </ele-modal>
  </div>
</template>
<script>
  import {
    getJykMainShelfWithUdi,
    saveJykOutInfo
  } from '@/api/KSInventory/KSInventoryQuery';
  export default {
    name: 'udiOutStock',
    props: ['visible'],
    data() {
      const defaultWhere = {
        isMultiUdi: false,
        firstUdi: '',
        secondUdi: ''
      };
      const defaultForm = {
        VARIETIE_NAME: '',
        VARIETIE_CODE_NEW: '',
        VARIETIE_CODE: '',
        BATCH: '',
        DEPT_TWO_CODE: '',
        BATCH_VALIDITY_PERIOD: null,
        COUNT: '',
        qty: '',
        mark: ''
      };
      return {
        where: { ...defaultWhere },
        form: { ...defaultForm },
        rules: {
          qty: [
            {
              required: true,
              message: '请输入出库数量',
              trigger: 'blur'
            },
            { pattern: /^[0-9]*$/, message: '请输入数字', trigger: 'blur' }
          ]
        },
        bindMachine:'',
      };
    },
    mounted() {
      this.$bus.$on('bindMachineKSInventoryQuery', (data) => {
        this.bindMachine = data;
      });
    },
    beforeDestroy() {
      this.$bus.$off('bindMachineKSInventoryQuery');
    },
    methods: {
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      submitWithUdi() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          const data = {
            ...this.form,
            bindMachine: this.bindMachine
          };
          saveJykOutInfo(data)
            .then((msg) => {
              this.loading = false;
              this.$message.success(msg);
              this.updateVisible(false);
            })
            .catch((e) => {
              this.loading = false;
              this.$message.error(e.message);
            })
            .finally(() => {
              this.where = {
                ...this.where,
                firstUdi: '',
                secondUdi: '',
                isMultiUdi: false 
              }
              this.$refs.firstUdi.focus();
              this.form.qty = '';
            });
        });
      },
      getUdiInfo() {
        const loading = this.$messageLoading('请求中..');
        const completeUdi = this.where.firstUdi.trim() + this.where.secondUdi.trim();
        if(!completeUdi){
          loading.close();
          this.where = {
            ...this.where,
            firstUdi: '',
            secondUdi: '',
            isMultiUdi: false 
          }
          this.$refs.firstUdi.focus();
          return this.$message.error('请输入UDI');
        }
        getJykMainShelfWithUdi({
          udi: completeUdi
        })
          .then((res) => {
            if (res?.code != 200) return this.$message.error('处理失败');
            const data = res.result;
            if (data) {
              this.form.BATCH = data[0]?.BATCH;
              this.form.BATCH_VALIDITY_PERIOD = data[0]?.BATCH_VALIDITY_PERIOD
                ? this.$moment(data[0]?.BATCH_VALIDITY_PERIOD).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                : '';
              this.form.COUNT = data[0]?.COUNT;
              this.form.VARIETIE_CODE = data[0]?.VARIETIE_CODE;
              this.form.VARIETIE_CODE_NEW = data[0]?.VARIETIE_CODE_NEW;
              this.form.VARIETIE_NAME = data[0]?.VARIETIE_NAME;
              this.form.DEPT_TWO_CODE = data[0]?.DEPT_TWO_CODE;
            }
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            // this.where = {
            //   ...this.where,
            //   firstUdi: '',
            //   secondUdi: '',
            //   isMultiUdi: false 
            // }
            // this.$refs.firstUdi.focus();
            loading.close();
          });
      }
    },
    watch: {
      'where.isMultiUdi'(newVal) {
        if (newVal) {
          this.$refs.secondUdi.focus();
        }
      }
    }
    // created() {
    //   this.$refs.firstUdi.focus();
    // }
  };
</script>
<style lang=""></style>
