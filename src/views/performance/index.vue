<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '../../store/app'
import { getPerformanceSummary, getSlowPages, getResourceErrors } from '../../api'
import { ElMessage } from 'element-plus'
import PerformanceMetricCard from '../../components/performance/PerformanceMetricCard.vue'
import SlowPagesList from '../../components/performance/SlowPagesList.vue'
import ResourceErrorsList from '../../components/performance/ResourceErrorsList.vue'
import TimeRangeSelector from '@/components/common/TimeRangeSelector.vue'

const appStore = useAppStore()

// 性能指标数据
const performanceData = ref({
	lcp: {
		avg: 0,
		p75: 0,
	},
	fcp: {
		avg: 0,
		p75: 0,
	},
})

// 慢页面数据
const slowPagesData = ref([])
const selectedMetric = ref('lcp')

// 资源错误数据
const resourceErrorsData = ref([])

// 加载状态
const loading = ref({
	performance: false,
	slowPages: false,
	resourceErrors: false,
})

// 加载性能指标数据
const loadPerformanceData = async () => {
	loading.value.performance = true
	console.log('加载性能指标数据...')
	console.log('应用ID:', appStore.appId)
	console.log('开始时间:', appStore.startTime)
	console.log('结束时间:', appStore.endTime)

	try {
		const data = await getPerformanceSummary(appStore.appId, appStore.startTime, appStore.endTime)
		console.log('性能指标数据:', data)
		performanceData.value = data
	} catch (error) {
		console.error('加载性能指标数据失败:', error)
		ElMessage.error('加载性能指标数据失败')
	} finally {
		loading.value.performance = false
	}
}

// 加载慢页面数据
const loadSlowPagesData = async () => {
	loading.value.slowPages = true
	console.log('加载慢页面数据...')
	console.log('指标类型:', selectedMetric.value)

	try {
		const data = await getSlowPages(appStore.appId, appStore.startTime, appStore.endTime, selectedMetric.value, 5)
		console.log('慢页面数据:', data)
		slowPagesData.value = data
	} catch (error) {
		console.error('加载慢页面数据失败:', error)
		ElMessage.error('加载慢页面数据失败')
	} finally {
		loading.value.slowPages = false
	}
}

// 加载资源错误数据
const loadResourceErrorsData = async () => {
	loading.value.resourceErrors = true
	console.log('加载资源错误数据...')

	try {
		const data = await getResourceErrors(appStore.appId, appStore.startTime, appStore.endTime, 10)
		console.log('资源错误数据:', data)
		resourceErrorsData.value = data
	} catch (error) {
		console.error('加载资源错误数据失败:', error)
		ElMessage.error('加载资源错误数据失败')
	} finally {
		loading.value.resourceErrors = false
	}
}

// 刷新所有数据
const refreshAllData = () => {
	loadPerformanceData()
	loadSlowPagesData()
	loadResourceErrorsData()
}

// 处理时间范围变化
const handleTimeRangeChange = () => {
	console.log('时间范围变化:', appStore.timeRange)
	console.log('新的开始时间:', appStore.startTime)
	console.log('新的结束时间:', appStore.endTime)
	refreshAllData()
}

// 处理指标类型变化
const handleMetricChange = (metric: string) => {
	console.log('指标类型变化:', metric)
	selectedMetric.value = metric
	loadSlowPagesData()
}

// 监听应用ID变化
watch(
	() => appStore.appId,
	(newAppId, oldAppId) => {
		if (newAppId !== oldAppId) {
			console.log('应用ID变化:', newAppId)
			refreshAllData()
		}
	},
)

onMounted(() => {
	console.log('Performance页面已挂载')
	refreshAllData()
})
</script>

<template>
	<div class="performance-container">
		<div class="performance-header">
			<h2 class="page-title">性能概览</h2>
			<p class="page-description">查看和分析应用的核心性能指标</p>
		</div>

		<!-- 时间范围选择器 -->
		<el-row class="time-filter">
			<TimeRangeSelector @change="handleTimeRangeChange" />
		</el-row>

		<!-- 核心性能指标卡片 -->
		<el-row :gutter="20" class="metric-cards">
			<el-col :xs="24" :sm="12">
				<PerformanceMetricCard
					title="LCP (最大内容绘制)"
					:avg-value="performanceData.lcp.avg"
					:p75-value="performanceData.lcp.p75"
					icon="Timer"
					color="#E6A23C"
					:loading="loading.performance"
					:threshold="{ good: 2500, needsImprovement: 4000 }" />
			</el-col>
			<el-col :xs="24" :sm="12">
				<PerformanceMetricCard
					title="FCP (首次内容绘制)"
					:avg-value="performanceData.fcp.avg"
					:p75-value="performanceData.fcp.p75"
					icon="PictureFilled"
					color="#409EFF"
					:loading="loading.performance"
					:threshold="{ good: 1000, needsImprovement: 2500 }" />
			</el-col>
		</el-row>

		<!-- 慢页面列表和资源错误列表 -->
		<el-row :gutter="20" class="data-lists">
			<el-col :xs="24" :lg="12">
				<SlowPagesList
					:data="slowPagesData"
					:loading="loading.slowPages"
					:metric="selectedMetric"
					@update:metric="handleMetricChange" />
			</el-col>
			<el-col :xs="24" :lg="12">
				<ResourceErrorsList :data="resourceErrorsData" :loading="loading.resourceErrors" />
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="less">
.performance-container {
	padding: 20px;

	.performance-header {
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

	.time-filter {
		margin-bottom: 20px;
	}

	.metric-cards {
		margin-bottom: 20px;
	}

	.data-lists {
		margin-bottom: 20px;
	}

	/* 响应式调整 */
	@media (max-width: 768px) {
		.metric-cards > .el-col {
			margin-bottom: 20px;
		}

		.data-lists > .el-col {
			margin-bottom: 20px;
		}
	}
}
</style>
