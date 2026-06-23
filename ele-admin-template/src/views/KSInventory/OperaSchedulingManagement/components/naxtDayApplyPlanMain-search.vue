<!-- 搜索表单 -->
<template>
  <div class="spd-panel__body">
    <el-form
      size="mini"
      :inline="true"
      class="ele-form-search"
      @keyup.enter.native="search"
      @submit.native.prevent
    >
      <el-form-item label="申请单号">
        <el-input
          v-model="where.NAXT_DAT_PLAN_NUM"
          clearable
          placeholder="申请单号"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item label="申请人">
        <el-input
          v-model="where.CREATE_MAN"
          clearable
          placeholder="申请人"
          style="width: 110px"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="where.YY_TYPE" style="width: 90px" @change="search">
          <el-option label="全部" value="" />
          <el-option label="预约" value="0" />
          <el-option label="术中" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="where.JP_STATE" style="width: 100px" @change="search">
          <el-option label="全部" value="" />
          <el-option label="新增" value="0" />
          <el-option label="已提交" value="1" />
          <el-option label="已拣配" value="2" />
          <el-option label="已交接" value="3" />
          <el-option label="已完成" value="4" />
          <el-option label="已取消" value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item label="院区">
        <el-select v-model="where.STORAGE" style="width: 110px" @change="search">
          <el-option
            v-for="item in storageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" class="date-range-item">
        <el-date-picker
          v-model="where.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          style="width: 240px"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <br />
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="openUserEdit">创建申请单</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="openSurgicalScheduling">根据手术排期创建</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定提交申请？" @confirm="upNaxtDayApplyPlanMainByState">
          <el-button slot="reference" type="primary" :disabled="IS_disabled">提交申请</el-button>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定删除？" @confirm="removeBatch">
          <el-button slot="reference" type="danger" icon="el-icon-delete" :disabled="IS_delete">删除</el-button>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportData">打印</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-download" @click="exportData2">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <SurgicalScheduling :visible.sync="showEdit" @reload="search" />
  </div>
</template>

<script>
  import { getSTORAGE } from '@/api/KSInventory/OperaSchedulingManagement/index';
  import SurgicalScheduling from '@/views/KSInventory/OperaSchedulingManagement/components/SurgicalScheduling/index.vue';

  const createDefaultWhere = () => ({
    NAXT_DAT_PLAN_NUM: '',
    CREATE_MAN: '',
    date: [],
    YY_TYPE: '',
    STORAGE: '',
    JP_STATE: ''
  });

  export default {
    props: ['KSDepartmentalPlanData'],
    components: {
      SurgicalScheduling
    },
    data() {
      return {
        where: createDefaultWhere(),
        showEdit: false,
        IS_disabled: true,
        IS_delete: true,
        storageOptions: [{ label: '全部', value: '' }]
      };
    },
    watch: {
      KSDepartmentalPlanData() {
        this.$bus.$on('naxtDayApplyPlanDel', (data) => {
          this.IS_disabled = data.length <= 0;
        });
        if (this.KSDepartmentalPlanData?.STATE == 0) {
          this.IS_disabled = false;
          this.IS_delete = false;
        } else {
          this.IS_disabled = true;
          this.IS_delete = true;
        }
      }
    },
    created() {
      getSTORAGE().then((res) => {
        if (res?.code == 200) {
          this.storageOptions = this.storageOptions.concat(
            res?.result.map((item) => ({
              label: item.NAME,
              value: item.NAME
            }))
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    mounted() {
      const currentDate = this.$moment().add(1, 'days').format('YYYY-MM-DD');
      const threeMonthsAgo = this.$moment().subtract(3, 'months').format('YYYY-MM-DD');
      this.where.date = [threeMonthsAgo, currentDate];
    },
    methods: {
      search() {
        this.$emit('search', this.where);
      },
      reset() {
        this.where = createDefaultWhere();
        const currentDate = this.$moment().add(1, 'days').format('YYYY-MM-DD');
        const threeMonthsAgo = this.$moment().subtract(3, 'months').format('YYYY-MM-DD');
        this.where.date = [threeMonthsAgo, currentDate];
        this.search();
      },
      cancel() {
        this.$emit('cancel');
      },
      exportData() {
        this.$emit('exportData', this.where);
      },
      exportData2() {
        this.$emit('exportData2', this.where);
      },
      openUserEdit() {
        this.$emit('openUserEdit', this.where);
      },
      openSurgicalScheduling() {
        this.showEdit = true;
      },
      upNaxtDayApplyPlanMainByState() {
        this.$emit('upNaxtDayApplyPlanMainByState');
      },
      removeBatch() {
        this.$emit('removeBatch');
      }
    }
  };
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0;
}

.date-range-item :deep(.el-form-item__content) {
  max-width: none !important;
}
</style>
