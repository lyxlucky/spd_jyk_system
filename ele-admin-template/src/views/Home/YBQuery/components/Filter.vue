<template>
    <div class="yb-query-filter">
        <el-form :model="form" :rules="rules" ref="form" inline="inline">
            <el-form-item label="发送时间" prop="sendDate">
                <el-date-picker 
                    v-model="form.sendDate"
                    unlink-panels
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="form.state" placeholder="请选择" clearable>
                    <el-option label="成功" value="1"></el-option>
                    <el-option label="失败" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'YBQueryFilter',
    data() {
        return {
            form: {
                sendDate: [],
                state: ''
            },
            rules: {
                sendDate: [{ required: true, message: '请选择发送时间', trigger: 'blur' }],
            }
        };
    },
    created() {
        this.reset();
    },
    methods: {
        reset() {
            const today = new Date();
            const todayStr = today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0');
            const last7DaysStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
            const last7DaysStartTime = last7DaysStart.getFullYear() + '-' +
                String(last7DaysStart.getMonth() + 1).padStart(2, '0') + '-' +
                String(last7DaysStart.getDate()).padStart(2, '0');
            this.form = {
                sendDate: [last7DaysStartTime, todayStr],
                state: ''
            };
        },
        handleSearch() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit('search', this.form);
                }
            });
        },
        handleReset() {
            this.reset();
            this.$refs.form?.resetFields();
            this.$emit('search', this.form);
        }
    }
}
</script>
<style scoped lang="scss">
.yb-query-filter {
    margin-bottom: -8px;
}
</style>