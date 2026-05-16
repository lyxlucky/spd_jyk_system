<template>
  <el-dialog custom-class="legacy-layer-dialog" :title="dialogTitle" :visible.sync="visible" width="720px" append-to-body @closed="onClosed">
    <div v-loading="fillLoading" class="dialog-form-wrap" element-loading-text="加载中...">
      <el-form ref="formRef" :model="form" label-width="240px" size="small">
        <el-form-item prop="validDatetime" :rules="[{ required: true, message: '必填' }]">
          <template slot="label"><span class="req-star">*</span>授权到期</template>
          <el-date-picker v-model="form.validDatetime" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="upper" :rules="[{ required: true, message: '必填' }]">
          <template slot="label"><span class="req-star">*</span>库存上限</template>
          <el-input-number v-model="form.upper" :min="0" :controls="false" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="lower" :rules="[{ required: true, message: '必填' }]">
          <template slot="label"><span class="req-star">*</span>库存下限</template>
          <el-input-number v-model="form.lower" :min="0" :controls="false" style="width: 100%" />
        </el-form-item>
        <el-form-item prop="consumptionType" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>消耗类型</template>
          <el-select v-model="form.consumptionType" style="width: 100%">
            <el-option label="条码扫码即消耗" value="0" />
            <el-option label="RFID读码消耗" value="1" />
            <el-option label="HIS计费消耗" value="2" />
            <el-option label="散货申领消耗" value="3" />
            <el-option label="超时默认消耗" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item prop="rfid" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>关联RFID</template>
          <el-select v-model="form.rfid" style="width: 100%">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="varReceivePlace" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>PDA定数包收货位置</template>
          <el-select v-model="form.varReceivePlace" style="width: 100%">
            <el-option label="Spd二级科室存库" value="0" />
            <el-option label="科室定数包暂借库" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="costDeptState" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>是否核算为当前科室</template>
          <el-select v-model="form.costDeptState" style="width: 100%">
            <el-option label="核算为当前科室" value="1" />
            <el-option label="核算到计费科室" value="0" />
            <el-option label="出库即核销" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="hisNeedTempRecord" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>HIS对冲是否需要暂借记录</template>
          <el-select v-model="form.hisNeedTempRecord" style="width: 100%">
            <el-option label="需要" value="1" />
            <el-option label="不需要" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="IS_AUTH_SEND" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>是否主动配送</template>
          <el-select v-model="form.IS_AUTH_SEND" style="width: 100%">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="IS_HIS_CAN_NULL" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>空定数码计费信息自动对冲</template>
          <el-select v-model="form.IS_HIS_CAN_NULL" style="width: 100%">
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="DEFUL_REGION_CODE" :rules="[{ required: true, message: '必选' }]">
          <template slot="label"><span class="req-star">*</span>默认所属库区</template>
          <el-select v-model="form.DEFUL_REGION_CODE" style="width: 100%">
            <el-option label="高值" value="2" />
            <el-option label="低值" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="HIS_CAN_NULL_STATR_TIME">
          <template slot="label"><span class="req-star">*</span>空定数码计费信息自动对冲起始时间</template>
          <el-date-picker v-model="form.HIS_CAN_NULL_STATR_TIME" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd" style="width: 100%" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="footer-center">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="submitLoading" :disabled="fillLoading" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';

function sub10(v) {
  if (v == null || v === '') return '';
  return String(v).substring(0, 10);
}

export default {
  name: 'EditPkgAuthDialog',
  data() {
    return {
      visible: false,
      fillLoading: false,
      submitLoading: false,
      dialogTitle: '编辑定数包',
      deptTwoCode: '',
      pkgAuthVarCode: '',
      form: {}
    };
  },
  methods: {
    applyMerged(m) {
      const c = m.Consumption_Type;
      const cons = c === 3 || c === '3' ? '3' : String(c ?? '0');
      this.pkgAuthVarCode = m.Pkg_Auth_Var_Code;
      this.form = {
        validDatetime: sub10(m.Auth_Valid_Date),
        upper: Number(m.Def_No_Pkg_Upper) || 0,
        lower: Number(m.Def_No_Pkg_Lower) || 0,
        consumptionType: cons,
        rfid: String(m.Related_Rfid ?? '0'),
        varReceivePlace: String(m.Var_Receive_Place ?? '0'),
        costDeptState: String(m.Cost_Dept_State ?? '0'),
        hisNeedTempRecord: String(m.His_Need_Temp_Record ?? m.HisNeedTempRecord ?? '0'),
        IS_AUTH_SEND: String(m.IS_AUTH_SEND ?? '0'),
        IS_HIS_CAN_NULL: String(m.IS_HIS_CAN_NULL ?? '0'),
        HIS_CAN_NULL_STATR_TIME: sub10(m.HIS_CAN_NULL_STATR_TIME),
        DEFUL_REGION_CODE: String(m.DEFUL_REGION_CODE ?? '2')
      };
    },
    /** 与旧 Frame/Editsecondaryinformation：先弹出，再请求详情后合并列表行填充 */
    async open(row, deptTwoCode) {
      this.deptTwoCode = deptTwoCode;
      this.dialogTitle = `编辑定数包--${row.Varietie_Name || ''}`;
      this.applyMerged(row);
      this.visible = true;
      this.fillLoading = true;
      await this.$nextTick();
      try {
        const detail = await api.getDeptTwoDefNoPkgAuthVarDetail(deptTwoCode, row.Varietie_Code);
        this.applyMerged({ ...row, ...detail, Pkg_Auth_Var_Code: row.Pkg_Auth_Var_Code });
      } catch {
        this.applyMerged(row);
      } finally {
        this.fillLoading = false;
        this.$nextTick(() => this.$refs.formRef?.clearValidate());
      }
    },
    onClosed() {
      this.fillLoading = false;
    },
    submit() {
      this.$refs.formRef.validate(async (ok) => {
        if (!ok) return;
        this.submitLoading = true;
        try {
          const success = await api.modifyDeptAuthedVar({
            PkgAuthVarCode: this.pkgAuthVarCode,
            ...this.form
          });
          if (success) {
            Message.success('编辑成功');
            this.visible = false;
            this.$emit('saved');
          } else {
            Message.error('保存失败');
          }
        } catch (e) {
          Message.error(e.message || '保存失败');
        } finally {
          this.submitLoading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.req-star {
  color: #f56c6c;
  margin-right: 2px;
}
.dialog-form-wrap {
  min-height: 200px;
  max-height: 70vh;
  overflow-y: auto;
}
.footer-center {
  text-align: center;
}
.footer-center .el-button {
  margin: 0 10px;
}
</style>

<style>
.legacy-layer-dialog .el-dialog__body {
  padding: 12px 16px 8px;
  background: #fafafa;
}
</style>
