<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="5">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 2 }">
          <el-form-item label-width="0px">
            <el-input
              v-model="where.search"
              size="mini"
              placeholder="搜索供应商"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 2 }">
          <el-form-item label-width="0px">
            <el-select v-model="where.supplierValue" size="mini" placeholder="供应商资料筛选">
              <el-option
                v-for="item in supplierOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 2 }">
          <el-form-item label-width="0px">
            <el-select v-model="where.varietieValue" size="mini" placeholder="品种资料审核筛选">
              <el-option
                v-for="item in varietieOptions"
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

        <el-col v-bind="styleResponsive ? { lg: 5, md: 2 } : { span: 2 }">
          <el-form-item label-width="0px">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="search"
              >查询</el-button
            >
            <!-- <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-check"
              @click="CheckQualificationTableVisible = true"
              >审核</el-button
            > -->
            <el-button
              type="info"
              size="mini"
              icon="el-icon-s-check"
              @click="LogInfoTableVisible = true"
              >日志</el-button
            >
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <!-- 资质审核列表 -->
    <CheckQualificationTable @closeModal="search" :visible.sync="CheckQualificationTableVisible" />
    <LogInfoTable :visible.sync="LogInfoTableVisible"/>
  </div>
</template>
<script>
  import CheckQualificationTable from './CheckQualificationTable';
  import LogInfoTable from './LogInfoTable';
  export default {
    name: 'QualificationTopTableSearch',
    components: {
      CheckQualificationTable,
      LogInfoTable
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        search: '',
        value: '1',
        supplierValue: '0',
        varietieValue:''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        varietieOptions:[
          {
            value:'1',
            label:'品种资料-含待审核',
          },
          {
            value:'',
            label:'品种资料-全部',
          },
          {
            value:'2',
            label:'品种资料-已全部审核',
          },
        ],
        supplierOptions:[
          {
            value: '-1',
            label:'供应商资料-全部'
          },
          {
            value: '0',
            label:'供应商资料-含待审核'
          },
          {
            value: '3',
            label:'供应商资料-含缺失资料'
          },
          {
            value: '4',
            label:'供应商资料-已完全审核'
          },
          {
            value: '5',
            label:'供应商资料-重新提供'
          },
          {
            value: '2',
            label:'供应商资料-审核不通过'
          },
        ],
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
        CheckQualificationTableVisible: false,
        LogInfoTableVisible: false
      };
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
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
