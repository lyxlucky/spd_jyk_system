<template lang="">
  <div>
    <ele-pro-table
      size="mini"
      ref="table"
      highlight-current-row
      height="60vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="currentTableSelection"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
      :initLoad="false"
      cache-key="NewUseCacheTableKey"
    >
      <template slot="toolbar">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <el-form
            label-width="0px"
            class="ele-form-search"
            @keyup.enter.native="search"
            @submit.native.prevent
            size="mini"
            :inline="true"
            style="flex: 1;"
          >
            <el-form-item class="SSRQ-form-item" style="width: 240px">
              <el-date-picker
                class="SSRQ-range"
                v-model="where.SSRQDateRange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input
                clearable
                v-model="where.condition"
                style="width: 180px"
                placeholder="请输入手术编号或住院号"
              />
            </el-form-item>
            <el-form-item>
              <el-select
                @change="search"
                v-model="where.MZZY"
                size="mini"
                placeholder=""
                style="width: 100px"
              >
                <el-option label="全部" value="ALL"></el-option>
                <el-option label="已提交" value="1"></el-option>
                <el-option label="已拣配" value="2"></el-option>
                <el-option label="已交接" value="3"></el-option>
                <el-option label="已完成" value="4"></el-option>
                <el-option label="已交接/已完成" value="-1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="where.SSFJ"
                filterable
                remote
                reserve-keyword
                placeholder="请输入术间"
                :remote-method="remoteSearch"
                :loading="loading"
                style="width: 120px"
                size="mini"
                clearable
                @focus="handleFocus"
                ref="ssfjSelect"
              >
                <el-option
                  v-for="item in ssfjOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-search"
                class="ele-btn-icon"
                @click="reload"
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
          <div style="display: flex; gap: 0px;">
            <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
            <!-- <el-button size="mini" @click="cancel">取消</el-button> -->
            
          </div>
        </div>
      </template>

      <template v-slot:STATU="{ row }">
        <el-radio
          :label="row.SSBH"
          v-model="radioSelection"
          @change.native="getCurrentRow(row)"
        >
          &nbsp;
        </el-radio>
      </template>
    </ele-pro-table>
  </div>
</template>
<script>
  import {
    getBdSzYyHisSsWithNoUse,
    addNewBdszZq
  } from '@/api/Task/SurgicalVerification';
  import { getBdszZqsjSsfjList } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'NewUse',
    props: ['selection', 'ApplyTempTableData', 'visible'],
    data() {
      // 默认表单数据
      const today = this.$moment().format("YYYY-MM-DD")
      const defaultWhere = {
        SSRQDateRange: today,
        // SSRQStartTime: new Date(),
        MZZY: '3',
        condition: '',
        SSFJ: ''
      };
      return {
        columns: [
          {
            prop: 'STATU',
            slot: 'STATU',
            label: '选择',
            align: 'center',
            width: 85,
            sortable: true
          },
          {
            prop: 'STATE',
            label: '状态',
            align: 'center',
            width: 75,
            formatter: (row, column, cellValue) => {
              switch (cellValue) {
                case '1':
                  return '新增';
                case '2':
                  return '已拣配';
                case '3':
                  return '已交接';
                case '4':
                  return '已完成';
                default:
                  return '未知状态';
              }
            }
          },
          {
            prop: 'SSFJ',
            label: '术间',
            align: 'center',
            width: 85,
            sortable: true
          },
          {
            prop: 'SSTH',
            label: '手术台号',
            align: 'center',
            width: 90
          },
          {
            prop: 'ZYHM',
            label: '住院号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 90
          },
          {
            prop: 'BRXM',
            label: '姓名',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },

          {
            prop: 'SSMC',
            label: '手术名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            label: '操作',
            width: 160,
            align: 'center',
            slot: 'ACTION'
          },
          {
            prop: 'SSRQ',
            label: '手术时间',
            align: 'center',
            showOverflowTooltip: true,
            width: 120,
            formatter: (row, column, cellValue, index) => {
              return this.$util.toDateString(cellValue, 'YYYY-MM-DD HH:mm:ss');
            }
          },
          {
            prop: 'SSBH',
            label: '手术编号',
            align: 'center',
            width: 70
          },
          {
            prop: 'KSMC',
            label: '科室',
            align: 'center',
            width: 70
          }
        ],
        pageSize: 50,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        currentTableSelection: [],
        // 当前编辑数据
        current: null,
        radioSelection: null,
        where: {
          ...defaultWhere,
          SSBH: ''
        },
        BZ: '',
        TempletName: '',
        loading: false,
        ssfjOptions: [],
        searchTimer: null,
        rules: {
          TempletName: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入模板名称'
            }
          ]
        }
      };
    },
    methods: {
      async datasource({ page, limit, where, order }) {
        //获取当前日期
        const res = await getBdSzYyHisSsWithNoUse({
          page,
          limit,
          where: {
            ...where,
            SSBH: this.where.SSBH
          },
          order
        });
        return { list: res.data, count: res.total };
      },
      onSelectionChange(selection) {
        this.currentTableSelection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
      },
      getCurrentRow(row) {
        this.radioSelection = row.SSBH;
      },
      updateVisible(value) {
        this.$emit('update:visible', value);
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: this.where });
      },
      handleSave() {
        if (this.selection.length === 0) {
          this.$message.warning('请选择数据');
          return;
        }
        if (!this.ApplyTempTableData?.SSBH) {
          this.$message.warning('请先选择原手术编号');
          return;
        }
        if (this.current == undefined) {
          this.$message.warning('请选择数据');
          return;
        }

        let loading = this.$messageLoading('新增中');
        addNewBdszZq({
          ...this.current,
          SSBH: this.ApplyTempTableData?.SSBH,
          TG_SSBH: this.current.SSBH,
          data: this.selection
        })
          .then((res) => {
            this.$message.success(res.msg || '新增成功');
          })
          .catch((err) => {
            this.$message.error(err?.msg || '新增失败');
          })
          .finally(() => {
            loading.close();
            this.$emit('close', '');
          });
      },
      remoteSearch(query) {
        if (this.searchTimer) {
          clearTimeout(this.searchTimer);
        }

        this.loading = true;
        this.searchTimer = setTimeout(() => {
          getBdszZqsjSsfjList({ SSFJ: query })
            .then((res) => {
              this.ssfjOptions = res.data || [];
            })
            .catch((err) => {
              this.$message.error(err.msg || '获取术间列表失败');
              this.ssfjOptions = [];
            })
            .finally(() => {
              this.loading = false;
            });
        }, 300); // 300ms 的节流时间
      }
    },
    computed: {
      // 是否开启响应式布局
      styleResponsive() {
        return this.$store.state.theme.styleResponsive;
      }
    },
    mounted() {
      this.reload({ where: this.defaultWhere });
    },
  };
</script>
<style lang=""></style>
