<script setup lang="ts">
import { watch, reactive } from 'vue'
import { useAppStore } from '../../store/app'
import TimeRangeSelector from '../common/TimeRangeSelector.vue'
import type { TimeRange } from '../../store/app'

// 错误类型选项
const errorTypes = [
	{ value: '', label: '全部类型' },
	{ value: 'TypeError', label: 'TypeError' },
	{ value: 'ReferenceError', label: 'ReferenceError' },
	{ value: 'SyntaxError', label: 'SyntaxError' },
	{ value: 'RangeError', label: 'RangeError' },
	{ value: 'URIError', label: 'URIError' },
	{ value: 'EvalError', label: 'EvalError' },
	{ value: 'InternalError', label: 'InternalError' },
]

// 排序选项
const sortOptions = [
	{ value: 'lastSeen_desc', label: '最近发生' },
	{ value: 'count_desc', label: '发生次数 (多到少)' },
	{ value: 'count_asc', label: '发生次数 (少到多)' },
	{ value: 'userCount_desc', label: '影响用户数 (多到少)' },
	{ value: 'userCount_asc', label: '影响用户数 (少到多)' },
	{ value: 'firstSeen_desc', label: '首次发生 (新到旧)' },
	{ value: 'firstSeen_asc', label: '首次发生 (旧到新)' },
]

// 定义组件属性
interface Props {
	errorType?: string
	sortBy?: string
}

const props = withDefaults(defineProps<Props>(), {
	errorType: '',
	sortBy: 'lastSeen_desc',
})

// 定义事件
const emit = defineEmits(['update:errorType', 'update:sortBy', 'refresh'])

const appStore = useAppStore()

// 表单数据
const formData = reactive({
	errorType: props.errorType,
	sortBy: props.sortBy,
})

// 监听属性变化
watch(
	() => props.errorType,
	newVal => {
		formData.errorType = newVal
	},
)

watch(
	() => props.sortBy,
	newVal => {
		formData.sortBy = newVal
	},
)

// 错误类型变化处理
const handleErrorTypeChange = (value: string) => {
	emit('update:errorType', value)
	emit('refresh')
}

// 排序方式变化处理
const handleSortChange = (value: string) => {
	emit('update:sortBy', value)
	emit('refresh')
}

// 时间范围变化处理
const handleTimeRangeChange = (timeRange: TimeRange) => {
	appStore.setTimeRange(timeRange)
	// 时间范围变化会触发父组件的watch，自动刷新数据
	console.log('时间范围变化:', timeRange)
}

// 刷新数据
const refreshData = () => {
	console.log('手动刷新数据')
	emit('refresh')
}
</script>

<template>
	<div class="error-filter">
		<el-card shadow="never" class="filter-card">
			<el-form :model="formData" label-position="left" class="filter-form">
				<el-row :gutter="20">
					<!-- 时间范围选择器 -->
					<el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
						<el-form-item label="时间范围">
							<TimeRangeSelector @change="handleTimeRangeChange" />
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
						<!-- 错误类型筛选 -->
						<el-form-item label="错误类型">
							<el-select
								v-model="formData.errorType"
								placeholder="错误类型"
								clearable
								@change="handleErrorTypeChange"
								class="full-width">
								<el-option v-for="item in errorTypes" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
						<!-- 排序方式 -->
						<el-form-item label="排序方式">
							<el-select v-model="formData.sortBy" placeholder="排序方式" @change="handleSortChange" class="full-width">
								<el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4" class="action-col">
						<!-- 刷新按钮 -->
						<el-form-item label="" class="button-form-item">
							<el-button type="primary" @click="refreshData" class="refresh-button">
								<el-icon><Refresh /></el-icon>
								刷新
							</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-card>
	</div>
</template>

<style scoped lang="less">
.error-filter {
	margin-bottom: 20px;

	.filter-card {
		background-color: #f5f7fa;
	}

	.filter-form {
		width: 100%;

		.full-width {
			width: 100%;
		}

		.button-form-item {
			// 对齐其他表单项的输入框
			margin-top: 32px;

			@media (max-width: 992px) {
				margin-top: 0;
			}
		}

		.refresh-button {
			width: 100%;
		}
	}

	// 表单项样式
	:deep(.el-form-item__label) {
		padding-bottom: 4px;
		font-weight: 500;
	}

	// 表单项内容样式
	:deep(.el-form-item__content) {
		line-height: 32px;
	}

	// 时间范围选择器样式
	:deep(.el-date-editor) {
		width: 100%;
	}

	// 响应式调整
	@media (max-width: 768px) {
		.action-col {
			margin-top: 10px;
		}
	}
}
</style>
