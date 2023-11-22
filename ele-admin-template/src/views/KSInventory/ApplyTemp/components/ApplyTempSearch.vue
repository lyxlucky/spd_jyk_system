<!-- 搜索表单 -->
<template>
  <el-form label-width="0px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 16, md: 12 } : { span: 16 }">
        <el-form-item prop="TempletName">
          <el-input clearable v-model="TempletName" placeholder="请输入申领单备注信息" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 8, md: 12 } : { span: 8 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-check" class="ele-btn-icon" @click="Temp_FoundPlanSingle()">
            确认创建
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 14, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.SerachName" placeholder="请输入模板名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 10, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" class="ele-btn-icon" @click="search">
            设置为常规模板
          </el-button>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 9, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="warning" @click="reset">取消设置为常规模板</el-button>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button size="small" type="danger" @click="reset">删除</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { CreateTemplet } from '@/api/KSInventory/ApplyTemp';
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      SerachName: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      BZ: '',
      TempletName: '',
      rules: {
        TempletName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入模板名称'
          }
        ]
      }
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
    }
  },
  created() {}
};
</script>
