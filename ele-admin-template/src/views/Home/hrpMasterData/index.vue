<template>
    <div class="ele-body">
        <el-row :gutter="10">
            <el-col :span="12">
                <HrpMasterDataTable1></HrpMasterDataTable1>
            </el-col>
            <el-col :span="12">
                <HrpMasterDataTable2></HrpMasterDataTable2>
            </el-col>
        </el-row>
    </div>
</template>

<script>
// 修改导入语句，去掉花括号
import HrpMasterDataTable1 from './components/HrpMasterDataTable1'
import HrpMasterDataTable2 from './components/HrpMasterDataTable2'

export default {
    components:{
        HrpMasterDataTable1,
        HrpMasterDataTable2  // 添加HrpMasterDataTable2组件注册
    },
    data() {
        return {
            
        };
    },
    created() {

    },
    methods: {
        handleRowClick(row) {
            // 处理行点击事件
        },
        
        
    }
};
</script>

<style scoped></style>