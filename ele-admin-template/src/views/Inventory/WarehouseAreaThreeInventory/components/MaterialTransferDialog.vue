<template>
  <el-dialog
    :visible.sync="visibleSync"
    :title="step === 'select' ? '流水移库 · 选择流水' : '流水移库 · 预览确认'"
    width="94%"
    top="3vh"
    append-to-body
    custom-class="material-transfer-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="!submitting"
    :show-close="!submitting"
    :before-close="beforeClose"
    @open="onOpen"
    @closed="onClosed"
  >
    <el-steps :active="step === 'select' ? 0 : 1" simple class="transfer-steps">
      <el-step title="选择来源流水与目标" />
      <el-step title="核对库存影响并确认" />
    </el-steps>
    <div v-show="step === 'select'" v-loading="loading" class="transfer-select">
      <el-form
        label-position="top"
        size="mini"
        class="transfer-destination"
        @submit.native.prevent
      >
        <el-form-item label="来源库房/库区（本次锁定）">
          <el-input
            :value="`${sourceName || sourceArea}（${sourceArea}）`"
            disabled
          />
        </el-form-item>
        <el-form-item label="目标库房/库区" required>
          <el-select
            v-model="targetArea"
            filterable
            clearable
            :loading="areaLoading"
            placeholder="请选择不同目标库区"
          >
            <el-option
              v-for="item in targetOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="移库备注（必填，UTF-8 最多 500 字节）"
          required
          class="remark-field"
          :error="remarkBytes > 500 ? '移库备注超过 500 字节' : ''"
        >
          <el-input
            v-model="remark"
            type="textarea"
            :rows="2"
            placeholder="填写本次移库原因"
          />
          <span
            class="remark-count"
            :class="{ 'invalid-text': remarkBytes > 500 }"
            >{{ remarkBytes }} / 500 字节</span
          >
        </el-form-item>
      </el-form>
      <MaterialDetailFilters
        v-model="localWhere"
        :rows="candidates"
        :loading="loading"
        local
        search-label="重新查询候选"
        @search="loadCandidates"
        @clear="clearFilters"
      />
      <el-alert
        v-if="candidateError"
        type="error"
        :closable="false"
        show-icon
        :title="candidateError"
        class="candidate-alert"
      />
      <div class="candidate-info">
        <span
          >候选 {{ candidates.length }} 条，当前匹配
          {{ matchingRows.length }} 条，可选
          {{ selectableMatchingCount }} 条</span
        >
        <strong>已选 {{ selectedRows.length }} 条</strong>
        <span v-if="selectedOutsideCount" class="selection-outside"
          >其中 {{ selectedOutsideCount }} 条在当前筛选之外，仍会参与移库</span
        >
        <el-checkbox v-model="onlySelected">仅看已选</el-checkbox>
      </div>
      <div class="selection-tools">
        <el-button size="mini" @click="applySelection('add', matchingRows)"
          >勾选匹配追加</el-button
        >
        <el-button size="mini" @click="applySelection('remove', matchingRows)"
          >取消匹配</el-button
        >
        <el-button size="mini" @click="applySelection('add', pageRows)"
          >本页全选</el-button
        >
        <el-button size="mini" @click="applySelection('invert', pageRows)"
          >本页反选</el-button
        >
        <el-button size="mini" @click="applySelection('invert', matchingRows)"
          >全部匹配反选</el-button
        >
        <el-button
          size="mini"
          :disabled="!selectedRows.length"
          @click="clearSelection"
          >清空已选</el-button
        >
      </div>
      <vxe-table
        ref="candidateTable"
        :data="pageRows"
        border
        stripe
        size="mini"
        height="330"
        show-overflow
        :row-config="{ keyField: 'ID', isHover: true }"
        :column-config="{ resizable: true }"
        :checkbox-config="{ checkMethod: checkSelectable, highlight: true }"
        @checkbox-change="onCheckboxChange"
        @checkbox-all="onCheckboxAll"
      >
        <vxe-column type="checkbox" width="46" fixed="left" />
        <vxe-column field="ID" title="流水ID" width="185" />
        <vxe-column field="VARIETIE_NAME" title="品种名称" min-width="180" />
        <vxe-column field="CHARGE_CODE" title="计费编码" width="120" />
        <vxe-column field="BUSINESS_TYPE_NAME" title="业务类别" width="100" />
        <vxe-column field="TYPE" title="流水类型" width="85" />
        <vxe-column field="BATCH_NO" title="批号" width="120"
          ><template v-slot="{ row }">{{
            row.BATCH_NO || '空批号'
          }}</template></vxe-column
        >
        <vxe-column field="QTY" title="数量" width="90" align="right" />
        <vxe-column
          field="TRANSFERABLE_QTY"
          title="剩余可移数量"
          width="115"
          align="right"
        />
        <vxe-column title="移库数量" width="150" align="right">
          <template v-slot="{ row }">
            <el-input-number
              v-model="row.TRANSFER_QTY"
              size="mini"
              :min="0"
              :max="Number(row.TRANSFERABLE_QTY)"
              :controls="false"
              :disabled="!checkSelectable({ row })"
              :aria-label="`流水 ${row.ID} 的移库数量`"
            />
          </template>
        </vxe-column>
        <vxe-column
          field="SPECIFICATION_OR_TYPE"
          title="规格型号"
          width="160"
        />
        <vxe-column
          field="MANUFACTURING_ENT_NAME"
          title="生产企业"
          width="190"
        />
        <vxe-column field="DEPT_TWO_NAME" title="SPD科室" width="150" />
        <vxe-column field="DEPT_CODE" title="HIS科室编码" width="120" />
        <vxe-column field="BARCODE_NUMBER" title="定数码" width="140" />
        <vxe-column field="PATIENT_NUMBER" title="病患号" width="120" />
        <vxe-column field="HOSPITALIZATION_NUMBER" title="住院号" width="120" />
        <vxe-column field="MEDICAL_ORDER_ID" title="医嘱ID" width="160" />
        <vxe-column field="JF_ID" title="计费ID" width="160" />
        <vxe-column field="ORIGING_CODE" title="来源单号" width="160" />
        <vxe-column
          field="OPEARTION_CHARGING_TIME"
          title="业务时间"
          width="170"
        />
        <vxe-column field="CREATE_TIME" title="创建时间" width="170" />
        <vxe-column field="PRODUCTION_DATE" title="生产日期" width="120" />
        <vxe-column field="EXPIRY_DATE" title="有效期" width="120" />
        <vxe-column
          field="TRANSFER_REMARK"
          title="移库备注 / 批次"
          width="200"
        />
        <vxe-column title="移库状态 / 不可选原因" width="190" fixed="right"
          ><template v-slot="{ row }"
            ><span :class="{ 'invalid-text': !checkSelectable({ row }) }">{{
              row.TRANSFER_BLOCK_REASON ||
              (Number(row.QTY) <= 0
                ? '仅正数流水可移库'
                : transferStateName(row.TRANSFER_STATE))
            }}</span></template
          ></vxe-column
        >
      </vxe-table>
      <vxe-pager
        size="mini"
        :current-page="page"
        :page-size="pageSize"
        :total="matchingRows.length"
        :page-sizes="[20, 50, 100, 200]"
        :layouts="['PrevPage', 'Number', 'NextPage', 'Sizes', 'Total']"
        @page-change="onPageChange"
      />
    </div>
    <TransferPreview v-if="step === 'preview' && preview" :preview="preview" />
    <span slot="footer" class="transfer-footer">
      <span v-if="submitError" class="invalid-text submit-error" role="alert">{{
        submitError
      }}</span>
      <el-button
        size="small"
        :disabled="submitting"
        @click="visibleSync = false"
        >取消</el-button
      >
      <el-button
        v-if="step === 'preview'"
        size="small"
        :disabled="submitting"
        @click="backToSelection"
        >返回修改选择</el-button
      >
      <el-button
        v-if="step === 'select'"
        size="small"
        type="primary"
        :loading="previewing"
        :disabled="loading || !selectedRows.length || remarkBytes > 500"
        @click="handlePreview"
        >预览移库影响</el-button
      >
      <el-button
        v-else
        size="small"
        type="primary"
        :loading="submitting"
        :disabled="!preview || !preview.CAN_SUBMIT"
        @click="handleSubmit"
        >{{ submitError ? '重试确认移库' : '确认移库' }}</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
  import { Message } from 'element-ui';
  import MaterialDetailFilters from './MaterialDetailFilters.vue';
  import TransferPreview from './TransferPreview.vue';
  import {
    getTransferCandidates,
    queryAccessibleWarehouseAreaOptions,
    previewTransfer,
    submitTransfer
  } from '@/api/Inventory/WarehouseAreaThreeInventory';
  import {
    rowId,
    createDetailWhere,
    canTransferRow,
    changeSelection,
    filterTransferRows,
    validateTransfer,
    utf8Length
  } from '../transferSelection';

  export default {
    name: 'MaterialTransferDialog',
    components: { MaterialDetailFilters, TransferPreview },
    props: {
      visible: Boolean,
      filters: { type: Object, default: () => ({}) },
      sourceArea: { type: String, default: '' },
      sourceName: { type: String, default: '' },
      initialRows: { type: Array, default: () => [] }
    },
    data() {
      return {
        step: 'select',
        localWhere: {},
        candidates: [],
        selectedRows: [],
        targetArea: '',
        remark: '',
        areaOptions: [],
        areaLoading: false,
        loading: false,
        previewing: false,
        submitting: false,
        candidateError: '',
        submitError: '',
        preview: null,
        onlySelected: false,
        page: 1,
        pageSize: 50,
        queryVersion: 0
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(value) {
          this.$emit('update:visible', value);
        }
      },
      targetOptions() {
        return this.areaOptions
          .map((item) => {
            const name =
              item.AREA_NAME ||
              item.LABEL ||
              item.TEXT ||
              item.AREA_CODE ||
              item.VALUE;
            return {
              value: String(item.AREA_CODE || item.VALUE || ''),
              label: item.PARENT_NAME ? `${item.PARENT_NAME} / ${name}` : name
            };
          })
          .filter((item) => item.value && item.value !== this.sourceArea);
      },
      remarkBytes() {
        return utf8Length(this.remark.trim());
      },
      matchingRows() {
        return filterTransferRows(
          this.onlySelected ? this.selectedRows : this.candidates,
          this.localWhere
        );
      },
      pageRows() {
        return this.matchingRows.slice(
          (this.page - 1) * this.pageSize,
          this.page * this.pageSize
        );
      },
      selectableMatchingCount() {
        return this.matchingRows.filter((row) =>
          canTransferRow(row, this.sourceArea)
        ).length;
      },
      selectedOutsideCount() {
        const matching = new Set(this.matchingRows.map(rowId));
        return this.selectedRows.filter((row) => !matching.has(rowId(row)))
          .length;
      }
    },
    watch: {
      localWhere: {
        deep: true,
        handler() {
          this.page = 1;
        }
      },
      onlySelected() {
        this.page = 1;
      },
      matchingRows(rows) {
        this.page = Math.min(
          this.page,
          Math.max(1, Math.ceil(rows.length / this.pageSize))
        );
      },
      pageRows() {
        this.syncCheckboxes();
      },
      selectedRows() {
        this.syncCheckboxes();
      }
    },
    methods: {
      async onOpen() {
        this.step = 'select';
        this.localWhere = createDetailWhere({
          ...this.filters,
          AREA_CODE: this.sourceArea,
          WAREHOUSE_AREA_ID: ''
        });
        this.selectedRows = changeSelection(
          [],
          this.initialRows.map((row) => ({
            ...row,
            TRANSFER_QTY: Number(row.TRANSFERABLE_QTY)
          })),
          'add',
          this.sourceArea
        );
        this.targetArea = '';
        this.remark = '';
        this.preview = null;
        this.submitError = '';
        this.candidateError = '';
        this.onlySelected = false;
        this.page = 1;
        await Promise.all([this.loadCandidates(), this.loadAreas()]);
      },
      onClosed() {
        this.queryVersion++;
        this.candidates = [];
        this.selectedRows = [];
        this.preview = null;
        this.loading = false;
        this.previewing = false;
      },
      beforeClose(done) {
        if (!this.submitting) done();
      },
      async loadAreas() {
        this.areaLoading = true;
        try {
          const res = await queryAccessibleWarehouseAreaOptions();
          this.areaOptions = res.result || [];
        } catch (e) {
          Message.error(e.message || '查询目标库区失败');
        } finally {
          this.areaLoading = false;
        }
      },
      async loadCandidates() {
        const version = ++this.queryVersion;
        this.loading = true;
        this.candidateError = '';
        try {
          const res = await getTransferCandidates({
            ...this.localWhere,
            AREA_CODE: this.sourceArea,
            WAREHOUSE_AREA_ID: ''
          });
          if (version !== this.queryVersion) return;
          const rows = res.result || [];
          if (rows.length > 5000 || Number(res.total || 0) > 5000)
            throw new Error('候选超过 5000 条，请缩小筛选条件后重新查询');
          const previous = new Map(
            this.selectedRows.map((row) => [rowId(row), row])
          );
          this.candidates = rows.map((row) => {
            const selected = previous.get(rowId(row));
            return {
              ...row,
              TRANSFER_QTY: selected
                ? selected.TRANSFER_QTY
                : Number(row.TRANSFERABLE_QTY)
            };
          });
          // 刷新集合内的选中记录状态；集合外选择继续保留，最终由预览复核。
          const latest = new Map(
            this.candidates.map((row) => [rowId(row), row])
          );
          this.selectedRows = this.selectedRows.map(
            (row) => latest.get(rowId(row)) || row
          );
          this.page = 1;
        } catch (e) {
          if (version !== this.queryVersion) return;
          this.candidates = [];
          this.candidateError = e.message || '查询移库候选失败';
        } finally {
          if (version === this.queryVersion) this.loading = false;
        }
      },
      clearFilters() {
        this.localWhere = createDetailWhere({
          AREA_CODE: this.sourceArea,
          EXCLUDE_UP_SHELF_VARIETY: '0'
        });
        this.page = 1;
      },
      checkSelectable({ row }) {
        return canTransferRow(row, this.sourceArea);
      },
      transferStateName(state) {
        return (
          {
            AVAILABLE: '可移库',
            MOVED: '已移库',
            OFFSET: '原库冲抵',
            PRE_DEDUCT: '预扣',
            ZERO: '零流水',
            DELETED: '已删除'
          }[state] || '不可移库'
        );
      },
      applySelection(action, rows) {
        this.selectedRows = changeSelection(
          this.selectedRows,
          rows,
          action,
          this.sourceArea
        );
      },
      clearSelection() {
        this.selectedRows = [];
      },
      onCheckboxChange({ row, checked }) {
        this.applySelection(checked ? 'add' : 'remove', [row]);
      },
      onCheckboxAll({ checked }) {
        this.applySelection(checked ? 'add' : 'remove', this.pageRows);
      },
      syncCheckboxes() {
        this.$nextTick(() => {
          const table = this.$refs.candidateTable;
          if (!table) return;
          const ids = new Set(this.selectedRows.map(rowId));
          table.clearCheckboxRow();
          table.setCheckboxRow(
            this.pageRows.filter((row) => ids.has(rowId(row))),
            true
          );
        });
      },
      onPageChange({ currentPage, pageSize }) {
        this.page = currentPage;
        this.pageSize = pageSize;
      },
      async handlePreview() {
        if (this.previewing || this.loading) return;
        const error = validateTransfer(
          this.selectedRows,
          this.sourceArea,
          this.targetArea,
          this.remark
        );
        if (error) {
          Message.warning(error);
          return;
        }
        this.previewing = true;
        const version = this.queryVersion;
        try {
          const res = await previewTransfer({
            IDS: this.selectedRows.map(rowId).join(','),
            QUANTITIES: JSON.stringify(
              Object.fromEntries(
                this.selectedRows.map((row) => [rowId(row), row.TRANSFER_QTY])
              )
            ),
            SOURCE_AREA_CODE: this.sourceArea,
            TARGET_AREA_CODE: this.targetArea,
            TRANSFER_REMARK: this.remark.trim()
          });
          if (version !== this.queryVersion) return;
          if (
            !res.result ||
            (res.result.CAN_SUBMIT &&
              (!res.result.PREVIEW_TOKEN || !res.result.REQUEST_ID))
          )
            throw new Error('预览结果缺少确认标识，请重新预览');
          this.preview = res.result;
          this.submitError = '';
          this.step = 'preview';
        } catch (e) {
          Message.error(e.message || '移库预览失败');
        } finally {
          this.previewing = false;
        }
      },
      backToSelection() {
        this.step = 'select';
        this.preview = null;
        this.submitError = '';
        this.syncCheckboxes();
      },
      async handleSubmit() {
        if (this.submitting || !this.preview || !this.preview.CAN_SUBMIT)
          return;
        this.submitting = true;
        this.submitError = '';
        try {
          const res = await submitTransfer({
            PREVIEW_TOKEN: this.preview.PREVIEW_TOKEN,
            REQUEST_ID: this.preview.REQUEST_ID
          });
          Message.success(res.msg || '移库成功');
          this.$emit('success', res.result);
          this.visibleSync = false;
        } catch (e) {
          // 保留服务器预览标识，超时后可以使用同一 REQUEST_ID 安全重试。
          this.submitError = e.message || '提交失败，可重试同一批次';
          Message.error(this.submitError);
        } finally {
          this.submitting = false;
        }
      }
    }
  };
</script>

<style scoped>
  .transfer-steps {
    margin-bottom: 14px;
  }
  .transfer-destination {
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    gap: 16px;
  }
  .transfer-destination :deep(.el-select) {
    width: 100%;
  }
  .transfer-destination :deep(.el-form-item__label) {
    padding-bottom: 4px;
    line-height: 20px;
  }
  .transfer-destination :deep(.el-form-item) {
    margin-bottom: 10px;
  }
  .remark-count {
    font-size: 12px;
    color: #606266;
  }
  .candidate-info,
  .selection-tools {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: center;
    margin: 10px 0;
    font-size: 12px;
  }
  .selection-outside {
    color: #8a5715;
  }
  .selection-tools .el-button + .el-button {
    margin-left: 0;
  }
  .candidate-alert {
    margin-bottom: 10px;
  }
  .transfer-select :deep(.el-input-number) {
    width: 100%;
  }
  .invalid-text {
    color: #c0392b;
  }
  .transfer-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
  }
  .transfer-footer .el-button + .el-button {
    margin-left: 0;
  }
  .submit-error {
    margin-right: auto;
    font-size: 12px;
    text-align: left;
    overflow-wrap: anywhere;
  }
  @media (max-width: 1000px) {
    .transfer-destination {
      grid-template-columns: 1fr 1fr;
    }
    .remark-field {
      grid-column: 1 / -1;
    }
  }
</style>

<style>
  .material-transfer-dialog {
    max-height: 94vh;
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }
  .material-transfer-dialog .el-dialog__body {
    min-height: 0;
    overflow: auto;
    padding: 10px 20px;
  }
  .material-transfer-dialog .el-dialog__header,
  .material-transfer-dialog .el-dialog__footer {
    flex: none;
  }
</style>
