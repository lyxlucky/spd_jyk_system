<template lang="">
  <div>
    <el-form class="ele-form-search">
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-input
              v-model="where.code"
              size="mini"
              placeholder="请输入品种编码"
              clearable
            />
          </el-form-item>
        </el-col>

      <el-col style="" v-bind="styleResponsive ? { lg: 7, md: 4 } : { span: 4 }">
        <el-form-item label="是否定标">
          <el-select size="mini" v-model="where.status" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
          <el-form-item label-width="0px">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="search"
              >查询</el-button
            >

            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              @click="sure"
              >定标</el-button
            >

            <!-- <el-button
              type="success"
              size="mini"
              icon="el-icon-upload"
              >上传图片</el-button
            > -->

          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'KsNewBatchReminderTableSearch',
    data() {
      const defaultWhere = {
        code: '',
        status: ''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods:{
        search() {
            this.$emit('search', this.where);
        },
        sure(){
          this.$emit('sure', this.where);
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
