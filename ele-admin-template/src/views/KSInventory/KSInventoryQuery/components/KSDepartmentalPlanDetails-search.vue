<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.Name" placeholder="品种名称/品种编码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-form-item label="入库类型">
          <el-select v-model="where.TYPE" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="使用" value="0"></el-option>
            <el-option label="入库" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import {
  DeletePlanDeta,
  PutInListDeta,
  ToExamine
} from '@/api/KSInventory/KSDepartmentalPlan';
import IntroduceUserDefinedTemp from '@/views/KSInventory/IntroduceUserDefinedTemp/index.vue';

export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
  components: {
    IntroduceUserDefinedTemp
    // IntroduceDefinedTemp
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      TYPE: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      showEdit: false,
      showEdit2: false
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },

    /* 保存提交 */
    IsDisabled() {
      if (this.KSDepartmentalPlanDataSearch) {
        return this.KSDepartmentalPlanDataSearch.State == '0';
      } else {
        return false;
      }
      // return (
      //   this.KSDepartmentalPlanDataSearch.State == '0' &&
      //   (this.KSDepartmentalPlanDataSearch.PlanNum != null ||
      //     this.KSDepartmentalPlanDataSearch.PlanNum != undefined ||
      //     this.KSDepartmentalPlanDataSearch.PlanNum.length != 0)
      // );
    },
    IsDisabledIsNot() {
      return false;
    },
    /* 删除键 */
    IsDisabledByDel() {
      return this.KSDepartmentalPlanDataSearch.State == '0';
    },

    /* 审核申领单 */
    IsPutInListDeta() {
      return this.KSDepartmentalPlanDataSearch.State == '1';
    },

    /* 审批申领单 */
    IsToExamine() {
      return this.KSDepartmentalPlanDataSearch.State == '6';
    }
  },
  watch: {
    showEdit() {
      if (this.showEdit == false) {
        this.$emit('showEditReoad', false);
      }
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
    /* 打开其他模板页面 */
    openIntroduceOtherTemp() {
      this.showEdit2 = true;
    },
    /* 保存并提交  */
    addPutInListDeta() {
      // console.log(this.datasourceList)
      if (
        this.KSDepartmentalPlanDataSearch.PlanNum == null ||
        this.KSDepartmentalPlanDataSearch.PlanNum == undefined ||
        this.KSDepartmentalPlanDataSearch.PlanNum.length == 0
      ) {
        this.$message.warning('请选择需提交的申领单');
        return;
      }
      if (this.datasourceList.length == 0) {
        this.$message.warning('请添加品种');
        return;
      }
      var loading = this.$messageLoading('保存中..');
      var data = {
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
      };
      PutInListDeta(data)
        .then((res) => {
          loading.close();
          this.$message.success('提交成功');
          // reloadPageTab();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    /* 审批申领单  */
    subToExamine() {
      // console.log(this.$store.state.user);
      var loading = this.$messageLoading('保存中..');
      var data = {
        Operator: this.$store.state.user.info.Nickname,
        PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
      };
      ToExamine(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          // reloadPageTab();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    }
  },
  created() {
    // reloadPageTab();
    // console.log(this.$store.state.user);
  }
};
</script>
