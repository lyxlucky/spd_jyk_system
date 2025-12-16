<template>
  <ele-modal
    title="绑定消耗"
    :visible="visible"
    width="1200px"
    @update:visible="updateVisible"
  >
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      height="500px"
    >
      <template v-slot:toolbar>
        <el-button type="primary" size="small" @click="handleConfirmBind">确认绑定</el-button>
      </template>
    </ele-pro-table>
  </ele-modal>
</template>
<script>
import { getConsumeList, bindSpdWithHdConsume } from '@/api/KSInventory/xuetouConsume'

export default {
  name: 'BindConsumeDialog',
  props: {
    visible: Boolean,
    id: String,
    operateNumber: String
  },
  data() {
    return {
      selection: [],
      columns: [
        { type: 'selection', align: 'center' },
        { prop: 'ID_CARD_NO', label: '身份证号', width: 160, align: 'center' },
        { prop: 'CHARGE_CODE', label: '计费编码', width: 120, align: 'center' },
        { prop: 'QTY', label: '数量', width: 80, align: 'center' },
        { prop: 'ORDER_NO', label: '订单号', width: 140, align: 'center' },
        { prop: 'MATERIAL_NAME', label: '物料名称', width: 140 },
        { prop: 'HIS_MATERIAL_NAME', label: 'HIS物料名称', width: 140 }
      ]
    }
  },
  computed: {
    datasource() {
      return ({ page, limit }) => {
        return getConsumeList({
          OperateNumber: this.operateNumber,
          ChargeCode: '',
          page,
          size: limit
        }).then(res => {
          return { list: res.data, count: res.total }
        }).catch(() => {
          return { list: [], count: 0 }
        })
      }
    }
  },
  methods: {
    async handleConfirmBind() {
      if (this.selection.length === 0) {
        this.$message.warning('请选择要绑定的消耗')
        return
      }

      const bindData = this.selection.map(item => ({
        ID: this.id,
        ConsumeID: item.ID
      }))

      try {
        const res = await bindSpdWithHdConsume({ BindData: bindData })
        if (res.code === 200) {
          this.$message.success('绑定成功')
          this.$emit('success')
          this.updateVisible(false)
        } else {
          this.$message.error(res.msg)
        }
      } catch (error) {
        this.$message.error('绑定失败')
      }
    },
    updateVisible(val) {
      this.$emit('update:visible', val)
    }
  }
}
</script>
