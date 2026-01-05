<template>
  <div>
    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1400"
      :filename="pdfFileName"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      ref="html2Pdf"
      @hasDownloaded="onDownloaded"
    >
      <section slot="pdf-content" class="pdf-content">
        <div class="print-container">
          <h2 class="print-title">临采申请单</h2>

          <!-- 主单信息 -->
          <table class="info-table">
            <tbody>
              <tr>
                <td class="info-label">申请单号</td>
                <td class="info-value">{{ mainData.ID }}</td>
                <td class="info-label">申请科室</td>
                <td class="info-value">{{ mainData.DEPT_TWO_NAME }}</td>
              </tr>
              <tr>
                <td class="info-label">申请人</td>
                <td class="info-value">{{ mainData.NICKNAME }}</td>
                <td class="info-label">申请人工号</td>
                <td class="info-value">{{ mainData.USER_ID }}</td>
              </tr>
              <tr>
                <td class="info-label">联系方式</td>
                <td class="info-value">{{ mainData.PHONE }}</td>
                <td class="info-label">患者姓名</td>
                <td class="info-value">{{ mainData.PATIENT_NAME }}</td>
              </tr>
              <tr>
                <td class="info-label">申请日期</td>
                <td class="info-value" colspan="3">{{ formatDateTime(mainData.CREATE_TIME) }}</td>
              </tr>
              <tr>
                <td class="info-label">产品适用范围及应用手术名称</td>
                <td class="info-value" colspan="3">{{ mainData.SURGICAL_PRO_NAME }}</td>
              </tr>
              <tr>
                <td class="info-label">手写备注栏</td>
                <td class="info-value remark-cell" colspan="3">{{ mainData.REMARK || '' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- 明细表格 -->
          <div class="dtl-section">
            <div class="section-header">明细列表</div>
            <table class="dtl-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>品种编码</th>
                  <th>品种名称</th>
                  <th>品牌</th>
                  <th>生产企业</th>
                  <th>规格型号</th>
                  <th>价格</th>
                  <th>计划临采次数</th>
                  <th>单次临采数量</th>
                  <th>已临采次数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dtlList" :key="item.ID">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.VARIETIE_CODE_NEW }}</td>
                  <td>{{ item.VARIETIE_NAME }}</td>
                  <td>{{ item.BRAND }}</td>
                  <td>{{ item.MANUFACTURING_ENT_NAME }}</td>
                  <td>{{ item.SPECIFICATION_OR_TYPE }}</td>
                  <td>{{ item.PRICE }}</td>
                  <td>{{ item.PLAN_LC_TIMES }}</td>
                  <td>{{ item.SINGLE_LC_NUMS }}</td>
                  <td>{{ item.LC_TIMES }}</td>
                </tr>
                <tr v-if="dtlList.length === 0">
                  <td colspan="10" class="empty-row">暂无明细数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf';

export default {
  name: 'PrintPkLc',
  components: {
    VueHtml2pdf
  },
  props: {
    mainData: {
      type: Object,
      default: () => ({})
    },
    dtlList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    pdfFileName() {
      return `临采申请单_${this.mainData.ID || 'unknown'}`;
    }
  },
  methods: {
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      return dateTime.replace('T', ' ');
    },
    downloadPdf() {
      return new Promise((resolve, reject) => {
        try {
          this._resolveDownload = resolve;
          this._rejectDownload = reject;
          this.$refs.html2Pdf.generatePdf();
        } catch (error) {
          reject(error);
        }
      });
    },
    onDownloaded() {
      if (this._resolveDownload) {
        this._resolveDownload(true);
        this._resolveDownload = null;
        this._rejectDownload = null;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.pdf-content {
  padding: 40px 50px;
  background: #fff;
  font-family: 'SimSun', 'FangSong', serif;
  font-size: 14px;
  color: #000;
}

.print-container {
  padding: 0;
}

.print-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 20px 0;
  letter-spacing: 8px;
}

/* 主单信息表格 - Word风格 */
.info-table {
  width: 100%;
  border: 1px solid #000;
  border-collapse: collapse;
  margin-bottom: 20px;

  td {
    border: 1px solid #000;
    padding: 8px 10px;
    vertical-align: middle;
    line-height: 1.8;
  }

  .info-label {
    width: 180px;
    font-weight: normal;
    text-align: center;
  }

  .info-value {
    text-align: center;
  }

  .remark-cell {
    min-height: 60px;
    height: 60px;
  }
}

/* 明细区域 */
.dtl-section {
  margin-top: 10px;
}

.section-header {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 明细表格 - Word风格 */
.dtl-table {
  width: 100%;
  border: 1px solid #000;
  border-collapse: collapse;

  th, td {
    border: 1px solid #000;
    padding: 6px 5px;
    text-align: center;
    font-size: 11px;
    line-height: 1.6;
  }

  th {
    font-weight: bold;
  }

  .empty-row {
    height: 40px;
  }
}
</style>
