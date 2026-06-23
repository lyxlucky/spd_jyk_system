<template>
  <div class="ele-body spd-page goodsshelves-page">
    <el-card shadow="never" class="goodsshelves-card">
      <el-form size="mini" :inline="true" class="goodsshelves-tabs-form" @submit.native.prevent>
        <el-form-item>
          <el-radio-group v-model="activeTab" size="mini">
            <el-radio-button label="in">中心库入库查询</el-radio-button>
            <el-radio-button label="out">中心库出库查询</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="goodsshelves-content">
        <LeftPage v-if="activeTab === 'in'" />
        <RightPage v-if="activeTab === 'out'" />
      </div>
    </el-card>
  </div>
</template>

<script>
import LeftPage from '../../Inventory/Goodsshelves/components/LeftPage.vue';
import RightPage from '../../Inventory/Goodsshelves/components/RightPage.vue';

export default {
  components: {
    LeftPage,
    RightPage
  },
  data() {
    return {
      activeTab: 'in'
    };
  }
};
</script>

<style scoped>
.goodsshelves-page {
  padding: 8px;
}

.goodsshelves-card {
  height: calc(100vh - 100px);
}

.goodsshelves-page :deep(.el-card__body) {
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.goodsshelves-tabs-form {
  flex: none;
  width: 100%;
  margin-bottom: 10px;
}

.goodsshelves-tabs-form :deep(.el-form-item) {
  width: 100%;
  margin-bottom: 0;
}

.goodsshelves-tabs-form :deep(.el-form-item__content) {
  width: 100%;
}

.goodsshelves-tabs-form :deep(.el-radio-group) {
  display: flex;
  width: 100%;
}

.goodsshelves-tabs-form :deep(.el-radio-button) {
  flex: 1;
}

.goodsshelves-tabs-form :deep(.el-radio-button__inner) {
  width: 100%;
}

.goodsshelves-content {
  flex: 1;
  min-height: 0;
}

.goodsshelves-content :deep(> .goodsshelves-tab-page) {
  height: 100%;
}
</style>
