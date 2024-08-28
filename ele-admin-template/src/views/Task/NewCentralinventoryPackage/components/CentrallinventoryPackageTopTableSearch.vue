<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <!-- 输入框部分 -->
        <el-col v-bind="styleResponsive ? { lg: 8, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-input
              v-model="where.search"
              size="mini"
              placeholder="品种(材料)编码、品种全称、生产企业名称、型号/规格、供应商名称"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 2, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-input
              v-model="where.number"
              size="mini"
              placeholder="入库单号"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-select
              v-model="where.option"
              size="mini"
              @change="handleSearch"
              placeholder="请选择收货库区"
            >
              <el-option
                v-for="item in options"
                :key="item.ID"
                :label="item.NAME"
                :value="item.ID"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
              >查询</el-button
            >
            <el-button
              type="success"
              size="mini"
              :disabled="this.selection.length == 0"
              icon="el-icon-circle-plus-outline"
              @click="handleAdd"
              >添加</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  import { getSTORAGE } from '@/api/Task/NewCentralinventoryPackage/index';
  export default {
    name: 'CentralinventoryPackageTopTableSearch',
    props:['selection'],
    data() {
      const defaultWhere = {
        search: '',
        number: '',
        option: ''
      };
      return {
        where: { ...defaultWhere },
        options: []
      };
    },
    methods: {
      handleSearch() {
        this.$emit('handleSearch', this.where);
      },
      handleAdd(){
        this.$emit('handleAdd');
      },
      optionsInit(){
        getSTORAGE().then(res => {
          this.options = res.result;
        });
      },
    },
    created() {
      this.optionsInit();
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
