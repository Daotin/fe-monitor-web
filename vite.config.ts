import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
	base: './',
	plugins: [vue()],
	// 配置@
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	// 构建配置
	build: {
		// 指定输出目录
		outDir: 'dist',
		// 生成静态资源的相对目录
		assetsDir: 'assets',
		// 小于此阈值的导入或引用资源将内联为base64编码
		assetsInlineLimit: 4096,
		// 启用/禁用CSS代码拆分
		cssCodeSplit: true,
		// 构建后是否生成source map文件
		sourcemap: true,
		// 自定义底层的rollup打包配置
		rollupOptions: {
			output: {
				// 确保外部化的模块不会被重命名
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

				manualChunks(id, { getModuleInfo }) {
					// 获取模块信息
					const moduleInfo = getModuleInfo(id)
					if (!moduleInfo) return

					// 将 node_modules 中的代码单独打包
					if (id.includes('node_modules')) {
						// element-plus 相关打包
						if (id.includes('element-plus')) {
							return 'element-plus'
						}
						if (id.includes('@element-plus')) {
							return 'element-plus-icons'
						}
						// echarts 相关打包
						if (id.includes('echarts') || id.includes('zrender')) {
							return 'echarts'
						}
						// lodash 单独打包
						if (id.includes('lodash-es')) {
							return 'lodash'
						}
						// vue 相关打包
						if (id.includes('vue') || id.includes('@vue')) {
							return 'vue-vendor'
						}
						// 状态管理相关打包
						if (id.includes('pinia') || id.includes('vuex')) {
							return 'store-vendor'
						}
						// 工具库打包
						if (id.includes('@vueuse') || id.includes('axios')) {
							return 'utils-vendor'
						}
						// 剩余 node_modules 打包
						return 'vendor'
					}

					// 将小模块合并到它们的引用者中
					const importers = moduleInfo.importers
					if (importers && importers.length === 1) {
						const importer = importers[0]
						const importerInfo = getModuleInfo(importer)
						if (importerInfo && !importerInfo.isEntry) {
							return null // 返回 null 使其合并到引用者的chunk中
						}
					}

					// 将所有 Components 组件库集中打包
					if (id.includes('src/components')) {
						return 'components'
					}
					// 将所有 Utils 工具库集中打包
					if (id.includes('src/utils')) {
						return 'utils'
					}
				},
			},
		},
	},
})
