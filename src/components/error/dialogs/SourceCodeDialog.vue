<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import type { UploadFile, UploadFiles } from 'element-plus'
import { uploadSourceMap, getEventDetail } from '../../../api'
import type { EventDetail } from '../../../api'

const props = defineProps<{
	visible: boolean
	errorId: string
}>()

const emit = defineEmits(['update:visible'])

// 错误详情数据
const errorDetail = ref<EventDetail | null>(null)
// 加载状态
const loading = ref(false)
// 上传状态
const uploading = ref(false)
// 是否已上传SourceMap
const hasUploadedSourceMap = ref(false)
// 选中的文件
const sourceMapFile = ref<UploadFile | null>(null)

// 判断是否有解析后的堆栈信息
const hasParsedStack = computed(() => {
	return errorDetail.value?.payload.parsedStack && errorDetail.value.payload.parsedStack.length > 0
})

// 原始堆栈信息
const originalStack = computed(() => {
	return errorDetail.value?.payload.stack || '无堆栈信息'
})

// 关闭弹窗
const handleClose = () => {
	emit('update:visible', false)
}

// 获取错误详情数据
const fetchErrorDetail = async () => {
	if (!props.errorId) return

	try {
		loading.value = true
		console.log('获取错误详情数据，错误ID:', props.errorId)

		const data = await getEventDetail(props.errorId)
		errorDetail.value = data
		console.log('错误详情数据:', data)
	} catch (error) {
		console.error('获取错误详情数据失败:', error)
		ElMessage.error('获取错误详情数据失败')
	} finally {
		loading.value = false
	}
}

// 格式化文件路径，提取文件名
const formatFilePath = (path: string) => {
	const parts = path.split('/')
	return parts[parts.length - 1]
}

// 计算文件路径的完整URL
const getFullUrl = (filePath: string) => {
	if (!errorDetail.value) return filePath

	// 如果是完整URL，直接返回
	if (filePath.startsWith('http')) {
		return filePath
	}

	// 否则，基于错误发生页面的URL构建完整路径
	try {
		const baseUrl = new URL(errorDetail.value.payload.meta.url)
		return new URL(filePath, baseUrl.origin).href
	} catch (e) {
		return filePath
	}
}

// 处理文件选择变化
const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	sourceMapFile.value = uploadFile
}

// 上传SourceMap文件
const uploadMap = async () => {
	if (!sourceMapFile.value || !sourceMapFile.value.raw) {
		ElMessage.warning('请先选择SourceMap文件')
		return
	}

	if (!errorDetail.value) {
		ElMessage.warning('错误详情数据不存在')
		return
	}

	try {
		uploading.value = true
		await uploadSourceMap(errorDetail.value.appId, sourceMapFile.value.raw as File, '1.0.0')
		ElMessage.success('SourceMap上传成功')
		hasUploadedSourceMap.value = true

		// 重新获取错误详情，获取解析后的堆栈信息
		await fetchErrorDetail()
	} catch (error) {
		console.error('上传SourceMap失败:', error)
		ElMessage.error('上传SourceMap失败')
	} finally {
		uploading.value = false
	}
}

// 监听弹窗可见性变化
watch(
	() => props.visible,
	newVal => {
		if (newVal && props.errorId) {
			fetchErrorDetail()
		}
	},
)
</script>

<template>
	<el-dialog
		title="错误源码详情"
		v-model="props.visible"
		width="80%"
		destroy-on-close
		@close="handleClose"
		class="source-code-dialog">
		<div v-loading="loading">
			<!-- 未解析堆栈时显示上传SourceMap区域 -->
			<div v-if="!hasParsedStack" class="upload-section">
				<div class="upload-tip">
					<el-alert
						title="需要上传SourceMap文件以查看源码"
						type="info"
						description="上传对应版本的SourceMap文件，系统将自动解析错误堆栈并显示源码"
						show-icon
						:closable="false" />
				</div>

				<div class="upload-area">
					<el-upload
						class="sourcemap-uploader"
						action="#"
						:auto-upload="false"
						:limit="1"
						accept=".map,.json"
						:on-change="handleFileChange">
						<el-button type="primary" :loading="uploading">选择SourceMap文件</el-button>
						<template #tip>
							<div class="el-upload__tip">请上传.map格式的SourceMap文件</div>
						</template>
					</el-upload>

					<el-button type="success" :disabled="!sourceMapFile" :loading="uploading" @click="uploadMap">
						上传并解析
					</el-button>
				</div>

				<!-- 原始堆栈信息 -->
				<div class="stack-section">
					<h3>原始错误堆栈</h3>
					<pre class="original-stack">{{ originalStack }}</pre>
				</div>
			</div>

			<!-- 已解析堆栈时显示源码 -->
			<div v-else class="parsed-stack-section">
				<h3>解析后的错误堆栈</h3>
				<div class="parsed-stack">
					<div v-for="(frame, index) in errorDetail?.payload.parsedStack" :key="index" class="stack-frame">
						<div class="frame-number">{{ index + 1 }}</div>
						<div class="frame-content">
							<div class="frame-function">{{ frame.func || '(匿名函数)' }}</div>
							<div class="frame-location">
								<el-link :href="getFullUrl(frame.file)" target="_blank" :underline="false" class="file-link">
									{{ formatFilePath(frame.file) }}
								</el-link>
								<span class="line-column">:{{ frame.line }}:{{ frame.column }}</span>
							</div>

							<!-- 源码预览区域 -->
							<div class="source-code-preview">
								<div class="code-line" :class="{ 'error-line': i === 5 }" v-for="(_, i) in 10" :key="i">
									<span class="line-number">{{ frame.line - 5 + i }}</span>
									<code class="code-content">
										{{
											i === 5
												? '// 这里是错误发生的行（实际内容需要从服务端获取）'
												: '// 源码行 ' + (frame.line - 5 + i)
										}}
									</code>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<style scoped lang="less">
.source-code-dialog {
	.upload-section {
		.upload-tip {
			margin-bottom: 20px;
		}

		.upload-area {
			display: flex;
			align-items: flex-start;
			margin-bottom: 20px;

			.sourcemap-uploader {
				margin-right: 20px;
			}
		}
	}

	.stack-section {
		margin-top: 20px;

		h3 {
			font-size: 16px;
			margin-bottom: 10px;
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

	.parsed-stack-section {
		h3 {
			font-size: 16px;
			margin-bottom: 10px;
		}

		.parsed-stack {
			display: flex;
			flex-direction: column;

			.stack-frame {
				display: flex;
				margin-bottom: 20px;
				padding-bottom: 20px;
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
						margin-bottom: 10px;

						.file-link {
							margin-right: 5px;
						}

						.line-column {
							color: #909399;
						}
					}

					.source-code-preview {
						margin-top: 10px;
						background-color: #f5f7fa;
						border-radius: 4px;
						overflow: hidden;

						.code-line {
							display: flex;
							font-family: monospace;
							font-size: 14px;
							line-height: 1.5;

							&.error-line {
								background-color: rgba(245, 108, 108, 0.1);
								font-weight: bold;
							}

							.line-number {
								width: 50px;
								padding: 2px 10px;
								text-align: right;
								color: #909399;
								background-color: rgba(0, 0, 0, 0.05);
								user-select: none;
							}

							.code-content {
								flex: 1;
								padding: 2px 10px;
								white-space: pre;
								overflow-x: auto;
							}
						}
					}
				}
			}
		}
	}
}
</style>
