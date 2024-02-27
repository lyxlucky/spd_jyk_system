<!-- 搜索表单 -->
<template>
  <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="品种编码：" label-width='100px'>
          <el-input clearable v-model="where.VARIETIE_CODE_NEW" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="品种名称：" label-width='100px'>
          <el-input clearable v-model="where.PROD_REGISTRATION_NAME" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="规格型号:" label-width='100px'>
          <el-input clearable v-model="where.GG" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="注册证号:" label-width='100px'>
          <el-input clearable v-model="where.APPROVAL_NUMBER" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="供应商:" label-width='100px'>
          <el-input clearable v-model="where.SUP_NAME" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="生产企业:" label-width='100px'>
          <el-input clearable v-model="where.MANUFACTURING_ENT_NAME" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="使用科室:" label-width='100px'>
          <el-input clearable v-model="where.USE_DEPT" placeholder="" />
        </el-form-item>
      </el-col>
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="导入时间:" label-width='100px'>
          <el-input clearable v-model="where.SerachName" placeholder="" />
        </el-form-item>
      </el-col> -->
      <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <div class="block">
          <el-form-item label="导入时间:" label-width='100px'>
            <el-date-picker v-model="where.start_time" type="date" style="width:140px" value-format="yyyy-MM-dd" placeholder="导入开始日期">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 2, md: 4 } : { span: 4 }">
        <div class="block">
          <el-date-picker v-model="where.end_time" type="date" style="width:140px" value-format="yyyy-MM-dd" placeholder="导入结束日期">
          </el-date-picker>
        </div>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="合同编码:" label-width='100px'>
          <el-input clearable v-model="where.CONTRACT_CODE" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="合同开始:" label-width='100px'>
          <el-input clearable v-model="where.CREATE_BATCH" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="合同结束:" label-width='100px'>
          <el-input clearable v-model="where.CREATE_BATCH2" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="在用状态：" label-width='100px'>
          <el-select v-model="where.IS_HAVE" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="已申请" value="2"></el-option>
            <el-option label="未使用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <div style="display: none;">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="是否高值:" label-width='100px'>
            <el-select v-model="where.HIGH_OR_LOW_CLASS" @change="search()">
              <el-option label="全部" value=""></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="重点治理:" label-width='100px'>
            <el-select v-model="where.IS_IN_COUNTRY_IMPORT" @change="search()">
              <el-option label="全部" value=""></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="重点治理序号:" label-width='100px'>
            <el-input clearable v-model="where.HIGH_CLASS_XH" placeholder="" />
          </el-form-item>
        </el-col>
      </div>
      <el-col v-bind="styleResponsive ? { lg: 10, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
            导出
          </el-button>
          <el-button type="primary" class="ele-btn-icon" @click="ApplyToVarietyDataLzhLook()">申请至再用目录</el-button>
          <el-button type="danger" class="ele-btn-icon" @click="CalApplyToVarietyDataLzhLook()">取消申请至再用目录</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { CreateTempletDeta } from '@/api/KSInventory/BidVarInfoDept';
export default {
  props: ['selection'],
  data() {
    // 默认表单数据
    const defaultWhere = {
      VARIETIE_CODE_NEW: '',
      PROD_REGISTRATION_NAME: '',
      GG: '',
      APPROVAL_NUMBER: '',
      SUP_NAME: '',
      MANUFACTURING_ENT_NAME: '',
      USE_DEPT: '',
      IS_ENABLE: '',
      IS_HAVE: '',
      IS_USE: '',
      IS_IN_COUNTRY_IMPORT: '',
      CONTRACT_CODE: '',
      CREATE_BATCH: '',
      CREATE_BATCH2: '',
      start_time: '',
      HIGH_OR_LOW_CLASS: '',
      HIGH_CLASS_XH: '',
      IS_PRICE: '',
      KC: '',
      end_time: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere }
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
      this.$emit('search', { ...this.where });
    },
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.search();
    },
    exportData() {
      this.$emit('exportData', this.where);
    },
    ApplyToVarietyDataLzhLook() {
      if (this.selection == undefined) {
        this.$message.warning('请选择数据');
        return;
      }
      const loading = this.$messageLoading('保存中。。。');
      var data = this.selection;
      data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      data.state = 3;
      CreateTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    CalApplyToVarietyDataLzhLook() {
      console.log(this.selection);
      if (this.selection == undefined) {
        this.$message.warning('请选择数据');
        return;
      }
      const loading = this.$messageLoading('保存中。。。');
      var data = this.selection;
      data.dept_two_code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      data.state = 0;
      CreateTempletDeta(data)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    }
  },
  created() {
    // 获取各种类型当前时间
    var date = new Date(); //获取当前时间国标版
    var year = date.getFullYear(); // 获取年
    var month = date.getMonth() + 1; //获取当前月
    var day = date.getDate(); //日
    var now_time = year + '-' + month + '-' + day;
    this.where.EndTime = now_time;

    //获取7天前的时间
    var now2 = new Date();
    var date2 = new Date(now2.getTime() - 7 * 24 * 3600 * 1000);
    var year2 = date2.getFullYear();
    var month2 = date2.getMonth() + 1;
    var day2 = date2.getDate();
    var now_time2 = year2 + '-' + month2 + '-' + day2;
    this.where.StartTime = now_time2;
  }
};
</script>
