# 前端监控数据大屏项目开发问题记录

## 第一阶段：项目基础架构搭建

### 问题1：Windows PowerShell命令行问题

**问题描述**：
在Windows PowerShell中使用Linux风格的命令（如`mkdir -p`或使用`&&`连接多个命令）会导致错误。

**解决方案**：
- 使用PowerShell原生命令，如`New-Item -ItemType Directory -Path path1, path2 -Force`代替`mkdir -p`
- 使用分号`;`代替`&&`连接多个命令

### 问题2：SVG图片在Vue中的使用

**问题描述**：
在Vue组件中直接引用SVG文件可能会有兼容性问题。

**解决方案**：
- 创建了简单的SVG文件作为logo
- 在实际项目中，可能需要使用`vite-plugin-svg-icons`等插件更好地处理SVG图标

### 问题3：API接口模拟

**问题描述**：
在前端开发阶段，后端API可能尚未完成，需要模拟数据。

**解决方案**：
- 在下一阶段开发中，可以考虑使用Mock.js或MSW(Mock Service Worker)来模拟API响应
- 或者创建本地JSON文件作为模拟数据源
