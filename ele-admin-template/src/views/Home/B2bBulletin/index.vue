<template>
  <div class="b2b-bulletin ele-body-small">
    <el-row :gutter="16">
      <el-col :span="7">
        <el-card shadow="hover" class="bulletin-card">
          <div slot="header" class="card-title">通知</div>
          <el-input
            v-model="form.NOTIFICATION_INFORMATION"
            type="textarea"
            :rows="10"
            placeholder="请输入通告信息"
          />
          <div class="card-actions">
            <el-button type="primary" :loading="saving" @click="submitAnnounce">提交更改</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover" class="bulletin-card">
          <div slot="header" class="card-title">通讯录</div>
          <el-form label-width="220px" size="small">
            <el-form-item label="设备科/装备部/供应科：">
              <el-input v-model="form.DEPT_CONTACT" placeholder="请输入供应科" clearable />
            </el-form-item>
            <el-form-item label="SPD项目负责人：">
              <el-input v-model="form.PROJECT_LEADER" placeholder="SPD项目负责人" clearable />
            </el-form-item>
            <el-form-item label="月结管理员：">
              <el-input v-model="form.MONTHLY_SETTLE_MANAGER" placeholder="月结管理员" clearable />
            </el-form-item>
            <el-form-item label="周末骨科验收值班：">
              <el-input v-model="form.WEEKEND_ACCEPTANCE_ONDUTY" placeholder="周末骨科验收值班" clearable />
            </el-form-item>
            <el-form-item label="工作日（早）骨科验收值班：">
              <el-input v-model="form.WORKING_ACCEPTANCE_ONDUTY" placeholder="工作日（早）骨科验收值班" clearable />
            </el-form-item>
            <el-form-item label="耗材仓库地址：">
              <el-input v-model="form.WAREHOUSE_ADDRESS" placeholder="耗材仓库地址" clearable />
            </el-form-item>
          </el-form>
          <div class="card-actions">
            <el-button type="primary" :loading="saving" @click="submitAnnounce">提交更改</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card shadow="hover" class="bulletin-card">
          <div slot="header" class="card-title">月结通告</div>
          <div class="month-img-row">
            <div class="month-img-block">
              <div class="img-label">月结图片1</div>
              <el-upload
                class="upload-block"
                :action="uploadUrl1"
                name="file"
                :data="uploadExtra"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.pdf,.webp,.bmp,.tif"
                :on-success="onImgUploadSuccess"
                :on-error="onUploadError"
              >
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
              <el-image
                v-if="imgUrl1"
                :src="imgUrl1"
                fit="contain"
                class="preview-img"
                :preview-src-list="[imgUrl1]"
              />
            </div>
            <div class="month-img-block">
              <div class="img-label">月结图片2</div>
              <el-upload
                class="upload-block"
                :action="uploadUrl2"
                name="file"
                :data="uploadExtra"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.pdf,.webp,.bmp,.tif"
                :on-success="onImgUploadSuccess"
                :on-error="onUploadError"
              >
                <el-button size="small" type="primary">上传图片</el-button>
              </el-upload>
              <el-image
                v-if="imgUrl2"
                :src="imgUrl2"
                fit="contain"
                class="preview-img"
                :preview-src-list="[imgUrl2]"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="section-card" style="margin-top: 16px">
      <div slot="header">供应商反馈</div>
      <el-form :inline="true" size="small" class="search-bar" @submit.native.prevent>
        <el-form-item label="供应商名称">
          <el-input v-model="feedQuery.SUPPLIER_NAME" clearable placeholder="供应商名称" style="width: 160px" />
        </el-form-item>
        <el-form-item label="回复人">
          <el-input v-model="feedQuery.RESPONDER" clearable placeholder="回复人" style="width: 140px" />
        </el-form-item>
        <el-form-item label="回复日期">
          <el-date-picker
            v-model="feedDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            value-format="yyyy-MM-dd"
            unlink-panels
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadFeedback(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="feedLoading" :data="feedRows" border stripe style="width: 100%">
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="SUPPLIER_NAME" label="供应商名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="FEEDBACK_CONTENT" label="反馈内容" min-width="160" show-overflow-tooltip />
        <el-table-column prop="CREATE_TIME" label="反馈时间" width="160" />
        <el-table-column prop="REPLY" label="回复内容" min-width="140" show-overflow-tooltip />
        <el-table-column prop="RESPONDER" label="回复人" width="100" />
        <el-table-column prop="UPDATE_TIME" label="回复时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="openReply(row)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="feedTotal"
        :page-size="feedPage.size"
        :current-page="feedPage.page"
        :page-sizes="[10, 30, 50, 100]"
        @size-change="onFeedSize"
        @current-change="loadFeedback"
      />
    </el-card>

    <el-card shadow="never" class="section-card" style="margin-top: 16px">
      <div slot="header">供应商附件</div>
      <el-row type="flex" align="middle" :gutter="12" style="margin-bottom: 12px">
        <el-col :span="12">
          <input ref="attFile" type="file" class="file-input" @change="onAttFileChange" />
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button type="primary" size="small" :loading="attUploading" @click="doAttUpload">上传附件</el-button>
          <el-button type="danger" size="small" plain :disabled="!attSelection.length" @click="doAttDelete">剔除</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="attLoading"
        :data="attRows"
        border
        stripe
        style="width: 100%"
        @selection-change="(v) => (attSelection = v)"
      >
        <el-table-column type="selection" width="45" align="center"/>
        <el-table-column type="index" width="50" label="序号" />
        <el-table-column prop="FILENAME" label="文件名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="CREATE_TIME" label="创建时间" width="180" />
      </el-table>
      <el-pagination
        class="pager"
        background
        layout="total, sizes, prev, pager, next"
        :total="attTotal"
        :page-size="attPage.size"
        :current-page="attPage.page"
        :page-sizes="[10, 30, 50, 100]"
        @size-change="onAttSize"
        @current-change="loadAttachments"
      />
    </el-card>

    <el-dialog title="回复内容" :visible.sync="replyVisible" width="520px" append-to-body @closed="replyRow = null">
      <el-input v-model="replyText" type="textarea" :rows="10" placeholder="请输入回复" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyVisible = false">取 消</el-button>
        <el-button type="primary" :loading="replySaving" @click="submitReply">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BACK_BASE_URL } from '@/config/setting';
import {
  getAnnounceInfo,
  upAnnounceInfo,
  getFeedbackInfo,
  upFeedBackReply,
  getSuppAttachmentInfo,
  delSuppAttachmentInfo,
  uploadSuppAttachment,
  buildAnnounceImageUploadUrl,
  getAnnounceUploadData
} from '@/api/Home/B2bBulletin';

export default {
  name: 'B2bBulletin',
  data() {
    return {
      announceId: '',
      form: {
        NOTIFICATION_INFORMATION: '',
        DEPT_CONTACT: '',
        PROJECT_LEADER: '',
        MONTHLY_SETTLE_MANAGER: '',
        WEEKEND_ACCEPTANCE_ONDUTY: '',
        WORKING_ACCEPTANCE_ONDUTY: '',
        WAREHOUSE_ADDRESS: ''
      },
      imgUrl1: '',
      imgUrl2: '',
      saving: false,
      feedLoading: false,
      feedRows: [],
      feedTotal: 0,
      feedPage: { page: 1, size: 10 },
      feedQuery: { SUPPLIER_NAME: '', RESPONDER: '' },
      feedDateRange: null,
      attLoading: false,
      attRows: [],
      attTotal: 0,
      attPage: { page: 1, size: 10 },
      attSelection: [],
      attUploading: false,
      replyVisible: false,
      replyRow: null,
      replyText: '',
      replySaving: false
    };
  },
  computed: {
    ...mapState('user', {
      userInfo: (state) => state.info
    }),
    uploadUrl1() {
      return buildAnnounceImageUploadUrl(1);
    },
    uploadUrl2() {
      return buildAnnounceImageUploadUrl(2);
    },
    uploadExtra() {
      return getAnnounceUploadData(this.announceId);
    },
    responderName() {
      const u = this.userInfo || {};
      return u.Nickname || u.USER_NAME || u.username || u.User_Name || '';
    }
  },
  created() {
    this.bootstrap();
  },
  methods: {
    announceBase() {
      return (BACK_BASE_URL || '').replace(/\/$/, '');
    },
    async bootstrap() {
      try {
        await this.loadAnnounce();
        await this.loadFeedback(1);
        await this.loadAttachments(1);
      } catch (e) {
        this.$message.error(e.message || '加载失败');
      }
    },
    async loadAnnounce() {
      const data = await getAnnounceInfo();
      const row = (data.result && data.result[0]) || {};
      this.announceId = row.ID != null ? String(row.ID) : '';
      this.form.NOTIFICATION_INFORMATION = row.NOTIFICATION_INFORMATION || '';
      this.form.DEPT_CONTACT = row.DEPT_CONTACT || '';
      this.form.PROJECT_LEADER = row.PROJECT_LEADER || '';
      this.form.MONTHLY_SETTLE_MANAGER = row.MONTHLY_SETTLE_MANAGER || '';
      this.form.WEEKEND_ACCEPTANCE_ONDUTY = row.WEEKEND_ACCEPTANCE_ONDUTY || '';
      this.form.WORKING_ACCEPTANCE_ONDUTY = row.WORKING_ACCEPTANCE_ONDUTY || '';
      this.form.WAREHOUSE_ADDRESS = row.WAREHOUSE_ADDRESS || '';
      const base = this.announceBase();
      this.imgUrl1 = row.MONTHEND_PRU1_PATH ? `${base}/Upload/Announce/${row.MONTHEND_PRU1_PATH}` : '';
      this.imgUrl2 = row.MONTHEND_PRU2_PATH ? `${base}/Upload/Announce/${row.MONTHEND_PRU2_PATH}` : '';
    },
    async submitAnnounce() {
      this.saving = true;
      try {
        await upAnnounceInfo({
          ID: this.announceId,
          ...this.form
        });
        this.$message.success('保存成功');
        await this.loadAnnounce();
      } catch (e) {
        this.$message.error(e.message || '保存失败');
      } finally {
        this.saving = false;
      }
    },
    onImgUploadSuccess(res) {
      const ok = res && (res.code === 200 || res.code === '200');
      if (ok) {
        this.$message.success(res.msg || '上传成功');
        this.loadAnnounce();
      } else {
        this.$message.error((res && res.msg) || '上传失败');
      }
    },
    onUploadError() {
      this.$message.error('上传失败');
    },
    async loadFeedback(page) {
      if (page) this.feedPage.page = page;
      this.feedLoading = true;
      try {
        const [start, end] = this.feedDateRange || [null, null];
        const data = await getFeedbackInfo({
          SUPPLIER_NAME: this.feedQuery.SUPPLIER_NAME,
          RESPONDER: this.feedQuery.RESPONDER,
          UPDATE_TIMEstart: start || '',
          UPDATE_TIMEend: end || '',
          page: this.feedPage.page,
          size: this.feedPage.size
        });
        this.feedRows = data.result || [];
        this.feedTotal = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '加载反馈失败');
      } finally {
        this.feedLoading = false;
      }
    },
    onFeedSize(size) {
      this.feedPage.size = size;
      this.loadFeedback(1);
    },
    openReply(row) {
      this.replyRow = row;
      this.replyText = row.REPLY || '';
      this.replyVisible = true;
    },
    async submitReply() {
      if (!this.replyRow) return;
      this.replySaving = true;
      try {
        await upFeedBackReply({
          ID: this.replyRow.ID,
          FeedBackREPLY: this.replyText,
          RESPONDER: this.responderName
        });
        this.$message.success('回复成功');
        this.replyVisible = false;
        this.loadFeedback(this.feedPage.page);
      } catch (e) {
        this.$message.error(e.message || '回复失败');
      } finally {
        this.replySaving = false;
      }
    },
    async loadAttachments(page) {
      if (page) this.attPage.page = page;
      this.attLoading = true;
      try {
        const data = await getSuppAttachmentInfo({
          page: this.attPage.page,
          size: this.attPage.size
        });
        this.attRows = data.result || [];
        this.attTotal = Number(data.total) || 0;
      } catch (e) {
        this.$message.error(e.message || '加载附件失败');
      } finally {
        this.attLoading = false;
      }
    },
    onAttSize(size) {
      this.attPage.size = size;
      this.loadAttachments(1);
    },
    onAttFileChange() {
      /* 仅记录选择，实际上传点击按钮 */
    },
    async doAttUpload() {
      const input = this.$refs.attFile;
      const file = input && input.files && input.files[0];
      if (!file) {
        this.$message.warning('请先选择文件');
        return;
      }
      this.attUploading = true;
      try {
        await uploadSuppAttachment(file);
        this.$message.success('上传成功');
        input.value = '';
        await this.loadAttachments(1);
      } catch (e) {
        this.$message.error(e.message || '上传失败');
      } finally {
        this.attUploading = false;
      }
    },
    doAttDelete() {
      if (!this.attSelection.length) {
        this.$message.warning('请选中要删除的数据');
        return;
      }
      this.$confirm('确认要删除选中附件吗？', '提示', { type: 'warning' })
        .then(async () => {
          const ids = this.attSelection.map((r) => r.ID).join(',');
          await delSuppAttachmentInfo(ids);
          this.$message.success('删除成功');
          await this.loadAttachments(1);
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.b2b-bulletin {
  padding: 12px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e3a7d;
  text-align: center;
}
.bulletin-card {
  min-height: 380px;
}
.card-actions {
  margin-top: 12px;
  text-align: center;
}
.month-img-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.month-img-block {
  flex: 1;
  min-width: 200px;
}
.img-label {
  margin-bottom: 6px;
  font-size: 13px;
}
.upload-block {
  margin-bottom: 8px;
}
.preview-img {
  width: 220px;
  height: 190px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.section-card {
  width: 100%;
}
.search-bar {
  margin-bottom: 8px;
}
.pager {
  margin-top: 12px;
  text-align: right;
}
.file-input {
  max-width: 100%;
}
</style>
