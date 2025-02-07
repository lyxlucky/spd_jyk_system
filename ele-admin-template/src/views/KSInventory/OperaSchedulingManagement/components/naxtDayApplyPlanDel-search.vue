<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <el-row :gutter="10">
      <el-col :lg="6" :md="12">
        <el-input size="mini" v-model="where.SerachName" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索" clearable />
      </el-col>
      <el-col :lg="18" :md="12">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="openIntroduceUserDefinedTemp" >自定义新增</el-button>
          <!-- <el-button type="primary" icon="el-icon-upload" size="mini" @click="showApplyTemp" >引入模板</el-button> -->
          <!-- <el-dropdown>
            <el-button size="mini" icon="el-icon-plus" type="primary">
              新增<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="openIntroduceUserDefinedTemp"
                  :disabled="!IsDisabled"
                  >自定义新增</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  type="primary"
                  icon="el-icon-upload"
                  size="mini"
                  @click="showApplyTemp"
                  :disabled="!IsDisabled"
                  >引入模板</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
            <template v-slot:reference>
              <!-- <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link> -->
              <el-button type="danger" icon="el-icon-delete" size="mini" :underline="false" :disabled="!IsDisabledByDel">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="导入模板品种" :visible.sync="dialogTableVisible2" width="30%">
      <div style="width: 100%; text-align: center">
        <form action="" id="CreateBydFpform">
          <input type="text" size="mini" style="display: none" name="PlanNum" autocomplete="off" placeholder="" :value="PlanNum" />
          <input type="text" size="mini" style="display: none" name="Token" autocomplete="off" placeholder="" :value="Token" />

          <div class="layui-form-item">
            <label style="width: 170px">选择文件:</label>
            <input id="FILE" size="mini" style="
                height: 30px;
                width: 200px;
                display: inline;
                margin-left: 5px;
              " name="FILE" type="file" value="" required="required" autocomplete="off" />
          </div>
        </form>
        <el-button type="primary" size="mini" @click="importFile">确定</el-button>
      </div>
    </el-dialog>
    <IntroduceUserDefinedTemp :visible.sync="showEdit" :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch" />
  
  </el-form>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import {
  DeletePlanDeta,
} from '@/api/KSInventory/KSDepartmentalPlan';
import IntroduceUserDefinedTemp from '@/views/KSInventory/IntroduceUserDefinedTemp/index.vue';
import { TOKEN_STORE_NAME } from '@/config/setting';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
  components: {
    IntroduceUserDefinedTemp,
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      PlanNum: '',
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
      DeletePlanDeta(data)
        .then((res) => {
          loading.close();
          this.search();
          var where = {
            PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
          };
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
    },
  },
  created() {
  }
};
</script>
