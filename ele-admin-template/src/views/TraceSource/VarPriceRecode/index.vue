<template>
  <div class="ele-body spd-page var-price-recode-page">
    <el-card shadow="never" class="var-price-recode-card">
      <user-search
        ref="search"
        class="var-price-recode-search"
        @search="reload"
        @exportData="exportData"
        @markAsProcessed="markAsProcessed"
      />
      <div ref="tableWrap" class="var-price-recode-table-wrap">
        <ele-pro-table
          ref="table"
          class="data-table"
          :height="tableHeight"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="TraceSourceVarPriceRecodeTable"
          @done="updateTableHeight"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import { GetPDAList, VarPriceRecodeCommit } from '@/api/TraceSource/VarPriceRecode';

export default {
  name: 'VarPriceRecode',
  components: { UserSearch },
  data() {
    return {
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'STATE',
          label: '处理状态',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (row) => (row.STATE === '1' ? '已处理' : '未处理')
        },
        {
          prop: 'CREATE_TIME',
          label: '记录时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 180,
          formatter: (row) => row.CREATE_TIME.replace('T', ' ')
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'UNIT',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'OLD_PRICE',
          label: '旧价格',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'NEW_PRICE',
          label: '新价格',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'UP_PRICE',
          label: '收货价格',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '合同供应商',
          align: 'center',
          showOverflowTooltip: true,
          width: 140
        },
        {
          prop: 'DELIVERY_NOTE_NUMBER',
          label: '收货单号',
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'DELIVERY_TIME',
          label: '价格变动第一次收货时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 250,
          formatter: (row) =>
            row.DELIVERY_TIME === '0001-01-01T00:00:00' ? '' : row.DELIVERY_TIME.replace('T', ' ')
        }
      ],
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      tableHeight: 400,
      selection: [],
      lastWhere: null
    };
  },
  mounted() {
    this.updateTableHeight();
    window.addEventListener('resize', this.updateTableHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateTableHeight);
  },
  methods: {
    updateTableHeight() {
      this.$nextTick(() => {
        const wrap = this.$refs.tableWrap;
        if (!wrap) return;
        const toolbar = wrap.querySelector('.ele-table-tool');
        const pagination = wrap.querySelector('.el-pagination');
        const reserved =
          (toolbar?.offsetHeight || 0) + (pagination?.offsetHeight || 46) + 8;
        this.tableHeight = Math.max(240, wrap.clientHeight - reserved);
        this.$refs.table?.doLayout?.();
      });
    },
    datasource({ page, limit, where, order }) {
      const w = where || this.lastWhere || this.$refs.search?.getWhere?.() || {};
      this.lastWhere = w;
      return GetPDAList({ page, limit, where: w, order }).then((res) => ({
        count: res.total || 0,
        list: res.result || []
      }));
    },
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where || this.$refs.search.getWhere() });
    },
    async markAsProcessed(where) {
      if (!this.selection.length) {
        this.$message.warning('请选择需要标记处理的行');
        return;
      }
      try {
        await this.$confirm('确认标记已处理吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
        const responseData = await VarPriceRecodeCommit(this.selection);
        if (responseData.code === 200) {
          this.$message.success(responseData.msg);
          this.reload(where || this.lastWhere);
        } else {
          this.$message.error(responseData.msg);
        }
      } catch (e) {
        // 用户取消
      }
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      const where = data || this.$refs.search.getWhere();
      where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      this.$refs.table.doRequest(({ order }) => {
        GetPDAList({
          page: 1,
          limit: 999999,
          where,
          order
        })
          .then((res) => {
            const headers = this.columns.filter((column) => column.prop).map((column) => column.label);
            const rows = res.result || [];
            const array = [headers];
            rows.forEach((d) => {
              const row = this.columns
                .filter((column) => column.prop)
                .map((column) => (column.formatter ? column.formatter(d) : d[column.prop]));
              array.push(row);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: { Sheet1: utils.aoa_to_sheet(array) }
              },
              '价格变动记录.xlsx'
            );
            this.$message.success('导出成功');
          })
          .catch((e) => {
            this.$message.error(e.message);
          })
          .finally(() => {
            loading.close();
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.var-price-recode-page {
  padding: 8px;
}

.var-price-recode-card {
  height: calc(100vh - 112px);
}

.var-price-recode-page :deep(.el-card__body) {
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.var-price-recode-search {
  flex: none;
  margin-bottom: 8px;
}

.var-price-recode-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
