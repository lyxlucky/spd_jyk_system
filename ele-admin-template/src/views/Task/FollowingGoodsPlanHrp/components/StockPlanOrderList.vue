<template>
  <div class="ele-body">
    <el-card>
        <div slot="header">备货计划单号列表</div>
        <div>
            <el-form :model="form" :inline="true" size="mini">
                <!-- 供应商名称搜索 -->
                <el-form-item>
                    <el-input v-model="form.supplier_name" placeholder="请输入供应商名称" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-form-item>
                
                <!-- 备货计划单号搜索 -->
                <el-form-item>
                    <el-input v-model="form.stock_up_plan_no" placeholder="请输入备货计划单号" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-form-item>
                
                <!-- 审批状态选择 -->
                <el-form-item label="审批状态：">
                    <el-select v-model="form.approve_state" style="width: 120px" @change="handleSearch" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未审批" value="0"></el-option>
                        <el-option label="已审批" value="1"></el-option>
                    </el-select>
                </el-form-item>
                
                <!-- 跟踪状态选择 -->
                <el-form-item label="跟踪状态：">
                    <el-select v-model="form.send_state" style="width: 120px" @change="handleSearch" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未发送" value="0"></el-option>
                        <el-option label="已发送" value="1"></el-option>
                        <el-option label="已查看" value="2"></el-option>
                        <el-option label="处理中" value="3"></el-option>
                        <el-option label="部分送货" value="4"></el-option>
                        <el-option label="全部送货" value="5"></el-option>
                        <el-option label="部分收货" value="6"></el-option>
                        <el-option label="全部收货" value="7"></el-option>
                        <el-option label="强制结束" value="8"></el-option>
                    </el-select>
                </el-form-item>
                
                
                
                <!-- 过滤强制关闭订单 -->
                <!-- <el-form-item>
                    <el-checkbox v-model="form.isQZJS" @change="handleSearch">过滤强制关闭订单</el-checkbox>
                </el-form-item> -->
                
                <!-- 日期范围选择 -->
                <el-form-item label="订单创建日期：" style="display: none;">
                    <el-date-picker
                        v-model="form.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleSearch">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                </el-form-item>

                <!-- 按钮组 -->
                <el-form-item>
                    <el-button type="default" icon="el-icon-back" @click="handleSearchAll">返回查看所有</el-button>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" :disabled="!hasSelection" @click="handleApproveAndSend">审批并发送备货单</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="!hasSelection" @click="handleResend">补发送备货单</el-button>
                </el-form-item> -->
                <!-- <el-form-item>
                    <el-button type="primary" @click="handleBatchApprove">批量审批并发送</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdateFunds">修改资金来源</el-button>
                </el-form-item> -->
            </el-form>
            
            <div>
                <ele-pro-table 
                    size="mini" 
                    ref="table" 
                    height="250px" 
                    :columns="columns"
                    :datasource="datasource" 
                    :paging="false"
                    highlight-current-row
                    @row-click="handleRowClick"
                    @selection-change="handleSelectionChange">
                </ele-pro-table>
            </div>
        </div>
    </el-card>
  </div>
</template>

<script>
import { getStockUpList } from '@/api/Task/FollowingGoodsPlanHrp'
export default {
  name: 'StockPlanOrderList',
  components: {
  },
  props: {
    currentTableRow2: {
      type: Object,
      default: () => {}
    },
    currentTableRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
        form: {
            start_time: '',
            end_time: '',
            order_state: '',
            varietie_code: '',
            stock_up_plan_no: '',
            supplier_name: '',
            approve_state: '',
            send_state: '',
            coefficient: '',
            SENDHRP: '',
            isQZJS: true,  // 默认选中过滤强制关闭订单
            CREATOR: '',
            BZ: '',
            dateRange: []  // 日期范围
        },
        selectedRows: [],  // 选中的行
        hasSelection: false,  // 是否有选中的行
        columns: [
          {
            type: 'selection',
            width: 45,
            align: 'center'
          },
          {
            label: '备货计划单号',
            prop: 'STOCK_UP_PLAN_NO',
            minWidth: 120,
            align: 'center'
          },
          {
            label: '总金额',
            prop: 'SUM_MONEY',
            minWidth: 100,
            align: 'center',
            formatter: (row) => {
              return row.SUM_MONEY.toFixed(2);
            }
          },
          // {
          //   label: '资金来源',
          //   prop: 'FUNDS_SOURCE',
          //   width: 140,
          //   visible: false,
          //   align: 'center',
          //   formatter: (row) => {
          //     // 1.自籌資金2.政府補助3.科教項目4.財政+自籌5.財政轉款(行政辦事處)6.財政轉款(辦業費用)
          //     if (row.FUNDS_SOURCE == 1) {
          //       return "自籌資金";
          //     } else if (row.FUNDS_SOURCE == 2) {
          //       return "政府補助";
          //     } else if (row.FUNDS_SOURCE == 3) {
          //       return "科教項目";
          //     } else if (row.FUNDS_SOURCE == 4) {
          //       return "財政+自籌";
          //     } else if (row.FUNDS_SOURCE == 5) {
          //       return "財政轉款(行政辦事處)";
          //     } else if (row.FUNDS_SOURCE == 6) {
          //       return "財政轉款(辦業費用)";
          //     } else {
          //       return "未設定";
          //     }
          //   }
          // },
          {
            label: '供应商名称',
            prop: 'SUPPLIER_NAME',
            minWidth: 150,
            align: 'center'
          },
          {
            label: '所属库区',
            prop: 'NAME',
            minWidth: 100,
            align: 'center'
          },
          {
            label: '创建人',
            prop: 'CREATOR',
            width: 100,
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'CREATE_TIME',
            width: 150,
            align: 'center',
            sortable: true
          },
          {
            label: '审核状态/审核人/审核时间',
            minWidth: 180,
            align: 'center',
            formatter: (row) => {
              if (row.APPROVE_TWO_STATE == 0) {
                return '未审核';
              } else if (row.APPROVE_TWO_STATE == 1) {
                return '已审核' + "/" + row.APPROVE_TWO_MAN + "/" + row.APPROVE_TWO_TIME;
              } else if (row.APPROVE_TWO_STATE == 2) {
                return '不通过';
              } else {
                return '未知';
              }
            }
          },
          {
            label: '审批状态',
            prop: 'APPROVE_STATE',
            width: 100,
            align: 'center',
            formatter: (row) => {
              if (row.APPROVE_STATE == 0) {
                return '未审批';
              } else if (row.APPROVE_STATE == 1) {
                return '已审批';
              } else if (row.APPROVE_STATE == 2) {
                return '不通过';
              } else {
                return '未知';
              }
            }
          },
          {
            label: '审批人',
            prop: 'APPROVER',
            width: 100,
            align: 'center'
          },
          {
            label: '审批时间',
            prop: 'APPROVE_TIME',
            width: 150,
            align: 'center',
            formatter: (row) => {
              if (row.APPROVE_STATE == 0) {
                return '';
              } else {
                return row.APPROVE_TIME;
              }
            }
          },
          {
            label: '跟踪状态',
            prop: 'SEND_STATE',
            width: 120,
            align: 'center',
            formatter: (row) => {
              if (row.SEND_STATE == 0) {
                return '未发送(SPD)';
              } else if (row.SEND_STATE == 1) {
                return '已发送(SPD)';
              } else if (row.SEND_STATE == 2) {
                return '已查看(B2B)';
              } else if (row.SEND_STATE == 3) {
                return '处理中(B2B)';
              } else if (row.SEND_STATE == 4) {
                return '部分送货(B2B)';
              } else if (row.SEND_STATE == 5) {
                return '全部送货(B2B)';
              } else if (row.SEND_STATE == 6) {
                return '部分收货(SPD)';
              } else if (row.SEND_STATE == 7) {
                return '全部收货(SPD)';
              } else if (row.SEND_STATE == 8) {
                return '强制结束(SPD)';
              } else {
                return '未知';
              }
            }
          },
          {
            label: '最新状态跟踪时间',
            prop: 'TRACK_TIME',
            width: 150,
            align: 'center'
          },
          {
            label: '是否提交HRP',
            prop: 'SENDHRP',
            width: 120,
            align: 'center',
            formatter: (row) => {
              if (row.SENDHRP == 1) {
                return '已提交';
              } else {
                return '未提交';
              }
            }
          }
        ]
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 处理查询
    handleSearch() {
      this.$refs.table.reload();
    },
    handleRowClick(row) {
      this.$emit('onRowClick', row);
    },
    
    // 返回查看所有
    handleSearchAll() {
      // 重置表单
      this.form = {
        start_time: '',
        end_time: '',
        order_state: '',
        varietie_code: '',
        stock_up_plan_no: '',
        supplier_name: '',
        approve_state: '',
        send_state: '',
        coefficient: '',
        SENDHRP: '',
        isQZJS: true,
        CREATOR: '',
        BZ: '',
        dateRange: []
      };
      this.handleSearch();
    },
    
    // 处理表格选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection;
      this.hasSelection = selection.length > 0;
    },
    
    // 审批并发送备货单
    handleApproveAndSend() {
      if (!this.hasSelection) {
        this.$message.warning('请先选择要操作的数据');
        return;
      }
      // 实现审批并发送备货单的逻辑
      this.$message.success('审批并发送备货单操作成功');
    },
    
    // 补发送备货单
    handleResend() {
      if (!this.hasSelection) {
        this.$message.warning('请先选择要操作的数据');
        return;
      }
      // 实现补发送备货单的逻辑
      this.$message.success('补发送备货单操作成功');
    },
    
    // 批量审批并发送
    handleBatchApprove() {
      // 实现批量审批并发送的逻辑
      this.$message.success('批量审批并发送操作成功');
    },
    
    // 修改资金来源
    handleUpdateFunds() {
      // 实现修改资金来源的逻辑
      this.$message.success('修改资金来源操作成功');
    },
    
    // 数据源方法
    datasource({page, limit, sort, where}) {
      // 处理日期范围
      // if (this.form.dateRange && this.form.dateRange.length === 2) {
      //   this.form.start_time = this.form.dateRange[0];
      //   this.form.end_time = this.form.dateRange[1];
      // }
      // where.supplier_name = this.form.supplier_name;
      // where.stock_up_plan_no = this.form.stock_up_plan_no;
      // where.approve_state = this.form.approve_state;
      // where.send_state = this.form.send_state;
      
      return getStockUpList({
        page,
        limit,
        sort,
        where: {
          ...where,
          supplier_name: this.form.supplier_name,
          stock_up_plan_no: this.form.stock_up_plan_no,
          approve_state: this.form.approve_state,
          send_state: this.form.send_state,
          order_state:this.currentTableRow.ORDER_STATE,
          varietie_code:this.currentTableRow2.Varietie_Code_New,
          // isQZJS: this.form.isQZJS ? 1 : 0,
          // start_time: this.form.start_time,
          // end_time: this.form.end_time
        }
      }).then(res => {
        let data = res.data;
        if (data.code == "200") {
          return {
            list: data.result,
            count: data.total
          }
        }
        return {
          list: [],
          count: 0
        }
      }).catch(err => {
        return {
          list: [],
          count: 0
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
