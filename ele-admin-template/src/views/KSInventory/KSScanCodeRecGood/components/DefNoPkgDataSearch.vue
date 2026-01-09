<!-- 搜索表单 -->
<template>
  <div>
    <el-form class="ele-form-search">
      <el-form-item style="margin-bottom: 0;">
        <el-select size="mini" v-model="where.State" @change="search()">
          <el-option label="全部" value=""></el-option>
          <el-option label="在库" value="1"></el-option>
          <el-option label="已消耗" value="0"></el-option>
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

export default {
  props: ['ApplyTempTableDataSearch', 'selection'],
  components: {},
  data() {
    // 默认表单数据
    const defaultWhere = {
      Token: '',
      State: '1',
    };
    return {
      // 表单数据
      where: { ...defaultWhere }
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
      this.where = { ...this.defaultWhere };
      this.search();
    }
  },
  watch: {}
};
</script>
