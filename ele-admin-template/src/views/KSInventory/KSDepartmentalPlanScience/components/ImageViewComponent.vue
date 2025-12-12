<template>
  <div class="image-table-container">
    <ele-pro-table
      ref="table"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      height="600px"
      cache-key="ImageViewTable"
    >
      <!-- 类型列 -->
      <template v-slot:TYPE="{ row }">
        <span v-if="row.TYPE == 1">品种注册证</span>
        <span v-else-if="row.TYPE == 2">品种说明书</span>
        <span v-else-if="row.TYPE == 3">品种包装</span>
        <span v-else-if="row.TYPE == 4">品种授权书</span>
        <span v-else-if="row.TYPE == 5">厂家营业执照</span>
        <span v-else-if="row.TYPE == 6">厂家生产许可证</span>
        <span v-else>{{ row.TYPE }}</span>
      </template>

      <!-- 图片列 -->
      <template v-slot:PIC_URL="{ row }">
        <div v-if="!row.PIC_URL || row.PIC_URL === ''">无图片</div>
        <a
          v-else-if="row.PIC_URL.indexOf('pdf') !== -1"
          @click="viewPdf(row)"
          style="color: #409eff; cursor: pointer"
          >pdf文件</a
        >
        <img
          v-else
          :src="getImageUrl(row.PIC_URL)"
          @click="previewImage(row)"
          style="
            width: 50px;
            height: 50px;
            object-fit: cover;
            cursor: pointer;
            border-radius: 4px;
          "
          alt="产品图片"
        />
      </template>

      <!-- 状态列 -->
      <template v-slot:STATE="{ row }">
        <span v-if="row.STATE == '0'">新增</span>
        <span v-else-if="row.STATE == '1'">已审批</span>
        <span v-else-if="row.STATE == '2'">审批未通过</span>
        <span v-else>{{ row.STATE }}</span>
      </template>

      <!-- 创建时间列 -->
      <template v-slot:CREATE_TIME="{ row }">
        {{ formatDateTime(row.CREATE_TIME) }}
      </template>

      <!-- 审批时间列 -->
      <template v-slot:APP_TIME="{ row }">
        {{ formatDateTime(row.APP_TIME) }}
      </template>
    </ele-pro-table>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="80%"
      center
      top="5vh"
      :modal="false"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="preview-container">
        <div class="preview-controls">
          <el-button
            @click="rotateLeft"
            icon="el-icon-refresh-left"
            circle
          ></el-button>
          <el-button
            @click="rotateRight"
            icon="el-icon-refresh-right"
            circle
          ></el-button>
        </div>
        <img
          :src="previewImageUrl"
          alt="预览图片"
          class="preview-image"
          :style="{ transform: `rotate(${rotationAngle}deg)` }"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getVarPic2 } from '@/api/Home/Qualificationcheck';

  export default {
    name: 'ImageViewComponent',
    props: {
      rowData: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        // 表格列配置
        columns: [
          {
            type: 'selection',
            width: 50,
            fixed: 'left',
            align: 'center'
          },
          {
            slot: 'TYPE',
            label: '类型',
            prop: 'TYPE',
            align: 'center',
            sortable: true,
            width: 120
          },
          {
            prop: 'VARIETIE_CODE_NEW',
            label: '品种编码',
            align: 'center',
            width: 120
          },
          {
            prop: 'VARIETIE_NAME',
            label: '品种名称',
            align: 'center',
            width: 200,
            showOverflowTooltip: true
          },
          {
            prop: 'SPECIFICATION_OR_TYPE',
            label: '规格型号',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            prop: 'MANUFACTURING_ENT_NAME',
            label: '生产企业',
            align: 'center',
            width: 200,
            showOverflowTooltip: true
          },
          {
            prop: 'SUPPLIER_NAME',
            label: '供应商名称',
            align: 'center',
            width: 200,
            showOverflowTooltip: true
          },
          {
            slot: 'PIC_URL',
            label: '图片',
            align: 'center',
            width: 100
          },
          {
            prop: 'REMARK',
            label: '备注/说明',
            align: 'center',
            width: 150,
            showOverflowTooltip: true
          },
          {
            slot: 'STATE',
            label: '状态',
            prop: 'STATE',
            align: 'center',
            sortable: true,
            width: 100
          },
          {
            slot: 'CREATE_TIME',
            label: '创建时间',
            prop: 'CREATE_TIME',
            align: 'center',
            sortable: true,
            width: 150
          },
          {
            prop: 'APP_MAN',
            label: '审批人',
            align: 'center',
            width: 100
          },
          {
            slot: 'APP_TIME',
            label: '审批时间',
            prop: 'APP_TIME',
            align: 'center',
            sortable: true,
            width: 150
          },
          {
            prop: 'PROD_REGISTRATION_CODE',
            label: '注册证ID',
            align: 'center',
            width: 150
          }
        ],
        pageSize: 30,
        pageSizes: [30, 50, 100, 150, 200, 300, 99999],
        selection: [],
        // 图片预览相关
        previewDialogVisible: false,
        previewImageUrl: '',
        rotationAngle: 0
      };
    },
    mounted() {
      // 组件挂载后自动加载数据
    },
    methods: {
      // 数据源方法
      datasource({ page, limit, where, order }) {
        // 根据传入的rowData设置查询条件
        console.log(this.rowData);
        console.log(this.rowData?.VARIETIE_CODE);
        console.log(this.rowData?.Prod_Registration_Code);
        const queryParams = {
          page,
          limit,
          where: {
            ...where,
            VARIETIE_CODE: this.rowData?.VARIETIE_CODE || '',
            isUse: '1'
          },
          code: this.rowData?.Prod_Registration_Code || '',
          order
        };

        return getVarPic2(queryParams).then((res) => {
          return {
            count: res.total || 0,
            list: res.result || []
          };
        });
      },

      // 格式化日期时间
      formatDateTime(dateTime) {
        if (!dateTime) return '';
        return dateTime.replace('T', ' ');
      },

      // 获取图片URL
      getImageUrl(picUrl) {
        if (!picUrl) return '';
        // 这里需要根据实际的图片服务器地址进行调整
        return `${process.env.VUE_APP_API_URL || ''}/Upload/ProPic/${picUrl}`;
      },

      // 预览图片
      previewImage(row) {
        if (row.PIC_URL && row.PIC_URL.indexOf('pdf') === -1) {
          this.previewImageUrl = this.getImageUrl(row.PIC_URL);
          this.rotationAngle = 0; // 重置旋转角度
          this.previewDialogVisible = true;
        }
      },

      // 向左旋转
      rotateLeft() {
        this.rotationAngle -= 90;
      },

      // 向右旋转
      rotateRight() {
        this.rotationAngle += 90;
      },

      // 查看PDF
      viewPdf(row) {
        if (row.PIC_URL && row.PIC_URL.indexOf('pdf') !== -1) {
          const pdfUrl = this.getImageUrl(row.PIC_URL);
          window.open(pdfUrl, '_blank');
        }
      },

      // 刷新表格
      refresh() {
        if (this.$refs.table) {
          this.$refs.table.reload();
        }
      }
    },
    watch: {
      // 监听rowData变化，重新加载数据
      rowData: {
        handler() {
          this.refresh({ page: 1 });
        },
        deep: true
      }
    }
  };
</script>

<style scoped>
  .image-table-container {
    padding: 20px;
  }

  .preview-container {
    text-align: center;
  }

  .preview-controls {
    margin-bottom: 20px;
  }

  .preview-controls .el-button {
    margin: 0 10px;
  }

  .preview-image {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
</style>
