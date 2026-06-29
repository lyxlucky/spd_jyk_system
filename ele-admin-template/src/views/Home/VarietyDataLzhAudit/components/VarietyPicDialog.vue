<template>
  <el-dialog
    title="品种图片"
    :visible.sync="innerVisible"
    width="96%"
    top="4vh"
    append-to-body
    :close-on-click-modal="false"
    custom-class="variety-pic-dialog"
    @open="onOpen"
    :before-close="handleBeforeClose"
    @closed="onClosed"
  >
    <div v-loading="loading" class="spd-panel spd-table-panel">
      <div class="upload-panel">
        <div class="upload-panel__title">上传图片</div>
        <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadRules" size="mini" label-width="96px" inline>
          <el-form-item label="选择文件" prop="file">
            <el-upload
              ref="uploadRef"
              action="#"
              :auto-upload="false"
              :limit="1"
              :on-change="onFileChange"
              :on-remove="onFileRemove"
              accept=".jpg,.jpeg,.png,.pdf"
            >
              <el-button size="mini" type="primary" plain>选择文件</el-button>
              <span slot="tip" class="upload-tip">支持 jpg / png / pdf</span>
            </el-upload>
          </el-form-item>
          <el-form-item label="图片类型" prop="type">
            <el-select v-model="uploadForm.type" placeholder="请选择" style="width: 160px">
              <el-option v-for="opt in picTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="同注册证" prop="tbState">
            <el-select v-model="uploadForm.tbState" style="width: 120px">
              <el-option label="同步" value="1" />
              <el-option label="不同步" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="needDateRange" label="起始时间" prop="startTime">
            <el-date-picker
              v-model="uploadForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="起始日期"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item v-if="needDateRange" label="结束时间" prop="endTime">
            <el-date-picker
              v-model="uploadForm.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="说明" prop="remark">
            <el-input v-model="uploadForm.remark" placeholder="备注说明" style="width: 220px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" :loading="uploading" @click="submitUpload">立即上传</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="spd-panel__body spd-table-panel__wrap">
        <ele-pro-table
          ref="table"
          size="mini"
          :stripe="true"
          height="calc(75vh - 220px)"
          :page-size="30"
          :page-sizes="[30, 50, 100, 150, 200, 300, 99999]"
          :columns="columns"
          :datasource="datasource"
          cache-key="varietyPicDialogTable"
        >
          <template v-slot:type="{ row }">
            {{ picTypeLabel(row.TYPE) }}
          </template>
          <template v-slot:picUrl="{ row }">
            <div v-if="row.PIC_URL" class="pic-cell" v-viewer>
              <img
                v-if="!isPdf(row.PIC_URL)"
                class="pic-thumb"
                :src="picFullUrl(row.PIC_URL)"
                alt=""
              />
              <el-link v-else type="primary" :underline="false" @click="openPdf(row.PIC_URL)">
                pdf 文件
              </el-link>
            </div>
          </template>
          <template v-slot:state="{ row }">
            <el-tag v-if="row.STATE == '0' || row.STATE == 0" type="primary" size="mini">新增</el-tag>
            <el-tag v-else-if="row.STATE == '1' || row.STATE == 1" type="success" size="mini">已审批</el-tag>
            <el-tag v-else-if="row.STATE == '2' || row.STATE == 2" type="danger" size="mini">审批未通过</el-tag>
            <span v-else>{{ row.STATE }}</span>
          </template>
        </ele-pro-table>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { BACK_BASE_URL } from '@/config/setting';
import { getVarPicList, uploadVarPic } from '@/api/Inventory/picVarCode';
import { PIC_TYPE_LABELS, picTypeLabel } from '@/utils/aiReviewDisplay';
import { cleanupDialogOverlays } from '../utils';

const UPLOAD_PIC_TYPES = ['1', '2', '3', '4', '5', '6'];
const DATE_REQUIRED_TYPES = new Set(['1', '4', '5']);

function defaultUploadForm() {
  return {
    file: null,
    type: '',
    tbState: '0',
    remark: '',
    startTime: '0001-01-01',
    endTime: '9999-01-01'
  };
}

export default {
  name: 'VarietyPicDialog',
  props: {
    visible: { type: Boolean, default: false },
    row: { type: Object, default: null }
  },
  data() {
    const validateFile = (_rule, _value, callback) => {
      if (!this.uploadForm.file) {
        callback(new Error('请选择文件'));
        return;
      }
      callback();
    };
    return {
      loading: false,
      uploading: false,
      loadSeq: 0,
      uploadForm: defaultUploadForm(),
      uploadRules: {
        file: [{ validator: validateFile, trigger: 'change' }],
        type: [{ required: true, message: '请选择图片类型', trigger: 'change' }],
        tbState: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      picTypeOptions: UPLOAD_PIC_TYPES.map((value) => ({
        value,
        label: PIC_TYPE_LABELS[value] || value
      })),
      columns: [
        { type: 'index', label: '序号', width: 55, align: 'center', fixed: 'left' },
        { slot: 'type', prop: 'TYPE', label: '类型', width: 110, align: 'center' },
        { prop: 'VARIETIE_CODE_NEW', label: '品种编码', width: 120, showOverflowTooltip: true },
        { prop: 'VARIETIE_NAME', label: '品种名称', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SPECIFICATION_OR_TYPE', label: '规格型号', minWidth: 120, showOverflowTooltip: true },
        { prop: 'APPROVAL_NUMBER', label: '注册证', minWidth: 120, showOverflowTooltip: true },
        { prop: 'MANUFACTURING_ENT_NAME', label: '生产企业', minWidth: 140, showOverflowTooltip: true },
        { prop: 'SUPPLIER_NAME', label: '供应商名称', minWidth: 140, showOverflowTooltip: true },
        { slot: 'picUrl', label: '图片', width: 120, align: 'center' },
        { prop: 'REMARK', label: '备注/说明', minWidth: 100, showOverflowTooltip: true },
        { slot: 'state', label: '状态', width: 96, align: 'center' },
        {
          prop: 'CREATE_TIME',
          label: '创建时间',
          width: 155,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '')
        },
        { prop: 'APP_MAN', label: '审批人', width: 90, showOverflowTooltip: true },
        {
          prop: 'APP_TIME',
          label: '审批时间',
          width: 155,
          showOverflowTooltip: true,
          formatter: (_r, _c, v) => (v ? String(v).replace('T', ' ').substring(0, 19) : '')
        }
      ]
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    },
    needDateRange() {
      return DATE_REQUIRED_TYPES.has(String(this.uploadForm.type || ''));
    }
  },
  beforeDestroy() {
    this.loadSeq += 1;
    this.loading = false;
    this.uploading = false;
    cleanupDialogOverlays();
  },
  methods: {
    picTypeLabel,
    resetUploadForm() {
      this.uploadForm = defaultUploadForm();
      this.$refs.uploadRef?.clearFiles?.();
      this.$nextTick(() => this.$refs.uploadFormRef?.clearValidate?.());
    },
    onFileChange(file) {
      this.uploadForm.file = file?.raw || null;
      this.$refs.uploadFormRef?.validateField?.('file');
    },
    onFileRemove() {
      this.uploadForm.file = null;
    },
    handleBeforeClose(done) {
      this.loadSeq += 1;
      this.loading = false;
      this.uploading = false;
      done();
    },
    onOpen() {
      this.resetUploadForm();
      this.$nextTick(() => this.reload());
    },
    reload() {
      this.$refs.table?.reload?.({ page: 1 });
    },
    picFullUrl(path) {
      if (!path) return '';
      if (/^https?:\/\//i.test(path)) return path;
      const base = (BACK_BASE_URL || '').replace(/\/$/, '');
      return `${base}/Upload/ProPic/${path}`;
    },
    isPdf(path) {
      return String(path || '').toLowerCase().includes('pdf');
    },
    openPdf(path) {
      window.open(this.picFullUrl(path));
    },
    async submitUpload() {
      if (!this.row?.Varietie_Code) {
        this.$message.warning('缺少品种信息');
        return;
      }
      const valid = await new Promise((resolve) => {
        this.$refs.uploadFormRef?.validate((ok) => resolve(ok));
      });
      if (!valid) return;
      if (this.needDateRange) {
        if (!this.uploadForm.startTime || !this.uploadForm.endTime) {
          this.$message.warning('请填写起始/结束时间');
          return;
        }
      }
      this.uploading = true;
      try {
        const res = await uploadVarPic({
          varietieCode: this.row.Varietie_Code,
          prodRegistrationCode:
            this.row.Prod_Registration_Code != null ? String(this.row.Prod_Registration_Code) : '',
          type: this.uploadForm.type,
          tbState: this.uploadForm.tbState,
          remark: this.uploadForm.remark,
          startTime: this.uploadForm.startTime,
          endTime: this.uploadForm.endTime,
          file: this.uploadForm.file
        });
        this.$message.success(res.msg || '上传成功');
        this.resetUploadForm();
        this.reload();
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.uploading = false;
      }
    },
    async datasource({ page, limit }) {
      if (!this.row?.Varietie_Code) {
        return { list: [], count: 0 };
      }
      const seq = this.loadSeq;
      this.loading = true;
      try {
        const res = await getVarPicList({
          page,
          limit,
          where: {
            varietieCode: this.row.Varietie_Code,
            prodRegistrationCode:
              this.row.Prod_Registration_Code != null ? String(this.row.Prod_Registration_Code) : '',
            isUse: '1'
          }
        });
        if (seq !== this.loadSeq) {
          return { list: [], count: 0 };
        }
        return { list: res.result || [], count: res.total || 0 };
      } finally {
        if (seq === this.loadSeq) {
          this.loading = false;
        }
      }
    },
    onClosed() {
      this.loadSeq += 1;
      this.loading = false;
      this.uploading = false;
      this.resetUploadForm();
      this.$nextTick(() => cleanupDialogOverlays());
      this.$emit('closed');
    }
  }
};
</script>

<style scoped>
.upload-panel {
  margin-bottom: 12px;
  padding: 10px 12px 2px;
  background: #f8fafc;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.upload-panel__title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}
.upload-tip {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}
.pic-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pic-thumb {
  max-width: 80px;
  max-height: 60px;
  cursor: pointer;
  object-fit: contain;
}
</style>

<style>
.variety-pic-dialog .el-dialog__body {
  padding: 8px 12px 16px;
  max-height: calc(90vh - 54px);
  overflow: auto;
}
</style>
