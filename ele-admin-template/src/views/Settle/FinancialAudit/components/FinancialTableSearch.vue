<template lang="">
  <div>
    <el-form
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-row type="flex" :gutter="10">
        <el-col>
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.code"
              placeholder="编码/名称"
            />
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.supplier"
              placeholder="请输入供应商"
            />
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.PlanNum"
              placeholder="请输入发票"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.yjStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="月结开始"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.yjEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="月结结束"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-select size="mini" v-model="where.State" @change="search()">
              <el-option label="全部" value="-1"></el-option>
              <el-option label="已审批" value="1"></el-option>
              <el-option label="未审批" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-input
              size="mini"
              clearable
              v-model="where.wxtMonth"
              placeholder="微讯通月份"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item>
            <el-select size="mini" v-model="where.wxtState" @change="search()">
              <el-option label="微讯通-全部" value="-1"></el-option>
              <el-option label="微讯通-已发送" value="1"></el-option>
              <el-option label="微讯通-未发送" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" :gutter="10">
        <el-col>
          <el-form-item label="是否阳光订单">
            <el-select size="mini" v-model="where.isYgOrder" @change="search()">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="带量采购">
            <el-select size="mini" v-model="where.purchase" @change="search()">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.approvalStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="审批开始"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-date-picker
              size="mini"
              v-model="where.approvalEnd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="审批结束"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="search"
              >搜索</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col>
          <el-form-item>
            <el-button size="mini" type="primary" icon="el-icon-download"
              >打印报表</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >打印月报表</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-download"
              >取消审批</el-button
            >
            <el-button size="mini" type="success" icon="el-icon-download"
              >确认审批</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >取消发票</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >导出</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >月结汇总导出</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >签收导出</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >发票签收</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >取消签收</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >打印报表</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >发送微讯通</el-button
            >
            <el-button size="mini" type="primary" icon="el-icon-download"
              >一键打印</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'FinancialTableSearch',
    data() {
      return {
        where: {}
      };
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      }
    }
  };
</script>
<style lang=""></style>
