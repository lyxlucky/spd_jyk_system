<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="选择项目类型"
    width="500px"
    @close="handleClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="科研项目" prop="researchProject">
        <el-autocomplete
          v-model="form.researchProject"
          :fetch-suggestions="querySearch"
          placeholder="请输入科研项目名称"
          style="width: 80%"
          value-key="SUBJECTNAME"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div class="project-item">{{ item.EBSID + '/' +item.SUBJECTNAME }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getResearchProjects } from '@/api/KSInventory/KSDepartmentalPlan';

export default {
  name: 'ProjectTypeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    bz: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        researchProject: ''
      },
      rules: {
        researchProject: [
          { required: true, message: '请选择科研项目', trigger: 'blur' }
        ]
      },
      selectedProjectId: '',
      selectedProjectName: ''
    };
  },
  methods: {
    async querySearch(queryString, cb) {
      try {
        const res = await getResearchProjects({
          page: 1,
          pageSize: 20,
          search: queryString || ''
        });
        cb(res && res.data ? res.data : []);
      } catch (error) {
        console.error('搜索科研项目失败:', error);
        cb([]);
      }
    },

    handleSelect(item) {
      this.selectedProjectId = item.EBSID;
      this.selectedProjectName = item.SUBJECTNAME;
      // 更新表单值，确保验证通过
      this.form.researchProject = item.SUBJECTNAME;
      // 手动触发表单验证，清除可能的错误提示
      this.$nextTick(() => {
        this.$refs.form.validateField('researchProject');
      });
    },

    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.selectedProjectId) {
            this.$message.warning('请选择科研项目');
            return;
          }

          const createData = {
            BZ: this.bz,
            DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
            State: '2',
            Operater: this.$store.state.user.info.UserName,
            ProjectType: 'research',
            ResearchProjectId: this.selectedProjectId,
            ResearchProjectName: this.selectedProjectName
          };
          this.$emit('confirm', createData);
        }
      });
    },

    handleCancel() {
      this.$emit('cancel');
    },

    handleClose() {
      this.resetForm();
      this.$emit('update:visible', false);
    },

    resetForm() {
      this.form = {
        researchProject: ''
      };
      this.selectedProjectId = '';
      this.selectedProjectName = '';
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  }
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}

.project-item {
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.4;
}
</style>