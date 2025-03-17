<template>
    <div class="ele-body">
        <el-card>
            <div slot="header">状态汇总统计</div>
            <div>
                <el-form :inline="true" size="mini">
                    <el-form-item>
                        <el-date-picker v-model="dateRange[0]" type="date" placeholder="yyyy-MM-dd"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="dateRange[1]" type="date" placeholder="yyyy-MM-dd"
                                format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryToday">查询当天</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="queryLast30Days">查询近30天</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>
                    
                    <!-- <el-row :gutter="20">
                        <el-col :span="6">
                            <el-button type="primary">查询当天</el-button>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary">查询近30天</el-button>
                        </el-col>
                        <el-col :span="6">
                            <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
                        </el-col>
                    </el-row> -->

                </el-form>

                <!-- 上半部分表格 - 状态统计 -->
                <ele-pro-table size="mini" ref="summaryTable" height="250px" :columns="summaryColumns"
                    highlight-current-row
                    :datasource="summaryDatasource" cache-key="followingGoodsPlanHrpSummaryTable" :paging="false" 
                    @row-click="handleRowClick"
                    >
                </ele-pro-table>
            </div>
        </el-card>

    </div>
</template>

<script>
import { getStockUpStateList } from '@/api/Task/FollowingGoodsPlanHrp'
export default {
    name: 'StatusSummaryStatistics',
    components: {
    },
    props: {
        
    },
    data() {
        return {
            
            dateRange: ['', ''],
            summaryColumns: [
                {
                    label: '订单状态',
                    prop: 'ORDER_STATE',
                    align: 'center',
                    width: '120px',
                    formatter: (row) => {
                        if (row.ORDER_STATE == '0') {
                            return '未发送(SPD)';
                        } else if (row.ORDER_STATE == '1') {
                            return '已发送(SPD)';
                        } else if (row.ORDER_STATE == '2') {
                            return '已查看(B2B)';
                        } else if (row.ORDER_STATE == '3') {
                            return '处理中(B2B)';
                        } else if (row.ORDER_STATE == '4') {
                            return '部分送货(B2B)';
                        } else if (row.ORDER_STATE == '5') {
                            return '全部送货(B2B)';
                        } else if (row.ORDER_STATE == '6') {
                            return '部分收货(SPD)';
                        } else if (row.ORDER_STATE == '7') {
                            return '全部收货(SPD)';
                        } else if (row.ORDER_STATE == '8') {
                            return '强制结束(SPD)';
                        } else if (row.ORDER_STATE == "") {
                            return '全部';
                        } else {
                            return '未知';
                        }
                    }
                },
                {
                    label: '合计品种数',
                    prop: 'VARIETIE_CODE_NUM',
                    align: 'center',
                },
                {
                    label: '计划单数',
                    prop: 'STOCKUP_NUM',
                    align: 'center',
                }
            ],
        }
    },
    computed: {
    },
    methods: {
        search(e) {
            // 执行查询操作
        },
        summarySelection(e) {

        },
        handleRowClick(row, column, event) {
            this.$emit('onClickRow', row);
        },
        // 查询当天数据
        queryToday() {
            const today = new Date();
            const formattedDate = today.getFullYear() + '-' + 
                String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                String(today.getDate()).padStart(2, '0');
            
            this.dateRange = [formattedDate, formattedDate];
            this.handleSearch();
        },
        // 查询近30天数据
        queryLast30Days() {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 29); // 设置为30天前（包括今天）
            
            const formattedToday = today.getFullYear() + '-' + 
                String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                String(today.getDate()).padStart(2, '0');
                
            const formattedThirtyDaysAgo = thirtyDaysAgo.getFullYear() + '-' + 
                String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0') + '-' + 
                String(thirtyDaysAgo.getDate()).padStart(2, '0');
            
            this.dateRange = [formattedThirtyDaysAgo, formattedToday];
            this.handleSearch();
        },
        handleSearch() {
            // 刷新表格数据
            this.$refs.summaryTable.reload();
        },
        summaryDatasource({ page, limit, sort, where }) {
            // 返回表格数据源
            return getStockUpStateList({
                page: 1, 
                limit: 9999,  // 获取所有数据
                sort, 
                where: {
                    ...where,
                    start_time: this.dateRange[0],
                    end_time: this.dateRange[1]
                },  
            }).then(res => {
                let data = res.data
                if (data.code === "200") {
                    return {
                        count: data.total,
                        list: data.result
                    };
                }
                return {
                    count: 0,
                    list: []
                };
            }).catch(err => {
                return {
                    count: 0,
                    list: []
                };
            });

        }
    }
}
</script>

<style lang="scss" scoped></style>
