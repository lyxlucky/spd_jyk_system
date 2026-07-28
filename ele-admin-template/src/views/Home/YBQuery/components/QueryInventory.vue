<template>
    <div class="yb-query-inventory">
        <YBQueryFilter ref="filter" @search="handleSearch" />
        <div class="yb-query-inventory-stats">
            <div>成功: <span class="success">{{successCount}}</span></div>
            <div>失败: <span class="fail">{{failCount}}</span></div>
            <div>总记录数: <span>{{total}}</span></div>
        </div>
        <div class="yb-query-inventory-table">
            <ele-pro-table
                ref="table"
                class="data-table"
                size="mini"
                :toolbar="false"
                :toolkit="['columns', 'fullscreen']"
                height="calc(100vh - 320px)"
                :pageSize="pageSize"
                :pageSizes="pageSizes"
                :columns="inventoryColumns"
                :datasource="datasource"
                :selection.sync="selection"
                :initLoad="false"
            >
            </ele-pro-table>
        </div>
    </div>
</template>
<script>
import YBQueryFilter from './Filter.vue';
import { pageSize, pageSizes, inventoryColumns } from '../constants';
import { GetYB3501List } from '@/api/Home/YBQuery';
export default {
    name: 'QueryInventory',
    components: {
        YBQueryFilter
    },
    data() {
        return {
            pageSize,
            pageSizes,
            inventoryColumns,
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
            return GetYB3501List({
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
.yb-query-inventory {
    padding: 12px 0;
    &-stats {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        div {
            padding: 0 6px;
        }
        .success {
            color: #059257;
        }
        .fail {
            color: #f56c6c;
        }
    }
}
</style>