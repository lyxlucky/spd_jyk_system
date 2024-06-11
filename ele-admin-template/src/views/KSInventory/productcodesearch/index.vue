<template>

    <el-container>
        <el-header height="350">
            <el-card shadow="always">
                <ele-pro-table :key="key" highlight-current-row ref="table" :height="defaultHeight"
                    :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes"
                    :columns="columns" :datasource="datasource" :selection.sync="selection"
                    cache-key="productSearchTable">
                    <!-- 表头工具栏 -->
                    <template v-slot:toolbar>
                        <div>
                            <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search"
                                @submit.native.prevent>
                                <el-row :gutter="10">
                                    <el-col style="padding-left: 0px"
                                        v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
                                        <div class="block">
                                            <el-input size="small" placeholder="请输入产品UDI">
                                            </el-input>
                                        </div>
                                    </el-col>
                                    <el-col style="padding-left: 0px"
                                        v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
                                        <div class="block">
                                            <el-input size="small" value="01008858360711611116103117260930102869847" placeholder="">
                                            </el-input>
                                        </div>
                                    </el-col>
                                    <el-col v-bind="styleResponsive ? { lg: 10, md: 4 } : { span: 4 }">
                                        <div class="ele-form-actions">
                                            <el-button size="small" type="primary" icon="el-icon-search"
                                                class="ele-btn-icon" @click="search">
                                                查询
                                            </el-button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </template>
                </ele-pro-table>
            </el-card>
        </el-header>
        <el-main style="padding-top: 20px">
            <el-card shadow="always">
                <el-steps :active="2" align-center>
                    <el-step title="采购入库" description="2024-05-16"></el-step>
                    <!-- <el-step title="扫码出库" description="王凯锋 2023-11-10"></el-step> -->
                    <el-step title="扫码出库" description="王凯锋 2024-05-16"></el-step>
                    <el-step title="复合" description="晏江彬 2024-05-17"></el-step>
                    <el-step title="配送调度" description="粤B23B7B 2024-05-18"></el-step>
                    <el-step title="医院签收" description="2024-05-19"></el-step>
                </el-steps>
            </el-card>
        </el-main>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            // 表格列配置
            columns: [
                {
                    columnKey: 'index',
                    label: '序号',
                    type: 'index',
                    width: 50,
                    align: 'center',
                    showOverflowTooltip: true,
                    fixed: 'left'
                },
                {
                    prop: 'CURRENT_STATE',
                    label: '当前状态',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'PEOPLE_NUM',
                    label: '病患身份证号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'CODE',
                    label: '产品UDI',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110
                },
                {
                    prop: 'PRODUCT_NAME',
                    label: '产品名称',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110
                },
                {
                    prop: 'PLATFORM',
                    label: '规格型号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'PC_NUM',
                    label: '批号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'LIVE_DATE',
                    label: '效期',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'UNIT',
                    label: '单位',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'NUM',
                    label: '数量',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80
                },
                {
                    prop: 'PRICE',
                    label: '单价（元）',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80
                },
                {
                    prop: 'TOTAL_PRICE',
                    label: '金额（元）',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80
                },
                {
                    prop: 'BELONG',
                    label: '物资属性',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80
                },
            ],
            toolbar: false,
            pageSize: 2,
            pagerCount: 2,
            pageSizes: [2, 5, 10, 20, 50, 100, 9999999],
            // 表格选中数据
            selection: [],
            // 当前编辑数据
            current: null,
            // datasource: [],
            data: [],
            key: 0,
            defaultHeight: '17vh'
        }
    },
    methods: {
        datasource({ page, limit, where, order }) {
            let data = {
                "code": "200",
                "msg": "查询完成",
                "total": 31,
                "result": [
                    {
                        "CURRENT_STATE": "医院签收",
                        "CODE": "01008858360711611116103117260930102869847",
                        "PRODUCT_NAME": "髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头",
                        "PLATFORM": "1个/盒",
                        "PC_NUM": "2869847",
                        "PEOPLE_NUM":"未回传",
                        "LIVE_DATE": "2026-09-30",
                        "UNIT": "个",
                        "NUM": 1,
                        "PRICE": "1984.00",
                        "TOTAL_PRICE": "1984.00",
                        "BELONG": "高值",
                    }
                ]
            }
            let back = JSON.parse(JSON.stringify(data));
            let table = {
                count: back.total,
                list: back.result
            };
            return table;
        },
        /* 刷新表格 */
        reload(where) {
            this.$refs.table.reload({ page: 1, where: where });
        },
    },
}
</script>

<style></style>