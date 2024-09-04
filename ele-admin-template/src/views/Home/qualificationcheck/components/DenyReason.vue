<template lang="">
  <div>
    <el-form ref="form" :model="where" label-width="100px">
      <el-form-item label="不通过原因">
        <el-input type="textarea" rows="5" v-model="where.reason"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size='mini' icon='el-icon-close' @click="cancel">取 消</el-button>
      <el-button size='mini' icon='el-icon-check' type="primary" @click="confirm">确 定</el-button>
    </span>
  </div>
</template>
<script>
  export default {
    name: 'DenyReason',
    data() {
      const defaultWhere = {
        reason: ''
      };
      return {
        where: { ...defaultWhere }
      };
    },
    methods: {
      cancel() {
        this.$emit('cancel', false); // 触发事件并传递值
      },
      confirm() {
        this.$emit('confirm', this.where);
      }
    },
    computed: {}
  };
</script>

<style scoped>
</style>
