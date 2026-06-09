<template>
  <div class="def-pkg-return-tab">
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="section-title">退货单列表</div>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item>
            <el-button type="primary" :disabled="!selectedOrder" @click="handlePrint">打印退货单</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" :disabled="!selectedOrder" @click="handleConfirmReturn">确认退货</el-button>
          </el-form-item>
          <el-form-item v-if="hp.enableEpcBack">
            <el-button type="warning" :disabled="!selectedOrder" @click="handleEpcBack">智能库退货</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item>
            <el-input v-model="orderFilters.return_number" placeholder="退货单号" clearable style="width: 110px" @keyup.enter.native="reloadOrders" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="orderFilters.dept" placeholder="科室" clearable style="width: 90px" @keyup.enter.native="reloadOrders" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="orderFilters.var" placeholder="品种编码/名称" clearable style="width: 120px" @keyup.enter.native="reloadOrders" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reloadOrders">搜索</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="orderTable"
          size="mini"
          height="calc(100vh - 320px)"
          highlight-current-row
          :columns="orderColumns"
          :datasource="orderDatasource"
          :current.sync="selectedOrder"
          cache-key="sectionRejectedDefOrderTable"
          @current-change="onOrderChange"
        >
          <template v-slot:returnState="{ row }">
            <span :style="formatDefPkgReturnState(row.Returning_State).style">
              {{ formatDefPkgReturnState(row.Returning_State).text }}
            </span>
          </template>
          <template v-slot:remark="{ row }">
            <el-link type="primary" :underline="false" @click.stop="openRemark(row)">
              {{ row.REMARK || '无' }}
            </el-link>
          </template>
        </ele-pro-table>
      </el-col>
      <el-col :span="17">
        <div class="section-title">退货单定数包列表</div>
        <el-form :inline="true" size="mini" class="toolbar">
          <el-form-item>
            <el-input
              v-model="detailFilters.condition"
              placeholder="二级科室名称、品种名称、定数码"
              clearable
              style="width: 280px"
              @keyup.enter.native="reloadDetails"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" :disabled="!selectedOrder" @click="reloadDetails">查询</el-button>
          </el-form-item>
        </el-form>
        <ele-pro-table
          ref="detailTable"
          size="mini"
          height="calc(100vh - 280px)"
          :init-load="false"
          :columns="detailColumns"
          :datasource="detailDatasource"
          cache-key="sectionRejectedDefDetailTable"
        />
      </el-col>
    </el-row>

    <RemarkDialog
      :visible.sync="remarkVisible"
      :title="remarkTitle"
      :remark="remarkText"
      :loading="remarkLoading"
      @submit="handleRemarkSubmit"
    />
  </div>
</template>

<script>
import {
  getDeptTwoReturningGoodsList,
  getDeptTwoReturningGoodsDetail,
  confirmTheReturn,
  updateReturningGoodsBz,
  createPackagesExcel,
  processReturnGoods
} from '@/api/Task/SectionRejected';
import RemarkDialog from './RemarkDialog.vue';
import {
  sectionRejectedHpFlags,
  unwrapData,
  isOkCode,
  formatDefPkgReturnState,
  getPkgPrintExcelAction,
  openExcelFile
} from '../utils';

export default {
  name: 'DefPkgReturnTab',
  components: { RemarkDialog },
  data() {
    return {
      hp: sectionRejectedHpFlags,
      selectedOrder: null,
      orderFilters: { return_number: '', dept: '', var: '', field: '', order: '' },
      detailFilters: { condition: '', field: '', order: '' },
      remarkVisible: false,
      remarkLoading: false,
      remarkText: '',
      remarkTitle: '备注',
      remarkTarget: null,
      orderColumns: [
        { prop: 'Returning_Goods_Number', label: '退货单号', minWidth: 130, sortable: true },
        { prop: 'DEPT_TWO_NAME', label: '科室', width: 90, sortable: true },
        { prop: 'Creater', label: '创建人', width: 120, sortable: true },
        { prop: 'Create_Time', label: '创建时间', width: 160, sortable: true },
        { columnKey: 'returnState', label: '完成状态', width: 100, slot: 'returnState' },
        { columnKey: 'remark', label: '备注', width: 80, slot: 'remark' }
      ],
      detailColumns: [
        { prop: 'Dept_Two_Name', label: '科室名称', width: 140, sortable: true },
        { prop: 'Varietie_Code', label: '品种(材料)编码', width: 180, sortable: true },
        { prop: 'Varietie_Name', label: '品种全称', minWidth: 100 },
        { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 100 },
        { prop: 'Unit', label: '单位', width: 60, align: 'center' },
        { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', width: 160 },
        { prop: 'Coefficient', label: '系数', width: 60, align: 'center' },
        { prop: 'Def_No_Pkg_Code', label: '定数码', width: 100, sortable: true },
        { prop: 'Batch', label: '生产批号', width: 120, sortable: true },
        { prop: 'MEDICAL_CODE', label: '医保编码', width: 150, sortable: true }
      ]
    };
  },
  methods: {
    formatDefPkgReturnState,
    orderDatasource({ page, limit, order }) {
      if (order?.sort) {
        this.orderFilters.field = order.sort;
        this.orderFilters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return getDeptTwoReturningGoodsList({
        page,
        limit,
        where: this.orderFilters
      }).then((res) => {
        const data = unwrapData(res);
        if (data?.code === 301 || data?.code === '301') {
          this.$message.error(data.msg || '登录失效');
          return { count: 0, list: [] };
        }
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    detailDatasource({ page, limit, order }) {
      if (!this.selectedOrder?.Returning_Goods_Number) {
        return Promise.resolve({ count: 0, list: [] });
      }
      if (order?.sort) {
        this.detailFilters.field = order.sort;
        this.detailFilters.order = order.order === 'descending' ? 'desc' : 'asc';
      }
      return getDeptTwoReturningGoodsDetail({
        page,
        limit,
        where: {
          returningGoodsNumber: this.selectedOrder.Returning_Goods_Number,
          condition: this.detailFilters.condition,
          field: this.detailFilters.field,
          order: this.detailFilters.order
        }
      }).then((res) => {
        const data = unwrapData(res);
        return { count: data.total || 0, list: data.result || [] };
      });
    },
    reloadOrders() {
      this.selectedOrder = null;
      this.$refs.orderTable?.reload({ page: 1 });
      this.reloadDetails();
    },
    reloadDetails() {
      this.$refs.detailTable?.reload({ page: 1 });
    },
    onOrderChange() {
      this.reloadDetails();
    },
    handlePrint() {
      const num = this.selectedOrder?.Returning_Goods_Number;
      if (!num) {
        this.$message.warning('请先选中退货单号');
        return;
      }
      const loading = this.$loading({ lock: true, text: '正在生成...' });
      createPackagesExcel(num, getPkgPrintExcelAction())
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code) && data.msg) {
            openExcelFile(data.msg);
          } else {
            this.$message.error(data?.msg || '打印失败');
          }
        })
        .finally(() => loading.close());
    },
    handleConfirmReturn() {
      const num = this.selectedOrder?.Returning_Goods_Number;
      if (!num) {
        this.$message.warning('请先选择收货单号');
        return;
      }
      const loading = this.$loading({ lock: true });
      confirmTheReturn(num)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '操作成功');
          } else {
            this.$message.error(data?.msg || '操作失败');
          }
        })
        .finally(() => {
          loading.close();
          this.reloadOrders();
        });
    },
    handleEpcBack() {
      const num = this.selectedOrder?.Returning_Goods_Number;
      if (!num) return;
      this.$confirm(`${num} 确定要进行智能库退货吗？`, '操作确认', { type: 'warning' })
        .then(() => {
          const loading = this.$loading({ lock: true });
          return processReturnGoods(num)
            .then((res) => {
              const data = unwrapData(res);
              if (isOkCode(data?.code)) {
                this.$message.success(data.msg || '操作成功');
              } else {
                this.$message.error(data?.msg || '操作失败');
              }
            })
            .finally(() => loading.close());
        })
        .catch(() => {});
    },
    openRemark(row) {
      this.remarkTarget = row;
      this.remarkText = row.REMARK || '';
      this.remarkTitle = `${row.Returning_Goods_Number || ''} 备注`;
      this.remarkVisible = true;
    },
    handleRemarkSubmit(remark) {
      if (!this.remarkTarget) return;
      this.remarkLoading = true;
      updateReturningGoodsBz(this.remarkTarget.Returnning_Goods_Id, remark)
        .then((res) => {
          const data = unwrapData(res);
          if (isOkCode(data?.code)) {
            this.$message.success(data.msg || '保存成功');
            this.remarkVisible = false;
            this.reloadOrders();
          } else if (data?.code === 301 || data?.code === '301') {
            this.$message.error('登录失效，请重新登录');
          } else {
            this.$message.error(data?.msg || '保存失败');
          }
        })
        .finally(() => {
          this.remarkLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.section-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.toolbar {
  margin-bottom: 4px;
}
</style>
