<!-- 搜索表单 -->
<template>
  <el-form size="mini" label-width="0px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.REQUESTNOTEID" placeholder="申请单号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.APPLYDEPT" placeholder="申请部门" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.APPLYPEOPLE" placeholder="经办人" />
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-top: 5px">
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 12 }">
        <el-select size="mini" v-model="where.PROCESS_STATUS" @change="search()">
          <el-option label="全部" value=""></el-option>
          <el-option label="已传入中间表" value="N"></el-option>
          <el-option label="已传入SPD" value="S"></el-option>
          <el-option label="已接收收费编码" value="Y"></el-option>
          <el-option label="传入SPD失败" value="E"></el-option>
        </el-select>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 18, md: 12 } : { span: 12 }">
        <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
          查询
        </el-button>
        <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
        <el-button size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
        <el-button size="mini" type="primary" class="ele-btn-icon" @click="search">
          审批
        </el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {
  CreateTemplet,
  UpdateCommon,
  UpdateCommon2
} from '@/api/KSInventory/ApplyTemp';

export default {
  props: {
    // 修改回显的数据
    rowData: Object
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      PROCESS_STATUS: '',
      REQUESTNOTEID: '',
      APPLYDEPT: '',
      APPLYPEOPLE: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      defaultWhere // 添加defaultWhere引用
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
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
    /* 导出 */
    exportData() {
      this.$emit('exportData', this.where);
    },
    /* 创建申领单 */
    Temp_FoundPlanSingle() {
      if (!this.TempletName) {
        this.$message.warning('请输入模板名称');
        return;
      }
      // const loading = this.$loading({ lock: true });

      const loading = this.$messageLoading('添加中..');
      var data = {
        TempletName: this.TempletName,
        DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        Operater: this.$store.state.user.info.UserName
      };
      CreateTemplet(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.$emit('search', this.where);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    UpdateCommon_btn() {
      if (this.rowData == null) {
        this.$message.warning('请先选择模板');
        return;
      }
      const loading = this.$messageLoading('设置中..');

      var data = {
        ID: this.rowData.ID
      };
      UpdateCommon(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
          this.search();
        });
    },
    UpdateCommon2_btn() {
      const loading = this.$messageLoading('设置中..');
      UpdateCommon2()
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
          this.search();
        });
    }
  },
  created() {}
};
</script>
