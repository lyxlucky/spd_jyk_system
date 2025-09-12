<template>
  <div class="paperless-barcode-search">
    <el-card shadow="never" class="mb-12">
      <el-form
        :model="queryForm"
        :inline="true"
        label-width="80px"
        size="small"
      >
        <el-form-item label="住院号">
          <el-input
            v-model.trim="queryForm.inpatientNo"
            placeholder="请输入住院号"
            clearable
            @keyup.enter.native="handleSearch"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="住院次数">
          <el-input
            v-model="queryForm.admissionTimes"
            controls-position="right"
            placeholder="次数"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <ele-pro-table
        ref="table"
        :pageSize="size"
        :pageSizes="[10, 20, 50, 100]"
        :columns="columns"
        :datasource="datasource"
        v-loading="loading"
        cache-key="PaperlessBarcodeSearchTable"
      >
        <template v-slot:fileUrl="{ row }">
          <el-link
            :href="row.fileUrl"
            target="_blank"
            type="primary"
            :underline="false"
            >{{ row.fileUrl }}</el-link
          >
          <el-button
            type="text"
            @click="openPdf(row.fileUrl)"
            style="margin-left: 8px"
            >打开</el-button
          >
        </template>
      </ele-pro-table>
    </el-card>
  </div>
</template>
<script>
  import { getPaperlessInfo } from '@/api/KSInventory/PaperlessBarcodeSearch';

  export default {
    name: 'PaperlessBarcodeSearch',
    data() {
      return {
        // 搜索表单
        queryForm: {
          inpatientNo: '',
          admissionTimes: null
        },
        // 表格列配置
        columns: [
          {
            prop: 'inpatientNo',
            label: '住院号',
            minWidth: 140,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'admissionTimes',
            label: '住院次数',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'fileUrl',
            label: '文件URL(PDF)',
            minWidth: 260,
            align: 'center',
            slot: 'fileUrl'
          },
          {
            prop: 'fileId',
            label: '文件ID',
            minWidth: 140,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        loading: false,
        size: 10
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit }) {
        const params = {
          ...this.queryForm,
          page: page,
          size: limit
        };
        return getPaperlessInfo(params).then((res) => {
          const list = res?.data || res?.result || res?.list || [];
          const total =
            res?.total ?? res?.count ?? (Array.isArray(list) ? list.length : 0);

          const tableData = (list || []).map((item) => ({
            inpatientNo:
              item.HOSPITAL_NUMBER || item.INPATIENT_NO || item.zyh || '',
            admissionTimes:
              item.HOSPITAL_TIMES || item.ADMISSION_TIMES || item.zycs || '',
            fileUrl: item.PDF_URI || item.FILE_URL || item.url || '',
            fileId: item.DOCID || item.FILE_ID || item.id || ''
          }));

          return {
            list: tableData,
            count: Number(total) || 0
          };
        });
      },
      /**
       * 搜索
       */
      handleSearch() {
        this.$refs.table.reload({ where: this.queryForm, page: 1 });
      },
      /**
       * 重置
       */
      handleReset() {
        this.queryForm.inpatientNo = '';
        this.queryForm.admissionTimes = null;
        this.handleSearch();
      },
      /**
       * 打开PDF
       */
      openPdf(url) {
        if (!url) return;
        window.open(url, '_blank');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .paperless-barcode-search .mb-12 {
    margin-bottom: 12px;
  }
</style>
