<template>
  <el-form :inline="true" size="small" class="pic-var-search" @submit.native.prevent>
    <el-form-item label="供应商">
      <el-input v-model="where.supplierName" clearable placeholder="供应商" style="width: 130px" />
    </el-form-item>
    <el-form-item label="品种">
      <el-input v-model="where.varietyKeyword" clearable placeholder="品种名/编码" style="width: 130px" />
    </el-form-item>
    <el-form-item label="注册证">
      <el-input v-model="where.approvalNumber" clearable placeholder="注册证号" style="width: 130px" />
    </el-form-item>
    <el-form-item label="生产企业">
      <el-input v-model="where.manufacturingEntName" clearable placeholder="生产企业" style="width: 130px" />
    </el-form-item>
    <el-form-item label="图片状态">
      <el-select v-model="where.state" clearable placeholder="全部" style="width: 100px">
        <el-option label="新增" value="0" />
        <el-option label="全部" value="" />
        <el-option label="已审批" value="1" />
        <el-option label="审批未通过" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="审核状态">
      <el-select v-model="where.spdSpState" clearable placeholder="全部" style="width: 110px">
        <el-option label="全部" value="" />
        <el-option label="已审核" value="1" />
        <el-option label="审核未通过" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="AI 状态">
      <el-select v-model="where.aiStatus" clearable placeholder="全部" style="width: 110px">
        <el-option v-for="opt in aiStatusOptions" :key="'ai-st-' + opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="AI 建议">
      <el-select v-model="where.aiOutcome" clearable placeholder="全部" style="width: 120px">
        <el-option v-for="opt in aiOutcomeOptions" :key="'ai-oc-' + opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="图片类型">
      <el-select v-model="where.type" clearable placeholder="全部" style="width: 120px">
        <el-option v-for="opt in typeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="高低值">
      <el-select v-model="where.varType" clearable placeholder="全部" style="width: 90px">
        <el-option label="全部" value="" />
        <el-option label="低值" value="0" />
        <el-option label="高值" value="1" />
        <el-option label="试剂" value="2" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="$emit('search', where)">查询</el-button>
      <el-button
        v-permission="'export-getVarPicDc'"
        icon="el-icon-download"
        @click="$emit('export', where)"
      >导出 Excel</el-button>
      <el-button type="primary" plain icon="el-icon-cpu" @click="$emit('aiReviewSubmit')">发起 AI 审核</el-button>
      <el-button icon="el-icon-refresh" @click="$emit('aiReviewSync')">同步 AI 状态</el-button>
      <el-button
        v-if="showSpdApprove"
        type="success"
        plain
        icon="el-icon-check"
        @click="$emit('spdApprove', 1)"
      >SPD 审核通过</el-button>
      <el-button
        v-if="showSpdApprove"
        type="danger"
        plain
        icon="el-icon-close"
        @click="$emit('spdDeny')"
      >SPD 审核不通过</el-button>
      <el-button
        v-if="showProcureApprove"
        type="success"
        icon="el-icon-check"
        @click="$emit('approve', 1)"
      >{{ approvePassLabel }}</el-button>
      <el-button
        v-if="showProcureApprove"
        type="danger"
        icon="el-icon-close"
        @click="$emit('deny')"
      >{{ approveDenyLabel }}</el-button>
      <el-button type="warning" plain icon="el-icon-remove-outline" @click="$emit('discard')">弃用</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'PicVarCodeSearch',
    props: {
      showSpdApprove: { type: Boolean, default: false },
      showProcureApprove: { type: Boolean, default: false },
      approvePassLabel: { type: String, default: '审批通过' },
      approveDenyLabel: { type: String, default: '审批不通过' }
    },
    data() {
      return {
        where: {
          supplierName: '',
          varietyKeyword: '',
          approvalNumber: '',
          manufacturingEntName: '',
          state: '0',
          spdSpState: '',
          aiStatus: '',
          aiOutcome: '',
          type: '',
          varType: ''
        },
        aiStatusOptions: [
          { value: '', label: '全部' },
          { value: 'none', label: '未发起' },
          { value: 'pending', label: '审核中' },
          { value: 'done', label: '已完成' },
          { value: 'failed', label: '审核失败' }
        ],
        aiOutcomeOptions: [
          { value: '', label: '全部' },
          { value: 'passed', label: '建议通过' },
          { value: 'manual_review', label: '建议人工复核' },
          { value: 'rejected', label: '建议驳回' }
        ],
        typeOptions: [
          { value: '', label: '全部' },
          { value: '1', label: '品种注册证' },
          { value: '2', label: '品种说明书' },
          { value: '3', label: '品种包装' },
          { value: '4', label: '品种授权书' },
          { value: '5', label: '厂家营业执照' },
          { value: '6', label: '厂家生产许可证' },
          { value: '11', label: '经营许可证' },
          { value: '12', label: '二类备案' },
          { value: '13', label: '营业执照' }
        ]
      };
    }
  };
</script>

<style scoped>
  .pic-var-search {
    flex-wrap: wrap;
  }
</style>
