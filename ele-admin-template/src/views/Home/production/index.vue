<template>
    <div class="ele-body">
        <el-card shadow="never">
            <!-- 搜索表单 -->
            <el-form label-position="right" inline class="ele-form-search">
                <el-form-item label="生产企业名称:">
                    <el-input  size="mini" v-model="where.MANUFACTURING_ENT_NAME" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="开始时间:" >
                    <el-date-picker size="mini" v-model="where.startTime" type="date" placeholder="开始时间" />
                </el-form-item>
                <el-form-item>
                    <el-date-picker size="mini" v-model="where.endTime" type="date" placeholder="结束时间" />
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="reload">
                        查询
                    </el-button>
                </el-form-item>
                <!-- <div class="ele-form-actions">
                    <el-button size="mini" type="primary" icon="el-icon-search" class="ele-btn-icon" @click="reload">
                        查询
                    </el-button>
                         <el-button @click="exportProdinfo">导出</el-button>
                    <el-button @click="addProdinfo">新增</el-button>
                    <el-button @click="updateProdinfo">修改</el-button>
                    <el-button @click="delProdinfo">删除</el-button>
                </div> -->
            </el-form>
            <!-- 数据表格 -->
            <ele-pro-table ref="table" :columns="columns" :datasource="datasource" @selection-change="onSelectionChange">
            </ele-pro-table>
        </el-card>

        <!-- 新增/修改弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
            <el-form :model="ProdinfoData" label-width="120px">
                <el-form-item label="生产企业名称">
                    <el-input v-model="ProdinfoData.MANUFACTURING_ENT_NAME" placeholder="请输入生产企业名称" />
                </el-form-item>
                <el-form-item label="生产许可证号">
                    <el-input v-model="ProdinfoData.MANUFACTURING_LICENSE" placeholder="请输入生产许可证号" />
                </el-form-item>
                <el-form-item label="许可证有效期">
                    <el-date-picker v-model="ProdinfoData.MANUFACTURING_LICENSE_TIME" type="date" placeholder="选择日期" />
                </el-form-item>
                <el-form-item label="生产企业地址">
                    <el-input v-model="ProdinfoData.MANUFACTURING_ADDRES" placeholder="请输入生产企业地址" />
                </el-form-item>
                <!-- <el-form-item label="创建人">
                    <el-input v-model="ProdinfoData.CREATE_MAN" placeholder="请输入创建人" />
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template><script>
import { getMANUFACTURINGList, delMANUFACTURING_ENT, addMANUFACTURING_ENT, updateMANUFACTURING_ENT } from '@/api/Home/production';
import { utils, writeFile } from 'xlsx';
export default {
    name: 'production',
    data() {
        return {
            // 表格列配置
            columns: [
                {
                    width: 45,
                    type: 'selection',
                    columnKey: 'selection',
                    align: 'center'
                },
                {
                    columnKey: 'index',
                    type: 'index',
                    width: 45,
                    align: 'center',
                    showOverflowTooltip: true
                },
                {
                    prop: 'MANUFACTURING_ENT_NAME',
                    label: '生产企业名称',
                    sortable: 'custom',
                    showOverflowTooltip: true
                },
                {
                    prop: 'MANUFACTURING_LICENSE',
                    label: '生产许可证号',
                    sortable: 'custom',
                    showOverflowTooltip: true
                },
                {
                    prop: 'MANUFACTURING_LICENSE_TIME',
                    label: '许可证有效期',
                    sortable: 'custom',
                    showOverflowTooltip: true,
                    formatter: (row, column, cellValue) => {
                        return this.$util.toDateString(cellValue);
                    }
                },
                {
                    prop: 'MANUFACTURING_ADDRES',
                    label: '生产企业地址',
                    sortable: 'custom',
                    showOverflowTooltip: true
                },
                {
                    prop: 'CREATE_MAN',
                    label: '创建人',
                    sortable: 'custom',
                    showOverflowTooltip: true
                },
                {
                    prop: 'CREATE_TIME',
                    label: '更新时间',
                    sortable: 'custom',
                    showOverflowTooltip: true,
                    formatter: (row, column, cellValue) => {
                        return this.$util.toDateString(cellValue);
                    }
                }
            ],
            // 表格搜索条件
            where: {
                MANUFACTURING_ENT_NAME: "",
                startTime: undefined,
                endTime: undefined
            },
            // 表单数据
            ProdinfoData: {
                ID: undefined,
                MANUFACTURING_ENT_NAME: "",
                MANUFACTURING_LICENSE: "",
                MANUFACTURING_LICENSE_TIME: "",
                MANUFACTURING_ADDRES: "",
                CREATE_MAN: "",
            },
            // 表格选中数据
            selection: [],
            // 弹窗控制
            dialogVisible: false,
            dialogTitle: "新增生产企业",
            isEdit: false // 是否为编辑模式,
            ,
      
        };
    },
    methods: {
        datasource({ page, limit, where, order }) {
            let data = getMANUFACTURINGList({ page, limit, where, order }).then(
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
        reload() {
            this.$refs.table.reload({ page: 1, where: this.where });
        },
        /* 重置搜索 */
        reset() {
            this.where = {
                MANUFACTURING_ENT_NAME: "",
                startTime: undefined,
                endTime: undefined
            };
            this.reload();
        },
        /* 删除操作 */
        delProdinfo() {
            if (this.selection.length === 1) {
                this.$confirm('确认删除该项?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var data = {
                        ID: this.selection[0].ID,
                        CREATE_MAN: this.$store.state.user.info.Nickname
                    };
                    delMANUFACTURING_ENT(data).then(() => {
                        this.$message.success('删除成功');
                        this.reload();
                    });
                }).catch(() => {
                    console.log('用户取消了删除');
                });
            } else {
                this.$message.error('请选择一项进行删除');
                return;
            }
        },
        /* 选中行变化 */
        onSelectionChange(res) {
            this.selection = res;
        },
        /* 新增操作 */
        addProdinfo() {
            this.dialogTitle = "新增生产企业";
            this.isEdit = false;
            this.ProdinfoData = {
                ID: undefined,
                MANUFACTURING_ENT_NAME: "",
                MANUFACTURING_LICENSE: "",
                MANUFACTURING_LICENSE_TIME: "",
                MANUFACTURING_ADDRES: "",
                CREATE_MAN: this.$store.state.user.info.Nickname
            };
            this.dialogVisible = true;
        },
        /* 修改操作 */
        updateProdinfo() {
            if (this.selection.length === 1) {
                this.dialogTitle = "修改生产企业";
                this.isEdit = true;
                this.ProdinfoData = { ...this.selection[0] }; // 复制选中项的数据
                this.dialogVisible = true;
            } else {
                this.$message.error('请选择一项进行修改');
                return;
            }
        },
        /* 弹窗确认操作 */
        handleDialogConfirm() {
            if (this.isEdit) {
                // 修改操作
                updateMANUFACTURING_ENT(this.ProdinfoData).then(() => {
                    this.$message.success('修改成功');
                    this.dialogVisible = false;
                    this.reload();
                });
            } else {
                // 新增操作
                addMANUFACTURING_ENT(this.ProdinfoData).then(() => {
                    this.$message.success('新增成功');
                    this.dialogVisible = false;
                    this.reload();
                });
            }
        },
        exportProdinfo() {        
    const array = [
        ['生产企业名称', '生产企业许可证号', '许可证有效期', '生产企业地址', '创建人', '更新时间']
    ];

    const data = {
        where: {
            MANUFACTURING_ENT_NAME: "",
            startTime: "",
            endTime: "",
        },                        
        page: 1,
        limit: 999999,
    };

    getMANUFACTURINGList(data).then(exportData => {
        exportData.result.forEach((d) => {
            array.push([
                d.MANUFACTURING_ENT_NAME, 
                d.MANUFACTURING_LICENSE, 
                this.$util.toDateString(d.MANUFACTURING_LICENSE_TIME) , 
                d.MANUFACTURING_ADDRES, 
                d.CREATE_MAN, 
                this.$util.toDateString(d.CREATE_TIME)
            ]);
        });
                   // 创建工作表
        const sheet = utils.aoa_to_sheet(array);
        
        // 设置列宽
        sheet["!cols"] = [
            { wch: 40 },
            { wch: 22 },
            { wch: 22 },
            { wch: 22 },
            { wch: 12 },
            { wch: 22 },    
        ];

        // 导出文件
        writeFile(
            {
                SheetNames: ['生产企业'],
                Sheets: {
                    生产企业: sheet
                }
            },
            '生产企业.xlsx'
        );

        
    }).catch(error => {
        console.error('导出数据失败:', error);
        this.$message.error('导出数据失败，请稍后重试。');
    });
}

    }
}
</script>