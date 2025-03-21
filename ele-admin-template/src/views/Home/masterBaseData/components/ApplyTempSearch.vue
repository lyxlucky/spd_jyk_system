<!-- 搜索表单 -->
<template>
  <el-form label-width="0px" class="ele-form-search" @keyup.enter.native="search" @submit.native.prevent>
    <el-row :gutter="5">
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.REQUESTNOTEID" placeholder="申请单号" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.APPLYDEPT" placeholder="申请部门" />
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 7, md: 12 } : { span: 12 }">
        <el-input size="mini" clearable v-model="where.APPLYPEOPLE" placeholder="经办人" />
      </el-col>
    </el-row>
    <el-row :gutter="5" style="margin-top:5px">
      <el-col v-bind="styleResponsive ? { lg: 6, md: 12 } : { span: 12 }">
        <el-select size="mini" v-model="where.PROCESS_STATUS" @change="search()">
          <el-option label="全部" value=""></el-option>
          <el-option label="已传入中间表" value="N"></el-option>
          <el-option label="已传入SPD" value="S"></el-option>
          <el-option label="已接收收费编码" value="Y"></el-option>
          <el-option label="传入SPD失败" value="E"></el-option>
        </el-select>
      </el-col>
      <el-col v-bind="styleResponsive ? { lg: 15, md: 12 } : { span: 12 }">
        <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="search">
          查询
        </el-button>
        <el-button size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
        <!-- <el-button size="mini" type="primary" class="ele-btn-icon" @click="search">
          编辑
        </el-button> -->
        <!-- <el-button size="mini" type="primary" class="ele-btn-icon" @click="showDialogTableVisible2">
          导入
        </el-button> -->
        <el-button size="mini" type="primary" class="ele-btn-icon" icon="el-icon-download" @click="exportData">
          导出
        </el-button>
      </el-col>
    </el-row>
    <el-dialog title="导入模板品种" :visible.sync="dialogTableVisible2" width="30%">
      <div style="width: 100%; text-align: center">
        <form action="" id="CreateBydFpform">
          <input type="text" size="mini" style="display: none" name="TEMPLET_MAIN_ID" autocomplete="off" placeholder="" :value="TEMPLET_MAIN_ID" />
          <input type="text" size="mini" style="display: none" name="Token" autocomplete="off" placeholder="" :value="Token" />

          <div class="layui-form-item">
            <label style="width: 170px">选择文件:</label>
            <input id="FILE" size="mini" style="
                height: 30px;
                width: 200px;
                display: inline;
                margin-left: 5px;
              " name="FILE" type="file" value="" required="required" autocomplete="off" />
          </div>
        </form>
        <el-button type="primary" size="mini" icon="el-icon-check" @click="importFile">确定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
import {
  ImportSpdMainsjLinesIfaceExcel
} from '@/api/Home/masterBaseData';
export default {
  props: {
    // 修改回显的数据
    rowData: Object
  },
  data() {
    // 默认表单数据
    const defaultWhere = {
      PROCESS_STATUS: '',
      REQUESTNOTEID: '',
      APPLYDEPT: '',
      APPLYPEOPLE: ''
    };
    return {
      // 表单数据
      where: { ...defaultWhere },
      dialogTableVisible2: false
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
    exportData() {
      this.$emit('exportData', this.where);
    },
    showDialogTableVisible2() {
      this.dialogTableVisible2 = true;
    },
    importFile() {
      // console.log(this.PlanNum);
      // if (this.PlanNum.length <= 0) {
      //   this.$message.warning('请先选择计划单号');
      //   return;
      // }
      const loading = this.$messageLoading('导入中...');
      var formData = new FormData(document.getElementById('CreateBydFpform'));
      ImportSpdMainsjLinesIfaceExcel(formData)
        .then((res) => {
          loading.close();
          this.dialogTableVisible2 = false;
          this.$message.success(res.msg);
          this.$emit('search', this.where);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    }
  },
  created() {}
};
</script>
