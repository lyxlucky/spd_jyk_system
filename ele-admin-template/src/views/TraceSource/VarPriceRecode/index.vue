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
      <el-table v-loading="loading" :data="data" @sort-change="onSortChange" @selection-change="onSelectionChange">
        <template v-slot:toolbar>
          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit()">
            新建
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch">
            删除
          </el-button>
          <el-button size="small" icon="el-icon-upload2" class="ele-btn-icon" @click="openImport">
            导入
          </el-button>
        </template>
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column type="index" width="45" align="center" />
        <el-table-column prop="Varietie_Code_New" label="品种编码" sortable="custom" />
        <el-table-column prop="Varietie_Name" label="品种名称" sortable="custom" />
        <el-table-column prop="Specification_Or_Type" label="规格/型号" sortable="custom" />
        <el-table-column prop="Manufacturing_Ent_Name" label="生产企业名称" sortable="custom" />
        <el-table-column prop="APPROVAL_NUMBER" label="注册证号" sortable="custom" />
        <el-table-column prop="Unit" label="单位" sortable="custom" />
        <el-table-column prop="Price" label="中标价" sortable="custom" />
        <el-table-column prop="VAR_CATEGORY" label="品种类别" sortable="custom" />
        <el-table-column prop="REAGENT_CONVERSION_RATIO" label="换算比(试剂)" sortable="custom" />
        <el-table-column prop="INSTRUMENT_REMARK" label="仪器备注" sortable="custom" />
        <el-table-column label="操作" align="center">
          <template v-slot:default="{ row }">
            <el-popconfirm title="确定要删除吗？" @confirm="remove(row)">
              <template v-slot:reference>
                <el-link type="danger" :underline="false" icon="el-icon-delete">
                  删除
                </el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="pagination.page" :page-size="pagination.limit" :total="count" :background="true" class="ele-pagination-circle" layout="total, sizes, prev, pager, next, jumper" @size-change="onSizeChange" @current-change="onCurrentChange" />
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
  }
};
</script>

