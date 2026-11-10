<template>
  <el-dialog
    title="维护科室属性"
    custom-class="pending-attributes-panel"
    :visible.sync="visible"
    width="900px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="!submitLoading"
    :before-close="beforeClose"
    @closed="resetDialog"
  >
    <div class="properties-body">
      <div class="material-summary">
        <strong>{{ task ? task.Varietie_Name : '' }}</strong>
        <div class="package-summary">已选定数包：{{ packages.join('、') }}</div>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="top" size="small">
        <h3 class="section-title">授权与库存</h3>
        <div class="field-grid">
          <el-form-item label="授权到期" prop="validDatetime">
            <el-date-picker v-model="form.validDatetime" type="date" value-format="yyyy-MM-dd" placeholder="请选择到期日期" class="full-width" />
          </el-form-item>
          <el-form-item label="默认所属库区" prop="DEFUL_REGION_CODE">
            <el-radio-group v-model="form.DEFUL_REGION_CODE" class="choice-set"><el-radio label="2">高值</el-radio><el-radio label="3">低值</el-radio></el-radio-group>
          </el-form-item>
          <el-form-item label="库存上限" prop="upper"><el-input-number v-model="form.upper" :min="0" :max="2147483647" :precision="0" :controls="false" class="full-width" /></el-form-item>
          <el-form-item label="库存下限" prop="lower"><el-input-number v-model="form.lower" :min="0" :max="2147483647" :precision="0" :controls="false" class="full-width" /></el-form-item>
        </div>
        <h3 class="section-title">消耗方式</h3>
        <el-form-item label="消耗类型" prop="consumptionType">
          <el-radio-group v-model="form.consumptionType" class="choice-set consumption-choices">
            <el-radio v-for="choice in consumptionChoices" :key="choice.value" :label="choice.value" border>{{ choice.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <h3 class="section-title">收货与核算</h3>
        <el-form-item label="PDA定数包收货位置" prop="varReceivePlace">
          <el-radio-group v-model="form.varReceivePlace" class="choice-set"><el-radio label="0">SPD二级科室库存</el-radio><el-radio label="1">科室定数包暂借库</el-radio></el-radio-group>
        </el-form-item>
        <el-form-item label="成本核算方式" prop="costDeptState">
          <el-radio-group v-model="form.costDeptState" class="choice-set"><el-radio label="1">核算为当前科室</el-radio><el-radio label="0">核算到计费科室</el-radio><el-radio label="2">出库即核销</el-radio></el-radio-group>
        </el-form-item>
        <h3 class="section-title">计费与配送设置</h3>
        <div class="field-grid">
          <el-form-item v-for="setting in binarySettings" :key="setting.prop" :label="setting.label" :prop="setting.prop">
            <el-radio-group v-model="form[setting.prop]" class="choice-set"><el-radio label="1">{{ setting.yes || '是' }}</el-radio><el-radio label="0">{{ setting.no || '否' }}</el-radio></el-radio-group>
          </el-form-item>
          <el-form-item label="空定数码自动对冲起始时间" prop="HIS_CAN_NULL_STATR_TIME" :required="form.IS_HIS_CAN_NULL === '1'">
            <el-date-picker v-model="form.HIS_CAN_NULL_STATR_TIME" type="date" value-format="yyyy-MM-dd" :disabled="form.IS_HIS_CAN_NULL !== '1'" placeholder="启用自动对冲时选择" class="full-width" />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer">
      <el-button size="small" :disabled="submitLoading" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="submitLoading" @click="submit">保存属性</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { savePending } from '@/api/Home/DepartmentCatalogPending';

function initialForm() {
  return {
    validDatetime: '2999-01-01', upper: 0, lower: 0, consumptionType: '',
    rfid: '0', varReceivePlace: '0', costDeptState: '0', hisNeedTempRecord: '0',
    IS_AUTH_SEND: '0', IS_HIS_CAN_NULL: '0', DEFUL_REGION_CODE: '2', HIS_CAN_NULL_STATR_TIME: ''
  };
}

export default {
  name: 'PendingCatalogAttributesDialog',
  data() {
    const required = (message) => [{ required: true, message, trigger: 'change' }];
    return {
      visible: false,
      submitLoading: false,
      task: null,
      packages: [],
      form: initialForm(),
      consumptionChoices: [
        { value: '0', label: '条码扫码即消耗' }, { value: '1', label: 'RFID读码消耗' },
        { value: '2', label: 'HIS计费消耗' }, { value: '3', label: '散货申领消耗' }, { value: '5', label: '超时默认消耗' }
      ],
      binarySettings: [
        { prop: 'rfid', label: '关联RFID' },
        { prop: 'hisNeedTempRecord', label: 'HIS对冲需要暂借记录', yes: '需要', no: '不需要' },
        { prop: 'IS_AUTH_SEND', label: '主动配送' },
        { prop: 'IS_HIS_CAN_NULL', label: '空定数码计费信息自动对冲' }
      ],
      rules: {
        validDatetime: required('请选择授权到期日期'),
        upper: required('请输入库存上限'),
        lower: [
          ...required('请输入库存下限'),
          { validator: (_rule, value, callback) => callback(value > this.form.upper ? new Error('库存下限不得大于上限') : undefined), trigger: 'change' }
        ],
        consumptionType: required('请选择消耗类型'), rfid: required('请选择是否关联RFID'),
        varReceivePlace: required('请选择收货位置'), costDeptState: required('请选择核算方式'),
        hisNeedTempRecord: required('请选择暂借记录要求'), IS_AUTH_SEND: required('请选择是否主动配送'),
        IS_HIS_CAN_NULL: required('请选择是否自动对冲'), DEFUL_REGION_CODE: required('请选择默认库区'),
        HIS_CAN_NULL_STATR_TIME: [{ validator: (_rule, value, callback) => callback(this.form.IS_HIS_CAN_NULL === '1' && !value ? new Error('请选择自动对冲起始时间') : undefined), trigger: 'change' }]
      }
    };
  },
  methods: {
    open(task, packages) {
      this.task = { ...task };
      this.packages = [...packages];
      this.form = initialForm();
      this.visible = true;
      this.$nextTick(() => this.$refs.formRef.clearValidate());
    },
    beforeClose(done) { if (!this.submitLoading) done(); },
    resetDialog() {
      this.task = null;
      this.packages = [];
      this.form = initialForm();
    },
    submit() {
      if (this.submitLoading) return;
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        this.submitLoading = true;
        try {
          await savePending(this.task.ID, this.packages, { ...this.form });
          this.$message.success('属性保存成功');
          this.visible = false;
          this.$emit('saved');
        } catch (error) {
          this.$message.error(error.message || '保存失败');
        } finally {
          this.submitLoading = false;
        }
      });
    }
  }
};
</script>
<style scoped>
.properties-body { max-height: calc(90vh - 170px); overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding: 0 8px 0 0; }
.material-summary { margin-bottom: 16px; line-height: 1.6; }
.package-summary { color: #606266; overflow-wrap: anywhere; }
.section-title { margin: 16px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; font-size: 14px; font-weight: 600; }
.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 24px; }
.full-width { width: 100%; }
.choice-set { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; min-height: 32px; }
.choice-set > .el-radio { margin: 0; }
.consumption-choices { gap: 10px; }
.consumption-choices > .el-radio { margin: 0; }
@media (max-width: 700px) { .field-grid { grid-template-columns: minmax(0, 1fr); } }
</style>
<style>
.pending-attributes-panel { max-width: calc(100vw - 32px); margin-bottom: 0; }
.pending-attributes-panel .el-dialog__body { padding: 12px 24px 8px; }
.pending-attributes-panel .el-dialog__footer { border-top: 1px solid #ebeef5; padding: 12px 24px; }
</style>
