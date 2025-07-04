<template>
  <div class="loan-query-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card class="search-card" shadow="never">
        <div slot="header" class="card-header">
          <span class="card-title">
            <i class="el-icon-search"></i>
            搜索条件
          </span>
        </div>
        <el-form 
          ref="searchForm" 
          :model="where" 
          label-width="80px"
          class="search-form"
        >
          <el-row :gutter="15">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="批号" prop="BATCH">
                <el-input
                  v-model="where.BATCH"
                  placeholder="请输入批号"
                  size="small"
                  clearable
                  @keyup.enter.native="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="定数码" prop="DEF_NO_PKG_CODE">
                <el-input
                  v-model="where.DEF_NO_PKG_CODE"
                  placeholder="请输入定数码"
                  size="small"
                  clearable
                  @keyup.enter.native="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="科室名称" prop="DEPT_TWO_NAME">
                <el-input
                  v-model="where.DEPT_TWO_NAME"
                  placeholder="请输入科室名称"
                  size="small"
                  clearable
                  @keyup.enter.native="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="计费编码" prop="CHARGING_CODE">
                <el-input
                  v-model="where.CHARGING_CODE"
                  placeholder="请输入计费编码"
                  size="small"
                  clearable
                  @keyup.enter.native="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item label="品种名称" prop="VARIETIE_NAME">
                <el-input
                  v-model="where.VARIETIE_NAME"
                  placeholder="请输入品种名称"
                  size="small"
                  clearable
                  @keyup.enter.native="handleSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <el-form-item class="search-buttons">
                <el-button 
                  type="primary" 
                  icon="el-icon-search" 
                  size="small"
                  @click="handleSearch"
                >
                  搜索
                </el-button>
                <el-button 
                  icon="el-icon-refresh" 
                  size="small"
                  @click="handleReset"
                >
                  重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <!-- 表格区域 -->
    <div class="table-section">
      <el-card class="table-card" shadow="never">
        <ele-pro-table
          highlight-current-row
          ref="table"
          @current-change="onCurrentChange"
          height="calc(100vh - 320px)"
          :rowClickChecked="true"
          :stripe="true"
          :pageSize="pageSize"
          :pageSizes="pageSizes"
          :columns="columns"
          :datasource="datasource"
          :selection.sync="selection"
          cache-key="LoanQueryTableCacheKey"
        >
          <template v-slot:toolbar> </template>
        </ele-pro-table>
      </el-card>
    </div>
  </div>
</template>
<script>
  import { GetbindUseMachin } from '@/api/KSInventory/LoanQuery/index';
  export default {
    name: 'LoanQuery',
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'BATCH',
            label: '批号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'DEPT_TWO_NAME',
            label: '二级科室',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CHARGING_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          }
        ],
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        selection: [],
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = GetbindUseMachin({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.data
            };
            this.formData = res.result;
            return tData;
          }
        );
        return data;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      // 搜索功能
      handleSearch() {
        this.reload(this.where);
      },
      // 重置功能
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.where = {};
        this.reload({});
      }
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });
    },
    beforeDestroy() {
      this.$bus.$off('handleCommand');
    }
  };
</script>
<style lang="scss" scoped>
.loan-query-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-section {
  margin-bottom: 20px;
}

.search-card {
  border-radius: 8px;
  
  .card-header {
    display: flex;
    align-items: center;
    padding: 0;
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      
      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 16px;
  }
  
  .search-buttons {
    .el-form-item__content {
      display: flex;
      gap: 8px;
      
      .el-button {
        min-width: 70px;
        flex: 1;
      }
    }
  }
}

.table-section {
  .table-card {
    border-radius: 8px;
    
    :deep(.el-card__body) {
      padding: 20px;
    }
  }
}

// 响应式布局优化
@media (max-width: 1200px) {
  .search-form {
    .search-buttons {
      .el-form-item__content {
        .el-button {
          min-width: 60px;
          font-size: 12px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .loan-query-container {
    padding: 10px;
  }
  
  .search-form {
    .el-form-item {
      margin-bottom: 12px;
    }
    
    .search-buttons {
      .el-form-item__content {
        gap: 6px;
        
        .el-button {
          min-width: 50px;
          font-size: 12px;
          padding: 7px 10px;
        }
      }
    }
  }
}

// 表格样式优化
:deep(.ele-pro-table) {
  .el-table {
    border-radius: 4px;
    overflow: hidden;
    
    .el-table__header-wrapper {
      .el-table__header {
        th {
          background-color: #fafafa;
          color: #606266;
          font-weight: 600;
        }
      }
    }
    
    .el-table__row {
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
