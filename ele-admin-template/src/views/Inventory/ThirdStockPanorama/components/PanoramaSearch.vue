<template>
  <section class="panorama-search spd-panel spd-panel--search">
    <div class="spd-panel__head panorama-search__head">
      <span>查询条件</span>
      <el-radio-group v-model="modeSync" size="mini" aria-label="查询维度">
        <el-radio-button label="department">按科室看品种</el-radio-button>
        <el-radio-button label="material">按品种看科室</el-radio-button>
      </el-radio-group>
    </div>
    <div class="spd-panel__body">
      <el-form
        :model="form"
        :inline="true"
        size="mini"
        @submit.native.prevent="$emit('search')"
      >
        <el-form-item label="科室">
          <el-input
            v-model="form.DeptName"
            clearable
            placeholder="科室名称"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="form.varName"
            clearable
            placeholder="品种名称"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input
            v-model="form.varCode"
            clearable
            placeholder="品种编码"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="计费编码">
          <el-input
            v-model="form.chargingCode"
            clearable
            placeholder="计费编码"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="form.spec"
            clearable
            placeholder="规格型号"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="form.manufacter"
            clearable
            placeholder="生产企业"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="批准文号">
          <el-input
            v-model="form.prodRegistrationCode"
            clearable
            placeholder="批准文号"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="统计开始时间">
          <el-date-picker
            v-model="form.statStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="统计开始日期"
            style="width: 132px"
          />
        </el-form-item>
        <el-form-item label="发生时间时间">
          <el-date-picker
            v-model="operationChargingDateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item class="panorama-search__actions">
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="$emit('search')">
            查询
          </el-button>
          <el-button type="success" icon="el-icon-download" @click="exportData()">导出</el-button>
          <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
  import { utils, writeFile } from 'xlsx';
  import { getThirdStockInfo } from '@/api/Inventory/ThreeLevelDbBD';

  function createForm() {
    return {
      DeptName: '',
      varCode: '',
      varName: '',
      chargingCode: '',
      spec: '',
      manufacter: '',
      prodRegistrationCode: '',
      statStartTime: '2024-03-01',
      operationChargingStartTime: '',
      operationChargingEndTime: ''
    };
  }

  export default {
    name: 'PanoramaSearch',
    props: {
      queryMode: { type: String, default: 'department' },
      loading: Boolean
    },
    data() {
      return { form: createForm() };
    },
    computed: {
      modeSync: {
        get() {
          return this.queryMode;
        },
        set(value) {
          this.$emit('mode-change', value);
        }
      },
      operationChargingDateRange: {
        get() {
          return [
            this.form.operationChargingStartTime,
            this.form.operationChargingEndTime
          ];
        },
        set(value) {
          this.form.operationChargingStartTime = value?.[0] || '';
          this.form.operationChargingEndTime = value?.[1] || '';
        }
      }
    }, 
    methods: {
      getWhere() {
        return { ...this.form };
      },
      exportData() {
        const loading = this.$messageLoading('正在导出数据...');
        try {
          getThirdStockInfo({
            page: 1,
            limit: 999999,
            where: this.form
          })
            .then((response) => {
              loading.close();
              const headers = [
                '二级科室名称',
                '品种编码',
                '计费编码',
                '品种名称',
                '规格型号',
                '生产企业',
                '单位',
                '单价',
                '转换比',
                '批准文号',
                '散货计费数量',
                '定数包计费数量',
                '入库数量',
                '入库总数量',
                'HIS收费总数',
                '库存数量'
              ];
              const dataArray = [headers];
              response.data.forEach((d) => {
                const ksQtyTotal =
                  Number(d.KS_QTY) + Number(d.JF_QTY) + Number(d.JF_DEF_QTY);
                dataArray.push([
                  d.DEPT_TWO_NAME || '',
                  d.VARIETIE_CODE_NEW || '',
                  d.CHARGE_CODE || '',
                  d.VARIETIE_NAME || '',
                  d.SPECIFICATION_OR_TYPE || '',
                  d.MANUFACTURING_ENT_NAME || '',
                  d.UNIT || '',
                  d.PRICE || '',
                  d.HIS_ZHB || '',
                  d.APPROVAL_NUMBER || '',
                  d.JF_QTY || '',
                  d.JF_DEF_QTY || '',
                  d.KS_QTY || '',
                  d.IN_STOCK_TOTAL_QTY || '',
                  d.HIS_CHARGE_TOTAL_QTY || '',
                  ksQtyTotal || ''
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(dataArray)
                  }
                },
                '三级库-库存信息.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch(() => {
              loading.close();
              this.$message.error('导出数据失败，请稍后重试');
            });
        } catch (error) {
          loading.close();
          console.error('导出数据失败:', error);
          this.$message.error('导出数据失败，请稍后重试');
        }
      },
      reset() {
        this.form = createForm();
        this.$emit('reset');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .panorama-search__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .panorama-search__actions {
    margin-right: 0;
  }

  :deep(.el-input--mini .el-input__inner),
  :deep(.el-select .el-input__inner) {
    width: 132px;
  }

  @media screen and (max-width: 900px) {
    .panorama-search__head {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
