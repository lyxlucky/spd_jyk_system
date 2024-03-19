<template>
    <div>
        <!-- //@update:visible="updateVisible" -->
        <ele-modal width="1400px" :centered="true" :visible="visible" :close-on-click-modal="true"
            custom-class="ele-dialog-form" title="品种列表" @update:visible="updateVisible">
            <div class="ele-body">
                <el-card shadow="never">
                    <!-- 数据表格 -->
                    <!-- :selection.sync="selection" -->
                    <ele-pro-table ref="table" height="600px" :pageSize="pageSize" :pageSizes="pageSizes"
                        :columns="columns" :datasource="datasource" :rowClickChecked="true"
                        :rowClickCheckedIntelligent="false" @selection-change="onSelectionChange"
                        cache-key="AddPlanItem"
                        :selection.sync="selection">
                        <!-- 表头 -->
                        <template v-slot:toolbar>
                            <el-form class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
                                <el-row>

                                    <el-col :span="3">
                                        <el-form-item>
                                            <el-input style="width: 90%;" clearable v-model="where.Varietie_Name"
                                                placeholder="编码/名称" />
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="3">
                                        <el-form-item>
                                            <el-input style="width: 90%;" clearable
                                                v-model="where.Specification_Or_Type" placeholder="规格型号" />
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="3">
                                        <el-form-item>
                                            <el-input style="width: 90%;" clearable v-model="where.APPROVAL_NUMBER"
                                                placeholder="注册证" />
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="3">
                                        <el-form-item>
                                            <el-input style="width: 90%;" clearable
                                                v-model="where.Manufacturing_Ent_Name" placeholder="生产企业" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 6 }">
                                        <div class="ele-form-actions">
                                            <el-button type="primary" icon="el-icon-search" class="ele-btn-icon"
                                                @click="reload">
                                                查询
                                            </el-button>
                                            <el-button type="primary" :disabled="isAddEnable" class="ele-btn-icon"
                                                @click="addItem()">
                                                添加
                                            </el-button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </template>

                        <template v-slot:PLAN_NUM="{ row }">
                            <el-input-number style="width: 100px" v-model="row.PLAN_NUM" :min="0" :max="999999999"
                                :step="1" size="mini" />
                        </template>
                    </ele-pro-table>
                </el-card>
            </div>
        </ele-modal>
    </div>
</template>

<script>
import {
    getDeptPlanTableDataItem,
    addDeptPlanTableDataKind,
} from '@/api/KSInventory/DeptPlanDeclaration';
export default {
    props: {
        // 弹窗是否打开
        visible: Boolean,
    },
    data() {
        const defaultWhere = {
            Varietie_Name: "",
            Specification_Or_Type: "",
            APPROVAL_NUMBER: "",
            Manufacturing_Ent_Name: "",
        };
        return {
            where: { ...defaultWhere },
            columns: [
                {
                    columnKey: 'selection',
                    type: 'selection',
                    width: 45,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    prop: 'Enable',
                    label: '启用状态',
                    // sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80,
                    formatter: (row, column, cellValue) => {
                        if (row.Enable == '1') {
                            return "启用";
                        } else if (row.Enable == '0') {
                            return "冻结";
                        } else {
                            return row.Enable;
                        }
                    }
                },
                {
                    prop: 'Varietie_Code_New',
                    label: '品种（材料）编码',
                    align: 'center',
                    width: 110,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'PROD_REGISTRATION_NAME',
                    label: '注册证名称',
                    align: 'center',
                    minWidth: 200,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Varietie_Name',
                    label: '品种名称',
                    align: 'center',
                    minWidth: 200,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Specification_Or_Type',
                    label: '型号/规格',
                    align: 'center',
                    minWidth: 200,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Manufacturing_Ent_Name',
                    label: '生产企业名称',
                    align: 'center',
                    minWidth: 200,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Unit',
                    label: '单位',
                    align: 'center',
                    minWidth: 80,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Price',
                    label: '中标价',
                    align: 'right',
                    width: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'APPROVAL_NUMBER',
                    label: '批准文号',
                    width: 200,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'Dept_One_Name',
                    label: '科室名称',
                    width: 100,
                    showOverflowTooltip: true,
                },
                {
                    prop: 'PLAN_NUM',
                    label: '计划数量',
                    width: 130,
                    align: 'left',
                    showOverflowTooltip: true,
                    slot: "PLAN_NUM"
                },
            ],
            toolbar: false,
            pageSize: 15,
            pageSizes: [15, 50, 100, 200, 9999999],
            pagerCount: 5,
            // 表格选中数据
            selection: [],
            // 当前编辑数据
            current: null,
        }
    },
    methods: {
        datasource({ page, limit, where, order }) {
            let data = getDeptPlanTableDataItem({ page, limit, where, order }).then(
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
        /* 刷新表格 */
        reload() {
            this.$refs.table.reload({ page: 1, where: this.where });
        },
        /* 更新visible */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        onSelectionChange(selection) {
            this.selection = selection;
        },
        addItem() {
            this.$confirm("是否添加选中的品种？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                addDeptPlanTableDataKind(this.selection).then((res) => {
                    this.$emit("addItemDone", "");
                    if (res.code == 200) return this.$message.success("添加成功");
                })
            });
        },

    },
    watch: {

    },
    computed: {
        isAddEnable() {
            return this.selection.length == 0;
        },
        // 是否开启响应式布局
        styleResponsive() {
            return this.$store.state.theme.styleResponsive;
        },
    }
}
</script>

<style></style>