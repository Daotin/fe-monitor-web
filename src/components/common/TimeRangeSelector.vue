<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore, type TimeRange } from '../../store/app'

// 定义事件
const emit = defineEmits(['change'])

const appStore = useAppStore()

// 时间范围选项
const timeRangeOptions = [
	{ label: '今日', value: 'today' },
	{ label: '昨日', value: 'yesterday' },
	{ label: '最近7天', value: '7days' },
	{ label: '最近30天', value: '30days' },
	{ label: '最近90天', value: '90days' },
]

// 当前选中的时间范围
const selectedTimeRange = ref<TimeRange>(appStore.timeRange)

// 处理时间范围变化
const handleTimeRangeChange = (value: TimeRange) => {
	selectedTimeRange.value = value
	emit('change', value)
	console.log('时间范围已变更:', value)
}
</script>

<template>
	<div class="time-range-selector">
		<el-radio-group v-model="selectedTimeRange" @change="handleTimeRangeChange">
			<el-radio-button v-for="option in timeRangeOptions" :key="option.value" :value="option.value">
				{{ option.label }}
			</el-radio-button>
		</el-radio-group>
	</div>
</template>

<style scoped>
.time-range-selector {
	display: flex;
	align-items: center;
}
</style>
