<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    width="600px"
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="true"
    custom-class="ele-dialog-form"
    title="修改品种"
    @update:visible="updateVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="82px">
      <el-row :gutter="12">
        <el-col v-bind="styleResponsive ? { sm: 20 } : { span: 20 }">
          <el-form-item label="品种类别:" prop="CLASS_NUM">
            <el-select
            size="mini"
              clearable
              class="ele-block"
              v-model="form.CLASS_NUM"
              placeholder="请选择类别"
            >
              <el-option
                v-for="item in CLASS_NUM"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
              <!-- <el-option label="" value="0" />
              <el-option label="试剂" value="1" />
              <el-option label="校准品" value="2" />
              <el-option label="质控品" value="3" />
              <el-option label="有毒物品" value="4" />
              <el-option label="耗材" value="5" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="理论人次:" prop="CONVERSION_RATIO">
            <el-input
            size="mini"
              clearable
              :maxlength="20"
              v-model="form.CONVERSION_RATIO"
              placeholder="请输入理论人次"
            />
          </el-form-item>
          <el-form-item label="仪器设备:" prop="DEVICE_REMARK">
            <el-select
            size="mini"
              style="width: 100%"
              filterable
              v-model="form.DEVICE_REMARK"
              placeholder="请选择仪器设备"
            >
              <el-option-group
                v-for="group in options"
                :key="group.WORKING_GROUP"
                :label="group.WORKING_GROUP"
              >
                <el-option
                  v-for="item in group.INSTRUMENT_NAME"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="是否定标:" prop="isDb">
            <el-select
            size="mini"
              style="width: 100%"
              filterable
              v-model="form.IS_DB"
              placeholder="请选择是否定标"
            >
          
                <el-option
                  label="是"
                  value="1"
                >
                </el-option>
                <el-option
                  label="否"
                  value="0"
                >
                </el-option>
            </el-select>
          </el-form-item>

        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button size="mini" icon="el-icon-close" @click="updateVisible(false)">取消</el-button>
      <el-button size="mini" icon="el-icon-check" type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>

<script>
  import {
    GetClassificProp_Jy,
    UpdateVarietieBasicJyk,
    jykDeviceOptionList
  } from '@/api/KSInventory/KSInventoryBasicData';

  export default {
    components: {},
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object
    },
    data() {
      const defaultForm = {
        Varietie_Code: '',
        varietie_code_new: '',
        CONVERSION_RATIO: '',
        CLASS_NUM: '',
        DEVICE_REMARK: '',
        IS_DB:''
      };
      return {
        defaultForm,
        // 表单数据
        form: { ...defaultForm },
        options: [],
        CLASS_NUM: [],
        CLASS_NUMVal: '',
        // 表单验证规则
        rules: {
          CONVERSION_RATIO: [
            {
              message: '请输入理论人次',
              trigger: 'blur'
            }
          ],
          CLASS_NUM: [
            {
              required: true,
              message: '请选择类别',
              trigger: 'blur'
            }
          ],
          DEVICE_REMARK: [
            {
              message: '请选择仪器备注',
              trigger: 'blur'
            }
          ]
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
      this.getJykDevices();
      // console.log(this.data);
      // this.defaultForm.CONVERSION_RATIO = this.data?.JYK_ZHB;
      // this.defaultForm.CLASS_NUM = this.data?.CLASS_NUM == null ? "0": this.data?.CLASS_NUM;
      // this.defaultForm.DEVICE_REMARK = this.data?.JYK_YQM;
    },
    methods: {
      /* 保存编辑 */
      getJykDevices() {
        jykDeviceOptionList().then((res) => {
          this.options = res.result;
        });
      },
      save() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false;
          }
          // this.loading = true;
          this.form.Varietie_Code = this.data.Varietie_Code;
          UpdateVarietieBasicJyk(this.form).then((res) => {
            this.$emit('done');
            this.updateVisible(false);
            this.$message.success(res.data.msg);
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
          GetClassificProp_Jy().then((res) => {
            // this.form.CLASS_NUM = res.result;
            this.CLASS_NUM = res.result;
          });
          if (this.data) {
            // this.$util.assignObject(this.form, {
            //   ...this.data
            // });
            this.form = {
                    ...this.defaultForm,
                    CONVERSION_RATIO: this.data.JYK_ZHB,
                    CLASS_NUM: this.data.CLASS_NUM == null ? '0' : this.data.CLASS_NUM,
                    DEVICE_REMARK: this.data.JYK_YQM,
                    IS_DB: this.data.IS_DB
                };
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
