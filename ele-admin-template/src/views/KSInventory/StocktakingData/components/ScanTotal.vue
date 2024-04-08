<template>
    <div class="scan-total">
        <ele-modal width="600px" :visible="visible" :close-on-click-modal="true" custom-class="ele-dialog-form"
            title="扫码盘点" @update:visible="updateVisible">

            <el-input style="" v-model="form.code" placeholder="扫码获取定数码" @change="submitItem()">
            </el-input>

        </ele-modal>
    </div>
</template>
<script>
import {scanInventory} from '@/api/KSInventory/StocktakingData/index'
export default {
    name: 'scanTotal',
    props:{
      // 弹窗是否打开
      visible: Boolean,
      KSDepartmentalPlanData:Object
    },
    data() {
        const defaultForm = {
            code:'',
        };
        return {
            defaultForm,
            // 表单数据
            form: { ...defaultForm },
        };
    },
    computed: {
        // 是否开启响应式布局
        styleResponsive() {
            return this.$store.state.theme.styleResponsive;
        }
    },
    methods: {
        /* 更新visible */
        updateVisible(value) {
            this.$emit('update:visible', value);
        },
        // 提交扫描的定数码
        submitItem(){
            let data = {
                "code":this.form.code,
                "GENERATE_DATE":this.KSDepartmentalPlanData.GENERATE_DATE,
                "DEPT_TWO_CODE":this.KSDepartmentalPlanData.DEPT_TWO_CODE
            }
            scanInventory(data).then(res => {
                this.$message.success(res.msg)
            }).catch(err=>{
                this.$message.error(err)
            })
        }
    },
    watch: {},
    created() { },
    mounted() { },
    beforeDestroy() { }
};
</script>