<template>
  <el-dialog
    :title="`定数备货规则 - ${varietyCodeNew || ''}`"
    :visible="visible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
    @open="load"
  >
    <el-form v-loading="loading" size="mini" label-width="120px">
      <el-form-item label="备货规则">
        <el-select v-model="bhRuleId" clearable filterable style="width: 100%" placeholder="请选择">
          <el-option
            v-for="item in ruleOptions"
            :key="item.ID || item.Id || item.id"
            :label="item.RULE_NAME || item.Rule_Name || item.NAME || String(item.ID)"
            :value="item.ID || item.Id || item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="周期开始日期">
        <el-date-picker
          v-model="bhCycleStartDate"
          type="date"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" size="mini" :loading="saving" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  BhRuleList,
  GetVarietieBhRule,
  SaveVarietieBhRule
} from '@/api/Home/VarietyDataLzhMain';

export default {
  name: 'BhRuleDialog',
  props: {
    visible: Boolean,
    varietieCode: { type: String, default: '' },
    varietyCodeNew: { type: String, default: '' }
  },
  data() {
    return {
      loading: false,
      saving: false,
      ruleOptions: [],
      bhRuleId: '',
      bhCycleStartDate: ''
    };
  },
  methods: {
    updateVisible(v) {
      this.$emit('update:visible', v);
    },
    async load() {
      if (!this.varietieCode) {
        this.$message.warning('请选择品种');
        return;
      }
      this.loading = true;
      try {
        const [rules, cur] = await Promise.all([
          BhRuleList(),
          GetVarietieBhRule(this.varietieCode)
        ]);
        this.ruleOptions = rules.result || [];
        const info = cur.result || {};
        this.bhRuleId = info.BhRuleId ?? info.BH_RULE_ID ?? info.bhRuleId ?? '';
        const d = info.BhCycleStartDate ?? info.BH_CYCLE_START_DATE ?? '';
        this.bhCycleStartDate = d ? String(d).substring(0, 10) : '';
      } catch (e) {
        this.$message.error(e.message || '加载备货规则失败');
      } finally {
        this.loading = false;
      }
    },
    async onSave() {
      this.saving = true;
      try {
        const res = await SaveVarietieBhRule({
          varietieCode: this.varietieCode,
          bhRuleId: this.bhRuleId,
          bhCycleStartDate: this.bhCycleStartDate
        });
        this.$message.success(res.msg || '保存成功');
        this.updateVisible(false);
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>
