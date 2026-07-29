<template>
  <el-dialog
    title="进货查验记录"
    :visible.sync="innerVisible"
    width="1200px"
    append-to-body
    @opened="reload"
  >
    <el-form size="mini" :inline="true" @submit.native.prevent>
      <el-form-item label="品种名称">
        <el-input v-model="where.VARIETIE_NAME" clearable style="width: 130px" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input
          v-model="where.SPECIFICATION_OR_TYPE"
          clearable
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item label="批准文号">
        <el-input
          v-model="where.APPROVAL_NUMBER"
          clearable
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input
          v-model="where.MANUFACTURING_ENT_NAME"
          clearable
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="where.CONTACT_PERSON" clearable style="width: 100px" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="where.CONTACT_PHONE" clearable style="width: 120px" />
      </el-form-item>
      <el-form-item label="是否合格">
        <el-select v-model="where.IS_HG" clearable style="width: 100px">
          <el-option label="全部" value="" />
          <el-option label="合格" value="1" />
          <el-option label="不合格" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="UDI码">
        <el-input v-model="where.UDI_TOP" clearable style="width: 140px" />
      </el-form-item>
      <el-form-item label="入库单号">
        <el-input
          v-model="where.DELIVERY_NOTE_NUMBER"
          clearable
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="院区">
        <el-select v-model="where.STORAGE_ID" clearable style="width: 130px">
          <el-option label="全部" value="" />
          <el-option label="通州院区" value="1" />
          <el-option label="西直门院区" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间">
        <el-date-picker
          v-model="where.ADD_TIME_START"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="where.ADD_TIME_END"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束"
          style="width: 140px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="reload">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        <el-button type="primary" icon="el-icon-download" @click="exportExcel">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <ele-pro-table
      ref="table"
      size="mini"
      border
      stripe
      :toolbar="false"
      height="520px"
      :pageSize="20"
      :pageSizes="[10, 20, 50, 100]"
      :columns="columns"
      :datasource="datasource"
      cache-key="goodsshelvesInCheckRec"
    />
  </el-dialog>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import { GetGoodsVarReceiptDetailList } from '@/api/Inventory/Goodsshelves';

function formatHospital(row) {
  if (row.STORAGE_ID == 1 || row.STORAGE_ID === '1') return '通州院区';
  if (row.STORAGE_ID == 2 || row.STORAGE_ID === '2') return '西直门院区';
  return '未知';
}

function formatAcceptancePerson(row) {
  const classific = Number(row.CLASSIFIC_PROPERTIES);
  const storageId = Number(row.STORAGE_ID);
  if (classific === 1 || classific === 2) {
    if (storageId === 1) return '王雪莹';
    if (storageId === 2) return '刘佳琪';
  } else if (classific === 0) {
    if (storageId === 1) return '甄帅';
    if (storageId === 2) return '陈嘉怡';
  }
  return '未分配';
}

function fmtDate(v) {
  if (!v) return '';
  try {
    return new Date(v).toLocaleDateString();
  } catch (e) {
    return String(v).substr(0, 10);
  }
}

export default {
  name: 'InCheckRecDialog',
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      innerVisible: false,
      where: this.emptyWhere(),
      columns: [
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          minWidth: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'NETRECEIPTS',
          label: '实收数量',
          width: 90,
          showOverflowTooltip: true
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '批准文号',
          minWidth: 130,
          showOverflowTooltip: true
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '供应商名称',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'MANUFACTURING_LICENSE',
          label: '生产许可证',
          minWidth: 130,
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH',
          label: '生产批号',
          width: 110,
          showOverflowTooltip: true
        },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          width: 110,
          formatter: (row) => fmtDate(row.BATCH_PRODUCTION_DATE)
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效期',
          width: 110,
          formatter: (row) => fmtDate(row.BATCH_VALIDITY_PERIOD)
        },
        {
          prop: 'CONTACT_PERSON',
          label: '联系人',
          width: 90,
          showOverflowTooltip: true
        },
        {
          prop: 'CONTACT_PHONE',
          label: '联系电话',
          width: 110,
          showOverflowTooltip: true
        },
        {
          prop: 'LICENCE_FILE_FULL_NAME',
          label: '地址',
          minWidth: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'IS_HG',
          label: '是否合格',
          width: 90,
          formatter: (row) => {
            if (row.IS_HG == 1) return '合格';
            if (row.IS_HG == 0) return '不合格';
            return '未知';
          }
        },
        {
          prop: 'RECEIVABLE',
          label: '应收数量',
          width: 90,
          formatter: (row) => parseFloat(row.RECEIVABLE || 0).toFixed(2)
        },
        {
          prop: 'UDI_TOP',
          label: 'UDI码',
          minWidth: 160,
          showOverflowTooltip: true
        },
        {
          prop: 'DELIVERY_NOTE_NUMBER',
          label: '入库单号',
          minWidth: 120,
          showOverflowTooltip: true
        },
        {
          prop: 'STORAGE_ID',
          label: '院区',
          width: 100,
          formatter: (row) => formatHospital(row)
        },
        {
          prop: 'ACCEPTANCE_PERSON',
          label: '入库验收人',
          width: 110,
          formatter: (row) => formatAcceptancePerson(row)
        }
      ]
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(v) {
        this.innerVisible = v;
      }
    },
    innerVisible(v) {
      this.$emit('update:visible', v);
    }
  },
  methods: {
    emptyWhere() {
      return {
        VARIETIE_NAME: '',
        SPECIFICATION_OR_TYPE: '',
        APPROVAL_NUMBER: '',
        MANUFACTURING_ENT_NAME: '',
        CONTACT_PERSON: '',
        CONTACT_PHONE: '',
        IS_HG: '',
        UDI_TOP: '',
        DELIVERY_NOTE_NUMBER: '',
        STORAGE_ID: '',
        ADD_TIME_START: '',
        ADD_TIME_END: ''
      };
    },
    reset() {
      this.where = this.emptyWhere();
      this.reload();
    },
    reload() {
      this.$refs.table?.reload?.({ page: 1, where: { ...this.where } });
    },
    datasource({ page, limit, where }) {
      return GetGoodsVarReceiptDetailList({
        page,
        size: limit,
        ...where
      }).then((res) => ({
        count: res.total,
        list: res.data || res.result || []
      }));
    },
    async exportExcel() {
      const loading = this.$messageLoading('正在导出...');
      try {
        const res = await GetGoodsVarReceiptDetailList({
          page: 1,
          size: 999999,
          ...this.where
        });
        const list = res.data || res.result || [];
        const headers = this.columns.map((c) => c.label);
        const rows = [headers];
        list.forEach((row) => {
          rows.push(
            this.columns.map((c) =>
              c.formatter ? c.formatter(row) : row[c.prop]
            )
          );
        });
        writeFile(
          {
            SheetNames: ['Sheet1'],
            Sheets: { Sheet1: utils.aoa_to_sheet(rows) }
          },
          '进货查验记录.xlsx'
        );
        this.$message.success('导出成功');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    }
  }
};
</script>
