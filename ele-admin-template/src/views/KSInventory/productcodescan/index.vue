<template lang="">
  <div>
    <el-container>
      <el-header height="350">
        <el-card shadow="always">
          <ele-pro-table
            :key="key"
            highlight-current-row
            ref="table"
            :height="defaultHeight"
            :rowClickChecked="true"
            :stripe="true"
            :pageSize="pageSize"
            :pageSizes="pageSizes"
            :columns="columns"
            :datasource="datasource"
            :selection.sync="selection"
            cache-key="productScanTable"
          >
            <!-- 表头工具栏 -->
            <template v-slot:toolbar>
              <div>
                <el-form
                  label-width="77px"
                  class="ele-form-search"
                  @keyup.enter.native="search"
                  @submit.native.prevent
                >
                  <el-row :gutter="10">
                    <el-col
                      style="padding-left: 0px"
                      v-bind="styleResponsive ? { lg: 4, md: 4 } : { span: 4 }"
                    >
                      <div class="block">
                        <el-input size="small" placeholder="请输入产品UDI">
                        </el-input>
                      </div>
                    </el-col>
                    <el-col
                      v-bind="styleResponsive ? { lg: 10, md: 4 } : { span: 4 }"
                    >
                      <div class="ele-form-actions">
                        <el-button
                          size="small"
                          type="primary"
                          @click="search"
                        >
                          扫码/赋码
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </template>
</ele-pro-table>
</el-card>
</el-header>
</el-container>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 表格列配置
            columns: [
                {
                    columnKey: 'index',
                    label: '序号',
                    type: 'index',
                    width: 50,
                    align: 'center',
                    showOverflowTooltip: true,
                    fixed: 'left'
                },
                {
                    prop: 'HOSPITAL_PRODUCT_ID',
                    label: '院内品名',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'HOSPITAL_PLATFORM',
                    label: '院内规格',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'HOSPITAL_PROD_FACTORY',
                    label: '院内厂商',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'TRANSPORT_NUM',
                    label: '配送数',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'TRANSPORT_NUM_VERIFY',
                    label: '验收通过数',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'UNIT',
                    label: '单位',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'BATCH',
                    label: '批号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'REGISTER_NUM',
                    label: '注册证号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'PRODUCT_NAME',
                    label: '产品名称',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'SPECIFICATION',
                    label: '规格',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
            ],
        };
    },
    methods: {
        datasource({ page, limit, where, order }) {
            let data = {
                "code": "200",
                "msg": "查询完成",
                "total": 31,
                "result": [
                    {
                        "HOSPITAL_PRODUCT_ID": "髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头",
                        "HOSPITAL_PLATFORM": "00-8775-032-02 DELTA CERAMIC FEM HEAD 0X32",
                        "HOSPITAL_PROD_FACTORY": "捷迈（上海）医疗国际贸易有限公司",
                        "TRANSPORT_NUM": "100",
                        "TRANSPORT_NUM_VERIFY": "100",
                        "UNIT": "个",
                        "BATCH": 2869847,
                        "REGISTER_NUM": "国械注进20143135650",
                        "PRODUCT_NAME": "髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头",
                        "SPECIFICATION": "00-8775-032-02 DELTA CERAMIC FEM HEAD 0X32",
                    },
                    {
                        "HOSPITAL_PRODUCT_ID": "髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头",
                        "HOSPITAL_PLATFORM": "00-8775-032-02 DELTA CERAMIC FEM HEAD 0X32",
                        "HOSPITAL_PROD_FACTORY": "捷迈（上海）医疗国际贸易有限公司",
                        "TRANSPORT_NUM": "100",
                        "TRANSPORT_NUM_VERIFY": "100",
                        "UNIT": "个",
                        "BATCH": 2869847,
                        "REGISTER_NUM": "国械注进20143135650",
                        "PRODUCT_NAME": "髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头",
                        "SPECIFICATION": "00-8775-032-02 DELTA CERAMIC FEM HEAD 0X32",
                    },
                ]
            }
            let back = JSON.parse(JSON.stringify(data));
            let table = {
                count: back.total,
                list: back.result
            };
            return table;
        },
        /* 刷新表格 */
        reload(where) {
            this.$refs.table.reload({ page: 1, where: where });
        },
    }
};
</script>

<style></style>
