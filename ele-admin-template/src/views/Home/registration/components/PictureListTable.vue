<template lang="">
  <div class="ele-body">
    <ele-pro-table
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      height="40vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="PictureListTable"
    >
      <template v-slot:toolbar>
        <!-- @denyItem="DenyReasonVisible = true" -->
        <PictureListTableSearch
          @deleteItem="deleteItem"
          @search="searchItem"
          @approveItem="approveItem"
          @dropItem="dropItem"
        />
      </template>

      <template v-slot:PIC_URL="{ row }">
        <div class="image-container" v-viewer>
          <img
            class="image"
            v-if="!row.PIC_URL.includes('pdf')"
            :src="BACK_BASE_URL + picturePrefix + row.PIC_URL"
          />
          <el-link type="primary" v-else @click="downloadPDf(row.PIC_URL)"
            >pdf文件</el-link
          >
        </div>
      </template>

      <template v-slot:STATE="{ row }">
        <el-tag v-if="row.STATE == 0" type="primary">新增</el-tag>
        <el-tag v-else-if="row.STATE == 1" type="success">已审批</el-tag>
        <el-tag v-else-if="row.STATE == 2" type="danger">审批未通过</el-tag>
      </template>

      <template v-slot:QY_STATE="{ row }">
        <el-tag v-if="row.QY_STATE == 0" type="success">使用</el-tag>
        <el-tag v-else-if="row.QY_STATE == 1" type="danger">弃用</el-tag>
      </template>
    </ele-pro-table>

    <!-- <ele-modal
      width="30%"
      height="50%"
      title="不通过原因"
      :visible.sync="DenyReasonVisible"
      position="center"
      append-to-body
    >
      <DenyReason @confirm="denyItem" @cancel="DenyReasonVisible = false"/>
    </ele-modal> -->

  </div>
</template>
<script>
  import {
    getVarPic2,
    ApproveVarPic,
    PicVarDiscardUse,
    deleteVarPic
  } from '@/api/Home/Qualificationcheck/index';
  import PictureListTableSearch from './PictureListTableSearch';
  // import DenyReason from './DenyReason';
  import { BACK_BASE_URL } from '@/config/setting';
  export default {
    name: 'pictureListTable',
    props: ['bottomTableCurrent'],
    components: {
      PictureListTableSearch,
    },
    data() {
      const defaultWhere = {
        code: this.bottomTableCurrent.PROD_REGISTRATION_CODE
      };
      return {
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'TYPE',
            label: '类型',
            minWidth: 100,
            align: 'left',
            formatter: (row, column, cellValue) => {
              if (row.TYPE == 1) {
                return '品种注册证';
              }
              if (row.TYPE == 2) {
                return '品种说明书';
              }
              if (row.TYPE == 3) {
                return '品种包装';
              }
              if (row.TYPE == 4) {
                return '品种授权书';
              }
              if (row.TYPE == 5) {
                return '厂家营业执照';
              }
              if (row.TYPE == 6) {
                return '厂家生产许可证';
              }
              return row.TYPE;
            },
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证',
            align: 'left',
            showOverflowTooltip: true
          },
          {
            slot: 'PIC_URL',
            label: '图片',
            align: 'center',
            width: 200
          },
          {
            prop: 'START_TIME',
            label: '起始时间',
            minWidth: 110,
            align: 'left',
            formatter: (row, column, cellValue) => {
              if (
                row.START_TIME == '0001-01-01T00:00:00' ||
                row.TYPE == 3 ||
                row.TYPE == 2
              ) {
                return '';
              }
              return row.START_TIME.substring(0, 10);
            },
            showOverflowTooltip: true
          },
          {
            prop: 'END_TIME',
            label: '有效期',
            minWidth: 110,
            align: 'left',
            formatter: (row, column, cellValue) => {
              if (
                row.END_TIME == '0001-01-01T00:00:00' ||
                row.TYPE == 3 ||
                row.TYPE == 2
              ) {
                return '';
              }
              return row.END_TIME.substring(0, 10);
            },
            showOverflowTooltip: true
          },
          {
            slot: 'STATE',
            label: '审核状态',
            minWidth: 110,
            align: 'center'
          },
          {
            prop: 'PASS_REASON',
            label: '未通过原因',
            minWidth: 150,
            align: 'left',
            showOverflowTooltip: true
          },
          {
            slot: 'QY_STATE',
            label: '弃用状态',
            align: 'center'
          },
          {
            prop: 'REMARK',
            label: '备注/说明',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'CREATE_TIME',
            label: '创建时间',
            align: 'left',
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(
                row.CREATE_TIME,
                'yyyy-MM-dd HH:mm:ss'
              );
            },
            showOverflowTooltip: true
          },
          {
            prop: 'APP_MAN',
            label: '审批人',
            align: 'left'
          },
          {
            prop: 'APP_TIME',
            label: '审批时间',
            align: 'left',
            formatter: (row, column, cellValue) => {
              return this.$util.toDateString(
                row.CREATE_TIME,
                'yyyy-MM-dd HH:mm:ss'
              );
            },
            showOverflowTooltip: true
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '供应商名称',
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'PROD_REGISTRATION_CODE',
            label: '注册证ID',
            align: 'center'
          }
        ],
        where: { ...defaultWhere },
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        picturePrefix: '/Upload/ProPic/',
        // DenyReasonVisible: false
      };
    },
    methods: {
      // 表格行点击事件
      onCurrentChange(row) {
        this.current = row;
      },
      datasource({ page, limit, where, order }) {
        let data = getVarPic2({
          page,
          limit,
          where,
          order,
          code: this.where.code
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      //下载pdf
      downloadPDf(url) {
        let pdfUrl = BACK_BASE_URL + this.picturePrefix + url;
        window.open(pdfUrl);
      },
      dropItem(data) {
        if (this.selection.length == 0) {
          this.$message.warning('请至少选择一条数据！');
          return;
        }
        let ids =
          this.selection
            .map((item) => {
              return item.ID;
            })
            .join(',') + ',';
        this.$confirm('是否确认弃用所选数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$messageLoading('正在处理中..');
            PicVarDiscardUse({ ids: ids })
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
                this.reload(this.where);
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消弃用'
            });
          });
      },
      denyItem(data) {
        if (this.selection.length == 0) {
          this.$message.warning('请至少选择一条数据！');
          return;
        }
        const loading = this.$messageLoading('正在处理中..');
        let ids = this.selection.map((item) => {
          return { ID: item.ID };
        });
        ApproveVarPic({ json: ids, appstate: 2, PASS_REASON: data.reason })
          .then((res) => {
            // this.DenyReasonVisible = false;
            loading.close();
            this.$message.success(res.msg);
            this.reload(this.where);
          })
          .catch((err) => {
            loading.close();
            // this.DenyReasonVisible = false;
            this.$message.error(err);
          });
      },
      approveItem(data) {
        if (this.selection.length == 0) {
          this.$message.warning('请至少选择一条数据！');
          return;
        }
        const loading = this.$messageLoading('正在处理中..');
        let ids = this.selection.map((item) => {
          return { ID: item.ID };
        });
        ApproveVarPic({ json: ids, appstate: 1 })
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.reload(this.where);
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      searchItem(data) {
        let props = {
          state: data.pictureState,
          type: data.pictureType
        };
        this.reload(props);
      },
      deleteItem(data) {
        if (this.selection.length == 0) {
          this.$message.warning('请至少选择一条数据！');
          return;
        }
        let id = this.selection
          .map((item) => {
            return item.ID;
          })
          .join(',');
        this.$confirm('是否确认删除所选数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const loading = this.$messageLoading('正在处理中..');
            deleteVarPic({ id: id })
              .then((res) => {
                loading.close();
                this.$message.success(res.msg);
                this.reload(this.where);
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err);
              });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
    },
    computed: {
      BACK_BASE_URL() {
        return BACK_BASE_URL;
      }
    }
  };
</script>
<style scoped>
  .image {
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px; /* 图片之间的间距 */
    max-width: 100%; /* 可根据需要设置最大宽度 */
  }
  .image-container {
    display: flex; /* 使用 Flexbox 布局 */
    flex-wrap: wrap; /* 允许图片换行 */
  }
</style>
