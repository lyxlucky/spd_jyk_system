<template>
  <div class="ele-body spd-page paperless-barcode-search">
    <el-card shadow="never" class="paperless-barcode-search-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <div class="spd-panel__body">
          <el-form
            :model="queryForm"
            size="mini"
            :inline="true"
            @keyup.enter.native="handleSearch"
            @submit.native.prevent
          >
            <el-form-item label="住院号">
              <el-input
                v-model.trim="queryForm.inpatientNo"
                placeholder="住院号"
                clearable
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="住院次数">
              <el-input
                v-model="queryForm.admissionTimes"
                placeholder="次数"
                clearable
                style="width: 100px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
              <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
              <el-button
                type="warning"
                icon="el-icon-refresh-right"
                :disabled="!selection.length"
                @click="handleBatchRegenerate"
              >批量重新生成</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head spd-panel__head--split">
          <span>无纸化条码列表</span>
          <span v-if="selection.length" class="spd-panel__head-meta">已选 {{ selection.length }} 条</span>
        </div>
        <div class="spd-table-panel__wrap">
          <ele-pro-table
            ref="table"
            class="data-table"
            size="mini"
            border
            stripe
            :toolbar="false"
            :header-overflow-hidden="false"
            :height="tableHeight"
            :pageSize="size"
            :pageSizes="[10, 20, 50, 100]"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            v-loading="loading"
            cache-key="PaperlessBarcodeSearchTable"
            @selection-change="onSelectionChange"
          >
            <template v-slot:fileUrl="{ row }">
              <el-link
                :href="resolvePdfUrl(row.fileUrl)"
                target="_blank"
                type="primary"
                :underline="false"
              >{{ row.fileUrl }}</el-link>
              <el-link
                type="primary"
                :underline="false"
                style="margin-left: 8px"
                @click="openPdf(row.fileUrl)"
              >打开</el-link>
            </template>
            <template v-slot:action="{ row }">
              <el-link type="primary" :underline="false" @click="handleRegenerate(row)">重新生成</el-link>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getPaperlessInfo,
  regenerateCaseStatusReceipt
} from '@/api/KSInventory/PaperlessBarcodeSearch';
import { BACK_BASE_URL } from '@/config/setting';

export default {
  name: 'PaperlessBarcodeSearch',
  data() {
    return {
      queryForm: {
        inpatientNo: '',
        admissionTimes: null
      },
      tableHeight: 'calc(100vh - 300px)',
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'inpatientNo',
          label: '住院号',
          minWidth: 120,
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
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 90,
          align: 'center',
          resizable: false,
          slot: 'action',
          className: 'action-col'
        }
      ],
      loading: false,
      size: 10,
      selection: []
    };
  },
  methods: {
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
    handleSearch() {
      this.$refs.table.reload({ where: this.queryForm, page: 1 });
    },
    handleReset() {
      this.queryForm.inpatientNo = '';
      this.queryForm.admissionTimes = null;
      this.handleSearch();
    },
    onSelectionChange(selection) {
      this.selection = selection || [];
    },
    async handleRegenerate(row) {
      const fileId = row?.fileId;
      if (!fileId) {
        this.$message.warning('文件ID为空，无法重新生成');
        return;
      }

      const loading = this.$messageLoading('重新生成中...');
      try {
        const res = await regenerateCaseStatusReceipt({
          uniqueIdentifier: fileId
        });
        this.$message.success(res?.msg || '重新生成成功');
      } catch (error) {
        this.$message.error(error?.message || '重新生成失败');
      } finally {
        loading.close();
      }
    },
    async handleBatchRegenerate() {
      if (!this.selection.length) {
        this.$message.warning('请先勾选需要重新生成的数据');
        return;
      }

      const loading = this.$messageLoading('批量重新生成中...');
      try {
        const tasks = this.selection
          .filter((item) => !!item?.fileId)
          .map((item) =>
            regenerateCaseStatusReceipt({ uniqueIdentifier: item.fileId })
          );

        if (!tasks.length) {
          this.$message.warning('所选数据文件ID为空，无法重新生成');
          return;
        }

        await Promise.all(tasks);
        this.$message.success(`批量重新生成成功，共${tasks.length}条`);
      } catch (error) {
        this.$message.error(error?.message || '批量重新生成失败');
      } finally {
        loading.close();
      }
    },
    openPdf(url) {
      const pdfUrl = this.resolvePdfUrl(url);
      if (!pdfUrl) return;
      window.open(pdfUrl, '_blank');
    },
    resolvePdfUrl(url) {
      if (!url) return '';

      const cleanUrl = String(url).trim().replace('/undefined', '');
      if (!cleanUrl) return '';

      if (!BACK_BASE_URL) {
        return cleanUrl;
      }

      const baseUrl = BACK_BASE_URL.replace(/\/$/, '');

      if (cleanUrl.indexOf(baseUrl) === 0) {
        return cleanUrl;
      }

      const joinBackBaseUrl = (path) => {
        if (!path) return baseUrl;

        const normalizedPath = String(path)
          .replace(/^\.\//, '')
          .replace(/\\/g, '/');

        return normalizedPath.charAt(0) === '/'
          ? `${baseUrl}${normalizedPath}`
          : `${baseUrl}/${normalizedPath}`;
      };

      try {
        const backBaseUrlObj = new URL(baseUrl);
        const backBasePath =
          backBaseUrlObj.pathname === '/'
            ? ''
            : backBaseUrlObj.pathname.replace(/\/$/, '');

        const parsedUrl = new URL(cleanUrl);
        let relativePath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;

        if (backBasePath && relativePath.indexOf(`${backBasePath}/`) === 0) {
          relativePath = relativePath.slice(backBasePath.length);
        } else if (backBasePath && relativePath === backBasePath) {
          relativePath = '/';
        }

        return joinBackBaseUrl(relativePath);
      } catch (error) {
        return joinBackBaseUrl(cleanUrl);
      }
    }
  }
};
</script>

<style scoped>
.paperless-barcode-search-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.paperless-barcode-search >>> .el-table th .cell {
  white-space: nowrap;
}

.paperless-barcode-search >>> .action-col .cell {
  line-height: 23px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
