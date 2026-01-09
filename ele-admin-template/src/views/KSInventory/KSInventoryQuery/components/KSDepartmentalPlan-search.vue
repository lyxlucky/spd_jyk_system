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
          size="mini"
          clearable
          style="width: 160px"
          v-model="where.Name"
          placeholder="品种名称"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          size="mini"
          clearable
          style="width: 160px"
          v-model="where.SPEC"
          placeholder="规格型号"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          size="mini"
          style="width: 160px"
          v-model="where.MANUFACTURING_ENT_NAME"
          placeholder="生产企业"
        />
      </el-form-item>
      <el-form-item v-if="false">
        <el-select size="mini" style="width: 120px" v-model="where.DEPTNAME" @change="search()">
          <el-option label="选择科室" value="">全部</el-option>
          <el-option
            v-for="item in userDept"
            :key="item.Dept_Two_Code"
            :value="item.Dept_Two_Name"
            >{{ item.Dept_Two_Name }}</el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          size="mini"
          clearable
          style="width: 160px"
          v-model="where.DEF_NO_PKG_CODE"
          placeholder="定数码"
        />
      </el-form-item>
      <el-form-item>
        <el-select size="mini" style="width: 120px" v-model="where.TYPE" @change="search()">
          <el-option label="定数码库存" value="1"></el-option>
          <el-option label="散货库存" value="0"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          size="mini"
          clearable
          type="number"
          style="width: 140px"
          v-model="where.xqDay"
          placeholder="近效期小于x天"
        />
      </el-form-item>
      <el-form-item>
        <el-select size="mini" style="width: 100px" v-model="where.COUNT" @change="search()">
          <el-option label="全部" value=""></el-option>
          <el-option label="未出库" value="1"></el-option>
          <el-option label="已出库" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          size="mini"
          style="width: 160px"
          v-model="where.DELIVERY_NUMBER"
          placeholder="入库单号"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          clearable
          size="mini"
          style="width: 120px"
          v-model="where.batch"
          placeholder="批号"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          class="ele-btn-icon"
          @click="search"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="reset" icon="el-icon-refresh">
          重置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          class="ele-btn-icon"
          icon="el-icon-view"
          @click="KSInventoryQueryShow = true"
        >
          库存汇总
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="outboundEnable"
          size="mini"
          type="primary"
          icon="el-icon-position"
          class="ele-btn-icon"
          @click="openEdit()"
        >
          散货出库
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-download"
          class="ele-btn-icon"
          @click="exportDataExcel()"
        >
          导出
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          class="ele-btn-icon"
          v-if="['stzl', 'stzx'].includes(HOME_HP) || ENV == 'development'"
          icon="el-icon-position"
          @click="outStockWithUDI()"
        >
          UDI出库
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
      <el-form-item>
        <el-dropdown>
          <el-button size="mini" icon="el-icon-setting" type="primary">
            更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-upload
                :show-file-list="false"
                :action="actionUrl"
                :data="Updata"
                :on-success="onSuccess"
                :on-progress="onProgress"
              >
                <el-button size="mini" icon="el-icon-upload2" type="primary"
                  >上传初始化库存</el-button
                >
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-download"
                style="margin: 4px 0;"
                @click="DownloadTemplate()"
              >
                下载初始化模板
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button
                size="mini"
                type="primary"
                @click="GenerateStockData_btn()"
                icon="el-icon-refresh-right"
              >
                生成盘点数据
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <KSInventoryQuery2 :visible.sync="KSInventoryQueryShow" />
    <udiOutStock :visible.sync="udiOutStockVisible" />
  </div>
</template>

<script>
  import { API_BASE_URL, BACK_BASE_URL,HOME_HP } from '@/config/setting';
  import { CreatList } from '@/api/KSInventory/KSDepartmentalPlan';
  import { GetLrJykInstrument } from '@/api/KSInventory/LrJykInstrument';
  import udiOutStock from './udiOutStock';
  import {
    DeptReceivingScanOrder,
    GenerateStockData
  } from '@/api/KSInventory/KSInventoryQuery';
  import KSInventoryQuery2 from '@/views/KSInventory/ReferenceComponent/KSInventoryQuery/index.vue';
  export default {
    props: ['sumCount', 'current', 'type'],
    components: {
      KSInventoryQuery2,
      udiOutStock
    },
    data() {
      // 默认表单数据
      const defaultWhere = {
        Name: '',
        SPEC: '',
        MANUFACTURING_ENT_NAME: '',
        DEPTNAME: '',
        DEF_NO_PKG_CODE: '',
        TYPE: '1',
        COUNT: '1',
        DELIVERY_NUMBER: '',
        xqDay: null,
        bindMachine: '',
        batch:''
      };
      return {
        // 表单数据
        where: { ...defaultWhere },
        BZ: '',
        showEdit: false,
        DistributeNumber: '',
        userDept: [],
        KSInventoryQueryShow: false,
        actionUrl: '',
        Updata: {},
        loading: null,
        udiOutStockVisible: false
      };
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      },
      outboundEnable() {
        if (this.current) {
          return !(
            this.current.COUNT >= 1 &&
            this.current.DEF_NO_PKG_CODE == null &&
            this.type != ''
          );
        }
        return true;
      },
      HOME_HP() {
        return HOME_HP;
      },
      ENV(){
        return process.env.NODE_ENV
      },
    },
    methods: {
      bindMachine() {
        this.$prompt('扫码绑定设备', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
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
                'bindMachineKSInventoryQuery',
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
          .finally(() => {});
      },
      outStockWithUDI() {
        this.udiOutStockVisible = true;
      },
      openEdit() {
        this.$emit('openEdit', this.where);
      },
      /* 搜索 */
      search() {
        this.$emit('search', this.where);
      },
      /*  重置 */
      reset() {
        this.where = { ...this.defaultWhere };
        this.search();
      },
      /* 创建申领单 */
      CreatApplicationForm() {
        const loading = this.$loading({ lock: true });
        var data = {
          BZ: this.BZ,
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          State: '2',
          Operater: this.$store.state.user.info.UserName
        };
        CreatList(data).then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.$emit('search', this.where);
        });
      },
      DeptReceivingScanOrderShow() {
        this.showEdit = true;
      },
      onSubmit() {
        const loading = this.$messageLoading('正在处理中...');
        var data = {
          DistributeNumber: this.DistributeNumber
        };
        DeptReceivingScanOrder(data)
          .then((res) => {
            document.getElementById('idDistributeNumber').focus();
            loading.close();
            this.showEdit = false;
            this.$emit('search', this.where);
            this.$message.success(res.msg);
          })
          .catch((err) => {
            document.getElementById('idDistributeNumber').focus();
            loading.close();
            this.$message.error(err);
          });
      },

      onProgress(event, file, fileList) {
        this.loading = this.$messageLoading('上传中...');
      },
      exportDataExcel() {
        //导出为excel
        this.$emit('exportDataExcel', this.where);
      },
      onSuccess(response, file, fileList) {
        this.loading.close();
        if (response.code == 200) {
          this.$message.success(response.msg);
          this.search();
        } else {
          this.$message.error(response.msg);
        }
      },
      DownloadTemplate() {
        var url = `${BACK_BASE_URL}/ZL/库存初始化.xls`;
        window.location.href = url.replace('/undefined', '');
      },
      GenerateStockData_btn() {
        // var Dept_Two_CodeStr = '';
        // var userDeptList = this.$store.state.user.info.userDept;
        // for (let i = 0; i < userDeptList.length; i++) {
        //   Dept_Two_CodeStr =
        //     Dept_Two_CodeStr + userDeptList[i].Dept_Two_Code + ',';
        // }
        this.where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        this.where.TYPE = this.where.TYPE == undefined ? '1' : this.where.TYPE;
        this.where.COUNT =
          this.where.COUNT == undefined ? '1' : this.where.COUNT;
        this.TYPE = this.where.TYPE;

        var data = {
          where: this.where,
          limit: 999999,
          page: 1,
          order: {},
          Nickname: this.$store.state.user.info.Nickname
        };
        this.$confirm('是否生成盘点数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            var loading = this.$messageLoading('正在生成盘点数据...');
            GenerateStockData(data)
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err);
              });
          })
          .catch((err) => {
            this.$message.info(err);
          });
      }
    },
    created() {
      this.userDept = this.$store.state.user.info.userDept;
      this.Updata = {
        dept_two_code: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        man: this.$store.state.user.info.UserName
      };
      this.actionUrl = `${API_BASE_URL}/TwoDeptApply/initJykInfo?Token=${sessionStorage.Token}`;
    }
  };
</script>
<style scoped lang="scss">
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  ::v-deep .el-form-item {
    margin-bottom: 4px;
  }
</style>
