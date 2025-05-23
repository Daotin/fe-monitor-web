import { createRouter, createWebHistory, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/',
		name: 'Layout',
		component: () => import('../components/layout/Layout.vue'),
		children: [
			{
				path: '/dashboard',
				name: 'Dashboard',
				component: () => import('../views/dashboard/index.vue'),
				meta: { title: '概览', icon: 'DataLine' },
			},
			{
				path: '/error',
				name: 'Error',
				component: () => import('../views/error/index.vue'),
				meta: { title: '错误监控', icon: 'Warning' },
			},
			{
				path: '/performance',
				name: 'Performance',
				component: () => import('../views/performance/index.vue'),
				meta: { title: '性能概览', icon: 'TrendCharts' },
			},
			{
				path: '/sourcemap',
				name: 'Sourcemap',
				component: () => import('../views/sourcemap/index.vue'),
				meta: { title: 'SourceMap管理', icon: 'Upload' },
			},
			{
				path: '/settings',
				name: 'Settings',
				component: () => import('../views/settings/index.vue'),
				meta: { title: '设置', icon: 'Setting' },
			},
			{
				path: '/demo',
				name: 'Demo',
				component: () => import('../views/demo/index.vue'),
				meta: { title: '错误采集演示', icon: 'Monitor' },
			},
		],
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('../views/404.vue'),
	},
]

// 创建路由实例
const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
