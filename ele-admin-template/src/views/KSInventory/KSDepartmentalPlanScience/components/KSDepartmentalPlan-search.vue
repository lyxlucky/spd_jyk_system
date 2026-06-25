<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="备注">
        <el-input
          v-model="BZ"
          clearable
          placeholder="申领单备注"
          style="width: 120px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-check" @click="CreatApplicationForm()">创建</el-button>
      </el-form-item>
      <el-form-item label="申领单">
        <el-input
          v-model="where.PlanNum"
          clearable
          placeholder="申领单号"
          style="width: 110px"
        />
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="where.Start"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="where.End"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="where.State" style="width: 110px" @change="search()">
          <el-option label="全部" value="-1" />
          <el-option label="新增" value="0" />
          <el-option label="已提交" value="1" />
          <el-option label="已审核" value="5" />
          <el-option label="已审批" value="6" />
          <el-option label="未审批" value="-6" />
          <el-option label="未收全" value="3" />
          <el-option label="已收全" value="4" />
          <el-option label="强制结束" value="10" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isBDRM" label="属性">
        <el-select v-model="where.props" style="width: 90px" @change="search()">
          <el-option label="全部" value="" />
          <el-option label="低值" value="0" />
          <el-option label="高值" value="1" />
          <el-option label="试剂" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="品种">
        <el-input
          v-model="where.SerachName"
          clearable
          placeholder="名称/规格/企业"
          style="width: 150px"
        />
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
        <el-button
          type="primary"
          icon="el-icon-s-grid"
          @click="$emit('bindBudget')"
          :disabled="!selection || selection.length === 0"
        >绑定费用项</el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <ProjectTypeDialog
      :visible="showProjectTypeDialog"
      :bz="BZ"
      @update:visible="showProjectTypeDialog = $event"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<script>
import { HOME_HP } from '@/config/setting';
import { CreatList } from '@/api/KSInventory/KSDepartmentalPlan';
import ProjectTypeDialog from './ProjectTypeDialog.vue';

const defaultWhere = () => ({
  SerachName: '',
  PlanNum: '',
  Start: '',
  End: '',
  State: '-1',
  props: '',
  isTwoApp: ''
});

export default {
  props: ['selection'],
  components: {
    ProjectTypeDialog
  },
  data() {
    return {
      where: defaultWhere(),
      BZ: '',
      showProjectTypeDialog: false
    };
  },
  computed: {
    isBDRM() {
      return this.$HOME_HP == 'bdrm';
    }
  },
  methods: {
    search() {
      this.$emit('search', this.where);
    },
    reset() {
      this.where = defaultWhere();
      this.search();
    },
    CreatApplicationForm() {
      if (this.isBDRM) {
        this.showProjectTypeDialog = true;
      } else {
        this.createApplicationDirectly();
      }
    },
    createApplicationDirectly() {
      const loading = this.$loading({ lock: true });
      CreatList({
        BZ: this.BZ,
        DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
        State: '2',
        Operater: this.$store.state.user.info.UserName
      })
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.$emit('search', this.where);
        })
        .catch((error) => {
          loading.close();
          this.$message.error(error.message || '创建失败');
        });
    },
    handleDialogConfirm(createData) {
      const loading = this.$loading({ lock: true });
      CreatList(createData)
        .then((res) => {
          loading.close();
          this.$message.success(res.msg);
          this.showProjectTypeDialog = false;
          this.$emit('search', this.where);
        })
        .catch((error) => {
          loading.close();
          this.$message.error(error.message || '创建失败');
        });
    },
    handleDialogCancel() {
      this.showProjectTypeDialog = false;
    }
  },
  mounted() {
    const currentDate = this.$moment().add(1, 'days').format('YYYY-MM-DD');
    const threeMonthsAgo = this.$moment().subtract(3, 'months').format('YYYY-MM-DD');
    this.where.Start = threeMonthsAgo;
    this.where.End = currentDate;
  }
};
</script>
