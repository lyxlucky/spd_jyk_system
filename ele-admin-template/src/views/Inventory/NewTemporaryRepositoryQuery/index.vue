<template>
  <div>
    <div class="header">
      <span
        @click="showLeftPage = true; showRightPage = false"
        :class="{ active: showLeftPage }"
      >
        暂存库定数包明细列表
      </span>
      <span
        @click="showRightPage = true; showLeftPage = false"
        :class="{ active: showRightPage }"
      >
        智能间出库详情
      </span>
    </div>
    <NewLeftPage v-if="showLeftPage" />
    <NewRightPage v-if="showRightPage" />
  </div>
</template>

<script>
import NewLeftPage from './components/NewLeftPage.vue';
import NewRightPage from './components/NewRightPage.vue';

export default {
  name: 'NewTemporaryRepositoryQuery',
  components: {
    NewLeftPage,
    NewRightPage
  },
  data() {
    return {
      showLeftPage: true,
      showRightPage: false
    };
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ccc;
}

.header span {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  position: relative;
}

.header span.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff;
}
</style>
