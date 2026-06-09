<template>
  <el-dialog
    title="库存汇总"
    :visible.sync="visibleSync"
    width="80%"
    :close-on-click-modal="false"
    append-to-body
    @open="onOpen"
  >
    <el-form :inline="true" size="mini" @submit.native.prevent>
      <el-form-item label="品种编码">
        <el-input
          v-model="form.VARIETIE_CODE_NEW"
          placeholder="请输入品种编码"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="品种名称">
        <el-input
          v-model="form.VARIETIE_NAME"
          placeholder="请输入品种名称"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="form.SPECIFICATION_OR_TYPE"
          placeholder="请输入规格型号"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="单位">
        <el-input
          v-model="form.UNIT"
          placeholder="请输入单位"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="价格">
        <el-input
          v-model="form.PRICE"
          placeholder="请输入价格"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input
          v-model="form.MANUFACTURING_ENT_NAME"
          placeholder="请输入生产企业"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" :loading="loading" @click="reload">
          查询
        </el-button>
        <el-button type="success" size="mini" :loading="exporting" @click="exportData">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      size="mini"
      height="50vh"
      highlight-current-row
    >
      <el-table-column
        prop="VARIETIE_CODE_NEW"
        label="品种编码"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="VARIETIE_NAME"
        label="品种名称"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="SPECIFICATION_OR_TYPE"
        label="规格型号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="UNIT"
        label="单位"
        align="center"
        min-width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="PRICE"
        label="单价"
        align="center"
        min-width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="MANUFACTURING_ENT_NAME"
        label="生产企业"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="QTY"
        label="数量"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="TOTAL_PRICE"
        label="总价"
        align="center"
        min-width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="JF_QTY"
        label="散货计费数量"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="JF_DEF_QTY"
        label="定数包计费数量"
        align="center"
        min-width="140"
        show-overflow-tooltip
      />
    </el-table>

    <el-pagination
      class="table-pager"
      background
      small
      layout="total, sizes, prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      :page-sizes="pageSizes"
      @size-change="onPageSizeChange"
      @current-change="loadData"
    />
  </el-dialog>
</template>

<script>
  import { getThreeKcInfo } from '@/api/Inventory/ThreeLevelDbBD';
  import { utils, writeFile } from 'xlsx';

  export default {
    name: 'KcSummaryDialog',
    props: {
      visible: Boolean
    },
    data() {
      return {
        loading: false,
        exporting: false,
        page: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        total: 0,
        tableData: [],
        form: {
          VARIETIE_CODE_NEW: '',
          VARIETIE_NAME: '',
          SPECIFICATION_OR_TYPE: '',
          UNIT: '',
          PRICE: '',
          MANUFACTURING_ENT_NAME: ''
        }
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(v) {
          this.$emit('update:visible', v);
        }
      }
    },
    methods: {
      formatKcStorageType(value) {
        if (value == 0) return '普通入库';
        if (value == 2) return '盘盈入库';
        return '未知';
      },
      resetForm() {
        this.form = {
          VARIETIE_CODE_NEW: '',
          VARIETIE_NAME: '',
          SPECIFICATION_OR_TYPE: '',
          UNIT: '',
          PRICE: '',
          MANUFACTURING_ENT_NAME: ''
        };
      },
      onOpen() {
        this.resetForm();
        this.page = 1;
        this.loadData(1);
      },
      reload() {
        this.loadData(1);
      },
      onPageSizeChange(size) {
        this.pageSize = size;
        this.loadData(1);
      },
      async loadData(page = this.page) {
        this.page = page;
        this.loading = true;
        try {
          const res = await getThreeKcInfo({
            page: this.page,
            limit: this.pageSize,
            ...this.form
          });
          this.tableData = res.data || [];
          this.total = res.total || 0;
        } catch (e) {
          this.tableData = [];
          this.total = 0;
          this.$message.error(e || '查询库存汇总失败');
        } finally {
          this.loading = false;
        }
      },
      async exportData() {
        this.exporting = true;
        const loading = this.$messageLoading('正在导出数据...');
        try {
          const response = await getThreeKcInfo({
            page: 1,
            limit: 999999,
            ...this.form
          });
          const headers = [
            '品种编码',
            '品种名称',
            '规格型号',
            '单位',
            '单价',
            '生产企业',
            '数量',
            '总价',
            '散货计费数量',
            '定数包计费数量',
            '入库类型'
          ];
          const dataArray = [headers];
          (response.data || []).forEach((d) => {
            dataArray.push([
              d.VARIETIE_CODE_NEW || '',
              d.VARIETIE_NAME || '',
              d.SPECIFICATION_OR_TYPE || '',
              d.UNIT || '',
              d.PRICE || '',
              d.MANUFACTURING_ENT_NAME || '',
              d.QTY || '',
              d.TOTAL_PRICE || '',
              d.JF_QTY || '',
              d.JF_DEF_QTY || '',
              this.formatKcStorageType(d.STORAGE_TYPE)
            ]);
          });
          writeFile(
            {
              SheetNames: ['Sheet1'],
              Sheets: { Sheet1: utils.aoa_to_sheet(dataArray) }
            },
            '三级库-新增库存信息.xlsx'
          );
          this.$message.success('导出成功');
        } catch (e) {
          this.$message.error('导出数据失败，请稍后重试');
        } finally {
          loading.close();
          this.exporting = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .table-pager {
    margin-top: 12px;
    text-align: right;
  }
</style>
