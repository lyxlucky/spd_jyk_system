<!-- 搜索表单 -->
<template>
  <el-form label-width="0px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-input size="mini" id="idDistributeNumber" clearable v-model="DistributeNumber" style="border:1px solid black; border-radius: 5px;" placeholder="请扫码入库" @change="onSubmit" />
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.stock_out_distribute_number" placeholder="请输入补货单号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-date-picker
          size="mini"
          v-model="deliveryDateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="onDeliveryDateChange"
          style="width: 100%">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 24, md: 24 } : { span: 24 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { DeptReceivingScanOrder } from '@/api/KSInventory/KSInventoryQuery';
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      stock_out_distribute_number: '',
      delivery_start_date: '',
      delivery_end_date: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      DistributeNumber: null,
      deliveryDateRange: null,
      rules: {
        // TempletName: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     message: '请输入模板名称'
        //   }
        // ]
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
      this.deliveryDateRange = null;
      this.search();
    },
    /* 送货时间范围变化处理 */
    onDeliveryDateChange(dateRange) {
      if (dateRange && dateRange.length == 2) {
        this.where.delivery_start_date = dateRange[0];
        this.where.delivery_end_date = dateRange[1];
      } else {
        this.where.delivery_start_date = '';
        this.where.delivery_end_date = '';
      }
    },
    onSubmit() {
      const loading = this.$messageLoading('正在处理中...');
      var data = {
        DistributeNumber: this.DistributeNumber
      };
      DeptReceivingScanOrder(data)
        .then((res) => {
          document.getElementById('idDistributeNumber').focus();
          loading.close();
          this.showEdit = false;
          this.$emit('search', this.where);
          // this.$message.success(res.msg);
          this.$alert(res.msg, '提示', {
            confirmButtonText: '确定',
            type: 'success',
            callback: (action) => {
              // this.$message({
              //   type: 'info',
              //   message: `action: ${action}`
              // });
            }
          });
          this.DistributeNumber = '';
        })
        .catch((err) => {
          document.getElementById('idDistributeNumber').focus();
          loading.close();
          // this.$message.error(err);
          this.$alert(err, '提示', {
            confirmButtonText: '确定',
            type: 'error',
            callback: (action) => {
              // this.$message({
              //   type: 'error',
              //   message: `action: ${action}`
              // });
            }
          });
          this.DistributeNumber = '';
        });
    }
  },
  created() {}
};
</script>
<style>

</style>