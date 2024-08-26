<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-input
              v-model="where.search"
              size="mini"
              placeholder="搜索"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 2, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-select v-model="where.value" size="mini" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 2, md: 2 } : { span: 2 }">
          <el-form-item label-width="0px">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="search"
              >查询</el-button
            >
          </el-form-item>
          
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 2, md: 2 } : { span: 0 }">
          <el-form-item label-width="0px">
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-check"
              @click="CheckQualificationTableVisible = true"
              >审核</el-button
            >
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <!-- 资质审核列表 -->
    <CheckQualificationTable :visible.sync="CheckQualificationTableVisible" />

  </div>
</template>
<script>
import CheckQualificationTable from './CheckQualificationTable.vue';
export default {
  name: 'QualificationTopTableSearch',
  components: {
    CheckQualificationTable
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      search: '',
      value: '1'
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      options: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '停用'
        },
        {
          value: '',
          label: '全部'
        }
      ],
      CheckQualificationTableVisible : false,
    };
  },
  methods: {
    /* 搜索 */
    search() {
      this.$emit('search', this.where);
    },
    check(){
      console.log(123)
    }
  },
  computed: {
    // 是否开启响应式布局
    styleResponsive() {
      return this.$store.state.theme.styleResponsive;
    }
  }
};
</script>
<style lang=""></style>
