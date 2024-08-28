<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 6, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              v-model="where.search"
              size="mini"
              placeholder="制包人/品种编码/名称"
              clearable
            >
              <el-button slot="append" icon="el-icon-search" @click='handleSearch'></el-button>
            </el-input>
            
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="handleAdd"
              >本账号制包</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-remove-outline"
              :disabled="this.selection.length == 0"
              @click="handleDelete"
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
    name: 'CentralinventoryPackageBottomLeftTableSearch',
    props: ['selection'],
    comments: {
      // 下方表格查询
    },
    data() {
      const defaultWhere = {
        search: ''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      handleAdd() {
        this.where.search = this.$store.state.user.info.Nickname;
        this.$emit('handleAdd', this.where);
      },
      handleSearch(){
        this.$emit('handleAdd', this.where);
      },
      handleDelete() {
        this.$emit('handleDelete', this.where);
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
