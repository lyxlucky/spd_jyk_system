<template>
  <div class="transfer-preview">
    <el-alert
      type="info"
      :closable="false"
      show-icon
      :title="`${preview.SOURCE_AREA_NAME || preview.SOURCE_AREA_CODE} → ${
        preview.TARGET_AREA_NAME || preview.TARGET_AREA_CODE
      }，确认后按所填数量执行移库。`"
    />
    <div class="preview-summary">
      <span
        >原流水 <b>{{ preview.ROW_COUNT || 0 }}</b> 条</span
      >
      <span
        >品种 <b>{{ preview.MATERIAL_COUNT || 0 }}</b> 个</span
      >
      <span
        >批次 <b>{{ preview.BATCH_COUNT || 0 }}</b> 个</span
      >
      <span
        >待写流水 <b>{{ preview.INSERT_COUNT || 0 }}</b> 条</span
      >
    </div>
    <div class="preview-remark"
      >移库备注：{{ preview.TRANSFER_REMARK }}
      <span class="request-id">批次：{{ preview.REQUEST_ID }}</span></div
    >
    <div
      v-if="preview.WARNINGS && preview.WARNINGS.length"
      class="preview-warnings"
      role="alert"
    >
      <strong>{{
        preview.CAN_SUBMIT ? '请核对以下库存风险' : '当前预览不可提交'
      }}</strong>
      <ul
        ><li v-for="(warning, index) in preview.WARNINGS" :key="index">{{
          warning
        }}</li></ul
      >
    </div>
    <el-alert
      v-else-if="!preview.CAN_SUBMIT"
      type="error"
      :closable="false"
      title="当前预览不可提交，请返回并调整选择。"
    />
    <el-tabs v-model="activeTab" class="preview-tabs">
      <el-tab-pane label="品种影响" name="materials" />
      <el-tab-pane label="批次影响" name="batches" />
      <el-tab-pane label="待写流水" name="rows" />
    </el-tabs>
    <div v-if="activeTab !== 'rows'" class="impact-filter">
      <el-radio-group v-model="impactFilter" size="mini">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="negative">移库后负库存</el-radio-button>
        <el-radio-button label="worsened">负库存恶化</el-radio-button>
      </el-radio-group>
      <span>{{ impacts.length }} / {{ allImpacts.length }} 条</span>
    </div>
    <el-table
      v-if="activeTab !== 'rows'"
      :key="activeTab"
      :data="impacts"
      border
      stripe
      size="mini"
      height="360"
      class="preview-table"
    >
      <el-table-column prop="CHARGE_CODE" label="计费编码" width="120" fixed />
      <el-table-column
        prop="VARIETIE_NAME"
        label="品种名称"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="SPECIFICATION_OR_TYPE"
        label="规格型号"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="activeTab === 'batches'"
        prop="BATCH_NO"
        label="批号"
        width="120"
        ><template slot-scope="scope">{{
          scope.row.BATCH_NO || '空批号'
        }}</template></el-table-column
      >
      <el-table-column
        v-if="activeTab === 'batches'"
        prop="PRODUCTION_DATE"
        label="生产日期"
        width="110"
      />
      <el-table-column
        v-if="activeTab === 'batches'"
        prop="EXPIRY_DATE"
        label="有效期"
        width="110"
      />
      <el-table-column prop="UNIT" label="单位" width="65" />
      <el-table-column label="来源库区" align="center">
        <el-table-column
          prop="SOURCE_BEFORE"
          label="移库前"
          width="105"
          align="right"
        />
        <el-table-column
          prop="SOURCE_CHANGE"
          label="本次变动"
          width="105"
          align="right"
        />
        <el-table-column
          prop="SOURCE_AFTER"
          label="移库后"
          width="105"
          align="right"
          ><template slot-scope="scope"
            ><span
              :class="{ 'negative-stock': Number(scope.row.SOURCE_AFTER) < 0 }"
              >{{ scope.row.SOURCE_AFTER }}</span
            ></template
          ></el-table-column
        >
      </el-table-column>
      <el-table-column label="目标库区" align="center">
        <el-table-column
          prop="TARGET_BEFORE"
          label="移库前"
          width="105"
          align="right"
        />
        <el-table-column
          prop="TARGET_CHANGE"
          label="本次变动"
          width="105"
          align="right"
        />
        <el-table-column
          prop="TARGET_AFTER"
          label="移库后"
          width="105"
          align="right"
          ><template slot-scope="scope"
            ><span
              :class="{ 'negative-stock': Number(scope.row.TARGET_AFTER) < 0 }"
              >{{ scope.row.TARGET_AFTER }}</span
            ></template
          ></el-table-column
        >
      </el-table-column>
    </el-table>
    <el-table
      v-else
      :data="preview.ROWS || []"
      border
      stripe
      size="mini"
      height="400"
      class="preview-table"
    >
      <el-table-column prop="DIRECTION" label="写入方向" width="110" fixed />
      <el-table-column prop="AREA_NAME" label="库房/库区" width="150" />
      <el-table-column prop="SOURCE_ID" label="来源流水ID" width="185" />
      <el-table-column prop="CHARGE_CODE" label="计费编码" width="120" />
      <el-table-column
        prop="VARIETIE_NAME"
        label="品种名称"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="SPECIFICATION_OR_TYPE"
        label="规格型号"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column prop="BUSINESS_TYPE_NAME" label="业务类别" width="100" />
      <el-table-column prop="BATCH_NO" label="批号" width="120"
        ><template slot-scope="scope">{{
          scope.row.BATCH_NO || '空批号'
        }}</template></el-table-column
      >
      <el-table-column prop="PRODUCTION_DATE" label="生产日期" width="110" />
      <el-table-column prop="EXPIRY_DATE" label="有效期" width="110" />
      <el-table-column
        prop="SOURCE_QTY"
        label="原流水数量"
        width="110"
        align="right"
      />
      <el-table-column
        prop="QTY"
        label="本次写入数量"
        width="120"
        align="right"
        fixed="right"
      />
    </el-table>
  </div>
</template>

<script>
  import { filterImpacts } from '../transferSelection';

  export default {
    name: 'TransferPreview',
    props: { preview: { type: Object, required: true } },
    data() {
      return { activeTab: 'materials', impactFilter: 'all' };
    },
    computed: {
      allImpacts() {
        return this.activeTab === 'batches'
          ? this.preview.BATCHES || []
          : this.preview.MATERIALS || [];
      },
      impacts() {
        return filterImpacts(this.allImpacts, this.impactFilter);
      }
    }
  };
</script>

<style scoped>
  .preview-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin: 14px 0;
  }
  .preview-summary b {
    color: #303133;
    font-size: 18px;
  }
  .preview-remark {
    margin-bottom: 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .request-id {
    color: #606266;
    margin-left: 20px;
    font-size: 12px;
  }
  .preview-warnings {
    background: #fdf6ec;
    color: #8a5715;
    padding: 12px 16px;
    margin-bottom: 12px;
    border: 1px solid #f5dab1;
    border-radius: 4px;
  }
  .preview-warnings ul {
    padding-left: 18px;
    margin: 6px 0 0;
  }
  .impact-filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }
  .impact-filter span {
    color: #606266;
    font-size: 12px;
  }
  .negative-stock {
    color: #c0392b;
    font-weight: 600;
  }
  .preview-table {
    width: 100%;
  }
</style>
