<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="440px" append-to-body :close-on-click-modal="false">
    <el-form label-width="130px" size="small">
      <el-form-item v-if="type === 'extend'" label="原合同明细结束">
        <el-date-picker v-model="form.origEnd" type="date" value-format="yyyy-MM-dd" style="width: 100%" />
      </el-form-item>
      <el-form-item v-if="type === 'extend'" label="是否延期合同">
        <el-select v-model="form.isExtended" style="width: 100%">
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === 'auditMark'" label="合同明细备注">
        <el-input v-model="form.auditMark" type="textarea" :rows="4" maxlength="255" show-word-limit />
      </el-form-item>
      <el-form-item v-if="type === 'lcNum'" label="临采数量">
        <el-input v-model="form.lcNum" />
      </el-form-item>
      <el-form-item v-if="type === 'varType'" label="品种类型">
        <el-select v-model="form.varType" style="width: 100%">
          <el-option label="常规品种" value="0" />
          <el-option label="平替品种" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  updateContractAuditMark,
  updateContractExtend,
  updateContractVarType,
  updateLcNum
} from '@/api/Home/Contract';

const TITLES = {
  extend: '修改原合同明细结束/是否延期',
  auditMark: '修改合同明细备注',
  lcNum: '修改临采数量',
  varType: '修改品种类型'
};

export default {
  name: 'BatchFieldDialog',
  props: {
    visible: Boolean,
    type: { type: String, required: true },
    rows: { type: Array, default: () => [] }
  },
  data() {
    return {
      loading: false,
      form: { origEnd: '', isExtended: '0', auditMark: '', lcNum: '', varType: '0' }
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    title() {
      return TITLES[this.type] || '';
    },
    guids() {
      return (this.rows || []).map((r) => r.contract_detail_guid).filter(Boolean);
    }
  },
  methods: {
    async onSubmit() {
      if (!this.guids.length) {
        this.$message.warning('请至少勾选一行');
        return;
      }
      this.loading = true;
      try {
        if (this.type === 'extend') {
          await updateContractExtend(this.guids, this.form.origEnd, this.form.isExtended);
        } else if (this.type === 'auditMark') {
          await updateContractAuditMark(this.guids, this.form.auditMark);
        } else if (this.type === 'lcNum') {
          if (this.guids.length !== 1) {
            this.$message.warning('请选择一行数据');
            return;
          }
          await updateLcNum(this.guids[0], this.form.lcNum);
        } else if (this.type === 'varType') {
          await updateContractVarType(this.guids, this.form.varType);
        }
        this.$message.success('修改成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '修改失败');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
