<template>
  <div class="ele-body spd-page lis-test-item-mapping-page">
    <el-card shadow="never" class="lis-test-item-mapping-card">
      <div class="spd-panel spd-panel--search">
        <div class="spd-panel__head">查询条件</div>
        <div class="spd-panel__body">
          <!-- 搜索表单 -->
          <el-form
            :model="searchForm"
            :inline="true"
            class="ele-form-search"
            size="mini"
            @keyup.enter.native="search"
          >
            <el-form-item label="LIS项目">
              <el-input
                style="width: 140px"
                v-model="searchForm.lisKeyword"
                placeholder="代码/名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="HIS项目">
              <el-input
                style="width: 140px"
                v-model="searchForm.hisKeyword"
                placeholder="代码/名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="物料">
              <el-input
                style="width: 160px"
                v-model="searchForm.varietieKeyword"
                placeholder="编码/名称/简称"
                clearable
              />
            </el-form-item>
            <el-form-item class="ele-form-actions">
              <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
              <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
              <el-button type="success" @click="syncLisData" :loading="syncLoading" icon="el-icon-refresh">
                同步LIS数据
              </el-button>
              <el-button type="warning" :loading="exportLoading" icon="el-icon-download" @click="exportMappings">
                导出
              </el-button>
              <el-dropdown
                split-button
                type="info"
                :disabled="hisImportLoading"
                @click="triggerHisImport"
                @command="handleHisImportCommand"
              >
                {{ hisImportLoading ? '导入中...' : '导入HIS对码' }}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="download"><i class="el-icon-download" /> 下载模板</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown
                split-button
                type="info"
                :disabled="spdImportLoading"
                @click="triggerSpdImport"
                @command="handleSpdImportCommand"
              >
                {{ spdImportLoading ? '导入中...' : '导入SPD对码' }}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="download"><i class="el-icon-download" /> 下载模板</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <input ref="hisImportInput" type="file" accept=".xlsx" style="display:none" @change="handleHisImportFile">
              <input ref="spdImportInput" type="file" accept=".xlsx" style="display:none" @change="handleSpdImportFile">
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="spd-panel spd-table-panel">
        <div class="spd-panel__head">检验项目对照列表</div>
        <div class="spd-table-panel__wrap">
          <!-- 数据表格 -->
          <vxe-table
            ref="table"
            class="data-table"
            :data="tableData"
            :loading="tableLoading"
            border
            resizable
            size="mini"
            :height="tableHeight"
            :row-config="{ isHover: true }"
          >
        <vxe-column type="seq" title="序号" width="55" align="center" />
        <vxe-column field="LIS_CODE" title="LIS项目代码" width="120" />
        <vxe-column field="LIS_NAME" title="LIS项目名称" min-width="150" show-overflow />
        <vxe-column field="HIS_CODE" title="HIS项目代码" width="120" />
        <vxe-column field="HIS_NAME" title="HIS项目名称" min-width="150" show-overflow />
        <vxe-column field="HIS_PRICE" title="HIS价格" width="100" align="right" :formatter="formatterPrice" />
        <vxe-column field="WEIGHT" title="权重" width="80" align="right" />
        <vxe-column field="UPDATE_TIME" title="更新时间" width="155" align="center" :formatter="formatterDateTime" v-if="false" />
        <vxe-column field="UPDATE_MAN" title="更新人" width="90" align="center" v-if="false" />
        <vxe-column field="HIS_CREATE_TIME" title="HIS创建时间" width="155" align="center" :formatter="formatterDateTime" v-if="false" />
        <vxe-column field="HIS_CREATE_MAN" title="HIS创建人" width="90" align="center" v-if="false" />
        <vxe-column field="VARIETIE_CODE_NEW" title="物料编码" width="120" />
        <vxe-column field="VARIETIE_NAME" title="物料名称" min-width="150" show-overflow />
        <vxe-column field="COMMON_NAME" title="物料简称" width="120" />
        <vxe-column title="操作" width="300" align="center" class-name="action-col">
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              icon="el-icon-edit"
              @click="openWeightDialog(row)"
            >
              编辑权重
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              icon="el-icon-plus"
              @click="openHisDialog(row)"
            >
              HIS对码
            </el-link>
            <el-link
              type="success"
              :underline="false"
              icon="el-icon-plus"
              @click="openSpdDialog(row)"
            >
              SPD对码
            </el-link>
            <el-link
              v-if="row.HIS_ID"
              type="danger"
              :underline="false"
              icon="el-icon-delete"
              @click="deleteHisMapping(row)"
            >
              删HIS对码
            </el-link>
            <el-link
              v-if="row.SPD_ID"
              type="danger"
              :underline="false"
              icon="el-icon-delete"
              @click="deleteSpdMapping(row)"
            >
              删SPD对码
            </el-link>
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="openWeightDialog(row)"
              class="mapping-op-btn mapping-op-btn-primary"
            >
              编辑权重
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="openHisDialog(row)"
              class="mapping-op-btn"
            >
              HIS对码
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="openSpdDialog(row)"
              class="mapping-op-btn mapping-op-btn-success"
            >
              SPD对码
            </el-button>
            <el-button
              v-if="row.HIS_ID"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteHisMapping(row)"
              class="mapping-op-btn mapping-op-btn-danger"
            >
              删HIS对码
            </el-button>
            <el-button
              v-if="row.SPD_ID"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteSpdMapping(row)"
              class="mapping-op-btn mapping-op-btn-danger"
            >
              删SPD对码
            </el-button> -->
          </template>
        </vxe-column>
          </vxe-table>

          <!-- 分页 -->
          <vxe-pager
            :current-page="tablePage.page"
            :page-size="tablePage.size"
            :total="tablePage.total"
            :page-sizes="[10, 20, 50, 100]"
            size="mini"
            @page-change="onTablePageChange"
            class="lis-test-item-mapping-pager"
          />
        </div>
      </div>
    </el-card>

    <!-- 添加HIS对码关系对话框 -->
    <el-dialog
      title="添加HIS对码关系"
      :visible.sync="hisDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="closeHisDialog"
    >
      <el-form
        ref="hisForm"
        :model="hisFormData"
        :rules="hisFormRules"
        label-width="120px"
        size="mini"
      >
        <el-form-item label="LIS项目代码">
          <el-input v-model="hisFormData.LIS_CODE" readonly />
        </el-form-item>
        <el-form-item label="LIS项目名称">
          <el-input v-model="hisFormData.LIS_NAME" readonly />
        </el-form-item>
        <el-form-item label="HIS项目代码" prop="HIS_CODE">
          <el-input v-model="hisFormData.HIS_CODE" placeholder="请输入HIS项目代码" />
        </el-form-item>
        <el-form-item label="HIS项目名称" prop="HIS_NAME">
          <el-input v-model="hisFormData.HIS_NAME" placeholder="请输入HIS项目名称" />
        </el-form-item>
        <el-form-item label="HIS项目价格" prop="HIS_PRICE">
          <el-input-number
            v-model="hisFormData.HIS_PRICE"
            :precision="2"
            :min="0"
            size="mini"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeHisDialog">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="hisDialogLoading"
          @click="saveHisMapping"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 添加SPD对码关系对话框 -->
    <el-dialog
      title="添加SPD对码关系"
      :visible.sync="spdDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      @close="closeSpdDialog"
    >
      <el-form
        ref="spdForm"
        :model="spdFormData"
        :rules="spdFormRules"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="LIS项目代码">
          <el-input v-model="spdFormData.LIS_CODE" readonly />
        </el-form-item>
        <el-form-item label="LIS项目名称">
          <el-input v-model="spdFormData.LIS_NAME" readonly />
        </el-form-item>
        <el-form-item label="物料编码" prop="VAR_CODE_NEW">
          <el-input v-model="spdFormData.VAR_CODE_NEW" placeholder="请输入物料编码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeSpdDialog">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="spdDialogLoading"
          @click="saveSpdMapping"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 编辑权重对话框 -->
    <el-dialog
      title="编辑权重"
      :visible.sync="weightDialogVisible"
      width="400px"
      :close-on-click-modal="false"
      @close="closeWeightDialog"
    >
      <el-form
        ref="weightForm"
        :model="weightFormData"
        :rules="weightFormRules"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="LIS项目代码">
          <el-input v-model="weightFormData.LIS_CODE" readonly />
        </el-form-item>
        <el-form-item label="LIS项目名称">
          <el-input v-model="weightFormData.LIS_NAME" readonly />
        </el-form-item>
        <el-form-item label="权重" prop="WEIGHT">
          <el-input-number
            v-model="weightFormData.WEIGHT"
            :min="0"
            size="mini"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeWeightDialog">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="weightDialogLoading"
          @click="saveWeightMapping"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryLisTestItems,
  syncLisData,
  addLisTestItemHis,
  addLisTestItemHisBatch,
  addLisTestItemSpd,
  addLisTestItemSpdBatch,
  deleteLisTestItemHis,
  deleteLisTestItemSpd,
  updateLisTestItemWeight
} from '@/api/KSInventory/LisTestItemMapping'

export default {
  name: 'LisTestItemMapping',
  data() {
    return {
      // 搜索表单
      searchForm: {
        lisKeyword: '',
        hisKeyword: '',
        varietieKeyword: '',
        QYBZ: ''
      },
      // 表格
      tableData: [],
      tableLoading: false,
      tableHeight: 'calc(100vh - 280px)',
      tablePage: { page: 1, size: 20, total: 0 },
      // 同步
      syncLoading: false,
      exportLoading: false,
      hisImportLoading: false,
      spdImportLoading: false,
      // HIS对码对话框
      hisDialogVisible: false,
      hisDialogLoading: false,
      hisFormData: {
        LIS_CODE: '',
        LIS_NAME: '',
        HIS_CODE: '',
        HIS_NAME: '',
        HIS_PRICE: 0
      },
      hisFormRules: {
        HIS_CODE: [{ required: true, message: '请输入HIS项目代码', trigger: 'blur' }],
        HIS_NAME: [{ required: true, message: '请输入HIS项目名称', trigger: 'blur' }],
        HIS_PRICE: [{ required: true, message: '请输入HIS项目价格', trigger: 'blur' }]
      },
      // SPD对码对话框
      spdDialogVisible: false,
      spdDialogLoading: false,
      spdFormData: {
        LIS_CODE: '',
        LIS_NAME: '',
        VAR_CODE_NEW: ''
      },
      spdFormRules: {
        VAR_CODE_NEW: [{ required: true, message: '请输入物料编码', trigger: 'blur' }]
      },
      // 权重编辑对话框
      weightDialogVisible: false,
      weightDialogLoading: false,
      weightFormData: {
        LIS_CODE: '',
        LIS_NAME: '',
        WEIGHT: null
      },
      weightFormRules: {
        WEIGHT: [{ required: true, message: '请输入权重', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 查询
    search() {
      this.tablePage.page = 1
      this.loadTableData()
    },
    reset() {
      this.searchForm = {
        lisKeyword: '',
        hisKeyword: '',
        varietieKeyword: '',
        QYBZ: ''
      }
      this.tablePage.page = 1
      this.loadTableData()
    },
    async loadTableData() {
      this.tableLoading = true
      try {
        const params = {
          lisKeyword: this.searchForm.lisKeyword,
          hisKeyword: this.searchForm.hisKeyword,
          varietieKeyword: this.searchForm.varietieKeyword,
          QYBZ: this.searchForm.QYBZ,
          Page: this.tablePage.page,
          Size: this.tablePage.size
        }
        const res = await queryLisTestItems(params)
        this.tableData = res.result || []
        this.tablePage.total = res.total || 0
      } catch (error) {
        this.$message.error(error.message || '加载数据失败')
      } finally {
        this.tableLoading = false
      }
    },
    onTablePageChange({ currentPage, pageSize }) {
      this.tablePage.page = currentPage
      this.tablePage.size = pageSize
      this.loadTableData()
    },

    // 同步LIS数据
    async syncLisData() {
      this.syncLoading = true
      try {
        const res = await syncLisData({})
        this.$message.success(res.msg || '同步成功')
        this.loadTableData()
      } catch (error) {
        this.$message.error(error.message || '同步失败')
      } finally {
        this.syncLoading = false
      }
    },

    buildQueryParams(page, size) {
      return {
        lisKeyword: this.searchForm.lisKeyword,
        hisKeyword: this.searchForm.hisKeyword,
        varietieKeyword: this.searchForm.varietieKeyword,
        QYBZ: this.searchForm.QYBZ,
        Page: page,
        Size: size
      }
    },

    async exportMappings() {
      this.exportLoading = true
      try {
        const res = await queryLisTestItems(this.buildQueryParams(1, 99999))
        const rows = res.result || []
        if (!rows.length) {
          this.$message.warning('暂无可导出数据')
          return
        }

        const XLSX = await import('xlsx')
        const exportData = rows.map(item => ({
          LIS项目代码: item.LIS_CODE || '',
          LIS项目名称: item.LIS_NAME || '',
          权重: item.WEIGHT != null ? item.WEIGHT : '',
          HIS项目代码: item.HIS_CODE || '',
          HIS项目名称: item.HIS_NAME || '',
          HIS价格: item.HIS_PRICE != null ? item.HIS_PRICE : '',
          HIS创建人: item.HIS_CREATE_MAN || '',
          HIS创建时间: item.HIS_CREATE_TIME ? this.$moment(item.HIS_CREATE_TIME).format('YYYY-MM-DD HH:mm:ss') : '',
          物料编码: item.VARIETIE_CODE_NEW || '',
          物料名称: item.VARIETIE_NAME || '',
          物料简称: item.COMMON_NAME || '',
          SPD创建人: item.SPD_CREATE_MAN || '',
          SPD创建时间: item.SPD_CREATE_TIME ? this.$moment(item.SPD_CREATE_TIME).format('YYYY-MM-DD HH:mm:ss') : ''
        }))

        const sheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, sheet, '检验项目对照')
        XLSX.writeFile(workbook, `检验项目对照_${this.$moment().format('YYYYMMDDHHmmss')}.xlsx`)
      } catch (error) {
        this.$message.error(error.message || '导出失败')
      } finally {
        this.exportLoading = false
      }
    },

    handleHisImportCommand(command) {
      if (command === 'download') {
        this.downloadHisTemplate()
      }
    },
    triggerHisImport() {
      this.$refs.hisImportInput.value = ''
      this.$refs.hisImportInput.click()
    },
    async downloadHisTemplate() {
      try {
        const ExcelJS = (await import('exceljs')).default
        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('HIS对码导入模板')
        sheet.columns = [{ width: 18 }, { width: 18 }, { width: 24 }, { width: 12 }]
        const headerRow = sheet.addRow(['LIS项目代码', 'HIS项目代码', 'HIS项目名称', 'HIS项目价格'])
        headerRow.eachCell(cell => {
          cell.font = { bold: true }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        })
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'HIS对码导入模板.xlsx'
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        this.$message.error(error.message || '下载模板失败')
      }
    },
    async handleHisImportFile(event) {
      const file = event.target.files[0]
      if (!file) return
      this.hisImportLoading = true
      try {
        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const wb = XLSX.read(buffer, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })
        const items = []
        for (let i = 1; i < aoa.length; i++) {
          const row = aoa[i]
          if (!row || !row[0] || !row[1] || !row[2]) continue
          const priceVal = row[3]
          const price = priceVal == null || priceVal === '' || isNaN(Number(priceVal)) ? 0 : Number(priceVal)
          items.push({
            LIS_CODE: String(row[0]).trim(),
            HIS_CODE: String(row[1]).trim(),
            HIS_NAME: String(row[2]).trim(),
            HIS_PRICE: price
          })
        }

        if (!items.length) {
          this.$message.warning('未读取到有效HIS导入数据')
          return
        }

        await this.$confirm(`读取到 ${items.length} 条HIS对码数据，确认导入？`, '导入确认', {
          confirmButtonText: '确认导入',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await addLisTestItemHisBatch({ ITEMS: items })
        const successCount = res.successCount != null ? res.successCount : items.length
        this.$message.success(`HIS导入完成：成功${successCount}条`)
        this.loadTableData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '导入失败')
        }
      } finally {
        this.hisImportLoading = false
      }
    },

    handleSpdImportCommand(command) {
      if (command === 'download') {
        this.downloadSpdTemplate()
      }
    },
    triggerSpdImport() {
      this.$refs.spdImportInput.value = ''
      this.$refs.spdImportInput.click()
    },
    async downloadSpdTemplate() {
      try {
        const ExcelJS = (await import('exceljs')).default
        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('SPD对码导入模板')
        sheet.columns = [{ width: 18 }, { width: 18 }]
        const headerRow = sheet.addRow(['LIS项目代码', '物料编码'])
        headerRow.eachCell(cell => {
          cell.font = { bold: true }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        })
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'SPD对码导入模板.xlsx'
        a.click()
        URL.revokeObjectURL(url)
      } catch (error) {
        this.$message.error(error.message || '下载模板失败')
      }
    },
    async handleSpdImportFile(event) {
      const file = event.target.files[0]
      if (!file) return
      this.spdImportLoading = true
      try {
        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const wb = XLSX.read(buffer, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null })
        const items = []
        for (let i = 1; i < aoa.length; i++) {
          const row = aoa[i]
          if (!row || !row[0] || !row[1]) continue
          items.push({
            LIS_CODE: String(row[0]).trim(),
            VAR_CODE_NEW: String(row[1]).trim()
          })
        }

        if (!items.length) {
          this.$message.warning('未读取到有效SPD导入数据')
          return
        }

        await this.$confirm(`读取到 ${items.length} 条SPD对码数据，确认导入？`, '导入确认', {
          confirmButtonText: '确认导入',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await addLisTestItemSpdBatch({ ITEMS: items })
        const successCount = res.successCount != null ? res.successCount : items.length
        this.$message.success(`SPD导入完成：成功${successCount}条`)
        this.loadTableData()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '导入失败')
        }
      } finally {
        this.spdImportLoading = false
      }
    },

    // HIS对码
    openHisDialog(row) {
      this.hisFormData = {
        LIS_CODE: row.LIS_CODE,
        LIS_NAME: row.LIS_NAME,
        HIS_CODE: '',
        HIS_NAME: '',
        HIS_PRICE: 0
      }
      this.hisDialogVisible = true
      this.$nextTick(() => {
        this.$refs.hisForm && this.$refs.hisForm.clearValidate()
      })
    },
    closeHisDialog() {
      this.hisDialogVisible = false
      this.$refs.hisForm && this.$refs.hisForm.resetFields()
    },
    async saveHisMapping() {
      this.$refs.hisForm.validate(async (valid) => {
        if (!valid) return

        this.hisDialogLoading = true
        try {
          const params = {
            LIS_CODE: this.hisFormData.LIS_CODE,
            HIS_CODE: this.hisFormData.HIS_CODE,
            HIS_NAME: this.hisFormData.HIS_NAME,
            HIS_PRICE: this.hisFormData.HIS_PRICE
          }
          const res = await addLisTestItemHis(params)
          this.$message.success(res.msg || '添加成功')
          this.closeHisDialog()
          this.loadTableData()
        } catch (error) {
          this.$message.error(error.message || '添加失败')
        } finally {
          this.hisDialogLoading = false
        }
      })
    },

    // SPD对码
    openSpdDialog(row) {
      this.spdFormData = {
        LIS_CODE: row.LIS_CODE,
        LIS_NAME: row.LIS_NAME,
        VAR_CODE_NEW: ''
      }
      this.spdDialogVisible = true
      this.$nextTick(() => {
        this.$refs.spdForm && this.$refs.spdForm.clearValidate()
      })
    },
    closeSpdDialog() {
      this.spdDialogVisible = false
      this.$refs.spdForm && this.$refs.spdForm.resetFields()
    },
    async saveSpdMapping() {
      this.$refs.spdForm.validate(async (valid) => {
        if (!valid) return

        this.spdDialogLoading = true
        try {
          const params = {
            LIS_CODE: this.spdFormData.LIS_CODE,
            VAR_CODE_NEW: this.spdFormData.VAR_CODE_NEW
          }
          const res = await addLisTestItemSpd(params)
          this.$message.success(res.msg || '添加成功')
          this.closeSpdDialog()
          this.loadTableData()
        } catch (error) {
          this.$message.error(error.message || '添加失败')
        } finally {
          this.spdDialogLoading = false
        }
      })
    },

    async deleteHisMapping(row) {
      try {
        await this.$confirm('确认删除该HIS对码关系吗？', '提示', {
          type: 'warning'
        })
      } catch {
        return
      }

      try {
        await deleteLisTestItemHis({ HIS_ID: row.HIS_ID })
        this.$message.success('删除成功')
        this.loadTableData()
      } catch (error) {
        this.$message.error(error.message || '删除失败')
      }
    },

    async deleteSpdMapping(row) {
      try {
        await this.$confirm('确认删除该SPD对码关系吗？', '提示', {
          type: 'warning'
        })
      } catch {
        return
      }

      try {
        await deleteLisTestItemSpd({ SPD_ID: row.SPD_ID })
        this.$message.success('删除成功')
        this.loadTableData()
      } catch (error) {
        this.$message.error(error.message || '删除失败')
      }
    },

    // 权重编辑
    openWeightDialog(row) {
      this.weightFormData = {
        LIS_CODE: row.LIS_CODE,
        LIS_NAME: row.LIS_NAME,
        WEIGHT: row.WEIGHT
      }
      this.weightDialogVisible = true
      this.$nextTick(() => {
        this.$refs.weightForm && this.$refs.weightForm.clearValidate()
      })
    },
    closeWeightDialog() {
      this.weightDialogVisible = false
      this.$refs.weightForm && this.$refs.weightForm.resetFields()
    },
    async saveWeightMapping() {
      this.$refs.weightForm.validate(async (valid) => {
        if (!valid) return

        this.weightDialogLoading = true
        try {
          const params = {
            LIS_CODE: this.weightFormData.LIS_CODE,
            WEIGHT: this.weightFormData.WEIGHT
          }
          const res = await updateLisTestItemWeight(params)
          this.$message.success(res.msg || '更新成功')
          this.closeWeightDialog()
          this.loadTableData()
        } catch (error) {
          this.$message.error(error.message || '更新失败')
        } finally {
          this.weightDialogLoading = false
        }
      })
    },

    // 格式化
    formatterDateTime({ cellValue }) {
      if (!cellValue) return ''
      try {
        return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      } catch {
        return cellValue
      }
    },
    formatterPrice({ cellValue }) {
      if (cellValue == null || cellValue === '') return ''
      return Number(cellValue).toFixed(2)
    }
  },
  created() {
    this.loadTableData()
  }
}
</script>

<style scoped lang="scss">
.lis-test-item-mapping-card :deep(.el-card__body) {
  padding: 10px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

.ele-form-actions :deep(.el-form-item__content) {
  max-width: none !important;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.ele-form-actions :deep(.el-button) {
  margin: 0;
}

.lis-test-item-mapping-pager {
  margin-top: 8px;
}

.lis-test-item-mapping-page :deep(.vxe-header--column .vxe-cell) {
  white-space: nowrap;
}

.lis-test-item-mapping-page :deep(.action-col .vxe-cell) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.lis-test-item-mapping-page :deep(.action-col .el-link) {
  font-size: 12px;
}

/* .mapping-op-btn {
  padding: 2px 4px;
  margin: 2px;
  line-height: 1;
}

.mapping-op-btn-success {
  color: #67c23a;
}

.mapping-op-btn-primary {
  color: #409eff;
}

.mapping-op-btn-danger {
  color: #f56c6c;
} */
</style>
