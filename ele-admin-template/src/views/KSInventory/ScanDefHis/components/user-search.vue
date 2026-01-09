<!-- 搜索表单 -->
<template>
  <div>
    <el-form
      inline
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input
          style="width: 160px;"
          id="idDefNoPkgCode"
          clearable
          v-model="where.defNoPkgCode"
          placeholder="请输入定数码"
          size="mini"
          @change="addScanDef"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          style="width: 160px;"
          clearable
          v-model="where.varietie"
          size="mini"
          placeholder="请输入品种编码/品种名称"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          style="width: 160px;"
          clearable
          v-model="where.specType"
          size="mini"
          placeholder="请输入规格型号"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          style="width: 160px;"
          clearable
          v-model="where.deptTwoName"
          size="mini"
          placeholder="请输入二级科室名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          class="ele-btn-icon"
          @click="search"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset" class="ele-btn-icon" icon="el-icon-refresh" size="mini">
          重置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-download"
          class="ele-btn-icon"
          @click="exportData"
        >
          导出
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          class="ele-action"
          title="确定删除？"
          @confirm="removeBatch()"
        >
          <template v-slot:reference>
            <el-button type="danger" class="ele-btn-icon" icon=" el-icon-delete" size="mini" :underline="false">
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          class="ele-action"
          title="确定消耗？"
          @confirm="consumption()"
        >
          <template v-slot:reference>
            <el-button type="success" class="ele-btn-icon" size="mini" icon="el-icon-delete-solid" :underline="false">
              消耗
            </el-button>
          </template>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-upload
          :on-success="uploadSuccess"
          :on-error="upError"
          :data="Updata"
          :show-file-list="false"
          :action="uploadUrl"
          ref="Defupload"
          :limit="1"
        >
          <el-button size="mini" icon="el-icon-_upload" type="primary">
            导入
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          class="ele-btn-icon"
          icon="el-icon-goods"
          @click="KSInventoryQueryShow = true"
        >
          从库存中挑选
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="success"
          size="mini"
          class="ele-btn-icon"
          v-if="['stzl', 'stzx'].includes(HOME_HP) || ENV == 'development'"
          @click="bindMachine"
          icon="el-icon-link"
        >
          绑定设备
        </el-button>
      </el-form-item>
    </el-form>
    <!-- <h3 style="color:blue">{{msgTip}}</h3> -->
    <KSInventoryQuery :visible.sync="KSInventoryQueryShow" />
  </div>
</template>

<script>
  import { API_BASE_URL, BACK_BASE_URL, HOME_HP } from '@/config/setting';
  import { GetLrJykInstrument } from '@/api/KSInventory/LrJykInstrument';
  import {
    insertScanDef,
    delScanDef,
    spdScanConsume
  } from '@/api/KSInventory/ScanDefHis';

  import KSInventoryQuery from '@/views/KSInventory/ScanDefHis/KSInventoryQuery/index.vue';

  export default {
    // props: ['selection'],
    props: {
      // 弹窗是否打开
      visible: Boolean,
      // 修改回显的数据
      data: Object,
      IntroduceUserDefinedTempSearch: Object,
      selection: Object
    },
    components: {
      KSInventoryQuery
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        deptTwoName: '',
        varietie: '',
        specType: '',
        defNoPkgCode: '',
        contractCode: '',
        supplierName: '',
        bindMachine: ''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        msgTip: '',
        uploadUrl: `${BACK_BASE_URL}${API_BASE_URL}/DeptConsume/BatchInsertScanDef`,
        Updata: {
          Token: sessionStorage['Token']
        },
        KSInventoryQueryShow: false
      };
    },
    computed: {
      HOME_HP() {
        return HOME_HP;
      },
      ENV(){
        return process.env.NODE_ENV
      },
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    methods: {
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      /* 导出*/
      exportData() {
        this.$emit('exportData', this.where);
      },
      bindMachine() {
        this.$prompt('扫码绑定设备', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal:false
        })
          .then(({ value }) => {
            const loading = this.$messageLoading('处理中...');
            let mechineCodeWithoutSlash;
            if (!value.includes('/')) {
              mechineCodeWithoutSlash = value;
            }
            const [machineCode] = value.split('/');
            const submitMachineCode = mechineCodeWithoutSlash || machineCode;
            GetLrJykInstrument({
              where: { INSTRUMENT_NAME: submitMachineCode },
              page: 1,
              limit: 9999
            }).then((res) => {
              if (res?.code != 200) return this.$message.error(res.msg);
              const returnValue = res.result[0];
              this.where.bindMachine = `${returnValue.INSTRUMENT_CODE}/${returnValue.INSTRUMENT_NAME}`;
              this.$bus.$emit(
                'bindMachine',
                `${returnValue.INSTRUMENT_CODE}/${returnValue.INSTRUMENT_NAME}`
              );
              this.$message({
                type: 'success',
                message: '绑定成功'
              });
            });
            loading.close();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          })
          .finally(() => {
          });
      },
      /* 添加 */
      addScanDef() {
        const loading = this.$messageLoading('添加中...');
        insertScanDef(this.where)
          .then((res) => {
            this.where.defNoPkgCode = '';
            document.getElementById('idDefNoPkgCode').focus();
            loading.close();
            this.msgTip = 'Tip:' + res.msgTip;
            this.$emit('getMsgTip', this.msgTip);
            this.search();
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.where.defNoPkgCode = '';
            document.getElementById('idDefNoPkgCode').focus();
            loading.close();
            this.$message.error(err);
          });
      },
      /* 删除*/
      removeBatch() {
        const loading = this.$messageLoading('删除中...');
        var idJosn = [];
        var Nickname = this.$store.state.user.info.Nickname;
        this.selection.forEach((element) => {
          idJosn.push(element.Dept_Two_Up_Shelf_Id);
        });
        var data = {
          idJosn: idJosn,
          staff: Nickname
        };
        delScanDef(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.search();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      /* 消耗 */
      consumption() {
        const loading = this.$messageLoading('操作中...');
        var idJosn = [];
        this.selection.forEach((element) => {
          idJosn.push(element.Dept_Two_Up_Shelf_Id);
        });

        var data = {
          idJosn: idJosn,
          staff: this.$store.state.user.info.Nickname,
          deptTwoCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          user: this.$store.state.user.info.UserName,
          password: this.$store.state.user.info.Password,
          AesKey: null
        };

        spdScanConsume(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.search();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      uploadSuccess(response, file) {
        console.log(response);
        this.$refs.Defupload.clearFiles();
        if (response.code == 200) {
          this.$message.success(response.msg);
          this.search();
        } else {
          this.$message.error(response.msg);
        }
      },
      upError(response, file) {
        console.log(response);
        this.$refs.Defupload.clearFiles();
        this.$message.error(response.msg);
      }
    }
  };
</script>

<style scoped lang="scss">
  ::v-deep .el-form-item {
    margin-bottom: 6px;
  }
</style>
