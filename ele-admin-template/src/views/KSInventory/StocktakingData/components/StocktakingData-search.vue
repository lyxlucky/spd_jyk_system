<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="生成日期">
        <el-date-picker
          v-model="where.GENERATE_DATE"
          type="date"
          style="width: 140px"
          value-format="yyyy-MM-dd"
          placeholder="申领开始日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        <el-button type="primary" icon="el-icon-paperclip" @click="syncData()">同步PDA盘点数据</el-button>
        <!-- 生成盘点数据 -->
        <el-button type="primary" icon="el-icon-refresh" @click="generateData()">生成盘点数据</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  GenerateStockData,
  syncStocktakingData
} from '@/api/KSInventory/KSInventoryQuery';

const defaultWhere = () => ({
  GENERATE_DATE: ''
});

export default {
  components: {},
  data() {
    return {
      where: defaultWhere(),
      BZ: ''
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    /*  重置 */
    reset() {
      this.where = defaultWhere();
      this.search();
    },
    syncData() {
      syncStocktakingData()
        .then((res) => {
          if (res.code != 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          this.search();
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    //生成盘点数据
    generateData() {
      this.where.TYPE = 1;
      this.where.COUNT = 1;
      this.where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      let data = {
        where: this.where,
        limit: 999999,
        page: 1,
        order: {},
        Nickname: this.$store.state.user.info.Nickname
      };
      this.$confirm('是否生成盘点数据（默认生成当前科室）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let loading = this.$messageLoading('正在生成盘点数据...');
          GenerateStockData(data)
            .then((res) => {
              loading.close();
              this.$message.success(res.msg);
              this.reset();
            })
            .catch((err) => {
              loading.close();
              this.$message.error(err);
            });
        })
        .catch((err) => {
          this.$message.info(err);
        });
    }
  },

  created() {}
};
</script>
