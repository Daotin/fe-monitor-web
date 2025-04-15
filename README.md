# 前端监控数据大屏

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.9-409eff)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6)](https://www.typescriptlang.org/)
[![Deploy](https://github.com/yourusername/fe-monitor-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/fe-monitor-web/actions/workflows/deploy.yml)

## 项目介绍

前端监控数据大屏是一个基于 Vue 3 + TypeScript + Vite 开发的前端监控可视化平台，用于展示和分析前端应用的性能指标、错误信息、用户行为等监控数据。该项目提供了直观的数据展示界面，帮助开发者快速定位和解决前端应用中的问题。

## 功能特性

- **概览页 (Dashboard)**：展示核心监控指标、错误趋势和 Top 错误列表
- **错误监控**：详细的 JavaScript 错误列表，支持查看源码、播放录屏和查看用户行为
- **性能概览**：展示 LCP、FCP 等核心性能指标，以及慢页面列表和资源错误列表
- **SourceMap 管理**：上传和管理 SourceMap 文件，用于错误堆栈还原
- **设置页面**：配置应用参数和监控选项

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **UI 组件库**：Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **HTTP 请求**：Axios
- **数据可视化**：ECharts
- **录屏回放**：rrweb-player
- **样式处理**：Less
- **数据模拟**：Mock.js

## 项目结构

```
src/
├── api/                # API接口
│   ├── request.ts      # Axios封装
│   └── index.ts        # API接口定义
├── assets/             # 静态资源
├── components/         # 公共组件
│   ├── common/         # 通用组件
│   ├── dashboard/      # 概览页组件
│   ├── error/          # 错误监控组件
│   ├── layout/         # 布局组件
│   ├── performance/    # 性能概览组件
│   └── sourcemap/      # SourceMap管理组件
├── mock/               # Mock数据
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

## 安装与运行

### 环境要求

- Node.js 18.0 或更高版本
- npm 8.0 或更高版本

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 自动部署

本项目使用 GitHub Actions 自动部署到 GitHub Pages。

### 部署流程

1. 当代码推送到 `main` 分支时，自动触发部署流程
2. GitHub Actions 会执行以下步骤：
   - 检出代码
   - 设置 Node.js 环境
   - 安装依赖
   - 构建项目
   - 部署到 GitHub Pages

### 手动触发部署

你也可以在 GitHub 仓库的 Actions 页面手动触发部署流程。

## 主要页面

### 概览页 (Dashboard)

概览页展示了应用的核心监控指标，包括：

- 页面访问量 (PV)
- 独立访客数 (UV)
- JavaScript 错误数
- LCP 均值（加载性能指标）
- 错误趋势图表
- Top 5 JavaScript 错误列表

### 错误监控页面

错误监控页面提供了详细的 JavaScript 错误列表，支持：

- 按错误类型筛选
- 按发生次数或最近发生时间排序
- 查看错误源码（通过 SourceMap 还原）
- 播放错误发生时的用户操作录屏
- 查看用户行为栈，了解错误发生前的用户操作

### 性能概览页面

性能概览页面展示了应用的性能指标，包括：

- LCP (Largest Contentful Paint) 和 FCP (First Contentful Paint) 指标
- 加载最慢的页面列表
- 资源加载错误列表

### SourceMap 管理页面

SourceMap 管理页面用于上传和管理 SourceMap 文件，支持：

- 上传 SourceMap 文件
- 查看已上传的 SourceMap 文件列表
- 删除不需要的 SourceMap 文件

## 数据模拟

本项目使用 Mock.js 模拟后端 API 数据，模拟数据定义在`src/mock`目录下。在实际项目中，可以替换为真实的 API 接口。

## 开发指南

详细的开发指南请参考`docs/guide.md`文件，其中包含了项目架构设计、开发规范、状态管理、API 请求封装、路由管理和组件开发等内容。

## 项目进度

项目已完成所有计划功能的开发，详细进度请参考`docs/progress.md`文件。

## 问题记录

开发过程中遇到的问题和解决方案记录在`docs/issue.md`文件中。

## 许可证

[MIT](LICENSE)
