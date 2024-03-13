<template>
    <div class="quotation-plan">
        <ele-modal width="1500px" :centered="true" :visible="visible" :close-on-click-modal="true"
            custom-class="ele-dialog-form" title="引入模板品种" @update:visible="updateVisible">
            <!-- Your code goes here -->
            <el-container>
                <el-aside width="350px">
                    <el-card shadow="none">
                        <el-menu class="el-menu-demo" mode="horizontal">
                            <el-menu-item index="1">模板列表</el-menu-item>
                        </el-menu>

                        <ele-pro-table ref="leftTable" height="500px" :pageSize="leftPageSize"
                            :pageSizes="leftPageSizes" :columns="leftColumns" :datasource="leftDatasource"
                            :rowClickChecked="true" :rowClickCheckedIntelligent="false"
                            @current-change="onLeftSelectionChange" cache-key="leftTableKey">
                            <template v-slot:toolbar>
                                <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
                                    <el-row>
                                        <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 6 }">
                                            <el-form-item>
                                                <el-input clearable v-model="where.SerachName" placeholder="请输入模板名称" />
                                            </el-form-item>

                                            <el-form-item>
                                                <el-button type="primary" icon="el-icon-search" class="ele-btn-icon"
                                                    @click="leftTableReload">
                                                    查询
                                                </el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </ele-pro-table>
                    </el-card>
                </el-aside>
                <el-main>
                    <el-card shadow="none">
                        <el-menu class="el-menu-demo" mode="horizontal">
                            <el-menu-item index="1">历史申领单详情</el-menu-item>
                        </el-menu>

                        <ele-pro-table ref="rightTable" height="500px" :pageSize="rightPageSize"
                            :pageSizes="rightPageSizes" :columns="rightColumns" :datasource="rightDatasource"
                            :rowClickChecked="true" :rowClickCheckedIntelligent="false"
                            @current-change="onRightSelectionChange" cache-key="rightTableKey">

                            <template v-slot:planCount="{ row }">
                                <el-input-number style="width: 100px" v-model="row.PLAN_NUM" :min="0" :max="999999999" :step="1" size="mini" />
                            </template>

                            <template v-slot:VAR_ENABLE="{ row }">
                                <el-tag v-if="row.VAR_ENABLE == 0" type="danger">否</el-tag>
                                <el-tag v-else-if="row.VAR_ENABLE == 1" type="success">是</el-tag>
                                <el-tag v-else type="warning">未知</el-tag>
                            </template>



                            <template v-slot:toolbar>
                                <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
                                    <el-row>
                                        <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 6 }">
                                            <el-form-item>
                                                <el-input clearable v-model="where.SerachName"
                                                    placeholder="请输入品种名称/型号规格/生产企业搜索" />
                                            </el-form-item>

                                            <el-form-item>
                                                <el-button type="primary" icon="el-icon-search" class="ele-btn-icon"
                                                    @click="rightTableReload">
                                                    查询
                                                </el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </template>
                        </ele-pro-table>
                    </el-card>
                </el-main>
            </el-container>
        </ele-modal>
    </div>
</template>

<script>
import {
    getLeftTableData,
    getRightTableData
} from '@/api/KSInventory/DeptPlanDeclaration';
export default {
    name: 'QuotationPlan',
    components: {
        // Your components go here
    },
    props: {
        visible: Boolean,
    },
    data() {
        const defaultWhere = {
            SerachName: "",
            TempletMasteID: "",
        };
        return {
            // Your data goes here
            where: { ...defaultWhere },
            //左表格数据
            leftToolbar: false,
            leftPageSize: 15,
            leftPageSizes: [15, 50, 100, 200, 9999999],
            leftPagerCount: 5,
            leftSelection: [],
            leftCurrent: null,
            leftColumns: [
                {
                    prop: 'TempletCode',
                    label: '模板编号',
                    width: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'TempletName',
                    label: '模板名称',
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Operater',
                    label: '创建人',
                    minWidth: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'LastUpDateTime',
                    label: '最近更新时间',
                    minWidth: 140,
                    showOverflowTooltip: true,
                    formatter(row, column, cellValue) {
                        return row.LastUpDateTime.replace("T", " ");
                    },
                },
                // {
                //     prop: 'ID',
                //     minWidth: -2,
                //     width: -2,
                //     show :false,
                // },
                // {
                //     prop: 'DeptCode',
                //     minWidth: -2,
                //     width: -2,
                //     show :false,
                // },
            ],
            //右表格数据
            rightColumns: [
                {
                    columnKey: 'selection',
                    type: 'selection',
                    width: 45,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    prop: 'AUTH',
                    label: '排序',
                    minWidth: 40,
                    fixed: 'left',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'VARIETIE_CODE_NEW',
                    label: '品种编码',
                    width: 90,
                    fixed: 'left',
                    align: 'left',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'DEPT_ZDY_VARIETIE_CODE',
                    label: '自定义编码',
                    width: 100,
                    fixed: 'left',
                    align: 'left',
                    formatter(row, column, cellValue) {
                        if (row.DEPT_ZDY_VARIETIE_CODE == null) {
                            return "未定义"
                        } else {
                            return row.DEPT_ZDY_VARIETIE_CODE
                        }
                    },
                },
                {
                    prop: 'VarName',
                    label: '品种全称',
                    minWidth: 140,
                    fixed: 'left',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'GG',
                    label: '型号/规格',
                    width: 120,
                    fixed: 'left',
                    showOverflowTooltip: true,
                },
                {
                    slot: 'planCount',
                    label: '计划数量',
                    width: 110,
                    align: 'center',
                },
                {
                    prop: 'USE_COUNT',
                    label: '上月消耗',
                    width: 60,
                },
                {
                    prop: 'Unit',
                    label: '单位',
                    width: 60,
                },
                {
                    prop: 'Price',
                    label: '结算价',
                    width: 80,
                    align: 'center',
                    // formatter(row, column, cellValue, index) {
                    //     return (row.Price).toFixed(2);
                    // }
                },
                {
                    prop: 'Manufacturing',
                    label: '生产企业名称',
                    width: 140,
                },
                {
                    prop: 'SUPPLIER_NAME',
                    label: '启用供应商',
                    width: 140,
                },
                {
                    prop: 'TempletQty',
                    label: '模板申领数量',
                    width: 100,
                    align: 'center',
                },
                {
                    prop: 'ZB',
                    label: '是否中标',
                    width: 80,
                    align: 'center',
                    formatter(row, column, cellValue) {
                        if (row.ZB == 0) {
                            return "否";
                        } else if (row.ZB == 1) {
                            return "是";
                        } else {
                            return "未知";
                        }
                    },

                },

                //todo
                {
                    prop: 'VAR_ENABLE',
                    label: '是否启用',
                    width: 80,
                    align: 'center',
                    slot: "VAR_ENABLE"
                },
                {
                    prop: 'BigBoxCount',
                    label: '大包装数量',
                    width: 80,
                    align: 'center',
                },

                {
                    prop: 'MinBoxCount',
                    label: '中包装数量',
                    width: 80,
                    align: 'center',
                },
            ],
            rightToolbar: false,
            rightPageSize: 15,
            rightPageSizes: [15, 50, 100, 200, 9999999],
            rightPagerCount: 5,
            rightSelection: [],
            rightCurrent: null,
        };
    },
    methods: {
        // Your methods go here
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        onLeftSelectionChange(selection) {
            this.where.TempletMasteID = selection.ID;
            this.rightTableReload();
        },
        onRightSelectionChange(selection) {
            this.rightCurrent = selection;
        },
        leftTableReload() {
            this.$refs.leftTable.reload({ page: 1, where: this.where });
        },
        rightTableReload() {
            this.$refs.rightTable.reload({ page: 1, where: this.where });
        },
        rightDatasource({ page, limit, where, order }) {
            let data = getRightTableData({ page, limit, where, order }).then(
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
        leftDatasource({ page, limit, where, order }) {
            let data = getLeftTableData({ page, limit, where, order }).then(
                (res) => {
                    var tData = {
                        count: res.total,
                        list: res.result
                    };
                    return tData;
                }
            );
            return data;
        }
    },
    computed: {
        // Your computed properties go here
        // 是否开启响应式布局
        styleResponsive() {
            return this.$store.state.theme.styleResponsive;
        },
    },
    watch: {

    },
    mounted() {
        // Code to run when the component is mounted
    },
};
</script>

<style scoped>
/* Your styles go here */
</style>