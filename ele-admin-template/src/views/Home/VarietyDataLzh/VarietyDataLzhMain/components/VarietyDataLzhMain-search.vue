<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <el-form class="ele-form-search">
        <el-row type="flex" :gutter="2">
          <el-col :lg="2">
            <el-form-item>
              <el-select size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部筛选" value="0" />
                <el-option label="防控物资女" value="1" />
                <el-option label="阳光采购平台品种" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="高低值分类：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="-1" />
                <el-option label="高值" value="1" />
                <el-option label="低值" value="0" />
                <el-option label="试剂" value="2" />
                <el-option label="消毒" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item label="">
              <el-select size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="重点分类-全部" value="-1" />
                <el-option label="重点治理" value="1" />
                <el-option label="非重点治理" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item label="">
              <el-input size="mini" v-model="where.username" placeholder="高值序号" clearable />
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item label="">
              <el-select size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="物价-全部" value="" />
                <el-option label="物价-已提交" value="1" />
                <el-option label="物价-未提交" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="启用状态：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="启用" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="计费编码：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="为空" value="1" />
                <el-option label="不为空" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="修改时间：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="当天" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="5">
            <el-form-item label="审批时间：" label-width="40">
              <el-col :span="9">
                <el-date-picker size="mini" type="date" placeholder="选择日期" v-model="where.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col :span="9">
                <el-date-picker size="mini" type="date" placeholder="选择日期" v-model="where.date1" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="修改时间：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="当天" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :lg="3">
            <el-form-item label="审批状态：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="审批通过" value="1" />
                <el-option label="待审批" value="0" />
                <el-option label="未通过" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="北大回传标记：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="未标记" value="0" />
                <el-option label="已标记" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="3">
            <el-form-item label="临时挂起：" label-width="40">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="否" value="0" />
                <el-option label="是" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="设备科审批状态：" label-width="40" style="display: none;;">
              <el-select style="width:100px" size="mini" clearable v-model="where.sex" placeholder="请选择">
                <el-option label="全部" value="" />
                <el-option label="否" value="0" />
                <el-option label="是" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="2">
            <el-form-item>
              <el-checkbox v-model="checked">是否过滤非库宝品种</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>

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
        sex: undefined,
        date1: ''
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
  created() {},
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

<style scoped>
.ele-form-search .el-form-item {
  margin-bottom: 0;
}
</style>
