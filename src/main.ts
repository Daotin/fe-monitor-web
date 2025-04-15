import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import pinia from './store'
import App from './App.vue'

import './style.css'
import 'element-plus/dist/index.css'

// 导入Mock服务
import './mock'

import Monitor from 'dt-monitor-sdk'

const monitor = new Monitor({
	appId: 'your-app-id',
	reportUrl: 'https://your-server.com/report',
	plugins: ['jsError'],
	sampling: 1, // 100% 采样率
	maxQueueSize: 2,
	pluginsConfig: {
		// rrweb 插件配置
		rrweb: {
			recordMode: 'error', // 仅在错误发生时上报录屏
			maxRecordingTime: 10000, // 最大录制时长(毫秒)
			maskAllInputs: true, // 遮罩所有输入框内容
		},
		// 行为栈插件配置
		behaviorStack: {
			maxStackSize: 30, // 行为栈最大长度
			reportWithError: true, // 在错误发生时上报行为栈
		},
	},
})
monitor.init()

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

// 使用插件
app.use(ElementPlus)
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')

console.log('前端监控数据大屏应用已启动')
