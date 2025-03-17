<template lang="">
  <div>
    <ele-modal
      width="80%"
      height="60%"
      title="UDI扫码添加"
      :visible="visible"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @update:visible="updateVisible"
      @opened="
        () => {
          this.$refs.firstUdi.focus();
          this.tips = "";
        }
      "
    >
      <!-- udi扫描 -->
      <el-form ref="form" :model="where" @keyup.enter.native="save">
        <el-row>
          <el-col v-bind="styleResponsive ? { lg: 24, md: 8 } : { span: 6 }">
            <el-form-item prop="firstUdi">
              <el-input
                ref="firstUdi"
                @blur="handleUdiScan()"
                size="mini"
                v-model="where.firstUdi"
                placeholder="请输入UDI"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col v-bind="styleResponsive ? { lg: 20, md: 8 } : { span: 6 }">
            <el-form-item prop="secondUdi">
              <el-input
                ref="secondUdi"
                size="mini"
                @blur="handleUdiScan()"
                v-model="where.secondUdi"
                placeholder="请输入UDI"
              />
            </el-form-item>
          </el-col>
          <el-col v-bind="styleResponsive ? { lg: 2, md: 1 } : { span: 2 }">
            <el-form-item>
              <el-checkbox v-model="where.isMultiPart">多段UDI</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="styleResponsive ? { lg: 24, md: 8 } : { span: 6 }">
            <el-form-item>
              <span>Tips：{{ tips }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 表格 -->

      <ele-pro-table
        ref="table"
        size="mini"
        height="400"
        :initLoad="false"
        highlight-current-row
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        @selection-change="onSelectionChange"
        @current-change="onCurrentChange"
        cache-key="UDIScanAddDialogCacheKey"
      >
        <template v-slot:Batch="{ row }">
          <el-input
            size="mini"
            v-model="row.Batch"
            placeholder="请输入批号"
          ></el-input>
        </template>

        <template v-slot:Batch_Production_Date="{ row }">
          <!-- <el-date-picker
          v-model="row.Batch_Production_Date"
          type="date"
          size="mini"
          value-format="yyyy-MM-dd"
          :value="row.Batch_Production_Date && row.Batch_Production_Date.substr(0, 10) !== '0001-01-01' ? row.Batch_Production_Date : ''"
          @input="val => row.Batch_Production_Date = val || '0001-01-01'"
          placeholder="请输入生产日期">
        </el-date-picker> -->
          <el-input
            size="mini"
            v-model="row.Batch_Production_Date"
            placeholder="请输入生产日期"
          ></el-input>
        </template>

        <template v-slot:Batch_Validity_Period="{ row }">
          <el-input
            size="mini"
            v-model="row.Batch_Validity_Period"
            placeholder="请输入有效期"
          ></el-input>
        </template>
      </ele-pro-table>

      <template v-slot:footer>
        <el-button size="mini" @click="updateVisible(false)">取消</el-button>
        <el-button size="mini" type="primary" @click="save">手动添加</el-button>
      </template>
    </ele-modal>
  </div>
</template>
<script>
  import { scanUdiAddVarieties } from '@/api/HeelBlockConsumables/PlatformConsume';
  export default {
    name: 'UDIScanAddDialog',
    props: ['visible', 'AdvanceReceiptNumberCurrent'],
    data() {
      const defaultWhere = {
        firstUdi: '',
        secondUdi: '',
        isMultiPart: false,
        json: ''
      };
      return {
        where: {
          ...defaultWhere
        },
        tips: '',
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'Varietie_Code',
            label: '品种(材料)编码',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'PROD_REGISTRATION_NAME',
            label: '注册证名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            slot: 'Batch',
            prop: 'Batch',
            label: '批号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            slot: 'Batch_Production_Date',
            prop: 'Batch_Production_Date',
            label: '生产日期',
            align: 'center',
            width: 180,
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row.Batch_Production_Date.substr(0, 10) == '0001-01-01') {
                return '';
              }
              return row.Batch_Production_Date.substr(0, 10);
            }
          },
          {
            slot: 'Batch_Validity_Period',
            prop: 'Batch_Validity_Period',
            label: '有效期',
            width: 180,
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row.Batch_Validity_Period.substr(0, 10) == '0001-01-01') {
                return '';
              }
              return row.Batch_Validity_Period.substr(0, 10);
            }
          },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'Netreceipts',
            label: '数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (row.Netreceipts == null || row.Netreceipts == '') {
                return '1';
              }
              return row.Netreceipts;
            }
          },
          {
            prop: 'Unit',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'udi',
            label: 'UDI',
            align: 'left',
            showOverflowTooltip: true,
            minWidth: 100
          }
        ],
        toolbar: false,
        pageSize: 50,
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
        // console.log(page, limit, where, order);
        return scanUdiAddVarieties({
          page,
          limit,
          where,
          order,
          json: where.json
        }).then((res) => {
          let data = res.data;
          return { list: data.result, count: data.total };
        });
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      handleUdiScan() {
        if (this.where.isMultiPart) {
          // 多段 UDI：两段都输入完成后才触发提交
          if (
            this.where.firstUdi &&
            this.where.firstUdi != '' &&
            this.where.secondUdi &&
            this.where.secondUdi != ''
          ) {
            this.scanUdi();
            this.where.isMultiPart = false;
          }
        } else {
          // 单段 UDI：输入完第一段后触发提交
          if (this.where.firstUdi && this.where.firstUdi != '') {
            this.scanUdi();
          }
        }
      },
      scanUdi() {
        const udi = this.where.isMultiPart
          ? this.where.firstUdi + this.where.secondUdi
          : this.where.firstUdi;
        const jsonString = [
          {
            Id: '',
            Varietie_Code: '',
            udi: udi,
            DELIVERY_NOTE_NUMBER:
              this.AdvanceReceiptNumberCurrent.Delivery_Note_Number,
            Netreceipts: '1',
            Batch: '',
            Batch_Production_Date: '0001-01-01',
            Batch_Validity_Period: '0001-01-01'
          }
        ];
        const loading = this.$messageLoading('加载中...');
        //重写
        scanUdiAddVarieties({ json: JSON.stringify(jsonString) })
          .then((res) => {
            let data = res.data;
            if (data.code == '200') {
              this.$message.success(data?.msg);
              return true;
            }
            this.tips = data?.msg;
            this.$message.error(data?.msg);
          })
          .finally(() => {
            this.$refs.table.reload({
              where: { json: JSON.stringify(jsonString) }
            });
            this.where.firstUdi = '';
            this.where.secondUdi = '';
            this.$refs.firstUdi.focus();
            loading.close();
          });
        //重写
      },
      save() {
        if (!this.current) {
          this.$message.warning('请选择一条数据');
        }
        if (!this.current.Batch) {
          this.$message.warning('请输入批号');
          return;
        }
        if (
          !this.current.Batch_Production_Date ||
          this.current.Batch_Production_Date.substr(0, 10) == '0001-01-01'
        ) {
          this.$message.warning('请输入生产日期');
          return;
        }
        if (
          !this.current.Batch_Validity_Period ||
          this.current.Batch_Validity_Period.substr(0, 10) == '0001-01-01'
        ) {
          this.$message.warning('请输入有效期');
          return;
        }

        // this.scanUdi();
        const jsonString = [
          {
            Id: '',
            Varietie_Code: this.current.VARIETIE_ID,
            udi: this.current.udi,
            DELIVERY_NOTE_NUMBER: this.current.Delivery_Note_Number,
            Netreceipts: this.current.Netreceipts || '1',
            Batch: this.current.Batch,
            Batch_Production_Date: this.current.Batch_Production_Date,
            Batch_Validity_Period: this.current.Batch_Validity_Period
          }
        ];
        const loading = this.$messageLoading('加载中...');
        scanUdiAddVarieties({ json: JSON.stringify(jsonString) })
          .then((res) => {
            let data = res.data;
            if (data.code == '200') {
              this.$message.success(data?.msg);
              this.$refs.firstUdi.focus();
            } else {
              this.$message.error(data?.msg);
            }
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    computed: {
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    created() {}
  };
</script>
<style lang=""></style>
