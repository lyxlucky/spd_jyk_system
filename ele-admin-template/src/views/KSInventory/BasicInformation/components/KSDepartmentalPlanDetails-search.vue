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
    <!-- <el-col :lg="6" :md="12">
        <el-form-item label="">
          <el-input v-model="where.SerachName" placeholder="请输入品种名称/品种编码/型号规格/生产企业搜索" clearable />
        </el-form-item>
      </el-col> -->
    <el-row :gutter="10">
      <el-col :lg="5" :md="12">
        <el-form-item label="UDI码">
          <el-input v-model="SerachName" placeholder="" clearable style="width:240px" />
        </el-form-item>
      </el-col>
      <el-col :lg="5" :md="12">
        <el-form-item label="产品码">
          <el-input v-model="SerachName2" placeholder="" clearable style="width:240px" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :lg="5" :md="12">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="true">材料登记</el-radio-button>
          <el-radio-button :label="false">材料汇总</el-radio-button>
          <el-radio-button :label="false">收费汇总</el-radio-button>
        </el-radio-group> -->
        <el-radio-group v-model="radio1">
          <el-radio-button label="出库耗材登记"></el-radio-button>
          <!-- <el-radio-button label="材料汇总"></el-radio-button>
          <el-radio-button label="收费汇总"></el-radio-button> -->
        </el-radio-group>
      </el-col>
      <!-- <el-col :lg="18" :md="12">
        <p style="display: flex;align-items: center;justify-content: flex-end;">
          合计使用鼓量: <b>2 </b>
          材料合计: <b>2 </b>
          未收费材料: <b>0.00 </b>
          收费材料: <b>140.00 </b>
          收费合计: <b>140.00 </b>
          供应商结算金额: <b>140.00</b></p>
      </el-col> -->
    </el-row>

    <IntroduceUserDefinedTemp :visible.sync="showEdit" :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch" />
    <IntroduceDefinedTemp :visible.sync="showEdit2" />
    <BidVarInfoDept :visible.sync="BidListShowEdit" />
    <ApplyOperateTip :visible.sync="ApplyOperateTipShow" />
    <ApplyOperateTip :visible.sync="ApplyOperateTipShow" />
    <VarietyDataLzhLook :visible.sync="VarietyDataLzhLookShow" />
    <DpetOneAuthWithDept :visible.sync="DpetOneAuthWithDeptShow" />
    <el-dialog title="授权品种目录" :visible.sync="ApplyTempPage" width='95%'>
      <!-- <AuthVarTable :dialogTableVisible="dialogTableVisible" :ApplyTempTableDataID="ApplyTempTableDataID" /> -->
      <ApplyTemp :IntroduceUserDefinedTempSearch="KSDepartmentalPlanDataSearch" @ApplyTempPageChange="ApplyTempPageChange" />
    </el-dialog>

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
import { API_BASE_URL, BACK_BASE_URL } from '@/config/setting';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import {
  DeletePlanDeta,
  PutInListDeta,
  ToExamine,
  KeeptListDeta,
  isHaveZeroDel,
  deleteZeroDel
} from '@/api/KSInventory/KSDepartmentalPlan';
import IntroduceUserDefinedTemp from '@/views/KSInventory/IntroduceUserDefinedTemp/index.vue';
import BidVarInfoDept from '@/views/KSInventory/ReferenceComponent/BidVarInfoDept/index.vue';
import ApplyOperateTip from '@/views/KSInventory/ReferenceComponent/ApplyOperateTip/index.vue';
import VarietyDataLzhLook from '@/views/KSInventory/ReferenceComponent/VarietyDataLzhLook/index.vue';
import DpetOneAuthWithDept from '@/views/KSInventory/ReferenceComponent/DpetOneAuthWithDept/index.vue';
import ApplyTemp from '@/views/KSInventory/ApplyTemp/index.vue';
import IntroduceDefinedTemp from './aaaaccc.vue';
export default {
  props: ['KSDepartmentalPlanDataSearch', 'selection', 'datasourceList'],
  components: {
    IntroduceUserDefinedTemp,
    IntroduceDefinedTemp,
    ApplyTemp,
    BidVarInfoDept,
    ApplyOperateTip,
    VarietyDataLzhLook,
    DpetOneAuthWithDept
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      PlanNum: '',
      is_second_app: '',
      SerachName: '',
      SerachName2: '',
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
      visibleLine: 'none',
      isCollapse: true,
      radio1: '出库耗材登记'
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  watch: {},
  methods: {},
  created() {}
};
</script>
