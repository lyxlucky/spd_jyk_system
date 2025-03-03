<template>
    <div class="ele-body">
        <el-card shadow="never">
            <!-- 搜索表单 -->
            <el-form class="form-box">
                <el-form-item >
                    <el-input size="mini" v-model="where.keyword" placeholder="请输入搜索内容" clearable />
                </el-form-item>
                <el-form-item>
                    <el-select class="where-enable" size="mini" v-model="where.enable" placeholder="状态">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="停用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="getDataList">
                        搜索
                    </el-button>
                </el-form-item>
            </el-form>
            <!-- 数据表格 -->
            <ele-pro-table 
            ref="table" 
            class="table-supplier" 
            :columns="columns" 
            :currentPage="page" 
            :pageSize="size" 
            :highlightCurrentRow="true"
            :datasource="getDataList" 
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
            >
            </ele-pro-table>
        </el-card>
    </div>
</template>

<style scoped>
    .form-box{
        display: flex;
        gap: 10px;
    }
    .where-enable{
        width: 5rem;
    }
</style>

<script>
import { apiSupplierGetList } from '@/api/Home/newSupplier';
import { Loading } from 'element-ui';


export default {
    data() {
        return {
            //表格数据源
            supplierList :[],
            // 条件
            where:{
                keyword:'',
                enable:'1',
            },
            //页
            page:1,
            size:10,
            //字段列表
            columns:[
                // {
                //     width: 45,
                //     type: 'selection',
                //     columnKey: 'selection',
                //     align: 'center'
                // },
                {
                    columnKey: 'index',
                    type: 'index',
                    width:66,
                    label: '序号',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Enable',
                    label: '启用状态',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter: (row, column, value) => {
                        if (value == 1) {
                            return '是'
                        } 
                        return '否'
                    },
                },
                {
                    prop: 'Supplier_Code',
                    label: '供应商编码',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'QXBZ',
                    label: '缺项备注',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Supplier_Name',
                    label: '供应商名称',
                    minWidth: 320,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'STOP_SEND',
                    label: '停止配送',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true,
                    formatter(row,col,value){
                        if (value == 1) {
                            return '是'
                        }
                        return "否"
                    }
                    
                },
                {
                    prop: 'SOCIAL_CREDIT_CODE',
                    label: '社会统一信用代码',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Licence_File_Full_Name',
                    label: '企业地址',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Contact_Phone2',
                    label: '企业电话',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'OFFICIAL_SEAL_PICTURE',
                    label: '送货章图片',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Business_License_Valid_Date',
                    label: '营业执照效期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'RODUCTION_CLASS_1_VALID_DATE',
                    label: '一类的许可证经营有效期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Roduction_class_2_Valid_Date',
                    label: '二类的许可证经营有效期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Roduction_class_3_Valid_Date',
                    label: '三类的许可证经营有效期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'DR_VALID_DATE',
                    label: '体外诊断试剂经营许可证有效期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'WTS_VALID_DATE',
                    label: '业务员委托书有效期',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Contact_Person',
                    label: '业务员姓名',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'YWY_PEO_ID',
                    label: '业务员身份证号',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Contact_Phone',
                    label: '业务员联系电话',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Supplier_Nature',
                    label: '供应商性质',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Cold_Chain_Apparatus_Supply',
                    label: '冷链器械供应条件',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'SUP_CODE_TWO',
                    label: 'hrp供应商编码2',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Supplier_Code_Charging',
                    label: '财务科供应商编码',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'File_Location',
                    label: '档案位置',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'YG_SUP_CODE',
                    label: '阳光平台编码',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Create_Time',
                    label: '创建时间',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'Last_Update_Time',
                    label: '更新时间',
                    minWidth: 120,
                    sortable: 'custom',
                    align: 'center',
                    showOverflowTooltip: true
                }
            ]
        }
    },
    mounted(){
        
    },
    methods:{
        onCurrentChange(current){
            console.log(current);
        },
        onSizeChange(e){
            console.log(e);
        },
        async getDataList(option){
            
            let loadingInstance = Loading.service({
                target:".table-supplier .el-table"
            })

            let dataList = await apiSupplierGetList({
                page:option.page,
                size:option.limit,
                keyword:this.where.keyword,
                enable:this.where.enable,
                order:option.order.order,
                field:option.order.sort,
            }).then(res=>{
               if (res.data.code != "200") {
                    return false
               }
                return {
                    count:res.data.total,
                    list:res.data.result
                }
            }).finally(()=>{
                loadingInstance.close()
            })
            if (!dataList) {
                dataList = {
                    count:0,
                    list:[]
                }
            }
            return dataList
        }
    }
}
</script>

