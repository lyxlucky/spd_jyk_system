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
      <el-form-item label="项目类型" prop="projectType" v-if="!isSzse">
        <el-select
          v-model="form.projectType"
          placeholder="请选择项目类型"
          @change="handleProjectTypeChange"
          style="width: 100%"
        >
          <el-option label="非科研" value="non_research"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.projectType === 'research'"
        label="科研项目"
        prop="researchProject"
      >
        <el-select
          v-model="form.researchProject"
          placeholder="请选择科研项目"
          style="width: 100%"
          :loading="loading"
          :disabled="!researchProjects.length"
          filterable
          :filter-method="filterProjects"
          @visible-change="handleDropdownVisible"
          @scroll="handleScroll"
          popper-class="research-project-select"
        >
          <el-option
            v-for="project in filteredProjects"
            :key="project.EBSID"
            :label="project.SUBJECTNAME"
            :value="project.EBSID"
          ></el-option>

          <div
            v-if="hasMore && !loadingMore"
            class="load-more-container"
            @click.stop="loadMoreProjects"
          >
            <span class="load-more-text">加载更多...</span>
          </div>

          <div
            v-if="loadingMore"
            class="loading-more-container"
          >
            <i class="el-icon-loading"></i>
            <span class="loading-text">加载中...</span>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item label="库区" prop="region">
        <el-select
          v-model="form.region"
          placeholder="请选择库区"
          style="width: 100%"

          :loading="regionLoading"
          :disabled="!regions.length"
        >
          <el-option
            v-for="region in regions"
            :key="region.value"
            :label="region.label"
            :value="region.value"
          ></el-option>
        </el-select>
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
import { getResearchProjects, getDeptTwoRegion } from '@/api/KSInventory/KSDepartmentalPlan';

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
        projectType: 'non_research',
        researchProject: '',
        region: ''
      },
      rules: {
        projectType: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        researchProject: [
          { required: true, message: '请选择科研项目', trigger: 'change' }
        ]
      },
      researchProjects: [],
      filteredProjects: [],
      loading: false,
      loadingMore: false,
      confirmLoading: false,
      currentPage: 1,
      pageSize: 20,
      hasMore: true,
      currentSearchQuery: '',
      regions: [],
      regionLoading: false
    };
  },
  methods: {

    async fetchRegions() {
      this.regionLoading = true;
      try {
        const res = await getDeptTwoRegion({
          deptTwoCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          type: 0,
          account: this.$store.state.user.info.UserName
        });
        if (res && res.result) {
          this.regions = res.result.map(item => ({
            label: item.REGION_NAME,
            value: item.REGION_CODE
          }));
        }
      } catch (error) {
        this.$message.error('获取库区列表失败');
        console.error('获取库区列表失败:', error);
      } finally {
        this.regionLoading = false;
      }
    },

    async handleProjectTypeChange(value) {
      if (value === 'research') {
        await this.fetchResearchProjects();
      } else {
        this.form.researchProject = '';
        this.researchProjects = [];
      }
    },

    async fetchResearchProjects(reset = true) {
      if (reset) {
        this.loading = true;
        this.currentPage = 1;
        this.hasMore = true;
        this.researchProjects = [];
        this.filteredProjects = [];
      } else {
        this.loadingMore = true;
      }

      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize
        };

        if (this.currentSearchQuery) {
          params.search = this.currentSearchQuery;
        }

        const res = await getResearchProjects(params);
        if (res && res.data) {
          const newProjects = res.data;

          if (reset) {
            this.researchProjects = newProjects;
            this.filteredProjects = newProjects;
          } else {
            this.researchProjects = [...this.researchProjects, ...newProjects];
            this.filteredProjects = [...this.filteredProjects, ...newProjects];
          }

          this.hasMore = newProjects.length >= this.pageSize;
          this.currentPage++;
        }
      } catch (error) {
        this.$message.error('获取科研项目失败');
        console.error('获取科研项目失败:', error);
      } finally {
        if (reset) {
          this.loading = false;
        } else {
          this.loadingMore = false;
        }
      }
    },

    async loadMoreProjects() {
      if (!this.loading && !this.loadingMore && this.hasMore) {
        await this.fetchResearchProjects(false);
      }
    },

    async filterProjects(query) {
      this.currentSearchQuery = query;

      if (!query) {
        // 清空搜索时，重新加载所有数据
        await this.fetchResearchProjects(true);
        return;
      }

      // 从服务器搜索
      await this.fetchResearchProjects(true);
    },

    handleDropdownVisible(visible) {
      if (!visible) {
        this.currentSearchQuery = '';
        // 当下拉框关闭时，重新加载所有数据
        this.fetchResearchProjects(true);
      }
    },

    handleScroll(event) {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (scrollHeight - scrollTop - clientHeight < 50 && this.hasMore && !this.loading && !this.loadingMore) {
        this.loadMoreProjects();
      }
    },

    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.projectType === 'research' && !this.form.researchProject) {
            this.$message.warning('请选择科研项目');
            return;
          }

          this.confirmLoading = true;

          const createData = {
            BZ: this.bz,
            DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
            State: '2',
            Operater: this.$store.state.user.info.UserName,
            ProjectType: this.form.projectType,
            ResearchProjectId: this.form.researchProject || "",
            REGION_CODE: this.form.region
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
        projectType: 'non_research',
        researchProject: '',
        region: ''
      };
      this.researchProjects = [];
      this.filteredProjects = [];
      this.currentPage = 1;
      this.hasMore = true;
      this.currentSearchQuery = '';
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    }
  },
  mounted() {
    this.fetchRegions();
  },
  computed: {
    isSzse() {
      return this.$HOME_HP?.startsWith('se2');
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

.project-option {
  width: 100%;
  box-sizing: border-box;
}

.project-name {
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.load-more-container {
  text-align: center;
  padding: 12px;
  cursor: pointer;
  color: #409eff;
  border-top: 1px solid #ebeef5;
}

.load-more-container:hover {
  background-color: #f5f7fa;
}

.load-more-text {
  font-size: 12px;
}

.loading-more-container {
  text-align: center;
  padding: 12px;
  color: #909399;
  border-top: 1px solid #ebeef5;
}

.loading-text {
  font-size: 12px;
  margin-left: 4px;
}
</style>

<style>
.research-project-select {
  width: 100% !important;
  max-width: 400px !important;
}

.research-project-select .el-select-dropdown__item {
  height: auto !important;
  line-height: 1.2 !important;
  padding: 8px 12px !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
}

.research-project-select .el-select-dropdown__item.selected {
  background-color: #f5f7fa !important;
}

.research-project-select .el-select-dropdown__list {
  max-width: 400px !important;
}
</style>
