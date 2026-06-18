<template>
  <div class="snapshot-center-kz">
    <el-row :gutter="12">
      <el-col :span="8">
        <div class="spd-panel snapshot-panel">
          <div class="spd-panel__head">库存日志批次</div>
          <div class="spd-panel__body">
            <el-form size="mini" :inline="true" @submit.native.prevent>
              <el-form-item label="日期">
                <el-date-picker
                  v-model="kzQuery.startDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="起始"
                  style="width: 120px"
                />
                <span class="date-sep">至</span>
                <el-date-picker
                  v-model="kzQuery.endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="结束"
                  style="width: 120px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="reloadKzList">查询</el-button>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="kzLoading"
              :data="kzRows"
              border
              stripe
              highlight-current-row
              height="400"
              size="mini"
              @current-change="onKzSelect"
            >
              <el-table-column prop="ORDER_NUM" label="快照单号" min-width="80" show-overflow-tooltip />
              <el-table-column prop="CREATE_MAN" label="快照人" width="100" show-overflow-tooltip />
              <el-table-column prop="CREATE_TIME" label="创建时间" width="150" />
              <el-table-column prop="REMARK" label="备注" width="130" show-overflow-tooltip />
            </el-table>
            <el-pagination
              class="pager"
              small
              background
              layout="total, prev, pager, next"
              :total="kzTotal"
              :page-size="kzPage.size"
              :current-page="kzPage.page"
              @current-change="loadKzList"
            />
          </div>
        </div>
      </el-col>

      <el-col :span="16">
        <div class="spd-panel snapshot-panel">
          <div class="spd-panel__head">快照明细</div>
          <div class="spd-panel__body">
            <el-form size="mini" :inline="true" @submit.native.prevent>
              <el-form-item label="品种">
                <el-input
                  v-model="detailQuery.ortVar"
                  clearable
                  placeholder="编码/全称"
                  style="width: 130px"
                  @keyup.enter.native="reloadDetail"
                />
              </el-form-item>
              <el-form-item label="供应商">
                <el-input
                  v-model="detailQuery.ortSup"
                  clearable
                  placeholder="供应商"
                  style="width: 120px"
                  @keyup.enter.native="reloadDetail"
                />
              </el-form-item>
              <el-form-item label="生产批号">
                <el-input
                  v-model="detailQuery.ortBatch"
                  clearable
                  placeholder="生产批号"
                  style="width: 110px"
                  @keyup.enter.native="reloadDetail"
                />
              </el-form-item>
              <el-form-item label="分类属性">
                <el-input
                  v-model="detailQuery.ortFlsx"
                  clearable
                  placeholder="分类属性"
                  style="width: 100px"
                  @keyup.enter.native="reloadDetail"
                />
              </el-form-item>
              <br />
              <el-form-item label="库房位置">
                <el-input
                  v-model="detailQuery.ortKfwz"
                  clearable
                  placeholder="库房位置"
                  style="width: 110px"
                  @keyup.enter.native="reloadDetail"
                />
              </el-form-item>
              <el-form-item label="生产企业">
                <el-input
                  v-model="detailQuery.ortScqy"
                  clearable
                  placeholder="生产企业"
                  style="width: 120px"
                  @keyup.enter.native="reloadDetail"
                />
              </el-form-item>
              <el-form-item label="所属区域">
                <el-select v-model="detailQuery.ortSsqy" clearable placeholder="全部" style="width: 110px">
                  <el-option label="全部" value="" />
                  <el-option label="合格区" value="1" />
                  <el-option label="普通隔离区" value="6" />
                  <el-option label="不合格区" value="7" />
                  <el-option label="盘损隔离区" value="8" />
                  <el-option label="应急库" value="9" />
                  <el-option label="拣配区" value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="合同到期">
                <el-select v-model="detailQuery.ortHtdq" clearable placeholder="全部" style="width: 90px">
                  <el-option label="全部" value="" />
                  <el-option label="过期" value="1" />
                  <el-option label="未过期" value="0" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="reloadDetail">查询</el-button>
                <el-button
                  v-permission="'export-SnapshotDcKcZxk'"
                  type="success"
                  icon="el-icon-download"
                  :loading="exporting"
                  @click="onExport"
                >
                  导出
                </el-button>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="detailLoading"
              :data="detailRows"
              border
              stripe
              height="400"
              size="mini"
              :row-class-name="detailRowClass"
            >
              <el-table-column prop="ORDER_NUM" label="快照单号" width="90" show-overflow-tooltip />
              <el-table-column label="快照日期" width="95">
                <template slot-scope="{ row }">{{ fmtDate10(row.CREATE_TIME) }}</template>
              </el-table-column>
              <el-table-column prop="SOURCE_NAME" label="库房位置" width="80" show-overflow-tooltip />
              <el-table-column
                v-if="flags.showStorageTwo"
                prop="STORAGE_TWO_NAME"
                label="仓库"
                width="80"
                show-overflow-tooltip
              />
              <el-table-column label="所属区域" width="85">
                <template slot-scope="{ row }">
                  {{ fmtUpShelfStateKz(row.UP_SHELF_STATE, row.SOURCE_NAME) }}
                </template>
              </el-table-column>
              <el-table-column label="收货类型" width="75">
                <template slot-scope="{ row }">{{ fmtReceiveProperty(row.RECEIVE_PROPERTY) }}</template>
              </el-table-column>
              <el-table-column prop="VARIETIE_CODE_NEW" label="品种编码" width="90" show-overflow-tooltip />
              <el-table-column prop="CHARGING_CODE" label="计费编码" width="90" show-overflow-tooltip />
              <el-table-column prop="VARIETIE_NAME" label="品种全称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="SPECIFICATION_OR_TYPE" label="型号/规格" width="110" show-overflow-tooltip />
              <el-table-column prop="UNIT" label="单位" width="45" align="center" />
              <el-table-column prop="GOODS_QTY" label="库存散货" width="75" align="center" />
              <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业名称" width="130" show-overflow-tooltip />
              <el-table-column prop="SUPPLIER_NAME" label="供应商" width="130" show-overflow-tooltip />
              <el-table-column prop="BATCH" label="生产批号" width="90" show-overflow-tooltip />
              <el-table-column label="生产日期" width="95">
                <template slot-scope="{ row }">{{ fmtDate10(row.BATCH_PRODUCTION_DATE) }}</template>
              </el-table-column>
              <el-table-column label="有效到期" width="95">
                <template slot-scope="{ row }">
                  <span :class="batchValidityClass(row)">{{ fmtDate10(row.BATCH_VALIDITY_PERIOD) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="COEFFICIENT" label="系数" width="45" align="center" />
              <el-table-column label="结算价" width="75" align="right">
                <template slot-scope="{ row }">{{ fmtPrice(row.SUPPLY_PRICE) }}</template>
              </el-table-column>
              <el-table-column prop="DEF_QTY" label="库存定数包数" width="90" align="center" />
              <el-table-column prop="STORAGED_DAYS" label="在库天数" width="75" align="center" />
              <el-table-column prop="DEF_DOWN_SHELF_QTY" label="定数包未上架" width="150" align="center" />
              <el-table-column prop="GOODS_DOWN_SHELF_QTY" label="散货未上架" width="150" align="center" />
              <el-table-column prop="GOODS_LOOK_QTY" label="散货锁定" width="100" align="center" />
              <el-table-column prop="DEF_LOCKING_QTY" label="定数包锁定" width="120" align="center" />
              <el-table-column prop="PRE_LOCK_SUM" label="定数包预锁" width="120" align="center" />
              <el-table-column prop="BATCH_ID" label="批次号ID" width="100" />
              <el-table-column prop="POSITION" label="货位号" width="85" />
              <el-table-column prop="CONTRACT_NAME" label="合同名称" width="80" show-overflow-tooltip />
              <el-table-column label="合同到期" width="95">
                <template slot-scope="{ row }">
                  <span :class="{ 'contract-expired': isContractExpired(row.CONTRACT_END_TIME) }">
                    {{ fmtDate10(row.CONTRACT_END_TIME) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="NOTE_DESCRIPTION" label="备注" width="55" show-overflow-tooltip />
              <el-table-column
                v-if="flags.showPdaConsume"
                label="科室未结算"
                width="85"
                align="center"
              >
                <template slot-scope="{ row }">{{ row.NO_CONSUME_NUM == null ? 0 : row.NO_CONSUME_NUM }}</template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="pager"
              small
              background
              layout="total, sizes, prev, pager, next"
              :total="detailTotal"
              :page-size="detailPage.size"
              :current-page="detailPage.page"
              :page-sizes="[10, 50, 100, 150, 200, 300]"
              @size-change="onDetailSize"
              @current-change="loadDetail"
            />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { searchKzList, searchKzDetail } from '@/api/Inventory/Snapshot';
import {
  fmtDate10,
  fmtPrice,
  fmtUpShelfStateKz,
  fmtReceiveProperty,
  batchValidityClass,
  isContractExpired,
  exportAoa,
  CENTER_EXPORT_HEADERS,
  centerRowToExport
} from '../utils';

export default {
  props: {
    flags: {
      type: Object,
      default: () => ({ showStorageTwo: false, showPdaConsume: false })
    }
  },
  data() {
    return {
      kzQuery: { startDate: '', endDate: '' },
      kzPage: { page: 1, size: 10 },
      kzRows: [],
      kzTotal: 0,
      kzLoading: false,
      selectedOrderNum: '',
      detailQuery: {
        ortVar: '',
        ortSup: '',
        ortBatch: '',
        ortFlsx: '',
        ortKfwz: '',
        ortScqy: '',
        ortSsqy: '',
        ortHtdq: ''
      },
      detailPage: { page: 1, size: 10 },
      detailRows: [],
      detailTotal: 0,
      detailLoading: false,
      exporting: false
    };
  },
  created() {
    this.loadKzList(1);
  },
  methods: {
    fmtDate10,
    fmtPrice,
    fmtUpShelfStateKz,
    fmtReceiveProperty,
    batchValidityClass,
    isContractExpired,
    detailRowClass({ row }) {
      const c = batchValidityClass(row);
      return c || '';
    },
    reloadKzList() {
      this.loadKzList(1);
    },
    async loadKzList(page) {
      this.kzPage.page = page;
      this.kzLoading = true;
      try {
        const res = await searchKzList(
          this.kzQuery.startDate,
          this.kzQuery.endDate,
          this.kzPage.page,
          this.kzPage.size
        );
        this.kzRows = res.result || [];
        this.kzTotal = res.total || 0;
      } catch (e) {
        Message.error(e.message || '加载批次失败');
      } finally {
        this.kzLoading = false;
      }
    },
    onKzSelect(row) {
      this.selectedOrderNum = row?.ORDER_NUM || '';
      this.reloadDetail();
    },
    reloadDetail() {
      if (!this.selectedOrderNum) {
        this.detailRows = [];
        this.detailTotal = 0;
        return;
      }
      this.loadDetail(1);
    },
    onDetailSize(size) {
      this.detailPage.size = size;
      this.loadDetail(1);
    },
    async loadDetail(page) {
      if (!this.selectedOrderNum) return;
      this.detailPage.page = page;
      this.detailLoading = true;
      try {
        const res = await searchKzDetail({
          ordernum: this.selectedOrderNum,
          ...this.detailQuery,
          page: this.detailPage.page,
          size: this.detailPage.size
        });
        this.detailRows = res.result || [];
        this.detailTotal = res.total || 0;
      } catch (e) {
        Message.error(e.message || '加载明细失败');
      } finally {
        this.detailLoading = false;
      }
    },
    async onExport() {
      if (!this.selectedOrderNum) {
        Message.warning('请先选择库存日志批次');
        return;
      }
      this.exporting = true;
      try {
        const res = await searchKzDetail({
          ordernum: this.selectedOrderNum,
          ...this.detailQuery,
          page: 1,
          size: 999999
        });
        const rows = (res.result || []).map(centerRowToExport);
        exportAoa('库存查询.xlsx', CENTER_EXPORT_HEADERS, rows);
        Message.success('导出成功');
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
.snapshot-panel .spd-panel__body {
  padding-bottom: 8px;
}

.date-sep {
  margin: 0 6px;
  color: #909399;
}

.pager {
  margin-top: 8px;
  text-align: right;
}

.contract-expired {
  color: #f56c6c;
}

.snapshot-center-kz >>> .el-table th .cell {
  white-space: nowrap;
}

::v-deep .snapshot-validity-danger {
  color: #f56c6c;
  font-weight: 600;
}

::v-deep .snapshot-validity-warn {
  color: #e6a23c;
}

::v-deep tr.snapshot-validity-danger > td {
  background-color: #fde2e2 !important;
}

::v-deep tr.snapshot-validity-warn > td {
  background-color: #fdf6ec !important;
}
</style>
