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
        <keep-alive>
          <component
            :is="activeTab === 'in' ? 'LeftPage' : 'RightPage'"
            :bill-mode="true"
            :page-size.sync="sharedPageSize"
          />
        </keep-alive>
      </div>
    </el-card>
  </div>
</template>

<script>
import LeftPage from '../Goodsshelves/components/LeftPage.vue';
import RightPage from '../Goodsshelves/components/RightPage.vue';
import { setPageTab, getRouteTabKey } from '@/utils/page-tab-util';

export default {
  name: 'GoodsshelvesSzse',
  components: {
    LeftPage,
    RightPage
  },
  data() {
    return {
      activeTab: 'in',
      sharedPageSize: 10
    };
  },
  mounted() {
    const name = this.$options.name;
    if (name) {
      setPageTab({ key: getRouteTabKey(), components: [name] });
    }
  }
};
</script>

<style scoped>
.goodsshelves-page {
  padding: 8px;
  height: calc(100vh - 100px);
  min-width: 1280px;
  box-sizing: border-box;
  overflow: auto;
}

.goodsshelves-card {
  min-width: 1280px;
  min-height: 100%;
}

.goodsshelves-page :deep(.el-card__body) {
  min-height: calc(100vh - 124px);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.goodsshelves-tabs-form {
  flex: none;
  width: 100%;
  margin-bottom: 10px;
}

.goodsshelves-tabs-form :deep(.el-form-item),
.goodsshelves-tabs-form :deep(.el-form-item__content),
.goodsshelves-tabs-form :deep(.el-radio-group) {
  width: 100%;
  margin-bottom: 0;
}

.goodsshelves-tabs-form :deep(.el-radio-group) {
  display: flex;
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.goodsshelves-content >>> .goodsshelves-tab-page {
  flex: 1;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}
</style>
