<template lang="">
  <div class="ele-body">
    <ele-pro-table
      highlight-current-row
      ref="table"
      :toolkit="[]"
      @current-change="onCurrentChange"
      height="30vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :show-overflow-tooltip="true"
      cache-key="QualificationBottomTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <QualificationBottomTableSearch
          @search="reload"
          @searchAll="reload"
          @equipmentDeny="equipmentDeny"
          @feverDeny="feverDeny"
          @equipmentApprove="equipmentApprove"
          @feverApprove="feverApprove"
          ref="bottomTableSearch"
        />
      </template>

      <template v-slot:TYPE="{ row }">
        <el-tag v-if="row.TYPE == 1" type="info">国产医疗器械、器具</el-tag>
        <el-tag v-else-if="row.TYPE == 2" type="info">进口消毒类</el-tag>
        <el-tag v-else-if="row.TYPE == 3" type="info">国产消毒类</el-tag>
        <el-tag v-else-if="row.TYPE == 4" type="info"
          >进口医疗器械、器具</el-tag
        >
        <el-tag v-else type="info">{{ '暂无' }}</el-tag>
      </template>

      <!-- TODO -->
      <!-- <template v-slot:CHECKTABLE="{row}">
        <el-link type='primary'>{{'详情'}}</el-link>
      </template> -->

      <template v-slot:operation="{ row }">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-setting"
          @click="viewBottomTableDetail(row)"
          >详情</el-button
        >
      </template>

      <template v-slot:SB_SH_STATE="{ row }">
        <el-tag v-if="row.SB_SH_STATE == 1" type="success">通过</el-tag>
        <el-tag v-else-if="row.SB_SH_STATE == 2" type="danger">未通过</el-tag>
        <el-tag v-else type="warning">待审核</el-tag>
      </template>

      <template v-slot:YG_SH_STATE="{ row }">
        <el-tag v-if="row.YG_SH_STATE == 1" type="success">通过</el-tag>
        <el-tag v-else-if="row.YG_SH_STATE == 2" type="danger">未通过</el-tag>
        <el-tag v-else type="warning">待审核</el-tag>
      </template>

      <RegistrationDetail :visible.sync='registrationUpdatevisible' :tableCurrent="current" />
    </ele-pro-table>
  </div>
</template>
<script>
  import QualificationBottomTableSearch from './QualificationBottomTableSearch';
  import RegistrationDetail from './RegistrationDetail';
  import { getRegistrationList,upPROD_REGISTRATION_BA_INFO } from '@/api/Home/Qualificationcheck';
  export default {
    name: 'QualificationBottomTable',
    components: {
      QualificationBottomTableSearch,
      RegistrationDetail
    },
    data() {
      const defaultWhere = {
        registrationNumber: '',
        registrationName: '',
        isIncludeNewParticulars: '',
        isEquipmentCheck: '',
        isHospitalAudioCheck: ''
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
            slot: 'operation',
            label: '操作',
            minWidth: 100,
            align: 'left'
          },
          {
            prop: 'XZ_COUNT',
            label: '待审核资料',
            minWidth: 100,
            align: 'center'
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'PROD_REGISTRATION_NAME',
            label: '注册证名称',
            minWidth: 160,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            minWidth: 160,
            showOverflowTooltip: true
          },
          {
            prop: 'REGISTRATION_ISSUING_DATE',
            label: '注册证效期',
            minWidth: 170,
            formatter: (row, column, cellValue) => {
              let strNow =
                row.REGISTRATION_ISSUING_DATE.substring(0, 10) +
                '至' +
                row.REGISTRATION_VALID_DATE.substring(0, 10);
              if (strNow == '0001-01-01至0001-01-01') {
                return '';
              }
              return strNow;
            },
            showOverflowTooltip: true
          },
          {
            prop: 'MAN_YY_START',
            label: '厂家营业执照效期',
            minWidth: 170,
            formatter: (row, column, cellValue) => {
              let strNow =
                row.MAN_YY_START.substring(0, 10) +
                '至' +
                row.MAN_YY_END.substring(0, 10);
              if (strNow == '0001-01-01至0001-01-01') {
                return '';
              }
              return strNow;
            },
            showOverflowTooltip: true
          },
          {
            prop: 'MAN_XKZ_START',
            label: '厂家许可证效期',
            minWidth: 170,
            formatter: (row, column, cellValue) => {
              let strNow =
                row.MAN_XKZ_START.substring(0, 10) +
                '至' +
                row.MAN_XKZ_END.substring(0, 10);
              if (strNow == '0001-01-01至0001-01-01') {
                return '';
              }
              return strNow;
            },
            showOverflowTooltip: true
          },
          {
            prop: 'VAR_SQS_START',
            label: '品种授权效期',
            minWidth: 170,
            formatter: (row, column, cellValue) => {
              let strNow =
                row.VAR_SQS_START.substring(0, 10) +
                '至' +
                row.VAR_SQS_END.substring(0, 10);
              if (strNow == '0001-01-01至0001-01-01') {
                return '';
              }
              return strNow;
            },
            showOverflowTooltip: true
          },
          {
            slot: 'TYPE',
            label: '审核登记表类型',
            minWidth: 130,
            align: 'center'
          },
          {
            slot: 'Supplier_Name',
            label: '登记表供应商',
            minWidth: 100,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            slot: 'CHECKTABLE',
            label: '审核登记表',
            minWidth: 130,
            align: 'center'
          },
          {
            prop: 'SB_SH_MAN',
            label: '设备审核人',
            minWidth: 110,
            showOverflowTooltip: true
          },
          {
            slot: 'SB_SH_STATE',
            label: '设备审核状态',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SB_SH_TIME',
            label: '设备审核时间',
            minWidth: 120,
            showOverflowTooltip: true
          },
          {
            prop: 'YG_SH_MAN',
            label: '院感审核人',
            minWidth: 120,
            showOverflowTooltip: true
          },
          {
            slot: 'YG_SH_STATE',
            label: '院感审核状态',
            minWidth: 120,
            align: 'center'

          },
          {
            prop: 'YG_SH_TIME',
            label: '院感审核状态',
            minWidth: 120
          }
        ],
        toolbar: false,
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        registrationUpdatevisible: false
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = getRegistrationList({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      //审核通用方法
      sendReview(type){
        if(this.selection.length == 0) return this.$message.warning('至少选择一条数据');
        const json = JSON.stringify(this.selection)
        upPROD_REGISTRATION_BA_INFO({json:json,type:type}).then((res) => {
          if (res.code != 200) return this.$message.error(res.msg)
          this.$message.success(res.msg)
          this.reload(this.where)
        }).catch((err) => {
          this.$message.error(err)
        })
      },
      equipmentDeny(){
        this.sendReview(2);
      },
      feverDeny(){
        this.sendReview(4);
      },
      equipmentApprove(){
        this.sendReview(1);
      },
      feverApprove(){
        this.sendReview(3);
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      viewBottomTableDetail() {
        this.registrationUpdatevisible = true;
      }
    },
    mounted() {},
    created() {}
  };
</script>
<style lang=""></style>
