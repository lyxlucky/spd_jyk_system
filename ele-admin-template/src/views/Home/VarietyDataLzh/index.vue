<template>
  <div class="ele-body">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%">
      <el-tab-pane label="散货品种维护" name="first">
        <VarietyDataLzhMain />
      </el-tab-pane>
      <el-tab-pane label="定数包品种维护" name="second">定数包品种维护</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';
import VarietyDataLzhMain from './VarietyDataLzhMain/index.vue';

export default {
  name: 'DemoTest',
  components: {
    VarietyDataLzhMain
  },
  data() {
    return {
      // 表格数据
      data: [],
      // 搜索表单数据
      where: {
        username: '',
        sex: undefined
      },
      // 分页参数
      pagination: {
        // 第几页
        page: 1,
        // 每页显示条数
        limit: 50
      },
      // 总数量
      count: 0,
      // 表格的loading
      loading: true,
      // 排序条件
      orders: {},
      // 表格选中数据
      selection: [],
      activeName: 'first'
    };
  },
  created() {
    this.query();
  },
  methods: {
    /* 表格查询数据 */
    query() {
      this.loading = true;
      getDeptAuthVarNew({
        ...this.orders,
        ...this.where,
        ...this.pagination
      })
        .then((res) => {
          this.loading = false;
          this.data = res.result;
          // this.count = count;
        })
        .catch((e) => {
          this.loading = false;
          this.$message.error(e.message);
        });
    },
    /* 搜索 */
    reload() {
      this.pagination.page = 1;
      this.query();
    },
    /*  重置搜索 */
    reset() {
      this.where = {
        username: '',
        sex: undefined
      };
      this.reload();
    },
    /*  每页多少条改变 */
    onSizeChange(size) {
      this.pagination.limit = size;
      this.query();
    },
    /*  翻页 */
    onCurrentChange(current) {
      this.pagination.page = current;
      this.query();
    },
    /* 排序改变 */
    onSortChange({ prop, order }) {
      if (!order) {
        this.orders = {};
      } else {
        this.orders = {
          sort: prop,
          order: order === 'descending' ? 'desc' : 'asc'
        };
      }
      this.query();
    },
    /* 表格选择项改变 */
    onSelectionChange(selection) {
      this.selection = selection;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      // removeUser(row.userId)
      //   .then((msg) => {
      //     loading.close();
      //     this.$message.success(msg);
      //     this.reload();
      //   })
      //   .catch((e) => {
      //     loading.close();
      //     this.$message.error(e.message);
      //   });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
    }
  },
  handleClick(tab, event) {
    console.log(tab, event);
  }
};
</script>

<style scoped>
::v-deep .el-tabs__nav.is-top {
  width: 100% !important;
  display: flex;
}

::v-deep .el-tabs__item.is-top {
  width: 50%;
  display: flex;
  justify-content: center;
}
</style>
