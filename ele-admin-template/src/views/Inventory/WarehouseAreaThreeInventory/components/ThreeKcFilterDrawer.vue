<template>
  <el-drawer
    title="三级库计费编码过滤配置"
    :visible.sync="visibleSync"
    direction="rtl"
    size="min(1100px, 96vw)"
    append-to-body
    custom-class="three-kc-filter-drawer"
    @open="onOpen"
  >
    <div class="filter-drawer-content">
      <el-form
        size="mini"
        :inline="true"
        class="filter-query"
        @submit.native.prevent="search"
      >
        <el-form-item label="编码 / 备注">
          <el-input
            v-model="keyword"
            clearable
            placeholder="输入计费编码或过滤备注"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item label="过滤开关">
          <el-select v-model="enabled" class="filter-enabled-select">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="loading"
            :disabled="busy"
            @click="search"
            >查询</el-button
          >
          <el-button
            type="success"
            icon="el-icon-plus"
            :disabled="loading || busy"
            @click="editConfig()"
            >新增配置</el-button
          >
          
          <input
            ref="importFile"
            type="file"
            accept=".xls,.xlsx"
            style="display: none"
            @change="importConfigs"
          />
          <span v-if="importStatus" class="filter-import-status" aria-live="polite">
            {{ importStatus }}
          </span>
        </el-form-item>
        <el-form-item>
          <el-popover placement="bottom" trigger="hover" width="180">
            <el-button type="text" icon="el-icon-download" @click="downloadTemplate">
              下载导入模板
            </el-button>
            <el-button
              slot="reference"
              type="primary"
              icon="el-icon-upload2"
              :loading="importing"
              :disabled="loading || busy"
              @click="$refs.importFile.click()"
              >导入</el-button
            >
          </el-popover>
        </el-form-item>
      </el-form>
      <div class="filter-config-table-wrap">
        <vxe-table
          :loading="loading"
          :data="rows"
          border
          stripe
          size="mini"
          height="100%"
          show-overflow
          :row-config="{ keyField: 'ID', isHover: true }"
          :column-config="{ resizable: true }"
          empty-text="暂无过滤配置"
        >
          <vxe-column
            field="CHARGE_CODE"
            title="计费编码"
            width="150"
          />
          <vxe-column field="IS_ENABLED" title="过滤开关" width="105" align="center">
            <template #default="{ row }">
              <el-switch
                :value="row.IS_ENABLED"
                active-value="1"
                inactive-value="0"
                :disabled="saving || importing || loading || savingIds.includes(row.ID)"
                :aria-label="`${row.CHARGE_CODE}的过滤开关`"
                @change="toggleEnabled(row, $event)"
              />
            </template>
          </vxe-column>
          <vxe-column
            field="REMARK"
            title="过滤备注 / 删除原因"
            min-width="220"
          />
          <vxe-column
            field="CREATE_BY"
            title="创建人"
            width="100"
          />
          <vxe-column field="CREATE_TIME" title="创建时间" width="155" />
          <vxe-column
            field="UPDATE_BY"
            title="修改人"
            width="100"
          />
          <vxe-column field="UPDATE_TIME" title="修改时间" width="155" />
          <vxe-column
            title="操作"
            fixed="right"
            width="110"
            align="center"
          >
            <template #default="{ row }">
              <el-button
                type="text"
                size="mini"
                :disabled="busy || loading"
                @click="editConfig(row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                class="filter-delete-button"
                :disabled="busy || loading"
                @click="removeConfig(row)"
                >删除</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <el-pagination
        class="filter-config-pager"
        :current-page="page"
        :page-size="size"
        :page-sizes="[20, 50, 100]"
        :total="total"
        :disabled="loading || busy"
        layout="total, sizes, prev, pager, next"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>
    <el-dialog
      :title="form.ID ? '编辑过滤配置' : '新增过滤配置'"
      :visible.sync="formVisible"
      width="min(520px, 92vw)"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="!saving"
      :show-close="!saving"
    >
      <el-form
        ref="configForm"
        :model="form"
        :rules="rules"
        label-width="90px"
        size="small"
        @submit.native.prevent
      >
        <el-form-item label="计费编码" prop="CHARGE_CODE">
          <el-input
            v-model="form.CHARGE_CODE"
            maxlength="255"
            :disabled="saving"
            placeholder="请输入完整计费编码"
          />
        </el-form-item>
        <el-form-item label="过滤开关" prop="IS_ENABLED">
          <el-switch
            v-model="form.IS_ENABLED"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :disabled="saving"
          />
        </el-form-item>
        <el-form-item label="过滤备注" prop="REMARK">
          <el-input
            v-model="form.REMARK"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            :disabled="saving"
            placeholder="执行时保存为删除备注；留空则自动生成原因"
          />
          <div class="filter-form-note">最多500字节，中文通常占3字节。</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" :disabled="saving" @click="formVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          :loading="saving"
          @click="saveConfig"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
  import * as XLSX from 'xlsx';
  import { parseFilterImportRows } from './filterImport';
  import {
    queryThreeKcFilterConfigs,
    saveThreeKcFilterConfig,
    setThreeKcFilterConfigEnabled,
    deleteThreeKcFilterConfig,
    importThreeKcFilterConfigs,
    downloadThreeKcFilterTemplate
  } from '@/api/Inventory/WarehouseAreaThreeInventory';

  const emptyForm = () => ({
    ID: '',
    CHARGE_CODE: '',
    IS_ENABLED: '0',
    REMARK: ''
  });
  const byteLength = (value) => new Blob([String(value || '').trim()]).size;

  export default {
    name: 'ThreeKcFilterDrawer',
    props: { visible: Boolean },
    data() {
      return {
        rows: [],
        keyword: '',
        enabled: '',
        page: 1,
        size: 20,
        total: 0,
        loading: false,
        loadVersion: 0,
        savingIds: [],
        saving: false,
        importing: false,
        importStatus: '',
        formVisible: false,
        form: emptyForm(),
        rules: {
          CHARGE_CODE: [
            {
              validator: (rule, value, done) => {
                if (!String(value || '').trim())
                  return done(new Error('请输入计费编码'));
                if (byteLength(value) > 255)
                  return done(new Error('计费编码不能超过255字节'));
                done();
              },
              trigger: 'blur'
            }
          ],
          REMARK: [
            {
              validator: (rule, value, done) => {
                done(
                  byteLength(value) > 500
                    ? new Error('过滤备注不能超过500字节')
                    : undefined
                );
              },
              trigger: 'blur'
            }
          ]
        }
      };
    },
    computed: {
      visibleSync: {
        get() {
          return this.visible;
        },
        set(value) {
          this.$emit('update:visible', value);
        }
      },
      busy() {
        return this.saving || this.importing || this.savingIds.length > 0;
      }
    },
    methods: {
      async downloadTemplate() {
        try {
          const response = await downloadThreeKcFilterTemplate();
          const binary = atob(response.result);
          const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
          const url = URL.createObjectURL(new Blob([bytes], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }));
          const link = document.createElement('a');
          link.href = url;
          link.download = '三级库计费编码过滤配置导入模板.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
          this.$message.error(error.message || '下载模板失败');
        }
      },
      async importConfigs(event) {
        const file = event.target.files && event.target.files[0];
        event.target.value = '';
        if (!file || this.busy) return;
        this.importing = true;
        let imported = 0;
        let skipped = 0;
        let total = 0;
        this.importStatus = '正在读取文件';
        try {
          if (!/\.xlsx?$/i.test(file.name)) throw new Error('请选择Excel文件');
          const buffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsArrayBuffer(file);
          });
          const workbook = XLSX.read(buffer, { type: 'array' });
          if (!workbook.SheetNames.length) throw new Error('Excel没有工作表');
          const sheetRows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
            header: 1, raw: false, defval: '', blankrows: true
          });
          const rows = parseFilterImportRows(sheetRows);
          total = rows.length;
          for (let index = 0; index < rows.length; index += 100) {
            const response = await importThreeKcFilterConfigs(rows.slice(index, index + 100));
            imported += response.result.ImportedCount;
            skipped += response.result.SkippedCount;
            this.importStatus = `已处理 ${imported + skipped}/${total}，导入 ${imported}，跳过重复 ${skipped}`;
          }
          this.$message.success(`导入完成：新增${imported}条，跳过重复${skipped}条`);
        } catch (error) {
          this.importStatus = total
            ? `导入中断：已处理 ${imported + skipped}/${total}，导入 ${imported}，跳过重复 ${skipped}`
            : '';
          this.$message.error(error.message || '导入失败');
        } finally {
          if (imported) await this.loadConfigs();
          this.importing = false;
        }
      },
      onOpen() {
        this.page = 1;
        this.loadConfigs();
      },
      search() {
        this.page = 1;
        this.loadConfigs();
      },
      onPageChange(page) {
        this.page = page;
        this.loadConfigs();
      },
      onSizeChange(size) {
        this.size = size;
        this.search();
      },
      async loadConfigs() {
        const version = ++this.loadVersion;
        this.loading = true;
        try {
          const result = await queryThreeKcFilterConfigs(
            { keyword: this.keyword, IS_ENABLED: this.enabled },
            this.page,
            this.size
          );
          if (version !== this.loadVersion) return;
          this.rows = result.result || [];
          this.total = result.total || 0;
        } catch (error) {
          if (version !== this.loadVersion) return;
          this.rows = [];
          this.total = 0;
          this.$message.error(error.message || '查询过滤配置失败');
        } finally {
          if (version === this.loadVersion) this.loading = false;
        }
      },
      editConfig(row) {
        this.form = row
          ? {
              ID: row.ID,
              CHARGE_CODE: row.CHARGE_CODE,
              IS_ENABLED: row.IS_ENABLED,
              REMARK: row.REMARK || ''
            }
          : emptyForm();
        this.formVisible = true;
        this.$nextTick(() => this.$refs.configForm?.clearValidate());
      },
      async saveConfig() {
        if (this.saving) return;
        const valid = await this.$refs.configForm.validate().catch(() => false);
        if (!valid || this.saving) return;
        this.saving = true;
        try {
          await saveThreeKcFilterConfig({
            ...this.form,
            CHARGE_CODE: this.form.CHARGE_CODE.trim(),
            REMARK: this.form.REMARK.trim()
          });
          this.formVisible = false;
          this.$message.success('保存成功');
          await this.loadConfigs();
        } catch (error) {
          this.$message.error(error.message || '保存失败');
        } finally {
          this.saving = false;
        }
      },
      async toggleEnabled(row, value) {
        if (this.saving || this.importing || this.savingIds.includes(row.ID)) return;
        this.savingIds.push(row.ID);
        try {
          await setThreeKcFilterConfigEnabled(row.ID, value);
          row.IS_ENABLED = value;
          this.$message.success(
            value === '1' ? '已启用过滤' : '已停用过滤，历史标删数据保持不变'
          );
        } catch (error) {
          this.$message.error(error.message || '开关保存失败');
        } finally {
          this.savingIds = this.savingIds.filter((id) => id !== row.ID);
        }
      },
      async removeConfig(row) {
        if (this.savingIds.length || this.saving) return;
        try {
          await this.$confirm(
            `确定删除计费编码“${row.CHARGE_CODE}”的过滤配置？已标删数据不会恢复。`,
            '删除过滤配置',
            { type: 'warning' }
          );
        } catch (error) {
          return;
        }
        this.savingIds.push(row.ID);
        try {
          await deleteThreeKcFilterConfig(row.ID);
          this.$message.success('配置已删除');
          if (this.rows.length === 1 && this.page > 1) this.page -= 1;
          await this.loadConfigs();
        } catch (error) {
          this.$message.error(error.message || '删除配置失败');
        } finally {
          this.savingIds = this.savingIds.filter((id) => id !== row.ID);
        }
      }
    }
  };
</script>

<style scoped>
  .filter-drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
  .filter-query {
    flex: none;
    margin-top: 16px;
  }
  .filter-enabled-select {
    width: 100px;
  }
  .filter-import-status {
    margin-left: 8px;
    font-size: 12px;
    color: #606266;
  }
  .filter-config-table-wrap {
    flex: 1;
    min-height: 0;
  }
  .filter-config-pager {
    flex: none;
    margin-top: 16px;
    overflow-x: auto;
  }
  .filter-form-note {
    font-size: 12px;
    color: #606266;
  }
  .filter-delete-button {
    color: #f56c6c;
  }
</style>

<style>
  .three-kc-filter-drawer .el-drawer__body {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
</style>
