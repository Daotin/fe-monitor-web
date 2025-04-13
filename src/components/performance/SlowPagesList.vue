<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatPerformanceTime } from '../../utils'
import type { SlowPage } from '../../api'

interface Props {
	data: SlowPage[]
	loading: boolean
	metric: string
}

const props = withDefaults(defineProps<Props>(), {
	data: () => [],
	loading: false,
	metric: 'lcp',
})

// 定义emit事件
const emit = defineEmits<{
	(e: 'update:metric', value: string): void
}>()

// 指标名称映射
const metricNames = {
	lcp: 'LCP (最大内容绘制)',
	fcp: 'FCP (首次内容绘制)',
}

// 计算当前指标名称
const currentMetricName = computed(() => {
	return metricNames[props.metric as keyof typeof metricNames] || props.metric.toUpperCase()
})

// 根据性能值获取状态颜色
const getStatusColor = (value: number, metric: string) => {
	// 根据不同指标设置不同的阈值
	const thresholds = {
		lcp: { good: 2500, needsImprovement: 4000 },
		fcp: { good: 1000, needsImprovement: 2500 },
	}

	const threshold = thresholds[metric as keyof typeof thresholds] || thresholds.lcp

	if (value <= threshold.good) {
		return '#67C23A' // 绿色 - 良好
	} else if (value <= threshold.needsImprovement) {
		return '#E6A23C' // 黄色 - 需要改进
	} else {
		return '#F56C6C' // 红色 - 较差
	}
}

// 格式化URL显示
const formatUrl = (url: string) => {
	// 如果URL过长，截断显示
	const maxLength = 40
	if (url.length > maxLength) {
		return url.substring(0, maxLength) + '...'
	}
	return url
}
</script>

<template>
	<el-card class="slow-pages-card">
		<template #header>
			<div class="card-header">
				<span class="title">Top 5 慢页面</span>
				<el-radio-group
					:model-value="props.metric"
					@update:model-value="val => emit('update:metric', val)"
					size="small">
					<el-radio-button label="lcp">LCP</el-radio-button>
					<el-radio-button label="fcp">FCP</el-radio-button>
				</el-radio-group>
			</div>
		</template>

		<div v-if="loading" class="loading-container">
			<el-skeleton animated :rows="5" />
		</div>

		<div v-else-if="data.length === 0" class="empty-container">
			<el-empty description="暂无数据" :image-size="80" />
		</div>

		<div v-else class="pages-list">
			<div class="list-header">
				<span class="url-header">页面URL</span>
				<span class="value-header">{{ currentMetricName }}</span>
			</div>

			<div v-for="(page, index) in data" :key="index" class="page-item">
				<div class="page-url" :title="page.url">{{ formatUrl(page.url) }}</div>
				<div class="page-value" :style="{ color: getStatusColor(page.value, props.metric) }">
					{{ formatPerformanceTime(page.value) }}
				</div>
			</div>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.slow-pages-card {
	height: 100%;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.title {
			font-size: 16px;
			font-weight: 600;
		}
	}

	.loading-container,
	.empty-container {
		min-height: 250px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pages-list {
		.list-header {
			display: flex;
			justify-content: space-between;
			padding: 0 10px 10px;
			margin-bottom: 10px;
			border-bottom: 1px solid #ebeef5;
			font-weight: 600;
			color: #606266;

			.url-header {
				flex: 1;
			}

			.value-header {
				width: 120px;
				text-align: right;
			}
		}

		.page-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 12px 10px;
			border-bottom: 1px solid #ebeef5;

			&:last-child {
				border-bottom: none;
			}

			&:hover {
				background-color: #f5f7fa;
			}

			.page-url {
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.page-value {
				width: 120px;
				text-align: right;
				font-weight: 600;
			}
		}
	}
}
</style>
