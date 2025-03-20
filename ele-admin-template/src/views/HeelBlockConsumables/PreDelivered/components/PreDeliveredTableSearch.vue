<!-- 搜索表单 -->
<template>
  <el-form
    size="mini"
    label-width="0px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 16 }">
        <el-select v-model="where.state" size="mini" placeholder="请选择状态">
          <el-option label="收货全部" value=""></el-option>
          <el-option label="待确认" value="0"></el-option>
          <el-option label="已确认" value="1"></el-option>
        </el-select>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 16 }">
        <el-select
          v-model="where.strApprove"
          size="mini"
          placeholder="请选择状态"
        >
          <el-option label="审批全部" value=""></el-option>
          <el-option label="未审批" value="0"></el-option>
          <el-option label="已审批" value="1"></el-option>
        </el-select>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 16 }">
        <el-select
          v-model="where.strYanShou"
          size="mini"
          placeholder="请选择状态"
        >
          <el-option label="提交全部" value=""></el-option>
          <el-option label="未提交" value="0"></el-option>
          <el-option label="已提交" value="1"></el-option>
        </el-select>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 9 }">
        <el-date-picker
          style="width: 220px"
          v-model="where.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-top: 5px">
      <el-col v-bind="styleResponsive ? { lg: 16, md: 12 } : { span: 12 }">
        <el-input
          size="mini"
          clearable
          v-model="where.condition"
          placeholder="品种(材料)编码、品种全称、生产企业名称、型号/规格、供应商名称"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 8, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 24, md: 12 } : { span: 12 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="warning"
            class="ele-btn-icon"
            @click="Approve_btn"
            >审批</el-button
          >
          <el-popconfirm
            class="ele-action"
            title="确定收货？"
            @confirm="Confirm_btn()"
          >
            <template v-slot:reference>
              <el-button size="mini" type="primary" class="ele-btn-icon"
                >确认收货</el-button
              >
            </template>
          </el-popconfirm>
          <el-button
            size="mini"
            type="primary"
            class="ele-btn-icon"
            @click="prePrint"
            >打印收货单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            class="ele-btn-icon"
            @click="exportData"
            >导出</el-button
          >

          <el-popconfirm
            class="ele-action"
            title="确定删除？"
            @confirm="Delete_btn()"
          >
            <template v-slot:reference>
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="15" style="margin-top:5px">
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
    </el-row> -->
  </el-form>
</template>

<script>
  import {
    CreateTemplet,
    UpdateCommon,
    UpdateCommon2
  } from '@/api/KSInventory/ApplyTemp';

  import { getDayOfDate } from '@/utils/date-util';
  export default {
    props: {
      // 修改回显的数据
      rowData: Object
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        state: '',
        condition: '',
        date: [getDayOfDate('yyyy-MM-dd', -7), getDayOfDate('yyyy-MM-dd', 1)],
        strApprove: '',
        strYanShou: ''
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
        // console.log(this.$store.state.user.info.userDept)
        console.log(this.where);
        this.$emit('search', this.where);
      },
      Approve_btn() {
        this.$emit('Approve_btn');
      },
      Delete_btn() {
        this.$emit('Delete_btn');
      },
      Confirm_btn() {
        this.$emit('Confirm_btn');
      },
      exportData() {
        this.$emit('exportData', this.where);
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
      prePrint() {
        this.$emit('prePrint');
      }
    },
    created() {}
  };
</script>
