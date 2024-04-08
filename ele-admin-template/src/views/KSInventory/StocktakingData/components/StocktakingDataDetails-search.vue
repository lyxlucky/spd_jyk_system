<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search">
    <el-row :gutter="10" style="display: none">
      <!-- <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <el-form-item label="状态：">
          <el-select v-model="where.State" @change="search()">
            <el-option label="显示所有申领品种" value="-1"></el-option>
            <el-option label="仅显示实际申领为空品种" value="0"></el-option>
            <el-option label="仅显示实际申领非空品种" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col v-bind="styleResponsive ? { lg: 11, md: 12 } : { span: 6 }">
        <el-form-item label="平均用量时间段：" label-width='130px'>
          <el-date-picker v-model="where.dateFrom" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-date-picker v-model="where.dateTo" type="date" value-format="yyyy-MM-dd" placeholder="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :lg="6" :md="12">
        <el-form-item label="">
          <el-input v-model="where.VARIETIE_CODE_NEW" placeholder="请输入品种名称/品种编码" clearable />
        </el-form-item>
      </el-col>
      <el-col :lg="18" :md="12">
        <div class="ele-form-actions">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
            <template v-slot:reference>
              <el-button type="danger" size="small" :underline="false">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
            导出
          </el-button>
          <!-- 盘点汇总 -->
          <el-button type="primary" icon="el-icon-data-analysis" class="ele-btn-icon" @click="createBatchData()">
            盘点汇总
          </el-button>
          <!-- 扫码盘点 -->
          <el-button type="primary" icon="el-icon-_scan" :disabled="IsScanVisiable" class="ele-btn-icon" @click="scanTotal()">
            扫码盘点
          </el-button>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>存在申领数量为0的明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteZeroDelAndCommit">剔除并提交</el-button>
        <el-button @click="deleteZeroDelAndCommit2">取 消</el-button>
      </span>
    </el-dialog>

  </el-form>
</template>

<script>
import { DelBatchStockDataDel } from '@/api/KSInventory/StocktakingData';

export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList','current','KSDepartmentalPlanData'],
  components: {},
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      PlanNum: '',
      is_second_app: '',
      VARIETIE_CODE_NEW: '',
      dateFrom: '',
      dateTo: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      showEdit: false,
      showEdit2: false,
      ApplyTempPage: false,
      centerDialogVisible: false,
      BidListShowEdit: false,
      ApplyOperateTipShow: false,
      VarietyDataLzhLookShow: false,
      DpetOneAuthWithDeptShow: false,
      HidesubToExamine: false,
      visibleLine: 'none'
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
    // IsCreatBatchDataDisable(){
    //   return this.current != 0;
    // }
    IsScanVisiable(){
      return Object.keys(this.KSDepartmentalPlanData).length == 0;
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
    createBatchData(){
      this.$emit('createBatchData','');
    },
    scanTotal(){
      this.$emit('scanItem','');
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
    /* 批量删除 */
    removeBatch() {
      console.log(this.selection);
      var ID = '';
      this.selection.forEach((item) => {
        ID += item.ID + ',';
      });
      ID = ID.substring(0, ID.length - 1);
      var data = {
        ID
      };
      const loading = this.$messageLoading('删除中..');

      DelBatchStockDataDel(data)
        .then((res) => {
          loading.close();
          this.search();
          // var where = {
          //   PlanNum: this.KSDepartmentalPlanDataSearch.PlanNum
          // };
          // this.$emit('search', where);
          this.$message.success(res.msg);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    exportData() {
      this.$emit('exportData', this.where);
    }
  },
  created() {}
};
</script>
