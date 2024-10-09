<template lang="">
  <div>
  <el-form class="ele-form-search">
    <el-row :gutter="10">
      <!-- 输入框部分 -->
      <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <el-form-item label-width="0px">
          <el-input
            v-model="where.registrationNumber"
            size="mini"
            placeholder="请输入注册证号"
            clearable
          />
        </el-form-item>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }">
        <el-form-item label-width="0px">
          <el-input
            v-model="where.registrationName"
            size="mini"
            placeholder="请输入注册证名称"
            clearable
          />
        </el-form-item>
      </el-col>

      <!-- 选择器部分 -->
      <el-col v-bind="styleResponsive ? { lg: 3, md: 3 } : { span: 3 }">
        <el-form-item label-width="0px">
          <el-select
            v-model="where.isIncludeNewParticulars"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in isIncludeNewParticularsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- <el-col v-bind="styleResponsive ? { lg: 3, md: 3 } : { span: 3 }">
        <el-form-item label-width="0px">
          <el-select
            v-model="where.isEquipmentCheck"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in isEquipmentCheckOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col v-bind="styleResponsive ? { lg: 3, md: 3 } : { span: 3 }">
        <el-form-item label-width="0px">
          <el-select
            v-model="where.isHospitalAudioCheck"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in isHospitalAudioCheckOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col> -->

      <!-- 查询按钮 -->
      <el-col v-bind="styleResponsive ? { lg: 6, md: 6 } : { span: 6 }">
        <el-form-item label-width="0px">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="search"
            >查询</el-button
          >
          <!-- <el-button
            type="primary"
            size="mini"
            @click="searchAll"
            icon="el-icon-search"
            >查询全部</el-button
          > -->
        </el-form-item>
      </el-col>

      <!-- 设备审核按钮 -->
      <!-- <el-col v-bind="styleResponsive ? { lg: 10, md: 2 } : { span: 4 }">
        <el-form-item label-width="0px">
          <el-button
            type="primary"
            @click="equipmentApprove"
            size="mini"
            icon="el-icon-circle-check"
            >（设备）审核通过</el-button
          >
          <el-button
            type="danger"
            @click="equipmentDeny"
            size="mini"
            icon="el-icon-circle-close"
            >（设备）不通过</el-button
          >
          <el-button
            type="primary"
            @click="feverApprove"
            size="mini"
            icon="el-icon-circle-check"
            >（院感）审核通过</el-button
          >
          <el-button
            type="danger"
            @click="feverDeny"
            size="mini"
            icon="el-icon-circle-close"
            >（院感）不通过</el-button
          >
        </el-form-item>
      </el-col> -->
    </el-row>
  </el-form>
</div>
</template>
<script>
  export default {
    name: 'QualificationBottomTableSearch',
    data() {
      const defaultWhere = {
        registrationNumber: '',
        registrationName: '',
        isIncludeNewParticulars: '1',
        isEquipmentCheck: '',
        isHospitalAudioCheck: '',
        Supplier_Code: '',
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        isIncludeNewParticularsOptions: [
          {
            value: '1',
            label: '含新资料-是'
          },
          {
            value: '0',
            label: '含新资料-全部'
          },
          {
            value: '-1',
            label: '含新资料-否'
          }
        ],
        isEquipmentCheckOptions: [
          {
            value: '',
            label: '设备审核-全部'
          },
          {
            value: '0',
            label: '设备审核-未审核'
          },
          {
            value: '1',
            label: '设备审核-已审核'
          },
          {
            value: '2',
            label: '设备审核-未通过'
          }
        ],
        isHospitalAudioCheckOptions: [
          {
            value: '',
            label: '院感审核-全部'
          },
          {
            value: '0',
            label: '院感审核-未审核'
          },
          {
            value: '1',
            label: '院感审核-已审核'
          },
          {
            value: '2',
            label: '院感审核-未通过'
          }
        ]
      };
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      searchAll() {
        this.$emit('searchAll', this.where);
      },
      feverApprove(){
        this.$emit('feverApprove', this.where);
      },
      feverDeny(){
        this.$emit('feverDeny', this.where);
      },
      equipmentApprove(){
        this.$emit('equipmentApprove', this.where);
      },
      equipmentDeny(){
        this.$emit('feverApprove', this.where);
      },
    },
    mounted() {
      this.$bus.$on(`${this.$route.path}/QualificationTopTable/Current`, (data) => {
        this.where.Supplier_Code = data.Supplier_Code;
        this.search()
      });
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
