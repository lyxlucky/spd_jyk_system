<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
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
          <el-form-item label="平均用量时间段：" label-width="130px">
            <el-date-picker
              size="mini"
              v-model="where.dateFrom"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-date-picker
            size="mini"
            v-model="where.dateTo"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="yyyy-MM-dd"
          />
        </el-col>
      </el-row>
      <el-form-item label="品种">
        <el-input
          v-model="where.VARIETIE_CODE_NEW"
          placeholder="请输入品种名称/品种编码"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <br />
      <el-form-item label="操作">
        <div class="stocktaking-detail-actions">
          <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
            <template v-slot:reference>
              <el-button type="danger" icon="el-icon-delete-solid">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <!-- 盘点汇总 -->
          <el-button type="primary" icon="el-icon-data-analysis" @click="createBatchData()">盘点汇总</el-button>

          <!-- 盘点格式化 -->
          <!-- <el-button type="primary" size="mini" icon="el-icon-data-analysis" class="ele-btn-icon" @click="createBatchData()">
            盘点视图
          </el-button> -->

          <!-- 扫码盘点 -->
          <el-button type="primary" icon="el-icon-_scan" :disabled="IsScanVisiable" @click="scanTotal()">扫码盘点</el-button>
          <el-button type="primary" icon="el-icon-circle-check" :disabled="selection == 0" @click="updateStatuById(1)">标记一致</el-button>
          <el-button type="primary" icon="el-icon-circle-close" :disabled="selection == 0" @click="updateStatuById(0)">标记缺失</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <span>存在申领数量为0的明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteZeroDelAndCommit">剔除并提交</el-button>
        <el-button @click="deleteZeroDelAndCommit2">取 消</el-button>
      </span>
    </el-dialog> 
    -->
  </div>
</template>

<script>
import {
  DelBatchStockDataDel,
  updateStatu
} from '@/api/KSInventory/StocktakingData';

const defaultWhere = () => ({
  Token: '',
  PlanNum: '',
  is_second_app: '',
  VARIETIE_CODE_NEW: '',
  dateFrom: '',
  dateTo: ''
});

export default {
  props: [
    'KSDepartmentalPlanDataSearch',
    'selection',
    'datasourceList',
    'current',
    'KSDepartmentalPlanData'
  ],
  components: {},
  data() {
    return {
      where: defaultWhere(),
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
    IsScanVisiable() {
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
    updateStatuById(data) {
      const ids = this.selection
        .map((item) => {
          return item.ID;
        })
        .join(',');
      const loading = this.$messageLoading('更新中..');
      updateStatu({ ids: ids, state: data })
        .then((res) => {
          this.$message.success(res.msg);
        })
        .catch((err) => {
          this.$message.error(err);
        })
        .finally(() => {
          loading.close();
          this.search();
        });
    },
    createBatchData() {
      this.$emit('createBatchData', '');
    },
    scanTotal() {
      this.$emit('scanItem', '');
    },
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = defaultWhere();
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

<style scoped lang="scss">
.stocktaking-detail-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.stocktaking-detail-actions :deep(.el-button) {
  margin: 0;
}

.stocktaking-detail-actions :deep(.ele-action) {
  display: inline-flex;
}
</style>
