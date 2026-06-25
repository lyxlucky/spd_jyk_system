<template>
  <el-dialog
    title="替换定数码(仅应用于针对重复扫码的HIS计算数据)"
    :visible.sync="innerVisible"
    width="92%"
    top="4vh"
    append-to-body
    @open="onOpen"
  >
    <el-table v-if="record" :data="[record]" border size="mini" class="mb8">
      <el-table-column prop="His_Varietie_Name" label="HIS品种全称" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Def_No_Pkg_Code" label="定数码" width="110" />
      <el-table-column prop="Charging_Code" label="计费编码" width="90" />
      <el-table-column prop="Operation_Number" label="手术编号" width="80" />
      <el-table-column prop="Hospitalization_Number" label="住院号" width="80" />
      <el-table-column prop="Patient_Number" label="病患号" width="80" />
      <el-table-column prop="Opeartion_Charging_Time" label="手术计费时间" width="140" />
      <el-table-column prop="Used_Qty" label="使用数量" width="70" align="center" />
      <el-table-column prop="Patient_Dept" label="病人科室" width="80" />
      <el-table-column label="完成标志" width="80">
        <template slot-scope="{ row }">{{ fmtIsComplete(row.Is_Complete) }}</template>
      </el-table-column>
      <el-table-column prop="Integrate_Time" label="系统对接时间" width="140" />
      <el-table-column label="是否对冲" width="80">
        <template slot-scope="{ row }">{{ fmtIsHedge(row.Is_Hedge) }}</template>
      </el-table-column>
    </el-table>
    <el-form size="mini" :inline="true" class="ele-form-search" @submit.native.prevent>
      <el-form-item label="定数码">
        <el-input v-model="searchCode" clearable placeholder="定数码" style="width: 200px" @keyup.enter.native="load" />
      </el-form-item>
      <el-form-item class="ele-form-actions">
        <el-button type="primary" icon="el-icon-search" @click="load">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="candidates"
      border
      stripe
      size="mini"
      height="480"
      highlight-current-row
      @current-change="(r) => (picked = r)"
    >
      <el-table-column prop="Dept_Two_Name" label="科室名称" width="100" show-overflow-tooltip />
      <el-table-column prop="Dept_Two_Code" label="科室编码" width="90" />
      <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="90" />
      <el-table-column prop="Charging_Code" label="计费编码" width="90" />
      <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="型号/规格" width="90" show-overflow-tooltip />
      <el-table-column prop="Unit" label="单位" width="55" />
      <el-table-column prop="Manufacturing_Ent_Name" label="生产企业" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Batch" label="生产批号" width="90" />
      <el-table-column prop="Coefficient" label="系数" width="55" />
      <el-table-column prop="Def_No_Pkg_Code" label="定数码" width="130" class-name="col-pkg" />
      <el-table-column prop="Serial_Number" label="SN码" width="100" show-overflow-tooltip />
      <el-table-column prop="Rfid_Code" label="RFID码" width="100" show-overflow-tooltip />
      <el-table-column label="库存状态" width="85">
        <template slot-scope="{ row }">{{ fmtStockState(row.Stock_State) }}</template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="footer-center">
      <el-button size="mini" @click="innerVisible = false">取消</el-button>
      <el-button size="mini" type="primary" :loading="submitting" @click="submit">替换并对冲</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Settle/HishedgingData';
import { fmtIsComplete, fmtIsHedge, fmtStockState } from '../utils';

export default {
  name: 'ReplacePkgDialog',
  props: {
    visible: Boolean,
    record: { type: Object, default: null }
  },
  data() {
    return {
      searchCode: '',
      loading: false,
      candidates: [],
      picked: null,
      submitting: false
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    fmtIsComplete,
    fmtIsHedge,
    fmtStockState,
    onOpen() {
      this.searchCode = '';
      this.picked = null;
      this.load();
    },
    async load() {
      if (!this.record) return;
      this.loading = true;
      try {
        const d = await api.loadReplaceDefNoPkgCodes({
          defNoPkgCode: this.record.Def_No_Pkg_Code,
          Charging_Code: this.record.Charging_Code,
          searchDefNoPkgCode: this.searchCode
        });
        this.candidates = d.result || [];
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      if (!this.picked) {
        Message.warning('请选择一条定数码记录');
        return;
      }
      this.submitting = true;
      try {
        const d = await api.replaceDefToPkg(
          this.record.Id,
          this.record.Def_No_Pkg_Code,
          this.picked.Def_No_Pkg_Code
        );
        Message.success(d.msg || '操作成功');
        this.innerVisible = false;
        this.$emit('done');
      } catch (e) {
        Message.error(e.message || '操作失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.mb8 {
  margin-bottom: 8px;
}
.footer-center {
  text-align: center;
}
 .col-pkg {
  background: rgba(0, 150, 136, 0.15);
}
</style>
