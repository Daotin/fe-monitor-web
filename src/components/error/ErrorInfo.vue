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

// 计算错误类型的标签类型
const errorTypeTag = computed(() => {
	const typeMap: Record<string, string> = {
		TypeError: 'danger',
		ReferenceError: 'warning',
		SyntaxError: 'info',
		RangeError: 'warning',
		URIError: 'info',
		EvalError: 'danger',
		InternalError: 'danger',
	}

	// 从错误消息中提取错误类型
	const errorType = props.data.payload.message.split(':')[0]

	return typeMap[errorType] || 'info'
})

// 计算错误类型
const errorType = computed(() => {
	return props.data.payload.message.split(':')[0]
})

// 计算错误消息（去除错误类型前缀）
const errorMessage = computed(() => {
	const parts = props.data.payload.message.split(':')
	return parts.length > 1 ? parts.slice(1).join(':').trim() : props.data.payload.message
})

// 格式化时间
const formatDateTime = (dateString: string) => {
	return formatDate(new Date(dateString), 'YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
	<el-card class="error-info-card" shadow="hover" v-loading="loading">
		<template #header>
			<div class="card-header">
				<span class="header-title">错误信息</span>
			</div>
		</template>

		<div class="error-info-content">
			<!-- 错误类型和消息 -->
			<div class="error-message-container">
				<el-tag :type="errorTypeTag" size="large" class="error-type-tag">{{ errorType }}</el-tag>
				<div class="error-message">{{ errorMessage }}</div>
			</div>

			<!-- 错误元数据 -->
			<div class="error-meta">
				<div class="meta-item">
					<div class="meta-label">发生页面</div>
					<div class="meta-value">
						<el-link type="primary" :href="data.payload.meta.url" target="_blank" :underline="false">
							{{ data.payload.meta.url }}
							<el-icon class="el-icon--right"><Link /></el-icon>
						</el-link>
					</div>
				</div>

				<div class="meta-item">
					<div class="meta-label">发生时间</div>
					<div class="meta-value">{{ formatDateTime(data.timestamp) }}</div>
				</div>

				<div class="meta-item">
					<div class="meta-label">用户ID</div>
					<div class="meta-value">{{ data.userId }}</div>
				</div>

				<div class="meta-item">
					<div class="meta-label">应用ID</div>
					<div class="meta-value">{{ data.appId }}</div>
				</div>
			</div>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.error-info-card {
	margin-bottom: 20px;

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-title {
		font-weight: bold;
		font-size: 16px;
	}

	.error-info-content {
		padding: 10px 0;
	}

	.error-message-container {
		margin-bottom: 20px;

		.error-type-tag {
			margin-bottom: 10px;
		}

		.error-message {
			font-size: 16px;
			line-height: 1.5;
			word-break: break-word;
			color: #303133;
			padding: 10px;
			background-color: #f5f7fa;
			border-radius: 4px;
		}
	}

	.error-meta {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 15px;

		.meta-item {
			display: flex;
			flex-direction: column;

			.meta-label {
				font-size: 14px;
				color: #909399;
				margin-bottom: 5px;
			}

			.meta-value {
				font-size: 14px;
				color: #303133;
				word-break: break-word;
			}
		}

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}
}
</style>
