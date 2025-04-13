<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '../../store/app'
import { getErrors } from '../../api'
import { ElMessage } from 'element-plus'
import ErrorFilter from '../../components/error/ErrorFilter.vue'
import ErrorTable from '../../components/error/ErrorTable.vue'
import type { ErrorItem } from '../../api'

const appStore = useAppStore()

// 错误列表数据
const errorList = ref<ErrorItem[]>([])
// 错误总数
const total = ref(0)
// 加载状态
const loading = ref(false)

// 分页和筛选参数
const page = ref(1)
const pageSize = ref(20)
const errorType = ref('')
const sortBy = ref('lastSeen_desc')

// 获取错误列表数据
const fetchErrorList = async () => {
	try {
		loading.value = true
		console.log('获取错误列表数据，参数:', {
			appId: appStore.appId,
			startTime: appStore.startTime,
			endTime: appStore.endTime,
			page: page.value,
			limit: pageSize.value,
			sortBy: sortBy.value,
			errorType: errorType.value,
		})

		// 构建API请求参数
		const params: any = {
			appId: appStore.appId,
			startTime: appStore.startTime,
			endTime: appStore.endTime,
			page: page.value,
			limit: pageSize.value,
			sortBy: sortBy.value,
		}

		// 如果有错误类型筛选，添加到参数中
		if (errorType.value) {
			params.errorType = errorType.value
		}

		const data = await getErrors(
			appStore.appId,
			appStore.startTime,
			appStore.endTime,
			page.value,
			pageSize.value,
			sortBy.value,
		)

		errorList.value = data.items
		total.value = data.total
		console.log('错误列表数据:', data)
	} catch (error) {
		console.error('获取错误列表数据失败:', error)
		ElMessage.error('获取错误列表数据失败')
	} finally {
		loading.value = false
	}
}

// 监听时间范围变化，重新加载数据
watch(
	() => [appStore.appId, appStore.startTime, appStore.endTime],
	() => {
		page.value = 1 // 重置为第一页
		fetchErrorList()
	},
)

// 刷新数据
const refreshData = () => {
	fetchErrorList()
}

onMounted(() => {
	console.log('Error页面已挂载')
	fetchErrorList()
})
</script>

<template>
	<div class="error-container">
		<div class="error-header">
			<h2 class="page-title">错误监控</h2>
			<p class="page-description">查看和分析应用中的JavaScript错误</p>
		</div>

		<!-- 筛选组件 -->
		<ErrorFilter v-model:error-type="errorType" v-model:sort-by="sortBy" @refresh="refreshData" />

		<!-- 错误列表表格 -->
		<ErrorTable
			:data="errorList"
			:total="total"
			:loading="loading"
			:page="page"
			:page-size="pageSize"
			:sort-by="sortBy"
			@update:page="page = $event"
			@update:page-size="pageSize = $event"
			@update:sort-by="sortBy = $event"
			@refresh="refreshData" />
	</div>
</template>

<style scoped lang="less">
.error-container {
	padding: 20px;
}

.error-header {
	margin-bottom: 20px;
}

.page-title {
	margin: 0 0 10px 0;
	font-size: 24px;
	font-weight: 600;
	color: #303133;
}

.page-description {
	margin: 0;
	color: #606266;
	font-size: 14px;
}
</style>
