<template>
  <div class="spd-panel spd-panel--search">
    <div class="spd-panel__head">查询条件</div>
    <div class="spd-panel__body">
      <el-form
        size="mini"
        :inline="true"
        @keyup.enter.native="search"
        @submit.native.prevent
      >
        <el-form-item label="定数码">
          <el-input
            id="idDefNoPkgCode"
            v-model="where.defNoPkgCode"
            clearable
            placeholder="定数码"
            style="width: 140px"
            @change="addScanDef"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="where.varietie"
            clearable
            placeholder="编码/名称"
            style="width: 130px"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="where.specType"
            clearable
            placeholder="规格型号"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item label="二级科室">
          <el-input
            v-model="where.deptTwoName"
            clearable
            placeholder="科室名称"
            style="width: 120px"
          />
        </el-form-item>
        <br />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm title="确定删除？" @confirm="removeBatch()">
            <el-button slot="reference" type="danger" icon="el-icon-delete">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-popconfirm title="确定消耗？" @confirm="consumption()">
            <el-button slot="reference" type="warning" icon="el-icon-s-goods">消耗</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-upload
            :on-success="uploadSuccess"
            :on-error="upError"
            :data="Updata"
            :show-file-list="false"
            :action="uploadUrl"
            ref="Defupload"
            :limit="1"
          >
            <el-button icon="el-icon-upload2">导入</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-goods" @click="KSInventoryQueryShow = true">从库存中挑选</el-button>
        </el-form-item>
        <el-form-item v-if="['stzl', 'stzx'].includes(HOME_HP) || ENV == 'development'">
          <el-button type="success" icon="el-icon-link" @click="bindMachine">绑定设备</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" icon="el-icon-view" @click="openStockSummaryDialog">库存汇总</el-button>
        </el-form-item>
      </el-form>
    </div>

    <KSInventoryQuery :visible.sync="KSInventoryQueryShow" />

    <el-dialog
      title="科室库存汇总"
      :visible.sync="stockSummaryDialogVisible"
      width="90%"
      :close-on-click-modal="false"
      append-to-body
      top="5vh"
      custom-class="scan-def-his-summary-dialog"
    >
      <ele-pro-table
        ref="stockSummaryTable"
        class="data-table"
        size="mini"
        border
        stripe
        :toolbar="false"
        :header-overflow-hidden="false"
        :columns="stockSummaryColumns"
        :datasource="stockSummaryDatasource"
        :selection.sync="stockSummarySelection"
        height="500px"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="20"
        cache-key="DeptStockSummaryTable"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="batchConsumeFromSummary">批量消耗</el-button>
        <el-button size="mini" @click="stockSummaryDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { API_BASE_URL, BACK_BASE_URL, HOME_HP } from '@/config/setting';
import { GetLrJykInstrument } from '@/api/KSInventory/LrJykInstrument';
import {
  insertScanDef,
  delScanDef,
  spdScanConsume,
  getDeptStockSummary,
  batchConsumeByVarietieCode
} from '@/api/KSInventory/ScanDefHis';
import KSInventoryQuery from '@/views/KSInventory/ScanDefHis/KSInventoryQuery/index.vue';

const defaultWhere = () => ({
  deptTwoName: '',
  varietie: '',
  specType: '',
  defNoPkgCode: '',
  contractCode: '',
  supplierName: '',
  bindMachine: ''
});

export default {
  props: {
    visible: Boolean,
    data: Object,
    IntroduceUserDefinedTempSearch: Object,
    selection: Object
  },
  components: {
    KSInventoryQuery
  },
  data() {
    return {
      where: defaultWhere(),
      msgTip: '',
      uploadUrl: `${BACK_BASE_URL}${API_BASE_URL}/DeptConsume/BatchInsertScanDef`,
      Updata: {
        Token: sessionStorage['Token']
      },
      KSInventoryQueryShow: false,
      stockSummaryDialogVisible: false,
      stockSummarySelection: [],
      stockSummaryColumns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          label: '品种编码',
          prop: 'VARIETIE_CODE_NEW',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '品种名称',
          prop: 'VARIETIE_NAME',
          minWidth: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '规格型号',
          prop: 'SPECIFICATION_OR_TYPE',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '供应商',
          prop: 'SUPPLIER_NAME',
          minWidth: 150,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '批次',
          prop: 'BATCH',
          width: 120,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          label: '生产日期',
          prop: 'BATCH_PRODUCTION_DATE',
          width: 120,
          align: 'center',
          formatter: (row) => {
            return row.BATCH_PRODUCTION_DATE
              ? new Date(row.BATCH_PRODUCTION_DATE).toLocaleDateString()
              : '';
          }
        },
        {
          label: '有效期',
          prop: 'BATCH_VALIDITY_PERIOD',
          width: 120,
          align: 'center',
          formatter: (row) => {
            return row.BATCH_VALIDITY_PERIOD
              ? new Date(row.BATCH_VALIDITY_PERIOD).toLocaleDateString()
              : '';
          }
        },
        {
          label: '数量',
          prop: 'QTY',
          width: 100,
          align: 'center',
          formatter: (row) => {
            return row.QTY ? Number(row.QTY) : '0';
          }
        }
      ]
    };
  },
  computed: {
    HOME_HP() {
      return HOME_HP;
    },
    ENV() {
      return process.env.NODE_ENV;
    }
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
    reset() {
      this.where = defaultWhere();
      this.search();
    },
    exportData() {
      this.$emit('exportData', this.where);
    },
    bindMachine() {
      this.$prompt('扫码绑定设备', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false
      })
        .then(({ value }) => {
          const loading = this.$messageLoading('处理中...');
          let mechineCodeWithoutSlash;
          if (!value.includes('/')) {
            mechineCodeWithoutSlash = value;
          }
          const [machineCode] = value.split('/');
          const submitMachineCode = mechineCodeWithoutSlash || machineCode;
          GetLrJykInstrument({
            where: { INSTRUMENT_NAME: submitMachineCode },
            page: 1,
            limit: 9999
          }).then((res) => {
            if (res?.code != 200) return this.$message.error(res.msg);
            const returnValue = res.result[0];
            this.where.bindMachine = `${returnValue.INSTRUMENT_CODE}/${returnValue.INSTRUMENT_NAME}`;
            this.$bus.$emit(
              'bindMachine',
              `${returnValue.INSTRUMENT_CODE}/${returnValue.INSTRUMENT_NAME}`
            );
            this.$message.success('绑定成功');
          });
          loading.close();
        })
        .catch(() => {
          this.$message.info('取消输入');
        });
    },
    addScanDef() {
      const loading = this.$messageLoading('添加中...');
      insertScanDef(this.where)
        .then((res) => {
          this.where.defNoPkgCode = '';
          document.getElementById('idDefNoPkgCode').focus();
          loading.close();
          this.msgTip = 'Tip:' + res.msgTip;
          this.$emit('getMsgTip', this.msgTip);
          this.search();
          this.$message.success(res.msg);
        })
        .catch((err) => {
          this.where.defNoPkgCode = '';
          document.getElementById('idDefNoPkgCode').focus();
          loading.close();
          this.$message.error(err);
        });
    },
    removeBatch() {
      const loading = this.$messageLoading('删除中...');
      const idJosn = [];
      const Nickname = this.$store.state.user.info.Nickname;
      this.selection.forEach((element) => {
        idJosn.push(element.Dept_Two_Up_Shelf_Id);
      });
      const data = {
        idJosn: idJosn,
        staff: Nickname
      };
      delScanDef(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    consumption() {
      const loading = this.$messageLoading('操作中...');
      const idJosn = [];
      this.selection.forEach((element) => {
        idJosn.push(element.Dept_Two_Up_Shelf_Id);
      });
      const data = {
        idJosn: idJosn,
        staff: this.$store.state.user.info.Nickname,
        deptTwoCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        user: this.$store.state.user.info.UserName,
        password: this.$store.state.user.info.Password,
        AesKey: null
      };
      spdScanConsume(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    uploadSuccess(response) {
      this.$refs.Defupload.clearFiles();
      if (response.code == 200) {
        this.$message.success(response.msg);
        this.search();
      } else {
        this.$message.error(response.msg);
      }
    },
    upError(response) {
      this.$refs.Defupload.clearFiles();
      this.$message.error(response.msg);
    },
    openStockSummaryDialog() {
      this.stockSummaryDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.stockSummaryTable) {
          this.$refs.stockSummaryTable.reload();
        }
      });
    },
    stockSummaryDatasource({ page, limit }) {
      const deptTwoCode = this.$store.state.user.info.DeptNow?.Dept_Two_Code;
      if (!deptTwoCode) {
        this.$message.warning('未获取到科室代码');
        return Promise.resolve({ count: 0, list: [] });
      }
      return getDeptStockSummary({ deptTwoCode, page, limit })
        .then((res) => {
          if (res.code == 200 && res.result) {
            let dataList = [];
            try {
              dataList = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
            } catch (e) {
              dataList = [];
            }
            return { count: res.total || 0, list: dataList };
          }
          this.$message.error(res.msg || '获取数据失败');
          return { count: 0, list: [] };
        })
        .catch((err) => {
          this.$message.error(err.message || '获取库存汇总数据失败');
          return { count: 0, list: [] };
        });
    },
    batchConsumeFromSummary() {
      if (!this.stockSummarySelection || this.stockSummarySelection.length === 0) {
        this.$message.warning('请选择要消耗的品种');
        return;
      }
      const varietieCodes = [];
      this.stockSummarySelection.forEach((item) => {
        if (item.VARIETIE_CODE) {
          varietieCodes.push(item.VARIETIE_CODE);
        }
      });
      if (varietieCodes.length === 0) {
        this.$message.warning('所选数据中没有有效的品种编码');
        return;
      }
      const uniqueVarietieCodes = [...new Set(varietieCodes)];
      const loading = this.$messageLoading('批量消耗中...');
      const deptTwoCode = this.$store.state.user.info.DeptNow?.Dept_Two_Code;
      if (!deptTwoCode) {
        loading.close();
        this.$message.warning('未获取到科室代码');
        return;
      }
      batchConsumeByVarietieCode({
        deptTwoCode,
        varietieCodeJson: JSON.stringify(uniqueVarietieCodes)
      })
        .then((res) => {
          loading.close();
          this.$message.success(res.msg || '批量消耗成功');
          this.stockSummaryDialogVisible = false;
          this.stockSummarySelection = [];
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err.message || '批量消耗失败');
        });
    }
  }
};
</script>

<style scoped>
.scan-def-his-summary-dialog >>> .el-table th .cell {
  white-space: nowrap;
}
</style>
