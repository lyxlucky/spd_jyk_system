<template>
  <el-form
    label-width="77px"
    class="ele-form-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input
          size="mini"
          clearable
          v-model="where.divrjks2_search_inpName"
          placeholder="请输入科室名称"
        />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <el-input
          size="mini"
          clearable
          v-model="where.divrjks2_search_inp"
          placeholder="品种编码、品种名称、型号规格、定数码、RFID码"
        />
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <el-date-picker
          v-model="where.timerange"
          type="daterange"
          size="mini"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="暂借开始日期"
          end-placeholder="暂借结束日期"
        >
        </el-date-picker>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-search"
            class="ele-btn-icon"
            @click="search"
          >
            查询
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-download"
            class="ele-btn-icon"
            @click="exportData"
          >
            导出
          </el-button>
          <el-button
            size="mini"
            type="info"
            icon="el-icon-upload"
            class="ele-btn-icon"
            @click="returnData"
          >
            归还
          </el-button>
        </div>
      </el-col>
    </el-row>
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
