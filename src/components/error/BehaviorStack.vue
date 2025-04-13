<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '../../utils'
import type { EventDetail } from '../../api'

// 定义组件属性
interface Props {
	data: EventDetail
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
})

// 判断是否有行为栈数据
const hasBehaviorStack = computed(() => {
	return props.data.payload.behaviorStack && props.data.payload.behaviorStack.length > 0
})

// 获取行为栈数据，按时间倒序排列
const behaviorStack = computed(() => {
	if (!hasBehaviorStack.value) return []

	return [...props.data.payload.behaviorStack].sort((a, b) => b.timestamp - a.timestamp)
})

// 获取行为类型的图标
const getBehaviorIcon = (type: string) => {
	const iconMap: Record<string, string> = {
		click: 'Pointer',
		input: 'Edit',
		navigation: 'Connection',
		api: 'Link',
		pageview: 'Document',
		scroll: 'Sort',
		resize: 'FullScreen',
		keypress: 'Keyboard',
	}

	return iconMap[type] || 'InfoFilled'
}

// 获取行为类型的标签类型
const getBehaviorTagType = (type: string) => {
	const typeMap: Record<string, string> = {
		click: 'primary',
		input: 'success',
		navigation: 'warning',
		api: 'danger',
		pageview: 'info',
		scroll: '',
		resize: '',
		keypress: 'success',
	}

	return typeMap[type] || ''
}

// 格式化行为时间
const formatBehaviorTime = (timestamp: number) => {
	return formatDate(new Date(timestamp), 'HH:mm:ss.SSS')
}

// 获取行为详情
const getBehaviorDetail = (behavior: any) => {
	switch (behavior.type) {
		case 'click':
			return `点击了 <${behavior.element}> 元素 "${behavior.text || '未知内容'}"`
		case 'input':
			return `在输入框中输入了内容`
		case 'navigation':
			return `从 ${behavior.from} 导航到 ${behavior.to}`
		case 'api':
			return `${behavior.method} 请求 ${behavior.url}，状态码: ${behavior.status}`
		case 'pageview':
			return `访问页面 ${behavior.url}，标题: ${behavior.title}`
		case 'scroll':
			return `滚动到位置 (${behavior.position.x}, ${behavior.position.y})`
		case 'resize':
			return `调整窗口大小`
		case 'keypress':
			return `按下键盘`
		default:
			return `${behavior.type} 行为`
	}
}
</script>

<template>
	<el-card class="behavior-stack-card" shadow="hover" v-loading="loading">
		<template #header>
			<div class="card-header">
				<span class="header-title">用户行为栈</span>
				<el-tag v-if="hasBehaviorStack" type="info" size="small">{{ behaviorStack.length }}个行为记录</el-tag>
			</div>
		</template>

		<div class="behavior-stack-content">
			<!-- 有行为栈数据 -->
			<template v-if="hasBehaviorStack">
				<el-timeline>
					<el-timeline-item
						v-for="(behavior, index) in behaviorStack"
						:key="index"
						:type="getBehaviorTagType(behavior.type)"
						:icon="getBehaviorIcon(behavior.type)"
						:timestamp="formatBehaviorTime(behavior.timestamp)"
						size="large">
						<div class="behavior-item">
							<div class="behavior-type">
								<el-tag size="small" :type="getBehaviorTagType(behavior.type)">{{ behavior.type }}</el-tag>
							</div>
							<div class="behavior-detail">{{ getBehaviorDetail(behavior) }}</div>
						</div>
					</el-timeline-item>
				</el-timeline>
			</template>

			<!-- 无行为栈数据 -->
			<template v-else>
				<el-empty description="暂无用户行为记录" />
			</template>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.behavior-stack-card {
	margin-bottom: 20px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.header-title {
			font-weight: bold;
			font-size: 16px;
		}
	}

	.behavior-stack-content {
		padding: 10px 0;

		.behavior-item {
			padding: 5px 0;

			.behavior-type {
				margin-bottom: 5px;
			}

			.behavior-detail {
				font-size: 14px;
				color: #303133;
				line-height: 1.5;
			}
		}
	}

	// 深度选择器样式
	:deep(.el-timeline-item__timestamp) {
		font-size: 12px;
		color: #909399;
	}

	:deep(.el-timeline-item__node) {
		background-color: transparent;
	}

	:deep(.el-timeline-item__wrapper) {
		padding-left: 20px;
	}
}
</style>
