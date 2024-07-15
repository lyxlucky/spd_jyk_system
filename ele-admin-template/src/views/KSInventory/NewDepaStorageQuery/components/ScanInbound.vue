<template lang="">
  <div class="container">
    <ele-modal
      :destroy-on-close="true"
      width="800px"
      :centered="true"
      :visible="visible"
      :close-on-click-modal="true"
      custom-class="ele-dialog-form"
      title="扫单入库"
      @update:visible="updateVisible"
    >
      <ele-pro-table
        ref="table"
        :selection.sync="selection"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :rowClickChecked="true"
        :rowClickCheckedIntelligent="false"
        @current-change="onCurrentChange"
        cache-key="tableKey"
      >
        <template v-slot:toolbar>
          <el-form class="ele-form-search">
            <el-row :gutter="10">
              <el-col
                v-bind="styleResponsive ? { lg: 10, md: 4 } : { span: 2 }"
              >
                <el-form-item label="">
                  <el-input
                    size="mini"
                    v-model="where.name"
                    placeholder="请输入收货单号"
                    @change="submitItem()"
                    ref="input"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </ele-pro-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          icon="el-icon-close"
          @click="updateVisible(false)"
          >取 消</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-check"
          type="primary"
          @click="confirm"
          >确 定</el-button
        >
      </span>
    </ele-modal>
  </div>
</template>
<script>
  import {
    GetDistributeDetail,
    DeptReceivingScanOrder
  } from '@/api/KSInventory/NewDepaStorageQuery/index';
  export default {
    name: 'scanInbound',
    props: {
      visible: {
        type: Boolean
      }
    },
    components: {},
    data() {
      const defaultWhere = {
        name: ''
      };
      return {
        where: { ...defaultWhere },
        pageSize: 20,
        pagerCount: 2,
        pageSizes: [10, 20, 30, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        // 是否显示编辑弹窗
        columns: [
          { prop: 'Varietie_Code', label: '品种材料编码', minWidth: 120 },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            sort: true,
            minWidth: 120
          },
          { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120 },
          { prop: 'Unit', align: 'center', label: '单位', minWidth: 60 },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            minWidth: 120
          },
          { prop: 'Coefficient', label: '系数', minWidth: 60 },
          { prop: 'replenish_quantity', label: '补货数量', minWidth: 60 }
        ]
      };
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = GetDistributeDetail({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        });
        return data;
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      onCurrentChange(current) {
        this.current = current;
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      confirm() {
        DeptReceivingScanOrder(this.where)
          .then((res) => {
            this.$message.success(res.msg);
            this.updateVisible(false);
          })
          .catch((err) => {
            this.$message.error(err);
          });
      },
      submitItem() {
        if (this.where.name == '' || this.where.name == undefined) {
          this.$refs.input.focus();
          return this.$message.error('请输入收货单号');
        }
        //等reload方法执行完毕回调
        this.reload(this.where);
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    }
  };
</script>
<style lang=""></style>
