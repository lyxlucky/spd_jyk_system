<template>
  <el-dialog
    title="历史合同文件"
    :visible.sync="dialogVisible"
    width="760px"
    append-to-body
    @open="loadFiles"
  >
    <el-table v-loading="loading" :data="files" size="mini" border stripe max-height="400">
      <el-table-column prop="CREATE_TIME" label="上传时间" width="170" show-overflow-tooltip>
        <template slot-scope="{ row }">{{ fmtTime(row.CREATE_TIME) }}</template>
      </el-table-column>
      <el-table-column prop="CREATE_MAN" label="上传人" width="100" show-overflow-tooltip />
      <el-table-column prop="FILE_URL" label="文件" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="{ row }">
          <el-button type="text" size="mini" @click="openFile(row)">查看</el-button>
          <el-button type="text" size="mini" class="text-danger" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getContractFiles } from '@/api/Home/Contract';
import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { htPicUrl } from '../utils';

export default {
  name: 'ContractFileHistoryDialog',
  props: {
    visible: Boolean,
    contractCode: [String, Number]
  },
  data() {
    return { loading: false, files: [] };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit('update:visible', v);
      }
    }
  },
  methods: {
    fmtTime(v) {
      if (!v) return '';
      return String(v).replace('T', ' ').substring(0, 19);
    },
    openFile(row) {
      const url = htPicUrl(row.FILE_URL);
      if (url) window.open(url);
    },
    async loadFiles() {
      if (!this.contractCode) return;
      this.loading = true;
      try {
        const res = await getContractFiles(this.contractCode);
        this.files = res.result || [];
      } catch (e) {
        this.$message.error(e.message || '加载失败');
        this.files = [];
      } finally {
        this.loading = false;
      }
    },
    async onDelete(row) {
      try {
        await this.$confirm('确认删除该合同文件记录？', '提示', { type: 'warning' });
        const token = sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
        const res = await request.post(
          '/Contract/DeleteContractFile',
          formdataify({ Token: token, ID: String(row.ID) })
        );
        if (res.data?.code == 200 || res.data?.code === '200') {
          this.$message.success(res.data.msg || '删除成功');
          this.loadFiles();
          this.$emit('changed');
        } else {
          this.$message.error(res.data?.msg || '删除失败');
        }
      } catch (e) {
        if (e !== 'cancel') this.$message.error(e.message || '删除失败');
      }
    }
  }
};
</script>

<style scoped>
.text-danger {
  color: #f56c6c;
}
</style>
