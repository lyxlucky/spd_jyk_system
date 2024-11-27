<template lang="">
  <div>
    <el-form :inline="true" class="ele-form-search">
      <!-- <el-row :gutter="10"> -->
      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }"> -->
      <el-form-item>
        <el-select
          v-model="where.pictureState"
          size="mini"
          clearable
          placeholder="请选择图片状态"
        >
          <el-option
            v-for="item in pictureOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- </el-col> -->

      <!-- <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }"> -->
      <el-form-item>
        <el-select
          v-model="where.pictureType"
          size="mini"
          clearable
          placeholder="请选择图片类型"
        >
          <el-option
            v-for="item in pictureTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="search"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          size="mini"
          icon="el-icon-check"
          @click="approveItem"
          >审批通过</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-close"
          @click="denyItem"
          >审批不通过</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="warning"
          size="mini"
          icon="el-icon-toilet-paper"
          @click="dropItem"
          >弃用</el-button
        >
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="deleteItem"
          >删除</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'pictureListTableSearch',
    components: {},
    props: [],
    data() {
      const defaultWhere = {
        pictureState: '',
        pictureType: ''
      };
      return {
        where: { ...defaultWhere },
        pictureOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '0',
            label: '新增'
          },
          {
            value: '1',
            label: '已审批'
          },
          {
            value: '2',
            label: '审批未通过'
          }
        ],
        pictureTypeOptions: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '品种注册证'
          },
          {
            value: '2',
            label: '品种说明书'
          },
          {
            value: '3',
            label: '品种包装'
          },
          {
            value: '4',
            label: '品种授权书'
          },
          {
            value: '5',
            label: '厂家营业执照'
          },
          {
            value: '6',
            label: '厂家生产许可证'
          }
        ]
      };
    },
    methods: {
      dropItem() {
        this.$emit('dropItem', this.where);
      },
      denyItem() {
        this.$emit('denyItem', this.where);
      },
      approveItem() {
        this.$emit('approveItem', this.where);
      },
      search() {
        this.$emit('search', this.where);
      },
      deleteItem() {
        this.$emit('deleteItem', this.where);
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
<style scoped></style>
