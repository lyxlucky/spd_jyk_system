<!-- 搜索表单 -->
<template>
  <el-form
    label-width="100px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input
          clearable
          size="mini"
          v-model="where.Name"
          placeholder="品种名称/品种编码"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input
          clearable
          size="mini"
          v-model="where.DELIVERY_NUMBER"
          placeholder="入库单号"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input
          clearable
          size="mini"
          v-model="where.DEF_NO_PKG_CODE"
          placeholder="定数码"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input
          clearable
          size="mini"
          v-model="where.MANUFACTURER"
          placeholder="生产企业"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input
          clearable
          size="mini"
          v-model="where.PROD_REGISTRATION"
          placeholder="注册证"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input
          size="mini"
          clearable
          v-model="where.BATCH"
          placeholder="批号"
        />
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-date-picker
          v-model="where.date"
          type="daterange"
          size="mini"
          align="right"
          unlink-panels
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-form-item label="流向类型:">
          <el-select size="mini" v-model="where.TYPE" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="已出库" value="3"></el-option>
            <el-option label="已入库" value="2"></el-option>
            <el-option label="库存初始化" value="0"></el-option>
            <el-option label="申领入库" value="1"></el-option>
            <el-option label="定数包退货" value="4"></el-option>
            <el-option label="散货出库" value="5"></el-option>
            <el-option label="his计费" value="6"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label-width="0px">
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
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-download"
              @click="exportData()"
              >导出</el-button
            >
            <el-button size="mini" icon="el-icon-refresh" @click="reset"
              >重置</el-button
            >

             <el-button
              type="primary"
              icon="el-icon-view"
              size="mini"
              @click="KSDepartmentalPlanDetailsGroupTipShow = true"
              >查看汇总</el-button
          >
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <KSDepartmentalPlanDetailsGroupTip :visible.sync="KSDepartmentalPlanDetailsGroupTipShow" />

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
  import KSDepartmentalPlanDetailsGroupTip from '@/views/KSInventory/KSInventoryRecord/components/KSDepartmentalPlanDetailsGroup/index.vue';

  export default {
    props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
    components: {
      IntroduceUserDefinedTemp,
      KSDepartmentalPlanDetailsGroupTip
      // IntroduceDefinedTemp
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        Token: '',
        TYPE: '',
        DELIVERY_NUMBER: '',
        DEF_NO_PKG_CODE: '',
        Name: '',
        MANUFACTURER: '',
        PROD_REGISTRATION: '',
        BATCH: '',
        date: []
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        KSDepartmentalPlanDetailsGroupTipShow: false,
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        },
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
      exportData() {
        this.$emit('exportData', this.where);
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
