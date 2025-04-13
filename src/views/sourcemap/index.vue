<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '../../store/app'
import { getSourceMaps } from '../../api'
import { ElMessage } from 'element-plus'
import SourceMapUploader from '../../components/sourcemap/SourceMapUploader.vue'
import SourceMapList from '../../components/sourcemap/SourceMapList.vue'
import type { SourceMapFile } from '../../api'

const appStore = useAppStore()

// SourceMap文件列表
const sourceMapFiles = ref<SourceMapFile[]>([])

// 加载状态
const loading = ref(false)

// 加载SourceMap文件列表
const loadSourceMapFiles = async () => {
	if (!appStore.appId) {
		ElMessage.warning('请先选择应用')
		return
	}

	loading.value = true
	console.log('加载SourceMap文件列表...')
	console.log('应用ID:', appStore.appId)

	try {
		const data = await getSourceMaps(appStore.appId)
		console.log('SourceMap文件列表:', data)
		sourceMapFiles.value = data
	} catch (error) {
		console.error('加载SourceMap文件列表失败:', error)
		ElMessage.error('加载SourceMap文件列表失败')
	} finally {
		loading.value = false
	}
}

// 处理上传成功
const handleUploadSuccess = () => {
	console.log('上传成功，重新加载文件列表')
	loadSourceMapFiles()
}

// 处理删除成功
const handleDeleteSuccess = () => {
	console.log('删除成功，重新加载文件列表')
	loadSourceMapFiles()
}

// 监听应用ID变化
watch(
	() => appStore.appId,
	(newAppId, oldAppId) => {
		if (newAppId !== oldAppId) {
			console.log('应用ID变化:', newAppId)
			loadSourceMapFiles()
		}
	},
)

onMounted(() => {
	console.log('Sourcemap页面已挂载')
	console.log('当前应用ID:', appStore.appId)
	loadSourceMapFiles()
})
</script>

<template>
	<div class="sourcemap-container">
		<div class="sourcemap-header">
			<h2 class="page-title">SourceMap管理</h2>
			<p class="page-description">上传和管理应用的SourceMap文件，用于错误堆栈还原</p>
		</div>

		<!-- SourceMap文件上传组件 -->
		<SourceMapUploader :app-id="appStore.appId" :on-success="handleUploadSuccess" />

		<!-- SourceMap文件列表组件 -->
		<SourceMapList :data="sourceMapFiles" :loading="loading" :on-delete="handleDeleteSuccess" />
	</div>
</template>

<style scoped lang="less">
.sourcemap-container {
	padding: 20px;

	.sourcemap-header {
		margin-bottom: 20px;

		.page-title {
			margin: 0 0 10px 0;
			font-size: 24px;
			font-weight: 600;
			color: #303133;
		}

		.page-description {
			margin: 0;
			font-size: 14px;
			color: #606266;
		}
	}
}
</style>
