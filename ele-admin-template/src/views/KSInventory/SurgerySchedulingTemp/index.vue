<template>
  <!-- <el-card shadow="always"> -->
  <el-container>
    <el-aside width="400px" style="margin: 20px 0px 0px 20px;">
      <el-card shadow="always">
        <div slot="header" class="clearfix">
          <span>申请模板列表</span>
        </div>
        <ApplyTempTable @getCurrent="getCurrent"></ApplyTempTable>
      </el-card>
    </el-aside>
    <el-container>
      <el-main width="1000px">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>申请模板列表品种</span>
          </div>
          <el-button type="primary" size="mini" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确认申请</el-button>
          <ApplyTempDataTable :ApplyTempTableData="ApplyTempTableData" @selectionData="selectionData"></ApplyTempDataTable>
        </el-card>
      </el-main>
      <!-- <el-footer>
          <el-button type="primary" @click="addTempVar" :style="{ display: IsDisabled==true?'none':'' }">确定</el-button>
        </el-footer> -->
    </el-container>
  </el-container>
  <!-- </el-card> -->
</template>

<script>
import ApplyTempTable from './components/ApplyTempTable.vue';
import ApplyTempDataTable from './components/ApplyTempDataTable';
import { ApplyTempNaxtDayApplyPlanDel } from '@/api/KSInventory/SurgerySchedulingTemp';
export default {
  name: 'ApplyTemp',
  props: {
    IntroduceUserDefinedTempSearch: Object,
    visible: Boolean
  },
  components: {
    ApplyTempTable,
    ApplyTempDataTable
  },
  data() {
    return {
      // 主表数据
      ApplyTempTableData: {},
      // 详情表选择数据
      ApplyTempDataSelData: [],
      isUpdate: true
    };
  },
  methods: {
    getCurrent(data) {
      this.ApplyTempTableData = data;
      console.log(data);
    },
    addTempVar() {
      // console.log(this.IntroduceUserDefinedTempSearch);
      // console.log(this.ApplyTempDataSelData)
      // console.log(this.ApplyTempTableData);
      
      const loading = this.$messageLoading('添加中...');
      var data = {
        ID: this.ApplyTempTableData.ID,
        MAIN_ID: this.IntroduceUserDefinedTempSearch.ID
      };

      ApplyTempNaxtDayApplyPlanDel(data)
        .then((res) => {
          loading.close();
          this.$message.success('添加成功');
          this.$emit('ApplyTempPageChange', false);
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    selectionData(data) {
      this.ApplyTempDataSelData = data;
    },
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        if (this.data) {
          this.$util.assignObject(this.form, this.data);
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      } else {
        // this.$refs.form.clearValidate();
        this.form = { ...this.defaultForm };
      }
    }
  },
  computed: {
    IsDisabled() {
      return this.IntroduceUserDefinedTempSearch == undefined ? true : false;
    }
  }
};
</script>
