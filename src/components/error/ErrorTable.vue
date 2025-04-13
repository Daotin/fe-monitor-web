<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { formatTimeAgo, truncateString } from '../../utils'
import type { ErrorItem } from '../../api'
import SourceCodeDialog from './dialogs/SourceCodeDialog.vue'
import RrwebPlayerDialog from './dialogs/RrwebPlayerDialog.vue'
import BehaviorStackDialog from './dialogs/BehaviorStackDialog.vue'

// 定义组件属性
interface Props {
	data: ErrorItem[]
	total: number
	loading?: boolean
	page?: number
	pageSize?: number
	sortBy?: string
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	page: 1,
	pageSize: 20,
	sortBy: 'lastSeen_desc',
})

// 定义事件
const emit = defineEmits(['update:page', 'update:pageSize', 'update:sortBy', 'refresh'])

// 当前页码
const currentPage = ref(props.page)
// 当前每页条数
const currentPageSize = ref(props.pageSize)
// 当前排序方式
const currentSortBy = ref(props.sortBy)

// 弹窗状态
const sourceCodeDialogVisible = ref(false)
const rrwebPlayerDialogVisible = ref(false)
const behaviorStackDialogVisible = ref(false)
const currentErrorId = ref('')

// 监听属性变化
watch(
	() => props.page,
	newVal => {
		currentPage.value = newVal
	},
)

watch(
	() => props.pageSize,
	newVal => {
		currentPageSize.value = newVal
	},
)

watch(
	() => props.sortBy,
	newVal => {
		currentSortBy.value = newVal
	},
)

// 页码变化处理
const handlePageChange = (page: number) => {
	currentPage.value = page
	emit('update:page', page)
	emit('refresh')
}

// 每页条数变化处理
const handleSizeChange = (size: number) => {
	currentPageSize.value = size
	currentPage.value = 1 // 重置为第一页
	emit('update:pageSize', size)
	emit('update:page', 1)
	emit('refresh')
}

// 排序变化处理
const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
	if (!prop || !order) return

	const sortOrder = order === 'descending' ? 'desc' : 'asc'
	const sortBy = `${prop}_${sortOrder}`

	currentSortBy.value = sortBy
	emit('update:sortBy', sortBy)
	emit('refresh')
}

// 查看源码
const viewSourceCode = (row: ErrorItem, event: Event) => {
	event.stopPropagation() // 阻止事件冒泡
	currentErrorId.value = row.sampleEventId
	sourceCodeDialogVisible.value = true
	console.log('查看源码:', row.sampleEventId)
}

// 播放录屏
const playRrweb = (row: ErrorItem, event: Event) => {
	event.stopPropagation() // 阻止事件冒泡
	currentErrorId.value = row.sampleEventId
	rrwebPlayerDialogVisible.value = true
	console.log('播放录屏:', row.sampleEventId)
}

// 查看用户行为
const viewBehaviorStack = (row: ErrorItem, event: Event) => {
	event.stopPropagation() // 阻止事件冒泡
	currentErrorId.value = row.sampleEventId
	behaviorStackDialogVisible.value = true
	console.log('查看用户行为:', row.sampleEventId)
}

// 计算错误类型的标签类型
const getErrorTypeTag = (type: string) => {
	const typeMap: Record<string, string> = {
		TypeError: 'danger',
		ReferenceError: 'warning',
		SyntaxError: 'info',
		RangeError: 'warning',
		URIError: 'info',
		EvalError: 'danger',
		InternalError: 'danger',
	}

	return typeMap[type] || 'info'
}

// 空数据状态
const isEmpty = computed(() => !props.loading && (!props.data || props.data.length === 0))

// 显示空数据提示
const showEmptyText = computed(() => {
	return isEmpty.value ? '暂无错误数据' : ''
})
</script>

<template>
	<div class="error-table-container">
		<el-table
			v-loading="loading"
			:data="data"
			style="width: 100%"
			@sort-change="handleSortChange"
			row-key="fingerprint"
			border
			stripe
			:empty-text="showEmptyText"
			highlight-current-row>
			<!-- 错误类型列 -->
			<el-table-column prop="type" label="错误类型" width="120">
				<template #default="{ row }">
					<el-tag :type="getErrorTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
				</template>
			</el-table-column>

			<!-- 错误信息列 -->
			<el-table-column prop="message" label="错误信息" min-width="300" show-overflow-tooltip>
				<template #default="{ row }">
					<div class="error-message ellipsis">{{ row.message }}</div>
				</template>
			</el-table-column>

			<!-- 发生次数列 -->
			<el-table-column prop="count" label="发生次数" align="center" width="100" sortable="custom">
				<template #default="{ row }">
					<span class="error-count">{{ row.count }}</span>
				</template>
			</el-table-column>

			<!-- 影响用户数列 -->
			<el-table-column prop="userCount" label="影响用户数" align="center" width="100" sortable="custom">
				<template #default="{ row }">
					<span>{{ row.userCount }}</span>
				</template>
			</el-table-column>

			<!-- 最后发生列 -->
			<el-table-column prop="lastSeen" label="最后发生" align="center" width="150" sortable="custom">
				<template #default="{ row }">
					<span>{{ formatTimeAgo(row.lastSeen) }}</span>
				</template>
			</el-table-column>

			<!-- 浏览器 -->
			<!-- <el-table-column prop="payload.meta.browser" label="浏览器" align="center" width="100" sortable="custom">
				<template #default="{ row }">
					<span>{{ row.payload?.meta?.browser }}</span>
				</template>
			</el-table-column> -->

			<!-- 操作系统 -->
			<!-- <el-table-column prop="payload.meta.os" label="操作系统" align="center" width="100" sortable="custom">
				<template #default="{ row }">
					<span>{{ row.payload?.meta?.os }}</span>
				</template>
			</el-table-column> -->

			<!-- 设备类型 -->
			<!-- <el-table-column prop="payload.meta.device" label="设备类型" align="center" width="100" sortable="custom">
				<template #default="{ row }">
					<span>{{ row.payload?.meta?.device }}</span>
				</template>
			</el-table-column> -->

			<!-- 操作列 -->
			<el-table-column label="操作" width="200" align="center" fixed="right">
				<template #default="{ row }">
					<div class="operation-buttons">
						<el-tooltip content="查看源码" placement="top">
							<el-button type="primary" size="small" circle @click="viewSourceCode(row, $event)">
								<el-icon><Document /></el-icon>
							</el-button>
						</el-tooltip>

						<el-tooltip content="播放录屏" placement="top">
							<el-button type="success" size="small" circle @click="playRrweb(row, $event)">
								<el-icon><VideoPlay /></el-icon>
							</el-button>
						</el-tooltip>

						<el-tooltip content="查看用户行为" placement="top">
							<el-button type="warning" size="small" circle @click="viewBehaviorStack(row, $event)">
								<el-icon><List /></el-icon>
							</el-button>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="currentPageSize"
				:page-sizes="[10, 20, 50, 100]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handlePageChange" />
		</div>

		<!-- 弹窗组件 -->
		<SourceCodeDialog v-model:visible="sourceCodeDialogVisible" :error-id="currentErrorId" />

		<RrwebPlayerDialog v-model:visible="rrwebPlayerDialogVisible" :error-id="currentErrorId" />

		<BehaviorStackDialog v-model:visible="behaviorStackDialogVisible" :error-id="currentErrorId" />
	</div>
</template>

<style scoped lang="less">
.error-table-container {
	margin-bottom: 20px;

	.error-message {
		color: #303133;
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.error-count {
		color: #f56c6c;
		font-weight: bold;
	}

	.pagination-container {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}

	.operation-buttons {
		display: flex;
		justify-content: space-around;
		align-items: center;

		.el-button {
			margin-left: 0;
			margin-right: 0;
		}
	}

	:deep(.el-table__row) {
		&:hover {
			background-color: #f5f7fa !important;
		}
	}
}
</style>
