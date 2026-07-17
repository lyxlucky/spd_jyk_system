<template>
  <el-dialog
    title="经营范围授权"
    :visible.sync="dialogVisible"
    width="1100px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @open="loadData"
    @closed="onClosed"
  >
    <div v-loading="loading" class="scope-wrap">
      <div class="scope-panel">
        <div class="scope-panel__head">全部监管类别</div>
        <el-input v-model="leftFilter" size="mini" clearable placeholder="过滤条件" class="scope-filter" />
        <el-table
          ref="leftTable"
          :data="leftFiltered"
          height="420"
          size="mini"
          border
          @selection-change="(rows) => (leftSelection = rows)"
        >
          <el-table-column type="selection" width="40" :selectable="leftSelectable" />
          <el-table-column prop="Prod_Big_Class_Name" label="产品类别" min-width="100" show-overflow-tooltip />
          <el-table-column prop="Mgmt_Cat_Name" label="管理类别" min-width="90" show-overflow-tooltip />
          <el-table-column label="监管类别" min-width="140" show-overflow-tooltip>
            <template v-slot="{ row }">{{ formatRegCat(row) }}</template>
          </el-table-column>
        </el-table>
      </div>

      <div class="scope-actions">
        <el-button type="primary" icon="el-icon-arrow-right" :disabled="!leftSelection.length" @click="moveRight" />
        <el-button type="primary" icon="el-icon-arrow-left" :disabled="!rightSelection.length" @click="moveLeft" />
      </div>

      <div class="scope-panel">
        <div class="scope-panel__head">已授权经营范围</div>
        <el-input v-model="rightFilter" size="mini" clearable placeholder="过滤条件" class="scope-filter" />
        <el-table
          ref="rightTable"
          :data="rightFiltered"
          height="420"
          size="mini"
          border
          @selection-change="(rows) => (rightSelection = rows)"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="Prod_Big_Class_Name" label="产品类别" min-width="100" show-overflow-tooltip />
          <el-table-column prop="Mgmt_Cat_Name" label="管理类别" min-width="90" show-overflow-tooltip />
          <el-table-column label="监管类别" min-width="140" show-overflow-tooltip>
            <template v-slot="{ row }">{{ formatRegCat(row) }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRegulatoryAll, getScopeList, updateScope } from '@/api/Home/Supplier';

function rowKey(row) {
  return String(row.Regulatory_id ?? row.Supervise_Cat_Code ?? '');
}

export default {
  name: 'ScopeDialog',
  props: {
    visible: Boolean,
    supplierCode: [String, Number]
  },
  data() {
    return {
      loading: false,
      saving: false,
      allList: [],
      rightList: [],
      originIds: [],
      leftFilter: '',
      rightFilter: '',
      leftSelection: [],
      rightSelection: []
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
    rightIdSet() {
      return new Set(this.rightList.map((r) => rowKey(r)));
    },
    leftFiltered() {
      return this.filterRows(this.allList, this.leftFilter);
    },
    rightFiltered() {
      return this.filterRows(this.rightList, this.rightFilter);
    }
  },
  methods: {
    formatRegCat(row) {
      if (row.Regulatory_Cat_Name === '无') return '无';
      return `${row.Regulatory_Cat_Code || ''}${row.Regulatory_Cat_Name || ''}`;
    },
    filterRows(list, keyword) {
      const k = (keyword || '').trim().toLowerCase();
      if (!k) return list;
      return list.filter((r) => {
        const text = [
          r.Prod_Big_Class_Name,
          r.Mgmt_Cat_Name,
          r.Regulatory_Cat_Code,
          r.Regulatory_Cat_Name
        ]
          .join(' ')
          .toLowerCase();
        return text.includes(k);
      });
    },
    leftSelectable(row) {
      return !this.rightIdSet.has(rowKey(row));
    },
    async loadData() {
      if (!this.supplierCode) return;
      this.loading = true;
      this.leftFilter = '';
      this.rightFilter = '';
      this.leftSelection = [];
      this.rightSelection = [];
      try {
        const [allRes, scopeRes] = await Promise.all([
          getRegulatoryAll(),
          getScopeList(this.supplierCode)
        ]);
        this.allList = (allRes.result || []).map((r) => ({
          ...r,
          Regulatory_id: String(r.Regulatory_id)
        }));
        this.rightList = (scopeRes.result || []).map((r) => ({
          Regulatory_id: String(r.Supervise_Cat_Code),
          Supervise_Cat_Code: String(r.Supervise_Cat_Code),
          Prod_Big_Class_Name: r.Prod_Big_Class_Name,
          Mgmt_Cat_Name: r.Mgmt_Cat_Name,
          Regulatory_Cat_Code: r.Regulatory_Cat_Code,
          Regulatory_Cat_Name: r.Regulatory_Cat_Name
        }));
        this.originIds = this.rightList.map((r) => rowKey(r));
      } catch (e) {
        this.$message.error(e.message || '加载经营范围失败');
        this.allList = [];
        this.rightList = [];
        this.originIds = [];
      } finally {
        this.loading = false;
      }
    },
    moveRight() {
      const add = this.leftSelection.filter((r) => !this.rightIdSet.has(rowKey(r)));
      this.rightList = [
        ...this.rightList,
        ...add.map((r) => ({
          ...r,
          Supervise_Cat_Code: rowKey(r)
        }))
      ];
      this.$refs.leftTable?.clearSelection();
      this.leftSelection = [];
    },
    moveLeft() {
      const remove = new Set(this.rightSelection.map((r) => rowKey(r)));
      this.rightList = this.rightList.filter((r) => !remove.has(rowKey(r)));
      this.$refs.rightTable?.clearSelection();
      this.rightSelection = [];
    },
    hasChanged() {
      const now = this.rightList.map((r) => rowKey(r)).sort();
      const old = [...this.originIds].sort();
      if (now.length !== old.length) return true;
      return now.some((id, i) => id !== old[i]);
    },
    async onSave() {
      if (!this.hasChanged()) {
        this.dialogVisible = false;
        return;
      }
      this.saving = true;
      try {
        await updateScope(
          this.supplierCode,
          this.rightList.map((r) => rowKey(r))
        );
        this.$message.success('经营范围授权成功');
        this.dialogVisible = false;
        this.$emit('done');
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    onClosed() {
      this.saving = false;
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.scope-wrap {
  display: flex;
  gap: 12px;
  align-items: stretch;
}
.scope-panel {
  flex: 1;
  min-width: 0;
}
.scope-panel__head {
  font-weight: 600;
  margin-bottom: 8px;
}
.scope-filter {
  margin-bottom: 8px;
}
.scope-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
</style>
