<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="85%"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <div class="direction-bar">{{ directionText }}</div>
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="section-title">{{ sourceTitle }}</div>
        <el-form size="mini" inline @submit.native.prevent>
          <el-form-item>
            <el-input v-model="sourceSearch" clearable placeholder="搜索" style="width: 120px" @keyup.enter.native="reloadSource" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="sourceStorageId" style="width: 120px" @change="reloadSource">
              <el-option label="全部" value="0" />
              <el-option :label="svcLabels.inStorage" value="1" />
              <el-option :label="svcLabels.outStorage" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadSource">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="sourceList" size="mini" border height="280" v-loading="sourceLoading">
          <el-table-column v-for="col in sourceColumns" :key="col.prop" v-bind="col" show-overflow-tooltip />
          <el-table-column label="操作" width="60" align="center" fixed="right">
            <template slot-scope="{ row }">
              <el-button
                v-if="canAddSource(row)"
                type="text"
                icon="el-icon-plus"
                @click="addToDetail(row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="sourceTotal > sourcePageSize"
          class="mini-pager"
          small
          layout="prev, pager, next"
          :current-page.sync="sourcePage"
          :page-size="sourcePageSize"
          :total="sourceTotal"
          @current-change="loadSource"
        />
      </el-col>
      <el-col :span="12">
        <div class="section-title">调拨明细</div>
        <el-table :data="detailList" size="mini" border height="320">
          <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="100" show-overflow-tooltip />
          <el-table-column prop="VARIETIE_NAME" label="品种名称" min-width="140" show-overflow-tooltip />
          <el-table-column v-if="mode === 'sh'" prop="BATCH" label="批号" width="90" />
          <el-table-column prop="SPECIFICATION_OR_TYPE" label="规格型号" min-width="100" show-overflow-tooltip />
          <el-table-column label="库存位置" width="100">
            <template slot-scope="{ row }">{{ storageAreaText(row.STORAGE_ID) }}</template>
          </el-table-column>
          <el-table-column :label="mode === 'sh' ? '库存数量' : '库存数量'" width="80" align="center">
            <template slot-scope="{ row }">{{ mode === 'sh' ? row.UP_SHELF_QUANTITY : row.XS_NUM }}</template>
          </el-table-column>
          <el-table-column label="调拨数量" width="100" align="center">
            <template slot-scope="{ row }">
              <el-input-number
                v-model="row[qtyField]"
                :min="0"
                :max="maxQty(row)"
                :controls="false"
                size="mini"
                style="width: 70px"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="text" icon="el-icon-delete" class="text-danger" @click="removeDetail($index, row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div class="footer-bar">
      <span>调拨单号：</span>
      <el-select v-model="selectedOrder" style="width: 200px">
        <el-option label="新建单号" value="-1" />
        <el-option v-for="item in orderList" :key="item.ALLOCATE_NUMBER" :label="item.ALLOCATE_NUMBER" :value="item.ALLOCATE_NUMBER" />
      </el-select>
      <el-button type="primary" :loading="submitting" style="margin-left: 12px" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import {
  creatAllocateTable,
  creatAllocateVarTable,
  getAllocateDefInfo,
  getAllocateListInfo,
  getAllocateVarInfo
} from '@/api/Inventory/CentralinventoryMonitoring';
import {
  getAllocateDirectionText,
  getAllocateStrongId,
  getAllocateSvcLabels,
  getStorageAreaText
} from '../utils';

export default {
  name: 'AllocateCreateDialog',
  props: {
    visible: Boolean,
    mode: {
      type: String,
      default: 'sh'
    },
    svc: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      homeHp: HOME_HP,
      dialogVisible: false,
      sourceSearch: '',
      sourceStorageId: '0',
      sourceList: [],
      sourceLoading: false,
      sourcePage: 1,
      sourcePageSize: 10,
      sourceTotal: 0,
      detailList: [],
      orderList: [],
      selectedOrder: '-1',
      submitting: false
    };
  },
  computed: {
    svcLabels() {
      return getAllocateSvcLabels(this.homeHp);
    },
    strongId() {
      return getAllocateStrongId(this.svc);
    },
    directionText() {
      return getAllocateDirectionText(this.svc, this.homeHp);
    },
    dialogTitle() {
      return this.mode === 'sh' ? '创建散货调拨单' : '创建定数包调拨单';
    },
    sourceTitle() {
      return this.mode === 'sh' ? '散货调拨指示单品种列表' : '定数包调拨指示单品种列表';
    },
    qtyField() {
      return this.mode === 'sh' ? 'DB_NUM' : 'NUM';
    },
    listState() {
      return this.mode === 'sh' ? '0' : '1';
    },
    sourceColumns() {
      if (this.mode === 'sh') {
        return [
          { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 100 },
          { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140 },
          { prop: 'BATCH', label: '批号', width: 80 },
          { prop: 'BATCH_ID', label: '批次号', width: 80 },
          { prop: 'UP_SHELF_QUANTITY', label: '库存', width: 70, align: 'center' }
        ];
      }
      return [
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 100 },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140 },
        { prop: 'COEFFICIENT', label: '系数', width: 60, align: 'center' },
        { prop: 'NUM', label: '库存', width: 70, align: 'center' }
      ];
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      if (val) {
        this.initDialog();
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    storageAreaText(id) {
      return getStorageAreaText(id, this.homeHp);
    },
    maxQty(row) {
      if (this.mode === 'sh') return Number(row.UP_SHELF_QUANTITY) || 0;
      return Number(row.XS_NUM) || 0;
    },
    async initDialog() {
      this.detailList = [];
      this.selectedOrder = '-1';
      this.sourcePage = 1;
      await this.loadOrders();
      await this.loadSource();
    },
    async loadOrders() {
      try {
        const data = await getAllocateListInfo(this.listState, this.svc);
        this.orderList = data.result || [];
      } catch (e) {
        this.orderList = [];
        this.$message.error(e.message || '加载调拨单号失败');
      }
    },
    reloadSource() {
      this.sourcePage = 1;
      this.loadSource();
    },
    async loadSource() {
      this.sourceLoading = true;
      try {
        const where = { Storageid: this.sourceStorageId, Search: this.sourceSearch };
        const res =
          this.mode === 'sh'
            ? await getAllocateVarInfo(where, this.sourcePage, this.sourcePageSize)
            : await getAllocateDefInfo(where, this.sourcePage, this.sourcePageSize);
        this.sourceList = res.result || [];
        this.sourceTotal = res.total || 0;
      } catch (e) {
        this.sourceList = [];
        this.sourceTotal = 0;
        this.$message.error(e.message || '查询品种失败');
      } finally {
        this.sourceLoading = false;
      }
    },
    canAddSource(row) {
      return String(row.STORAGE_ID) === String(this.strongId);
    },
    detailKey(row) {
      if (this.mode === 'sh') return String(row.BATCH_ID);
      return `${row.VARIETIE_CODE}_${row.COEFFICIENT}`;
    },
    addToDetail(row) {
      if (this.detailList.some((item) => this.detailKey(item) === this.detailKey(row))) {
        this.$message.warning('该品种已在列表');
        return;
      }
      const item = { ...row };
      if (this.mode === 'sh') {
        item.DB_NUM = 0;
      } else {
        item.XS_NUM = item.NUM;
        item.NUM = 0;
      }
      this.detailList.push(item);
    },
    removeDetail(index) {
      this.detailList.splice(index, 1);
    },
    staffName() {
      return this.$store.state.user?.info?.Nickname || '';
    },
    async handleSubmit() {
      if (!this.detailList.length) {
        this.$message.warning('无调拨明细');
        return;
      }
      for (const row of this.detailList) {
        const qty = Number(row[this.qtyField]);
        if (!qty || qty <= 0) {
          const label = this.mode === 'sh' ? row.BATCH_ID : row.VARIETIE_CODE_NEW;
          this.$message.warning(`${label} 调拨数量不能为0`);
          return;
        }
        const max = this.maxQty(row);
        if (qty > max) {
          this.$message.warning(`${row.VARIETIE_NAME} 超出库存数量`);
          return;
        }
      }
      const state = this.selectedOrder === '-1' ? '0' : '1';
      const allocateNumber = this.selectedOrder === '-1' ? '' : this.selectedOrder;
      const jsonStr = JSON.stringify(this.detailList);
      this.submitting = true;
      try {
        const data =
          this.mode === 'sh'
            ? await creatAllocateVarTable(jsonStr, this.svc, state, allocateNumber, this.staffName())
            : await creatAllocateTable(jsonStr, this.svc, state, allocateNumber, this.staffName());
        if (data.code == 200 || data.code === '200') {
          this.$alert(data.msg || '操作成功', '提示');
          this.dialogVisible = false;
          this.$emit('success');
        } else {
          this.$message.error(data.msg || '操作失败');
        }
      } catch (e) {
        this.$message.error(e.message || '提交失败');
      } finally {
        this.submitting = false;
      }
    },
    handleClosed() {
      this.sourceSearch = '';
      this.sourceStorageId = '0';
      this.sourceList = [];
      this.detailList = [];
    }
  }
};
</script>

<style scoped>
.direction-bar {
  text-align: center;
  background: #fcf8e3;
  padding: 8px;
  margin-bottom: 12px;
  font-weight: 600;
}
.section-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.footer-bar {
  margin-top: 16px;
  text-align: center;
}
.mini-pager {
  margin-top: 8px;
  text-align: right;
}
.text-danger {
  color: #f56c6c;
}
</style>
