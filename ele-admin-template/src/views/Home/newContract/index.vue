<template>
    <div class="ele-body">
        <el-row :gutter="10">
            <el-col :span="8">
                <el-card shadow="never">
                    <el-tabs :value="0">
                        <el-tab-pane label="供应商列表">
                            <el-row :gutter="10">
                                <el-col :span="10">
                                    <el-input size="mini" v-model="supplierCodeOrName" placeholder="请输入搜索内容"
                                        clearable />
                                </el-col>
                                <el-col :span="6">
                                    <el-select size="mini" v-model="supplierStatusValue" placeholder="请选择状态">
                                        <el-option label="启用" value="1"></el-option>
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="停用" value="0"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="4">
                                    <el-button size="mini" type="primary" @click="getSupplierDataList" icon="el-icon-search">搜索</el-button>
                                </el-col>
                            </el-row>
                            <el-table id="supplier-box" highlight-current-row :data="supplierList" stripe
                                @current-change="onSupplierCurrentChange" style="width: 100%">
                                <el-table-column prop="Supplier_Name" label="供应商名称">
                                </el-table-column>
                                <el-table-column width="100" label="启用状态">
                                    <template slot-scope="scope">
                                        <p>{{ scope.row.Enable == 1 ? '启用' : '停用' }}</p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="never">
                    <el-tabs :value="0">
                        <el-tab-pane label="合同列表">
                            <el-row :gutter="10">
                                <el-col :span="10">
                                    <el-input size="mini" v-model="contractCodeOrName" placeholder="合同编码或者名称"
                                        clearable />
                                </el-col>

                                <el-col :span="4">
                                    <el-button size="mini" type="primary" @click="getContractList" icon="el-icon-search">搜索</el-button>
                                </el-col>
                            </el-row>
                            <el-table id="contract-box" highlight-current-row :data="contractList" stripe
                                style="width: 100%" @current-change="onContractCurrentChange">
                                <el-table-column prop="Contract_Name" label="合同名称">
                                </el-table-column>
                                <el-table-column label="合同类型">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.contract_Type == 1 ? '中标合同' : '临采合同' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column width="100" label="图片">
                                    <!-- <template slot-scope="scope">
                                    <img v-if="scope.row.HT_PIC" src="" alt="">
                                    <span v-else></span>
                                </template> -->
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="never">
                    <el-tabs :value="0">
                        <el-tab-pane label="合同详情">
                            <el-descriptions id="contract-info-box" :column="2" :border="true">
                                <el-descriptions-item label="合同编码">
                                    {{ contractInfo.contract_code }}
                                </el-descriptions-item>
                                <el-descriptions-item label="经营许可证有效期">
                                    {{ contractInfo.roduction_license_valid_date }}
                                </el-descriptions-item>
                                <el-descriptions-item label="合同编号">
                                    {{ contractInfo.Hosp_Contract_Code }}
                                </el-descriptions-item>
                                <el-descriptions-item label="营业执照有效期">
                                    {{ contractInfo.business_license_valid_date }}
                                </el-descriptions-item>
                                <el-descriptions-item label="招标编号">
                                    {{ contractInfo.bid_number }}
                                </el-descriptions-item>
                                <el-descriptions-item label="质保证协议书有效期">
                                    {{ contractInfo.qlty_assurance_prot_valid_date }}
                                </el-descriptions-item>
                                <el-descriptions-item label="合同名称">
                                    {{ contractInfo.contract_name }}
                                </el-descriptions-item>
                                <el-descriptions-item label="委托书有效期">
                                    {{ contractInfo.power_of_attorney_valid_date }}
                                </el-descriptions-item>
                                <el-descriptions-item label="合同起始日期">
                                    {{ contractInfo.contract_start_time }}
                                </el-descriptions-item>
                                <el-descriptions-item label="创建时间">
                                    {{ contractInfo.create_time }}
                                </el-descriptions-item>
                                <el-descriptions-item label="合同终止日期">
                                    {{ contractInfo.contract_end_time }}
                                </el-descriptions-item>
                                <el-descriptions-item label="最近更新时间">
                                    {{ contractInfo.last_update_time }}
                                </el-descriptions-item>
                                <el-descriptions-item label="委托人">
                                    {{ contractInfo.consigner }}
                                </el-descriptions-item>
                                <el-descriptions-item label="启用状态">
                                    {{ contractInfo.contract_state == 1 ? '是' : '否' }}
                                </el-descriptions-item>
                                <el-descriptions-item label="委托人身份证">
                                    {{ contractInfo.consigner_id }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="24">
                <el-card shadow="never" class="varietie-card">
                    <el-tabs :value="0">
                        <el-tab-pane label="供应商合同授权品种列表">
                            <div class="varietie-input-box">
                                <el-input size="mini" v-model="varietieCode" class="input" placeholder="请输入品种编码"
                                    clearable resize="none" />
                                <el-input size="mini" v-model="varietieName" class="input" placeholder="请输入品种名称"
                                    clearable resize="none" />
                                <el-input size="mini" v-model="specificationOrType" class="input"
                                    placeholder="请输入品种规则型号" clearable resize="none" />
                                <el-input size="mini" v-model="unit" class="input" placeholder="请输入单位" clearable
                                    resize="none" />
                                <el-input size="mini" v-model="manufacturingEntName" class="input" placeholder="请输入生产企业"
                                    clearable resize="none" />
                                <el-input size="mini" v-model="approvalNumber" class="input" placeholder="请输入注册证号"
                                    clearable resize="none" />
                                <el-button size="mini" type="primary" @click="onVarietyList" icon="el-icon-search">查询</el-button>
                            </div>

                            <div>
                                <ele-pro-table id="variety-box" :columns="varietieColumns"
                                    :datasource="varietieDataList"
                                    :page-size="varietiePageSize"
                                    @sort-change="handleVarietySortChange"></ele-pro-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { conditionsSupplier, Get_Contractcode, Get_Contractcodedetails, GetListPagealready } from '@/api/Home/newContract';
import { Loading } from 'element-ui';
export default {
    data() {
        return {
            supplierStatusValue: '1',
            supplierCodeOrName: "",
            supplier_code:"",
            //供应商列表
            supplierList: [],
            //供应商合同搜索框:合同名称或者合同编号
            contractCodeOrName: '',
            //供应商合同列表
            contractList: [],
            //当前合同
            currentContract: {},
            //合同详情
            contractInfo: {},
            //请输入品种编码
            varietieCode: '',
            // 请输入品种名称
            varietieName: '',
            // 请输入品种规则型号
            specificationOrType: '',
            // 请输入单位
            unit: '',
            //请输入生产企业
            manufacturingEntName: '',
            // 请输入注册证号
            approvalNumber: '',

            //品种数据列表
            varietieDataList: [],
            //品种排序字段
            varietieOrder: '',
            // 品种排序方式
            varietieOrderProp: '',
            //品种页数
            varietieCurrentPage:1,
            //每页大小
            varietiePageSize:10,

            varietieTotal:0,

            //高级表格所需的列表格式
            varietieColumns: [
                {
                    width: 45,
                    type: 'selection',
                    columnKey: 'selection',
                    align: 'center'
                },
                {
                    columnKey: 'index',
                    type: 'index',
                    width:66,
                    label: '序号',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Varietie_Code_New',
                    label: '品种（材料）编码',
                    minWidth: 160,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'varietie_name',
                    label: '品种全称',
                    minWidth: 300,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'specification_or_type',
                    label: '型号/规格',
                    minWidth: 370,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'unit',
                    label: '单位',
                    minWidth: 75,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'manufacturing_ent_name',
                    minWidth: 300,
                    label: '生产企业名称',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'price',
                    minWidth: 90,
                    label: '结算价',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,

                },
                {
                    prop: 'approval_number',
                    label: '批准文号',
                    minWidth: 300,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                },
                {
                    prop: 'registration_issuing_date',
                    label: '发证日期',
                    sortable: 'custom',
                    showOverflowTooltip: true,
                    align: 'center',
                    minWidth: 125,
                    formatter: (row, column, value) => {
                        if (!value) {
                            return ''
                        }
                        return value.substring(0,10)
                    },
                },
                {
                    prop: 'registration_valid_date',
                    label: '有效到期',
                    sortable: 'custom',
                    showOverflowTooltip: true,
                    align: 'center',
                    minWidth: 125,
                    formatter: (row, column, value) => {
                        if (!value) {
                            return ''
                        }
                        return value.substring(0,10)
                    },
                },
                {
                    prop: 'Auth_Valid',
                    label: '授权到期',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 125,
                    formatter: (row, column, value) => {
                        if (!value) {
                            return ''
                        }
                        return value.substring(0,10)
                    },
                },
                {
                    prop: 'is_enable',
                    label: '启用状态',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 125,
                    formatter: (row, column, value) => {
                        if (value == 1) {
                            return '启用'
                        }
                        return '停用'
                    },
                },
                {
                    prop: 'prod_big_class_name',
                    label: '产品类型',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 125,
                },
                {
                    prop: 'mgmt_cat_name',
                    label: '管理类别',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 125,
                },
                {
                    prop: 'regulatory_cat_name',
                    label: '监管类别',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 330,
                },
                {
                    prop: 'TwoSupCode',
                    label: '二级供应商编码',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 145,
                },
                {
                    prop: 'TwoSupName',
                    label: '二级供应商名称',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 145,
                },
                {
                    prop: 'DET_CONTRACT_CODE',
                    label: '明细合同编码',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 145,
                },
                {
                    prop: 'DET_CONTRACT_START',
                    label: '合同明细起始',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 145,
                    formatter: (row, column, value) => {
                        if (!value) {
                            return ''
                        }
                        return value.substring(0,10)
                    },
                },
                {
                    prop: 'DET_CONTRACT_END',
                    label: '合同明细结束',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 145,
                    formatter: (row, column, value) => {
                        if (!value) {
                            return ''
                        }
                        return value.substring(0,10)
                    },
                },
                {
                    prop: 'LC_NUM',
                    label: '临采限量',
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, cellValue) => {
                        if (cellValue == 2) {
                            return cellValue
                        }
                        return '-';
                    },
                    minWidth: 125,
                }
            ]
        }
    },
    mounted() {
        //初始化供应商列表
        this.getSupplierDataList()
    },
    methods: {
        //获取供应商列表
        getSupplierDataList() {
            //加载动画
            let loadingInstance = Loading.service({
                target: '#supplier-box'
            });
            conditionsSupplier({
                page: 1,
                size: 9999999,
                // 状态
                IS_ENABLE: this.supplierStatusValue,
                supplier_code: this.supplierCodeOrName,
                supplier_name: this.supplierCodeOrName
            }).then(res => {

                if (!res.data && !res.data.result) {
                    return false
                }
                this.supplierList = res.data.result
            }).finally(() => {
                loadingInstance.close()
            })
        },
        //点击供应商列表
        onSupplierCurrentChange(Supplier) {
            console.log(Supplier);
            if (!Supplier) {
                return false
            }
            if (!Supplier.Supplier_Code) {
                return false
            }
            this.supplier_code = Supplier.Supplier_Code
            this.getContractList(Supplier.Supplier_Code)
        },
        onContractCurrentChange(Contract) {
            this.currentContract = Contract
            this.getContractInfo(Contract.Contract_Code)
            this.getVarietyList(Contract.Contract_Code)
        },
        //获取供应商合同列表
        getContractList(supplier_code) {
            let loadingInstance = Loading.service({
                target: '#contract-box'
            });

            console.log()
            Get_Contractcode({
                supplier_code:this.supplier_code,
                contract_code: this.contractCodeOrName,
                contract_name: this.contractCodeOrName,
            }).then(res => {
                if (!res.data) {
                    return false
                }
                if (!res.data.result) {
                    return false
                }
                this.contractList = res.data.result
            }).finally(() => {
                loadingInstance.close()
            })
        },
        //获取供应商合同详情
        getContractInfo(contract_code) {
            let loadingInstance = Loading.service({
                target: '#contract-info-box'
            });
            Get_Contractcodedetails({
                contract_code
            }).then(res => {
                if (!res.data) {
                    return false
                }
                if (!res.data.result) {
                    return false
                }
                let dataList = res.data.result[0]
                let dateList = ['contract_start_time',
                    'contract_end_time',
                    'roduction_license_valid_date',
                    'business_license_valid_date',
                    'qlty_assurance_prot_valid_date',
                    'power_of_attorney_valid_date',
                    'create_time',
                    'last_update_time',
                ]
                Object.keys(dataList).forEach(ele => {
                    if (dateList.includes(ele)) {
                        if (dataList[ele]) {
                            dataList[ele] = dataList[ele].substring(0, 10)
                        }

                    }
                })
                this.contractInfo = dataList
            }).finally(() => {
                loadingInstance.close()
            })
        },
        onVarietyList(e) {
            if (!this.currentContract.Contract_Code) {
                let loadingInstance = Loading.service({
                    target: '#variety-box'
                });
                loadingInstance.close()
                return
            }
            this.getVarietyList(this.currentContract.Contract_Code)
        },
        //获取供应商合同授权品种列表

        getVarietyList(contract_code) {
            let loadingInstance = Loading.service({
                target: '#variety-box'
            });

            GetListPagealready({
                contract_code,
                varietie_code: this.varietieCode,
                varietie_name: this.varietieName,
                specification_or_type: this.specificationOrType,
                unit: this.unit,
                manufacturing_ent_name: this.manufacturingEntName,
                approval_number: this.approvalNumber,
                order: this.varietieOrder,
                field: this.varietieOrderProp,
            }).then(res => {
                if (!res.data) {
                    this.varietieDataList = []
                    return false
                }
                if (!res.data.result) {
                    this.varietieDataList = []
                    return false
                }
                this.varietieDataList = res.data.result

            }).finally(() => {
                loadingInstance.close()
            })
        },
        handleVarietySortChange(e) {
            if (e.order == 'ascending') {
                this.varietieOrder = 'asc'
            } else if (e.order == 'descending') {
                this.varietieOrder = 'desc'
            } else {
                this.varietieOrder = ''
            }
            this.varietieOrderProp = e.prop
            this.onVarietyList()
        },
    }
}
</script>

<style scoped>
.input {
    width: 220px;
}

.varietie-card {
    margin-top: 10px;
}

.el-pro-table .el-table__header th .cell {
    width: fit-content;
    white-space: nowrap;
    /* 防止标题换行 */
}

.ele-body {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.el-table {
    margin-top: 10px;
    height: 300px;
    overflow: auto;
}

:deep(.ele-body>.el-row:not(1) .el-table) {
    margin-top: 10px;
}

.ele-body>.el-row:not(2) {
    flex: 1;
}

:deep(.el-tabs__header) {
    margin-bottom: 10px;
}

:deep(.ele-table-tool) {
    margin-top: 10px;
}

:deep(.el-descriptions-item__label),
:deep(.el-descriptions-item__content) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.varietie-input-box {
    display: flex;
    flex-wrap: wrap;
    /* 允许换行 */
    justify-content: flex-start;
    /* 水平方向左对齐 */
    align-items: flex-start;
    /* 垂直方向顶部对齐 */
    gap: 10px;
}
</style>