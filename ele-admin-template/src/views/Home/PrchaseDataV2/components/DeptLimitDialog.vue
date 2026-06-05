<template>
  <el-dialog
    custom-class="legacy-layer-dialog"
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="92%"
    top="4vh"
    append-to-body
    @opened="onOpened"
    @closed="onClosed"
  >
    <div class="toolbar">
      <el-input
        v-model="deptQuery"
        size="small"
        clearable
        placeholder="请输入二级科室编码/名称"
        style="width: 260px"
        @keyup.enter.native="loadMain"
      />
      <el-button type="primary" size="small" icon="el-icon-search" @click="loadMain">查询</el-button>
      <el-button type="warning" size="small" icon="el-icon-plus" @click="addVisible = true">添加科室</el-button>
      <el-button type="primary" size="small" icon="el-icon-check" :loading="saving" plain @click="saveMain">
        保存
      </el-button>
      <span class="hint">这里只显示当前项目已维护的科室，留空或0后保存会清除该科室维护</span>
    </div>
    <el-table
      v-loading="loading"
      :data="deptRows"
      border
      stripe
      size="small"
      height="calc(70vh - 100px)"
    >
      <el-table-column prop="DEPT_TWO_CODE" label="二级科室编码" width="160" sortable />
      <el-table-column prop="DEPT_TWO_NAME" label="二级科室名称" min-width="200" show-overflow-tooltip />
      <el-table-column label="科室监测量" width="140">
        <template slot-scope="{ row }">
          <el-input v-model="row.DEPT_LIMIT_QTY" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="GOODS_QTY" label="科室已用量" width="110" align="right" sortable />
      <el-table-column prop="WCL" label="科室完成率%" width="110" align="right" sortable />
      <el-table-column prop="PRICE" label="单价" width="90" sortable />
      <el-table-column label="起始日期" width="105">
        <template slot-scope="{ row }">{{ fmtDate10(row.BUY_TIME) }}</template>
      </el-table-column>
      <el-table-column label="结束日期" width="105">
        <template slot-scope="{ row }">{{ fmtDate10(row.BUY_TIME2) }}</template>
      </el-table-column>
      <el-table-column prop="XM_NUM" label="项目编号" min-width="120" show-overflow-tooltip />
      <el-table-column prop="XM_NAME" label="项目名称" min-width="140" show-overflow-tooltip />
      <el-table-column prop="XM_TYPE" label="项目类型" min-width="110" show-overflow-tooltip />
      <el-table-column prop="APPROVAL_NUMBER" label="注册证号" min-width="130" show-overflow-tooltip />
      <el-table-column prop="PROD_REGISTRATION_NAME" label="注册证名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" width="90" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="danger" size="mini" plain @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加科室"
      :visible.sync="addVisible"
      width="860px"
      append-to-body
      @opened="onAddOpened"
    >
      <div class="toolbar">
        <el-input
          v-model="addDeptQuery"
          size="small"
          clearable
          placeholder="请输入二级科室编码/名称"
          style="width: 260px"
          @keyup.enter.native="loadAddList(1)"
        />
        <el-button type="primary" size="small" icon="el-icon-search" @click="loadAddList(1)">查询</el-button>
        <el-button type="primary" size="small" :loading="adding" @click="confirmAdd">添加选中科室</el-button>
        <span class="hint">请填写科室监测量后再添加</span>
      </div>
      <el-table
        ref="addTable"
        v-loading="addLoading"
        :data="addRows"
        border
        stripe
        size="small"
        height="480px"
        @selection-change="onAddSelection"
      >
        <el-table-column type="selection" width="42" />
        <el-table-column prop="DEPT_TWO_CODE" label="二级科室编码" width="160" sortable />
        <el-table-column prop="DEPT_TWO_NAME" label="二级科室名称" min-width="200" show-overflow-tooltip />
        <el-table-column label="科室监测量" width="160">
          <template slot-scope="{ row }">
            <el-input
              v-model="addQtyMap[row.DEPT_TWO_CODE]"
              size="mini"
              type="number"
              min="0"
              placeholder="请输入监测量"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        small
        background
        layout="total, sizes, prev, pager, next"
        :total="addTotal"
        :page-size="addPageSize"
        :current-page="addPage"
        :page-sizes="[20, 50, 100, 200]"
        @size-change="onAddPageSizeChange"
        @current-change="loadAddList"
      />
    </el-dialog>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui';
import { getLimitDept, getLimitDeptAddList, saveLimitDept } from '@/api/Home/PrchaseDataV2';
import { fmtDate10 } from '../utils';

export default {
  name: 'DeptLimitDialog',
  props: {
    visible: { type: Boolean, default: false },
    row: { type: Object, default: null }
  },
  data() {
    return {
      deptQuery: '',
      deptRows: [],
      loading: false,
      saving: false,
      addVisible: false,
      addDeptQuery: '',
      addRows: [],
      addLoading: false,
      addSelection: [],
      addQtyMap: {},
      addTotal: 0,
      addPage: 1,
      addPageSize: 20,
      adding: false
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
    buyId() {
      return this.row?.ID ?? '';
    },
    dialogTitle() {
      const name = this.row?.PROD_REGISTRATION_NAME || '';
      return `科室监测量维护${name ? ' - ' + name : ''}`;
    }
  },
  methods: {
    fmtDate10,
    onOpened() {
      this.loadMain();
    },
    onClosed() {
      this.deptQuery = '';
      this.deptRows = [];
      this.addVisible = false;
    },
    onAddOpened() {
      this.addDeptQuery = '';
      this.addQtyMap = {};
      this.loadAddList(1);
    },
    async loadMain() {
      if (!this.buyId) return;
      this.loading = true;
      try {
        const res = await getLimitDept(this.buyId, this.deptQuery, 1, 2000);
        this.deptRows = (res.result || []).map((r) => ({ ...r }));
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.loading = false;
      }
    },
    removeRow(row) {
      const code = row.DEPT_TWO_CODE;
      this.deptRows = this.deptRows.filter((item) => item.DEPT_TWO_CODE !== code);
    },
    buildSavePayload(rows, validateEmptyQty) {
      const saveData = [];
      const emptyNames = [];
      for (let i = 0; i < rows.length; i++) {
        const item = rows[i];
        let qty = item.DEPT_LIMIT_QTY;
        if (qty === null || qty === undefined || qty === '') {
          if (validateEmptyQty) {
            emptyNames.push(item.DEPT_TWO_NAME || item.DEPT_TWO_CODE || `第${i + 1}行`);
          }
          continue;
        }
        const qtyNumber = parseFloat(qty);
        if (Number.isNaN(qtyNumber)) {
          throw new Error('科室监测量请输入数字');
        }
        if (qtyNumber <= 0) {
          continue;
        }
        saveData.push({
          ID: item.ID || 0,
          PROD_REGISTRATION_LIMIT_BUY_ID: this.buyId,
          DEPT_TWO_CODE: item.DEPT_TWO_CODE,
          DEPT_TWO_NAME: item.DEPT_TWO_NAME,
          DEPT_LIMIT_QTY: qtyNumber
        });
      }
      if (validateEmptyQty && emptyNames.length) {
        throw new Error(`以下科室未填写监测量：${emptyNames.join('、')}，请填写后再保存`);
      }
      return saveData;
    },
    async persist(rows, validateEmptyQty) {
      const payload = this.buildSavePayload(rows, validateEmptyQty);
      return saveLimitDept(this.buyId, payload);
    },
    async saveMain() {
      this.saving = true;
      try {
        const res = await this.persist(this.deptRows, true);
        Message.success(res.msg || '保存成功');
        await this.loadMain();
        this.$emit('done');
      } catch (e) {
        Message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    onAddSelection(sel) {
      this.addSelection = sel;
    },
    onAddPageSizeChange(size) {
      this.addPageSize = size;
      this.loadAddList(1);
    },
    async loadAddList(page) {
      if (!this.buyId) return;
      this.addPage = page || 1;
      this.addLoading = true;
      try {
        const res = await getLimitDeptAddList(
          this.buyId,
          this.addDeptQuery,
          this.addPage,
          this.addPageSize
        );
        this.addRows = res.result || [];
        this.addTotal = res.total || 0;
      } catch (e) {
        Message.error(e.message || '加载失败');
      } finally {
        this.addLoading = false;
      }
    },
    async confirmAdd() {
      if (!this.addSelection.length) {
        Message.warning('请选择要添加的科室');
        return;
      }
      for (const item of this.addSelection) {
        const qty = this.addQtyMap[item.DEPT_TWO_CODE];
        if (qty === null || qty === undefined || qty === '') {
          Message.warning(
            `请先填写科室【${item.DEPT_TWO_NAME || item.DEPT_TWO_CODE}】的监测量`
          );
          return;
        }
        const qtyNumber = parseFloat(qty);
        if (Number.isNaN(qtyNumber) || qtyNumber <= 0) {
          Message.warning(
            `科室【${item.DEPT_TWO_NAME || item.DEPT_TWO_CODE}】监测量必须大于0`
          );
          return;
        }
        const exists = this.deptRows.find((d) => d.DEPT_TWO_CODE === item.DEPT_TWO_CODE);
        if (exists) {
          exists.DEPT_LIMIT_QTY = qtyNumber;
        } else {
          this.deptRows.push({
            ID: 0,
            PROD_REGISTRATION_LIMIT_BUY_ID: this.buyId,
            DEPT_TWO_CODE: item.DEPT_TWO_CODE,
            DEPT_TWO_NAME: item.DEPT_TWO_NAME,
            DEPT_LIMIT_QTY: qtyNumber
          });
        }
      }
      this.deptRows = this.deptRows.filter((item) => item.DEPT_TWO_CODE);
      this.adding = true;
      try {
        const res = await this.persist(this.deptRows, false);
        Message.success(res.msg || '添加成功');
        this.addVisible = false;
        await this.loadMain();
        this.$emit('done');
      } catch (e) {
        Message.error(e.message || '添加失败');
      } finally {
        this.adding = false;
      }
    }
  }
};
</script>

<style scoped>
.toolbar {
  margin-bottom: 10px;
}
.toolbar .el-button {
  margin-left: 8px;
}
.toolbar .el-input {
  vertical-align: middle;
}
.hint {
  margin-left: 12px;
  color: #909399;
  font-size: 12px;
}
.pager {
  margin-top: 8px;
  text-align: right;
}
</style>
