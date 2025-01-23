<!-- 搜索表单 -->

<template>
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input size="mini" v-model="where.VARIETIE_CODE_NEW" placeholder="编码/名称/规格" clearable />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input  size="mini" v-model="where.MANUFACTURING_ENT_NAME" placeholder="生产企业" clearable />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label="">
            <el-input  size="mini" v-model="where.APPROVAL_NUMBER" placeholder="注册证号" clearable />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 5, md: 2 } : { span: 6 }" style="padding-top: 5px;">
          <div class="ele-form-actions">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
            <el-button type="danger" size="mini" :disabled="IsDisabled" icon="el-icon-delete" @click="deleteItem()">剔除</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';


export default {
  props: ['DeptDeclarAndApprovalTopTableCurrent', 'selection', 'datasourceList', 'TopTableSelection'],
  components: {
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      VARIETIE_CODE_NEW: '',
      MANUFACTURING_ENT_NAME: '',
      APPROVAL_NUMBER: '',
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },

    /* 保存提交 */
    IsDisabled() {
      return this.selection.length === 0;
    },
  },
  watch: {
  },
  methods: {
    addItemDone(){
      this.addPlanItemVisiable = false;
      this.$emit('addPlanItemDone',"")
    },
    deleteItem(){
      this.$emit('deleteItem',this.selection)
    },
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    
  },
  created() {
  }
};
</script>
