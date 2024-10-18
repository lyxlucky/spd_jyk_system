<template lang="">
  <div>
    <ele-modal
      width="70%"
      title="日志记录"
      :visible="visible"
      @update:visible="updateVisible"
      top="5vh"
      :resizable="true"
      :maxable="true"
      :destroy-on-close="true"
    >
      <ele-pro-table
        highlight-current-row
        ref="table"
        @current-change="onCurrentChange"
        height="40vh"
        :rowClickChecked="true"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="LogInfoTableCacheKey"
      >
        <template v-slot:toolbar>
          <div>
            <el-form class="ele-form-search">
              <el-row :gutter="10">
                <!-- 查询按钮 -->
                <el-col
                  v-bind="styleResponsive ? { lg: 4, md: 6 } : { span: 6 }"
                >
                  <el-form-item label-width="0px">
                    <el-input
                      v-model="where.value"
                      placeholder="请输入值"
                      clearable
                      size="mini"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>

                <el-col
                  v-bind="styleResponsive ? { lg: 4, md: 6 } : { span: 6 }"
                >
                  <el-form-item label-width="0px">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-search"
                      @click="reload"
                      >查询</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>

        <template v-slot:TYPE="{ row }">
          <div>
            <span v-if="row.TYPE == 'COMPANY'">企业名称</span>
            <span v-if="row.TYPE == 'PEOPLE_ID'">社会统一信用代码</span>
            <span v-if="row.TYPE == 'ADDRESS'">企业地址</span>
            <span v-if="row.TYPE == 'PHONE'">企业电话</span>
            <span v-if="row.TYPE == 'BUSINESS_LICENSE_DATE'">营业执照效期</span>
            <span v-if="row.TYPE == 'RODUCTION_CLASS_1_VALID_DATE'"
              >一类的许可证经营有效期</span
            >
            <span v-if="row.TYPE == 'RODUCTION_CLASS_2_VALID_DATE'"
              >二类的许可证经营有效期</span
            >
            <span v-if="row.TYPE == 'RODUCTION_CLASS_3_VALID_DATE'"
              >三类的许可证经营有效期</span
            >
            <span v-if="row.TYPE == 'DR_VALID_DATE'"
              >体外诊断试剂经营许可证有效期</span
            >
            <span v-if="row.TYPE == 'WTS_VALID_DATE'">业务员委托书有效期</span>
            <span v-if="row.TYPE == 'YWY_NAME'">业务员姓名</span>
            <span v-if="row.TYPE == 'YWY_PEO_ID'">业务员身份证号</span>
            <span v-if="row.TYPE == 'YWY_PHONE'">业务员联系电话</span>
          </div>
        </template>

        <template v-slot:STATU="{ row }">
          <div>
            <el-tag v-if="row.STATU == 0" type="primary" size="mini"
              >新增</el-tag
            >
            <el-tag v-if="row.STATU == 1" type="success" size="mini"
              >已审核</el-tag
            >
            <el-tag v-if="row.STATU == 2" type="danger" size="mini"
              >审核不通过</el-tag
            >
            <el-tag v-if="row.STATU == 3" type="warning" size="mini"
              >资料缺失</el-tag
            >
            <el-tag v-if="row.STATU == 4" type="success" size="mini"
              >不需要提供</el-tag
            >
            <el-tag v-if="row.STATU == 5" type="danger" size="mini"
              >重新提供</el-tag
            >
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import { GetLogInfoList } from '@/api/Home/Qualificationcheck/index';
  export default {
    name: 'LogInfoTable',
    props: ['visible'],
    data() {
      const defaultWhere = {
        value: ''
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center'
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '供应商',
            minWidth: 130,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'TYPE',
            label: '类型',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'VALUE',
            label: '值',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'STATU',
            label: '状态',
            minWidth: 60,
            align: 'center'
          },
          {
            prop: 'AUDITOR',
            label: '最后审核人',
            minWidth: 100,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'TIME',
            label: '审核时间',
            minWidth: 100,
            align: 'center',
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                : '';
            }
          }
        ],
        toolbar: false,
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = GetLogInfoList({
          page,
          limit,
          where: this.where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      onCurrentChange(row) {
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
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
