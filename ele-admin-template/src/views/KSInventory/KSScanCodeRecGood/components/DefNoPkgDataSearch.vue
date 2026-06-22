<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form size="mini" :inline="true" class="ele-form-search">
      <el-form-item label="库存状态">
        <el-select style="width: 100px" v-model="where.State" @change="search()">
          <el-option label="全部" value="" />
          <el-option label="在库" value="1" />
          <el-option label="已消耗" value="0" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  DeletePlanDeta
  // KeeptListDeta,
} from '@/api/KSInventory/KSDepartmentalPlan';
import { GetDistributeDefDetailNum } from '@/api/KSInventory/KSScanCodeRecGood';

const defaultWhere = () => ({
  Token: '',
  State: '1'
});

export default {
  props: ['ApplyTempTableDataSearch', 'selection'],
  components: {},
  data() {
    return {
      // 表单数据
      where: defaultWhere()
    };
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    },
    ApplyTempTableDataID() {
      return this.ApplyTempTableDataSearch;
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
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
