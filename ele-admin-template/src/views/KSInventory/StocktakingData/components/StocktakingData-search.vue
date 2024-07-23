<!-- 搜索表单 -->
<template>
  <div>
    <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="10">
        <el-col style="padding-left: 0px" v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
          <div class="block">
            <el-date-picker size="small" v-model="where.GENERATE_DATE" type="date" style="width:200px"
              value-format="yyyy-MM-dd" placeholder="申领开始日期">
            </el-date-picker>
          </div>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 10, md: 4 } : { span: 4 }">
          <div class="ele-form-actions">
            <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
              查询
            </el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="reset">重置</el-button>
            <el-button size="small" type="primary" icon="el-icon-paperclip" @click="syncData()">同步PDA盘点数据</el-button>
            <!-- 生成盘点数据 -->
            <el-button size="small" type="primary" icon="el-icon-refresh" @click="generateData()">生成盘点数据</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  GenerateStockData,
  syncStocktakingData
} from '@/api/KSInventory/KSInventoryQuery';
export default {
  components: {
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      GENERATE_DATE: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      BZ: '',
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
      this.where = { ...this.defaultWhere };
      this.search();
    },
    syncData(){
      syncStocktakingData().then((res)=>{
        if (res.code != 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.search()
      }).catch(err => {
        this.$message.error(err)
      })
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
        Nickname: this.$store.state.user.info.Nickname,
      };
      this.$confirm("是否生成盘点数据（默认生成当前科室）", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loading = this.$messageLoading('正在生成盘点数据...');
        GenerateStockData(data).then(res => {
          loading.close()
          this.$message.success(res.msg)
          this.reset()
        }).catch((err) => {
          loading.close()
          this.$message.error(err)
        })
      }).catch((err) => {
        this.$message.info(err)
      })
    }
  },

  created() { }
};
</script>
