# 前端监控数据大屏项目开发指南

## 项目架构设计

### 目录结构

```
src/
├── api/                # API接口
│   ├── request.ts      # Axios封装
│   └── index.ts        # API接口定义
├── assets/             # 静态资源
├── components/         # 公共组件
│   ├── common/         # 通用组件
│   └── layout/         # 布局组件
├── router/             # 路由配置
├── store/              # 状态管理
├── utils/              # 工具函数
├── views/              # 页面视图
│   ├── dashboard/      # 概览页
│   ├── error/          # 错误监控
│   ├── performance/    # 性能概览
│   ├── sourcemap/      # SourceMap管理
│   └── settings/       # 设置页面
├── App.vue             # 根组件
└── main.ts             # 入口文件
```

### 技术栈选择

- **Vue 3 + TypeScript**: 提供类型安全和更好的开发体验
- **Vite**: 快速的开发服务器和构建工具
- **Vue Router**: 路由管理
- **Pinia**: 状态管理，Vue 3官方推荐的状态管理库
- **Element Plus**: UI组件库，提供丰富的组件
- **Axios**: HTTP请求库
- **ECharts**: 图表库，用于数据可视化
- **rrweb-player**: 录屏回放组件

## 开发规范

### 命名规范

- **文件命名**: 使用kebab-case（短横线命名法），如`time-range-selector.vue`
- **组件命名**: 使用PascalCase（大驼峰命名法），如`TimeRangeSelector`
- **变量命名**: 使用camelCase（小驼峰命名法），如`timeRange`
- **常量命名**: 使用UPPER_SNAKE_CASE（大写下划线命名法），如`MAX_COUNT`

### 代码风格

- 使用TypeScript类型定义，提高代码可维护性
- 使用ESLint和Prettier保持代码风格一致
- 组件使用Composition API，提高代码可读性和可维护性
- 使用异步组件和路由懒加载，提高应用性能

### 组件设计原则

- **单一职责**: 每个组件只负责一个功能
- **可复用性**: 抽象通用逻辑为可复用组件
- **可测试性**: 组件设计应便于单元测试
- **松耦合**: 组件之间通过props和事件通信，减少直接依赖

## 状态管理

### Pinia Store设计

```typescript
// 定义状态接口
interface AppState {
  appId: string;
  timeRange: TimeRange;
  startTime: string;
  endTime: string;
}

// 创建Store
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    // 状态初始值
  }),
  
  getters: {
    // 计算属性
  },
  
  actions: {
    // 修改状态的方法
  }
});
```

### 状态管理最佳实践

- 将全局状态放在Pinia Store中
- 将组件内部状态使用ref/reactive管理
- 使用计算属性（computed）派生状态
- 使用actions封装业务逻辑

## API请求封装

### Axios封装

```typescript
// 创建axios实例
const service = axios.create({
  baseURL: '/api/v1',
  timeout: 15000
});

// 请求拦截器
service.interceptors.request.use(/* ... */);

// 响应拦截器
service.interceptors.response.use(/* ... */);

// 封装请求方法
export function get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config });
}
```

### API请求最佳实践

- 统一处理请求和响应
- 使用TypeScript泛型定义响应类型
- 统一处理错误
- 添加请求日志，方便调试

## 路由管理

### 路由配置

```typescript
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../components/layout/Layout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '概览', icon: 'DataLine' }
      },
      // 其他路由...
    ]
  }
];
```

### 路由最佳实践

- 使用路由懒加载，提高首屏加载速度
- 使用路由元数据（meta）存储路由相关信息
- 使用路由守卫处理权限控制
- 使用命名路由和命名视图，提高可维护性

## 组件开发

### 组件基本结构

```vue
<script setup lang="ts">
// 导入依赖
import { ref, computed, onMounted } from 'vue';

// 定义props
const props = defineProps<{
  // props类型定义
}>();

// 定义事件
const emit = defineEmits<{
  // 事件类型定义
}>();

// 组件逻辑
// ...

// 生命周期钩子
onMounted(() => {
  // 初始化逻辑
});
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### 组件开发最佳实践

- 使用`<script setup>`语法，简化组件代码
- 使用TypeScript定义props和事件类型
- 使用计算属性处理派生数据
- 使用生命周期钩子处理副作用
- 使用scoped样式，避免样式污染
