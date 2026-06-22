<template>
  <div class="spd-panel__body top-table-search">
    <el-form
      size="mini"
      :inline="true"
      label-width="72px"
      class="ele-form-search filter-form"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="计划单号">
        <el-input v-model="where.deptPlanCode" clearable placeholder="科室计划单号" style="width: 130px" />
      </el-form-item>
      <el-form-item label="品种">
        <el-input v-model="where.varCode" clearable placeholder="编码/名称" style="width: 120px" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="where.supplierName" clearable placeholder="供应商名称" style="width: 120px" />
      </el-form-item>
      <el-form-item label="规格型号">
        <el-input v-model="where.spec" clearable placeholder="规格/型号" style="width: 110px" />
      </el-form-item>
      <el-form-item label="生产企业">
        <el-input v-model="where.manufacturerName" clearable placeholder="生产企业" style="width: 120px" />
      </el-form-item>
      <el-form-item label="申领人">
        <el-input v-model="where.applyMan" clearable placeholder="申领人" style="width: 100px" />
      </el-form-item>
      <el-form-item label="二级科室">
        <el-input v-model="where.applyMan" clearable placeholder="SPD二级科室" style="width: 120px" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="where.yjEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始时间"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="where.yjEnd"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束时间"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="剩余为零">
        <el-select v-model="where.purchase" clearable placeholder="剩余为零" style="width: 90px" @change="search()">
          <el-option label="不包含" value="1" />
          <el-option label="包含" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="剔除">
        <el-select v-model="where.purchase" clearable placeholder="剔除" style="width: 90px" @change="search()">
          <el-option label="未剔除" value="1" />
          <el-option label="全部" value="1" />
          <el-option label="已剔除" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="中标">
        <el-select v-model="where.purchase" clearable placeholder="中标" style="width: 90px" @change="search()">
          <el-option label="全部" value="" />
          <el-option label="中标" value="1" />
          <el-option label="未中标" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="暂挂">
        <el-select v-model="where.purchase" clearable placeholder="暂挂" style="width: 90px" @change="search()">
          <el-option label="全部" value="" />
          <el-option label="暂挂" value="1" />
          <el-option label="未暂挂" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="库区">
        <el-select v-model="where.purchase" clearable placeholder="库区" style="width: 90px" @change="search()">
          <el-option label="不包含" value="1" />
          <el-option label="包含" value="0" />
        </el-select>
      </el-form-item>
      <!-- <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input clearable v-model="where.deptPlanCode" placeholder="请输入科室计划单号" />
          </el-form-item>
        </el-col>
        ...
      </el-row> -->
    </el-form>

    <div class="spd-toolbar top-table-toolbar">
      <div class="spd-toolbar__group">
        <span class="spd-toolbar__label">查询</span>
        <div class="spd-toolbar__btns">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <span class="spd-toolbar__label">生成</span>
        <div class="spd-toolbar__btns">
          <el-button type="primary" plain @click="handleSearch">生成散货申领单</el-button>
          <el-button type="primary" plain @click="handleSearch">生成拣配单</el-button>
          <el-button type="primary" plain @click="handleSearch">生成定数包</el-button>
          <el-button type="primary" plain @click="handleSearch">生成备货</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <span class="spd-toolbar__label">维护</span>
        <div class="spd-toolbar__btns">
          <el-button type="primary" plain @click="handleSearch">变更剩余申请</el-button>
          <el-button type="primary" plain @click="handleSearch">临采详情</el-button>
          <el-button type="primary" plain @click="handleSearch">替换品种</el-button>
          <el-button type="primary" plain icon="el-icon-download" @click="handleSearch">导出</el-button>
          <el-button type="primary" plain @click="handleSearch">批量备注</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <span class="spd-toolbar__label">状态</span>
        <div class="spd-toolbar__btns">
          <el-button type="warning" plain @click="handleSearch">暂挂</el-button>
          <el-button type="warning" plain @click="handleSearch">取消暂挂</el-button>
        </div>
      </div>
      <div class="spd-toolbar__divider" />
      <div class="spd-toolbar__group">
        <span class="spd-toolbar__label">删除</span>
        <div class="spd-toolbar__btns">
          <el-button type="danger" plain icon="el-icon-delete" @click="handleSearch">强制结束计划单</el-button>
          <el-button type="danger" plain icon="el-icon-delete" @click="handleSearch">删除计划单明细</el-button>
        </div>
      </div>
      <!-- <el-form-item class="ele-form-actions" label-width="0">
        <el-button size="mini" type="primary" icon="el-icon-search" @click="handleSearch()">查询</el-button>
        ...
      </el-form-item> -->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'NewDeptPlannedDeliveryTopTableSearch',
    data() {
      const defaultWhere = {
        deptPlanCode: '',
        varCode: '',
        supplierName: '',
        spec: '',
        manufacturerName: '',
        applyMan: ''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      },
      handleSearch() {
        this.search();
      }
    }
  };
</script>
<style scoped lang="scss">
.filter-form :deep(.el-form-item__label) {
  white-space: nowrap;
}

.filter-form :deep(.el-form-item__content) {
  max-width: none !important;
}

.top-table-toolbar {
  margin: 4px 0 0;
  padding: 8px 0 0;
  border-top: 1px dashed #e4e7ed;
  row-gap: 10px;
}

.top-table-toolbar :deep(.el-button--mini) {
  padding: 5px 10px;
}
</style>
