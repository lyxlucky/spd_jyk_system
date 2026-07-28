<template>
    <div class="yb-query">
        <el-tabs :value="activeTab">
            <el-tab-pane label="查询盘存上传" name="first" >
                <QueryInventory />
            </el-tab-pane>
            <el-tab-pane label="查询商品变更入库" name="second" lazy>
                <QueryWarehousing />
            </el-tab-pane>
            <el-tab-pane label="查询商品变更出库" name="third" lazy>
                <QueryOutbound />
            </el-tab-pane>
            <el-tab-pane label="查询商品采购" name="fourth" lazy>
                <QueryProcurement />
            </el-tab-pane>
            <el-tab-pane label="查询商品退货" name="fifth" lazy>
                <QueryReturn />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import QueryInventory from './components/QueryInventory.vue';
import QueryOutbound from './components/QueryOutbound.vue';
import QueryProcurement from './components/QueryProcurement.vue';
import QueryReturn from './components/QueryReturn.vue';
import QueryWarehousing from './components/QueryWarehousing.vue';
export default {
    name: 'YBQuery',
    components: {
        QueryInventory,
        QueryOutbound,
        QueryProcurement,
        QueryReturn,
        QueryWarehousing
    },
    data() {
        return {
            activeTab: 'first'
        };
    }
}
</script>
<style scoped lang="scss">
.yb-query {
    padding: 12px 20px;
}
</style>