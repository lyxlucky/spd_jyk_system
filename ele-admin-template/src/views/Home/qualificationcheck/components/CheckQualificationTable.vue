<!-- 暂时未使用组件 -->
<template lang="">
  <div class="container">
    <ele-modal
      width="70%"
      title="审核列表"
      :visible="visible"
      @update:visible="updateVisible"
      top="5vh"
      :resizable="true"
      @close="closeModal"
      :maxable="true"
      :destroy-on-close="true"
    >
      <ele-pro-table
        highlight-current-row
        highlight-selection-row
        ref="table"
        @current-change="onCurrentChange"
        height="60vh"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="checkQualificationTable"
      >
        <!-- 表格工具栏 -->
        <template v-slot:toolbar>
          <CheckQualificationTableSearch
            @approval="approval"
            @deny="deny"
            @search="reload"
          />
        </template>
        <!-- 营业执照效期 -->
        <template v-slot:BUSINESS_LICENSE_DATE="{ row }">
          <el-link
            v-if="row.BUSINESS_LICENSE_DATE == '0001-01-01T00:00:00'"
          ></el-link>
          <el-link
            v-else-if="
              row.BUSINESS_LICENSE_PIC != '' &&
              row.BUSINESS_LICENSE_PIC != null &&
              row.BUSINESS_LICENSE_DATE != '0001-01-01T00:00:00'
            "
            type="primary"
            @click="showImage(row.BUSINESS_LICENSE_PIC)"
            >{{ row.BUSINESS_LICENSE_DATE.substring(0, 10) }}</el-link
          >
          <el-link v-else>{{
            row.BUSINESS_LICENSE_DATE.substring(0, 10)
          }}</el-link>
        </template>

        <!-- 一类的许可证经营有效期 -->
        <template v-slot:RODUCTION_CLASS_1_VALID_DATE="{ row }">
          <el-link
            v-if="row.RODUCTION_CLASS_1_VALID_DATE == '0001-01-01T00:00:00'"
          ></el-link>
          <el-link
            v-else-if="
              row.RODUCTION_CLASS_1_PIC != '' &&
              row.RODUCTION_CLASS_1_PIC != null &&
              row.RODUCTION_CLASS_1_VALID_DATE != '0001-01-01T00:00:00'
            "
            type="primary"
            @click="showImage(row.RODUCTION_CLASS_1_PIC)"
            >{{ row.RODUCTION_CLASS_1_VALID_DATE.substring(0, 10) }}</el-link
          >
          <el-link v-else>{{
            row.RODUCTION_CLASS_1_VALID_DATE.substring(0, 10)
          }}</el-link>
        </template>

        <!-- 二类的许可证经营有效期 -->
        <template v-slot:RODUCTION_CLASS_2_VALID_DATE="{ row }">
          <el-link
            v-if="row.RODUCTION_CLASS_2_VALID_DATE == '0001-01-01T00:00:00'"
          ></el-link>
          <el-link
            v-else-if="
              row.RODUCTION_CLASS_2_PIC != '' &&
              row.RODUCTION_CLASS_2_PIC != null &&
              row.RODUCTION_CLASS_2_VALID_DATE != '0001-01-01T00:00:00'
            "
            type="primary"
            @click="showImage(row.RODUCTION_CLASS_2_PIC)"
            >{{ row.RODUCTION_CLASS_2_VALID_DATE.substring(0, 10) }}</el-link
          >
          <el-link v-else>{{
            row.RODUCTION_CLASS_2_VALID_DATE.substring(0, 10)
          }}</el-link>
        </template>

        <!-- 三类的许可证经营有效期 -->
        <template v-slot:RODUCTION_CLASS_3_VALID_DATE="{ row }">
          <el-link
            v-if="row.RODUCTION_CLASS_3_VALID_DATE == '0001-01-01T00:00:00'"
          ></el-link>
          <el-link
            v-else-if="
              row.RODUCTION_CLASS_3_PIC != '' &&
              row.RODUCTION_CLASS_3_PIC != null &&
              row.RODUCTION_CLASS_3_VALID_DATE != '0001-01-01T00:00:00'
            "
            type="primary"
            @click="showImage(row.RODUCTION_CLASS_3_PIC)"
            >{{ row.RODUCTION_CLASS_3_VALID_DATE.substring(0, 10) }}</el-link
          >
          <el-link v-else>{{
            row.RODUCTION_CLASS_3_VALID_DATE.substring(0, 10)
          }}</el-link>
        </template>

        <!-- 体外诊断试剂经营许可证有效期 -->
        <template v-slot:DR_VALID_DATE="{ row }">
          <el-link v-if="row.DR_VALID_DATE == '0001-01-01T00:00:00'"></el-link>
          <el-link
            v-else-if="
              row.DR_PIC != '' &&
              row.DR_PIC != null &&
              row.DR_VALID_DATE != '0001-01-01T00:00:00'
            "
            type="primary"
            @click="showImage(row.DR_PIC)"
            >{{ row.DR_VALID_DATE.substring(0, 10) }}</el-link
          >
          <el-link v-else>{{ row.DR_VALID_DATE.substring(0, 10) }}</el-link>
        </template>

        <!-- 业务员委托书有效期 -->
        <template v-slot:WTS_VALID_DATE="{ row }">
          <el-link v-if="row.WTS_VALID_DATE == '0001-01-01T00:00:00'"></el-link>
          <el-link
            v-else-if="
              row.WTS_PIC != '' &&
              row.WTS_PIC != null &&
              row.WTS_VALID_DATE != '0001-01-01T00:00:00'
            "
            type="primary"
            @click="showImage(row.WTS_PIC)"
            >{{ row.WTS_VALID_DATE.substring(0, 10) }}</el-link
          >
          <el-link v-else>{{ row.WTS_VALID_DATE.substring(0, 10) }}</el-link>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import {
    spdGetSupplierInfoForZong,
    DownZmlSup,
    appZongSupInfo
  } from '@/api/Home/Qualificationcheck/index';
  import CheckQualificationTableSearch from './CheckQualificationTableSearch';
  import { B2B_BASE_CODE, B2B_BASE_URL } from '@/config/setting';
  export default {
    name: 'ChekcQualificationTable',
    components: {
      CheckQualificationTableSearch
    },
    props: ['visible'],
    data() {
      const defaultWhere = {};
      return {
        where: { ...defaultWhere },
        columns: [
          {
            prop: 'SUPPLIER_CODE_SPD',
            label: '院内编码',
            width: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'COMPANY',
            label: '供应商名称',
            width: 200,
            showOverflowTooltip: true
          },
          {
            prop: 'PEOPLE_ID',
            label: '社会统一信用代码',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'ADDRESS',
            label: '企业地址',
            width: 100,
            showOverflowTooltip: true
          },
          {
            prop: 'PHONE',
            label: '企业电话',
            width: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'BUSINESS_LICENSE_DATE',
            slot: 'BUSINESS_LICENSE_DATE',
            label: '营业执照效期',
            minWidth: 130,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'RODUCTION_CLASS_1_VALID_DATE',
            slot: 'RODUCTION_CLASS_1_VALID_DATE',
            label: '一类的许可证经营有效期',
            minWidth: 110,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'RODUCTION_CLASS_2_VALID_DATE',
            slot: 'RODUCTION_CLASS_2_VALID_DATE',
            label: '二类的许可证经营有效期',
            minWidth: 110,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'RODUCTION_CLASS_3_VALID_DATE',
            slot: 'RODUCTION_CLASS_3_VALID_DATE',
            label: '三类的许可证经营有效期',
            minWidth: 110,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'DR_VALID_DATE',
            slot: 'DR_VALID_DATE',
            label: '体外诊断试剂经营许可证有效期',
            minWidth: 110,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'WTS_VALID_DATE',
            slot: 'WTS_VALID_DATE',
            label: '业务员委托书有效期',
            minWidth: 110,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'YWY_NAME',
            label: '业务员姓名',
            width: 100,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'YWY_PEO_ID',
            label: '业务员身份证号',
            minWidth: 170,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            fiepropld: 'YWY_PHONE',
            label: '业务员联系电话',
            minWidth: 150,
            align: 'left',
            showOverflowTooltip: true
          }
        ],
        pageSize: 20,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        imageSrcPre: '/Upload/ProPic/'
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = spdGetSupplierInfoForZong({
          page,
          limit,
          where,
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
      /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      // 表格行点击事件
      onCurrentChange(row) {
        this.current = row;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      showImage(src) {
        let imageSrc = B2B_BASE_URL + this.imageSrcPre + src;
        this.$viewerApi({
          images: [imageSrc]
        });
      },
      closeModal() {
        this.$emit('closeModal');
      },
      approval() {
        if (!this.current) return this.$message.warning('请选择一条数据');
        const json = JSON.stringify([this.current]);
        DownZmlSup({ json: json })
          .then((res) => {
            if (res.code != 200) return this.$message.error(res.msg);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            this.updateVisible(false);
            this.reload(this.where);
          });
      },
      deny() {
        if (!this.current) return this.$message.warning('请选择一条数据');
        this.$prompt('审核不通过备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(({ value }) => {
            appZongSupInfo({
              state: 2,
              mark: value,
              code: this.current.SUPPLIER_CODE_SPD
            })
              .then((res) => {
                if (res.code != 200) return this.$message.error(res.msg);
                this.$message.success(res.msg);
              })
              .catch((err) => {
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
      }
    },
    computed: {},
    created() {}
  };
</script>
<style lang=""></style>
