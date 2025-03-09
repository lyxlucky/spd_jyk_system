<template lang="">
  <div class="ele-body">
    <ele-pro-table
      highlight-current-row
      ref="table"
      @current-change="onCurrentChange"
      height="30vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="QualificationTopTable"
    >
      <template v-slot:Enable="{ row }">
        <el-tag v-if="row.Enable == 0" type="danger">停用</el-tag>
        <el-tag v-else type="success">启用</el-tag>
      </template>

      <template v-slot:ZML_SP_STATE="{ row }">
        <el-tag v-if="row.ZML_SP_STATE == 0" type="info">未审批</el-tag>
        <el-tag v-else-if="row.ZML_SP_STATE == 1" type="success">{{
          '已审批/' + row.ZML_SP_MAN + row.ZML_SP_TIME
        }}</el-tag>
        <el-tag v-else-if="row.ZML_SP_STATE == 2" type="danger">{{
          '审批未通过/' + row.ZML_SP_REMARK
        }}</el-tag>
      </template>

      <template v-slot:checkFile="{ row }">
        <el-button size="mini" type='success' icon='el-icon-search' @click="viewMaterialDetail(row)"
          >查看详细资料</el-button
        >
      </template>

      <template v-slot:downloadFile = "{ row }">
        <div>
          <el-button size="mini" type='primary' icon='el-icon-s-promotion' @click="downloadMaterial(row)"
          >资料查看</el-button
        >
        </div>
      </template>

      <!-- 营业执照效期 -->
      <template v-slot:Business_License_Valid_Date="{ row }">
        <el-link
          v-if="row.Business_License_Valid_Date == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            row.BUSINESS_LICENSE_PIC != '' &&
            row.BUSINESS_LICENSE_PIC != null &&
            row.Business_License_Valid_Date != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(row.BUSINESS_LICENSE_PIC)"
          >{{ row.Business_License_Valid_Date.substring(0, 10) }}</el-link
        >
        <el-link v-else>{{
          row.Business_License_Valid_Date.substring(0, 10)
        }}</el-link>
      </template>

      <!-- 一类的许可证经营有效期 -->
      <template v-slot:RODUCTION_CLASS_1_VALID_DATE="{ row }">
        <el-link
          v-if="row.RODUCTION_CLASS_1_VALID_DATE == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            row.RODUCTION_CLASS_1_PIC != '' &&
            row.RODUCTION_CLASS_1_PIC != null &&
            row.RODUCTION_CLASS_1_VALID_DATE != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(row.RODUCTION_CLASS_1_PIC)"
          >{{ row.RODUCTION_CLASS_1_VALID_DATE.substring(0, 10) }}</el-link
        >
        <el-link v-else>{{
          row.RODUCTION_CLASS_1_VALID_DATE.substring(0, 10)
        }}</el-link>
      </template>

      <!-- 二类的许可证经营有效期 -->
      <template v-slot:Roduction_class_2_Valid_Date="{ row }">
        <el-link
          v-if="row.Roduction_class_2_Valid_Date == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            row.RODUCTION_CLASS_2_PIC != '' &&
            row.RODUCTION_CLASS_2_PIC != null &&
            row.Roduction_class_2_Valid_Date != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(row.RODUCTION_CLASS_2_PIC)"
          >{{ row.Roduction_class_2_Valid_Date.substring(0, 10) }}</el-link
        >
        <el-link v-else>{{
          row.Roduction_class_2_Valid_Date.substring(0, 10)
        }}</el-link>
      </template>

      <!-- 三类的许可证经营有效期 -->
      <template v-slot:Roduction_class_3_Valid_Date="{ row }">
        <el-link
          v-if="row.Roduction_class_3_Valid_Date == '0001-01-01T00:00:00'"
        ></el-link>
        <el-link
          v-else-if="
            row.RODUCTION_CLASS_3_PIC != '' &&
            row.RODUCTION_CLASS_3_PIC != null &&
            row.Roduction_class_3_Valid_Date != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(row.RODUCTION_CLASS_3_PIC)"
          >{{ row.Roduction_class_3_Valid_Date.substring(0, 10) }}</el-link
        >
        <el-link v-else>{{
          row.Roduction_class_3_Valid_Date.substring(0, 10)
        }}</el-link>
      </template>

      <!-- 体外诊断试剂经营许可证有效期 -->
      <template v-slot:DR_VALID_DATE="{ row }">
        <el-link v-if="row.DR_VALID_DATE == '0001-01-01T00:00:00'"></el-link>
        <el-link
          v-else-if="
            row.DR_PIC != '' &&
            row.DR_PIC != null &&
            row.DR_VALID_DATE != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(row.DR_PIC)"
          >{{ row.DR_VALID_DATE.substring(0, 10) }}</el-link
        >
        <el-link v-else>{{ row.DR_VALID_DATE.substring(0, 10) }}</el-link>
      </template>

      <!-- 业务员委托书有效期 -->
      <template v-slot:WTS_VALID_DATE="{ row }">
        <el-link v-if="row.WTS_VALID_DATE == '0001-01-01T00:00:00'"></el-link>
        <el-link
          v-else-if="
            row.WTS_PIC != '' &&
            row.WTS_PIC != null &&
            row.WTS_VALID_DATE != '0001-01-01T00:00:00'
          "
          type="primary"
          @click="showImage(row.WTS_PIC)"
          >{{ row.WTS_VALID_DATE.substring(0, 10) }}</el-link
        >
        <el-link v-else>{{ row.WTS_VALID_DATE.substring(0, 10) }}</el-link>
      </template>

      <!-- Image Container for Viewer.js -->
      <!-- <div style="display: none">
        <img id="image" :src="imageSrc" />
      </div> -->

      <ele-modal
        width="50%"
        title="资料明细"
        :visible.sync="MaterialDetaildialogVisible"
        :maxable="true"
        :destroy-on-close="true"
      >
        <MaterialDetail :current="current" />
        <span slot="footer" class="dialog-footer">
          <el-button size='mini' icon='el-icon-close' @click="MaterialDetaildialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" size='mini' icon='el-icon-check' @click="MaterialDetaildialogVisible = false"
            >确 定</el-button
          >
        </span>
      </ele-modal>

      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
        <QualificationTopTableSearch @search="reload" :current = 'current' @handleQxbz="handleQxbz" ref="topTableSearch" />
      </template>

      <downloadMaterialTable :visible.sync='DownloadMaterialTableVisible' @closeModal='reload' />

    </ele-pro-table>
  </div>
</template>
<script>
  import { BACK_BASE_URL } from '@/config/setting';
  import { getSupplierList,updateQxbz } from '@/api/Home/Qualificationcheck/index';
  import downloadMaterialTable from './DownloadMaterialTable'
  import QualificationTopTableSearch from './QualificationTopTableSearch';
  import MaterialDetail from './MaterialDetail';
  export default {
    name: 'QualificationTopTable',
    components: {
      QualificationTopTableSearch,
      MaterialDetail,
      downloadMaterialTable
    },

    data() {
      return {
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center'
          },
          {
            label: '序号',
            type: 'index',
            width: 60,
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'Enable',
            slot: 'Enable',
            label: '启用状态',
            minWidth: 80,
            align: 'center'
          },
          // {
          //   prop: 'ZML_SP_STATE',
          //   slot: 'ZML_SP_STATE',
          //   label: '资料审核状态',
          //   minWidth: 90,
          //   align: 'center'
          // },
          {
            slot: 'downloadFile',
            label: '下载资料',
            minWidth: 120,
            align: 'center'
          },
          {
            prop: 'checkFile',
            slot: 'checkFile',
            label: '查看详细资料',
            minWidth: 120,
            align: 'center'
          },
          {
            prop: 'QXBZ',
            label: '缺项备注',
            minWidth: 130,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Supplier_Name',
            label: '供应商',
            minWidth: 200,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'Business_License_Valid_Date',
            slot: 'Business_License_Valid_Date',
            label: '营业执照效期',
            minWidth: 110,
            align: 'left'
          },
          {
            prop: 'RODUCTION_CLASS_1_VALID_DATE',
            slot: 'RODUCTION_CLASS_1_VALID_DATE',
            label: '一类的许可证经营有效期',
            minWidth: 110,
            align: 'left'
          },
          {
            prop: 'Roduction_class_2_Valid_Date',
            slot: 'Roduction_class_2_Valid_Date',
            label: '二类的许可证经营有效期',
            minWidth: 110,
            align: 'left'
          },
          {
            prop: 'Roduction_class_3_Valid_Date',
            slot: 'Roduction_class_3_Valid_Date',
            label: '三类的许可证经营有效期',
            minWidth: 110,
            align: 'left'
          },
          {
            prop: 'DR_VALID_DATE',
            slot: 'DR_VALID_DATE',
            label: '体外诊断试剂经营许可证有效期',
            minWidth: 110,
            align: 'left'
          },
          {
            prop: 'WTS_VALID_DATE',
            slot: 'WTS_VALID_DATE',
            label: '业务员委托书有效期',
            minWidth: 110,
            align: 'left'
          }
        ],
        toolbar: false,
        pageSize: 9999999,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        imageSrcPre: '/Upload/ProPic/',
        MaterialDetaildialogVisible: false,
        DownloadMaterialTableVisible: false
      };
    },
    methods: {
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      handleQxbz(){
        const supplierCode = this.current.Supplier_Code
        this.$prompt('请输入缺项备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '请输入缺项备注'
        }).then(({ value }) => {
          //缺项备注
          updateQxbz({id:supplierCode,qxbz:value}).then((res) => {
            if(res?.code != 200) return this.$message.error(res?.msg)
            this.$message.success(res?.msg)
            this.reload()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      datasource({ page, limit, where, order }) {
        let data = getSupplierList({ page, limit, where, order }).then(
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
      onCurrentChange(row) {
        this.current = row;
        if (row) {
          this.$bus.$emit(`${this.$route.path}/QualificationTopTable/Current`, row);
        }
      },
      // 根据传入的url展示图片
      showImage(src) {
        let imageSrc = BACK_BASE_URL + this.imageSrcPre + src;
        this.$viewerApi({
          images: [imageSrc]
        })
      },
      viewMaterialDetail(row) {
        this.MaterialDetaildialogVisible = true;
      },
      downloadMaterial(row){
        this.$bus.$emit(`${this.$route.path}/QualificationTopTable/downloadMaterial`, row);
        this.DownloadMaterialTableVisible = true
      }
    },
    beforeDestroy() {
      this.$bus.$off(`${this.$route.path}/QualificationTopTable/downloadMaterial`);
    }
  };
</script>
<style>
</style>
