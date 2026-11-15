<template>
  <el-dialog
    title="手术变更通知历史"
    :visible="dialogVisible"
    width="85%"
    top="5vh"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleClose"
  >
    <ele-pro-table
      size="mini"
      ref="table"
      :columns="columns"
      height="60vh"
      :datasource="datasource"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :needPage="true"
      highlight-current-row
      :stripe="true"
    >
      <template v-slot:toolbar>
        <el-form :inline="true" size="mini">
          <el-form-item label="通知时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 230px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="变更类型">
            <el-select
              v-model="where.CHANGE_TYPE"
              placeholder="变更类型"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="item in changeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="微信状态">
            <el-select
              v-model="where.NOTIFY_STATE"
              placeholder="微信状态"
              clearable
              style="width: 110px"
            >
              <el-option label="待发送" value="0"></el-option>
              <el-option label="发送成功" value="1"></el-option>
              <el-option label="发送失败" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="where.KEYWORD"
              placeholder="手术编号/姓名/住院号"
              clearable
              style="width: 180px"
              @keyup.enter.native="reload"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reload"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </template>

      <template v-slot:NOTIFY_STATE="{ row }">
        <el-tag :type="stateTagType(row.NOTIFY_STATE)" size="mini">
          {{ stateText(row.NOTIFY_STATE) }}
        </el-tag>
      </template>
    </ele-pro-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getSurgeryChangeNotifyList } from '@/api/Task/OPSConsumables';

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  };

  export default {
    name: 'SurgeryChangeNotifyDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const today = formatDate(new Date());
      return {
        // 默认只看今天，与按钮上的今日通知数量保持一致
        dateRange: [today, today],
        where: {
          CHANGE_TYPE: '',
          NOTIFY_STATE: '',
          KEYWORD: ''
        },
        changeTypeOptions: [
          { value: 'SSJ', label: '换术间' },
          { value: 'HT', label: '换台' },
          { value: 'SJ', label: '改时间' },
          { value: 'MZZY', label: '门诊转住院' },
          { value: 'QT', label: '其他变更' }
        ],
        pageSize: 20,
        pageSizes: [10, 20, 50, 100],
        columns: [
          {
            prop: 'CREATE_TIME',
            label: '通知时间',
            align: 'center',
            width: 150,
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                : '';
            }
          },
          {
            prop: 'SSBH',
            label: '手术编号',
            align: 'center',
            width: 110
          },
          {
            prop: 'BRXM',
            label: '病人姓名',
            align: 'center',
            width: 90
          },
          {
            prop: 'ZYHM',
            label: '住院号',
            align: 'center',
            width: 100
          },
          {
            prop: 'CHANGE_TYPES',
            label: '变更类型',
            align: 'center',
            width: 130,
            formatter: (row, column, cellValue) => {
              return this.formatChangeTypes(cellValue);
            }
          },
          {
            prop: 'CHANGE_DESC',
            label: '变更内容',
            align: 'left',
            minWidth: 280,
            showOverflowTooltip: true
          },
          {
            prop: 'REMARK',
            label: '备注',
            align: 'left',
            minWidth: 160,
            showOverflowTooltip: true
          },
          {
            prop: 'NOTIFY_STATE',
            label: '微信状态',
            align: 'center',
            width: 100,
            slot: 'NOTIFY_STATE'
          },
          {
            prop: 'NOTIFY_MSG',
            label: '发送说明',
            align: 'center',
            minWidth: 160,
            showOverflowTooltip: true
          },
          {
            prop: 'NOTIFY_TIME',
            label: '发送时间',
            align: 'center',
            width: 150,
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                : '';
            }
          }
        ]
      };
    },
    computed: {
      dialogVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        }
      }
    },
    methods: {
      handleClose() {
        this.dialogVisible = false;
        this.$emit('close');
      },
      buildWhere() {
        return {
          CHANGE_TYPE: this.where.CHANGE_TYPE,
          NOTIFY_STATE: this.where.NOTIFY_STATE,
          KEYWORD: this.where.KEYWORD,
          START_TIME:
            this.dateRange && this.dateRange.length === 2
              ? this.dateRange[0]
              : '',
          END_TIME:
            this.dateRange && this.dateRange.length === 2
              ? this.dateRange[1]
              : ''
        };
      },
      reload() {
        this.$refs.table.reload({ page: 1 });
      },
      datasource({ page, limit }) {
        return getSurgeryChangeNotifyList({
          page,
          limit,
          where: this.buildWhere()
        })
          .then((res) => {
            return {
              list: res.data || [],
              count: res.total || 0
            };
          })
          .catch(() => {
            return {
              list: [],
              count: 0
            };
          });
      },
      formatChangeTypes(value) {
        const typeMap = {
          SSJ: '换术间',
          HT: '换台',
          SJ: '改时间',
          MZZY: '门诊转住院',
          QT: '其他变更'
        };
        return String(value || '')
          .split(',')
          .filter((item) => item)
          .map((item) => typeMap[item] || item)
          .join('、');
      },
      stateText(value) {
        const stateMap = { '0': '待发送', '1': '成功', '2': '失败' };
        return stateMap[value] || '未知';
      },
      stateTagType(value) {
        if (value === '1') return 'success';
        if (value === '2') return 'danger';
        return 'info';
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100vh - 30px);
    max-width: calc(100vw - 30px);
  }
</style>
