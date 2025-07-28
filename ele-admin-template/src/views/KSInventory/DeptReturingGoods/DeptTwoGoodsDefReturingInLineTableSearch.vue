<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="品种编码：" label-width="90px">
            <el-input
              size="mini"
              clearable
              v-model="where.varCode"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 6 }">
          <el-form-item label="品种名称：" label-width="90px">
            <el-input
              size="mini"
              clearable
              v-model="where.varName"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
          <el-form-item label="规格型号：" label-width="90px">
            <el-input
              size="mini"
              clearable
              v-model="where.varSpec"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 3 } : { span: 4 }">
          <el-form-item label="定数码：" label-width="90px">
            <el-input
              size="mini"
              clearable
              v-model="where.defNoPkgCode"
              placeholder=""
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 4 }">
          <el-form-item label="批号：" label-width="90px">
            <el-input
              size="mini"
              clearable
              v-model="where.batch"
              placeholder=""
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 4 }">
          <el-form-item label="医保编码：" label-width="100px">
            <el-input
              size="mini"
              clearable
              v-model="where.medicalCode"
              placeholder=""
            />
          </el-form-item>
        </el-col>

        <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 4 }">
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              class="ele-btn-icon"
              @click="search"
              >查询</el-button
            >

            <el-button type="primary" size="mini" @click="handleInLineAdd()"
              >添加到退货单</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'DeptTwoGoodsDefReturingInLineTableSearch',
    props: [],
    data() {
      return {
        where: {
          varCode: '',
          varName: '',
          varSpec: '',
          defNoPkgCode: '',
          batch: '',
          medicalCode: ''
        }
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      },
      handleInLineAdd() {
        this.$emit('handleInLineAdd');
      }
    }
  };
</script>
<style lang=""></style>
