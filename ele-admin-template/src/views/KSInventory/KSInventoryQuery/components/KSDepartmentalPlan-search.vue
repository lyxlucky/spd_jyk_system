<!-- 搜索表单 -->
<template>
  <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <!-- <el-row :gutter="15">
      <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 12 }">
        <el-button type="success" size="medium" @click="DeptReceivingScanOrderShow">扫码入库</el-button>
      </el-col>
    </el-row> -->
    <el-row :gutter="10">
       <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input id="idDistributeNumber" clearable v-model="DistributeNumber" placeholder="收货单号" @change="onSubmit"/>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.Name" placeholder="品种名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.SPEC" placeholder="规格型号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.MANUFACTURING_ENT_NAME" placeholder="生产企业" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.DEPTNAME" placeholder="科室名称" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.DEF_NO_PKG_CODE" placeholder="定数码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 4, md: 12 } : { span: 12 }">
        <el-form-item label="库存类型:">
          <el-select v-model="where.TYPE" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="定数码与散货分开" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-form-item label="数量:">
          <el-select v-model="where.COUNT" @change="search()">
            <el-option label="全部" value=""></el-option>
            <el-option label="大于0" value="1"></el-option>
            <el-option label="无" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 12 }">
        <el-input clearable v-model="where.DELIVERY_NUMBER" placeholder="入库单号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 5, md: 12 } : { span: 8 }">
        <div class="ele-form-actions">
          <el-button size="small" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="reset">重置</el-button>
          <!-- <el-button type="success" size="medium" @click="DeptReceivingScanOrderShow">扫码入库</el-button> -->
        </div>
      </el-col>
    </el-row>
    <!-- <el-dialog title="扫码入库" :visible.sync="showEdit" width='30%'>
      <el-form label-width="80px">
        <el-form-item label="收货单号:">
          <el-input v-model="DistributeNumber"></el-input>
        </el-form-item>
        <div style="width:100%;display: flex;justify-content: center;">
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </el-form>
    </el-dialog> -->
  </el-form>
</template>

<script>
import { CreatList } from '@/api/KSInventory/KSDepartmentalPlan';
import { DeptReceivingScanOrder } from '@/api/KSInventory/KSInventoryQuery';
export default {
  data() {
    // 默认表单数据
    const defaultWhere = {
      Name: '',
      SPEC: '',
      MANUFACTURING_ENT_NAME: '',
      DEPTNAME: '',
      DEF_NO_PKG_CODE: '',
      TYPE: '0',
      COUNT: '1',
      DELIVERY_NUMBER: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      BZ: '',
      showEdit: false,
      DistributeNumber: ''
    };
  },
  computed: {
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
          document.getElementById("idDistributeNumber").focus();
          loading.close();
          this.showEdit = false;
          this.$emit('search', this.where);
          this.$message.success(res.msg);
        })
        .catch((err) => {
          document.getElementById("idDistributeNumber").focus();
          loading.close();
          this.$message.error(err);
        });
    }
  },
  created() {}
};
</script>
