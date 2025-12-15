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
        <el-date-picker 
          v-model="where.ScheduleDateStart" 
          type="date" 
          placeholder="排班开始日期" 
          size="small" 
          style="width: 140px; margin-right: 8px" 
          value-format="yyyy-MM-dd"
          clearable 
        />
        <el-date-picker 
          v-model="where.ScheduleDateEnd" 
          type="date" 
          placeholder="排班结束日期" 
          size="small" 
          style="width: 140px; margin-right: 8px" 
          value-format="yyyy-MM-dd"
          clearable 
        />
        <el-input v-model="where.PatientName" placeholder="姓名" size="small" style="width: 100px; margin-right: 8px" clearable />
        <el-input v-model="where.IdCard" placeholder="身份证号" size="small" style="width: 150px; margin-right: 8px" clearable />
        <el-input v-model="where.BedNumber" placeholder="床号" size="small" style="width: 80px; margin-right: 8px" clearable />
        <el-input v-model="where.MaterialName" placeholder="耗材名称" size="small" style="width: 120px; margin-right: 8px" clearable />
        <el-input v-model="where.HisMaterialName" placeholder="HIS耗材名称" size="small" style="width: 120px; margin-right: 8px" clearable />
        <el-input v-model="where.ChargeCode" placeholder="收费编码" size="small" style="width: 120px; margin-right: 8px" clearable />
        <el-input v-model="where.Quantity" placeholder="数量" size="small" style="width: 80px; margin-right: 8px" clearable />
        <el-date-picker 
          v-model="where.CreateTimeStart" 
          type="date" 
          placeholder="创建开始时间" 
          size="small" 
          style="width: 140px; margin-right: 8px" 
          value-format="yyyy-MM-dd"
          clearable 
        />
        <el-date-picker 
          v-model="where.CreateTimeEnd" 
          type="date" 
          placeholder="创建结束时间" 
          size="small" 
          style="width: 140px; margin-right: 8px" 
          value-format="yyyy-MM-dd"
          clearable 
        />
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
        { prop: 'UniqueId', label: 'ID', minWidth: 100, align: 'center' },
        { 
          prop: 'ScheduleDate', 
          label: '排班日期', 
          minWidth: 120, 
          align: 'center',
          formatter: row => row.ScheduleDate ? (row.ScheduleDate.includes('T') ? row.ScheduleDate.split('T')[0] : row.ScheduleDate.split(' ')[0]) : ''
        },
        { prop: 'PatientName', label: '姓名', minWidth: 100, align: 'center' },
        { prop: 'IdCard', label: '身份证号', minWidth: 160, align: 'center' },
        { prop: 'BedNumber', label: '床号', minWidth: 80, align: 'center' },
        { prop: 'MaterialName', label: '耗材名称', minWidth: 150 },
        { prop: 'HisMaterialName', label: 'HIS耗材名称', minWidth: 150 },
        { prop: 'ChargeCode', label: '收费编码', minWidth: 120, align: 'center' },
        { prop: 'Quantity', label: '数量', minWidth: 80, align: 'center' },
        { 
          prop: 'CreateTime', 
          label: '创建时间', 
          minWidth: 120, 
          align: 'center',
          formatter: row => row.CreateTime ? (row.CreateTime.includes('T') ? row.CreateTime.split('T')[0] + ' ' + row.CreateTime.split('T')[1].substring(0, 5) : row.CreateTime) : ''
        }
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
      const loading = this.$loading({
        lock: true,
        text: '导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      try {
        const res = await getDialysisConsumablesRecords({
          page: 1,
          size: 999999,
          ...this.where
        })
        if (res.data && res.data.length > 0) {
          // 准备导出数据
          const formatDate = (dateStr) => {
            if (!dateStr) return ''
            if (dateStr.includes('T')) {
              return dateStr.split('T')[0]
            }
            return dateStr.split(' ')[0]
          }
          const formatDateTime = (dateStr) => {
            if (!dateStr) return ''
            if (dateStr.includes('T')) {
              const [date, time] = dateStr.split('T')
              return date + ' ' + time.substring(0, 5)
            }
            return dateStr
          }
          const exportData = res.data.map(item => ({
            ID: item.UniqueId || '',
            排班日期: formatDate(item.ScheduleDate),
            姓名: item.PatientName || '',
            身份证号: item.IdCard || '',
            床号: item.BedNumber || '',
            耗材名称: item.MaterialName || '',
            HIS耗材名称: item.HisMaterialName || '',
            收费编码: item.ChargeCode || '',
            数量: item.Quantity || '',
            创建时间: formatDateTime(item.CreateTime)
          }))
          
          // 使用xlsx导出
          const XLSX = require('xlsx')
          const worksheet = XLSX.utils.json_to_sheet(exportData)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, '透析耗材记录')
          XLSX.writeFile(workbook, '透析耗材记录.xlsx')
          
          this.$message.success('导出成功')
        } else {
          this.$message.warning('没有可导出的数据')
        }
      } catch (error) {
        this.$message.error('导出失败：' + (error.message || error))
      } finally {
        loading.close()
      }
    },
    updateVisible(val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>
