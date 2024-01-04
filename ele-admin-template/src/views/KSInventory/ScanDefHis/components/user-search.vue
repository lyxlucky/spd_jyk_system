<!-- 搜索表单 -->
<template>
  <div>
    <el-form label-width="77px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
      <el-row :gutter="15">
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input id="idDefNoPkgCode" clearable v-model="where.defNoPkgCode" placeholder="请输入定数码" @change="addScanDef" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input clearable v-model="where.varietie" placeholder="请输入品种编码/品种名称" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input clearable v-model="where.specType" placeholder="请输入规格型号" />
        </el-col>
        <!-- <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.defNoPkgCode" placeholder="请输入合同编码" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
        <el-input clearable v-model="where.contractCode" placeholder="请输入供应商名称" />
      </el-col> -->
        <el-col v-bind="styleResponsive ? { lg: 3, md: 12 } : { span: 6 }">
          <el-input clearable v-model="where.deptTwoName" placeholder="请输入二级科室名称" />
        </el-col>
        <el-col v-bind="styleResponsive ? { lg: 12, md: 12 } : { span: 6 }">
          <div class="ele-form-actions">
            <el-button type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
              查询
            </el-button>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-download" class="ele-btn-icon" @click="exportData">
              导出
            </el-button>
            <el-popconfirm class="ele-action" title="确定删除？" @confirm="removeBatch()">
              <template v-slot:reference>
                <el-button type="danger" size="small" :underline="false">删除</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm class="ele-action" title="确定消耗？" @confirm="consumption()">
              <template v-slot:reference>
                <el-button type="success" size="small" :underline="false">消耗</el-button>
              </template>
            </el-popconfirm>
          </div>
        </el-col>

      </el-row>
    </el-form>
    <h3 style="color:red">{{msgTip}}</h3>
  </div>
</template>

<script>
import {
  insertScanDef,
  delScanDef,
  spdScanConsume
} from '@/api/KSInventory/ScanDefHis';
export default {
  props: ['selection'],
  data() {
    // 默认表单数据
    const defaultWhere = {
      deptTwoName: '',
      varietie: '',
      specType: '',
      defNoPkgCode: '',
      contractCode: '',
      supplierName: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      msgTip: ''
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
    /* 导出*/
    exportData() {
      this.$emit('exportData', this.where);
    },
    /* 添加 */
    addScanDef() {
      const loading = this.$messageLoading('添加中...');
      insertScanDef(this.where)
        .then((res) => {
          document.getElementById("idDefNoPkgCode").focus();
          loading.close();
          this.msgTip = 'Tip:' + res.msgTip;
          this.search();
          this.$message.success(res.msg);
        })
        .catch((err) => {
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
    }
  }
};
</script>
