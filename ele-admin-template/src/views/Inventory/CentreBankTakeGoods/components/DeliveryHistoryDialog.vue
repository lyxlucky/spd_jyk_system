<template>
  <ele-modal
    :visible="visible"
    title="历史收货单号"
    width="1200px"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <el-form size="mini" inline @submit.native.prevent>
      <el-form-item label="收货开始">
        <el-date-picker v-model="q.startTime" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="收货结束">
        <el-date-picker v-model="q.endTime" type="date" value-format="yyyy-MM-dd" style="width: 130px" />
      </el-form-item>
      <el-form-item label="收货单号">
        <el-input v-model="q.deliveryNoteNumber" clearable style="width: 140px" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="q.specType" clearable style="width: 120px" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item label="品种">
        <el-input v-model="q.varietie" clearable style="width: 140px" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item label="批次">
        <el-input v-model="q.batch" clearable style="width: 100px" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="q.supplierName" clearable style="width: 140px" @keyup.enter.native="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button
          type="warning"
          icon="el-icon-printer"
          :disabled="!selection.length"
          :loading="reprinting"
          :title="reprintHint"
          @click="onReprint"
        >
          补打印收货单号{{ uniqueReceiptCount ? `(${uniqueReceiptCount}单)` : '' }}
        </el-button>
      </el-form-item>
      <!-- 对齐老页 CentreBankSIZE_BD：隐藏，默认 4 -->
      <input v-show="false" v-model="printSize" type="text" />
    </el-form>
    <el-table
      ref="table"
      v-loading="loading"
      :data="rows"
      border
      stripe
      size="small"
      height="420"
      @selection-change="onSelectionChange"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" width="45" />
      <el-table-column prop="Name" label="院区库房" width="100" />
      <el-table-column prop="Delivery_Note_Number" label="收货单号" min-width="120" />
      <el-table-column prop="Varietie_Code_New" label="品种编码" width="110" />
      <el-table-column prop="Varietie_Name" label="品种全称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="Specification_Or_Type" label="规格型号" width="100" />
      <el-table-column prop="Batch" label="批号" width="90" />
      <el-table-column prop="Supplier_Name" label="供应商" min-width="120" show-overflow-tooltip />
      <el-table-column prop="Delivery_Time" label="收货时间" width="150">
        <template slot-scope="{ row }">{{ fmtDateTime(row.Delivery_Time) }}</template>
      </el-table-column>
    </el-table>
    <!-- 对齐老页 layui：page + limits [10,30,60,90,150,300]，默认每页 10 -->
    <div class="pager-wrap">
      <el-pagination
        small
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :current-page="page"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </ele-modal>
</template>

<script>
import { Message } from 'element-ui';
import { searchDeliveryHistory, printHistoryDelivery } from '@/api/Inventory/CentreBankTakeGoods';
import { fmtDateTime, openExcelFile } from '../utils';

export default {
  name: 'DeliveryHistoryDialog',
  props: { visible: Boolean },
  data() {
    return {
      q: {
        startTime: '',
        endTime: '',
        deliveryNoteNumber: '',
        specType: '',
        varietie: '',
        batch: '',
        supplierName: ''
      },
      rows: [],
      loading: false,
      reprinting: false,
      total: 0,
      page: 1,
      /** 对齐老页 limit: 10 */
      pageSize: 10,
      pageSizes: [10, 30, 60, 90, 150, 300],
      selection: [],
      /** 对齐老页 CentreBankSIZE_BD，未填时默认 4 */
      printSize: '4'
    };
  },
  computed: {
    /** 同一收货单多行品种只打一次 */
    uniqueReceiptCount() {
      return this.uniqueReceipts(this.selection).length;
    },
    reprintHint() {
      const n = this.selection.length;
      const u = this.uniqueReceiptCount;
      if (!n) return '请勾选要补打印的行';
      if (n === u) return `将补打印 ${u} 个收货单`;
      return `已勾选 ${n} 行，同一收货单只打一次，实际 ${u} 单`;
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.selection = [];
        this.page = 1;
        this.$nextTick(() => this.$refs.table && this.$refs.table.clearSelection());
        this.load();
      }
    }
  },
  methods: {
    fmtDateTime,
    onSearch() {
      this.page = 1;
      this.load();
    },
    onSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.load();
    },
    onPageChange(p) {
      this.page = p || 1;
      this.load();
    },
    async load() {
      this.loading = true;
      this.selection = [];
      this.$nextTick(() => this.$refs.table && this.$refs.table.clearSelection());
      try {
        const res = await searchDeliveryHistory({
          ...this.q,
          page: this.page,
          size: this.pageSize
        });
        this.rows = res.result || [];
        this.total = Number(res.total) || 0;
      } catch (e) {
        Message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    onSelectionChange(rows) {
      this.selection = rows || [];
    },
    rowReceiptId(row) {
      return row.Receipt_Id ?? row.Goods_Var_Cargo_Receipt_Id ?? '';
    },
    uniqueReceipts(list) {
      const map = new Map();
      (list || []).forEach((row) => {
        const id = String(this.rowReceiptId(row));
        const note = row.Delivery_Note_Number || '';
        const key = id || note;
        if (!key || map.has(key)) return;
        map.set(key, row);
      });
      return [...map.values()];
    },
    /** 新系统支持批量：勾选多行，按收货单去重后依次补打印 */
    async onReprint() {
      const targets = this.uniqueReceipts(this.selection);
      if (!targets.length) {
        Message.warning('请勾选要补打印的数据');
        return;
      }
      const size = String(this.printSize || '').trim() || '4';
      this.reprinting = true;
      let ok = 0;
      const errors = [];
      try {
        for (const row of targets) {
          const receiptId = this.rowReceiptId(row);
          if (!receiptId) {
            errors.push(`${row.Delivery_Note_Number || '未知单号'}：缺少收货单ID`);
            continue;
          }
          try {
            const res = await printHistoryDelivery({
              deliveryNoteNumber: row.Delivery_Note_Number,
              Receipt_Id: receiptId,
              Delivery_Time: row.Delivery_Time,
              CentreBankSIZE: size
            });
            if (res?.msg) {
              openExcelFile(res.msg);
              ok += 1;
            } else {
              errors.push(`${row.Delivery_Note_Number}：${res?.msg || '未返回文件'}`);
            }
          } catch (e) {
            errors.push(`${row.Delivery_Note_Number}：${e.message || '失败'}`);
          }
        }
        if (ok && !errors.length) {
          Message.success(`补打印成功，共 ${ok} 单`);
        } else if (ok && errors.length) {
          Message.warning(`成功 ${ok} 单，失败 ${errors.length} 单：${errors[0]}`);
        } else {
          Message.error(errors[0] || '补打印失败');
        }
      } finally {
        this.reprinting = false;
      }
    }
  }
};
</script>

<style scoped>
.pager-wrap {
  margin-top: 10px;
  padding: 4px 0 2px;
  text-align: right;
  flex-shrink: 0;
}
</style>
