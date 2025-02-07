<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <el-row :gutter="10">
      <el-col :lg="4" :md="12">
        <el-input size="mini" v-model="where.VARIETIE_NAME" placeholder="品种名称" clearable />
      </el-col>
      <el-col :lg="4" :md="12">
        <el-input size="mini" v-model="where.CREATE_MAN" placeholder="创建人" clearable />
      </el-col>
      <el-col :lg="16" :md="12">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="openIntroduceUserDefinedTemp">自定义新增</el-button>
          <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
            <template v-slot:reference>
              <el-button type="danger" icon="el-icon-delete" size="mini" :underline="false" >删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-col>
    </el-row>
    <IntroduceUserDefinedTemp :visible.sync="showEdit" :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch" />

  </el-form>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import { DeletePlanDeta } from '@/api/KSInventory/KSDepartmentalPlan';
import { DeleteNaxtDayApplyPlanDel } from '@/api/KSInventory/OperaSchedulingManagement';
import IntroduceUserDefinedTemp from '@/views/KSInventory/OperaSchedulingManagement/components/IntroduceUserDefinedTemp/index.vue';
import { TOKEN_STORE_NAME } from '@/config/setting';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
  components: {
    IntroduceUserDefinedTemp
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      VARIETIE_NAME: '',
      CREATE_MAN: '',
      MAIN_ID: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      showEdit: false,
      visibleLine: 'none',
      Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    ENV() {
      return process.env.NODE_ENV;
    },
    HOME_HP() {
      return HOME_HP;
    }
  },
  watch: {
    showEdit() {
      if (this.showEdit == false) {
        this.$emit('showEditReoad', false);
      }
    },
    KSDepartmentalPlanDataSearch() {
      this.PlanNum = this.KSDepartmentalPlanDataSearch.PlanNum;
    }
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    /* 批量删除 */
    removeBatch() {
      const loading = this.$messageLoading('删除中..');
      var ID = '';
      this.selection.forEach((item) => {
        ID += item.ID + ',';
      });
      ID.substring(0, ID.length - 1);
      var data = {
        ID
      };
      DeleteNaxtDayApplyPlanDel(data)
        .then((res) => {
          loading.close();
          var where = {
            ID: this.KSDepartmentalPlanDataSearch.ID
          };
          console.log(where)
          this.$emit('search', where);
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    /* 打开自定义新增页面 */
    openIntroduceUserDefinedTemp() {
      // console.log(this.KSDepartmentalPlanDataSearch);
      if (
        this.KSDepartmentalPlanDataSearch.ID == undefined ||
        this.KSDepartmentalPlanDataSearch.ID == ''
      ){
        this.$message.info("请选择申请单！！！")
        return;
      }
        this.showEdit = true;
    },
    showApplyTemp() {
      // console.log(this.KSDepartmentalPlanDataSearch);
      this.ApplyTempPage = true;
    },
    /* 打开其他模板页面 */
    openIntroduceOtherTemp() {
      this.showEdit2 = true;
    },
    /* 保存并提交  */

    exportData() {
      this.$emit('exportData', this.where);
    }
  },
  created() {}
};
</script>
