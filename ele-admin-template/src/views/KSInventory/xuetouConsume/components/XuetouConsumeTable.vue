<template>
  <div>
    <!-- 查询条件区域 -->
    <el-card shadow="never" style="margin-bottom: 8px;" :body-style="{ padding: '10px 12px' }">
      <el-form :model="where" size="small" label-width="110px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="病人姓名:">
              <el-input v-model="where.PatientName" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="床号:">
              <el-input v-model="where.BedNumber" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="耗材名称/规格:">
              <el-input v-model="where.ConsumeableName" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="品种/计费编码:">
              <el-input v-model="where.ChargeCode" placeholder="" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="3">
            <el-form-item label="是否确认:">
              <el-select v-model="where.IsTransfer" clearable @change="reload">
                <el-option label="全部" value="" />
                <el-option label="未确认" value="0" />
                <el-option label="已确认" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="含有计费编码:">
              <el-select v-model="where.HasChargeCode" clearable @change="reload">
                <el-option label="是" value="1" />
                <el-option label="全部" value="" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="排班时段:">
              <el-select v-model="where.ScheduleShift" clearable @change="reload">
                <el-option label="全部" value="" />
                <el-option label="早班" value="1" />
                <el-option label="中班" value="2" />
                <el-option label="晚班" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="排班日期:">
              <el-date-picker
                v-model="dateRange1"
                type="daterange"
                range-separator="-"
                start-placeholder="起始"
                end-placeholder="结束"
                value-format="yyyy-MM-dd"
                clearable
                @change="handleDateRange1Change"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="5">
            <el-form-item label="血透创建时间:">
              <el-date-picker
                v-model="dateRange2"
                type="daterange"
                range-separator="-"
                start-placeholder="起始"
                end-placeholder="结束"
                value-format="yyyy-MM-dd"
                clearable
                @change="handleDateRange2Change"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="SPD转单时间:">
              <el-date-picker
                v-model="dateRange3"
                type="daterange"
                range-separator="-"
                start-placeholder="起始"
                end-placeholder="结束"
                value-format="yyyy-MM-dd"
                clearable
                @change="handleDateRange3Change"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="">
              <el-button type="primary" size="small" icon="el-icon-search" @click="reload">查询</el-button>
              <el-button type="success" size="small" icon="el-icon-download" @click="handleExport">导出</el-button>
              <el-button type="warning" size="small" icon="el-icon-check" @click="handleConfirmUse">确认使用</el-button>
              <el-button type="info" size="small" icon="el-icon-document" @click="showDialysisRecords = true">医嘱记录</el-button>
              <el-button type="primary" size="small" icon="el-icon-user" @click="handleBindPatient">绑定其他患者使用</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      height="calc(100vh - 280px)"
    >
      <template v-slot:action="{ row }">
        <el-button type="primary" size="mini" @click="openBindDialog(row)">查看使用医嘱</el-button>
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

    <BindPatientDialog
      :visible.sync="showBindPatientDialog"
      :selected-rows="selection"
      @success="handleBindPatientSuccess"
    />
  </div>
</template>
<script>
import BindConsumeDialog from './BindConsumeDialog'
import DialysisRecordsDialog from './DialysisRecordsDialog'
import BindPatientDialog from './BindPatientDialog'
import { getHdOperateList, updateHdFixQuantity, hdPlanConsumeVoClearAll } from '@/api/KSInventory/xuetouConsume'
import { exportToExcel } from '@/utils/excel-util'

export default {
  name: 'XuetouConsumeTable',
  components: {
    BindConsumeDialog,
    DialysisRecordsDialog,
    BindPatientDialog
  },
  data() {
    return {
      where: {
        PatientName: '',
        BedNumber: '',
        ConsumeableName: '',
        ChargeCode: '',
        IsTransfer: '',
        HasChargeCode: '1',
        ScheduleShift: '',
        TYPESETTING_DATE_START: '',
        TYPESETTING_DATE_END: '',
        HD_CREATE_TIME_START: '',
        HD_CREATE_TIME_END: '',
        SL_CREATE_TIME_START: '',
        SL_CREATE_TIME_END: '',
        IdCard: ''
      },
      dateRange1: null, // 排班日期
      dateRange2: null, // 血透创建时间
      dateRange3: null, // SPD转单时间
      selection: [],
      showBindDialog: false,
      showDialysisRecords: false,
      showBindPatientDialog: false,
      currentId: '',
      currentOperateNumber: '',
      columns: [
        { type: 'selection', align: 'center' },
        { label: '操作', minWidth: 140, align: 'center', slot: 'action' },
        { prop: 'PATIENT_NAME', label: '病人姓名', minWidth: 100, align: 'center' },
        { prop: 'BED_NUMBER', label: '床号', minWidth: 80, align: 'center' },
        {
          prop: 'TYPESETTING_DATE',
          label: '排班日期',
          minWidth: 110,
          align: 'center',
          formatter: row => row.TYPESETTING_DATE ? row.TYPESETTING_DATE.split('T')[0] : ''
        },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', minWidth: 140 },
        { prop: 'CHARGE_CODE', label: '计费编码', minWidth: 100, align: 'center' },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140 },
        { prop: 'HIS_CONSUMEABLE_NAME', label: '血透系统耗材名称', minWidth: 140 },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 140 },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 140 },
        { prop: 'QUANTITY', label: '排班申请数量', minWidth: 120, align: 'center' },
        { prop: 'SL_QTY', label: '配送数量', minWidth: 80, align: 'center' },
        { prop: 'USE_QTY', label: '消耗数量', minWidth: 80, align: 'center' },
        {
          prop: 'HD_CREATE_TIME',
          label: '血透创建时间',
          minWidth: 120,
          align: 'center',
          formatter: row => row.HD_CREATE_TIME ? row.HD_CREATE_TIME.split('T')[0] : ''
        },
        {
          prop: 'SL_CREATE_TIME',
          label: 'SPD转单时间',
          minWidth: 120,
          align: 'center',
          formatter: row => row.SL_CREATE_TIME ? row.SL_CREATE_TIME.split('T')[0] : ''
        },
        { prop: 'OPERATE_NUMBER', label: '配送单号', minWidth: 140, align: 'center' },
        {
          prop: 'HD_IS_USE',
          label: '是否确认',
          width: 90,
          align: 'center',
          formatter: row => row.HD_IS_USE == '1' ? '已确认' : '未确认'
        },
        {
          prop: 'HD_USE_TIME',
          label: '确认时间',
          minWidth: 120,
          align: 'center',
          formatter: row => row.HD_USE_TIME ? row.HD_USE_TIME.split('T')[0] : ''
        },
        { prop: 'HD_USE_MAN', label: '确认人', minWidth: 80, align: 'center' }
      ]
    }
  },
  computed: {
    datasource() {
      return ({ page, limit }) => {
        return getHdOperateList({
          ...this.where,
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
    handleDateRange1Change(val) {
      if (val && val.length === 2) {
        this.where.TYPESETTING_DATE_START = val[0]
        this.where.TYPESETTING_DATE_END = val[1]
      } else {
        this.where.TYPESETTING_DATE_START = ''
        this.where.TYPESETTING_DATE_END = ''
      }
    },
    handleDateRange2Change(val) {
      if (val && val.length === 2) {
        this.where.HD_CREATE_TIME_START = val[0]
        this.where.HD_CREATE_TIME_END = val[1]
      } else {
        this.where.HD_CREATE_TIME_START = ''
        this.where.HD_CREATE_TIME_END = ''
      }
    },
    handleDateRange3Change(val) {
      if (val && val.length === 2) {
        this.where.SL_CREATE_TIME_START = val[0]
        this.where.SL_CREATE_TIME_END = val[1]
      } else {
        this.where.SL_CREATE_TIME_START = ''
        this.where.SL_CREATE_TIME_END = ''
      }
    },
    reload() {
      this.$refs.table.reload()
    },
    async handleConfirmUse() {
      if (this.selection.length === 0) {
        this.$message.warning('请选择条目')
        return
      }
      
      try {
        await this.$confirm('确认使用吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const loading = this.$loading({
          lock: true,
          text: '处理中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        
        try {
          const jsonStr = JSON.stringify(this.selection)
          const res = await hdPlanConsumeVoClearAll({ json: jsonStr })
          if (res.code === 200) {
            this.$message.success(res.msg || '操作成功')
            this.reload()
          } else {
            this.$message.error(res.msg || '操作失败')
          }
        } catch (error) {
          this.$message.error(error.message || '操作失败')
        } finally {
          loading.close()
        }
      } catch (error) {
        // 用户取消
      }
    },
    async handleExport() {
      const loading = this.$loading({
        lock: true,
        text: '导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      try {
        const res = await getHdOperateList({
          ...this.where,
          page: 1,
          size: 99999
        })
        
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 准备导出数据
          const exportData = res.data.map(item => ({
            病人姓名: item.PATIENT_NAME || '',
            床号: item.BED_NUMBER || '',
            排班日期: item.TYPESETTING_DATE ? item.TYPESETTING_DATE.split('T')[0] : '',
            品种编码: item.VARIETIE_CODE_NEW || '',
            计费编码: item.CHARGE_CODE || '',
            品种名称: item.VARIETIE_NAME || '',
            血透系统耗材名称: item.HIS_CONSUMEABLE_NAME || '',
            规格型号: item.SPECIFICATION_OR_TYPE || '',
            生产企业: item.MANUFACTURING_ENT_NAME || '',
            排班申请数量: item.QUANTITY || '',
            配送数量: item.SL_QTY || '',
            消耗数量: item.USE_QTY || '',
            血透创建时间: item.HD_CREATE_TIME ? item.HD_CREATE_TIME.split('T')[0] : '',
            SPD转单时间: item.SL_CREATE_TIME ? item.SL_CREATE_TIME.split('T')[0] : '',
            配送单号: item.OPERATE_NUMBER || '',
            是否确认: item.HD_IS_USE == '1' ? '已确认' : '未确认',
            确认时间: item.HD_USE_TIME ? item.HD_USE_TIME.split('T')[0] : '',
            确认人: item.HD_USE_MAN || ''
          }))
          
          // 使用xlsx导出
          const XLSX = require('xlsx')
          const worksheet = XLSX.utils.json_to_sheet(exportData)
          const workbook = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(workbook, worksheet, '使用信息')
          XLSX.writeFile(workbook, '使用信息.xlsx')
          
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
    openBindDialog(row) {
      this.currentId = row.ID
      this.currentOperateNumber = row.OPERATE_NUMBER
      this.showBindDialog = true
    },
    handleBindPatient() {
      if (this.selection.length === 0) {
        this.$message.warning('请先选择要绑定的记录')
        return
      }
      this.showBindPatientDialog = true
    },
    handleBindPatientSuccess() {
      this.reload()
      this.selection = []
    }
  }
}
</script>
