<!-- 搜索表单 -->
<template>
  <el-form
    label-width="0px"
    size="mini"
    :inline="true"
    class="ele-form-search apply-temp-search"
    @keyup.enter.native="search"
    @submit.native.prevent
  >
    <el-form-item>
      <el-input
        clearable
        v-model="where.REQUESTNOTEID"
        placeholder="申请单号"
      />
    </el-form-item>
    <el-form-item>
      <el-select v-model="where.YB_SP_STATE" placeholder="审批状态" @change="search()">
        <el-option label="全部" value=""></el-option>
        <el-option label="已审批" value="1"></el-option>
        <el-option label="未审批" value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="ele-btn-icon"
        @click="search"
      >
        查询
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="ele-btn-icon"
        icon="el-icon-download"
        @click="exportData"
      >
        导出
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="ele-btn-icon"
        @click="openEdit"
      >
        审批
      </el-button>
    </el-form-item>
    <el-dialog
      title="导入模板品种"
      :visible.sync="dialogTableVisible2"
      width="30%"
    >
      <div style="width: 100%; text-align: center">
        <form action="" id="CreateBydFpform">
          <input
            type="text"
            size="mini"
            style="display: none"
            name="TEMPLET_MAIN_ID"
            autocomplete="off"
            placeholder=""
            :value="TEMPLET_MAIN_ID"
          />
          <input
            type="text"
            size="mini"
            style="display: none"
            name="Token"
            autocomplete="off"
            placeholder=""
            :value="Token"
          />
          <div class="layui-form-item">
            <label style="width: 170px">选择文件:</label>
            <input
              id="FILE"
              size="mini"
              style="
                height: 30px;
                width: 200px;
                display: inline;
                margin-left: 5px;
              "
              name="FILE"
              type="file"
              value=""
              required="required"
              autocomplete="off"
            />
          </div>
        </form>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-check"
          @click="importFile"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </el-form>
</template>

<script>
  import { ImportSpdMainsjLinesIfaceExcel } from '@/api/Home/masterBaseData';
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
        APPLYPEOPLE: '',
        YB_SP_STATE: ''
      };
      return {
        // 表单数据
        Token: '', //注意这里，不知道是什么，避免报错添加的。
        TEMPLET_MAIN_ID: '', //注意这里，不知道是什么，避免报错添加的。

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
      openEdit() {
        this.$emit('openEdit');
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

<style scoped>
.apply-temp-search {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-bottom: 0;
}

.apply-temp-search :deep(.el-form-item) {
  margin: 0;
}

.apply-temp-search :deep(.el-input),
.apply-temp-search :deep(.el-select) {
  width: 150px;
}

</style>
