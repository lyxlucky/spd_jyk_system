<template>
  <div class="ele-container">
    <ele-pro-table
      class="style-table"
      ref="table"
      :columns="columns"
      :datasource="datasource"
      size="mini"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      highlight-current-row
      cache-key="ThreeLevelDbBDTable"
      height="calc(100vh - 220px)"
      max-height="calc(100vh - 220px)"
    >
      <template v-slot:toolbar>
        <el-form
          :model="form"
          ref="form"
          :inline="true"
          class="ele-form-search"
          size="mini"
        >
          <el-form-item prop="DeptName">
            <el-input
              v-model="form.DeptName"
              placeholder="请输入科室名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="varCode">
            <el-input
              v-model="form.varCode"
              placeholder="请输入品种编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="varName">
            <el-input
              v-model="form.varName"
              placeholder="请输入品种名称"
              clearable
            />
          </el-form-item>
          <el-form-item prop="chargingCode">
            <el-input
              v-model="form.chargingCode"
              placeholder="请输入计费编码"
              clearable
            />
          </el-form-item>
          <el-form-item prop="spec">
            <el-input
              v-model="form.spec"
              placeholder="请输入规格型号"
              clearable
            />
          </el-form-item>
          <el-form-item prop="manufacter">
            <el-input
              v-model="form.manufacter"
              placeholder="请输入生产企业"
              clearable
            />
          </el-form-item>
          <el-form-item prop="prodRegistrationCode">
            <el-input
              v-model="form.prodRegistrationCode"
              placeholder="请输入批准文号"
              clearable
            />
          </el-form-item>
          <el-form-item class="ele-form-actions">
            <el-button type="primary" @click="reload()">查询</el-button>
            <el-button type="success" @click="exportData()">导出</el-button>
          </el-form-item>
        </el-form>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
  import { getThirdStockInfo } from '@/api/Inventory/ThreeLevelDbBD';
  import { utils, writeFile } from 'xlsx';
  export default {
    name: 'ThreeLevelDbBD',
    components: {},
    props: {},
    data() {
      return {
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 9999999],
        form: {
          DeptName: '', // 科室名称
          varCode: '', // 品种编码
          varName: '', // 品种名称
          chargingCode: '', // 计费编码
          spec: '', // 规格型号
          manufacter: '', // 生产企业
          prodRegistrationCode: '' // 批准文号
        },
        columns: [
          {
            prop: 'DEPT_TWO_NAME',
            label: '二级科室名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '批准文号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'CHARGE_CODE',
            label: '计费编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'UNIT',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'HIS_ZHB',
            label: '转换比',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'JF_QTY',
            label: '计费数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'STOCK_QTY',
            label: '库存数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ]
      };
    },
    methods: {
      datasource({ page, limit, where }) {
        return getThirdStockInfo({ page, limit, where })
          .then((res) => {
            return {
              list: res.data || [],
              count: res.total || 0
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      reload() {
        this.$refs.table.reload({ page: 1, where: this.form });
      },
      exportData() {
        const loading = this.$messageLoading('正在导出数据...');
        try {
          // 直接使用当前的查询条件进行全量导出
          getThirdStockInfo({
            page: 1,
            limit: 999999,
            where: this.form
          }).then((response) => {
            loading.close();
            const headers = [
              '二级科室名称',
              '批准文号',
              '品种编码',
              '计费编码',
              '品种名称',
              '规格型号',
              '生产企业',
              '单位',
              '转换比',
              '计费数量',
              '库存数量'
            ];
            const dataArray = [headers];
            response.data.forEach((d) => {
              dataArray.push([
                d.DEPT_TWO_NAME || '',
                d.APPROVAL_NUMBER || '',
                d.VARIETIE_CODE_NEW || '',
                d.CHARGE_CODE || '',
                d.VARIETIE_NAME || '',
                d.SPECIFICATION_OR_TYPE || '',
                d.MANUFACTURING_ENT_NAME || '',
                d.UNIT || '',
                d.HIS_ZHB || '',
                d.JF_QTY || '',
                d.STOCK_QTY || ''
              ]);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(dataArray)
                }
              },
              '北大三级库存信息.xlsx'
            );
            this.$message.success('导出成功');
          }).catch((error) => {
            loading.close();
            console.error('导出数据失败:', error);
            this.$message.error('导出数据失败，请稍后重试');
          });
        } catch (error) {
          loading.close();
          console.error('导出数据失败:', error);
          this.$message.error('导出数据失败，请稍后重试');
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/styles/common';
  
  .ele-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  :deep(.ele-form-search .el-input--mini .el-input__inner) {
    width: 140px;
  }
  
  :deep(.ele-pro-table) {
    flex: 1;
    overflow: hidden;
  }
  
  :deep(.ele-pro-table .el-table) {
    height: 100%;
  }
  
  :deep(.ele-pro-table .el-table__body-wrapper) {
    overflow-y: auto;
  }
</style>
