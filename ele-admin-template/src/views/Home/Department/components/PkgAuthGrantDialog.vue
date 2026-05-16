<template>
  <el-dialog :title="'二级科室定数包品种授权 — ' + deptTwoName" :visible.sync="visible" width="92%" top="3vh" append-to-body>
    <el-form :inline="true" size="small" @submit.native.prevent>
      <el-form-item label="品种">
        <el-input v-model="keyword" clearable placeholder="编码/名称" style="width: 180px" @keyup.enter.native="search(1)" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search(1)">查询一级散货授权</el-button>
        <el-button type="success" plain :disabled="!picked.length" @click="loadSelectedExtra">加入待授权</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="sourceRows" border stripe height="220" @selection-change="(s) => (picked = s)">
      <el-table-column type="selection" width="45" />
      <el-table-column prop="Varietie_Code_New" label="编码" width="110" />
      <el-table-column prop="Varietie_Name" label="名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="Def_No_Pkg_Coefficient" label="定数包系数" width="90" />
    </el-table>
    <el-pagination
      class="pager"
      small
      background
      layout="total, prev, pager, next"
      :total="sourceTotal"
      :page-size="20"
      :current-page="sourcePage"
      @current-change="search"
    />
    <el-divider content-position="left">待授权列表（填写参数后提交）</el-divider>
    <el-table :data="grantRows" border stripe max-height="280">
      <el-table-column prop="Varietie_Code_New" label="编码" width="110" />
      <el-table-column prop="Varietie_Name" label="名称" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Def_No_Pkg_Coefficient" label="系数" width="70" />
      <el-table-column label="授权到期" width="150">
        <template slot-scope="{ row }">
          <el-date-picker v-model="row.expire" type="date" value-format="yyyy-MM-dd" size="mini" />
        </template>
      </el-table-column>
      <el-table-column label="库存上限" width="100">
        <template slot-scope="{ row }">
          <el-input-number v-model="row.upper" size="mini" :min="0" :controls="false" />
        </template>
      </el-table-column>
      <el-table-column label="库存下限" width="100">
        <template slot-scope="{ row }">
          <el-input-number v-model="row.lower" size="mini" :min="0" :controls="false" />
        </template>
      </el-table-column>
      <el-table-column label="消耗类型" width="130">
        <template slot-scope="{ row }">
          <el-select v-model="row.consumptionType" size="mini">
            <el-option label="扫码消耗" value="0" />
            <el-option label="RFID" value="1" />
            <el-option label="HIS计费" value="2" />
            <el-option label="超时默认" value="5" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ $index }">
          <el-button type="text" size="mini" @click="grantRows.splice($index, 1)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" :loading="saving" @click="submit">确认授权</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import * as api from '@/api/Home/Department';

export default {
  name: 'PkgAuthGrantDialog',
  data() {
    return {
      visible: false,
      loading: false,
      saving: false,
      deptOneCode: '',
      deptTwoCode: '',
      deptTwoName: '',
      keyword: '',
      sourceRows: [],
      picked: [],
      sourceTotal: 0,
      sourcePage: 1,
      grantRows: []
    };
  },
  methods: {
    open(deptOneCode, deptTwoCode, deptTwoName) {
      this.deptOneCode = deptOneCode;
      this.deptTwoCode = deptTwoCode;
      this.deptTwoName = deptTwoName;
      this.keyword = '';
      this.grantRows = [];
      this.visible = true;
      this.search(1);
    },
    async search(p) {
      this.sourcePage = p;
      this.loading = true;
      try {
        const start = (p - 1) * 20 + 1;
        const end = p * 20;
        const { rows, total } = await api.searchDeptOneBulkForPkg(this.deptOneCode, this.keyword, start, end);
        this.sourceRows = rows;
        this.sourceTotal = total;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    async loadSelectedExtra() {
      if (!this.picked.length) return;
      const codes = this.picked.map((r) => `${r.Varietie_Code}-${r.Def_No_Pkg_Coefficient}`).join(',');
      try {
        const { rows } = await api.getDeptTwoSelectedAuthVarExtra(codes, 1, 9999);
        rows.forEach((r) => {
          if (this.grantRows.some((g) => g.Def_No_Pkg_Code === r.Def_No_Pkg_Code)) return;
          this.grantRows.push({
            ...r,
            expire: '2099-01-01',
            upper: 0,
            lower: 0,
            consumptionType: '0',
            rfid: '0',
            receivePlace: '0',
            costDeptState: '1',
            hisNeedTempRecord: '1'
          });
        });
      } catch (e) {
        Message.error(e.message || '加载失败');
      }
    },
    async submit() {
      if (!this.grantRows.length) {
        Message.warning('待授权列表为空');
        return;
      }
      const list = this.grantRows.map((r) => {
        return `{${this.deptTwoCode},${r.Def_No_Pkg_Code},${r.upper},${r.lower},${r.consumptionType},${r.expire},${r.rfid},${r.receivePlace},${r.costDeptState},${r.hisNeedTempRecord}}`;
      });
      this.saving = true;
      try {
        const ok = await api.insertDeptTwoPkgAuth(list);
        if (ok) {
          Message.success('授权成功');
          this.visible = false;
          this.$emit('saved');
        } else {
          Message.error('授权失败');
        }
      } catch (e) {
        Message.error(e.message || '授权失败');
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.pager {
  margin: 8px 0;
  text-align: right;
}
</style>
