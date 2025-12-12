<template>
  <ele-modal
    title="透析耗材记录"
    :visible="visible"
    width="95%"
    top="5vh"
    @update:visible="updateVisible"
  >
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      height="calc(90vh - 200px)"
    >
      <template v-slot:toolbar>
        <el-date-picker v-model="where.ScheduleDateStart" type="date" placeholder="排班开始日期" size="small" style="width: 140px; margin-right: 8px" clearable />
        <el-date-picker v-model="where.ScheduleDateEnd" type="date" placeholder="排班结束日期" size="small" style="width: 140px; margin-right: 8px" clearable />
        <el-input v-model="where.PatientName" placeholder="姓名" size="small" style="width: 100px; margin-right: 8px" clearable />
        <el-input v-model="where.IdCard" placeholder="身份证号" size="small" style="width: 150px; margin-right: 8px" clearable />
        <el-input v-model="where.BedNumber" placeholder="床号" size="small" style="width: 80px; margin-right: 8px" clearable />
        <el-input v-model="where.MaterialName" placeholder="耗材名称" size="small" style="width: 120px; margin-right: 8px" clearable />
        <el-input v-model="where.HisMaterialName" placeholder="HIS耗材名称" size="small" style="width: 120px; margin-right: 8px" clearable />
        <el-input v-model="where.ChargeCode" placeholder="收费编码" size="small" style="width: 120px; margin-right: 8px" clearable />
        <el-input v-model="where.Quantity" placeholder="数量" size="small" style="width: 80px; margin-right: 8px" clearable />
        <el-date-picker v-model="where.CreateTimeStart" type="date" placeholder="创建开始时间" size="small" style="width: 140px; margin-right: 8px" clearable />
        <el-date-picker v-model="where.CreateTimeEnd" type="date" placeholder="创建结束时间" size="small" style="width: 140px; margin-right: 8px" clearable />
        <el-button type="primary" size="small" icon="el-icon-search" style="margin-right: 8px" @click="reload">查询</el-button>
        <el-button type="success" size="small" icon="el-icon-download" @click="handleExport">导出Excel</el-button>
      </template>
    </ele-pro-table>
  </ele-modal>
</template>
<script>
import { getDialysisConsumablesRecords } from '@/api/KSInventory/xuetouConsume'

export default {
  name: 'DialysisRecordsDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      where: {
        ScheduleDateStart: '',
        ScheduleDateEnd: '',
        PatientName: '',
        IdCard: '',
        BedNumber: '',
        MaterialName: '',
        HisMaterialName: '',
        ChargeCode: '',
        Quantity: '',
        CreateTimeStart: '',
        CreateTimeEnd: ''
      },
      columns: [
        { prop: 'UniqueId', label: 'ID', width: 100, align: 'center' },
        { prop: 'ScheduleDate', label: '排班日期', width: 120, align: 'center' },
        { prop: 'PatientName', label: '姓名', width: 100, align: 'center' },
        { prop: 'IdCard', label: '身份证号', width: 160, align: 'center' },
        { prop: 'BedNumber', label: '床号', width: 80, align: 'center' },
        { prop: 'MaterialName', label: '耗材名称', width: 150 },
        { prop: 'HisMaterialName', label: 'HIS耗材名称', width: 150 },
        { prop: 'ChargeCode', label: '收费编码', width: 120, align: 'center' },
        { prop: 'Quantity', label: '数量', width: 80, align: 'center' },
        { prop: 'CreateTime', label: '创建时间', width: 160, align: 'center' }
      ]
    }
  },
  computed: {
    datasource() {
      return ({ page, limit }) => {
        return getDialysisConsumablesRecords({
          page,
          size: limit,
          ...this.where
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
    async handleExport() {
      try {
        const res = await getDialysisConsumablesRecords({
          page: 1,
          size: 999999,
          ...this.where
        })
        if (res.success && res.data) {
          this.$message.success('导出成功')
        } else {
          this.$message.error('导出失败')
        }
      } catch (error) {
        this.$message.error('导出失败')
      }
    },
    updateVisible(val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>
