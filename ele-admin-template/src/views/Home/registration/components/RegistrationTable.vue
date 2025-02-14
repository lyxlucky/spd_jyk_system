<template lang="">
  <div class="ele-body">
    <registrationTableSearch
      @registrationExport="handleRegistrationExport"
      @search="reload"
      @itemDelete="handleItemDelete"
    />
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
      cache-key="registrationTableCacheKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>

      <template v-slot:REGISTRATION_VALID_DATE="{ row }">
        <el-tag size="mini" type="danger" v-if='isDateBeforeToday(row.REGISTRATION_VALID_DATE)'>{{
          row.REGISTRATION_VALID_DATE.substring(0, 10)
        }}</el-tag>
        <el-tag size="mini" type="success" v-else>{{
          row.REGISTRATION_VALID_DATE.substring(0, 10)
        }}</el-tag>
      </template>

      <template v-slot:ACTION="{ row }">
        <div>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handlePurchase(row)"
            >带量采购</el-button
          >
          <el-button
            type="info"
            size="mini"
            icon="el-icon-more-outline"
            @click="handleCatDetail(row)"
            >详情</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDistinct(row)"
            >去重保留</el-button
          >
        </div>
      </template>
    </ele-pro-table>
    <RegistrationDetail
      :visible.sync="registrationUpdatevisible"
      :tableCurrent="tableCurrent"
    />
  </div>
</template>
<script>
  import registrationTableSearch from './RegistrationTableSearch';
  import RegistrationDetail from './RegistrationDetail';
  import {
    SearchProdInfo,
    disAppro,
    DeleteProd
  } from '@/api/Home/registration/index';
  import { utils, writeFile } from 'xlsx';
  export default {
    name: 'RegistrationTable',
    components: {
      registrationTableSearch,
      RegistrationDetail
    },
    data() {
      return {
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center',
            fixed: 'left'
          },
          {
            slot: 'ACTION',
            prop: 'ACTION',
            label: '操作',
            minWidth: 320,
            align: 'center'
          },
          {
            prop: 'QXBZ',
            label: '缺项备注',
            minWidth: 150,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            prop: 'PROD_REGISTRATION_NAME',
            label: '注册证名称',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '医疗器械注册人或备案人',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'ST_MANUFACTURING_ENT_NAME',
            label: '受托医疗器械生产企业名称',
            minWidth: 220,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PRODUCTION_SITE',
            label: '生产企业地址',
            minWidth: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_LICENSE',
            label: '生产许可证号',
            minWidth: 160,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGISTRATION_ISSUING_DATE',
            label: '发证日期',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true,
            formatter: (_row, _column, cellValue) => {
              return this.$util.toDateString(cellValue, 'yyyy-MM-dd');
            }
          },
          {
            slot: 'REGISTRATION_VALID_DATE',
            prop: 'REGISTRATION_VALID_DATE',
            label: '有效到期',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PROD_BIG_CLASS_NAME',
            label: '产品类别',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'MGMT_CAT_NAME',
            label: '管理类别',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'REGULATORY_CAT_NAME',
            label: '监管类别',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'IS_ENABLE',
            prop: 'IS_ENABLE',
            label: '启用状态',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'OLD_PROD_REGISTRATION_CODE',
            label: '原注册证',
            minWidth: 120,
            align: 'center',
            showOverflowTooltip: true
          }
        ],
        toolbar: false,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        registrationUpdatevisible: false,
        tableCurrent: null
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = SearchProdInfo({ page, limit, where, order }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(row) {
        this.current = row;
        this.$bus.$emit(`${this.$route.path}/handleCurrent`, row);
      },
      isDateBeforeToday(dateString) {
        if (!dateString) {
          // 增加对 dateString 为空的判断，避免空值传入 moment 报错
          return false; // 或者根据你的需求返回其他默认值，比如 false 表示不早于今天
        }
        const dateToCheck = this.$moment(dateString, true); // 使用 strict mode 严格解析日期
        if (!dateToCheck.isValid()) {
          return false; // 如果日期无效，返回 false
        }
        const today = this.$moment().startOf('day');
        return dateToCheck.isBefore(today); // 返回 true 如果 dateToCheck 早于今天
      },
      handleItemDelete(data) {
        if (!this.selection.length) {
          this.$message.error('请选择要删除的数据');
          return;
        }
        const ids = this.selection
          .map((item) => {
            return item.PROD_REGISTRATION_CODE;
          })
          .join(',');
        this.$confirm('是否删除此产品注册证', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DeleteProd({
            code: ids
          })
            .then((res) => {
              if (res?.code != 200) return this.$message.error(res.msg);
              this.$message.success(res.msg);
            })
            .finally(() => {
              this.reload(null);
            });
        });
      },
      handleRegistrationExport(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(() => {
          SearchProdInfo({
            page: 1,
            limit: 999999,
            where: data
          })
            .then((res) => {
              const array = [
                [
                  '注册证名称',
                  '生产企业名称',
                  '生产企业地址',
                  '批准文号',
                  '生产许可证号',
                  '发证日期',
                  '有效到期',
                  '产品类别',
                  '管理类别',
                  '监管类别',
                  '监管编码',
                  '国产/进口',
                  '品牌',
                  '原注册证',
                  '备注',
                  '档案号',
                  '缺项备注',
                  '启用状态'
                ]
              ];
              //
              res.result.forEach((d) => {
                array.push([
                  d.PROD_REGISTRATION_NAME,
                  d.MANUFACTURING_ENT_NAME,
                  d.MANUFACTURING_ADDRES,
                  d.APPROVAL_NUMBER,
                  d.MANUFACTURING_LICENSE,
                  d.REGISTRATION_ISSUING_DATE.substr(0, 10),
                  d.REGISTRATION_VALID_DATE.substr(0, 10),
                  d.PROD_BIG_CLASS_NAME,
                  d.MGMT_CAT_NAME,
                  d.REGULATORY_CAT_NAME,
                  d.REGULATORY_CAT_CODE,
                  d.TRADE_TYPE == 1 ? '进口' : '国产',
                  d.Brand,
                  d.OLD_PROD_REGISTRATION_CODE,
                  d.NOTE_DESCRIPTION,
                  d.MANUFACTURING_LICENSE,
                  d.QXBZ,
                  d.ENABLE == 0 ? '停用' : '启用'
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '注册证详情.xlsx'
              );
              this.$message.success('导出成功');
            })
            .finally(() => {
              loading.close();
            });
        });
      },
      handlePurchase(data) {},
      handleDistinct(data) {
        const loading = this.$messageLoading('请求中..');
        disAppro({
          id: data.PROD_REGISTRATION_CODE,
          ApproStr: data.APPROVAL_NUMBER
        })
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally(() => {
            loading.close();
            this.reload(null);
          });
      },
      handleCatDetail(data) {
        this.tableCurrent = data;
        this.registrationUpdatevisible = true;
      }
    },
    created() {}
  };
</script>
<style lang=""></style>
