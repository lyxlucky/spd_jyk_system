<template>
  <el-form
    class="ele-form-search temporary-search"
    size="mini"
    :inline="true"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        clearable
        v-model="where.divrjks2_search_inpName"
        placeholder="请输入科室名称"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        clearable
        v-model="where.divrjks2_search_inp"
        placeholder="品种编码、品种名称、型号规格、定数码、RFID码"
      />
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="where.timerange"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="暂借开始日期"
        end-placeholder="暂借结束日期"
        style="width:100%"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="ele-btn-icon"
        @click="search"
      >
        查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="success"
        icon="el-icon-download"
        class="ele-btn-icon"
        @click="exportData"
      >
        导出
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        icon="el-icon-upload"
        class="ele-btn-icon"
        @click="returnData"
      >
        归还
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        // 默认表单数据
        defaultWhere: {
          divrjks2_search_inpName: '',
          divrjks2_search_inp: '',
          timerange: []
        },
        // 表单数据
        where: {}
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    created() {
      // 初始化 where 对象
      this.where = { ...this.defaultWhere };
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /* 导出数据 */
      exportData() {
        // 这里添加导出数据的具体逻辑
        this.$emit('exportData', this.where);
      },
      /* 归还数据 */
      returnData() {
        // 这里添加归还数据的具体逻辑
        this.$emit('returnData', this.where);
      }
    }
  };
</script>

<style scoped>
.temporary-search {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-bottom: 8px;
}

.temporary-search :deep(.el-form-item) {
  margin: 0;
}
</style>
