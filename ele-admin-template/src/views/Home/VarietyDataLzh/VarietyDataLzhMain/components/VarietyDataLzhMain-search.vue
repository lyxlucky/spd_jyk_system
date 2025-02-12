<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form label-width="77px" class="ele-form-search">
        <el-row :gutter="15">
          <el-col :lg="6" :md="12">
            <el-form-item label="">
              <el-input v-model="where.username" placeholder="品种编码/品种名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="">
              <el-input v-model="where.username" placeholder="注册证号" clearable />
            </el-form-item>
            <!-- <el-form-item label="性别:">
              <el-select clearable v-model="where.sex" placeholder="请选择" class="ele-fluid">
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :lg="6" :md="12">
            <div class="ele-form-actions">
              <el-button type="primary" @click="reload">查询</el-button>
              <el-button @click="reset">重置</el-button>
              <el-button type="danger" @click="removeBatch">批量删除</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 表格 -->
    </el-card>
  </div>
</template>

<script>
import { getDeptAuthVarNew } from '@/api/KSInventory/KSInventoryBasicData';

export default {
  name: 'DemoTest',
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
      selection: []
    };
  },
  created() {
  },
  methods: {
    /* 搜索 */
    reload() {
      this.$emit('search', { ...this.where });
    },
    /*  重置搜索 */
    reset() {
      this.where = {
        username: '',
        sex: undefined
      };
      this.reload();
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
  }
};
</script>

