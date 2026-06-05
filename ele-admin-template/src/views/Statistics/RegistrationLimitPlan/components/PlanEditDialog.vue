<template>
  <el-dialog
    :title="isEdit ? '编辑注册证限量' : '新增注册证限量'"
    :visible="visible"
    width="1280px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @update:visible="updateVisible"
  >
    <el-form
      ref="form"
      v-loading="loading"
      size="small"
      label-width="96px"
      class="edit-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="限制名称" required>
            <el-input v-model="form.limitPlanName" placeholder="请输入限制名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="限制总数量" required>
            <el-input-number
              v-model="form.limitPlanNum"
              :min="0"
              :precision="2"
              :controls="false"
              style="width: 100%"
              placeholder="请输入限制总数量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间" required>
            <el-date-picker
              v-model="form.limitPlanStartTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" required>
            <el-date-picker
              v-model="form.limitPlanEndTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择结束时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-select v-model="form.isEnable" style="width: 100%">
              <el-option label="启用" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="form.mark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="detail-toolbar">
      <el-button type="primary" size="small" @click="showRegSelect = true">
        选择注册证
      </el-button>
      <el-button type="danger" size="small" @click="removeSelected">
        移除选中
      </el-button>
    </div>
    <ele-pro-table
      ref="detailTable"
      :height="320"
      :columns="detailColumns"
      :datasource="detailDatasource"
      :selection.sync="detailSelection"
      :page-size="20"
      :page-sizes="[10, 20, 50, 100]"
      cache-key="RegistrationLimitPlanEditDetail"
    />
    <RegistrationSelectDialog
      :visible.sync="showRegSelect"
      @confirm="onRegistrationConfirm"
    />
    <template v-slot:footer>
      <el-button @click="updateVisible(false)">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import {
  getProdLimitPlanMainSingle,
  getProdLimitPlanDetList,
  saveProdLimitPlan
} from '@/api/Statistics/RegistrationLimitPlan';
import { formatDate } from '../utils';
import RegistrationSelectDialog from './RegistrationSelectDialog.vue';

export default {
  name: 'PlanEditDialog',
  components: { RegistrationSelectDialog },
  props: {
    visible: Boolean,
    planId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      loading: false,
      saving: false,
      showRegSelect: false,
      form: {
        limitPlanName: '',
        limitPlanNum: undefined,
        limitPlanStartTime: '',
        limitPlanEndTime: '',
        isEnable: '1',
        mark: ''
      },
      selectedDetails: [],
      detailSelection: [],
      detailColumns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center'
        },
        {
          columnKey: 'index',
          type: 'index',
          label: '序号',
          width: 60,
          align: 'center'
        },
        {
          prop: 'PROD_CODE',
          label: '注册证编码',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'PROD_APPROVAL_NUMBER',
          label: '注册证号',
          minWidth: 180,
          showOverflowTooltip: true
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          minWidth: 220,
          showOverflowTooltip: true
        }
      ]
    };
  },
  computed: {
    isEdit() {
      return this.planId != null && this.planId !== '';
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.loadData();
      }
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    async loadData() {
      this.selectedDetails = [];
      this.detailSelection = [];
      this.form = {
        limitPlanName: '',
        limitPlanNum: undefined,
        limitPlanStartTime: '',
        limitPlanEndTime: '',
        isEnable: '1',
        mark: ''
      };
      if (!this.isEdit) {
        this.reloadDetailTable();
        return;
      }
      this.loading = true;
      try {
        const [main, details] = await Promise.all([
          getProdLimitPlanMainSingle(this.planId),
          getProdLimitPlanDetList(this.planId)
        ]);
        this.form = {
          limitPlanName: main?.LIMIT_PLAN_NAME || '',
          limitPlanNum: main?.LIMIT_PLAN_NUM,
          limitPlanStartTime: formatDate(main?.LIMIT_PLAN_START_TIME),
          limitPlanEndTime: formatDate(main?.LIMIT_PLAN_END_TIME),
          isEnable: main?.IS_ENBALE || '1',
          mark: main?.MARK || ''
        };
        this.selectedDetails = (details || []).map((item) => ({ ...item }));
        this.reloadDetailTable();
      } catch (e) {
        Message.error(e.message || '加载方案失败');
        this.updateVisible(false);
      } finally {
        this.loading = false;
      }
    },
    detailDatasource({ page, limit }) {
      const start = (page - 1) * limit;
      const list = this.selectedDetails.slice(start, start + limit);
      return Promise.resolve({
        count: this.selectedDetails.length,
        list
      });
    },
    reloadDetailTable() {
      this.$refs.detailTable?.reload({ page: 1 });
    },
    onRegistrationConfirm(rows) {
      const existMap = {};
      this.selectedDetails.forEach((item) => {
        existMap[item.PROD_CODE] = true;
      });
      rows.forEach((row) => {
        if (!existMap[row.PROD_CODE]) {
          this.selectedDetails.push(row);
          existMap[row.PROD_CODE] = true;
        }
      });
      this.reloadDetailTable();
    },
    removeSelected() {
      if (!this.detailSelection.length) {
        Message.warning('请先勾选要移除的注册证');
        return;
      }
      const removeMap = {};
      this.detailSelection.forEach((item) => {
        removeMap[item.PROD_CODE] = true;
      });
      this.selectedDetails = this.selectedDetails.filter((item) => !removeMap[item.PROD_CODE]);
      this.detailSelection = [];
      this.reloadDetailTable();
    },
    async save() {
      const limitPlanName = (this.form.limitPlanName || '').trim();
      if (!limitPlanName) {
        Message.warning('请输入限制名称');
        return;
      }
      if (!this.form.limitPlanNum || Number(this.form.limitPlanNum) <= 0) {
        Message.warning('限制总数量必须大于0');
        return;
      }
      if (!this.form.limitPlanStartTime || !this.form.limitPlanEndTime) {
        Message.warning('请选择限制起止时间');
        return;
      }
      if (
        new Date(this.form.limitPlanStartTime.replace(/-/g, '/')) >
        new Date(this.form.limitPlanEndTime.replace(/-/g, '/'))
      ) {
        Message.warning('开始时间不能大于结束时间');
        return;
      }
      if (!this.selectedDetails.length) {
        Message.warning('请至少选择一条注册证明细');
        return;
      }
      this.saving = true;
      try {
        await saveProdLimitPlan({
          id: this.isEdit ? this.planId : '',
          limitPlanName,
          limitPlanNum: Number(this.form.limitPlanNum),
          limitPlanStartTime: this.form.limitPlanStartTime,
          limitPlanEndTime: this.form.limitPlanEndTime,
          isEnable: this.form.isEnable,
          mark: (this.form.mark || '').trim(),
          details: this.selectedDetails.map((item) => ({
            ProdCode: item.PROD_CODE,
            ProdApprovalNumber: item.PROD_APPROVAL_NUMBER,
            ProdRegistrationName: item.PROD_REGISTRATION_NAME
          }))
        });
        Message.success('保存成功');
        this.$emit('done');
        this.updateVisible(false);
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.edit-form {
  margin-bottom: 8px;
}
.detail-toolbar {
  margin-bottom: 10px;
}
</style>
