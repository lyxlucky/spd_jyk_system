<template>
  <div class="ele-box">
    <ele-pro-table
      size="mini"
      ref="table"
      height="60vh"
      highlight-current-row
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
    >
      <template v-slot:toolbar>
        <el-form
          :inline="true"
          :model="where"
          size="mini"
          label-width="80px"
          class="search-form"
        >
          <el-form-item>
            <el-input
              v-model="where.SSBH"
              placeholder="请输入手术编号"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="reload()">查询</el-button>
            <el-button @click="$refs.table.reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </template>
    </ele-pro-table>
  </div>
</template>

<script>
  import { ListBdSzHisInSurgery } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'ViewHandoverRecords',
    components: {},
    props: {
      rowData: Object,
      visible: {
        type: Boolean,
        default: false
      }
    },

    watch: {
      visible: {
        handler(val) {
          if (val) {
            this.$nextTick(() => {
              this.reload();
            });
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        where: {
          SSBH: ''
        },
        // 表格列配置
        columns: [
          {
            prop: 'SURGERY_NO',
            label: '手术编号',
            align: 'center',
            width: 100
          },
          {
            prop: 'SURGERY_STATION_NO',
            label: '手术台号',
            align: 'center',
            width: 100
          },
          {
            prop: 'HOSPITAL_NO',
            label: '住院号',
            align: 'center',
            width: 100
          },
          {
            prop: 'NAME',
            label: '姓名',
            align: 'center',
            width: 120
          },
          {
            prop: 'DEF_NO_PKG_CODE',
            label: '定数包',
            align: 'center',
            width: 120
          },
          {
            prop: 'HANDOVER_PERSON',
            label: '交接人',
            align: 'center',
            width: 100
          },
          {
            prop: 'HANDOVER_TIME',
            label: '交接时间',
            align: 'center',
            width: 160,
            formatter: (row) => {
              if (row.HANDOVER_TIME) {
                return this.$moment(row.HANDOVER_TIME).format(
                  'YYYY-MM-DD HH:mm:ss'
                );
              }
              return '';
            }
          },
          {
            prop: 'HANDOVER_REMARK',
            label: '交接备注',
            align: 'center',
            minWidth: 180,
            showOverflowTooltip: true
          }
        ],
        pageSize: 10,
        pageSizes: [10, 20, 50, 100]
      };
    },
    created() {
      this.where.SSBH = this.rowData?.SSBH;
    },

    methods: {
      reload() {
        this.$refs.table.reload({ page: 1, where: this.where });
      },
      async datasource({ page, limit, where, order }) {
        where.SSBH = where?.SSBH || this.rowData?.SSBH;
        const res = await ListBdSzHisInSurgery({
          page,
          size: limit,
          where
        });
        return { list: res.data, count: res.total };
      }
    }
  };
</script>

<style scoped>
  .search-form .el-input.el-input--mini {
    width: 120px;
  }
</style>
