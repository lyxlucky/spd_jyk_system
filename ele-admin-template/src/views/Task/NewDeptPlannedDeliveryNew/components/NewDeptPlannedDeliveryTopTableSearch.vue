<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      style="padding-bottom: 10px"
      @submit.native.prevent
    >
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.deptPlanCode"
              placeholder="请输入科室计划单号"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.varCode"
              placeholder="品种编码/名称"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.supplierName"
              placeholder="供应商名称"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.spec"
              placeholder="请输入规格/型号"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.manufacturerName"
              placeholder="请输入生产企业名称"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.applyMan"
              placeholder="请输入申领人"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.applyMan"
              placeholder="请输入SPD二级科室名称"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.yjEnd"
              type="date"
              style="width: 280px"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.yjEnd"
              type="date"
              style="width: 280px"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 10, md: 2 } : { span: 4 }">
          <el-form-item label="剩余申请数量为0：">
            <div style="display: flex; gap: 10px">
              <el-select
                size="mini"
                v-model="where.purchase"
                @change="search()"
              >
                <el-option label="不包含" value="1"></el-option>
                <el-option label="包含" value="0"></el-option>
              </el-select>
              <el-select
                size="mini"
                style="width: 80px"
                v-model="where.purchase"
                @change="search()"
              >
                <el-option label="未剔除" value="1"></el-option>
                <el-option label="全部" value="1"></el-option>
                <el-option label="已剔除" value="0"></el-option>
              </el-select>
              <el-select
                size="mini"
                style="width: 80px"
                v-model="where.purchase"
                @change="search()"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="中标" value="1"></el-option>
                <el-option label="未中标" value="0"></el-option>
              </el-select>

              <el-select
                size="mini"
                style="width: 80px"
                v-model="where.purchase"
                @change="search()"
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="暂挂" value="1"></el-option>
                <el-option label="未暂挂" value="0"></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="10">
        <el-col v-bind="styleResponsive ? { lg: 4, md: 2 } : { span: 4 }">
          <el-form-item label="选择库区：">
            <el-select size="mini" v-model="where.purchase" @change="search()">
              <el-option label="不包含" value="1"></el-option>
              <el-option label="包含" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 24, md: 2 } : { span: 4 }">
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch()"
              >查询</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >生成散货申领单</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >生成拣配单</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >生成定数包</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >生成备货</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >变更剩余申请</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >临采详情</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >替换品种</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >导出</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >暂挂</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >取消暂挂</el-button
            >
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
              @click="handleSearch()"
              >批量备注</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleSearch()"
              >强制结束计划单</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleSearch()"
              >删除计划单明细</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'NewDeptPlannedDeliveryTopTableSearch',
    data() {
      const defaultWhere = {
        deptPlanCode: '',
        varCode: '',
        supplierName: '',
        spec: '',
        manufacturerName: '',
        applyMan: ''
      };
      return {
        where: { ...defaultWhere }
      };
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
