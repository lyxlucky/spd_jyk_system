<template>
  <el-dialog
    title="回补定数码(仅缺失定数码的HIS计费数据允许回补定数码)"
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
    <el-form size="small" inline @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="condition"
          clearable
          placeholder="品种名称、二级科室名称、定数码"
          style="width: 280px"
          @keyup.enter.native="loadSource"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="loadSource">查询</el-button>
      </el-form-item>
      <el-form-item class="hint">
        注意：该HIS计费数据需要回补 <b>{{ needQty }}</b> 条定数包数据
      </el-form-item>
    </el-form>
    <el-row :gutter="12">
      <el-col :span="14">
        <el-table
          v-loading="srcLoading"
          :data="sourceRows"
          border
          stripe
          size="small"
          height="240"
          @selection-change="onPickSource"
        >
          <el-table-column type="selection" width="45" :selectable="sourceSelectable" />
          <el-table-column prop="Dept_Two_Name" label="二级科室" width="100" show-overflow-tooltip />
          <el-table-column prop="Varietie_Name" label="品种全称" min-width="140" show-overflow-tooltip />
          <el-table-column prop="Def_No_Pkg_Code" label="定数码" width="130" />
          <el-table-column prop="Specification_Or_Type" label="规格" width="90" show-overflow-tooltip />
          <el-table-column label="库存状态" width="85">
            <template slot-scope="{ row }">{{ fmtStockState(row.Stock_State) }}</template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="2" class="arrow-col">
        <el-button type="primary" icon="el-icon-bottom" circle @click="moveDown" />
        <el-button type="warning" icon="el-icon-top" circle class="mt8" @click="moveUp" />
      </el-col>
      <el-col :span="8">
        <el-table
          :data="pickedRows"
          border
          stripe
          size="small"
          height="240"
          highlight-current-row
          @current-change="(r) => (pickedCurrent = r)"
        >
          <el-table-column prop="Dept_Two_Name" label="科室" width="90" show-overflow-tooltip />
          <el-table-column prop="Varietie_Name" label="品种" min-width="100" show-overflow-tooltip />
          <el-table-column prop="Def_No_Pkg_Code" label="定数码" width="120" />
        </el-table>
      </el-col>
    </el-row>
    <div slot="footer" class="footer-center">
      <el-button @click="innerVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">确认并对冲</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Settle/HishedgingData';
import { fmtIsComplete, fmtIsHedge, fmtStockState } from '../utils';

export default {
  name: 'ReplenishPkgDialog',
  props: {
    visible: Boolean,
    record: { type: Object, default: null }
  },
  data() {
    return {
      condition: '',
      srcLoading: false,
      sourceRows: [],
      sourceSelection: [],
      pickedRows: [],
      pickedCurrent: null,
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
    },
    needQty() {
      return Number(this.record?.Used_Qty) || 0;
    },
    pickedCodes() {
      return new Set(this.pickedRows.map((r) => String(r.Def_No_Pkg_Code)));
    }
  },
  methods: {
    fmtIsComplete,
    fmtIsHedge,
    fmtStockState,
    onOpen() {
      this.condition = '';
      this.sourceRows = [];
      this.pickedRows = [];
      this.pickedCurrent = null;
      this.loadSource();
    },
    sourceSelectable(row) {
      return !this.pickedCodes.has(String(row.Def_No_Pkg_Code));
    },
    async loadSource() {
      if (!this.record?.Charging_Code) return;
      this.srcLoading = true;
      try {
        const d = await api.searchRepaireDefNoPkgCodeArg(this.record.Charging_Code, this.condition);
        this.sourceRows = (d.result || []).filter((r) => !this.pickedCodes.has(String(r.Def_No_Pkg_Code)));
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.srcLoading = false;
      }
    },
    onPickSource(rows) {
      this.sourceSelection = rows;
    },
    moveDown() {
      if (!this.sourceSelection.length) {
        Message.warning('请勾选记录');
        return;
      }
      const add = this.sourceSelection.filter((r) => !this.pickedCodes.has(String(r.Def_No_Pkg_Code)));
      this.pickedRows = this.pickedRows.concat(add);
      this.sourceSelection = [];
      this.loadSource();
    },
    moveUp() {
      if (!this.pickedCurrent) {
        Message.warning('请选择已选列表中的记录');
        return;
      }
      const code = this.pickedCurrent.Def_No_Pkg_Code;
      this.pickedRows = this.pickedRows.filter((r) => r.Def_No_Pkg_Code !== code);
      this.pickedCurrent = null;
      this.loadSource();
    },
    async submit() {
      const n = this.pickedRows.length;
      const need = this.needQty;
      if (n < need) {
        Message.warning('提交数量小于应补数量');
        return;
      }
      if (n > need) {
        Message.warning('提交数量大于应补数量');
        return;
      }
      const codes = this.pickedRows.map((r) => r.Def_No_Pkg_Code);
      this.submitting = true;
      try {
        const d = await api.repairDefToBackPkg(this.record.Id, codes);
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
.arrow-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}
.mt8 {
  margin-top: 8px;
}
.hint b {
  color: #009688;
}
</style>
