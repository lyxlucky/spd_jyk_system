<template lang="">
  <div>
    <ele-modal
      width="25%"
      title="定标报告上传"
      :visible="visible"
      @update:visible="updateVisible"
      :resizable="true"
      :maxable="true"
      :destroy-on-close="true"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        "
      >
        <el-upload
          :show-file-list="false"
          class="uploadDbFile"
          :data="uploadData"
          drag
          :on-success="onSuccess"
          :before-upload="beforeUpload"
          :action="uploadUrl"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
        </el-upload>
      </div>
    </ele-modal>
  </div>
</template>
<script>
import { TOKEN_STORE_NAME, } from '@/config/setting';
import { BACK_BASE_URL } from '@/config/setting';
  export default {
    name: 'KsNewBatchReminderUpload',
    props: ['visible'],
    data() {
      return {
        tableCurrent: null,
        uploadData:{
            ids: this.tableCurrent?.VARIETIE_CODE_NEW,
            deptCode:this.$store.state.user.info.DeptNow.Dept_Two_Code,
            Token: sessionStorage.getItem(TOKEN_STORE_NAME)
        },
        uploadUrl: BACK_BASE_URL + '/api/BatchReminder/confirmBatchWithPic'
      };
    },
    methods: {
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      onSuccess(response, file, fileList){
        this.updateVisible(false);
        if(response.code != 200) return this.$message.error(response.msg);
        this.$message({
          type: 'success',
          message: response.msg
        });
        this.$emit("search")
      },
      beforeUpload(file){
        this.$notify({
          title: '提示',
          message: '上传文件即定标',
          type: 'warning',
          duration: 8000
        });
      }
    },
    created(){
    },
    mounted() {
      this.$bus.$on('makeConfirmWithPic', (current) => {
        this.tableCurrent = current;
        this.uploadData.ids = `'${current.VARIETIE_CODE_NEW}'`;
      });
    },
    beforeDestroy() {
      this.$bus.$off('makeConfirmWithPic');
    }
  };
</script>
<style lang=""></style>
