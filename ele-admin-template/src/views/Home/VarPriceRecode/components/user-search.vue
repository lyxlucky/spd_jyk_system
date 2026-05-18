<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="品种">
          <el-input
            size="mini"
            clearable
            v-model="where.VARIETIE_SEARCH_VALUE"
            placeholder="编码/名称/规格型号"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="where.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
            placeholder="开始时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="where.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            size="mini"
            placeholder="结束时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col v-show="false" v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
        <el-form-item label="处理状态">
          <el-select v-model="where.STATE" size="mini" placeholder="请选择">
            <el-option label="未处理" value="0" />
            <el-option label="全部" value="" />
            <el-option label="已处理" value="1" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 6 }">
        <el-form-item label="新旧价格是否一致">
          <el-select v-model="where.PriceIsEqual" size="mini" placeholder="请选择">
            <el-option label="否" value="0" />
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
        <div class="ele-form-actions">
          <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button v-show="false" size="mini" type="success" @click="markAsProcessed">标记处理</el-button>
          <el-button
            v-permission="'export-VarPriceRecodeDc'"
            size="mini"
            type="success"
            icon="el-icon-download"
            @click="exportData"
          >
            导出excel
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
      defaultWhere: {
        VARIETIE_SEARCH_VALUE: '',
        STATE: '0',
        start_time: '',
        end_time: '',
        PriceIsEqual: '0'
      },
      where: {}
    };
  },
  computed: {
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  created() {
    this.where = { ...this.defaultWhere };
  },
  methods: {
    search() {
      this.$emit('search', { ...this.where });
    },
    getWhere() {
      return { ...this.where };
    },
    markAsProcessed() {
      this.$emit('markAsProcessed', { ...this.where });
    },
    exportData() {
      this.$emit('exportData', { ...this.where });
    }
  }
};
</script>
