<template lang="">
  <div>
    <ele-modal
      width="50%"
      height="60%"
      title="管理或关联UDI码"
      :visible="visible"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @update:visible="updateVisible"
      @closed="onClose"
      @opened="
        () => {
          this.datasource.push({
            UDI_Code: this.UdiListTableDatasource.list[0].Serial_Number
          });
        }
      "
    >
      <div class="inlineContainer">
        <div class="leftContent">
          <el-descriptions :column="1" size="mini" border>
            <el-descriptions-item>
              <template slot="label"> 品种全称： </template>
              {{ inlineParentTableCurrent?.Varietie_Name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 型号/规格： </template>
              {{ inlineParentTableCurrent?.Specification_Or_Type }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 单位： </template>
              {{ inlineParentTableCurrent?.Unit }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 生产企业： </template>
              {{ inlineParentTableCurrent?.Manufacturing_Ent_Name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label"> 供应商名称： </template>
              {{ inlineParentTableCurrent?.Supplier_Name }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label"> 生产批号： </template>
              {{ inlineParentTableCurrent?.Batch }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label"> 有效到期： </template>
              {{ inlineParentTableCurrent?.Batch_Validity_Period }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label"> 消耗数量： </template>
              {{ inlineParentTableCurrent?.Consume_Count }}
            </el-descriptions-item>
          </el-descriptions>

          <el-input
            style="margin-top: 10px"
            size="mini"
            placeholder="请输入或扫描UDI"
            v-model="where.udi"
          >
            <template slot="append">
              <el-button size="mini" type="primary" @click="handleAddUdi"
                >添加</el-button
              >
            </template>
          </el-input>
        </div>
        <div class="rightContent">
          <ele-pro-table
            height="250"
            :toolkit="[]"
            highlight-current-row
            ref="table"
            :needPage="false"
            :columns="columns"
            :datasource="datasource"
            cache-key="UdiLinkDetailTableCacheKey"
          >
            <template v-slot:ACTION="{ row }">
              <el-button size="mini" type="danger" @click="handleDelete(row)"
                >删除</el-button
              >
            </template>
          </ele-pro-table>
        </div>
      </div>
      <template v-slot:footer>
        <el-button size="mini" @click="updateVisible(false)">取消</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </template>
    </ele-modal>
  </div>
</template>
<script>
  import { ModifyGS1 } from '@/api/HeelBlockConsumables/PlatformConsume';
  export default {
    name: 'UdiLinkDetail',
    props: ['visible', 'GrandParentTableCurrent', 'UdiListTableDatasource'],
    data() {
      const defaultWhere = {
        udi: ''
      };
      return {
        where: { ...defaultWhere },
        datasource: [],
        columns: [
          {
            label: '序号',
            columnKey: 'index',
            type: 'index',
            width: 60,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            label: 'UDI码',
            prop: 'UDI_Code',
            width: 200
          },
          {
            label: '操作',
            prop: 'ACTION',
            slot: 'ACTION',
            width: 200
          }
        ]
      };
    },
    methods: {
      onClose() {
        this.datasource = [];
      },
      handleDelete(row) {
        this.datasource = this.datasource.filter(
          (item) => item.UDI_Code != row.UDI_Code
        );
      },
      handleAddUdi() {
        const item = {
          UDI_Code: this.where.udi
        };
        if (this.datasource.length > 0) {
          this.$message.error('只能添加一个UDI码');
          return;
        }
        if (this.where.udi.trim() == '') {
          this.$message.error('请输入或扫描UDI');
          return;
        }
        this.datasource.push(item);
        this.where.udi = '';
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      save() {
        const loading = this.$messageLoading('处理中...');
        ModifyGS1({
          batchId: this.GrandParentTableCurrent.Id,
          json: JSON.stringify([this.datasource[0].UDI_Code])
        })
          .then((res) => {
            this.$message.success(res?.msg);
          })
          .finally(() => {
            loading.close();
            this.updateVisible(false);
            this.$emit('reload');
          });
      }
    },
    computed: {
      inlineParentTableCurrent() {
        return this.GrandParentTableCurrent;
      }
    },
    created() {}
  };
</script>
<style scoped>
  .inlineContainer {
    display: flex;
    justify-content: space-between;
  }
</style>
