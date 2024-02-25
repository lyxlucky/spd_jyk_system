<!-- 用户导入弹窗 -->
<template>
  <!-- <ele-modal width="1000px" title="分配权限" :modal="false" :movable="false" :centered="true" :visible="visible" @update:visible="updateVisible">
    <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :toolbar="false" :columns="columns" :datasource="datasource" cache-key="PermissionList">
    </ele-pro-table>

    <el-table ref="table" height:="500" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="Permission_Name" label="权限名称" maxwidth="120">
      </el-table-column>
      <el-table-column prop="Permission_Url" label="链接" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Remarks" label="备注" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </ele-modal> -->
  <el-dialog title="分配权限" :visible="visible" width="50%" @update:visible="updateVisible">
    <el-table ref="table" height="500" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="Permission_Name" label="权限名称" maxwidth="120">
      </el-table-column>
      <el-table-column prop="Permission_Url" label="链接" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="Remarks" label="备注" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <el-row class="btn_permission">
      <el-button type="success" @click="submin()">确定</el-button>
      <el-button @click="updateVisible(false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getPermissionList,
  getPermissionListByGroupsID,
  correlationGroups_Permissions
} from '@/api/SystemConfiguration/PermissionGroup';
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
export default {
  props: {
    // 是否打开弹窗
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 请求状态
      dialogVisible: false,
      loading: false,
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left',
          showOverflowTooltip: true
        },
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'Permission_Name',
          label: '权限名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 300
        },
        {
          prop: 'Permission_Url',
          label: '链接',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 300
        },
        {
          prop: 'Remarks',
          label: '备注',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 250
        }
      ],
      pageSizes: [99999],
      pageSize: 99999,
      tableData: [],
      tableDataByID: [],
      multipleSelection: []
    };
  },
  methods: {
    // 数据源
    datasource({ page, limit, where, order }) {
      var ID = this.$store.state.user.info.Group_ID;
      let data = getPermissionListByGroupsID(ID).then((res) => {
        var data2 = {};
        data2.list = res.result;
        this.tableData = res.result;
        return data2;
      });
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    toggleSelection(rows) {
      // this.tableDataByID.forEach((row) => {
      //   this.$refs.dataTable.toggleRowSelection(row, true);
      // });
      let list = [];
      this.tableData.forEach((item) => {
        this.tableDataByID.forEach((val) => {
          if (val.ID === item.ID) {
            list.push(item);
          }
        });
      });
      if (list) {
        list.forEach((row) => {
          this.$refs.table.toggleRowSelection(row, true);
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    initPermissionList() {
      getPermissionList().then((res) => {
        var data2 = {};
        data2.list = res.result;
        this.tableData = res.result;
        return data2;
      });
    },
    initPermissionListById() {
      var ID = this.$store.state.user.info.Group_ID;
      getPermissionListByGroupsID(ID).then((res) => {
        var data2 = {};
        data2.list = res.result;
        this.tableDataByID = res.result;
        // this.$refs.table.toggleRowSelection(res.result[0])
        // res.result.forEach((row) => {
        //   this.$refs.table.toggleRowSelection(row);
        // });
        return data2;
      });
    },
    submin() {
      const loading = this.$messageLoading('授权中...');
      var array = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        array.push(this.multipleSelection[i].ID);
      }
      var data = {
        array,
        groupID: this.data.ID
      };

      correlationGroups_Permissions(data).then((res) => {
        loading.close();
        if (res == true) {
          loading.close();
          this.$message.success('授权成功!');
          location.reload();
        } else {
          this.$message.error('授权失败!');
        }
      });
    }
  },
  created() {
    this.initPermissionList();
    this.initPermissionListById();
  },
  watch: {
    visible: function (params) {
      if (params == true) {
        this.$nextTick(() => {
          this.toggleSelection();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .ele-pro-table {
//   :deep(.el-dialog),
//   :deep(.el-dialog__body) {
//     max-height: 500px;
//   }
// }
.btn_permission {
  display: flex;
  justify-content: center;
}
</style>
