<template>

  <ele-modal

    width="1080px"

    title="AI 资质审核详情"

    :visible="visible"

    position="center"

    top="4vh"

    append-to-body

    class="ai-review-detail-modal"

    @update:visible="updateVisible"

  >

    <div v-loading="loading" class="ai-review-body">

      <template v-if="detail">

        <el-alert

          :type="verdictAlertType"

          :closable="false"

          show-icon

          class="ai-review-verdict-banner"

        >

          <template slot="title">

            <span class="ai-verdict-title">

              AI 建议：{{ verdictText }}

              <el-tag

                v-if="riskLevelText"

                size="mini"

                effect="plain"

                style="margin-left: 8px"

              >

                风险 {{ riskLevelText }}

              </el-tag>

              <el-tag

                v-if="issueCount > 0"

                size="mini"

                type="danger"

                effect="plain"

                style="margin-left: 6px"

              >

                {{ issueCount }} 项问题

              </el-tag>

            </span>

          </template>

          <div slot="default" class="ai-verdict-summary">
            {{ summaryBanner }}
          </div>

        </el-alert>



        <el-alert

          v-if="humanMismatch"

          type="warning"

          :closable="false"

          show-icon

          title="人审结论与 AI 建议不一致，请人工核对。"

          class="ai-review-alert"

        />



        <el-row :gutter="16" class="ai-review-main">

          <el-col :span="remotePicUrl ? 10 : 24">

            <div class="ai-preview-panel">

              <p class="panel-title">资质附件</p>

              <div v-if="remotePicUrl && !isPdf" class="ai-pic-panel__img" v-viewer>

                <img :src="remotePicUrl" alt="资质图片" />

              </div>

              <div v-else-if="remotePicUrl && isPdf" class="ai-pic-panel__pdf">

                <el-link type="primary" :href="remotePicUrl" target="_blank">打开 PDF 预览</el-link>

              </div>

              <el-empty v-else description="无附件" :image-size="56" />

            </div>

          </el-col>

          <el-col :span="remotePicUrl ? 14 : 24">

            <el-tabs v-model="activeTab" class="ai-review-tabs">

              <el-tab-pane label="审查结论" name="summary">

                <el-descriptions :column="1" border size="small">

                  <el-descriptions-item label="任务 ID">

                    {{ detail.reviewTaskId || '—' }}

                  </el-descriptions-item>

                  <el-descriptions-item label="资质类型">

                    {{ picTypeLabel(detail.type) }}

                  </el-descriptions-item>

                  <el-descriptions-item label="处理状态">

                    <el-tag :type="aiStatusTagType(detail.aiStatus)" size="mini">

                      {{ statusText }}

                    </el-tag>

                  </el-descriptions-item>

                  <el-descriptions-item label="风险分">

                    <template v-if="riskNum != null">

                      <el-progress

                        :percentage="Math.min(100, Math.max(0, riskNum))"

                        :color="riskProgressColor"

                        :stroke-width="10"

                        style="max-width: 200px; display: inline-block"

                      />

                      <span class="risk-level-text">{{ riskLevelText }}</span>

                    </template>

                    <span v-else>{{ riskLevelText }}</span>

                  </el-descriptions-item>

                  <el-descriptions-item label="审核时间">

                    {{ detail.aiReviewTime || '—' }}

                  </el-descriptions-item>

                  <el-descriptions-item v-if="remote.errorMessage" label="错误信息">

                    {{ remote.errorMessage }}

                  </el-descriptions-item>

                </el-descriptions>

                <div v-if="parsedSummary.hasStructured" class="ai-summary-panel">
                  <div class="ai-summary-panel__row">
                    <span class="ai-summary-panel__label">审核结论</span>
                    <el-tag
                      v-if="parsedSummary.conclusion"
                      :type="conclusionTagType(parsedSummary.conclusion)"
                      size="small"
                      effect="plain"
                    >
                      {{ parsedSummary.conclusion }}
                    </el-tag>
                    <span v-else class="text-muted">—</span>
                  </div>
                  <div v-if="parsedSummary.riskLevel" class="ai-summary-panel__row">
                    <span class="ai-summary-panel__label">风险等级</span>
                    <el-tag
                      :type="parsedSummary.riskLevel === '高' ? 'danger' : parsedSummary.riskLevel === '中' ? 'warning' : 'success'"
                      size="small"
                      effect="plain"
                    >
                      {{ parsedSummary.riskLevel }}
                    </el-tag>
                  </div>
                  <div v-if="parsedSummary.findingItems && parsedSummary.findingItems.length" class="ai-summary-panel__block">
                    <p class="ai-summary-panel__section-title">主要发现</p>
                    <div
                      v-for="(item, fi) in parsedSummary.findingItems"
                      :key="'f' + fi"
                      class="ai-finding-card"
                    >
                      <div class="ai-finding-card__head">
                        <span class="ai-finding-card__title">{{ item.title || ('问题 ' + (fi + 1)) }}</span>
                        <el-tag
                          v-if="item.severity"
                          :type="severityTagType(item.severity)"
                          size="mini"
                          effect="plain"
                        >
                          {{ item.severityLabel || severityLabel(item.severity) }}
                        </el-tag>
                      </div>
                      <p v-if="item.description" class="ai-finding-card__desc">{{ item.description }}</p>
                      <p v-if="item.suggestion" class="ai-finding-card__suggest">
                        <span class="ai-finding-card__suggest-label">建议：</span>{{ item.suggestion }}
                      </p>
                    </div>
                  </div>
                  <div v-if="parsedSummary.suggestionItems && parsedSummary.suggestionItems.length" class="ai-summary-panel__block">
                    <p class="ai-summary-panel__section-title">处理建议</p>
                    <div
                      v-for="(item, si) in parsedSummary.suggestionItems"
                      :key="'s' + si"
                      class="ai-suggest-card"
                    >
                      <p v-if="item.label" class="ai-suggest-card__label">{{ item.label }}</p>
                      <p class="ai-suggest-card__text">{{ item.text }}</p>
                    </div>
                  </div>
                </div>
                <el-empty
                  v-else-if="detail.aiStatus === 'done' && !detail.aiSummary"
                  description="暂无 AI 文字总结"
                  :image-size="48"
                />

              </el-tab-pane>



              <el-tab-pane :label="issuesTabLabel" name="issues">

                <el-table v-if="issues.length" :data="issues" size="mini" border max-height="320">

                  <el-table-column label="级别" width="80" align="center">

                    <template slot-scope="{ row }">

                      <el-tag :type="severityTagType(row.severity)" size="mini" effect="plain">

                        {{ severityLabel(row.severity, row.severityText) }}

                      </el-tag>

                    </template>

                  </el-table-column>

                  <el-table-column label="字段" width="120" show-overflow-tooltip>

                    <template slot-scope="{ row }">

                      {{ fieldLabel(row.field, row.fieldLabel) }}

                    </template>

                  </el-table-column>

                  <el-table-column prop="message" label="说明" min-width="200" show-overflow-tooltip />

                </el-table>

                <el-empty v-else description="未发现问题项" :image-size="56" />

              </el-tab-pane>



              <el-tab-pane :label="fieldsTabLabel" name="fields">

                <el-table v-if="fields.length" :data="fields" size="mini" border max-height="320">

                  <el-table-column label="字段" width="140" show-overflow-tooltip>

                    <template slot-scope="{ row }">

                      {{ fieldLabel(row.field, row.label) }}

                    </template>

                  </el-table-column>

                  <el-table-column prop="value" label="识别值" min-width="160" show-overflow-tooltip />

                  <el-table-column label="置信度" width="80" align="center">

                    <template slot-scope="{ row }">

                      {{ formatConfidence(row.confidence) }}

                    </template>

                  </el-table-column>

                </el-table>

                <el-empty v-else description="暂无抽取字段" :image-size="56" />

              </el-tab-pane>



              <el-tab-pane label="执行步骤" name="steps">

                <el-table v-if="steps.length" :data="steps" size="mini" border max-height="320">

                  <el-table-column prop="attemptNo" label="次数" width="56" align="center" />

                  <el-table-column prop="stepName" label="步骤" width="110" show-overflow-tooltip />

                  <el-table-column label="状态" width="88" align="center">

                    <template slot-scope="{ row }">

                      <el-tag size="mini" :type="stepStatusTagType(row.status)">

                        {{ stepStatusLabel(row.status, row.statusText) }}

                      </el-tag>

                    </template>

                  </el-table-column>

                  <el-table-column label="耗时" width="76" align="center">

                    <template slot-scope="{ row }">

                      {{ row.durationMs != null ? row.durationMs + 'ms' : '—' }}

                    </template>

                  </el-table-column>

                  <el-table-column prop="errorMessage" label="错误" min-width="120" show-overflow-tooltip />

                </el-table>

                <el-empty v-else description="无执行记录" :image-size="56" />

              </el-tab-pane>

            </el-tabs>

          </el-col>

        </el-row>

      </template>



      <p v-if="!detail && !loading" class="empty-tip">暂无 AI 审核数据，请先发起 AI 审核。</p>

    </div>

    <template v-slot:footer>

      <el-button size="small" @click="updateVisible(false)">关闭</el-button>

      <el-button type="primary" size="small" :loading="loading" @click="refresh(true)">

        刷新状态

      </el-button>

    </template>

  </ele-modal>

</template>



<script>

  import { getVarPicAiReviewDetail } from '@/api/Home/Qualificationcheck/index';

  import { BACK_BASE_URL } from '@/config/setting';

  import {

    picTypeLabel,

    aiStatusLabel,

    aiStatusTagType,

    autoOutcomeLabel,

    autoOutcomeAlertType,

    riskLevelLabel,

    severityLabel,

    severityTagType,

    fieldLabel,

    stepStatusLabel,

    stepStatusTagType,

    normalizeRemote,

    pickIssues,

    pickFields,

    pickSteps,

    riskScore,

    isAiHumanMismatch,

    parseAiSummaryForDisplay,

    formatAiSummaryBrief,

    pickAiSummarySections,

    aiSummaryBannerLine

  } from '@/utils/aiReviewDisplay';



  export default {

    name: 'AiReviewDetailDialog',

    props: {

      visible: Boolean,

      varPicId: String

    },

    data() {

      return {

        loading: false,

        detail: null,

        activeTab: 'summary'

      };

    },

    computed: {

      remote() {

        return normalizeRemote(this.detail);

      },

      issues() {

        return pickIssues(this.detail);

      },

      fields() {

        return pickFields(this.detail);

      },

      steps() {

        return pickSteps(this.detail);

      },

      issueCount() {

        return this.issues.length;

      },

      riskNum() {

        return riskScore(this.remote, this.detail);

      },

      riskProgressColor() {

        const n = this.riskNum;

        if (n == null || isNaN(n)) return '#909399';

        if (n >= 70) return '#67C23A';

        if (n >= 40) return '#E6A23C';

        return '#F56C6C';

      },

      statusText() {

        const d = this.detail || {};

        return aiStatusLabel(

          d.aiStatus,

          d.aiStatusText || this.remote.statusText

        );

      },

      verdictText() {

        const d = this.detail || {};

        if (d.aiStatus === 'failed') return '审核失败';

        if (d.aiStatus === 'pending') return '处理中';

        return autoOutcomeLabel(

          d.aiOutcome,

          d.aiOutcomeText || this.remote.autoOutcomeText

        );

      },

      verdictAlertType() {

        const d = this.detail || {};

        if (d.aiStatus === 'failed') return 'error';

        if (d.aiStatus === 'pending') return 'info';

        return autoOutcomeAlertType(d.aiOutcome);

      },

      riskLevelText() {

        const d = this.detail || {};

        return riskLevelLabel(

          d.aiRiskLevel || this.remote.riskLevel,

          d.aiRiskLevelText || this.remote.riskLevelText

        );

      },

      summaryText() {

        const d = this.detail || {};

        if (d.aiSummary) return d.aiSummary;

        if (d.aiStatus === 'failed') {

          return this.remote.errorMessage || '审核失败，请检查大模型配置或证件清晰度后重试。';

        }

        if (d.aiStatus === 'pending') {

          return 'AI 正在处理中，可点击「刷新状态」同步最新结果。';

        }

        return '—';

      },

      parsedSummary() {

        const d = this.detail || {};

        const sections = pickAiSummarySections(d);

        return parseAiSummaryForDisplay(d.aiSummary || '', sections);

      },

      summaryBanner() {
        const raw = (this.detail && this.detail.aiSummary) || '';
        if (!raw) return this.summaryText;
        return formatAiSummaryBrief(raw, 120) || this.summaryText;
      },

      issuesTabLabel() {

        const n = this.issueCount;

        return n ? `问题清单（${n}）` : '问题清单';

      },

      fieldsTabLabel() {

        const n = this.fields.length;

        return n ? `抽取字段（${n}）` : '抽取字段';

      },

      humanMismatch() {
        if (!this.detail) return false;
        return isAiHumanMismatch({
          AI_STATUS: this.detail.aiStatus,
          AI_OUTCOME: this.detail.aiOutcome,
          SPD_SP_STATE: this.detail.spdSpState
        });
      },

      remotePicUrl() {

        const url = this.detail && this.detail.picUrl;

        if (!url) return '';

        return BACK_BASE_URL + '/Upload/ProPic/' + url;

      },

      isPdf() {

        const url = this.detail && this.detail.picUrl;

        return url && String(url).toLowerCase().includes('pdf');

      }

    },

    watch: {

      visible(val) {

        if (val && this.varPicId) {

          this.activeTab = 'summary';

          this.refresh(true);

        }

        if (!val) {

          this.detail = null;

        }

      }

    },

    methods: {

      picTypeLabel,

      aiStatusTagType,

      severityLabel,

      severityTagType,

      fieldLabel,

      stepStatusLabel,

      stepStatusTagType,

      updateVisible(val) {

        this.$emit('update:visible', val);

      },

      refresh(sync) {

        if (!this.varPicId) return;

        this.loading = true;

        getVarPicAiReviewDetail({ VAR_PIC_ID: this.varPicId, sync: !!sync })

          .then((res) => {

            this.detail = res.data;

            if (this.issueCount > 0) {

              this.activeTab = 'issues';

            }

          })

          .catch((err) => {

            this.$message.error(err.message || err);

          })

          .finally(() => {

            this.loading = false;

          });

      },

      formatConfidence(c) {

        if (c == null || c === '') return '—';

        const n = Number(c);

        if (!isNaN(n) && n <= 1) {

          return Math.round(n * 100) + '%';

        }

        return c;

      },

      conclusionTagType(conclusion) {

        if (!conclusion) return 'info';

        if (conclusion.includes('不可接受')) return 'danger';

        if (conclusion.includes('需补充')) return 'warning';

        if (conclusion.includes('可接受')) return 'success';

        return 'info';

      }

    }

  };

</script>



<style scoped>

  .ai-review-body {

    min-height: 200px;

  }

  .ai-review-verdict-banner {

    margin-bottom: 12px;

  }

  .ai-verdict-title {

    font-weight: 600;

  }

  .ai-verdict-summary {

    line-height: 1.55;

    font-size: 13px;

    margin-top: 4px;

    color: #606266;

  }

  .ai-summary-panel {

    margin-top: 14px;

    padding: 12px 14px;

    background: #f8f9fb;

    border-radius: 6px;

    border: 1px solid #ebeef5;

  }

  .ai-summary-panel__row {

    display: flex;

    align-items: center;

    margin-bottom: 10px;

  }

  .ai-summary-panel__label {

    flex: 0 0 72px;

    font-size: 13px;

    font-weight: 600;

    color: #303133;

    margin: 0 0 6px;

  }

  .ai-summary-panel__block {

    margin-top: 12px;

  }

  .ai-summary-panel__section-title {

    font-size: 14px;

    font-weight: 600;

    color: #303133;

    margin: 0 0 10px;

  }

  .ai-finding-card {

    padding: 10px 12px;

    margin-bottom: 10px;

    background: #fff;

    border: 1px solid #e4e7ed;

    border-radius: 6px;

  }

  .ai-finding-card:last-child {

    margin-bottom: 0;

  }

  .ai-finding-card__head {

    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 8px;

    margin-bottom: 8px;

  }

  .ai-finding-card__title {

    font-size: 13px;

    font-weight: 600;

    color: #303133;

    line-height: 1.4;

    flex: 1;

  }

  .ai-finding-card__desc {

    margin: 0 0 8px;

    font-size: 13px;

    line-height: 1.6;

    color: #606266;

  }

  .ai-finding-card__suggest {

    margin: 0;

    font-size: 12px;

    line-height: 1.55;

    color: #909399;

    padding-top: 6px;

    border-top: 1px dashed #ebeef5;

  }

  .ai-finding-card__suggest-label {

    color: #606266;

    font-weight: 500;

  }

  .ai-suggest-card {

    padding: 8px 0;

    border-bottom: 1px solid #ebeef5;

  }

  .ai-suggest-card:last-child {

    border-bottom: none;

    padding-bottom: 0;

  }

  .ai-suggest-card__label {

    margin: 0 0 4px;

    font-size: 13px;

    font-weight: 600;

    color: #303133;

  }

  .ai-suggest-card__text {

    margin: 0;

    font-size: 13px;

    line-height: 1.6;

    color: #606266;

    white-space: pre-wrap;

  }

  .ai-review-alert {

    margin-bottom: 12px;

  }

  .ai-review-main {

    margin-top: 4px;

  }

  .panel-title {

    margin: 0 0 8px;

    font-weight: 600;

    font-size: 13px;

    color: #303133;

  }

  .ai-pic-panel__img img {

    max-width: 100%;

    max-height: 360px;

    border: 1px solid #ebeef5;

    border-radius: 4px;

    cursor: zoom-in;

  }

  .ai-pic-panel__pdf {

    padding: 20px;

    text-align: center;

    background: #f5f7fa;

    border-radius: 4px;

  }

  .risk-level-text {

    margin-left: 8px;

    font-size: 12px;

    color: #606266;

  }

  .empty-tip {

    color: #909399;

    text-align: center;

    padding: 32px 0;

  }

</style>


