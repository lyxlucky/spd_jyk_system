<template>
    <div class="ele-body">
        <el-card shadow="never">
            <!-- 搜索表单 -->
            <el-form class="form-box" :inline="true">
                <el-form-item label="注册证名称">
                    <el-input size="mini" v-model="where.PROD_REGISTRATION_NAME" placeholder="注册证名称:" clearable />
                </el-form-item>
                <el-form-item label="注册证号:">
                    <el-input size="mini" v-model="where.APPROVAL_NUMBER" placeholder="注册证号" clearable />
                </el-form-item>
                <el-form-item label="采购数量:">
                    <el-select v-model="where.CountState" id="PrchaseDataV2_CountState"
                        style="height:30px;font-size:12px;float:left;" onchange="reloadlrJykOrderTable1Table1()">
                        <el-option value="" style="height:30px;" label="全部"></el-option>
                        <el-option value="0" style="height:30px;" label="等于消耗"></el-option>
                        <el-option value="1" style="height:30px;" label="大于消耗"></el-option>
                        <el-option value="2" style="height:30px;" label="小于消耗"></el-option>
                        <el-option value="3" style="height:30px;" label="大于等于消耗"></el-option>
                        <el-option value="4" style="height:30px;" label="小于等于消耗"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结束日期:">
                    <el-select v-model="where.last" id="PrchaseDataV2_last"
                        style="height:30px;font-size:12px;float:left;" onchange="reloadlrJykOrderTable1Table1()">
                        <el-option value="0" style="height:30px;" label="未过期"></el-option>
                        <el-option value="" style="height:30px;" label="全部"></el-option>
                        <el-option value="1" style="height:30px;" label="已过期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起始:">
                    <!-- <el-input size="mini" v-model="where.statrTime" placeholder="起始" clearable /> -->
                    <el-date-picker v-model="where.statrTime" type="date" placeholder="起始" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="至:">
                    <el-date-picker v-model="where.endTime" type="date" placeholder="起始" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />

                </el-form-item>
                <el-form-item label="结束:">
                    <el-date-picker v-model="where.statrTime2" type="date" placeholder="结束" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />''
                </el-form-item>


                <el-form-item label="至:">
                    <!-- <el-input size="mini" v-model="where.endTime2" placeholder="至:" clearable /> -->
                    <el-date-picker v-model="where.endTime2" type="date" placeholder="至" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />
                </el-form-item>
                <!-- <el-form-item label="来源:">
                    <el-input size="mini" v-model="where.keyword" placeholder="来源" clearable />
                </el-form-item>
                <el-form-item label="价格:">
                    <el-input size="mini" v-model="where.keyword" placeholder="价格" clearable />
                </el-form-item> -->
                <p>
                    <el-form-item>
                        <el-input size="mini" v-model="where.SOURCE_FROM" placeholder="来源" clearable />
                    </el-form-item>

                    <el-form-item label="价格:">
                        <el-input size="mini" v-model="where.PRICE" placeholder="价格" clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-input size="mini" v-model="where.MANUFACTURING_ENT_NAME" placeholder="生产企业/备注" clearable />
                    </el-form-item>
                    <el-form-item>

                        <el-input size="mini" v-model="where.VARIETIE_CODE_NEW" placeholder="品种名称/编码" clearable />
                    </el-form-item>


                    <el-form-item>

                        <el-select v-model="where.XM_NAME" id="PrchaseDataV2_XM_NAME" name="PrchaseDataV2_XM_NAME"
                            lay-filter="PrchaseDataV2_XM_NAME" style="height:31px;width:200px;float:left" lay-search=""
                            onchange="reloadPrchaseDataV2Table1Table1()">
                            <el-option value="" label="全部"></el-option>
                            <el-option v-for="item in XM_NAMEoptions" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item>

                        <el-select v-model="where.XM_NUM" id="PrchaseDataV2_XM_NUM" name="PrchaseDataV2_XM_NUM"
                            lay-filter="PrchaseDataV2_XM_NUM" style="height:31px;width:200px;float:left" lay-search=""
                            onchange="reloadPrchaseDataV2Table1Table1()">
                            <el-option value="" label="全部"></el-option>
                            <el-option v-for="item in XM_NUMoptions" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>

                        </el-select>
                    </el-form-item> <el-form-item>
                        <el-select v-model="where.XM_TYPE" id="PrchaseDataV2_XM_TYPE" name="PrchaseDataV2_XM_TYPE"
                            lay-filter="PrchaseDataV2_XM_TYPE" style="height:31px;width:200px;float:left" lay-search=""
                            onchange="reloadPrchaseDataV2Table1Table1()">
                            <el-option value="" label="全部"></el-option>
                            <el-option v-for="item in XM_TYPEoptions" :key="item.value" :value="item.value"
                                :label="item.label"></el-option>

                        </el-select>
                    </el-form-item>

                </p>

                <!-- <el-form-item> -->
                <!-- <el-select class="where-enable" size="mini" v-model="where.enable" placeholder="状态">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select> -->
                <!-- </el-form-item> -->
                <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="reload">
                        搜索
                    </el-button>
                </el-form-item>
            </el-form>
            <!-- 数据表格 -->
            <ele-pro-table ref="table" class="table-PrchaseDataV2" :columns="columns" :currentPage="page"
                :pageSize="size" :highlightCurrentRow="true" :datasource="datasource" @current-change="onCurrentChange"
                @size-change="onSizeChange">
            </ele-pro-table>
        </el-card>
    </div>
</template>

<style scoped>
/* .form-box{
        display: flex;
        gap: 10px;
    } */
.where-enable {
    width: 5rem;
}
</style>

<script>
import { getPROD_REGISTRATION_LIMIT_BUYV2List, InitVarLimitBuyXMClassV2 } from '@/api/Statistics/NewPrchaseDataV2';
import { Loading } from 'element-ui';


export default {
    data() {
        return {
            //表格数据源
            NewPrchaseDataV2List: [],
            // 条件
            where: {
                PROD_REGISTRATION_NAME: "",
                APPROVAL_NUMBER: "",
                MANUFACTURING_ENT_NAME: "",
                SOURCE_FROM: "",
                statrTime: "",
                endTime: "",
                statrTime2: "",
                endTime2: "",
                CountState: "",
                order: "",
                field: "",
                last: "",
                XM_NAME: "",
                XM_NUM: "",
                XM_TYPE: "",
                PRICE_STR: "",
                VARIETIE_CODE_NEW: "",
                deptTwoCode: -1,
                // keyword:'',
                // enable:'1',
            },
            //页
            page: 1,
            size: 10,
            //字段列表
            columns: [
                // {
                //     width: 45,
                //     type: 'selection',
                //     columnKey: 'selection',
                //     align: 'center'
                // },
                {
                    columnKey: 'index',
                    type: 'index',
                    width: 66,
                    label: '操作',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'PROD_SOURCE_FROM',
                    label: '自定义来源',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        if (value == null) {
                            return '编辑'
                        }
                        return value
                    },
                },
                {
                    prop: 'PROD_REGISTRATION_NAME',
                    label: '注册证名称',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        if (value == null) {
                            return row.PROD_REGISTRATION_NAME2
                        }
                        return value
                    },

                },
                {
                    prop: 'APPROVAL_NUMBER',
                    label: '批准文号',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                    , formatter: (row, column, value) => {
                        if (value == null) {
                            return row.APPROVAL_NUMBER2
                        }
                        return value
                    },
                }, {
                    prop: 'MANUFACTURING_ENT_NAME',
                    label: '生产企业',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                    , formatter: (row, column, value) => {
                        if (value == null) {
                            return row.MANUFACTURING_ENT_NAME2
                        }
                        return value
                    },
                },
                {
                    prop: 'BUY_TIME',
                    label: '起始日期',
                    minWidth: 320,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                    , formatter: (row, column, value) => {
                        return value.substr(0, 10)
                    },
                },
                {
                    prop: 'BUY_TIME2',
                    label: '结束日期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter(row, col, value) {
                        return value.substr(0, 10)
                    }

                },
                {
                    prop: 'PRICE',
                    label: '单价',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'COUNT',
                    label: '计划数量',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'GOODS_QTY',
                    label: '已消耗数量',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'COUNT-GOODS_QTY',
                    label: '余可用数量',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'WCL',
                    label: '完成率',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        return value.toFixed(2) + '%'
                    }
                },
                {
                    prop: 'shProcess',
                    label: '时序进度',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        const currentDate = new Date();
                        const startDate = new Date(row.BUY_TIME);
                        const endDate = new Date(row.BUY_TIME2);
                        // 如果当前日期早于起始日期
                        if (currentDate <= startDate) {
                            return "0.00%";
                        }

                        // 如果当前日期晚于结束日期
                        if (currentDate >= endDate) {
                            return "100.00%";
                        }
                        // 计算剔除边界的天数
                        const betweenDates = this.calculateDateDifferenceExcludingBoundaries(row.BUY_TIME, currentDate); // 开始到今天
                        const betweenStartAndEndDates =this. calculateDateDifferenceExcludingBoundaries(row.BUY_TIME, row.BUY_TIME2); // 开始到结束

                        // 计算百分比
                        const progress = (betweenDates / betweenStartAndEndDates) * 100;
                        return progress.toFixed(2) + "%";
                        // return value.toFixed(2) + '%'
                    }


                },
                {
                    prop: 'ADD_MAN',
                    label: '操作人',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        return value
                    }
                },

                {
                    prop: 'LAST_UPDATE_DATE',
                    label: '添加时间',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        return value.replace("T", " ")
                    }
                },


                {
                    prop: 'BH_COUNT',
                    label: '临时备货次数',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'ID',
                    label: 'ID',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'XM_NUM',
                    label: '项目编号',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                   
                },
                {
                    prop: 'XM_NAME',
                    label: '项目名称',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'XM_TYPE',
                    label: '项目类型',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'SOURCE_FROM',
                    label: '阳光来源',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'BZ',
                    label: '备注',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                }
            ],
            XM_NAMEoptions: [],
            XM_NUMoptions: [],
            XM_TYPEoptions: [],
        }
    },
    created() {
        this.Xm_SELECTclikc()
    },
    mounted() {
    },
    methods: {
        Xm_SELECTclikc() {
            InitVarLimitBuyXMClassV2().then((data) => {
                const datas = data.data;
                if (datas.code == "200") {
                    datas.XM_NAMElist.forEach(e => {
                        this.XM_NAMEoptions.push({
                            value: e.FIELDVALUE,
                            label: e.FIELDVALUE
                        });
                    });
                    datas.XM_NUMlist.forEach(e => {
                        this.XM_NUMoptions.push({
                            value: e.FIELDVALUE,
                            label: e.FIELDVALUE
                        });
                    });
                    datas.XM_TYPElist.forEach(e => {
                        this.XM_TYPEoptions.push({
                            value: e.FIELDVALUE,
                            label: e.FIELDVALUE
                        });
                    }); console.log('XM_TYPEoptions:', this.XM_TYPEoptions);

                }
            });

        },
        datasource({ page, limit, where, order }) {
            // where.keyword = this.where.keyword
            // where.enable = this.where.enable
            where = this.where
            let data = getPROD_REGISTRATION_LIMIT_BUYV2List({ page, limit, where, order }).then(
                (res) => {
                    var tData = {
                        count: res.total,
                        list: res.result
                    };
                    return tData;
                }
            );
            return data;
        },
        reload() {
            this.$refs.table.reload({ page: 1, where: this.where });
        },
        onCurrentChange(current) {
            console.log(current);
        },
        onSizeChange(e) {
            console.log(e);
        },

        calculateDateDifferenceExcludingBoundaries(startDate, endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start) || isNaN(end)) {
                throw new Error("请输入有效的日期格式 (YYYY-MM-DD 或 Date 对象)");
            }

            // 如果开始时间 >= 结束时间，直接返回 0
            if (start >= end) {
                return 0;
            }

            // 中间天数 = 总天数
            const differenceInMs = end - start;
            const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

            return Math.floor(differenceInDays); // 返回整数天数
        }



    }
}
</script>
