<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAppStore } from '../../store/app'
import { getStats, getErrorTrend, getErrors } from '../../api'
import { ElMessage } from 'element-plus'
import StatCard from '../../components/dashboard/StatCard.vue'
import ErrorTrendChart from '../../components/dashboard/ErrorTrendChart.vue'
import ErrorList, { type ErrorItem } from '../../components/dashboard/ErrorList.vue'
import TimeRangeSelector from '@/components/common/TimeRangeSelector.vue'

const appStore = useAppStore()

// 核心指标数据
const statsData = ref({
	pvCount: 0,
	uvCount: 0,
	jsErrorCount: 0,
	lcpAvg: 0,
})

// 错误趋势数据
const errorTrendData = ref<Array<{ date: string; count: number }>>([])

// 错误列表数据
const errorListData = ref<ErrorItem[]>([])

// 加载状态
const loading = ref({
	stats: true,
	trend: true,
	list: true,
})

// 获取核心统计指标
const fetchStats = async () => {
	try {
		loading.value.stats = true
		console.log('获取核心统计指标，参数:', {
			appId: appStore.appId,
			startTime: appStore.startTime,
			endTime: appStore.endTime,
		})

		const data = await getStats(appStore.appId, appStore.startTime, appStore.endTime)
		statsData.value = data
		console.log('核心统计指标数据:', data)
	} catch (error) {
		console.error('获取核心统计指标失败:', error)
		ElMessage.error('获取核心统计指标失败')
	} finally {
		loading.value.stats = false
	}
}

// 获取错误趋势数据
const fetchErrorTrend = async () => {
	try {
		loading.value.trend = true
		console.log('获取错误趋势数据，参数:', {
			appId: appStore.appId,
			startTime: appStore.startTime,
			endTime: appStore.endTime,
			interval: 'day',
		})

		const data = await getErrorTrend(appStore.appId, appStore.startTime, appStore.endTime, 'day')
		errorTrendData.value = data
		console.log('✅错误趋势数据:', data)
	} catch (error) {
		console.error('获取错误趋势数据失败:', error)
		ElMessage.error('获取错误趋势数据失败')
	} finally {
		loading.value.trend = false
	}
}

// 获取错误列表数据
const fetchErrorList = async () => {
	try {
		loading.value.list = true
		console.log('获取错误列表数据，参数:', {
			appId: appStore.appId,
			startTime: appStore.startTime,
			endTime: appStore.endTime,
			page: 1,
			limit: 5,
			sortBy: 'count_desc',
		})

		const data = await getErrors(appStore.appId, appStore.startTime, appStore.endTime, 1, 5, 'count_desc')
		errorListData.value = data.items
		console.log('错误列表数据:', data)
	} catch (error) {
		console.error('获取错误列表数据失败:', error)
		ElMessage.error('获取错误列表数据失败')
	} finally {
		loading.value.list = false
	}
}

// 加载所有数据
const loadAllData = () => {
	fetchStats()
	fetchErrorTrend()
	fetchErrorList()
}

// 设置时间范围
const handleTimeRangeChange = (timeRange: TimeRange) => {
	appStore.setTimeRange(timeRange)
}

// 监听时间范围变化，重新加载数据
watch(
	() => [appStore.appId, appStore.startTime, appStore.endTime],
	() => {
		loadAllData()
	},
)

onMounted(() => {
	console.log('Dashboard页面已挂载')
	console.log('当前应用ID:', appStore.appId)
	console.log('当前时间范围:', appStore.timeRange)
	console.log('开始时间:', appStore.startTime)
	console.log('结束时间:', appStore.endTime)

	// 加载数据
	loadAllData()
})
</script>

<template>
	<div class="dashboard-container">
		<el-row class="time-filter">
			<TimeRangeSelector @change="handleTimeRangeChange" />
		</el-row>
		<!-- 核心指标卡片 -->
		<el-row :gutter="20" class="stat-cards">
			<el-col :xs="24" :sm="12" :md="6">
				<StatCard
					title="页面访问量 (PV)"
					:value="statsData.pvCount"
					icon="View"
					color="#409EFF"
					:loading="loading.stats" />
			</el-col>
			<el-col :xs="24" :sm="12" :md="6">
				<StatCard
					title="独立访客数 (UV)"
					:value="statsData.uvCount"
					icon="User"
					color="#67C23A"
					:loading="loading.stats" />
			</el-col>
			<el-col :xs="24" :sm="12" :md="6">
				<StatCard
					title="JS错误数"
					:value="statsData.jsErrorCount"
					icon="Warning"
					color="#F56C6C"
					:loading="loading.stats" />
			</el-col>
			<el-col :xs="24" :sm="12" :md="6">
				<StatCard
					title="LCP均值"
					:value="statsData.lcpAvg"
					icon="Timer"
					color="#E6A23C"
					:loading="loading.stats"
					:is-performance="true" />
			</el-col>
		</el-row>

		<!-- 错误趋势图和错误列表 -->
		<el-row :gutter="20" class="charts-container">
			<el-col :xs="24" :lg="14">
				<ErrorTrendChart :data="errorTrendData" :loading="loading.trend" />
			</el-col>
			<el-col :xs="24" :lg="10">
				<ErrorList :data="errorListData" :loading="loading.list" />
			</el-col>
		</el-row>
	</div>
</template>

<style scoped>
.dashboard-container {
	padding: 20px;
}

.time-filter {
	margin-bottom: 20px;
}

.stat-cards {
	margin-bottom: 20px;
}

.charts-container {
	margin-bottom: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
	.stat-cards > .el-col {
		margin-bottom: 20px;
	}

	.charts-container > .el-col {
		margin-bottom: 20px;
	}
}
</style>
