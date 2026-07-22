<template>
  <el-dialog
    title="编辑中标信息"
    :visible="visible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
    @open="load"
  >
    <el-form v-loading="loading" size="mini" label-width="150px">
      <el-form-item label="品种编码">
        <el-input :value="varietyCodeNew" disabled />
      </el-form-item>
      <el-form-item label="项目名称（全称）">
        <el-input v-model="form.PROJECT_NAME" />
      </el-form-item>
      <el-form-item label="项目编号（招标编号）">
        <el-input v-model="form.PROJECT_CODE" />
      </el-form-item>
      <el-form-item label="中标生效日期">
        <el-date-picker
          v-model="form.BID_START_DATE"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="中标到期时间">
        <el-date-picker
          v-model="form.BID_END_DATE"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="需求科室">
        <el-input v-model="form.DEMAND_DEPT" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="saving" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { GetSzsmBidInfo, UpdateSzsmBidInfo } from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'SzsmBidDialog',
  props: {
    visible: Boolean,
    rowId: { type: [String, Number], default: '' },
    varietyCodeNew: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      saving: false,
      form: {
        ID: '',
        PROJECT_NAME: '',
        PROJECT_CODE: '',
        BID_START_DATE: '',
        BID_END_DATE: '',
        DEMAND_DEPT: ''
      }
    };
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async load() {
      if (!this.rowId) return;
      this.loading = true;
      try {
        const res = await GetSzsmBidInfo(this.rowId);
        const data = res?.data || res?.result || res || {};
        this.form = {
          ID: data.ID || this.rowId,
          PROJECT_NAME: data.PROJECT_NAME || '',
          PROJECT_CODE: data.PROJECT_CODE || '',
          BID_START_DATE: (data.BID_START_DATE || '').toString().substring(0, 10),
          BID_END_DATE: (data.BID_END_DATE || '').toString().substring(0, 10),
          DEMAND_DEPT: data.DEMAND_DEPT || ''
        };
      } catch (e) {
        this.$message.error(e.message || '查询失败');
        this.updateVisible(false);
      } finally {
        this.loading = false;
      }
    },
    async onSave() {
      this.saving = true;
      try {
        const res = await UpdateSzsmBidInfo(this.form);
        this.$message.success(res.msg || '保存成功');
        this.updateVisible(false);
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
