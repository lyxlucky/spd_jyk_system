<template>
    <div>
        <div>
            <el-container>
                <el-header height="350">
                    <el-card shadow="always">
                        <el-descriptions class="margin-top" title="基本信息" border>
                            <el-descriptions-item>
                                <template slot="label">
                                    医院
                                </template>
                                北京大学深圳医院
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template slot="label">
                                    产品名称
                                </template>
                                髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template slot="label">
                                    注册证类型
                                </template>
                                Ⅲ类
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template slot="label">
                                    规格
                                </template>
                                个
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template slot="label">
                                    型号
                                </template>
                                00-8775-032-02 DELTA CERAMIC FEM HEAD 0X32
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template slot="label">
                                    注册证编号
                                </template>
                                国械注进20143135650
                            </el-descriptions-item>
                            <el-descriptions-item>
                                <template slot="label">
                                    产品类型
                                </template>
                                医用耗材
                            </el-descriptions-item>

                            <el-descriptions-item>
                                <template slot="label">
                                    品牌
                                </template>
                                无
                            </el-descriptions-item>

                            <el-descriptions-item>
                                <template slot="label">
                                    生产厂家
                                </template>
                                捷迈（上海）医疗国际贸易有限公司
                            </el-descriptions-item>

                            <el-descriptions-item>
                                <template slot="label">
                                    医保耗材编码
                                </template>
                                C0344051070500007551
                            </el-descriptions-item>
                        </el-descriptions>

                        <el-descriptions class="margin-top" style="margin-top: 20px;" direction="vertical"
                            title="新增产品识别码" border>
                            <el-descriptions-item>
                                <template slot="label">
                                    产品识别码类型：
                                </template>
                                <el-select v-model="value" placeholder="请选择">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-descriptions-item>

                            <el-descriptions-item>
                                <template slot="label">
                                    扫描条码
                                </template>
                                <el-input></el-input>
                            </el-descriptions-item>

                            <el-descriptions-item>
                                <template slot="label">
                                    解析后的主码/条形码
                                </template>
                                <el-input style="width:300px"></el-input>
                                <el-button type="primary" style="margin-left: 20px;">保存条码</el-button>
                            </el-descriptions-item>

                            <el-descriptions-item>
                                <template slot="label">
                                    生产标识包含
                                </template>
                                <el-checkbox-group v-model="checkList">
                                    <el-checkbox label="UDI主码"></el-checkbox>
                                    <el-checkbox label="批号"></el-checkbox>
                                    <el-checkbox label="生产效期"></el-checkbox>
                                    <el-checkbox label="有效期"></el-checkbox>
                                    <el-checkbox label="序列号"></el-checkbox>
                                </el-checkbox-group>
                            </el-descriptions-item>
                        </el-descriptions>




                        <el-descriptions class="margin-top" :column="1" style="margin-top: 20px;" direction="vertical"
                            title="产品主码信息" border>
                            <el-descriptions-item>
                                <template slot="label">
                                    <el-input style="width: 400px;"></el-input>
                                </template>
                                <ele-pro-table :key="key" highlight-current-row ref="table" :height="defaultHeight"
                                    :rowClickChecked="true" :stripe="true" :pageSize="pageSize" :pageSizes="pageSizes"
                                    :columns="columns" :datasource="datasource" :selection.sync="selection"
                                    cache-key="productTable">

                                    <!-- 状态列 -->
                                    <template v-slot:OPERATION="">
                                        <el-tag size="small"  type="primary">编辑</el-tag>
                                        <el-tag size="small" type="danger">删除</el-tag>
                                    </template>

                                    <template v-slot:OTHER="">
                                        <el-tag size="small"  type="primary">上传</el-tag>
                                    </template>

                                </ele-pro-table>
                            </el-descriptions-item>
                        </el-descriptions>

                    </el-card>
                </el-header>
            </el-container>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options: [{
                value: '1',
                label: 'GS1编码'
            }, {
                value: '123',
                label: 'UDI标准'
            }, {
                value: '123',
                label: 'UDI标准'
            }, {
                value: '123',
                label: 'UDI标准'
            }, {
                value: '123',
                label: 'UDI标准'
            }],
            value: '1',
            checkList: [],
            // 表格列配置
            columns: [
                {
                    prop: 'CURRENT_STATE',
                    label: '状态',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110,
                },
                {
                    prop: 'CODE',
                    label: '产品主码',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110
                },
                {
                    prop: 'PRODUCT_SCANCODE',
                    label: 'GS1编码',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 110
                },
                {
                    prop: 'PRODUCT_NAME',
                    label: '产品名称/通用名',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'PLATFORM',
                    label: '规格型号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'OPERATION-TYPE',
                    label: '对接类型',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'PROD_REGISTRATION',
                    label: '注册证编号或者备案凭证编号',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 60
                },
                {
                    prop: 'OTHER',
                    label: '产品主码附件',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80
                },
                {
                    prop: 'OPERATION',
                    slot: "OPERATION",
                    label: '操作',
                    align: 'center',
                    showOverflowTooltip: true,
                    minWidth: 80
                },
            ],
            toolbar: false,
            pageSize: 2,
            pagerCount: 2,
            pageSizes: [2, 5, 10, 20, 50, 100, 9999999],
            // 表格选中数据
            selection: [],
            // 当前编辑数据
            current: null,
            // datasource: [],
            data: [],
            key: 0,
            defaultHeight: '17vh'
        }

    },
    methods: {
        datasource({ page, limit, where, order }) {
            let data = {
                "code": "200",
                "msg": "查询完成",
                "total": 31,
                "result": [
                    {
                        "CURRENT_STATE": "审核通过",
                        "CODE": "0100885836071161",
                        "PRODUCT_SCANCODE": "",
                        "PRODUCT_NAME": "髋关节假体-陶瓷股骨头和衬垫-7927-Bioloxdelta股骨头",
                        "PLATFORM": "00-8775-032-02 DELTA CERAMIC FEM HEAD 0X32",
                        "OPERATION-TYPE": "手工添加",
                        "PROD_REGISTRATION": "国械注进20143135650",
                        "OTHER": "",
                        "OPERATION": "",
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
    },
}
</script>

<style lang="">

</style>