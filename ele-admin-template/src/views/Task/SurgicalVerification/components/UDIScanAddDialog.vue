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
      @opened="handleOpened"
      @closed="handleClosed"
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

      <template v-slot:footer>
        <el-button size="mini" @click="updateVisible(false)">取消</el-button>
      </template>
    </ele-modal>
  </div>
</template>
<script>
  // import { scanUdiAddVarieties } from '@/api/HeelBlockConsumables/PlatformConsume';
  // import { ImportSpdMainsjLinesIfaceExcel } from '@/api/Home/masterBaseData';
  import { addBdszZqsjMainPsDelUse } from '@/api/Task/SurgicalVerification';

  export default {
    name: 'UDIScanAddDialog',
    props: ['visible', 'AdvanceReceiptNumberCurrent','AdvanceReceiptDelcurrent'],
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
      handleClosed() {
        this.$emit('udiScanDialogClose', false);
      },
      handleOpened() {
        this.$refs.firstUdi.focus();
        this.tips = '';
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
        const loading = this.$messageLoading('加载中...');
        //重写
        addBdszZqsjMainPsDelUse({ UDI: udi,ID: this.AdvanceReceiptNumberCurrent.SSBH, BDSZ_ZQSJ_PS_ID: this.AdvanceReceiptDelcurrent.ID })
          .then((data) => {
            if (data.code == '200') {
              this.$message.success(data?.msg);
              return true;
            }
            this.tips = data?.msg;
            this.$message.error(data?.msg);
          })
          .finally(() => {
            this.where.firstUdi = '';
            this.where.secondUdi = '';
            this.$refs.firstUdi.focus();
            loading.close();
          });
        //重写
      },
      save() {}
    },
    computed: {
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    created() {}
  };
</script>
<style scoped></style>
