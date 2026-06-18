<template>
  <div class="herp-jf-dept ele-body-small">
    <el-card shadow="never" class="block-card">
      <div slot="header" class="card-head">
        <span>计费科室与 SPD 二级科室对码</span>
      </div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <el-form-item label="二级科室名称">
          <el-input v-model="twoSearch" clearable placeholder="支持模糊" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadTwo(1)">查询</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="openTwoAdd">添加</el-button>
          <el-button type="primary" plain icon="el-icon-edit" @click="openTwoEdit">编辑</el-button>
          <el-button type="danger" plain icon="el-icon-delete" @click="onTwoDelete">删除</el-button>
          <el-upload
            class="inline-upload"
            action=""
            :show-file-list="false"
            accept=".xlsx,.xls"
            :http-request="onExcelUpload"
          >
            <el-button size="small" icon="el-icon-upload2">上传</el-button>
          </el-upload>
          <el-button size="small" icon="el-icon-download" @click="exportTwoExcel">导出</el-button>
        </el-form-item>
      </el-form>
      <vxe-table
        ref="twoTable"
        :loading="twoLoading"
        :data="twoRows"
        border
        stripe
        size="mini"
        height="400"
        :row-config="{ isHover: true, isCurrent: true }"
        :column-config="{ resizable: true }"
        show-overflow
        @current-change="onTwoCurrentChange"
      >
        <vxe-column field="DEPT_CODE" title="计费科室编码" min-width="130" show-overflow />
        <vxe-column field="DEPT_NAME" title="计费科室名称" min-width="160" show-overflow />
        <vxe-column title="SPD二级科室编码" min-width="150" show-overflow>
          <template #default="{ row }">{{ fmtMap(row.DEPT_TWO_CODE) }}</template>
        </vxe-column>
        <vxe-column title="SPD二级科室名称" min-width="160" show-overflow>
          <template #default="{ row }">{{ fmtMapName(row) }}</template>
        </vxe-column>
        <vxe-column field="ADD_TIME" title="创建时间" width="220" show-overflow>
          <template #default="{ row }">{{ formatDateTime(row.ADD_TIME) }}</template>
        </vxe-column>
      </vxe-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="twoTotal"
        :page-size="twoPage.size"
        :current-page="twoPage.page"
        :page-sizes="[20, 40, 60, 90, 150, 300]"
        @size-change="onTwoSize"
        @current-change="loadTwo"
      />
    </el-card>

    <el-card shadow="never" class="block-card" style="margin-top: 16px">
      <div slot="header" class="card-head">
        <span>计费科室与 SPD 一级科室对码</span>
      </div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <el-form-item label="一级科室名称">
          <el-input v-model="oneSearch" clearable placeholder="支持模糊" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadOne(1)">查询</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="openOneAdd">添加</el-button>
          <el-button type="primary" plain icon="el-icon-edit" @click="openOneEdit">编辑</el-button>
        </el-form-item>
      </el-form>
      <vxe-table
        ref="oneTable"
        :loading="oneLoading"
        :data="oneRows"
        border
        stripe
        size="mini"
        height="400"
        :row-config="{ isHover: true, isCurrent: true }"
        :column-config="{ resizable: true }"
        show-overflow
        @current-change="onOneCurrentChange"
      >
        <vxe-column field="HIS_DEPT_CODE" title="计费科室编码" min-width="130" show-overflow />
        <vxe-column field="HIS_DEPT_NAME" title="计费科室名称" min-width="160" show-overflow />
        <vxe-column title="SPD一级科室编码" min-width="150" show-overflow>
          <template #default="{ row }">{{ fmtMap(row.DEPT_ONE_CODE) }}</template>
        </vxe-column>
        <vxe-column title="SPD一级科室名称" min-width="160" show-overflow>
          <template #default="{ row }">{{ fmtMap(row.DEPT_ONE_NAME) }}</template>
        </vxe-column>
        <vxe-column field="CREATE_TIME" title="创建时间" width="220" show-overflow>
          <template #default="{ row }">{{ formatDateTime(row.CREATE_TIME) }}</template>
        </vxe-column>
      </vxe-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="oneTotal"
        :page-size="onePage.size"
        :current-page="onePage.page"
        :page-sizes="[20, 50, 100, 99999]"
        @size-change="onOneSize"
        @current-change="loadOne"
      />
    </el-card>

    <!-- 二级对码 新增/编辑 -->
    <el-dialog :title="twoDialogTitle" :visible.sync="twoDialog" width="480px" append-to-body @closed="resetTwoForm">
      <el-form ref="twoFormRef" :model="twoForm" label-width="140px" size="small">
        <el-form-item label="计费科室编码" prop="dept_code" :rules="[{ required: true, message: '必填' }]">
          <el-input v-model="twoForm.dept_code" />
        </el-form-item>
        <el-form-item label="计费科室名称" prop="dept_name" :rules="[{ required: true, message: '必填' }]">
          <el-input v-model="twoForm.dept_name" />
        </el-form-item>
        <el-form-item label="SPD二级科室编码">
          <el-input v-model="twoForm.dept_two_code" placeholder="可空" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="twoDialog = false">取 消</el-button>
        <el-button type="primary" :loading="twoSaving" @click="submitTwo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 一级对码 新增/编辑 -->
    <el-dialog :title="oneDialogTitle" :visible.sync="oneDialog" width="480px" append-to-body @closed="resetOneForm">
      <el-form ref="oneFormRef" :model="oneForm" label-width="140px" size="small">
        <el-form-item label="计费科室编码" prop="HIS_DEPT_CODE" :rules="[{ required: true, message: '必填' }]">
          <el-input v-model="oneForm.HIS_DEPT_CODE" />
        </el-form-item>
        <el-form-item label="计费科室名称" prop="HIS_DEPT_NAME" :rules="[{ required: true, message: '必填' }]">
          <el-input v-model="oneForm.HIS_DEPT_NAME" />
        </el-form-item>
        <el-form-item label="SPD一级科室编码" prop="DEPT_ONE_CODE" :rules="[{ required: true, message: '必填' }]">
          <el-input v-model="oneForm.DEPT_ONE_CODE" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="oneDialog = false">取 消</el-button>
        <el-button type="primary" :loading="oneSaving" @click="submitOne">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchHerpDeptInfo,
  addHerpDeptInfo,
  upHerpDeptInfo,
  delHerpDeptInfo,
  searchOneDeptPage,
  addHerpOneDeptInfo,
  upHerpOneDeptInfo,
  uploadThrirdDeptExcel
} from '@/api/Home/HerpJfDept';

export default {
  name: 'HerpJfDept',
  data() {
    return {
      twoSearch: '',
      twoLoading: false,
      twoRows: [],
      twoTotal: 0,
      twoPage: { page: 1, size: 20 },
      twoCurrent: null,
      twoDialog: false,
      twoEditMode: false,
      twoSaving: false,
      twoForm: { id: '', dept_code: '', dept_name: '', dept_two_code: '' },
      oneSearch: '',
      oneLoading: false,
      oneRows: [],
      oneTotal: 0,
      onePage: { page: 1, size: 20 },
      oneCurrent: null,
      oneDialog: false,
      oneEditMode: false,
      oneSaving: false,
      oneForm: { id: '', HIS_DEPT_CODE: '', HIS_DEPT_NAME: '', DEPT_ONE_CODE: '' }
    };
  },
  computed: {
    twoDialogTitle() {
      return this.twoEditMode ? '编辑计费科室' : '新增计费科室';
    },
    oneDialogTitle() {
      return this.oneEditMode ? '编辑计费科室' : '新增计费科室';
    }
  },
  created() {
    this.loadTwo(1);
    this.loadOne(1);
  },
  methods: {
    formatDateTime(value) {
      return this.$util.toDateString(value, 'yyyy-MM-dd HH:mm:ss');
    },
    fmtMap(v) {
      if (v == null || v === '') return '未对码';
      return v;
    },
    fmtMapName(row) {
      if (row.DEPT_TWO_CODE == null || row.DEPT_TWO_CODE === '') return '未对码';
      return row.DEPT_TWO_NAME || '';
    },
    async loadTwo(page) {
      if (page) this.twoPage.page = page;
      this.twoLoading = true;
      try {
        const data = await searchHerpDeptInfo({
          searchVale: this.twoSearch,
          page: this.twoPage.page,
          size: this.twoPage.size
        });
        this.twoRows = data.result || [];
        this.twoTotal = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.twoLoading = false;
      }
    },
    onTwoSize(s) {
      this.twoPage.size = s;
      this.loadTwo(1);
    },
    onTwoCurrentChange({ row }) {
      this.twoCurrent = row;
    },
    openTwoAdd() {
      this.twoEditMode = false;
      this.resetTwoForm();
      this.twoDialog = true;
    },
    openTwoEdit() {
      if (!this.twoCurrent) {
        this.$message.warning('请先选中要编辑的行');
        return;
      }
      this.twoEditMode = true;
      this.twoForm = {
        id: String(this.twoCurrent.ID ?? ''),
        dept_code: this.twoCurrent.DEPT_CODE || '',
        dept_name: this.twoCurrent.DEPT_NAME || '',
        dept_two_code: this.twoCurrent.DEPT_TWO_CODE || ''
      };
      this.twoDialog = true;
    },
    resetTwoForm() {
      this.twoForm = { id: '', dept_code: '', dept_name: '', dept_two_code: '' };
      this.$nextTick(() => this.$refs.twoFormRef && this.$refs.twoFormRef.clearValidate());
    },
    submitTwo() {
      this.$refs.twoFormRef.validate(async (valid) => {
        if (!valid) return;
        this.twoSaving = true;
        try {
          if (this.twoEditMode) {
            await upHerpDeptInfo(this.twoForm);
          } else {
            await addHerpDeptInfo(this.twoForm);
          }
          this.$message.success('操作成功');
          this.twoDialog = false;
          this.loadTwo(this.twoPage.page);
        } catch (e) {
          this.$message.error(e.message || '操作失败');
        } finally {
          this.twoSaving = false;
        }
      });
    },
    onTwoDelete() {
      if (!this.twoCurrent) {
        this.$message.warning('请先选中要删除的行');
        return;
      }
      this.$confirm('确认删除当前计费科室吗？', '提示', { type: 'warning' })
        .then(async () => {
          await delHerpDeptInfo(this.twoCurrent.ID);
          this.$message.success('删除成功');
          this.twoCurrent = null;
          this.loadTwo(1);
        })
        .catch(() => {});
    },
    async onExcelUpload({ file }) {
      try {
        await uploadThrirdDeptExcel(file);
        this.$message.success('上传成功');
        this.loadTwo(1);
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      }
    },
    async exportTwoExcel() {
      try {
        const data = await searchHerpDeptInfo({
          searchVale: this.twoSearch,
          page: 1,
          size: 999999
        });
        const rows = data.result || [];
        const ExcelJS = (await import('exceljs')).default;
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('计费科室对照');
        ws.addRow(['计费科室编码', '计费科室名称', 'SPD二级科室编码', 'SPD二级科室名称', '创建时间']);
        rows.forEach((r) => {
          ws.addRow([
            r.DEPT_CODE,
            r.DEPT_NAME,
            r.DEPT_TWO_CODE,
            r.DEPT_TWO_NAME,
            r.ADD_TIME
          ]);
        });
        const buf = await wb.xlsx.writeBuffer();
        const blob = new Blob([buf], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `计费科室对照_${new Date().getDate()}.xlsx`;
        a.click();
        URL.revokeObjectURL(a.href);
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      }
    },
    async loadOne(page) {
      if (page) this.onePage.page = page;
      this.oneLoading = true;
      try {
        const data = await searchOneDeptPage({
          DEPT_ONE_NAME: this.oneSearch,
          page: this.onePage.page,
          size: this.onePage.size
        });
        this.oneRows = data.result || [];
        this.oneTotal = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      } finally {
        this.oneLoading = false;
      }
    },
    onOneSize(s) {
      this.onePage.size = s;
      this.loadOne(1);
    },
    onOneCurrentChange({ row }) {
      this.oneCurrent = row;
    },
    openOneAdd() {
      this.oneEditMode = false;
      this.resetOneForm();
      this.oneDialog = true;
    },
    openOneEdit() {
      if (!this.oneCurrent) {
        this.$message.warning('请先选中要编辑的行');
        return;
      }
      this.oneEditMode = true;
      this.oneForm = {
        id: String(this.oneCurrent.ID ?? ''),
        HIS_DEPT_CODE: this.oneCurrent.HIS_DEPT_CODE || '',
        HIS_DEPT_NAME: this.oneCurrent.HIS_DEPT_NAME || '',
        DEPT_ONE_CODE: this.oneCurrent.DEPT_ONE_CODE || ''
      };
      this.oneDialog = true;
    },
    resetOneForm() {
      this.oneForm = { id: '', HIS_DEPT_CODE: '', HIS_DEPT_NAME: '', DEPT_ONE_CODE: '' };
      this.$nextTick(() => this.$refs.oneFormRef && this.$refs.oneFormRef.clearValidate());
    },
    submitOne() {
      this.$refs.oneFormRef.validate(async (valid) => {
        if (!valid) return;
        this.oneSaving = true;
        try {
          if (this.oneEditMode) {
            await upHerpOneDeptInfo(this.oneForm);
          } else {
            await addHerpOneDeptInfo(this.oneForm);
          }
          this.$message.success('操作成功');
          this.oneDialog = false;
          this.loadOne(this.onePage.page);
        } catch (e) {
          this.$message.error(e.message || '操作失败');
        } finally {
          this.oneSaving = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.herp-jf-dept {
  padding: 12px;
}
.block-card {
  width: 100%;
}
.card-head {
  font-weight: 600;
}
.toolbar {
  margin-bottom: 8px;
}
.inline-upload {
  display: inline-block;
  margin: 0 8px;
  vertical-align: middle;
}
.pager {
  margin-top: 12px;
  text-align: right;
}
</style>
