<template>
  <div class="manufacturing-maintain ele-body-small">
    <el-card shadow="never" class="block-card">
      <div slot="header" class="card-head">生产企业维护</div>
      <el-form :inline="true" size="small" class="toolbar" @submit.native.prevent>
        <el-form-item label="生产企业名称">
          <el-input
            v-model="query.name"
            clearable
            placeholder="生产企业名称"
            style="width: 200px"
            @keyup.enter.native="load(1)"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="query.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="width: 140px"
            clearable
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="query.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            style="width: 140px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="load(1)">查询</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="openAdd">新增</el-button>
          <el-button type="primary" plain icon="el-icon-edit" @click="openEdit">修改</el-button>
          <el-button type="danger" plain icon="el-icon-delete" @click="onDelete">删除</el-button>
          <el-button plain icon="el-icon-download" @click="onExport">导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="table"
        v-loading="loading"
        :data="rows"
        border
        stripe
        height="calc(100vh - 280px)"
        @selection-change="(s) => (selected = s)"
      >
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column prop="MANUFACTURING_ENT_NAME" label="生产企业名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="MANUFACTURING_LICENSE" label="生产许可证号" min-width="140" show-overflow-tooltip />
        <el-table-column prop="LICENSE_VALID" label="营业执照效期" width="120" show-overflow-tooltip />
        <el-table-column prop="MANUFACTURING_NUMBER" label="生产商号" width="120" show-overflow-tooltip />
        <el-table-column label="许可证有效期" width="120">
          <template slot-scope="{ row }">{{ fmtDate(row.MANUFACTURING_LICENSE_TIME) }}</template>
        </el-table-column>
        <el-table-column prop="MANUFACTURING_ADDRES" label="生产企业地址" min-width="160" show-overflow-tooltip />
        <el-table-column prop="CREATE_MAN" label="创建人" width="100" show-overflow-tooltip />
        <el-table-column label="更新时间" width="160">
          <template slot-scope="{ row }">{{ fmtDateTime(row.UPDATE_TIME) }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        :page-size="page.size"
        :current-page="page.page"
        :page-sizes="[20, 40, 60, 90, 150, 300, 1000, 3000]"
        @size-change="onSize"
        @current-change="load"
      />
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="560px"
      append-to-body
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" label-width="200px" size="small">
        <el-form-item label="生产企业名称" prop="MANUFACTURING_ENT_NAME" :rules="[{ required: true, message: '必填' }]">
          <el-input v-model="form.MANUFACTURING_ENT_NAME" />
        </el-form-item>
        <el-form-item label="生产许可证号">
          <el-input v-model="form.MANUFACTURING_LICENSE" />
        </el-form-item>
        <el-form-item label="营业执照效期">
          <el-input v-model="form.LICENSE_VALID" />
        </el-form-item>
        <el-form-item label="许可证有效期">
          <el-date-picker
            v-model="form.MANUFACTURING_LICENSE_TIME"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="生产商号（医院HRP系统编码）">
          <el-input v-model="form.MANUFACTURING_NUMBER" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.MANUFACTURING_ADDRES" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="是否同步修改注册证">
          <el-select v-model="form.isUpPro" style="width: 100%">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import {
  getManufacturingList,
  insertManufacturingEnt,
  updateManufacturingEnt,
  deleteManufacturingEnt
} from '@/api/Home/ManufacturingMaintain';

const emptyForm = () => ({
  ID: '',
  MANUFACTURING_ENT_NAME: '',
  MANUFACTURING_LICENSE: '',
  LICENSE_VALID: '',
  MANUFACTURING_LICENSE_TIME: '',
  MANUFACTURING_NUMBER: '',
  MANUFACTURING_ADDRES: '',
  isUpPro: '1'
});

export default {
  name: 'ManufacturingMaintain',
  data() {
    return {
      loading: false,
      saving: false,
      rows: [],
      selected: [],
      total: 0,
      page: { page: 1, size: 20 },
      query: { name: '', startTime: '', endTime: '' },
      dialogVisible: false,
      isEdit: false,
      form: emptyForm()
    };
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑生产企业' : '新增生产企业';
    },
    createMan() {
      return this.$store.state.user?.info?.Nickname || '';
    }
  },
  created() {
    this.load(1);
  },
  methods: {
    fmtDate(v) {
      if (v == null || v === '') return '';
      return String(v).replace('T', ' ').slice(0, 10);
    },
    fmtDateTime(v) {
      if (v == null || v === '') return '';
      return String(v).replace('T', ' ').slice(0, 19);
    },
    async load(page) {
      if (page) this.page.page = page;
      this.loading = true;
      try {
        const data = await getManufacturingList({
          MANUFACTURING_ENT_NAME: this.query.name,
          startTime: this.query.startTime || '',
          endTime: this.query.endTime || '',
          page: this.page.page,
          size: this.page.size
        });
        this.rows = data.result || [];
        this.total = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '查询失败');
      } finally {
        this.loading = false;
      }
    },
    onSize(size) {
      this.page.size = size;
      this.load(1);
    },
    openAdd() {
      this.isEdit = false;
      this.form = emptyForm();
      this.dialogVisible = true;
    },
    openEdit() {
      if (this.selected.length !== 1) {
        this.$message.warning(this.selected.length ? '编辑请勾选一行数据' : '请至少选中一行数据');
        return;
      }
      const row = this.selected[0];
      this.isEdit = true;
      this.form = {
        ID: row.ID,
        MANUFACTURING_ENT_NAME: row.MANUFACTURING_ENT_NAME || '',
        MANUFACTURING_LICENSE: row.MANUFACTURING_LICENSE || '',
        LICENSE_VALID: row.LICENSE_VALID || '',
        MANUFACTURING_LICENSE_TIME: this.fmtDate(row.MANUFACTURING_LICENSE_TIME),
        MANUFACTURING_NUMBER: row.MANUFACTURING_NUMBER || '',
        MANUFACTURING_ADDRES: row.MANUFACTURING_ADDRES || '',
        isUpPro: '1'
      };
      this.dialogVisible = true;
    },
    resetForm() {
      this.$refs.formRef?.resetFields();
      this.form = emptyForm();
    },
    async submitForm() {
      try {
        await this.$refs.formRef.validate();
      } catch {
        return;
      }
      const payload = {
        ...this.form,
        CREATE_MAN: this.createMan
      };
      this.saving = true;
      try {
        if (this.isEdit) {
          await updateManufacturingEnt(payload);
          this.$message.success('修改成功');
        } else {
          await insertManufacturingEnt(payload);
          this.$message.success('新增成功');
        }
        this.dialogVisible = false;
        this.load(this.page.page);
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    async onDelete() {
      if (this.selected.length !== 1) {
        this.$message.warning(this.selected.length ? '删除请勾选一行数据' : '请至少选中一行数据');
        return;
      }
      const row = this.selected[0];
      try {
        await this.$confirm(`确定删除生产企业：${row.MANUFACTURING_ENT_NAME} 吗？`, '提示', {
          type: 'warning'
        });
      } catch {
        return;
      }
      try {
        await deleteManufacturingEnt({ ID: row.ID, CREATE_MAN: this.createMan });
        this.$message.success('删除成功');
        this.load(this.page.page);
      } catch (e) {
        this.$message.error(e.message || '删除失败');
      }
    },
    async onExport() {
      const loading = this.$loading({ lock: true, text: '导出中…' });
      try {
        const data = await getManufacturingList({
          MANUFACTURING_ENT_NAME: this.query.name,
          startTime: this.query.startTime || '',
          endTime: this.query.endTime || '',
          page: 1,
          size: 999999
        });
        const header = [
          '生产企业名称',
          '生产许可证号',
          '许可证有效期',
          '生产企业地址',
          '营业执照效期',
          '生产商号',
          '创建人',
          '更新时间'
        ];
        const sheetData = [header];
        (data.result || []).forEach((d) => {
          sheetData.push([
            d.MANUFACTURING_ENT_NAME,
            d.MANUFACTURING_LICENSE,
            this.fmtDate(d.MANUFACTURING_LICENSE_TIME),
            d.MANUFACTURING_ADDRES,
            d.LICENSE_VALID,
            d.MANUFACTURING_NUMBER,
            d.CREATE_MAN,
            this.fmtDateTime(d.UPDATE_TIME)
          ]);
        });
        const sheet = utils.aoa_to_sheet(sheetData);
        sheet['!cols'] = [{ wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 24 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 20 }];
        writeFile({ SheetNames: ['生产企业'], Sheets: { 生产企业: sheet } }, '生产企业.xlsx');
      } catch (e) {
        this.$message.error(e.message || '导出失败');
      } finally {
        loading.close();
      }
    }
  }
};
</script>

<style scoped>
.manufacturing-maintain {
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
.pager {
  margin-top: 12px;
  text-align: right;
}
</style>
