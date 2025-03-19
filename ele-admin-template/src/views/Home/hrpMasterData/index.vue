<template>
  <div class="ele-body">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>主数据1</span>
          </div>
          <ele-pro-table size="mini" 
            ref="table" height="550px" 
            :columns="columns1"
            highlight-current-row
            :datasource="datasource1" 
            :paging="false" ></ele-pro-table>
        </el-card>
        
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>主数据2</span>
          </div>
          <ele-pro-table size="mini" 
            ref="table2" height="550px" 
            :columns="columns2"
            highlight-current-row
            :datasource="datasource2" 
            :paging="false" ></ele-pro-table>
        </el-card>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import {getOAMainsHeaderIface,getOAMainsLinesIface} from '@/api/Home/hrpMasterData'
export default {
  data() {
    return {
        columns1: [
            {
              label: '接口ID',
              prop: 'HEADER_IFACE_ID',
              align: 'center',
              minWidth: 120
            },
            {
              label: '处理状态',
              prop: 'PROCESS_STATUS',
              align: 'center',
              minWidth: 100
            },
            {
              label: '错误信息',
              prop: 'ERROR_MSG',
              align: 'center',
              minWidth: 150
            },
            {
              label: '组织ID',
              prop: 'ORGANIZATION_ID',
              align: 'center',
              minWidth: 100
            },
            {
              label: '紧急程度',
              prop: 'URGENT_LEVEL',
              align: 'center',
              minWidth: 100
            },
            {
              label: '文档类型ID',
              prop: 'DOC_TYPE_ID',
              align: 'center',
              minWidth: 120
            },
            {
              label: '来源代码',
              prop: 'SOURCE_CODE',
              align: 'center',
              minWidth: 100
            },
            {
              label: '文档编号',
              prop: 'DOC_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '申请员工编号',
              prop: 'APPLY_EMPLOYEE_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '申请组织ID',
              prop: 'APPLY_ORGANIZATION_ID',
              align: 'center',
              minWidth: 120
            },
            {
              label: '申请日期',
              prop: 'APPLY_DATE',
              align: 'center',
              minWidth: 120
            },
            {
              label: '来源子库存',
              prop: 'SUB_INVENTORY_FROM',
              align: 'center',
              minWidth: 120
            },
            {
              label: '目标子库存',
              prop: 'SUB_INVENTORY_TO',
              align: 'center',
              minWidth: 120
            },
            {
              label: '病区',
              prop: 'WARD_AREA',
              align: 'center',
              minWidth: 100
            },
            {
              label: '维护订单',
              prop: 'MAINTAIN_ORDER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '项目编号',
              prop: 'PROJECT_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '备注',
              prop: 'COMMENTS',
              align: 'center',
              minWidth: 150
            },
            {
              label: '对象版本号',
              prop: 'OBJECT_VERSION_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '创建日期',
              prop: 'CREATION_DATE',
              align: 'center',
              minWidth: 120
            },
            {
              label: '创建人',
              prop: 'CREATED_BY',
              align: 'center',
              minWidth: 100
            },
            {
              label: '最后更新人',
              prop: 'LAST_UPDATED_BY',
              align: 'center',
              minWidth: 120
            },
            {
              label: '最后更新日期',
              prop: 'LAST_UPDATE_DATE',
              align: 'center',
              minWidth: 120
            },
            {
              label: '最后登录更新',
              prop: 'LAST_UPDATE_LOGIN',
              align: 'center',
              minWidth: 120
            },
            {
              label: '文档状态',
              prop: 'DOC_STATUS',
              align: 'center',
              minWidth: 100
            },
            {
              label: '审批员工编号',
              prop: 'APPROVAL_EMPLOYEE_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '审批日期',
              prop: 'APPROVAL_DATE',
              align: 'center',
              minWidth: 120
            }
        ],
        columns2: [
            {
              label: 'ID',
              prop: 'ID',
              align: 'center',
              minWidth: 100
            },
            {
              label: '行接口ID',
              prop: 'LINE_IFACE_ID',
              align: 'center',
              minWidth: 120
            },
            {
              label: '组织ID',
              prop: 'ORGANIZATION_ID',
              align: 'center',
              minWidth: 100
            },
            {
              label: '头接口ID',
              prop: 'HEADER_IFACE_ID',
              align: 'center',
              minWidth: 120
            },
            {
              label: '处理状态',
              prop: 'PROCESS_STATUS',
              align: 'center',
              minWidth: 100
            },
            {
              label: '错误信息',
              prop: 'ERROR_MSG',
              align: 'center',
              minWidth: 150
            },
            {
              label: '行号',
              prop: 'LINE_NUMBER',
              align: 'center',
              minWidth: 80
            },
            {
              label: '物料编号',
              prop: 'ITME_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '来源子库存',
              prop: 'SUB_INVENTORY_FROM',
              align: 'center',
              minWidth: 120
            },
            {
              label: '目标子库存',
              prop: 'SUB_INVENTORY_TO',
              align: 'center',
              minWidth: 120
            },
            {
              label: '数量',
              prop: 'QUANTITY',
              align: 'center',
              minWidth: 80
            },
            {
              label: '单位',
              prop: 'UOM',
              align: 'center',
              minWidth: 80
            },
            {
              label: '需求日期',
              prop: 'NEED_DATE',
              align: 'center',
              minWidth: 120
            },
            {
              label: '项目编号',
              prop: 'PROJECT_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '对象版本号',
              prop: 'OBJECT_VERSION_NUMBER',
              align: 'center',
              minWidth: 120
            },
            {
              label: '创建日期',
              prop: 'CREATION_DATE',
              align: 'center',
              minWidth: 120
            },
            {
              label: '创建人',
              prop: 'CREATED_BY',
              align: 'center',
              minWidth: 100
            },
            {
              label: '最后更新人',
              prop: 'LAST_UPDATED_BY',
              align: 'center',
              minWidth: 120
            },
            {
              label: '最后更新日期',
              prop: 'LAST_UPDATE_DAT',
              align: 'center',
              minWidth: 120
            },
            {
              label: '最后登录更新',
              prop: 'LAST_UPDATE_LOGIN',
              align: 'center',
              minWidth: 120
            },
            {
              label: '行状态',
              prop: 'LINE_STATUS',
              align: 'center',
              minWidth: 100
            }
        ]
    };
  },
  created() {
    
  },
  methods: {
    handleRowClick(row) {
      // 处理行点击事件
    },
    datasource1({ page, limit, sort, where }) {
      // 实现数据源方法
      return getOAMainsHeaderIface({}).then(res => {
        
        return {
            list:res.data,
            total:res.count
        }
      }).catch(err=>{
        return {
            list:[],
            total:0
        }
      })
    },
    datasource2({ page, limit, sort, where }) {
      // 实现数据源方法
      return getOAMainsLinesIface({}).then(res => {
        console.log(res)
        return {
            list:res.data,
            total:res.count
        }
      }).catch(err=>{
        return {
            list:[],
            total:0
        }
      })
    }
  }
};
</script>

<style scoped>

</style>