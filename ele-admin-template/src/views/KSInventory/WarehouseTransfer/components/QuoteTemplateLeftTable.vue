<template lang="">
  <div>
    <ele-pro-table
      highlight-current-row
      @current-change="onCurrentChange"
      ref="table"
      height="48vh"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="QuoteTemplateLeftTableKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <el-form
          label-width="0px"
          class="ele-form-search"
          @keyup.enter.native="search"
          @submit.native.prevent
        >
          <el-row :gutter="15">
            <el-col v-bind="styleResponsive ? { lg: 12, md: 2 } : { span: 4 }">
              <el-form-item prop="TempletName">
                <el-input
                  clearable
                  size='mini'
                  v-model="where.TempletName"
                  placeholder="请输入模板名称"
                />
              </el-form-item>
            </el-col>
            <el-col v-bind="styleResponsive ? { lg: 2, md: 2 } : { span: 4 }">
              <div class="ele-form-actions">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-check"
                  class="ele-btn-icon"
                  @click="Temp_FoundPlanSingle()"
                >
                  确认创建
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <template v-slot:CommonState="{ row }">
        <el-tag v-if="row.CommonState == 0" type="success">新增</el-tag>
        <el-tag v-if="row.CommonState == 1">已提交</el-tag>
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <el-popconfirm
          class="ele-action"
          title="确定要删除此模板吗？"
          @confirm="remove(row)"
        >
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
          </template>
        </el-popconfirm>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import {
    SerachTempletList,
    DeleteTemplet,
    CreateTemplet
  } from '@/api/KSInventory/ApplyTemp';
  export default {
    name: 'QuoteTemplateLeftTable',
    data() {
      const defaultWhere = {
        SerachName: '',
        TempletName: ''
      };
      return {
        where: { ...defaultWhere },
        // 表格列配置
        columns: [
          {
            columnKey: 'index',
            type: 'index',
            width: 45,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            columnKey: 'action',
            label: '操作',
            width: 80,
            align: 'center',
            resizable: false,
            slot: 'action',
            showOverflowTooltip: true,
            fixed: 'right'
          },
          {
            prop: 'TempletName',
            label: '模板名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter(row, column, cellValue) {
              if (cellValue == null) {
                return '无';
              } else {
                return cellValue;
              }
            }
          },
          {
            prop: 'TempletCode',
            label: '模板编号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'CommonState',
            // slot: 'CommonState',
            label: '常规',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
            formatter(row, column, cellValue) {
              if (cellValue == 1) {
                return '√';
              } else {
                return '';
              }
            }
          },
          {
            prop: 'Operater',
            label: '创建人',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'CreateTime',
            label: '模板创建时间',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter(row, column, cellValue) {
              return cellValue.replace('T', ' ');
            }
          },
          {
            prop: 'LastUpDateTime',
            label: '最近更新时间',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter: (row, column, cellValue) => {
              return cellValue.replace('T', ' ');
            }
          },
          {
            prop: 'USER_ID',
            label: '是否专属',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110,
            formatter(row, column, cellValue) {
              if (cellValue != null && cellValue.length > 0) {
                return '是';
              } else {
                return '否';
              }
            }
          },
          {
            prop: 'ID',
            label: 'ID',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            show: false
          }
        ],
        toolbar: false,
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        where.UserId = this.$store.state.user.info.ID;
        let data = SerachTempletList({ page, limit, where, order }).then(
          (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
        );
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
        this.$bus.$emit('QuoteTemplateLeftTableChange', current);
      },
      /* 删除数据 */
      remove(row) {
        // const loading = this.$loading({ lock: true });
        const loading = this.$messageLoading('删除中...');
        DeleteTemplet(row)
          .then((res) => {
            this.$message.success(res.msg);
            loading.close();
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },
      Temp_FoundPlanSingle() {
        if (!this.where.TempletName) {
          this.$message.warning('请输入模板名称');
          return;
        }
        const loading = this.$messageLoading('添加中..');
        var data = {
          TempletName: this.where.TempletName,
          DeptCode: this.$store.state.user.info.DeptNow.Dept_Two_Code,
          Operater: this.$store.state.user.info.UserName
        };
        CreateTemplet(data)
          .then((res) => {
            loading.close();
            this.$message.success(res.msg);
            this.reload()
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          }).finally(() => {
            this.where.TempletName = '';
          });
      }
    },
    computed: {
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
  };
</script>
<style lang=""></style>
