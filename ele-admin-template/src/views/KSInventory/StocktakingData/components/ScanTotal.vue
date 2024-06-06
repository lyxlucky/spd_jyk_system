<template>
    <div class="scan-total">
        <ele-modal width="400px" :visible="visible" :close-on-click-modal="false" @close="closeModal" custom-class="ele-dialog-form"
            title="扫码盘点" @update:visible="updateVisible">
            <el-row type="flex" justify="center" :gutter="10">
                <el-col v-bind="styleResponsive ? { lg:20, md: 4 } : { span: 4 }">
                    <!-- @change="submitItem()" -->
                    <!-- 输入框失去焦点触发提交 -->
                    <el-input @change="submitItem()" ref="input" v-model="form.code" placeholder="扫码获取定数码">
                    </el-input>
                </el-col>
                <!-- <el-button icon="el-icon-check" ref="button" type="primary" incon="el-icon-plus" @click="clikcSubmit()">提交</el-button> -->
            </el-row>
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
        closeModal(){
            this.$emit('closeModal', '');
        },

        //点击提交定数码
        clikcSubmit(){
            this.submitItem()
        },
        // 提交扫描的定数码
        submitItem(){
            if(this.form.code == "" || this.form.code == undefined){
                this.$refs.input.focus();
                return this.$message.error('请输入定数码')
            }
            let data = {
                "code":this.form.code,
                "GENERATE_DATE":this.KSDepartmentalPlanData.GENERATE_DATE,
                "DEPT_TWO_CODE":this.KSDepartmentalPlanData.DEPT_TWO_CODE
            }
            scanInventory(data).then(res => {
                this.$message.success(res.msg);
                this.form.code = ''
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
            }).catch(err=>{
                this.form.code = ''
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
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