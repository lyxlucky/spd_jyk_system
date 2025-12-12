<template>
  <div>
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      height="calc(100vh - 280px)"
    >
      <template v-slot:toolbar>
        <el-input v-model="where.ChargingCode" placeholder="计费编码" size="small" style="width: 150px; margin-right: 8px" clearable />
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-right: 8px" @click="reload">查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" style="margin-right: 8px" @click="handleConfirmUse">确认领用</el-button>
        <el-button type="primary" size="small" @click="showDialysisRecords = true">透析耗材记录</el-button>
      </template>
      <template v-slot:HD_FIX_QUANTITY="{ row }">
        <el-input v-model="row.HD_FIX_QUANTITY" size="mini" @blur="updateFixQuantity(row)" />
      </template>
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="openBindDialog(row)">绑定消耗</el-button>
      </template>
    </ele-pro-table>

    <BindConsumeDialog
      v-if="showBindDialog"
      :visible.sync="showBindDialog"
      :id="currentId"
      :operate-number="currentOperateNumber"
      @success="reload"
    />

    <DialysisRecordsDialog v-if="showDialysisRecords" :visible.sync="showDialysisRecords" />
  </div>
</template>
<script>
import BindConsumeDialog from './BindConsumeDialog'
import DialysisRecordsDialog from './DialysisRecordsDialog'
import { getHdOperateList, updateHdFixQuantity } from '@/api/KSInventory/xuetouConsume'

export default {
  name: 'XuetouConsumeTable',
  components: {
    BindConsumeDialog,
    DialysisRecordsDialog
  },
  data() {
    return {
      where: {
        ChargingCode: ''
      },
      selection: [],
      showBindDialog: false,
      showDialysisRecords: false,
      currentId: '',
      currentOperateNumber: '',
      columns: [
        { type: 'selection',align: 'center' },
        { prop: 'OPERATE_NUMBER', label: '申领单号', width: 150, align: 'center' },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 150, align: 'center' },
        { prop: 'VARIETIE_NAME', label: '品种名称', width: 200 },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', width: 120, align: 'center' },
        { prop: 'CHARGING_CODE', label: '计费编码', width: 150, align: 'center' },
        { prop: 'BATCH', label: '批号', width: 130, align: 'center' },
        {
          prop: 'BATCH_PRODUCTION_DATE',
          label: '生产日期',
          width: 150,
          align: 'center',
          formatter: row => row.BATCH_PRODUCTION_DATE ? row.BATCH_PRODUCTION_DATE.split(' ')[0] : ''
        },
        {
          prop: 'BATCH_VALIDITY_PERIOD',
          label: '有效期',
          width: 150,
          align: 'center',
          formatter: row => row.BATCH_VALIDITY_PERIOD ? row.BATCH_VALIDITY_PERIOD.split(' ')[0] : ''
        },
        { prop: 'QUANITY', label: '申请数量', width: 80, align: 'center' },
        {
          prop: 'QTY',
          label: '应消耗数量',
          width: 100,
          align: 'center',
          formatter: row => Number(row.QTY) || 0
        },
        {
          prop: 'ACTUAL_QTY',
          label: '实消耗数量',
          width: 100,
          align: 'center',
          formatter: row => Number(row.ACTUAL_QTY) || 0
        },
        { prop: 'HD_FIX_QUANTITY', label: '修正数量', width: 100, align: 'center', slot: 'HD_FIX_QUANTITY' },
        {
          label: '汇总数量',
          width: 100,
          align: 'center',
          formatter: row => (Number(row.HD_FIX_QUANTITY) || 0) + (Number(row.ACTUAL_QTY) || 0)
        },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', width: 200 },
        { prop: 'SUPPLY_PRICE', label: '采购价', width: 100, align: 'center' },
        { prop: 'PLAN_NUMBER', label: '计划单号', width: 130, align: 'center' },
        { label: '操作', width: 120, align: 'center', slot: 'action' }
      ]
    }
  },
  computed: {
    datasource() {
      return ({ page, limit }) => {
        return getHdOperateList({
          ChargingCode: this.where.ChargingCode,
          page,
          size: limit
        }).then(res => {
          return { list: res.data, count: res.total }
        }).catch(() => {
          return { list: [], count: 0 }
        })
      }
    }
  },
  methods: {
    reload() {
      this.$refs.table.reload()
    },
    handleConfirmUse() {
      if (this.selection.length === 0) {
        this.$message.warning('请选择要确认领用的数据')
        return
      }
      // 实现确认领用逻辑
    },
    async updateFixQuantity(row) {
      try {
        const res = await updateHdFixQuantity({
          ID: row.ID,
          QTY: row.HD_FIX_QUANTITY
        })
        if (res.code === 200) {
          this.$message.success('修改成功')
          this.reload()
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        this.$message.error('修改失败')
      }
    },
    openBindDialog(row) {
      this.currentId = row.ID
      this.currentOperateNumber = row.OPERATE_NUMBER
      this.showBindDialog = true
    }
  }
}
</script>
