<template>
	<el-dialog
		title="错误详情"
		v-model="dialogVisible"
		width="80%"
		destroy-on-close
		@close="handleClose"
		class="error-detail-dialog">
		<div v-loading="loading">
			<div v-if="error" class="error-detail-content">
				<!-- 错误基本信息 -->
				<el-descriptions title="错误信息" :column="1" border>
					<el-descriptions-item label="错误类型">{{ error.type }}</el-descriptions-item>
					<el-descriptions-item label="错误消息">{{ error.message }}</el-descriptions-item>
					<el-descriptions-item label="发生时间">{{ error.timestamp }}</el-descriptions-item>
				</el-descriptions>

				<!-- 错误堆栈 -->
				<div class="stack-section">
					<div class="section-header">
						<h3>错误堆栈</h3>
						<div v-if="!hasParsedStack" class="upload-sourcemap">
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

							<el-button type="success" :disabled="!sourceMapFile" :loading="uploading" @click="parseSourceMap">
								解析源码
							</el-button>
						</div>
					</div>

					<!-- 解析后的堆栈 -->
					<div v-if="hasParsedStack" class="parsed-stack">
						<div v-for="(frame, index) in parsedStack" :key="index" class="stack-frame">
							<div class="frame-number">{{ index + 1 }}</div>
							<div class="frame-content">
								<div class="frame-function">{{ frame.func || '(匿名函数)' }}</div>
								<div class="frame-location">
									<span class="file-link">{{ formatFilePath(frame.file) }}</span>
									<span class="line-column">:{{ frame.line }}:{{ frame.column }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- 原始堆栈 -->
					<div v-else class="original-stack">
						<pre>{{ error.stack }}</pre>
					</div>
				</div>
			</div>

			<div v-else class="error-empty">
				<el-empty description="无错误详情数据" />
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import * as ErrorStackParser from 'error-stack-parser'
import * as sourceMap from 'source-map-js'

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	error: {
		type: Object,
		default: () => ({}),
	},
})

const emit = defineEmits(['update:visible'])

// 对话框可见性
const dialogVisible = computed({
	get: () => props.visible,
	set: value => emit('update:visible', value),
})

// 加载状态
const loading = ref(false)
const uploading = ref(false)

// SourceMap文件
const sourceMapFile = ref<UploadFile | null>(null)

// 解析后的堆栈
const parsedStack = ref<
	Array<{
		file: string
		line: number
		column: number
		func: string
	}>
>([])

// 是否有解析后的堆栈
const hasParsedStack = computed(() => {
	return parsedStack.value && parsedStack.value.length > 0
})

// 监听错误变化
watch(
	() => props.error,
	newError => {
		if (newError) {
			// 如果错误对象中已有解析后的堆栈，直接使用
			if (newError.parsedStack && newError.parsedStack.length > 0) {
				parsedStack.value = newError.parsedStack
			} else {
				// 否则尝试使用ErrorStackParser解析
				try {
					// 创建一个Error对象，设置message和stack
					const errorObj = new Error(newError.message)
					errorObj.stack = newError.stack

					// 使用ErrorStackParser解析堆栈
					const stackFrames = ErrorStackParser.parse(errorObj)

					// 转换为我们需要的格式
					parsedStack.value = stackFrames.map((frame: any) => ({
						file: frame.fileName || '',
						line: frame.lineNumber || 0,
						column: frame.columnNumber || 0,
						func: frame.functionName || '(匿名函数)',
					}))
				} catch (e) {
					console.error('解析错误堆栈失败:', e)
					parsedStack.value = []
				}
			}
		}
	},
	{ immediate: true },
)

// 处理文件选择变化
const handleFileChange = (uploadFile: UploadFile) => {
	sourceMapFile.value = uploadFile
}

// 解析SourceMap
const parseSourceMap = async () => {
	if (!sourceMapFile.value || !sourceMapFile.value.raw) {
		ElMessage.warning('请先选择SourceMap文件')
		return
	}

	if (!props.error || !props.error.stack) {
		ElMessage.warning('错误堆栈信息不存在')
		return
	}

	try {
		uploading.value = true

		// 读取SourceMap文件内容
		const fileContent = await readFileAsText(sourceMapFile.value.raw as File)

		// 解析SourceMap
		const consumer = new sourceMap.SourceMapConsumer(JSON.parse(fileContent))

		// 使用SourceMap解析原始堆栈
		const newParsedStack: Array<{
			file: string
			line: number
			column: number
			func: string
		}> = []

		for (const frame of parsedStack.value as Array<{
			file: string
			line: number
			column: number
			func: string
		}>) {
			try {
				const originalPosition = consumer.originalPositionFor({
					line: frame.line,
					column: frame.column,
				})

				if (originalPosition.source) {
					newParsedStack.push({
						file: originalPosition.source,
						line: originalPosition.line || 0,
						column: originalPosition.column || 0,
						func: originalPosition.name || frame.func,
					})
				} else {
					// 如果无法解析，保留原始信息
					newParsedStack.push(frame)
				}
			} catch (e) {
				console.error('解析堆栈帧失败:', e)
				newParsedStack.push(frame)
			}
		}

		// 更新解析后的堆栈
		parsedStack.value = newParsedStack

		ElMessage.success('SourceMap解析成功')
	} catch (error) {
		console.error('解析SourceMap失败:', error)
		ElMessage.error('解析SourceMap失败')
	} finally {
		uploading.value = false
	}
}

// 读取文件内容为文本
const readFileAsText = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsText(file)
	})
}

// 格式化文件路径，提取文件名
const formatFilePath = (path: string) => {
	if (!path) return '(未知文件)'
	const parts = path.split('/')
	return parts[parts.length - 1]
}

// 关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
	sourceMapFile.value = null
}
</script>

<style scoped>
.error-detail-content {
	padding: 10px;
}

.stack-section {
	margin-top: 20px;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
}

.upload-sourcemap {
	display: flex;
	align-items: center;
	gap: 10px;
}

.original-stack {
	background-color: #f5f7fa;
	padding: 15px;
	border-radius: 4px;
	overflow-x: auto;
	max-height: 300px;
}

.parsed-stack {
	background-color: #f5f7fa;
	border-radius: 4px;
	overflow-x: auto;
	max-height: 300px;
}

.stack-frame {
	display: flex;
	padding: 8px 15px;
	border-bottom: 1px solid #ebeef5;
}

.stack-frame:last-child {
	border-bottom: none;
}

.frame-number {
	width: 30px;
	color: #909399;
	font-weight: bold;
}

.frame-content {
	flex: 1;
}

.frame-function {
	font-weight: bold;
	margin-bottom: 5px;
}

.frame-location {
	color: #606266;
}

.file-link {
	color: #409eff;
}

.line-column {
	color: #f56c6c;
}
</style>
