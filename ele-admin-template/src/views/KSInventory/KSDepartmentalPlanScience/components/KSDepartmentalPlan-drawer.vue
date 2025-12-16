<template>
  <el-drawer
    :visible.sync="drawerVisible"
    :title="`科研申领单流程详情 - ${planNum}`"
    size="50%"
    :before-close="handleClose"
  >
    <div class="drawer-content">
      <div v-if="loading" style="text-align: center; padding: 50px;">
        <i class="el-icon-loading" style="font-size: 24px; color: #16baaa;"></i>
        <p style="margin-top: 10px; color: #999;">加载中...</p>
      </div>

      <div v-else-if="workflowSteps.length > 0">
        <!-- Element UI 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(step, index) in workflowSteps"
            :key="index"
            :timestamp="step.time || '待处理'"
            :type="getTimelineType(step.status)"
            :icon="getTimelineIcon(step.status)"
            placement="top"
            size="large"
          >
            <el-card shadow="hover" class="timeline-card">
              <div slot="header" class="timeline-card-header">
                <span class="timeline-operator">{{ step.operator }}</span>
                <el-tag
                  :type="getStatusTagType(step.status)"
                  size="small"
                  :effect="step.status === 'processing' ? 'dark' : 'plain'"
                >
                  {{ step.statusText }}
                </el-tag>
              </div>
              <div class="timeline-action">
                <i class="el-icon-s-operation"></i> {{ step.action }}
              </div>
              <div
                class="timeline-detail"
                v-if="step.detail"
                v-html="step.detail"
              ></div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <div v-else style="text-align: center; padding: 50px; color: #999;">
        <i class="el-icon-document" style="font-size: 48px; color: #ddd;"></i>
        <div style="margin-top: 10px;">暂无审批流程数据</div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getWorkFlowInstanceNodeDetail, getNodeApprovers } from '@/api/pekingApplication';

export default {
  name: 'KSDepartmentalPlanDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    planNum: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      workflowSteps: []
    };
  },
  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.planNum) {
        this.loadWorkflowDetail();
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('update:visible', false);
      if (done) done();
    },

    // 加载审批流程详情
    async loadWorkflowDetail() {
      if (!this.planNum) return;

      this.loading = true;
      try {
        const res = await getWorkFlowInstanceNodeDetail(this.planNum);
        const rawData = res.data || [];
        
        // 先获取节点应审批人信息，然后转换为时间线步骤格式
        const enhancedData = await this.loadNodeApproversData(rawData);
        this.workflowSteps = this.convertNodeDataToSteps(enhancedData, res);
      } catch (err) {
        this.$message.error(err.message || '获取审批流程失败');
        this.workflowSteps = [];
      } finally {
        this.loading = false;
      }
    },

    // 获取节点应审批人信息
    async loadNodeApproversData(nodeData) {
      if (!nodeData || nodeData.length === 0) {
        return [];
      }

      // 获取所有唯一的节点ID
      const uniqueNodeIds = [];
      const nodeIdSet = new Set();
      
      nodeData.forEach(item => {
        if (item.NODE_ID && !nodeIdSet.has(item.NODE_ID)) {
          nodeIdSet.add(item.NODE_ID);
          uniqueNodeIds.push(item.NODE_ID);
        }
      });

      if (uniqueNodeIds.length === 0) {
        return nodeData;
      }

      // 并行请求所有节点的审批人信息
      const requests = uniqueNodeIds.map(nodeId => {
        return getNodeApprovers(nodeId).catch(err => {
          console.log(`获取节点 ${nodeId} 审批人信息失败:`, err);
          return { code: 200, data: [] };
        });
      });

      try {
        const results = await Promise.all(requests);
        const approverMap = {};

        // 处理每个节点的审批人信息
        uniqueNodeIds.forEach((nodeId, index) => {
          const res = results[index];
          let approvers = [];

          if (res && (res.code === 200 || res.code === '200')) {
            const data = res.data || res.result || res.list || [];
            if (Array.isArray(data)) {
              approvers = data.map(item => ({
                approverId: item.ApproverId || item.approverId || item.approverid || 
                           item.username || item.Username || item.userName || '',
                approverName: item.ApproverName || item.approverName || item.approvername || 
                             item.nickname || item.Nickname || ''
              })).filter(item => item.approverName);
            }
          }

          approverMap[nodeId] = approvers;
        });

        // 将应审批人信息添加到原始节点数据中
        return nodeData.map(item => {
          const enhanced = { ...item };
          if (item.NODE_ID && approverMap[item.NODE_ID]) {
            enhanced.expectedApprovers = approverMap[item.NODE_ID];
          }
          return enhanced;
        });
      } catch (error) {
        console.log('部分节点审批人信息获取失败，继续使用原有数据');
        return nodeData;
      }
    },

    // 将API返回的节点数据转换为时间线步骤格式
    convertNodeDataToSteps(nodeData, apiResponse) {
      if (!nodeData || nodeData.length === 0) {
        return [];
      }

      // 判断实例是否已结束（有拒绝节点或所有节点都已完成）
      const isInstanceFinished = nodeData.some(item => {
        return item.NODE_STATUS === 3 || item.NODE_STATUS === '3';
      });

      // 如果实例已结束，只保留实际执行过的节点
      let processedNodeData = nodeData;
      if (isInstanceFinished) {
        processedNodeData = nodeData.filter(item => {
          // NODE_STATUS: 0=未开始, 1=进行中, 2=已完成, 3=已拒绝, 4=已跳过
          return item.NODE_STATUS !== 0 && item.NODE_STATUS !== '0' ||
                 (item.NODE_START_TIME && item.NODE_START_TIME.trim());
        });
      }

      // 按节点ID分组（处理多人审批场景）
      const nodeGroups = {};
      processedNodeData.forEach(item => {
        const nodeId = item.NODE_ID;
        if (!nodeGroups[nodeId]) {
          nodeGroups[nodeId] = {
            nodeInfo: item,
            approvers: []
          };
        }

        // 如果有审批人信息，添加到审批人列表
        if (item.APPROVER_NAME && item.APPROVER_NAME.trim()) {
          nodeGroups[nodeId].approvers.push({
            name: item.APPROVER_NAME,
            result: item.APR_RESULT_DESC || '',
            opinion: item.APR_OPINION || '',
            time: item.APR_TIME || '',
            duration: item.APR_DURATION_MINUTES || ''
          });
        }
      });

      // 转换为时间线步骤格式
      const steps = [];

      // 按NODE_ORDER排序，确保顺序正确
      const allNodeIds = Object.keys(nodeGroups);
      const nodeIds = allNodeIds.sort((a, b) => {
        const orderA = nodeGroups[a].nodeInfo.NODE_ORDER || 0;
        const orderB = nodeGroups[b].nodeInfo.NODE_ORDER || 0;
        return orderA - orderB;
      });

      nodeIds.forEach(nodeId => {
        const group = nodeGroups[nodeId];
        const nodeInfo = group.nodeInfo;
        const approvers = group.approvers;

        // 映射节点状态（兼容数字和字符串）
        const nodeStatus = parseInt(nodeInfo.NODE_STATUS);
        const statusMap = {
          0: 'pending',     // 未开始
          1: 'processing',  // 进行中
          2: 'completed',   // 已通过
          3: 'rejected',     // 已拒绝
          4: 'completed'    // 已跳过（按已完成样式渲染）
        };

        let status = statusMap[nodeStatus] || 'pending';

        // 特殊处理开始和结束节点
        const nodeType = nodeInfo.NODE_TYPE || nodeInfo.NODE_TYPE_DESC || '';
        if (nodeType.toUpperCase().indexOf('START') !== -1 || nodeType === '开始') {
          status = 'start';
        } else if (nodeType.toUpperCase().indexOf('END') !== -1 || nodeType === '结束') {
          status = 'end';
        }

        // 构建步骤
        if (approvers.length === 0) {
          // 没有审批人的节点（开始、结束、自动节点等）
          steps.push({
            operator: nodeInfo.NODE_NAME || '',
            time: this.formatDateTime(nodeInfo.NODE_START_TIME) || '',
            action: nodeInfo.NODE_TYPE_DESC || nodeInfo.NODE_NAME || '',
            status: status,
            statusText: this.getStatusTextByStatus(status),
            detail: this.buildNodeDetail(nodeInfo, null)
          });
        } else if (approvers.length === 1) {
          // 单个审批人
          const approver = approvers[0];
          steps.push({
            operator: nodeInfo.NODE_NAME || approver.name || '',
            time: this.formatDateTime(approver.time || nodeInfo.NODE_START_TIME) || '',
            action: nodeInfo.NODE_TYPE_DESC || nodeInfo.NODE_NAME || '',
            status: status,
            statusText: this.getStatusTextByStatus(status),
            detail: this.buildNodeDetail(nodeInfo, approver)
          });
        } else {
          // 多个审批人（或签场景 - 任一人通过即可）
          steps.push({
            operator: nodeInfo.NODE_NAME || '',
            time: this.formatDateTime(nodeInfo.NODE_START_TIME) || '',
            action: nodeInfo.NODE_TYPE_DESC || nodeInfo.NODE_NAME || '',
            status: status,
            statusText: this.getStatusTextByStatus(status),
            detail: this.buildMultiApproverDetail(nodeInfo, approvers)
          });
        }
      });

      return steps;
    },

    // 格式化日期时间
    formatDateTime(dateTimeStr) {
      if (!dateTimeStr) return '';
      
      // 处理ISO格式的日期时间
      if (dateTimeStr.indexOf('T') !== -1) {
        return dateTimeStr.replace('T', ' ').substring(0, 19);
      }
      
      return dateTimeStr;
    },

    // 构建节点详情描述
    buildNodeDetail(nodeInfo, approver) {
      const details = [];

      // 节点状态描述
      if (nodeInfo.NODE_STATUS_DESC) {
        details.push('状态：' + nodeInfo.NODE_STATUS_DESC);
      }

      // 如果是人工审批节点，显示应审批人和实际审批人
      if (nodeInfo.NODE_TYPE_DESC === '人工审批') {
        // 显示应审批人
        if (nodeInfo.expectedApprovers && nodeInfo.expectedApprovers.length > 0) {
          const expectedApproverNames = nodeInfo.expectedApprovers
            .map(item => item.approverName || '')
            .filter(name => name);

          if (expectedApproverNames.length > 0) {
            details.push('应审批人：' + expectedApproverNames.join('、'));
          }
        }

        // 显示实际审批人
        if (approver && approver.name) {
          details.push('实际审批人：' + approver.name);
        } else if (nodeInfo.APPROVER_NAME) {
          details.push('实际审批人：' + nodeInfo.APPROVER_NAME);
        }
      }

      // 审批意见
      if (approver && approver.opinion) {
        details.push('审批意见：' + approver.opinion);
      }

      // 审批结果
      if (approver && approver.result) {
        details.push('审批结果：' + approver.result);
      }

      // 审批耗时
      if (approver && approver.duration) {
        const duration = parseFloat(approver.duration);
        if (duration > 0) {
          if (duration < 60) {
            details.push('耗时：' + duration.toFixed(1) + ' 分钟');
          } else if (duration < 1440) {
            details.push('耗时：' + (duration / 60).toFixed(1) + ' 小时');
          } else {
            details.push('耗时：' + (duration / 1440).toFixed(1) + ' 天');
          }
        }
      }

      // 节点类型
      if (nodeInfo.NODE_TYPE_DESC) {
        details.push('节点类型：' + nodeInfo.NODE_TYPE_DESC);
      }

      // 下一节点
      if (nodeInfo.NEXT_NODE_NAME) {
        details.push('下一节点：' + nodeInfo.NEXT_NODE_NAME);
      }

      return details.join(' | ');
    },

    // 构建多审批人详情描述
    buildMultiApproverDetail(nodeInfo, approvers) {
      let confirmedCount = 0;
      let rejectedCount = 0;
      const confirmedNames = [];
      const rejectedNames = [];
      const pendingNames = [];

      // 检查节点状态，如果是已拒绝，所有人都应该显示拒绝状态
      const isNodeRejected = nodeInfo.NODE_STATUS === 3 ||
                            (nodeInfo.NODE_STATUS_DESC && nodeInfo.NODE_STATUS_DESC.indexOf('拒绝') !== -1);

      approvers.forEach((approver, index) => {
        const approverInfo = (index + 1) + '.' + (approver.name || '未知');

        if (isNodeRejected) {
          // 如果节点被拒绝，检查审批人是否有明确的拒绝记录
          const isRejected = approver.result &&
                            (approver.result.indexOf('拒绝') !== -1 ||
                             approver.result.indexOf('不同意') !== -1);

          if (isRejected) {
            rejectedCount++;
            rejectedNames.push(approverInfo + ' ❌');
          } else {
            rejectedNames.push(approverInfo + ' (待处理)');
          }
        } else {
          // 正常流程，统计已确认和待确认的审批人
          const isConfirmed = approver.result &&
                             (approver.result.indexOf('通过') !== -1 ||
                              approver.result.indexOf('同意') !== -1 ||
                              approver.result.indexOf('已审批') !== -1 ||
                              approver.result.indexOf('已确认') !== -1);

          if (isConfirmed) {
            confirmedCount++;
            confirmedNames.push(approverInfo + ' ✓');
          } else {
            pendingNames.push(approverInfo + ' ⏳');
          }
        }
      });

      let html = '';

      // 如果是人工审批节点且有应审批人，显示应审批人信息
      if (nodeInfo.NODE_TYPE_DESC === '人工审批' && nodeInfo.expectedApprovers && nodeInfo.expectedApprovers.length > 0) {
        const expectedApproverNames = nodeInfo.expectedApprovers
          .map(item => item.approverName || '')
          .filter(name => name);

        if (expectedApproverNames.length > 0) {
          html += '<div style="margin-bottom:5px; color:#16baaa;">应审批人：' + expectedApproverNames.join('、') + '</div>';
        }
      }

      if (isNodeRejected) {
        // 显示拒绝状态
        html += '<div style="margin-bottom:5px; color:#ff5722;">已拒绝：' + rejectedNames.join('、') + '</div>';
        html += '<div style="color:#999; font-size:12px;">审批被拒绝，流程终止</div>';
      } else {
        // 显示正常状态
        if (pendingNames.length > 0) {
          html += '<div style="margin-bottom:5px; color:#ff9800;">待确认：' + pendingNames.join('、') + '</div>';
        }

        if (confirmedNames.length > 0) {
          html += '<div style="margin-bottom:5px; color:#5fb878;">已确认：' + confirmedNames.join('、') + '</div>';
        }

        html += '<div style="color:#999; font-size:12px;">进度：' + confirmedCount + '/' + approvers.length + ' 人已确认</div>';
      }

      return html;
    },

    // 根据状态获取状态文本
    getStatusTextByStatus(status) {
      const statusMap = {
        'start': '开始',
        'end': '结束',
        'completed': '已完成',
        'processing': '处理中',
        'pending': '待处理',
        'rejected': '已拒绝'
      };
      return statusMap[status] || '未知';
    },

    // 获取Element UI Timeline的type属性
    getTimelineType(status) {
      if (status === 'start' || status === 'end') return 'danger';
      if (status === 'completed') return 'success';
      if (status === 'processing') return 'primary';
      if (status === 'rejected') return 'danger';
      return '';
    },

    // 获取Element UI Timeline的icon
    getTimelineIcon(status) {
      if (status === 'start') return 'el-icon-video-play';
      if (status === 'end') return 'el-icon-circle-check';
      if (status === 'processing') return 'el-icon-loading';
      if (status === 'rejected') return 'el-icon-close';
      return '';
    },

    // 获取状态标签类型
    getStatusTagType(status) {
      if (status === 'start' || status === 'end') return 'danger';
      if (status === 'completed') return 'success';
      if (status === 'processing') return 'primary';
      if (status === 'rejected') return 'danger';
      return 'info';
    }
  }
};
</script>

<style scoped>
.drawer-content {
  padding: 20px;
}

/* 时间线卡片样式 */
.timeline-card {
  margin-bottom: 10px;
}

.timeline-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.timeline-operator {
  font-size: 14px;
  color: #303133;
}

.timeline-action {
  color: #606266;
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.timeline-detail {
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
  margin-top: 8px;
}

.timeline-detail :deep(div) {
  margin-bottom: 5px;
}

/* 处理中状态的旋转动画 */
:deep(.el-timeline-item__icon.el-icon-loading) {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
