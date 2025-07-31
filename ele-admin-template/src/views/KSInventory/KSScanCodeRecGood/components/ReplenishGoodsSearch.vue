<!-- 搜索表单 -->
<template>
  <div>
    <el-form
      label-width="0px"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <!-- <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
          <el-button size="mini" type="primary" @click="openScanDialog">扫码入库</el-button>
        </el-col>
      </el-row> -->
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
          <el-input
            size="mini"
            clearable
            v-model="where.stock_out_distribute_number"
            placeholder="请输入补货单号"
          />
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
            style="width: 100%"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 24, md: 24 } : { span: 24 }">
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
            <el-button icon="el-icon-refresh" size="mini" @click="reset"
              >重置</el-button
            >
            <el-button size="mini" type="primary" @click="openScanDialog"
              >扫码入库</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 扫码对话框 -->
    <el-dialog
      title="扫码入库"
      :visible.sync="scanDialogVisible"
      width="400px"
      @close="closeScanDialog"
    >
      <el-input
        size="mini"
        id="idDistributeNumber"
        clearable
        v-model="DistributeNumber"
        style="border: 1px solid black; border-radius: 5px"
        placeholder="请扫码入库"
        @change="confirmScan"
        ref="scanInput"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeScanDialog">取消</el-button>
        <el-button type="primary" @click="confirmScan">确定</el-button>
      </div>
    </el-dialog>
  </div>
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
        scanDialogVisible: false,
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
      /* 打开扫码对话框 */
      openScanDialog() {
        this.scanDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.scanInput.focus();
        });
      },
      /* 关闭扫码对话框 */
      closeScanDialog() {
        this.scanDialogVisible = false;
        this.DistributeNumber = '';
      },
      /* 确认扫码 */
      confirmScan() {
        if (!this.DistributeNumber) {
          this.$message.warning('请输入扫码内容');
          return;
        }
        this.onSubmit();
      },
      onSubmit() {
        const loading = this.$messageLoading('正在处理中...');
        var data = {
          DistributeNumber: this.DistributeNumber
        };
        DeptReceivingScanOrder(data)
          .then((res) => {
            loading.close();
            this.scanDialogVisible = false;
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
<style></style>
