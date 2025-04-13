<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";
import { useAppStore } from "../../store/app";

const route = useRoute();
const appStore = useAppStore();

// 侧边栏折叠状态
const isCollapse = ref(false);

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};

onMounted(() => {
  // 初始化时间范围
  appStore.updateTimeRange();
  console.log("Layout组件已挂载，初始化时间范围");
});
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <Sidebar :is-collapse="isCollapse" />

    <!-- 主内容区 -->
    <div class="main-container" :class="{ 'is-collapsed': isCollapse }">
      <!-- 顶部导航栏 -->
      <Header @toggle-sidebar="toggleSidebar" />

      <!-- 内容区 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
  margin-left: 20px;
  overflow: hidden;
}

.main-container.is-collapsed {
  margin-left: 64px;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
