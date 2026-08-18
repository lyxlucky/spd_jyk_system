<template>
  <div class="ele-body ks-new-batch-reminder-page">
    <el-card shadow="never" class="ks-new-batch-reminder-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <KsNewBatchReminderTableSearch
          ref="search"
          :exporting="exporting"
          @search="handleSearch"
          @makeRead="handleMakeRead"
          @export="handleExport"
        />
      </div>
      <KsNewBatchReminderTable ref="table" />
    </el-card>
  </div>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import KsNewBatchReminderTable from './components/KsNewBatchReminderTable';
  import KsNewBatchReminderTableSearch from './components/KsNewBatchReminderTableSearch';
  import { getTableList } from '@/api/KSInventory/KSNewBatchReminder/index';

  export default {
    name: 'NewBatchReminder',
    components: {
      KsNewBatchReminderTable,
      KsNewBatchReminderTableSearch
    },
    data() {
      return {
        exporting: false
      };
    },
    mounted() {
      this.$nextTick(() => {
        const where = this.$refs.search?.where;
        if (where) this.handleSearch(where);
      });
    },
    methods: {
      handleSearch(where) {
        this.$refs.table?.reload(where);
      },
      handleMakeRead() {
        this.$refs.table?.makeRead();
      },
      async handleExport(where) {
        this.exporting = true;
        try {
          const res = await getTableList({
            page: 1,
            limit: 9999999,
            where: where || this.$refs.search?.where || {}
          });
          const list = res.result || [];
          const fmtDate = (v, fmt = 'yyyy-MM-dd') =>
            v ? this.$util.toDateString(v, fmt) : '';
          const fmtPrice = (v) => (v != null && v !== '' ? Number(v).toFixed(2) : '');
          const array = [
            [
              '批号',
              '数量',
              '生产日期',
              '有效期',
              '品种编码',
              '品种名称',
              '包装规格',
              '单位',
              '价格',
              '生产企业',
              '注册证',
              '定标时间',
              '定标人',
              '定标报告'
            ]
          ];
          list.forEach((d) => {
            array.push([
              d.BATCH || '',
              d.GOODS_QTY ?? '',
              fmtDate(d.BATCH_PRODUCTION_DATE),
              fmtDate(d.BATCH_VALIDITY_PERIOD),
              d.VARIETIE_CODE_NEW || '',
              d.VARIETIE_NAME || '',
              d.SPECIFICATION_OR_TYPE || '',
              d.UNIT || '',
              fmtPrice(d.PRICE),
              d.MANUFACTURING_ENT_NAME || '',
              d.APPROVAL_NUMBER || '',
              fmtDate(d.CREATE_TIME, 'yyyy-MM-dd HH:mm:ss'),
              d.CREATE_MAN || '',
              d.DB_FILE ? '有' : '无'
            ]);
          });
          const sheet = utils.aoa_to_sheet(array);
          const book = utils.book_new();
          utils.book_append_sheet(book, sheet, '新批号提醒');
          const fileName = `新批号提醒_${this.$util.toDateString(new Date(), 'yyyyMMddHHmmss')}.xlsx`;
          writeFile(book, fileName);
          this.$message.success(`导出成功，共 ${list.length} 条数据`);
        } catch (e) {
          this.$message.error(e.message || '导出失败');
        } finally {
          this.exporting = false;
        }
      }
    }
  };
</script>

<style scoped lang="scss">
.ks-new-batch-reminder-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  box-sizing: border-box;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.ks-new-batch-reminder-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: auto;
  overflow: visible !important;
}

.ks-new-batch-reminder-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 144px);
  height: auto;
  padding: 10px;
  gap: 10px;
  overflow: visible;
}
</style>
