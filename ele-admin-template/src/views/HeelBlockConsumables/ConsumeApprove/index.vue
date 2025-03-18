<template>
    <div class="ele-body">
        <el-row :gutter="20" class="consume-box">
            <el-col :span="6">
                <el-card shadow="never">
                    <el-tabs :value="0">
                        <el-tab-pane label="预收货单号列表">
                            <div class="margin-top-10">
                                <el-button type="primary" size="mini" @click="exportConsumeXlsx">导出</el-button>
                                <el-button size="mini" :disabled="this.currentConsumeA1Status"
                                    @click="onStatusWithdrawn">状态撤回</el-button>
                                <el-button type="primary" size="mini" @click="showUploadDialogVisible">上传植入单</el-button>
                            </div>
                            <el-form class="consume-form" :model="consumeForm" size="mini">
                                <el-form-item>
                                    <el-select v-model="consumeForm.state" placeholder="请选择">
                                        <el-option label="手术使用-全部" value=""></el-option>
                                        <el-option label="手术使用-待确认" value="0"></el-option>
                                        <el-option label="手术使用-已确认" value="1"></el-option>
                                        <el-option label="手术使用-待审批" value="2"></el-option>
                                        <el-option label="手术使用-已审批" value="3"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-select v-model="consumeForm.spState" placeholder="请选择">
                                        <el-option label="供应科审批-全部" value=""></el-option>
                                        <el-option label="供应科-已审批" value="1"></el-option>
                                        <el-option label="供应科-未审批" value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-row :gutter="0">
                                        <el-col :span="18">
                                            <el-input v-model="consumeForm.condition"
                                                placeholder="可输入住院号、病患、使用科室检索"></el-input>
                                        </el-col>
                                        <el-col :span="6">
                                            <el-button type="primary" icon="el-icon-search"
                                                @click="getReceiptOrderList">查询</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item>
                                    <el-row>
                                        <el-col :span="11">
                                            <el-date-picker value-format="yyyy-MM-dd" type="date"
                                                placeholder="yyyy-MM-dd" v-model="consumeForm.dateFrom"
                                                style="width: 100%;"></el-date-picker>
                                        </el-col>
                                        <el-col class="line" :span="2" style="text-align: center;">-</el-col>
                                        <el-col :span="11">
                                            <el-date-picker value-format="yyyy-MM-dd" type="date"
                                                placeholder="yyyy-MM-dd" v-model="consumeForm.dateTo"
                                                style="width: 100%;"></el-date-picker>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                            <div class="margin-top-10">
                                <ele-pro-table height="500" :needPage="false" :toolbar="false" :pageSize="9999"
                                    class="receipt-order-list-table" size="mini" :columns="consumeColumns"
                                    :highlightCurrentRow="true" @current-change="onReceiptOrderCurrentChange"
                                    :row-class-name="tableRowClassName1"
                                    :datasource="ReceiptOrderList"></ele-pro-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

            </el-col>
            <el-col :span="18">
                <el-card shadow="never">
                    <el-tabs :value="0">
                        <el-tab-pane label="品种消耗审批表">
                            <el-row type="flex" class="row-bg margin-top-10" justify="space-between">
                                <el-col :span="12">
                                    <el-form size="mini">
                                        <el-row>
                                            <el-col :span="18">
                                                <el-input size="mini" v-model="consumeA2Input"
                                                    placeholder="B2B品种编码、品种（材料）编码、品种全称、生产企业名称、型号/规格、供应商名称"></el-input>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-button size="mini" type="primary" icon="el-icon-search"
                                                    @click="getDeliveryVarietieList">查询</el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </el-col>
                                <el-col :span="10" :push="2">
                                    <el-button size="mini" type="primary" @click="onGeneratePackage">生成套包</el-button>
                                    <el-button size="mini" :disabled="true">查看定数码标签</el-button>
                                    <el-button size="mini" :disabled="true" @click="onNurseApproval">护士审批</el-button>
                                </el-col>
                            </el-row>

                            <!-- 表格 -->
                            <div class="margin-top-10">
                                <ele-pro-table height="300" class="receipt-delivery-varietie-table" :needPage="false"
                                    :toolbar="false" size="mini" :columns="deliveryVarietieColumns"
                                    :highlightCurrentRow="true" @current-change="onDeliveryVarietieCurrentChange"
                                    :pageSize="9999" :datasource="DeliveryVarietieList"></ele-pro-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

                <el-card shadow="never" class="margin-top-10">
                    <div>
                        <ele-pro-table height="300" class="receipt-varietie-info-table" :needPage="false"
                            :pageSize="9999" :toolbar="false" size="mini" :columns="consumeA3"
                            @current-change="onTableCurrent3"
                            :highlightCurrentRow="true" :datasource="LoadGeneratedVarietieInfo"></ele-pro-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>







        <!-- 对话框 -->
        <el-dialog title="生成套包" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
            <el-row>
                <el-col :span="4">
                    <el-select size="mini" v-model="gtTbTB_TYPE2" placeholder="请选择">
                        <el-option label="关节套包" value="1"></el-option>
                        <el-option label="脊柱套包" value="2"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button size="mini" icon="el-icon-search" type="primary"
                        @click="getGtTbTable1gtList">查询</el-button>
                </el-col>
            </el-row>
            <div class="margin-top-10">
                <ele-pro-table height="500" :toolbar="false" size="mini" :columns="gtTbTable1gt"
                    :highlightCurrentRow="true" class="gtTbTable1gt-table" @current-change="onGtTbTable1gtCurrentChange"
                    :datasource="GtTbTable1gtList"></ele-pro-table>
            </div>
            <div slot="footer" class="">
                <el-button size="mini" type="primary" @click="onGeneratePackageSure">确定</el-button>
            </div>
        </el-dialog>


        <!-- 上传植入单 -->
        <el-dialog title="上传植入单" :visible.sync="uploadDialogVisible" width="50%"
            :before-close="handleCloseUploadDialogVisible">
            <el-upload class="upload-demo" ref="upload" action="" :limit="1" :on-change="handleFileChange"
                :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success"
                    @click="submitUpload">上传到服务器</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div> -->
            </el-upload>
        </el-dialog>
    </div>

</template>

<script>
import { apiGetLoadGeneratedVarietieInfo, apiGetLoadGoodsDeliveryNumbers, apiGetSearchDeliveryVarietie, apiGetSearchTbMainZy, apiPostCreateDefTb, apiPostGtSbkSp, apiPostSearchTbMainZy, apiPostUploadGtPic } from '@/api/HeelBlockConsumables/ConsumeApprove';
import { formatDate } from '@/utils/formdataify';
import { Loading } from 'element-ui';
import { utils, writeFile } from 'xlsx';

export default {
    data() {
        return {
            consumeForm: {
                state: '',
                spState: '',
                condition: '',
                dateFrom: this.getSevenDaysAgo(7),
                dateTo: this.getSevenDaysAgo(0),
            },
            //对话框选择器
            gtTbTB_TYPE2: '1',
            dialogVisible: false,
            uploadDialogVisible: false,

            //文件
            fileList: [],

            //搜索
            consumeA2Input: '',

            //当前选择的表格行
            currentConsumeA1: null,
            currentConsumeA1Status:true,
            currentConsumeA2: null,
            currentConsumeA3: null,
            currentGtTbTable1gt: null,

            //表格数据源
            ReceiptOrderList: [],
            DeliveryVarietieList: [],
            LoadGeneratedVarietieInfo: [],
            GtTbTable1gtList: [],

            // 表格列格式列表
            consumeColumns: [
                {
                    width: 45,
                    type: 'selection',
                    columnKey: 'selection',
                    align: 'center'
                },
                {
                    prop: 'Delivery_Note_Number',
                    label: '收货单号',
                    minWidth: 100,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Hospitalization_Number',
                    label: '住院号',
                    minWidth: 85,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Patient',
                    label: '病患',
                    minWidth: 70,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Dept_Two_Name',
                    label: '使用科室',
                    minWidth: 100,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Receive_Receipt_State',
                    label: '确认状态',
                    minWidth: 100,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true

                },
                {
                    prop: 'Approve_Time',
                    label: '审批时间',
                    minWidth: 100,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'GT_LOOK_DSM_SP_STATE',
                    label: '供应科审批',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'GT_PIC',
                    label: '植入单',
                    minWidth: 85,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'TB_NUM',
                    label: '套包数量',
                    minWidth: 160,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                }
            ],
            deliveryVarietieColumns: [
                {
                    prop: 'Varietie_Code',
                    label: '品种(材料)编码',
                    minWidth: 100,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'CHARGING_CODE',
                    label: '计费编码',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Varietie_Name',
                    label: '品种全称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'APPROVAL_NUMBER',
                    label: '注册证号',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'PROD_REGISTRATION_NAME',
                    label: '注册证名称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Specification_Or_Type',
                    label: '型号/规格',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Manufacturing_Ent_Name',
                    label: '生产企业名称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Unit',
                    label: '单位',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Consume_Count',
                    label: '消耗数量',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Supply_Price',
                    label: '消耗价',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Batch',
                    label: '生产批号',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Batch_Production_Date',
                    label: '生产日期',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Batch_Validity_Period',
                    label: '失效日期',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                }
            ],
            consumeA3: [
                {
                    prop: 'Varietie_Code',
                    label: '品种(材料)编码',
                    minWidth: 100,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Varietie_Name',
                    label: '品种全称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'APPROVAL_NUMBER',
                    label: '注册证号',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'PROD_REGISTRATION_NAME',
                    label: '注册证名称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Specification_Or_Type',
                    label: '型号/规格',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Manufacturing_Ent_Name',
                    label: '生产企业名称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Unit',
                    label: '单位',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Batch',
                    label: '生产批号',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Batch_Production_Date',
                    label: '生产日期',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Batch_Validity_Period',
                    label: '失效日期',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Def_No_Pkg_Code',
                    label: '定数码',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Serial_Number',
                    label: 'UDI码',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'TB_NAME',
                    label: '套包名称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'TB_UNI_NUM',
                    label: '套包唯一码',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                }
            ],
            gtTbTable1gt: [
                {
                    prop: 'TB_NAME',
                    label: '套包名称',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'TB_JF_CODE',
                    label: '套包计费编码',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'TB_YG_CODE',
                    label: '套包编码',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'TB_REMARK',
                    label: '备注',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'PJ_COUNT',
                    label: '配件数',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'PJ_HAVE_COUNT',
                    label: '订单满足配件数',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'PJ_CY_COUNT',
                    label: '配件差异数',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'CREATE_TIME',
                    label: '创建时间',
                    minWidth: 100,
                    align: 'center',
                    showOverflowTooltip: true
                }
            ]
        }
    },
    mounted() {
        this.getReceiptOrderList()


    },
    methods: {
        //获取收货单号
        async getReceiptOrderList() {
            let loadingInstance = Loading.service({
                target: ".receipt-order-list-table .el-table"
            })
            this.currentConsumeA1 = null
            this.currentConsumeA1Status = true
            let where = this.consumeForm
            let dataSource = await apiGetLoadGoodsDeliveryNumbers({
                where
            }).then((res) => {
                let data = res.data
                if (data.code != 200) {
                    return false
                }
                return {
                    count: data.total,
                    list: data.result
                }
            }).finally(() => {
                loadingInstance.close()
            })
            if (!dataSource) {
                dataSource = {
                    list: [],
                    count: 0
                }
            }

            this.ReceiptOrderList = dataSource.list
            return dataSource

        },

        //3
        async getLoadGeneratedVarietieInfo() {
            let loadingInstance = Loading.service({
                target: ".receipt-varietie-info-table .el-table"
            })

            let where = {
                batchId: this.currentConsumeA2 ? this.currentConsumeA2.Varietie_Code : '',
                deliveryNumber: this.currentConsumeA1 ? this.currentConsumeA1.Delivery_Note_Number : ''
            }
            let datasource = await apiGetLoadGeneratedVarietieInfo({
                where
            }).then(res => {
                let data = res.data
                if (data.code != 200) {
                    return false
                }

                return data.result
            }).finally(() => {
                loadingInstance.close()
            })
            if (!datasource) {
                datasource = []
            }
            this.LoadGeneratedVarietieInfo = datasource

            return datasource
        },

        async getDeliveryVarietieList() {
            let loadingInstance = Loading.service({
                target: ".receipt-delivery-varietie-table .el-table"
            })
            let where = {
                deliveryNumber: this.currentConsumeA1 ? this.currentConsumeA1.Delivery_Note_Number : '',
                condition: this.consumeA2Input
            }
            let datasource = await apiGetSearchDeliveryVarietie({
                where
            }).then(res => {
                // console.log(res);
                let data = res.data
                if (data.code != 200) {
                    return false
                }
                return data.result
            }).finally(() => {
                loadingInstance.close()
            })
            if (!datasource) {
                datasource = []
            }

            this.DeliveryVarietieList = datasource
            return datasource
        },

        async getGtTbTable1gtList() {
            let loadingInstance = Loading.service({
                target: ".gtTbTable1gt-table .el-table"
            })

            let where = {
                TB_TYPE2: this.gtTbTB_TYPE2,
                orderNum: '124441679293584'
            }
            let datasource = await apiPostSearchTbMainZy({
                where
            }).then(res => {
                console.log(res);
                let data = res.data
                if (data.code != 200) {
                    return false
                }
                return data.result

            }).finally(() => {
                loadingInstance.close()
            })
            this.GtTbTable1gtList = datasource
            return datasource
        },


        getSevenDaysAgo(day) {
            const today = new Date();
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - day);
            return formatDate(sevenDaysAgo, "yyyy-MM-dd");
        },
        onReceiptOrderCurrentChange(e) {
            console.log(e);
            this.currentConsumeA1Status = e && e.Receive_Receipt_State != '2'
            this.currentConsumeA1 = e
            this.currentConsumeA2 = null
            this.getDeliveryVarietieList()
            this.getLoadGeneratedVarietieInfo()
        },
        onDeliveryVarietieCurrentChange(e) {
            console.log(e);
            this.currentConsumeA2 = e
            this.getLoadGeneratedVarietieInfo()
        },
        onGtTbTable1gtCurrentChange(e) {
            console.log(e);

            this.currentGtTbTable1gt = e
        },
        handleClose(e) {
            this.dialogVisible = false
        },
        handleCloseUploadDialogVisible(e) {
            this.uploadDialogVisible = false
        },
        showUploadDialogVisible(e) {
            this.uploadDialogVisible = true
        },
        //状态撤回
        onStatusWithdrawn(e) {
            if (!this.currentConsumeA1) {
                this.$message('请选择收货单号');
                return false
            }
            const loading = this.$messageLoading('提交中...');
            console.log(this.currentConsumeA1);
            let where = {
                deliveryNumberId: this.currentConsumeA1.Delivery_Note_Number_Id
            }
            apiGetSearchTbMainZy({
                where
            }).then(res => {
                loading.close();
                let data = res.data
                if (data.code!= "200") {
                    this.$message.warning(data.msg);
                    return 
                }
                this.$message.success(data.msg);
            }).finally(e=>{
                this.getReceiptOrderList()
            })
            
            this.currentConsumeA1 = null
        },
        onTableCurrent1(row){
            this.currentConsumeA1 = row
        },
        onTableCurrent2(row){
            this.currentConsumeA2 = row
        },
        onTableCurrent3(row){
            this.currentConsumeA3 = row
        },
        onNurseApproval(e) {
            if (!this.currentConsumeA1) {
                this.$message('请选择收货单号');
                return false
            }
            this.$confirm('审批', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let where = {
                    json: JSON.stringify(this.currentConsumeA1),
                    state: 1
                }

                apiPostGtSbkSp({
                    where
                }).then(res => {
                    let data = res.data
                    if (data.code == 200) {
                        this.$message({
                            message: data.msg,
                            type: 'success'
                        });
                        return true
                    }


                    this.$message(data.msg);
                    return false
                })
            });


        },
        //点击生成
        onGeneratePackage(e) {
            this.dialogVisible = true
            this.currentGtTbTable1gt = null
            this.$nextTick(() => {
                this.getGtTbTable1gtList()
            })
        },
        onGeneratePackageSure(e) {
            if (!this.currentGtTbTable1gt) {
                this.$message('请选中一行数据');
                return false
            }
            // orderNum: 
            // TB_ID: 43
            let where = {
                orderNum: this.currentConsumeA1 ? this.currentConsumeA1.Delivery_Note_Number : '',
                TB_ID: this.currentGtTbTable1gt.ID
            }
            apiPostCreateDefTb({
                where
            }).then(res => {
                console.log(res);
                let data = res.data
                if (data.code == 200) {
                    this.$message({
                        message: data.msg,
                        type: 'success'
                    });
                    return true
                }
                this.$message(data.msg);
            })
        },
        handleFileChange(file, fileList) {
            console.log(fileList);
            this.fileList = fileList
        },
        async submitUpload() {
            if (this.fileList.length == 0) {
                this.$message("请选择上传文件")
                return
            }
            let file = this.fileList[0].raw

            let fileData = await file.arrayBuffer()
            fileData = new Blob(new Uint8Array(fileData))

            let where = {
                Delivery_Note_Number: this.currentConsumeA1 ? this.currentConsumeA1.Delivery_Note_Number : '',
                FILE: fileData,
                filename: file.name
            }

            apiPostUploadGtPic({
                where
            }).then(res => {
                console.log(res);
                let data = res.data
                if (data.code == 200) {
                    this.$message.success(data.msg)
                    return
                }
                this.$message.error(data.msg)
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        //导出
        exportConsumeXlsx(e) {
            const loading = this.$messageLoading('正在导出数据...');
            //过滤有标题的
            let filterList = this.consumeColumns.filter(ele => {
                if (ele.label) {
                    return ele.label
                }
            })
            //筛选出字段与标题
            let fields = []
            let titleList = []

            filterList.forEach(ele => {
                fields.push(ele.prop)
                titleList.push(ele.label)
            });

            //请求数据并导出
            let where = this.consumeForm
            apiGetLoadGoodsDeliveryNumbers({
                where
            }).then((res) => {
                loading.close()
                let data = res.data
                if (data.code != "200") {
                    return false
                }
                const array = []
                array.push(titleList)
                console.log(data);
                data.result.forEach(ele => {
                    //根据字段列表，依次push数组。
                    let row = []
                    fields.forEach(fieldELe => {
                        row.push(ele[fieldELe])
                    })
                    array.push(row)
                });
                // 写出文件
                writeFile(
                    {
                        SheetNames: ['Sheet1'],
                        Sheets: {
                            Sheet1: utils.aoa_to_sheet(array)
                        }
                    },
                    '预收货单号列表.xlsx'
                );
                this.$message.success("导出成功");

            }).finally(() => {
                loading.close()
            })

        },
        tableRowClassName1({row}){
            if (row.Receive_Receipt_State == '3') {
                return 'success-row'
            }
        }
    }

}
</script>


<style scoped>
.consume-box {
    display: flex;

}

.consume-form {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.margin-top-10 {
    margin-top: 10px;
}

::v-deep(.consume-form .el-select) {
    width: 100%;
}

::v-deep(.el-form-item--mini.el-form-item) {
    margin-bottom: 0px;
}

::v-deep(.warning-row) {
    background-color: #fdf6ec;
}

::v-deep(.success-row) {
    background-color: #f0f9eb;
}

::v-deep(.info-row) {
    background-color: #f4f4f5;
}

::v-deep(.danger-row) {
    background-color: #fef0f0;
}
</style>