<template>
 <div class="search-container">
    <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_search1" placeholder="品种编码、品种全称" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_search2" placeholder="请输入供应商搜索" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_search3" placeholder="请输入生产批号搜索" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_classificName" placeholder="分类属性" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_search5" placeholder="请输入生产企业搜索" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_APPROVAL_NUMBER" placeholder="请输入注册证搜索" />
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="dateRange"
            @change="handleDateRangeChange"
          >
          </el-date-picker>
        </el-col>
      </el-row>
        <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventoryNew_search4" placeholder="库存位置" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input size="mini" clearable v-model="where.inventory_Position" placeholder="货位号" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            所属区域:
            <el-select
              v-model="where.UpShelfState"
              size="mini"
              placeholder="全部"
              clearable
              style="width: 140px;"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="合格区" value="1"></el-option>
              <el-option label="普通隔离区" value="6"></el-option>
              <el-option label="防疫物资区" value="11"></el-option>
              <el-option label="不合格区" value="7"></el-option>
              <el-option label="盘损隔离区" value="8"></el-option>
              <el-option label="应急库" value="9"></el-option>
              <el-option label="拣配区" value="2"></el-option>
            </el-select>
          </label>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            合同到期:
            <el-select
              v-model="where.conTime"
              size="mini"
              placeholder="全部"
              clearable
              style="width: 140px;"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="过期" value="1"></el-option>
              <el-option label="未过期" value="0"></el-option>
            </el-select>
          </label>
        </el-col>

        <!-- 货票同行 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            货票同行:
            <el-select
              v-model="where.hptx"
              size="mini"
              placeholder="全部"
              clearable
              style="width: 140px;"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 是否计费 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否计费:
            <el-select v-model="where.isCharge" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <!-- 高低值分类 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            高低值分类:
            <el-select v-model="where.highOrLowClass" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="低值" value="0"></el-option>
              <el-option label="高值" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 是否中标 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否中标:
            <el-select v-model="where.isBidding" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="不中标" value="0"></el-option>
              <el-option label="中标" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 专购 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            专购:
            <el-select v-model="where.specialPurchase" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="非专购" value="0"></el-option>
              <el-option label="专购" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 一次性灭菌包装 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            一次性灭菌包装:
            <el-select v-model="where.oneoffSterilizationPackaging" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 存储条件 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            存储条件:
            <el-select v-model="where.storageType" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="常温" value="0"></el-option>
              <el-option label="阴凉" value="1"></el-option>
              <el-option label="冷藏(2~8°C)" value="2"></el-option>
              <el-option label="冷冻" value="3"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 是否植入 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否植入:
            <el-select v-model="where.isEmbedded" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="不植入" value="0"></el-option>
              <el-option label="植入" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <!-- 是否 sn 码 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否 sn 码:
            <el-select v-model="where.isSerialNumber" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="否" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 是否防护物质 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否防护物质:
            <el-select v-model="where.isProtect" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="不是" value="0"></el-option>
              <el-option label="是" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 是否介入 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            是否介入:
            <el-select v-model="where.isIntervened" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="不介入" value="0"></el-option>
              <el-option label="介入" value="1"></el-option>
            </el-select>
          </label>
        </el-col>
        <!-- 高低值分类下级分类 -->
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <label class="el-label--inline">
            高低值分类下级分类:
            <el-select v-model="where.highOrLowClassTwo2" size="mini" placeholder="全部" clearable style="width: 140px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="重点治理" value="1"></el-option>
              <el-option label="非重点治理" value="2"></el-option>
            </el-select>
          </label>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 6 }">
          <div class="ele-form-actions">
            <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
              查询
            </el-button>
            <!-- <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
            <el-button type="success" size="mini" @click="markAsProcessed">标记处理</el-button>
            <el-button type="success" size="mini" icon="el-icon-download" @click="exportData">导出</el-button> -->
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 默认表单数据
      defaultWhere: {
        inventoryNew_search1: '',
        inventoryNew_search2: '',
        inventoryNew_search3: '',
        inventoryNew_classificName: '',
        inventoryNew_search5: '',
        inventoryNew_APPROVAL_NUMBER: '',
        inventoryNew_search4: '',
        inventory_Position: '',
        UpShelfState: '',
        conTime: '',
        hptx: '',
        isCharge: '-1',
        highOrLowClass: '-1',
        isBidding: '-1',
        specialPurchase: '-1',
        oneoffSterilizationPackaging: '-1',
        storageType: '-1',
        isEmbedded: '-1',
        isSerialNumber: '-1',
        isProtect: '-1',
        isIntervened: '-1',
        highOrLowClassTwo2: '',
        start_time: '',
        end_time: '',
      },
      // 表单数据
      where: {},
      // 日期范围
      dateRange: []
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
    /*  重置 */
    reset() {
      this.where = { ...this.defaultWhere };
      this.dateRange = [];
      this.search();
    },
    /* 标记处理 */
    markAsProcessed() {
      this.$emit('markAsProcessed', this.where);
    },
    /* 导出数据 */
    exportData() {
      this.$emit('exportData', this.where);
    },
    // 处理日期范围选择
    handleDateRangeChange(range) {
      if (range && range.length === 2) {
        this.where.start_time = range[0];
        this.where.end_time = range[1];
      } else {
        this.where.start_time = '';
        this.where.end_time = '';
      }
    }
  }
};
</script>

<style scoped>
.search-container {
  margin-bottom: 15px;
}

.el-label--inline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  color: #303133;
}

.el-select--mini.el-select {
  min-width: 140px;
}

.el-row {
  margin-bottom: 10px; /* 设置行高间隔为 10px，可按需调整 */
}

@media (max-width: 768px) {
  .el-col {
    margin-bottom: 8px;
  }
  .el-label--inline {
    gap: 4px;
    font-size: 12px;
  }
}
</style>