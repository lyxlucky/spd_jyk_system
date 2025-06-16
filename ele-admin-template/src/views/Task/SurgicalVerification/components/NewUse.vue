<!-- <template>
  <div class="ele-box">
    <el-form size="mini" label-position="left">
      <el-form-item label="住院号">
        <el-input v-model="form.ZYHM" placeholder="请输入住院号" clearable />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.BRXM" placeholder="请输入病人姓名" clearable />
      </el-form-item>
      <el-form-item label="手术房间">
        <el-input v-model="form.SSFJ" placeholder="请输入手术房间" clearable />
      </el-form-item>
      <el-form-item label="手术台号">
        <el-input v-model="form.SSTH" placeholder="请输入手术台号" clearable />
      </el-form-item>
      <el-form-item label="病人性别">
        <el-select v-model="form.BRXB" placeholder="请选择性别" clearable>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手术名称">
        <el-input v-model="form.SSMC" placeholder="请输入手术名称" clearable />
      </el-form-item>
      <el-form-item label="手术日期">
        <el-date-picker
          v-model="form.SSRQ"
          type="date"
          placeholder="请选择手术日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="科室名称">
        <el-input v-model="form.KSMC" placeholder="请输入科室名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { addNewBdszZq } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'NewUse',
    props: {
      selection: {
        type: Array,
        default: () => []
      },
      ApplyTempTableData: {
        type: Object,
        default: () => null
      }
    },
    data() {
      return {
        form: {
          SSFJ: '', // 手术房间
          SSTH: '', // 手术台号
          ZYHM: '', // 住院号
          BRXM: '', // 病人姓名
          BRXB: '', // 病人性别
          SSMC: '', // 手术名称
          SSRQ: '', // 手术日期
          KSMC: '' // 科室名称
        }
      };
    },
    methods: {
      handleSubmit() {
        if (this.selection.length === 0) {
          this.$message.warning('请选择数据');
          return;
        }
        if (!this.ApplyTempTableData?.SSBH) {
          this.$message.warning('请先选择术间');
          return;
        }
        let loading = this.$messageLoading('新增中');
        addNewBdszZq({
          ...this.form,
          SSBH: this.ApplyTempTableData?.SSBH,
          data: this.selection
        })
          .then((res) => {
            loading.close();
            this.$message.success('新增成功');
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err.message);
          });
      }
    }
  };
</script>
<style scoped></style> -->

<template lang="">
  <div>
    <ele-pro-table
      size="mini"
      ref="table"
      highlight-current-row
      height="70vh"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="currentTableSelection"
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange"
      cache-key="NewUseCacheTableKey"
    >
      <template slot="toolbar">
        <div style='display: flex; align-items: center;'>
          <el-input
            v-model="where.SSBH"
            placeholder="请输入手术编号"
            style="width: 200px; margin-right: 10px"
            size='mini'
            clearable
          ></el-input>
          <div class="form-box">
            <div>
              <el-button size="mini" type="primary" @click="reload()"
                >搜索</el-button
              >
            </div>
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
    <el-button @click="cancel">取消</el-button>
    <el-button type="primary" @click="handleSave">保存</el-button>
  </div>
</template>
<script>
  import {
    getBdSzYyHisSs,
    addNewBdszZq
  } from '@/api/Task/SurgicalVerification';
  export default {
    name: 'NewUse',
    props: ['selection', 'ApplyTempTableData', 'visible'],
    data() {
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
          SSBH: ''
        }
      };
    },
    methods: {
      async datasource({ page, limit, where, order }) {
        //获取当前日期
        const res = await getBdSzYyHisSs({
          page,
          limit,
          where: {
            ...where,
            SSBH: this.where.SSBH,
            MZZY: '-1'
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
          this.$message.warning('请先选择术间');
          return;
        }
        if (this.current == undefined) {
          this.$message.warning('请选择数据');
          return;
        }

        if (this.current?.SSRQ == undefined || this.current?.SSRQ == null) {
          this.$message.warning('手术日期不能为空');
          return;
        }

        let loading = this.$messageLoading('新增中');
        addNewBdszZq({
          ...this.current,
          SSBH: this.ApplyTempTableData?.SSBH,
          data: this.selection
        })
          .then((res) => {
            this.$message.success('新增成功');
          })
          .catch((err) => {
            this.$message.error(err.message);
          })
          .finally(() => {
            loading.close();
            this.$emit('close', '');
          });
      }
    }
  };
</script>
<style lang=""></style>
