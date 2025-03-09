<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" />
      <!-- 数据表格 -->
      <ele-pro-table
        ref="table"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        highlight-current-row
        @current-change="handleCurrentChange"
        cache-key="KSInventoryBasicDataTable"
      >
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>

      <div class="table_content">
        <table class="ks-source">
          <thead>
            <tr>
              <th width="180" style="font-size: 18px">操作人</th>
              <th width="180" class="ks-center" style="font-size: 18px">时间</th>
              <th width="30"></th>
              <th width="180" style="font-size: 18px">作业跟踪</th>
              <th style="font-size: 18px">详细信息</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in sourceDetailRows" :key="index">
              <td>{{ item.Operatation_Staff || '' }}</td>
              <td>{{ item.Operate_Time_String || '' }}</td>
              <td>
                <!-- 根据条件动态设置圆点颜色 -->
                <span 
                  :class="['status-dot', getDotColor(item, index)]"
                ></span>
              </td>
              <td>{{ item.jobTracking }}</td>
              <td v-html="item.Operate_Msg || ''"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import { GetPDAList, getSourceDetail } from '@/api/TraceSource/PKGSourceDetail';
import { Message } from 'element-ui';
export default {
  name: 'PKGSourceDetail',
  components: {
    UserSearch
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          prop: 'Name',
          label: '仓库名称',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'Varietie_Code',
          label: '品种编码',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 110
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号规格',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 190
        },
        {
          prop: 'Unit',
          label: '单位',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          width: 60
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 165
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 165
        },
        {
          prop: 'Batch',
          label: '生产批号',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'Batch_Validity_Period',
          label: '有效到期',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 80,
          formatter: (row) => {
            return row.Batch_Validity_Period.substr(0, 10);
          }
        },
        {
          prop: 'Coefficient',
          label: '系数',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          width: 45
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'Hospitalization_Number',
          label: '病患号',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'Serial_Number',
          label: 'UDI',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 260
        },
        {
          prop: 'Rfid_Code',
          label: 'RFID',
          sortable: true,
          align: 'center',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'Storage_Id',
          width: -2,
          minWidth: -2,
          type: 'space',
          style: 'display: none'
        }
      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 当前编辑数据
      current: null,
      sourceDetailRows: [],
      remainingRows: [],
      typeName: ['供应商送货', 'SPD中心库收货', 'SPD中心库上架散货调拨出库', 'SPD中心库上架散货调拨入库', 'SPD中心库制包', 'SPD中心库上架定数包调拨出库', 'SPD中心库上架定数包调拨出库', 'SPD中心库拣配', 'SPD中心库配送', '二级科室收货', '二级科室退货', '二级科室暂借', '二级科室归还', '二级科室使用登记（HIS）', '二级科室确认退费', '计费与消耗(采购)匹配', '二级科室PDA消耗', '逆向消耗', '定数包拆包', '结束标记', '巡回护士审批'],
      typeID: ['10', '20', '24', '25', '30', '34', '35', '40', '50', '60', '70', '80', '90', '100', '105', '110', '115', '65', '177', '120', '85']
    };
  },
  methods: {
    /* 表格数据源 */
    async datasource({ page, limit, where, order }) {
      try {
        const res = await GetPDAList({ page, limit, where, order });
        return res.result;
      } catch (error) {
        console.error('获取表格数据失败:', error);
        return [];
      }
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 处理当前行变更事件 */
    async handleCurrentChange(currentRow, oldCurrentRow) {
      if (currentRow) {
        try {
          const detail = await getSourceDetail(currentRow);
          this.createSourceDetail(detail.result);
        } catch (error) {
          console.error('获取详情数据失败:', error);
        }
      }
    },
    createSourceDetail(objs) {
      let isDone = 0;
      const processedRows = [];
      for (let i = 0; i < objs.length; i++) {
        const obj = { ...objs[i] };
        if (obj.Type_Id === '120') {
          isDone = 1;
          continue;
        }
        if (obj.Type_Id === '100') {
          obj.Operatation_Staff = "系统";
          if (obj.Operate_Msg.lastIndexOf('手术医生：')!== -1) {
            const ss1 = obj.Operate_Msg.substr(0, obj.Operate_Msg.lastIndexOf('：') + 1);
            const ss2 = obj.Operate_Msg.substr(obj.Operate_Msg.lastIndexOf('：') + 1);
            obj.Operate_Msg = `${ss1}${ss2.substr(0, 1)}<span style='filter: blur(5px);-ms-filter: blur(5px);-moz-filter: blur(5px);-webkit-filter: blur(5px); '>${ss2.substr(1)}</span>`;
          }
        }
        if (obj.Type_Id === '110') {
          obj.Operatation_Staff = "系统";
        }
        if (obj.Type_Id === '80') {
          obj.Operate_Msg = obj.Operate_Msg.replace('暂借出库', "智能设备自动识别出库");
        }
        obj.jobTracking = this.typeName[this.typeID.indexOf(obj.Type_Id)];
        processedRows.push(obj);
      }
      // 合并已处理的数据和默认数据
      const defaultRows = this.typeName.map(jobTracking => ({ jobTracking }));
      this.sourceDetailRows = defaultRows.map(defaultRow => {
        const matchedRow = processedRows.find(row => row.jobTracking === defaultRow.jobTracking);
        return matchedRow || defaultRow;
      });

      if (isDone !== 1) {
        const lastTypeID = objs[objs.length - 1].Type_Id;
        const startIndex = this.typeID.indexOf(lastTypeID) + 1;
        const remaining = [];
        for (let j = startIndex; j < this.typeID.length; j++) {
          remaining.push({
            jobTracking: this.typeName[j]
          });
        }
        this.remainingRows = remaining;
      } else {
        if (this.sourceDetailRows.length > 0) {
          const lastRow = this.sourceDetailRows[this.sourceDetailRows.length - 1];
          // 这里可以根据需要处理最后一行样式
        }
      }
    },
    // 根据条件返回圆点颜色类名
    getDotColor(item, index) {
      if (index === 0) {
        return 'status-dot-red';
      } else if (item.Operatation_Staff) {
        return 'status-dot-green';
      } else {
        return 'status-dot-gray';
      }
    }
  },
  created() {
    // 初始化表格数据，加载全部的typeName
    this.sourceDetailRows = this.typeName.map(jobTracking => ({ jobTracking }));
  }
};
</script>

<style scoped>
.table_content {
  background-color: #fff;
  min-height: 580px;
  height: auto;
}

.ks-source {
  margin-top: 10px;
  table-layout: fixed;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc; /* 为表格添加外部边框 */
  border-collapse: collapse; /* 合并相邻单元格的边框 */
}

.ks-source th,
.ks-source td {
  padding: 8px;
  text-align: center;
}

.ks-source th {
  border-bottom: 1px solid #ccc; /* 为表头添加下边框分割线 */
}



.ks-center {
  text-align: center;
}

/* 状态圆点样式 */
.status-dot {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.status-dot-red {
  background-color: red;
}

.status-dot-green {
  background-color: green;
}

.status-dot-gray {
  background-color: gray;
}

/* 让最后一列表头左对齐 */
.ks-source th:last-child {
  text-align: left;
}

/* 让最后一列单元格左对齐 */
.ks-source td:last-child {
  text-align: left;
}
</style>