<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input
              size="mini"
              v-model="where.registrationNo"
              placeholder="请输入注册证"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-input
              size="mini"
              v-model="where.manufacture"
              placeholder="请输入生产企业"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 2, md: 12 } : { span: 6 }">
          <el-form-item>
            <el-select
              size="mini"
              v-model="where.isEnable"
              placeholder="请选择"
            >
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
        <el-col :lg="14" :md="12">
          <el-form-item>
            <el-button
              size="mini"
              icon="el-icon-search"
              type="primary"
              @click='handleSearch'
              >查询</el-button
            >
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              >添加注册证</el-button
            >
            <el-button
              type="success"
              icon="el-icon-download"
              size="mini"
              @click='handleRegistrationExport'
              >导出产品注册证</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-upload"
              size="mini"
              >导入注册证</el-button
            >

            <el-button
              type="primary"
              icon="el-icon-camera"
              size="mini"
              >查看即将过期和已过期注册证</el-button
            >

            <el-button
              type="info"
              icon="el-icon-s-grid"
              size="mini"
              >修改日志</el-button
            >

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click='handleItemDelete'
              >删除</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'RegistrationTableSearch',
    data() {
      const defaultWhere = {
        registrationNo: '',
        manufacture: '',
        isEnable: '1'
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
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '停用'
          }
        ]
      };
    },
    methods: {
      handleSearch() {
        this.$emit('search', this.where);
      },
      handleRegistrationExport(){
        this.$emit('registrationExport', this.where);
      },
      handleItemDelete(){
        this.$emit('itemDelete', this.where);
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
