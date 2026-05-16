<template>
  <div class="hedge-failure">
    <div class="pane-title">已计费但对冲失败的定数包列表</div>
    <el-form size="small" inline class="toolbar" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="keyword"
          clearable
          placeholder="品种全称、定数码、计费编码模糊搜索"
          style="width: 280px"
          @keyup.enter.native="load(1)"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="hedgeType" style="width: 110px" @change="load(1)">
          <el-option label="全部" :value="-1" />
          <el-option label="对冲失败" :value="2" />
          <el-option label="重复扫码" :value="3" />
          <el-option label="退费" :value="5" />
          <el-option label="异常使用数量" :value="4" />
          <el-option label="未对冲" :value="0" />
          <el-option label="已对冲" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="isDelete" style="width: 100px" @change="load(1)">
          <el-option label="未剔除" value="1" />
          <el-option label="全部" value="-1" />
          <el-option label="已剔除" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="isHaveCharingCode" style="width: 130px" @change="load(1)">
          <el-option label="计费编码已对码" value="1" />
          <el-option label="全部" value="" />
          <el-option label="计费编码未对码" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="defPkgFilter" style="width: 120px" @change="load(1)">
          <el-option label="定数码-全部" value="" />
          <el-option label="定数码-空" value="0" />
          <el-option label="不为空" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
      </el-form-item>
      <el-form-item class="actions">
        <el-button type="primary" plain :loading="exporting" @click="exportExcel">导出</el-button>
        <el-button type="primary" @click="onRestart">重新对冲</el-button>
        <el-button type="primary" @click="onDeptBorrow">定数包补暂借</el-button>
        <el-button v-if="canEditChargingCode" type="primary" @click="openEditCode">修改计费编码</el-button>
        <el-button type="warning" plain @click="onRestore">取消剔除</el-button>
        <el-button type="danger" plain @click="onDelete">剔除</el-button>
        <el-button type="warning" :disabled="!canRefuse" @click="onRefuse">确认退费</el-button>
        <el-button type="primary" @click="openReplace">替换定数码</el-button>
        <el-button type="primary" @click="openReplenish">回补定数码</el-button>
      </el-form-item>
    </el-form>

    <div class="table-shell">
      <el-table
        ref="table"
        v-loading="loading"
        :data="rows"
        border
        stripe
        size="small"
        height="100%"
        highlight-current-row
        @selection-change="(s) => (selected = s)"
        @current-change="onRowSelect"
        @sort-change="onSort"
      >
        <el-table-column type="selection" width="45" fixed="left" />
        <el-table-column prop="His_Varietie_Name" label="HIS品种全称" min-width="150" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Def_No_Pkg_Code" label="定数码" width="150" sortable="custom" class-name="col-highlight" show-overflow-tooltip />
        <el-table-column prop="Charging_Code" label="计费编码" width="90" sortable="custom" class-name="col-highlight" />
        <el-table-column prop="Operation_Number" label="手术编号" width="85" sortable="custom" />
        <el-table-column prop="Hospitalization_Number" label="住院号" width="85" sortable="custom" />
        <el-table-column prop="Patient_Number" label="病患号" width="85" sortable="custom" />
        <el-table-column prop="Opeartion_Charging_Time" label="手术计费时间" width="150" sortable="custom" />
        <el-table-column prop="Used_Qty" label="使用数量" width="85" align="center" sortable="custom" />
        <el-table-column prop="Patient_Dept" label="病人科室" width="85" sortable="custom" />
        <el-table-column prop="Charging_Dept_Name" label="计费科室名称" width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="DEF_DEPT" label="定数码所在科室" width="110" sortable="custom" show-overflow-tooltip />
        <el-table-column prop="Integrate_Time" label="系统对接时间" width="150" sortable="custom" />
        <el-table-column label="是否对冲" width="90" sortable="custom" prop="Is_Hedge">
          <template slot-scope="{ row }">{{ fmtIsHedge(row.Is_Hedge) }}</template>
        </el-table-column>
        <el-table-column label="剔除状态" width="85" sortable="custom" prop="IS_DELETE">
          <template slot-scope="{ row }">{{ fmtIsDelete(row.IS_DELETE) }}</template>
        </el-table-column>
        <el-table-column prop="Reason" label="原因" min-width="120" sortable="custom" show-overflow-tooltip />
        <el-table-column label="完成标志" width="85" sortable="custom" prop="Is_Complete">
          <template slot-scope="{ row }">{{ fmtIsComplete(row.Is_Complete) }}</template>
        </el-table-column>
        <el-table-column prop="Id" label="唯一标识" min-width="80" sortable="custom" show-overflow-tooltip />
      </el-table>
    </div>
    <el-pagination
      class="pager"
      small
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      :page-sizes="[10, 30, 60, 90, 150, 300, 500, 1000]"
      @size-change="onSize"
      @current-change="load"
    />

    <ReplacePkgDialog :visible.sync="replaceVisible" :record="currentRow" @done="load(page)" />
    <ReplenishPkgDialog :visible.sync="replenishVisible" :record="currentRow" @done="load(page)" />

    <el-dialog title="修改计费编码" :visible.sync="editCodeVisible" width="480px" append-to-body>
      <el-form label-width="100px" size="small">
        <el-form-item label="原计费编码">
          <span>{{ currentRow?.Charging_Code }}</span>
        </el-form-item>
        <el-form-item label="新计费编码">
          <el-input v-model="newChargingCode" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editCodeVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="submitEditCode">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui';
import { utils, writeFile } from 'xlsx';
import * as api from '@/api/Settle/HishedgingData';
import { fmtIsComplete, fmtIsDelete, fmtIsHedge } from '../utils';
import ReplacePkgDialog from './ReplacePkgDialog.vue';
import ReplenishPkgDialog from './ReplenishPkgDialog.vue';

export default {
  name: 'HedgeFailurePanel',
  components: { ReplacePkgDialog, ReplenishPkgDialog },
  data() {
    return {
      keyword: '',
      hedgeType: -1,
      isDelete: '1',
      isHaveCharingCode: '1',
      defPkgFilter: '',
      loading: false,
      rows: [],
      total: 0,
      page: 1,
      pageSize: 10,
      sortField: '',
      sortOrder: '',
      selected: [],
      currentRow: null,
      replaceVisible: false,
      replenishVisible: false,
      editCodeVisible: false,
      newChargingCode: '',
      editLoading: false,
      exporting: false
    };
  },
  computed: {
    canRefuse() {
      const r = this.currentRow;
      return r && Number(r.Used_Qty) < 0;
    },
    canEditChargingCode() {
      const list = this.$store.state.user?.info?.permission_group || [];
      return list.some((p) => p.Permission_Url === 'HishedgingData_修改计费编码');
    }
  },
  mounted() {
    this.load(1);
  },
  methods: {
    fmtIsComplete,
    fmtIsDelete,
    fmtIsHedge,
    onRowSelect(row) {
      this.currentRow = row || null;
    },
    onSort({ prop, order }) {
      this.sortField = prop || '';
      this.sortOrder = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : '';
      this.load(1);
    },
    async load(p) {
      this.page = p;
      this.loading = true;
      try {
        const d = await api.searchHedgeFailureDefNoPkgCode({
          defNoPkgCode: this.keyword,
          hedgeType: this.hedgeType,
          isDelete: this.isDelete,
          isHaveCharingCode: this.isHaveCharingCode,
          Def_No_Pkg_Code: this.defPkgFilter,
          field: this.sortField,
          order: this.sortOrder,
          page: p,
          size: this.pageSize
        });
        this.rows = d.result || [];
        this.total = d.total || 0;
        this.currentRow = null;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    onSize(size) {
      this.pageSize = size;
      this.load(1);
    },
    needRow() {
      if (!this.currentRow) {
        Message.warning('请先点击选择一条记录');
        return false;
      }
      return true;
    },
    openReplace() {
      if (!this.needRow()) return;
      this.replaceVisible = true;
    },
    openReplenish() {
      if (!this.needRow()) return;
      this.replenishVisible = true;
    },
    openEditCode() {
      if (!this.currentRow?.Id) {
        Message.warning('请选择记录');
        return;
      }
      this.newChargingCode = '';
      this.editCodeVisible = true;
    },
    async submitEditCode() {
      this.editLoading = true;
      try {
        await api.modifyBeiDaChargingCode(this.currentRow.Id, this.newChargingCode);
        Message.success('修改成功');
        this.editCodeVisible = false;
        this.load(this.page);
      } catch (e) {
        Message.error(e.message || '修改失败');
      } finally {
        this.editLoading = false;
      }
    },
    async onRestart() {
      if (!this.currentRow?.Id) {
        Message.warning('请选择对冲记录');
        return;
      }
      try {
        await MessageBox.confirm('是否确认重新对冲？', '提示', { type: 'warning' });
        await api.upHedgeStateRestart(String(this.currentRow.Id));
        Message.success('修改成功');
        this.load(this.page);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onDeptBorrow() {
      const code = this.currentRow?.Def_No_Pkg_Code;
      if (!code) {
        Message.warning('请选择不为空的定数码');
        return;
      }
      try {
        const d = await api.getDeptId(code);
        Message.success(d.msg || '操作成功');
        this.load(this.page);
      } catch (e) {
        Message.error(e.message || '操作失败');
      }
    },
    async onRefuse() {
      if (!this.currentRow?.Id) return;
      try {
        await MessageBox.confirm('确认退费么？', '提示', { type: 'warning' });
        await api.confirmRefuse([String(this.currentRow.Id)]);
        Message.success('退费成功');
        this.load(this.page);
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '退费失败');
      }
    },
    async onDelete() {
      if (!this.selected.length) {
        Message.warning('请选择记录');
        return;
      }
      try {
        await MessageBox.confirm('确认剔除么？', '提示', { type: 'warning' });
        const ok = await api.deleteHedgeDefNoPkgCode(this.selected);
        if (ok) {
          Message.success('剔除成功');
          this.load(this.page);
        } else {
          Message.error('操作失败');
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async onRestore() {
      if (!this.selected.length) {
        Message.warning('请选择记录');
        return;
      }
      try {
        await MessageBox.confirm('确认恢复剔除么？', '提示', { type: 'warning' });
        const ok = await api.hfDeleteHedgeDefNoPkgCode(this.selected);
        if (ok) {
          Message.success('恢复成功');
          this.load(this.page);
        } else {
          Message.error('操作失败');
        }
      } catch (e) {
        if (e !== 'cancel') Message.error(e.message || '操作失败');
      }
    },
    async exportExcel() {
      this.exporting = true;
      try {
        const d = await api.searchHedgeFailureDefNoPkgCode({
          defNoPkgCode: this.keyword,
          hedgeType: this.hedgeType,
          isDelete: this.isDelete,
          isHaveCharingCode: this.isHaveCharingCode,
          Def_No_Pkg_Code: this.defPkgFilter,
          field: this.sortField,
          order: this.sortOrder,
          page: 1,
          size: 999999
        });
        const list = d.result || [];
        const header = [
          'HIS品种全称',
          '定数码',
          '计费编码',
          '手术编号',
          '住院号',
          '病患号',
          '手术计费时间',
          '使用数量',
          '病人科室',
          '计费科室名称',
          '定数码所在科室',
          '系统对接时间',
          '是否对冲',
          '剔除状态',
          '原因',
          '完成标志',
          '唯一标识'
        ];
        const data = [header];
        list.forEach((r) => {
          data.push([
            r.His_Varietie_Name,
            r.Def_No_Pkg_Code,
            r.Charging_Code,
            r.Operation_Number,
            r.Hospitalization_Number,
            r.Patient_Number,
            r.Opeartion_Charging_Time,
            r.Used_Qty,
            r.Patient_Dept,
            r.Charging_Dept_Name,
            r.DEF_DEPT,
            r.Integrate_Time,
            fmtIsHedge(r.Is_Hedge),
            fmtIsDelete(r.IS_DELETE),
            r.Reason,
            fmtIsComplete(r.Is_Complete),
            r.Id
          ]);
        });
        const sheet = utils.aoa_to_sheet(data);
        const book = utils.book_new();
        utils.book_append_sheet(book, sheet, 'His对冲失败');
        writeFile(book, 'His对冲失败数据.xlsx');
      } catch (e) {
        Message.error(e.message || '导出失败');
      } finally {
        this.exporting = false;
      }
    }
  }
};
</script>

<style scoped>
.pane-title {
  font-weight: 600;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 3px solid #3e9ef7;
}
.table-shell {
  height: 560px;
  min-height: 560px;
}
.pager {
  margin-top: 8px;
  text-align: right;
}
.toolbar >>> .el-form-item {
  margin-bottom: 6px;
}
.actions >>> .el-button {
  margin-bottom: 4px;
}
.hedge-failure >>> .col-highlight {
  background: rgba(0, 150, 136, 0.12);
}
</style>
