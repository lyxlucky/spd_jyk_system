<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="96%"
    top="3vh"
    append-to-body
    :close-on-click-modal="false"
    @open="onOpen"
  >
    <div v-loading="pageLoading" class="auth-dialog">
      <div class="section">
        <div class="section-title">已选品种（单击行可移除）</div>
        <el-table :data="selectedRows" size="mini" stripe max-height="160" @row-click="onSelectedRowClick">
          <el-table-column prop="varietie_code_new" label="品种编码" width="120" show-overflow-tooltip />
          <el-table-column prop="varietie_name" label="品种全称" min-width="160" show-overflow-tooltip />
          <el-table-column prop="approval_number" label="批准文号" width="140" show-overflow-tooltip />
        </el-table>
      </div>

      <div class="search-bar">
        <el-input
          v-model="keyword"
          clearable
          placeholder="请输入关键字搜索"
          style="width: 260px"
          @keyup.enter.native="searchVarieties"
        />
        <el-button type="primary" size="mini" @click="searchVarieties">搜索</el-button>
        <el-checkbox v-model="autoPrice" style="margin-left: 12px">自动赋值采购价跟结算价格</el-checkbox>
        <el-checkbox v-model="autoDate">自动同步授权到期</el-checkbox>
      </div>

      <el-row :gutter="12" class="transfer-row">
        <el-col :span="11">
          <div class="section-title">可选品种</div>
          <el-table
            ref="leftTable"
            :data="leftList"
            size="mini"
            stripe
            height="280"
            @selection-change="(s) => (leftSelection = s)"
          >
            <el-table-column type="selection" width="42" :selectable="leftSelectable" />
            <el-table-column prop="varietie_code_new" label="品种编码" width="110" show-overflow-tooltip />
            <el-table-column prop="varietie_name" label="品种全称" min-width="130" show-overflow-tooltip />
            <el-table-column prop="specification_or_type" label="规格" width="90" show-overflow-tooltip />
            <el-table-column prop="unit" label="单位" width="50" />
            <el-table-column prop="price" label="中标价" width="70" />
            <el-table-column prop="manufacturing_ent_name" label="生产企业" min-width="100" show-overflow-tooltip />
          </el-table>
        </el-col>
        <el-col :span="2" class="arrow-col">
          <el-button type="primary" icon="el-icon-arrow-right" circle @click="moveToRight" />
          <el-button icon="el-icon-arrow-left" circle style="margin-top: 12px; margin-left: 0" @click="moveToLeft" />
        </el-col>
        <el-col :span="11">
          <div class="section-title">待授权品种</div>
          <el-table
            ref="rightTable"
            :data="rightList"
            size="mini"
            stripe
            height="280"
            @selection-change="(s) => (rightSelection = s)"
          >
            <el-table-column type="selection" width="42" />
            <el-table-column prop="varietie_code_new" label="品种编码" width="100" show-overflow-tooltip />
            <el-table-column prop="varietie_name" label="品种全称" min-width="110" show-overflow-tooltip />
            <el-table-column label="采购价" width="90">
              <template slot-scope="{ row }">
                <el-input v-model="row.purchase_price" size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="price" label="中标价" width="70" />
            <el-table-column label="结算价" width="90">
              <template slot-scope="{ row }">
                <el-input v-model="row.supply_price" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="授权到期" width="120">
              <template slot-scope="{ row }">
                <el-input v-model="row.Auth_Valid" size="mini" placeholder="yyyy-MM-dd" @input="onAuthDateInput(row)" />
              </template>
            </el-table-column>
            <el-table-column label="临采数量" width="80">
              <template slot-scope="{ row }">
                <el-input v-model="row.LC_NUM" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="明细合同编码" width="100">
              <template slot-scope="{ row }">
                <el-input v-model="row.DET_CONTRACT_CODE" size="mini" />
              </template>
            </el-table-column>
            <el-table-column label="明细起始" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row.contractStartTime" size="mini" placeholder="yyyy-MM-dd" />
              </template>
            </el-table-column>
            <el-table-column label="明细结束" width="110">
              <template slot-scope="{ row }">
                <el-input v-model="row.contractEndTime" size="mini" placeholder="yyyy-MM-dd" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="onSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getAuthVarietyList,
  getContractHaveAuthorized,
  getContractHaveAuthorizedCoding,
  insertContractAuth
} from '@/api/Home/Contract';
import { HOME_HP } from '@/config/setting';

export default {
  name: 'AddAuthDialog',
  props: {
    visible: Boolean,
    supplier: Object,
    contract: Object
  },
  data() {
    return {
      pageLoading: false,
      submitting: false,
      keyword: '',
      autoPrice: true,
      autoDate: true,
      authorizedCodes: [],
      leftList: [],
      rightList: [],
      leftSelection: [],
      rightSelection: [],
      selectedRows: [],
      syncAuthDate: ''
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
    dialogTitle() {
      const s = this.supplier?.Supplier_Name || '';
      const c = this.contract?.Contract_Name || '';
      return `${s}--${c} 品种授权`;
    },
    contractType() {
      return this.contract?.contract_Type;
    },
    requireAuthDate() {
      return ['stzyyy', 'csyy', 'chrmyy'].includes(HOME_HP);
    }
  },
  methods: {
    async onOpen() {
      this.keyword = '';
      this.leftList = [];
      this.rightList = [];
      this.selectedRows = [];
      this.leftSelection = [];
      this.rightSelection = [];
      this.pageLoading = true;
      try {
        const list = await getContractHaveAuthorized(this.contract?.Contract_Code);
        this.authorizedCodes = (list || []).map((x) => String(x.varietie_code));
        await this.searchVarieties();
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.pageLoading = false;
      }
    },
    leftSelectable(row) {
      return !this.authorizedCodes.includes(String(row.varietie_code));
    },
    async searchVarieties() {
      try {
        const res = await getAuthVarietyList({
          supplierCode: this.supplier?.Supplier_Code,
          contractCode: this.contract?.Contract_Code,
          keyword: this.keyword
        });
        this.leftList = (res.list || []).map((r) => ({
          ...r,
          varietie_code_new: r.varietie_code_new || r.Varietie_Code_New
        }));
      } catch (e) {
        this.$message.error(e.message || '搜索失败');
      }
    },
    async moveToRight() {
      if (!this.leftSelection.length) {
        this.$message.warning('请勾选要移入的品种');
        return;
      }
      const codes = this.leftSelection.map((r) => r.varietie_code).join(',') + ',';
      try {
        const res = await getContractHaveAuthorizedCoding(codes);
        const items = (res.list || []).map((r) => {
          const price = r.price;
          const tempPrice = this.autoPrice ? price : '';
          return {
            ...r,
            varietie_code_new: r.varietie_code_new || r.Varietie_Code_New,
            purchase_price: tempPrice,
            supply_price: tempPrice,
            Auth_Valid: '',
            LC_NUM: '',
            DET_CONTRACT_CODE: '',
            contractStartTime: '',
            contractEndTime: ''
          };
        });
        const exist = new Set(this.rightList.map((x) => String(x.varietie_code)));
        items.forEach((item) => {
          if (!exist.has(String(item.varietie_code))) {
            this.rightList.push(item);
            if (!this.authorizedCodes.includes(String(item.varietie_code))) {
              this.authorizedCodes.push(String(item.varietie_code));
            }
          }
        });
        this.$refs.leftTable?.clearSelection();
        await this.searchVarieties();
      } catch (e) {
        this.$message.error(e.message || '加载品种失败');
      }
    },
    moveToLeft() {
      if (!this.rightSelection.length) return;
      const removeCodes = new Set(this.rightSelection.map((r) => String(r.varietie_code)));
      this.rightList = this.rightList.filter((r) => !removeCodes.has(String(r.varietie_code)));
      this.authorizedCodes = this.authorizedCodes.filter((c) => !removeCodes.has(String(c)));
      this.searchVarieties();
    },
    onAuthDateInput(row) {
      if (this.autoDate && row.Auth_Valid) {
        this.syncAuthDate = row.Auth_Valid;
        this.rightList.forEach((r) => {
          r.Auth_Valid = this.syncAuthDate;
        });
      }
    },
    onSelectedRowClick(row) {
      this.selectedRows = [row];
    },
    validateRow(row) {
      const price = Number(row.price);
      const supply = Number(row.supply_price);
      const purchase = Number(row.purchase_price);
      if (Number(row.LC_NUM) < 0) {
        return '临采数量不能小于0';
      }
      if (this.requireAuthDate) {
        if (!row.Auth_Valid) return '授权到期为必填项';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(row.Auth_Valid)) return '请输入正确的授权到期日期格式';
        if (String(this.contractType) === '2' && (row.LC_NUM === '' || row.LC_NUM == null)) {
          return '临采合同必须填写临采数量';
        }
      }
      if (supply > price) return '结算价不能大于中标价';
      if (purchase > price) return '采购价不能大于中标价';
      return '';
    },
    async onSubmit() {
      if (!this.rightList.length) {
        this.$message.warning('请先添加待授权品种');
        return;
      }
      const arrList = [];
      for (const row of this.rightList) {
        const err = this.validateRow(row);
        if (err) {
          this.$message.warning(err);
          return;
        }
        const supply = parseFloat(row.supply_price).toFixed(4);
        const purchase = parseFloat(row.purchase_price).toFixed(4);
        const item = `{${row.varietie_code},${this.contract?.Contract_Code},${supply},${purchase},${row.Auth_Valid || ''},${row.LC_NUM || 0},${row.contractStartTime || ''},${row.contractEndTime || ''},${row.DET_CONTRACT_CODE || ''}}`;
        arrList.push(item);
      }
      this.submitting = true;
      try {
        await insertContractAuth(JSON.stringify(arrList));
        this.$message.success('授权成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '授权失败');
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-dialog .section-title {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 13px;
}
.search-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}
.transfer-row {
  margin-top: 8px;
}
.arrow-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}
</style>
