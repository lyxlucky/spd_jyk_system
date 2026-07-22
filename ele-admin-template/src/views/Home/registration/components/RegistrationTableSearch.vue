<template>
  <div>
    <el-form class="ele-form-search" @submit.native.prevent>
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input
              size="mini"
              v-model="where.registrationNo"
              placeholder="请输入注册证"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input
              size="mini"
              v-model="where.manufacture"
              placeholder="请输入生产企业"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-select size="mini" v-model="where.isEnable" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="String(item.value)"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="registration-toolbar">
            <el-button size="mini" icon="el-icon-search" type="primary" @click="handleSearch">
              查询
            </el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">
              添加注册证
            </el-button>
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="handleRegistrationExport"
            >
              导出产品注册证
            </el-button>
            <el-button type="primary" icon="el-icon-upload" size="mini" @click="triggerImport">
              导入注册证
            </el-button>
            <input
              ref="importFile"
              type="file"
              accept=".xls,.xlsx"
              style="display: none"
              @change="onImportFileChange"
            />
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdateField">
              更新选定字段
            </el-button>
            <!-- 老系统：无「禁用注册证编辑」时始终显示，选中行后切换文案 -->
            <el-button
              v-if="canEditProd"
              type="primary"
              size="mini"
              :style="{ backgroundColor: enableBtnBg, borderColor: enableBtnBg }"
              @click="handleToggleEnable"
            >
              {{ enableBtnText }}
            </el-button>
            <el-button type="primary" icon="el-icon-camera" size="mini" @click="handleExpire">
              查看即将过期和已过期注册证
            </el-button>
            <el-button type="info" icon="el-icon-s-grid" size="mini" @click="handleUpLog">
              修改日志
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleItemDelete">
              剔除
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RegistrationTableSearch',
  props: {
    /** 当前选中行，用于启用/停用按钮文案 */
    currentRow: {
      type: Object,
      default: null
    },
    canEditProd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const defaultWhere = {
      registrationNo: '',
      manufacture: '',
      isEnable: '1'
    };
    return {
      where: { ...defaultWhere },
      options: [
        { value: '1', label: '启用' },
        { value: '', label: '全部' },
        { value: '0', label: '停用' }
      ]
    };
  },
  computed: {
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    isCurrentDisabled() {
      const e = this.currentRow?.ENABLE;
      return e === '0' || e === 0 || e === '停用';
    },
    enableBtnText() {
      return this.isCurrentDisabled ? '启用产品注册证' : '停用产品注册证';
    },
    enableBtnBg() {
      return this.isCurrentDisabled ? '#009688' : '#2177e0';
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', { ...this.where });
    },
    handleRegistrationExport() {
      this.$emit('registrationExport', { ...this.where });
    },
    handleItemDelete() {
      this.$emit('itemDelete', { ...this.where });
    },
    handleAdd() {
      this.$emit('add');
    },
    triggerImport() {
      if (this.$refs.importFile) {
        this.$refs.importFile.value = '';
        this.$refs.importFile.click();
      }
    },
    onImportFileChange(e) {
      const file = e.target.files?.[0];
      if (file) this.$emit('import', file);
    },
    handleUpdateField() {
      this.$emit('updateField');
    },
    handleToggleEnable() {
      if (!this.currentRow?.PROD_REGISTRATION_CODE) {
        this.$message.warning('请先选择一条注册证产品');
        return;
      }
      this.$emit('toggleEnable', this.currentRow);
    },
    handleExpire() {
      this.$emit('expire');
    },
    handleUpLog() {
      this.$emit('upLog');
    }
  }
};
</script>
<style scoped>
.registration-toolbar >>> .el-form-item__content {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 0;
}
</style>
