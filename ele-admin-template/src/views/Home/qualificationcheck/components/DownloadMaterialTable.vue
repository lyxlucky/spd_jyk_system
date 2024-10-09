<template lang="">
  <div class="container">
    <ele-modal
      width="70%"
      title="供应商资料下载"
      :visible="visible"
      @update:visible="updateVisible"
      @close="closeModal"
      top="5vh"
      :resizable="true"
      :maxable="true"
      :destroy-on-close="true"
    >
      <ele-pro-table
        highlight-current-row
        ref="table"
        @current-change="onCurrentChange"
        height="40vh"
        :rowClickChecked="true"
        :stripe="true"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="QualificationTopTable"
      >
        <template v-slot:toolbar>
          <DownloadMaterialTableSearch @check="checkItem" />
        </template>

        <template v-slot:TYPE="{ row }">
          <div>
            <span v-if="row.TYPE == 'COMPANY'">企业名称</span>
            <span v-if="row.TYPE == 'PEOPLE_ID'">社会统一信用代码</span>
            <span v-if="row.TYPE == 'ADDRESS'">企业地址</span>
            <span v-if="row.TYPE == 'PHONE'">企业电话</span>
            <span v-if="row.TYPE == 'BUSINESS_LICENSE_DATE'">营业执照效期</span>
            <span v-if="row.TYPE == 'RODUCTION_CLASS_1_VALID_DATE'"
              >一类的许可证经营有效期</span
            >
            <span v-if="row.TYPE == 'RODUCTION_CLASS_2_VALID_DATE'"
              >二类的许可证经营有效期</span
            >
            <span v-if="row.TYPE == 'RODUCTION_CLASS_3_VALID_DATE'"
              >三类的许可证经营有效期</span
            >
            <span v-if="row.TYPE == 'DR_VALID_DATE'"
              >体外诊断试剂经营许可证有效期</span
            >
            <span v-if="row.TYPE == 'WTS_VALID_DATE'">业务员委托书有效期</span>
            <span v-if="row.TYPE == 'YWY_NAME'">业务员姓名</span>
            <span v-if="row.TYPE == 'YWY_PEO_ID'">业务员身份证号</span>
            <span v-if="row.TYPE == 'YWY_PHONE'">业务员联系电话</span>
          </div>
        </template>

        <template v-slot:STATU="{ row }">
          <div>
            <el-tag v-if="row.STATU == 0" type="primary" size="mini"
              >新增</el-tag
            >
            <el-tag v-if="row.STATU == 1" type="success" size="mini"
              >已审核</el-tag
            >
            <el-tag v-if="row.STATU == 2" type="danger" size="mini"
              >审核不通过</el-tag
            >
            <el-tag v-if="row.STATU == 3" type="warning" size="mini"
              >资料缺失</el-tag
            >
            <el-tag v-if="row.STATU == 4" type="success" size="mini"
              >不需要提供</el-tag
            >
            <el-tag v-if="row.STATU == 5" type="danger" size="mini"
              >重新提供</el-tag
            >
          </div>
        </template>

        <template v-slot:VALUE="{ row }">
          <div>
            <span v-if="!row.PIC">{{ row.VALUE }}</span>
            <el-link
              v-else
              type="primary"
              :underline="false"
              @click="showImage(row.PIC)"
              >{{ row.VALUE }}</el-link
            >
          </div>
        </template>
      </ele-pro-table>
    </ele-modal>
  </div>
</template>
<script>
  import { BACK_BASE_URL } from '@/config/setting';
  import {
    getNewList,
    updatePushSupplierStatu,
    DownZmlSup,
    DownZmlSupJyk
  } from '@/api/Home/Qualificationcheck/index';
  import DownloadMaterialTableSearch from './DownloadMaterialTableSearch';
  export default {
    name: 'downloadMaterialTable',
    components: {
      DownloadMaterialTableSearch
    },
    props: ['visible'],
    data() {
      const defaultWhere = {
        code: ''
      };
      return {
        where: { ...defaultWhere },
        columns: [
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center'
          },
          {
            slot: 'TYPE',
            label: '类型',
            minWidth: 110,
            align: 'center'
          },
          {
            slot: 'VALUE',
            label: '值',
            minWidth: 110,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'STATU',
            label: '状态',
            minWidth: 60,
            align: 'center'
          },
          {
            prop: 'LAST_AUDITOR',
            label: '最后审核人',
            minWidth: 100,
            align: 'center'
          },
          {
            prop: 'TIME',
            label: '审核时间',
            minWidth: 100,
            align: 'center',
            formatter: (row, column, cellValue) => {
              return cellValue
                ? this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
                : '';
            }
          }
        ],
        toolbar: false,
        pageSize: 10,
        pagerCount: 2,
        pageSizes: [10, 20, 50, 100, 9999999],
        // 表格选中数据
        selection: [],
        // 当前编辑数据
        current: null,
        imageSrcPre: '/Upload/ProPic/'
      };
    },
    mounted() {
      this.$bus.$on(
        `${this.$route.path}/QualificationTopTable/downloadMaterial`,
        (val) => {
          this.where.code = val.Supplier_Code;
        }
      );
    },
    beforeDestroy() {
      this.$bus.$off(
        `${this.$route.path}/QualificationTopTable/downloadMaterial`
      );
    },
    methods: {
      datasource({ page, limit, where, order }) {
        let data = getNewList({ page, limit, where: this.where, order }).then(
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
      showImage(src) {
        let imageSrc = BACK_BASE_URL + this.imageSrcPre + src;
        this.$viewerApi({
          images: [imageSrc]
        });
      },
      onCurrentChange(row) {
        this.current = row;
      },
      updateVisible(val) {
        this.$emit('update:visible', val);
      },
      closeModal() {
        this.$emit('closeModal');
      },
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      checkItem(type) {
        if (this.selection.length == 0)
          return this.$message.error('请选择需要审核的条目');
        if (type == 1) {
          const json = this.selection.map((item) => {
            const baseObject = {
              SUPPLIER_CODE_SPD: item.SUPPLIER_CODE
            };

            const appendValue = (key, value) => {
              if (!baseObject[key]) {
                baseObject[key] = value;
              } else if (!Array.isArray(baseObject[key])) {
                baseObject[key] = [baseObject[key], value];
              } else {
                baseObject[key].push(value);
              }
            };

            if (item.TYPE == 'BUSINESS_LICENSE_DATE') {
              appendValue('BUSINESS_LICENSE_PIC', item.PIC);
            }

            if (item.TYPE == 'RODUCTION_CLASS_1_VALID_DATE') {
              appendValue('RODUCTION_CLASS_1_PIC', item.PIC);
            }

            if (item.TYPE == 'RODUCTION_CLASS_2_VALID_DATE') {
              appendValue('RODUCTION_CLASS_2_PIC', item.PIC);
            }

            if (item.TYPE == 'RODUCTION_CLASS_3_VALID_DATE') {
              appendValue('RODUCTION_CLASS_3_PIC', item.PIC);
            }

            if (item.TYPE == 'DR_VALID_DATE') {
              appendValue('DR_PIC', item.PIC);
            }

            if (item.TYPE == 'WTS_VALID_DATE') {
              appendValue('WTS_PIC', item.PIC);
            }

            return {
              ...baseObject,
              [item.TYPE]: item.VALUE
            };
          });
          DownZmlSupJyk({ json: json })
            .then((res) => {
              if (res.code != 200) return this.$message.error(res.msg);
            })
            .finally(() => {});
        }
        const ids = this.selection
          .map((item) => {
            return item.ID;
          })
          .join(',');
        updatePushSupplierStatu({ ids, type })
          .then((res) => {
            if (res.code != 200) return this.$message.error(res.msg);
            this.$message.success(res.msg);
          })
          .finally(() => {
            this.reload(this.where);
          });
      }
    }
  };
</script>
<style lang=""></style>
