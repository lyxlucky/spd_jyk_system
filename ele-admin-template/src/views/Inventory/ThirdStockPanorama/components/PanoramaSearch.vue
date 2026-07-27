<template>
  <section class="panorama-search spd-panel spd-panel--search">
    <div class="spd-panel__head panorama-search__head">
      <span>查询条件</span>
      <el-radio-group v-model="modeSync" size="mini" aria-label="查询维度">
        <el-radio-button label="department">按科室看品种</el-radio-button>
        <el-radio-button label="material">按品种看科室</el-radio-button>
      </el-radio-group>
    </div>
    <div class="spd-panel__body">
      <el-form
        :model="form"
        :inline="true"
        size="mini"
        @submit.native.prevent="$emit('search')"
      >
        <el-form-item label="科室">
          <el-input
            v-model="form.DeptName"
            clearable
            placeholder="科室名称"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="品种">
          <el-input
            v-model="form.varName"
            clearable
            placeholder="品种名称"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="品种编码">
          <el-input
            v-model="form.varCode"
            clearable
            placeholder="品种编码"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="计费编码">
          <el-input
            v-model="form.chargingCode"
            clearable
            placeholder="计费编码"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input
            v-model="form.spec"
            clearable
            placeholder="规格型号"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="生产企业">
          <el-input
            v-model="form.manufacter"
            clearable
            placeholder="生产企业"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="批准文号">
          <el-input
            v-model="form.prodRegistrationCode"
            clearable
            placeholder="批准文号"
            @keyup.enter.native="$emit('search')"
          />
        </el-form-item>
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="statDateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item class="panorama-search__actions">
          <el-button type="primary" icon="el-icon-search" :loading="loading" @click="$emit('search')">
            查询
          </el-button>
          <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
  function createForm() {
    return {
      DeptName: '',
      varCode: '',
      varName: '',
      chargingCode: '',
      spec: '',
      manufacter: '',
      prodRegistrationCode: '',
      startTime: '2024-03-01',
      endTime: ''
    };
  }

  export default {
    name: 'PanoramaSearch',
    props: {
      queryMode: { type: String, default: 'department' },
      loading: Boolean
    },
    data() {
      return { form: createForm() };
    },
    computed: {
      modeSync: {
        get() {
          return this.queryMode;
        },
        set(value) {
          this.$emit('mode-change', value);
        }
      },
      statDateRange: {
        get() {
          return [this.form.startTime, this.form.endTime];
        },
        set(value) {
          this.form.startTime = value?.[0] || '';
          this.form.endTime = value?.[1] || '';
        }
      }
    }, 
    methods: {
      getWhere() {
        return { ...this.form };
      },
      reset() {
        this.form = createForm();
        this.$emit('reset');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .panorama-search__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .panorama-search__actions {
    margin-right: 0;
  }

  :deep(.el-input--mini .el-input__inner),
  :deep(.el-select .el-input__inner) {
    width: 132px;
  }

  @media screen and (max-width: 900px) {
    .panorama-search__head {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
