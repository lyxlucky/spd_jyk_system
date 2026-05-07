<template>
  <div class="paperless-barcode-search">
    <el-card shadow="never" class="mb-12">
      <el-form
        :model="queryForm"
        :inline="true"
        label-width="80px"
        size="small"
        @submit.native.prevent
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
          <el-button
            type="primary"
            :disabled="!selection.length"
            @click="handleBatchRegenerate"
            >批量重新生成</el-button
          >
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
        :selection.sync="selection"
        @selection-change="onSelectionChange"
        v-loading="loading"
        cache-key="PaperlessBarcodeSearchTable"
      >
        <template v-slot:fileUrl="{ row }">
          <el-link
            :href="resolvePdfUrl(row.fileUrl)"
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
        <template v-slot:action="{ row }">
          <el-button type="text" @click="handleRegenerate(row)">重新生成</el-button>
        </template>
      </ele-pro-table>
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
        // 搜索表单
        queryForm: {
          inpatientNo: '',
          admissionTimes: null
        },
        // 表格列配置
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
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 120,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true
          }
        ],
        loading: false,
        size: 10,
        selection: []
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
      /**
       * 打开PDF
       */
      openPdf(url) {
        const pdfUrl = this.resolvePdfUrl(url);
        if (!pdfUrl) return;
        window.open(pdfUrl, '_blank');
      },
      /**
       * 根据当前前后端环境解析PDF地址
       */
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

<style lang="scss" scoped>
  .paperless-barcode-search .mb-12 {
    margin-bottom: 12px;
  }
</style>
