import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
	// 配置base，用于GitHub Pages部署
	base: './',
	plugins: [vue()],
	// 配置@
	resolve: {
		alias: {
			'@': '/src',
		},
	},
})
