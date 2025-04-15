# 前端监控数据大屏项目开发问题记录

## 第一阶段：项目基础架构搭建

### 问题 1：Windows PowerShell 命令行问题

**问题描述**：
在 Windows PowerShell 中使用 Linux 风格的命令（如`mkdir -p`或使用`&&`连接多个命令）会导致错误。

**解决方案**：

- 使用 PowerShell 原生命令，如`New-Item -ItemType Directory -Path path1, path2 -Force`代替`mkdir -p`
- 使用分号`;`代替`&&`连接多个命令

### 问题 2：SVG 图片在 Vue 中的使用

**问题描述**：
在 Vue 组件中直接引用 SVG 文件可能会有兼容性问题。

**解决方案**：

- 创建了简单的 SVG 文件作为 logo
- 在实际项目中，可能需要使用`vite-plugin-svg-icons`等插件更好地处理 SVG 图标

### 问题 3：API 接口模拟

**问题描述**：
在前端开发阶段，后端 API 可能尚未完成，需要模拟数据。

**解决方案**：

- 在第二阶段开发中，使用 Mock.js 模拟 API 响应
- 创建了 mock 目录和相关模块文件，按功能划分模拟数据

## 第二阶段：概览页（Dashboard）开发

### 问题 1：ECharts 在 Vue 3 中的使用

**问题描述**：
在 Vue 3 中使用 ECharts 需要注意组件生命周期和实例管理。

**解决方案**：

- 使用 ref 获取 DOM 元素，并在 onMounted 钩子中初始化图表
- 使用 onBeforeUnmount 钩子清理图表实例，避免内存泄漏
- 监听窗口大小变化，调整图表大小

### 问题 2：响应式布局适配

**问题描述**：
在不同屏幕尺寸下，需要保证页面布局的合理性和美观性。

**解决方案**：

- 使用 Element Plus 的 Grid 系统，通过:xs、:sm、:md、:lg 属性设置不同屏幕尺寸下的列宽度
- 添加媒体查询（media queries）样式，在小屏幕下调整元素间距

### 问题 3：数据加载状态管理

**问题描述**：
需要在数据加载过程中显示加载状态，并处理可能的错误情况。

**解决方案**：

- 使用 ref 创建加载状态对象，分别管理不同模块的加载状态
- 在组件中使用 Element Plus 的 Skeleton 组件显示加载骨架屏
- 使用 try/catch/finally 结构处理异步请求，确保加载状态正确更新

### 问题 4：Mockjs 数据格式与组件期望不匹配

**问题描述**：
在使用 Mockjs 模拟 API 数据时，错误趋势图组件报错：`Uncaught (in promise) TypeError: props.data.map is not a function`，这是因为模拟数据的格式与组件期望的格式不匹配。

**解决方案**：

- 修改 mock 数据处理方式，确保返回的数据格式与组件期望的一致
- 简化 URL 参数解析逻辑，因为在使用 axios 的 params 参数时，这些参数不会直接出现在 URL 中
- 在返回数据前添加日志输出，便于调试和验证数据格式

## 自动部署相关问题

### 问题 1：GitHub Pages 部署路径问题

**问题描述**：
在使用 GitHub Pages 部署时，如果不配置 Vite 的 base 选项，会导致资源路径错误，页面无法正常加载。

**解决方案**：
在 `vite.config.ts` 中添加 `base` 配置，设置为仓库名称：

```typescript
export default defineConfig({
	// ...其他配置
	base: '/fe-monitor-web/',
})
```

### 问题 2：GitHub Actions 权限问题

**问题描述**：
在使用 GitHub Actions 部署到 GitHub Pages 时，可能会遇到权限不足的问题。

**解决方案**：
确保仓库设置中已启用 GitHub Pages，并且 GitHub Actions 有写入权限。可以在仓库的 Settings > Actions > General > Workflow permissions 中设置为 "Read and write permissions"。
