<script setup lang="ts">
import { computed } from 'vue'
import type { EventDetail } from '../../api'

// 定义组件属性
interface Props {
	data: EventDetail
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
})

// 判断是否有解析后的堆栈信息
const hasParsedStack = computed(() => {
	return props.data.payload.parsedStack && props.data.payload.parsedStack.length > 0
})

// 原始堆栈信息
const originalStack = computed(() => {
	return props.data.payload.stack || '无堆栈信息'
})

// 格式化文件路径，提取文件名
const formatFilePath = (path: string) => {
	const parts = path.split('/')
	return parts[parts.length - 1]
}

// 计算文件路径的完整URL
const getFullUrl = (filePath: string) => {
	// 如果是完整URL，直接返回
	if (filePath.startsWith('http')) {
		return filePath
	}

	// 否则，基于错误发生页面的URL构建完整路径
	try {
		const baseUrl = new URL(props.data.payload.meta.url)
		return new URL(filePath, baseUrl.origin).href
	} catch (e) {
		return filePath
	}
}
</script>

<template>
	<el-card class="stack-trace-card" shadow="hover" v-loading="loading">
		<template #header>
			<div class="card-header">
				<span class="header-title">错误堆栈</span>
				<el-tag v-if="hasParsedStack" type="success" size="small">已通过SourceMap还原</el-tag>
				<el-tag v-else type="info" size="small">原始堆栈</el-tag>
			</div>
		</template>

		<div class="stack-trace-content">
			<!-- 解析后的堆栈信息 -->
			<template v-if="hasParsedStack">
				<div class="parsed-stack">
					<div v-for="(frame, index) in data.payload.parsedStack" :key="index" class="stack-frame">
						<div class="frame-number">{{ index + 1 }}</div>
						<div class="frame-content">
							<div class="frame-function">{{ frame.func || '(匿名函数)' }}</div>
							<div class="frame-location">
								<el-link :href="getFullUrl(frame.file)" target="_blank" :underline="false" class="file-link">
									{{ formatFilePath(frame.file) }}
								</el-link>
								<span class="line-column">:{{ frame.line }}:{{ frame.column }}</span>
							</div>
						</div>
					</div>
				</div>
			</template>

			<!-- 原始堆栈信息 -->
			<template v-else>
				<pre class="original-stack">{{ originalStack }}</pre>
			</template>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.stack-trace-card {
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

	.stack-trace-content {
		padding: 10px 0;

		.parsed-stack {
			display: flex;
			flex-direction: column;

			.stack-frame {
				display: flex;
				margin-bottom: 15px;
				padding-bottom: 15px;
				border-bottom: 1px solid #ebeef5;

				&:last-child {
					border-bottom: none;
				}

				.frame-number {
					width: 30px;
					height: 30px;
					border-radius: 50%;
					background-color: #f5f7fa;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 14px;
					font-weight: bold;
					color: #606266;
					margin-right: 15px;
					flex-shrink: 0;
				}

				.frame-content {
					flex: 1;

					.frame-function {
						font-size: 14px;
						font-weight: 500;
						color: #303133;
						margin-bottom: 5px;
					}

					.frame-location {
						font-size: 13px;
						color: #606266;
						display: flex;
						align-items: center;
						flex-wrap: wrap;

						.file-link {
							margin-right: 5px;
						}

						.line-column {
							color: #909399;
						}

						@media (max-width: 768px) {
							flex-direction: column;
							align-items: flex-start;

							.file-link {
								margin-bottom: 5px;
							}
						}
					}
				}
			}
		}

		.original-stack {
			font-family: monospace;
			font-size: 14px;
			line-height: 1.5;
			background-color: #f5f7fa;
			padding: 15px;
			border-radius: 4px;
			overflow-x: auto;
			white-space: pre-wrap;
			color: #606266;
		}
	}
}
</style>
