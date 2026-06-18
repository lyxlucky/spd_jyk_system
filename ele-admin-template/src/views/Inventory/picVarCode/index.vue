<template>
  <div class="ele-body spd-page pic-var-code-page">
    <el-card shadow="never">
      <ele-pro-table
        ref="table"
        row-key="ID"
        height="calc(100vh - 370px)"
        :stripe="true"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        :page-size="30"
        :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
        cache-key="PicVarCodeTable"
      >
        <template v-slot:toolbar>
          <PicVarCodeSearch
            :show-spd-approve="showSpdApprove"
            :show-procure-approve="showProcureApprove"
            :approve-pass-label="approvePassLabel"
            :approve-deny-label="approveDenyLabel"
            @search="onSearch"
            @export="onExport"
            @aiReviewSubmit="aiReviewSubmit"
            @aiReviewSync="aiReviewSync"
            @spdApprove="spdApprove"
            @spdDeny="spdDenyVisible = true"
            @approve="procureApprove"
            @deny="denyVisible = true"
            @discard="dropItem"
          />
        </template>

        <template v-slot:TYPE="{ row }">
          {{ picTypeLabel(row.TYPE) }}
        </template>

        <template v-slot:ENABLE="{ row }">
          <el-tag v-if="row.ENABLE == '1'" type="success" size="mini">启用</el-tag>
          <el-tag v-else-if="row.ENABLE == '0'" type="info" size="mini">冻结</el-tag>
          <span v-else>{{ row.ENABLE }}</span>
        </template>

        <template v-slot:APPROVAL_NUMBER="{ row }">
          <el-link
            v-if="row.APPROVAL_NUMBER"
            type="primary"
            :underline="false"
            @click.stop="openApproval(row.APPROVAL_NUMBER)"
          >
            {{ row.APPROVAL_NUMBER }}
          </el-link>
        </template>

        <template v-slot:PIC_URL="{ row }">
          <div v-if="row.PIC_URL" class="image-container" v-viewer>
            <img
              v-if="!String(row.PIC_URL).toLowerCase().includes('pdf')"
              class="image"
              :src="picFullUrl(row.PIC_URL)"
            />
            <el-link v-else type="primary" @click.stop="openPdf(row.PIC_URL)">pdf 文件</el-link>
          </div>
        </template>

        <template v-slot:TB_STATE="{ row }">
          {{ row.TB_STATE == '1' ? '同步' : row.TB_STATE == '0' ? '不同步' : row.TB_STATE }}
        </template>

        <template v-slot:STATE="{ row }">
          <el-tag v-if="row.STATE == '0' || row.STATE == 0" type="primary" size="mini">新增</el-tag>
          <el-tag v-else-if="row.STATE == '1' || row.STATE == 1" type="success" size="mini">已审批</el-tag>
          <el-tag v-else-if="row.STATE == '2' || row.STATE == 2" type="danger" size="mini">审批未通过</el-tag>
          <span v-else class="text-muted">{{ procureStateLabel(row.STATE) }}</span>
        </template>

        <template v-slot:SPD_SP_STATE="{ row }">
          <el-tag v-if="row.SPD_SP_STATE == '1' || row.SPD_SP_STATE == 1" type="success" size="mini">已审核</el-tag>
          <el-tag v-else-if="row.SPD_SP_STATE == '2' || row.SPD_SP_STATE == 2" type="danger" size="mini">审核未通过</el-tag>
          <el-tag v-else-if="row.SPD_SP_STATE == '0' || row.SPD_SP_STATE == 0" type="info" size="mini">待审核</el-tag>
          <span v-else class="text-muted">{{ spdSpStateLabel(row.SPD_SP_STATE) }}</span>
        </template>

        <template v-slot:AI_STATUS="{ row }">
          <el-link
            type="primary"
            :underline="false"
            @click.stop="openAiDetail(row)"
          >
            <el-tag :type="aiStatusTagType(row.AI_STATUS)" size="mini" effect="plain">
              {{ aiStatusLabel(row.AI_STATUS) }}
            </el-tag>
            <el-tag
              v-if="isAiHumanMismatch(row)"
              type="warning"
              size="mini"
              effect="dark"
              style="margin-left: 4px"
            >
              不一致
            </el-tag>
          </el-link>
        </template>

        <template v-slot:AI_OUTCOME="{ row }">
          <el-tag
            v-if="row.AI_OUTCOME"
            :type="autoOutcomeTagType(row.AI_OUTCOME)"
            size="mini"
            effect="light"
          >
            {{ autoOutcomeLabel(row.AI_OUTCOME) }}
          </el-tag>
          <span v-else class="text-muted">—</span>
        </template>

        <template v-slot:AI_SUMMARY="{ row }">
          <el-link
            v-if="row.AI_SUMMARY"
            type="primary"
            :underline="false"
            @click.stop="openAiDetail(row)"
          >
            {{ formatAiSummaryBrief(row.AI_SUMMARY, 36) || '—' }}
          </el-link>
          <span v-else class="text-muted">—</span>
        </template>

        <template v-slot:action="{ row }">
          <div class="table-action-cell">
            <el-button
              type="primary"
              plain
              size="mini"
              icon="el-icon-document"
              @click.stop="openAiDetail(row)"
            >
              AI审核详情
            </el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              icon="el-icon-delete"
              @click.stop="confirmDelete(row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </ele-pro-table>
    </el-card>

    <ele-modal
      width="400px"
      title="不通过原因"
      :visible.sync="denyVisible"
      position="center"
      append-to-body
    >
      <DenyReason @confirm="onDenyConfirm" @cancel="denyVisible = false" />
    </ele-modal>

    <ele-modal
      width="400px"
      title="SPD 审核不通过原因"
      :visible.sync="spdDenyVisible"
      position="center"
      append-to-body
    >
      <DenyReason @confirm="onSpdDenyConfirm" @cancel="spdDenyVisible = false" />
    </ele-modal>

    <AiReviewDetailDialog :visible.sync="aiDetailVisible" :var-pic-id="aiDetailVarPicId" />
    <ApprovalDetailDialog
      :visible.sync="approvalVisible"
      :approval-number="approvalNumber"
    />
  </div>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { BACK_BASE_URL, HOME_HP } from '@/config/setting';
  import {
    getVarPicList,
    ApproveVarPic,
    ApproveVarPicSpd,
    PicVarDiscardUse,
    deleteVarPic,
    submitVarPicAiReview,
    syncVarPicAiReviewStatus
  } from '@/api/Inventory/picVarCode/index';
  import {
    picTypeLabel,
    aiStatusLabel,
    aiStatusTagType,
    autoOutcomeLabel,
    autoOutcomeTagType,
    isAiHumanMismatch,
    aiReviewListSummary,
    formatAiSummaryBrief,
    procureStateLabel,
    spdSpStateLabel
  } from '@/utils/aiReviewDisplay';
  import { hasPicVarSpdApprove, hasPicVarProcureApprove } from '@/utils/picVarPerm';
  import PicVarCodeSearch from './components/PicVarCodeSearch.vue';
  import ApprovalDetailDialog from './components/ApprovalDetailDialog.vue';
  import AiReviewDetailDialog from '@/views/Home/qualificationcheck/components/AiReviewDetailDialog.vue';
  import DenyReason from '@/views/Home/qualificationcheck/components/DenyReason.vue';

  export default {
    name: 'PicVarCode',
    components: {
      PicVarCodeSearch,
      ApprovalDetailDialog,
      AiReviewDetailDialog,
      DenyReason
    },
    data() {
      return {
        listWhere: { state: '0' },
        selection: [],
        denyVisible: false,
        spdDenyVisible: false,
        denyMode: 'procure',
        aiDetailVisible: false,
        aiDetailVarPicId: '',
        approvalVisible: false,
        approvalNumber: '',
        picturePrefix: '/Upload/ProPic/',
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center',
            fixed: 'left'
          },
          { slot: 'TYPE', label: '类型', minWidth: 110, align: 'center' },
          { slot: 'ENABLE', label: '启用状态', width: 80, align: 'center' },
          { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 110, showOverflowTooltip: true },
          { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 120, showOverflowTooltip: true },
          { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 100, showOverflowTooltip: true },
          { slot: 'APPROVAL_NUMBER', label: '注册证', width: 130 },
          { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 120, showOverflowTooltip: true },
          { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 120, showOverflowTooltip: true },
          { slot: 'PIC_URL', label: '图片', width: 200, align: 'center' },
          {
            prop: 'START_TIME',
            label: '起始时间',
            width: 100,
            formatter: (row) => this.fmtDate(row.START_TIME, row.TYPE)
          },
          {
            prop: 'END_TIME',
            label: '有效期',
            width: 100,
            formatter: (row) => this.fmtDate(row.END_TIME, row.TYPE)
          },
          { slot: 'TB_STATE', label: '同注册证', width: 80, align: 'center' },
          { slot: 'STATE', label: '状态', width: 96, align: 'center' },
          { slot: 'SPD_SP_STATE', label: '审核状态', width: 96, align: 'center' },
          { slot: 'AI_STATUS', label: 'AI 状态', width: 96, align: 'center' },
          { slot: 'AI_OUTCOME', label: 'AI 建议', width: 108, align: 'center' },
          { slot: 'AI_SUMMARY', label: 'AI 审查意见', minWidth: 160 },
          { prop: 'REMARK', label: '备注/说明', minWidth: 100, showOverflowTooltip: true },
          {
            prop: 'CREATE_TIME',
            label: '创建时间',
            width: 155,
            formatter: (row) =>
              this.$util.toDateString(row.CREATE_TIME, 'yyyy-MM-dd HH:mm:ss')
          },
          { prop: 'APP_MAN', label: '审批人', width: 90, showOverflowTooltip: true },
          {
            prop: 'APP_TIME',
            label: '审批时间',
            width: 155,
            formatter: (row) =>
              row.APP_TIME && row.APP_TIME !== '0001-01-01T00:00:00'
                ? this.$util.toDateString(row.APP_TIME, 'yyyy-MM-dd HH:mm:ss')
                : '—'
          },
          { prop: 'PROD_REGISTRATION_CODE', label: '注册证 ID', width: 100, showOverflowTooltip: true },
          { slot: 'action', label: '操作', width: 200, align: 'center', fixed: 'right' }
        ]
      };
    },
    computed: {
      showSpdApprove() {
        // return this.hasPermTitle('品种资质审核');
        return true;
      },
      showProcureApprove() {
        // return this.hasPermTitle('品种资质审批');
        return true;
      },
      approvePassLabel() {
        return HOME_HP === 'bdrm' ? '招采审批通过' : '审批通过';
      },
      approveDenyLabel() {
        return HOME_HP === 'bdrm' ? '招采审批不通过' : '审批不通过';
      }
    },
      methods: {
      picTypeLabel,
      formatAiSummaryBrief,
      procureStateLabel,
      spdSpStateLabel,
      aiStatusLabel,
      aiStatusTagType,
      autoOutcomeLabel,
      autoOutcomeTagType,
      isAiHumanMismatch,
      aiReviewListSummary,
      hasPermTitle(title) {
        const list = this.$store.state.user.info.permission_group || [];
        return list.some((p) => p.title === title || p.component === title);
      },
      picFullUrl(path) {
        return BACK_BASE_URL + this.picturePrefix + path;
      },
      openPdf(path) {
        window.open(this.picFullUrl(path));
      },
      fmtDate(val, type) {
        if (!val || val === '0001-01-01T00:00:00' || type == 2 || type == 3) {
          return '';
        }
        return String(val).substring(0, 10);
      },
      truncateSummary(s) {
        return formatAiSummaryBrief(s, 36);
      },
      datasource({ page, limit, where }) {
        const w = { ...this.listWhere, ...(where || {}) };
        return getVarPicList({ page, limit, where: w }).then((res) => ({
          count: res.total,
          list: res.result || []
        }));
      },
      reload(where) {
        if (where) {
          this.listWhere = { ...where };
        }
        this.$refs.table.reload({ page: 1, where: this.listWhere });
      },
      onSearch(where) {
        this.reload(where);
      },
      openAiDetail(row) {
        this.aiDetailVarPicId = row.ID;
        this.aiDetailVisible = true;
      },
      openApproval(num) {
        this.approvalNumber = num;
        this.approvalVisible = true;
      },
      selectedIds() {
        return this.selection.map((item) => ({ ID: item.ID }));
      },
      aiReviewSubmit() {
        if (!this.selection.length) {
          this.$message.warning('请至少选中一行数据');
          return;
        }
        this.$confirm('确认为所选记录发起 AI 资质审核？（不会修改人工/招采审批状态）', '提示', {
          type: 'info'
        })
          .then(() => {
            const loading = this.$messageLoading('正在提交 AI 审核…');
            submitVarPicAiReview({ json: this.selectedIds() })
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
                if (res.errors && res.errors.length) {
                  this.$alert(res.errors.join('\n'), '部分失败', { type: 'warning' });
                }
                this.reload();
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err.message || err);
              });
          })
          .catch(() => {});
      },
      aiReviewSync() {
        if (!this.selection.length) {
          this.$message.warning('请至少选中一行数据');
          return;
        }
        const loading = this.$messageLoading('正在同步…');
        syncVarPicAiReviewStatus({ json: this.selectedIds() })
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || err);
          });
      },
      reloadAfterApprove(appstate) {
        const nextWhere = { ...this.listWhere };
        if (String(appstate) === '1') {
          nextWhere.state = '1';
        } else if (String(appstate) === '2') {
          nextWhere.state = '2';
        }
        this.reload(nextWhere);
        if (String(appstate) === '1') {
          this.$message.info('已切换筛选为「已审批」，可在列表中查看刚操作的记录');
        }
      },
      procureApprove(state) {
        if (!this.selection.length) {
          this.$message.warning('请至少选中一行数据');
          return;
        }
        const isPass = String(state) === '1';
        const tip = isPass
          ? '招采审批仅更新列「状态」（已审批），不会修改列「审核状态」。若只做过 SPD 审核，仍需点此完成招采审批。'
          : '招采审批不通过仅更新列「状态」，不会修改列「审核状态」。';
        this.$confirm(tip, '招采审批', { type: isPass ? 'info' : 'warning' })
          .then(() => {
            const loading = this.$messageLoading('处理中…');
            ApproveVarPic({ json: this.selectedIds(), appstate: state })
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
                this.reloadAfterApprove(state);
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err.message || err);
              });
          })
          .catch(() => {});
      },
      spdApprove(state) {
        if (!this.selection.length) {
          this.$message.warning('请至少选中一行数据');
          return;
        }
        const isPass = String(state) === '1';
        const tip = isPass
          ? 'SPD 审核仅更新列「审核状态」（已审核），不会修改列「状态」（招采审批）。'
          : 'SPD 审核不通过仅更新列「审核状态」，不会修改列「状态」。';
        this.$confirm(tip, 'SPD 审核', { type: isPass ? 'info' : 'warning' })
          .then(() => {
            const loading = this.$messageLoading('处理中…');
            ApproveVarPicSpd({ json: this.selectedIds(), appstate: state })
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
                this.reload();
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err.message || err);
              });
          })
          .catch(() => {});
      },
      onDenyConfirm(data) {
        const loading = this.$messageLoading('处理中…');
        ApproveVarPic({
          json: this.selectedIds(),
          appstate: 2,
          PASS_REASON: data.reason
        })
          .then((res) => {
            loading.close();
            this.denyVisible = false;
            this.$message.success(res.msg);
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || err);
          });
      },
      onSpdDenyConfirm(data) {
        const loading = this.$messageLoading('处理中…');
        ApproveVarPicSpd({
          json: this.selectedIds(),
          appstate: 2,
          PASS_REASON: data.reason
        })
          .then((res) => {
            loading.close();
            this.spdDenyVisible = false;
            this.$message.success(res.msg);
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || err);
          });
      },
      dropItem() {
        if (!this.selection.length) {
          this.$message.warning('请至少选中一行数据');
          return;
        }
        const ids = this.selection.map((r) => r.ID).join(',') + ',';
        this.$confirm('是否弃用所选数据？', '提示', { type: 'warning' })
          .then(() => {
            const loading = this.$messageLoading('处理中…');
            PicVarDiscardUse({ ids })
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
                this.reload();
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err.message || err);
              });
          })
          .catch(() => {});
      },
      confirmDelete(row) {
        this.$confirm('确定删除该文件？', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false
        })
          .then(() => {
            this.deleteOne(row);
          })
          .catch(() => {});
      },
      deleteOne(row) {
        const loading = this.$messageLoading('删除中…');
        deleteVarPic({ id: row.ID })
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || err);
          });
      },
      onExport(where) {
        const loading = this.$messageLoading('导出中…');
        getVarPicList({ page: 1, limit: 999999, where: { ...this.listWhere, ...where } })
          .then((res) => {
            loading.close();
            const headers = [
              '类型',
              '启用状态',
              '品种编码',
              '品种名称',
              '规格型号',
              '注册证',
              '生产企业',
              '供应商名称',
              '起始时间',
              '有效期',
              '同注册证',
              '状态',
              '审核状态',
              'AI状态',
              'AI审查意见',
              '备注/说明',
              '创建时间',
              '审批人',
              '审批时间',
              '注册证ID'
            ];
            const rows = (res.result || []).map((r) => [
              picTypeLabel(r.TYPE),
              r.ENABLE == '1' || r.ENABLE == 1 ? '启用' : r.ENABLE == '0' || r.ENABLE == 0 ? '冻结' : r.ENABLE,
              r.VARIETIE_CODE_NEW,
              r.VARIETIE_NAME,
              r.SPECIFICATION_OR_TYPE,
              r.APPROVAL_NUMBER,
              r.MANUFACTURING_ENT_NAME,
              r.SUPPLIER_NAME,
              this.fmtDate(r.START_TIME, r.TYPE),
              this.fmtDate(r.END_TIME, r.TYPE),
              r.TB_STATE == '1' ? '同步' : r.TB_STATE == '0' ? '不同步' : r.TB_STATE,
              this.stateExportLabel(r.STATE),
              r.SPD_SP_STATE == '1' ? '已审核' : r.SPD_SP_STATE == '2' ? '审核未通过' : '',
              aiStatusLabel(r.AI_STATUS),
              r.AI_SUMMARY || '',
              r.REMARK,
              this.$util.toDateString(r.CREATE_TIME, 'yyyy-MM-dd HH:mm:ss'),
              r.APP_MAN,
              this.$util.toDateString(r.APP_TIME || r.CREATE_TIME, 'yyyy-MM-dd HH:mm:ss'),
              r.PROD_REGISTRATION_CODE
            ]);
            const sheet = utils.aoa_to_sheet([headers, ...rows]);
            writeFile({ Sheets: { Sheet1: sheet }, SheetNames: ['Sheet1'] }, '品种图片信息.xlsx');
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message || err);
          });
      },
      stateExportLabel(state) {
        if (state == 0 || state == '0') return '新增';
        if (state == 1 || state == '1') return '已审批';
        if (state == 2 || state == '2') return '审批未通过';
        return state;
      }
    }
  };
</script>

<style scoped>
  .pic-var-code-page {
    padding: 12px;
  }
  .image {
    height: 32px;
    max-width: 100%;
    cursor: zoom-in;
  }
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .text-muted {
    color: #c0c4cc;
  }
  .table-action-cell {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 2px 0;
    white-space: nowrap;
  }
  .table-action-cell .el-button + .el-button {
    margin-left: 0;
  }
  .table-action-cell .el-button--mini {
    padding: 5px 10px;
  }
</style>
