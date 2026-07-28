<template>
    <div class="yb-query-outbound">
        <YBQueryFilter ref="filter" @search="handleSearch" />
        <div class="yb-query-outbound-stats">
            <div>成功: <span class="success">{{successCount}}</span></div>
            <div>失败: <span class="fail">{{failCount}}</span></div>
            <div>总记录数: <span>{{total}}</span></div>
        </div>
        <div class="yb-query-outbound-table">
            <ele-pro-table
                ref="table"
                class="data-table"
                size="mini"
                :toolbar="false"
                :toolkit="['columns', 'fullscreen']"
                height="calc(100vh - 320px)"
                :pageSize="pageSize"
                :pageSizes="pageSizes"
                :columns="outboundColumns"
                :datasource="datasource"
                :selection.sync="selection"
                :initLoad="false"
            >
                <template #state="scope">
                    <div :class="stateColorMap[scope.row.ybstate_bg]">{{stateMap[scope.row.ybstate_bg]}}</div>
                </template>
            </ele-pro-table>
        </div>
    </div>
</template>
<script>
import YBQueryFilter from './Filter.vue';
import { pageSize, pageSizes, stateMap, stateColorMap, outboundColumns } from '../constants';
import { GetYB3502CKList } from '@/api/Home/YBQuery';
export default {
    name: 'QueryOutbound',
    components: {
        YBQueryFilter
    },
    data() {
        return {
            pageSize,
            pageSizes,
            stateMap,
            stateColorMap,
            outboundColumns,
            selection: [],
            successCount: 0,
            failCount: 0,
            total: 0
        };
    },
    mounted() {
        this.$refs.filter.handleSearch();
    },
    methods: {
        datasource({ page, limit, where }) {
            const [startTime, endTime] = where.sendDate;
            return GetYB3502CKList({
                page,
                size: limit,
                state: where.state,
                startTime,
                endTime
            }).then((res)=>{
                this.successCount = res.successCount;
                this.failCount = res.failCount;
                this.total = res.total;
                return {
                    count: res.total,
                    list: res.result,
                };
            });
        },
        handleSearch(form) {
            this.$refs.table.reload({ page: 1, where: form });
        },
    }
}
</script>
<style scoped lang="scss">
.yb-query-outbound {
    padding: 12px 0;
    &-stats {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        div {
            padding: 0 6px;
        }
    }
}
.success {
    color: #059257;
}
.fail {
    color: #f56c6c;
}
</style>