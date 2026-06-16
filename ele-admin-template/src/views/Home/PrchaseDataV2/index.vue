<template>
  <div class="ele-body spd-page prchase-data-v2">
    <el-card shadow="never">
      <el-tabs v-model="activeTab" @tab-click="onTabClick">
        <el-tab-pane label="项目列表" name="project">
          <ProjectListPanel
            ref="projectPanel"
            :xm-name-options="xmNameOptions"
            :xm-num-options="xmNumOptions"
            :xm-type-options="xmTypeOptions"
            @search="reloadDeptIfNeeded"
          />
        </el-tab-pane>
        <el-tab-pane label="科室完成情况" name="dept">
          <DeptCompletionPanel
            ref="deptPanel"
            :xm-name-options="xmNameOptions"
            :xm-num-options="xmNumOptions"
            :xm-type-options="xmTypeOptions"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import ProjectListPanel from './components/ProjectListPanel.vue';
import DeptCompletionPanel from './components/DeptCompletionPanel.vue';
import { getVarLimitBuyXmClassV2 } from '@/api/Home/PrchaseDataV2';

export default {
  name: 'HomePrchaseDataV2',
  components: { ProjectListPanel, DeptCompletionPanel },
  data() {
    return {
      activeTab: 'project',
      xmNameOptions: [],
      xmNumOptions: [],
      xmTypeOptions: []
    };
  },
  created() {
    this.loadXmClass();
  },
  methods: {
    async loadXmClass() {
      try {
        const data = await getVarLimitBuyXmClassV2();
        this.xmNameOptions = (data.XM_NAMElist || []).map((e) => e.FIELDVALUE);
        this.xmNumOptions = (data.XM_NUMlist || []).map((e) => e.FIELDVALUE);
        this.xmTypeOptions = (data.XM_TYPElist || []).map((e) => e.FIELDVALUE);
      } catch (e) {
        Message.error(e.message || '加载项目分类失败');
      }
    },
    onTabClick(tab) {
      if (tab.name === 'dept') {
        this.$nextTick(() => this.$refs.deptPanel?.reload());
      }
    },
    reloadDeptIfNeeded() {
      if (this.activeTab === 'dept') {
        this.$refs.deptPanel?.reload();
      }
    }
  }
};
</script>

<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 12px;
}
</style>
