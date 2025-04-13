<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// 接收父组件传递的折叠状态
defineProps({
  isCollapse: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const router = useRouter();

// 获取路由配置中的菜单项
const menuItems = computed(() => {
  const routes = router.options.routes;
  // 找到主布局路由
  const layoutRoute = routes.find((route) => route.name === "Layout");
  // 返回布局路由的子路由作为菜单项
  return layoutRoute?.children?.filter((item) => !item.meta?.hidden) || [];
});

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  const { path } = route;
  // 如果是错误详情页，激活错误监控菜单
  if (path.startsWith("/error/")) {
    return "/error";
  }
  return path;
});

// 动态获取图标组件
const getIcon = (iconName: string) => {
  return ElementPlusIconsVue[iconName as keyof typeof ElementPlusIconsVue];
};
</script>

<template>
  <div class="sidebar-container" :class="{ 'is-collapsed': isCollapse }">
    <!-- Logo -->
    <div class="logo-container">
      <img
        src="../../assets/logo.svg"
        alt="Logo"
        class="logo"
        v-if="!isCollapse"
      />
      <img
        src="../../assets/logo-mini.svg"
        alt="Logo"
        class="logo-mini"
        v-else
      />
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.path"
        :index="item.path"
      >
        <el-icon v-if="item.meta?.icon">
          <component :is="getIcon(item.meta.icon)" />
        </el-icon>
        <template #title>{{ item.meta?.title }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-container {
  width: 220px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar-container.is-collapsed {
  width: 64px;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
  padding: 10px;
}

.logo {
  height: 40px;
  max-width: 100%;
}

.logo-mini {
  height: 30px;
  max-width: 100%;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
}

/* 覆盖Element Plus样式 */
:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #263445 !important;
}
</style>
