<template lang="">
  <div>
    <ele-modal
      :destroy-on-close="true"
      width="90%"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="引用模板"
      @update:visible="updateVisible"
    >
      <el-container>
        <el-aside width="400px" style="margin: 20px 0px 0px 20px">
          <el-card shadow="none">
            <div slot="header" class="clearfix">
              <span>模板列表</span>
            </div>
            <QuoteTemplateLeftTable />
          </el-card>
        </el-aside>
        <el-container>
          <el-main width="1000px">
            <el-card shadow="none">
              <div slot="header" class="clearfix">
                <span>模板列表品种</span>
              </div>
               <QuoteTemplateRightTable />
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </ele-modal>
  </div>
</template>
<script>
import QuoteTemplateLeftTable from './QuoteTemplateLeftTable';
import QuoteTemplateRightTable from './QuoteTemplateRightTable';
  export default {
    name: 'QuoteTemplate',
    props: ['visible'],
    components: {
        QuoteTemplateLeftTable,
        QuoteTemplateRightTable
    },
    data() {
      return {};
    },
    methods: {
      updateVisible(val) {
        this.$emit('update:visible', val);
      }
    }
  };
</script>
<style lang=""></style>
