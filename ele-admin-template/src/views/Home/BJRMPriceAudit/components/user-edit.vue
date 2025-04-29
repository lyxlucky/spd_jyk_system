<template>
  <ele-modal
    width="900px"
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="true"
    custom-class="ele-dialog-form"
    title="修改品种"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <!-- 左侧：编码与项目信息 -->
        <el-col :span="12">
          <el-form-item label="编码类型:" prop="HIS_CODE_TYPE">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_CODE_TYPE"
              placeholder="编码类型"
            />
          </el-form-item>

          <el-form-item label="项目名称:" prop="HIS_ITEM_DESCRIPTION">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_ITEM_DESCRIPTION"
              placeholder="项目名称"
            />
          </el-form-item>

          <el-form-item label="医保编码:" prop="HIS_HC_NUMBER">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_HC_NUMBER"
              placeholder="医保编码"
            />
          </el-form-item>
        </el-col>

        <!-- 右侧：启用标志与日期 -->
        <el-col :span="12">
          <el-form-item label="启用标志:" prop="isDb">
            <el-select
              size="mini"
              style="width: 100%"
              filterable
              v-model="form.HIS_ISACTIVE"
              placeholder="请选择是否启用"
            >
              <el-option label="是" value="是"> </el-option>
              <el-option label="否" value="否"> </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单价开始日期:" prop="HIS_PRICE_START">
            <el-date-picker
              v-model="form.HIS_PRICE_START"
              size="mini"
              clearable
              placeholder="单价开始日期"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="单价结束日期:" prop="HIS_PRICE_END">
            <el-date-picker
              v-model="form.HIS_PRICE_END"
              size="mini"
              clearable
              placeholder="单价结束日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 左侧：物料与单价信息 -->
        <el-col :span="12">
          <el-form-item label="物料编码:" prop="HIS_ITEM_NUMBER">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_ITEM_NUMBER"
              placeholder="请输入物料编码"
            />
          </el-form-item>

          <el-form-item label="使用范围:" prop="HIS_SYFW">
            <el-select
              size="mini"
              v-model="form.HIS_SYFW"
              clearable
              placeholder="使用范围"
            >
              <el-option label="住院" value="住院"></el-option>
              <el-option label="门诊" value="门诊"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="项目单价:" prop="HIS_UNIT_PRICE">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_UNIT_PRICE"
              placeholder="项目单价"
            />
          </el-form-item>
        </el-col>

        <!-- 右侧：更多选项 -->
        <el-col :span="12">
          <el-form-item label="高值耗材标志:" prop="HIS_ISGZ_DZ">
            <el-select
              size="mini"
              v-model="form.HIS_ISGZ_DZ"
              clearable
              placeholder="是否是高值耗材"
            >
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="材料标志:" prop="HIS_CLBS">
            <el-select
              size="mini"
              v-model="form.HIS_CLBS"
              clearable
              placeholder="是否是材料"
            >
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="扩展属性:" prop="HIS_EXTEND">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_EXTEND"
              placeholder="扩展属性"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 左侧：生产厂商与临床服务 -->
        <el-col :span="12">
          <el-form-item label="型号:" prop="HIS_ITEM_SPEC">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_ITEM_SPEC"
              placeholder="型号"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="规格:" prop="HIS_STAND_VALUE">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_STAND_VALUE"
              placeholder="规格"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 左侧：生产厂商与临床服务 -->
        <el-col :span="12">
          <el-form-item label="收费大项目标识:" prop="HIS_SF_DXM_BS">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_SF_DXM_BS"
              placeholder="收费大项目标识"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="内部码:" prop="HIS_NBM">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_NBM"
              placeholder="内部码"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 左侧：生产厂商与临床服务 -->
        <el-col :span="12">
          <el-form-item label="生产厂商:" prop="HIS_SCS">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_SCS"
              placeholder="生产厂商"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="临床服务标志:" prop="HIS_LCFW">
            <el-select v-model="form.HIS_LCFW" clearable size="mini">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 左侧：生产厂商与临床服务 -->
        <el-col :span="12">
          <el-form-item label="收费依据:" prop="HIS_SFYJ">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_SFYJ"
              placeholder="收费依据"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="注册证号:" prop="HIS_ZCZ_NUMBER">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_ZCZ_NUMBER"
              placeholder="注册证号"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 左侧：生产厂商与临床服务 -->
        <el-col :span="12">
          <el-form-item label="注册证名称:" prop="HIS_ITEM_DESCRIPTION">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_ITEM_DESCRIPTION"
              placeholder="注册证名称"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="临床服务分类:" prop="HIS_LCFW_TYPE">
            <el-input
              size="mini"
              clearable
              v-model="form.HIS_LCFW_TYPE"
              placeholder="临床服务分类"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 右侧：医保分类 -->
        <el-col :span="12">
          <el-form-item label="医保分类:" prop="HIS_YBTYPE">
            <el-select
              size="mini"
              v-model="form.HIS_YBTYPE"
              placeholder="请选择分类"
              style="width: 100%"
            >
              <el-option label="甲类" value="甲类"></el-option>
              <el-option label="乙类" value="乙类"></el-option>
              <el-option label="自费" value="自费"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
    </el-form>
    <template v-slot:footer>
      <el-button size="mini" icon="el-icon-close" @click="updateVisible(false)"
        >取消</el-button
      >
      <el-button
        size="mini"
        icon="el-icon-check"
        type="primary"
        :loading="loading"
        @click="save"
        >保存</el-button
      >
    </template>
  </ele-modal>
</template>

<script>
  import { UpSpdHisMainsjLinesIface } from '@/api/Home/BJRMPriceAudit';
  export default {
    components: {},
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object
    },
    data() {
      const defaultForm = {};
      return {
        defaultForm,
        // 表单数据
        form: { ...defaultForm },
        options: [],
        // 表单验证规则
        rules: {
          // CONVERSION_RATIO: [
          //   {
          //     message: '请输入理论人次',
          //     trigger: 'blur'
          //   }
          // ],
          // CLASS_NUM: [
          //   {
          //     required: true,
          //     message: '请选择类别',
          //     trigger: 'blur'
          //   }
          // ],
          // DEVICE_REMARK: [
          //   {
          //     message: '请选择仪器备注',
          //     trigger: 'blur'
          //   }
          // ]
        },
        // 提交状态
        loading: false,
        // 是否是修改
        isUpdate: false
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    created() {
      // this.getJykDevices();
      // console.log(this.data);
      // this.defaultForm.CONVERSION_RATIO = this.data?.JYK_ZHB;
      // this.defaultForm.CLASS_NUM = this.data?.CLASS_NUM == null ? "0": this.data?.CLASS_NUM;
      // this.defaultForm.DEVICE_REMARK = this.data?.JYK_YQM;
    },
    methods: {
      save() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false;
          }
          // this.loading = true;
          this.form.ID = this.data.ID;
          this.form.HEADER_IFACE_ID = this.data.HEADER_IFACE_ID;
          const loading = this.$messageLoading('请求中..');
          UpSpdHisMainsjLinesIface(this.form)
            .then((res) => {
              console.log(res);
              this.$emit('done');
              this.updateVisible(false);
              this.$message.success(res.msg);
            })
            .catch((err) => {
              this.$message.error(err.msg);
            })
            .finally(() => {
              loading.close();
            });
        });
      },
      /* 更新visible */
      updateVisible(value) {
        this.$emit('update:visible', value);
      }
    },
    watch: {
      visible(visible) {
        if (visible) {
          // GetClassificProp_Jy().then((res) => {
          //   // this.form.CLASS_NUM = res.result;
          //   this.CLASS_NUM = res.result;
          // });
          if (this.data) {
            // this.$util.assignObject(this.form, {
            //   ...this.data
            // });
            this.form = {
              ...this.defaultForm,
              ...this.data
              // HIS_CODE_TYPE: this.data.HIS_CODE_TYPE, // 编码类型
              // HIS_ITEM_DESCRIPTION: this.data.HIS_ITEM_DESCRIPTION, // 项目名称
              // HIS_SYFW: this.data.HIS_SYFW, // 使用范围
              // HIS_ISACTIVE: this.data.HIS_ISACTIVE, // 启用标志
              // HIS_HC_NUMBER: this.data.HIS_HC_NUMBER, // 医保编码
              // HIS_NBM: this.data.HIS_NBM, // 内部码
              // ITEM_NUMBER: this.data.ITEM_NUMBER, // 物料编码
              // HIS_UOM: this.data.HIS_UOM, // 收费单位
              // HIS_UNIT_PRICE: this.data.HIS_UNIT_PRICE, // 项目单价
              // HIS_PRICE_START: this.data.HIS_PRICE_START, // 单价开始日期
              // HIS_PRICE_END: this.data.HIS_PRICE_END, // 单价结束日期
              // HIS_CLBS: this.data.HIS_CLBS, // 材料标志
              // HIS_SCS: this.data.HIS_SCS, // 生产厂商
              // HIS_EXTEND: this.data.HIS_EXTEND, // 扩展属性
              // HIS_LCFW: this.data.HIS_LCFW, // 临床服务标志
              // HIS_YBTYPE: this.data.HIS_YBTYPE // 医保分类
            };
            console.log(this.form);
            this.isUpdate = true;
          } else {
            this.isUpdate = false;
          }
        } else {
          this.$refs.form.clearValidate();
          this.form = { ...this.defaultForm };
        }
      }
    }
  };
</script>
