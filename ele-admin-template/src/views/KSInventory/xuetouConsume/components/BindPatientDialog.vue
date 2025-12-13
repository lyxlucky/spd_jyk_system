<template>
  <el-dialog
    title="绑定其他患者使用"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="患者姓名:">
        <el-autocomplete
          v-model="form.patientName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入患者姓名进行搜索"
          :trigger-on-focus="false"
          value-key="PATIENT_NAME"
          @select="handleSelectPatient"
          style="width: 100%"
        >
          <template slot-scope="{ item }">
            <div class="patient-item">
              <div class="patient-name">{{ item.PATIENT_NAME }}</div>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getHdConsumePatientList, updateHdConsumePatientInfo } from '@/api/KSInventory/xuetouConsume'

export default {
  name: 'BindPatientDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        patientName: '',
        idCardNo: '',
        selectedPatient: null
      },
      timeout: null
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (!val) {
        this.resetForm()
      }
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (!queryString || queryString.trim() === '') {
        cb([])
        return
      }

      // 清除之前的定时器
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      // 防抖处理
      this.timeout = setTimeout(async () => {
        try {
          const res = await getHdConsumePatientList({
            PatientName: queryString.trim(),
            page: 1,
            size: 20
          })

          if (res.code === 200 && res.data) {
            // 格式化数据，确保有PATIENT_NAME和ID_CARD_NO字段
            const results = res.data.map(item => ({
              PATIENT_NAME: item.PATIENT_NAME || item.patientName || '',
              ID_CARD_NO: item.ID_CARD_NO || item.idCardNo || ''
            }))
            cb(results)
          } else {
            cb([])
          }
        } catch (error) {
          console.error('搜索患者失败:', error)
          cb([])
        }
      }, 300)
    },
    handleSelectPatient(item) {
      this.form.selectedPatient = item
      this.form.patientName = item.PATIENT_NAME || ''
      this.form.idCardNo = item.ID_CARD_NO || ''
    },
    async handleConfirm() {
      if (!this.form.selectedPatient) {
        this.$message.warning('请选择患者')
        return
      }

      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请先选择要绑定的记录')
        return
      }

      // 使用选中行的HD_CONSUME_ID组成ids数组，如果没有HD_CONSUME_ID则使用ID
      const ids = this.selectedRows.map(row => row.HD_CONSUME_ID).filter(id => id)

      if (ids.length === 0) {
        this.$message.warning('无法获取记录ID')
        return
      }

      this.loading = true
      try {
        const res = await updateHdConsumePatientInfo({
          Ids: ids,
          PatientName: this.form.selectedPatient.PATIENT_NAME || this.form.patientName,
          IdCardNo: this.form.selectedPatient.ID_CARD_NO || this.form.idCardNo
        })

        if (res.code === 200) {
          this.$message.success(res.msg || '绑定成功')
          this.$emit('success')
          this.dialogVisible = false
        } else {
          this.$message.error(res.msg || '绑定失败')
        }
      } catch (error) {
        console.error('绑定患者失败:', error)
        this.$message.error(error.message || '绑定失败')
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      this.resetForm()
    },
    resetForm() {
      this.form = {
        patientName: '',
        idCardNo: '',
        selectedPatient: null
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    }
  }
}
</script>

<style scoped>
.patient-item {
  padding: 5px 0;
}

.patient-name {
  font-size: 14px;
  color: #303133;
}
</style>

