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
					</div>

					<!-- 解析后的堆栈 -->
					<div v-if="hasParsedStack" class="parsed-stack">
						<div v-for="(frame, index) in parsedStack" :key="index" class="stack-frame">
							<div class="frame-content">
								<div class="frame-header">
									<div class="frame-number">{{ index + 1 }}</div>
									<div class="frame-function">{{ frame.func || '(匿名函数)' }}</div>
								</div>
								<div class="frame-location">
									<span class="file-link">{{ formatFilePath(frame.file) }}</span>
									<span class="line-column">:{{ frame.line }}:{{ frame.column }}</span>

									<div class="frame-actions">
										<!-- 每行堆栈对应的上传sourcemap按钮 -->
										<el-upload
											class="sourcemap-uploader"
											action="#"
											:auto-upload="false"
											:limit="1"
											accept=".map,.json"
											:show-file-list="false"
											:on-change="(file: any) => handleFileChange(file, index)">
											<el-button
												size="small"
												type="primary"
												:loading="uploading[index]"
												:disabled="frame.hasSourceMap && !frame.parseError">
												{{
													frame.hasSourceMap && !frame.parseError
														? '已解析'
														: frame.parseError
														? '重新上传'
														: '上传SourceMap'
												}}
											</el-button>
										</el-upload>
									</div>
								</div>
							</div>

							<!-- 源代码显示区域 -->
							<div v-if="frame.hasSourceMap" class="source-code-container">
								<pre v-if="frame.sourceCode && !frame.parseError" class="source-code">
									<code v-for="(line, lineIndex) in frame.sourceCode.split('\n')" :key="lineIndex"
										:class="{ 'error-line': frame.originalLine === (frame.sourceCodeStartLine || 0) + lineIndex }"
										class="code-line">
<span class="line-number">{{ (frame.sourceCodeStartLine || 0) + lineIndex }}:</span><span class="line-content">{{ line }}</span>
									</code>
								</pre>
								<div v-else-if="frame.parseError" class="parse-error">
									<span>解析失败：无法解析该堆栈位置的源代码，请检查SourceMap是否匹配，再重新上传</span>
								</div>
								<div v-else class="source-code-loading">
									<el-skeleton :rows="3" />
								</div>
							</div>
						</div>
					</div>

					<!-- 原始堆栈 -->
					<div v-else-if="hasStack" class="original-stack">
						<pre>{{ error.stack }}</pre>
					</div>
					<div v-else class="original-stack">
						<span>无堆栈信息</span>
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
import { ref, computed, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import * as ErrorStackParser from 'error-stack-parser'
import * as sourceMap from 'source-map-js'

defineOptions({
	name: 'ErrorDetailDialog',
})

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
const uploading = reactive<Record<number, boolean>>({})

// 定义堆栈帧类型
interface StackFrame {
	file: string // 文件路径
	line: number // 行号
	column: number // 列号
	func: string // 函数名
	hasSourceMap: boolean // 是否存在SourceMap
	originalFile?: string // 原始文件
	originalLine?: number // 原始行
	originalColumn?: number // 原始列
	sourceCode?: string // 源码
	sourceCodeStartLine?: number // 源码开始行
	parseError?: boolean // 是否解析失败
}

// 解析后的堆栈
const parsedStack = ref<StackFrame[]>([])

// 是否有解析后的堆栈
const hasParsedStack = computed(() => {
	return parsedStack.value && parsedStack.value.length > 0
})

const hasStack = computed(() => {
	return props.error.stack
})

// 监听错误变化
watch(
	() => props.error,
	newError => {
		if (newError) {
			// 如果错误对象中已有解析后的堆栈，直接使用
			if (newError.parsedStack && newError.parsedStack.length > 0) {
				parsedStack.value = newError.parsedStack.map((frame: any) => ({
					...frame,
					hasSourceMap: false,
					parseError: false,
				}))
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
						hasSourceMap: false,
						parseError: false,
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
const handleFileChange = async (uploadFile: UploadFile, frameIndex: number) => {
	if (!uploadFile || !uploadFile.raw) {
		ElMessage.warning('请选择有效的SourceMap文件')
		return
	}

	try {
		uploading[frameIndex] = true
		console.log(`处理第${frameIndex + 1}行堆栈的SourceMap上传`)

		// 获取当前帧
		const frame = parsedStack.value[frameIndex]
		if (!frame) {
			throw new Error('找不到对应的堆栈帧')
		}

		// 重置解析状态，确保重新上传时正确处理
		const resetFrame = {
			...frame,
			hasSourceMap: false,
			parseError: false,
			sourceCode: undefined,
			originalFile: undefined,
			originalLine: undefined,
			originalColumn: undefined,
			sourceCodeStartLine: undefined,
		}

		// 读取SourceMap文件内容
		const fileContent = await readFileAsText(uploadFile.raw as File)

		// 解析SourceMap
		const consumer = new sourceMap.SourceMapConsumer(JSON.parse(fileContent))

		console.log('解析位置:', frame.line, frame.column)
		const originalPosition = consumer.originalPositionFor({
			line: frame.line,
			column: frame.column,
		})
		console.log('原始位置:', originalPosition)

		if (originalPosition.source) {
			// 更新堆栈帧信息
			const updatedFrame: StackFrame = {
				...resetFrame,
				hasSourceMap: true,
				parseError: false,
				originalFile: originalPosition.source,
				originalLine: originalPosition.line || 0,
				originalColumn: originalPosition.column || 0,
				func: originalPosition.name || frame.func,
			}

			// 尝试获取源代码
			try {
				const sourceContent = consumer.sourceContentFor(originalPosition.source)
				if (sourceContent) {
					// 计算要显示的源码范围（错误行前后5行）
					const lines = sourceContent.split('\n')
					const startLine = Math.max(0, (originalPosition.line || 1) - 5)
					const endLine = Math.min(lines.length, (originalPosition.line || 1) + 5)

					// 提取源码片段
					const codeSnippet = lines.slice(startLine, endLine).join('\n')

					// 更新源码信息
					updatedFrame.sourceCode = codeSnippet
					updatedFrame.sourceCodeStartLine = startLine + 1 // 1-based line number
				} else {
					// 无法获取源代码内容
					updatedFrame.parseError = true
				}
			} catch (e) {
				console.error('获取源代码失败:', e)
				updatedFrame.parseError = true
			}

			// 更新堆栈帧
			parsedStack.value[frameIndex] = updatedFrame

			if (!updatedFrame.parseError) {
				ElMessage.success(`第${frameIndex + 1}行堆栈的SourceMap解析成功`)
			} else {
				ElMessage.warning(`第${frameIndex + 1}行堆栈的源代码获取失败`)
			}
		} else {
			// 无法解析原始位置
			parsedStack.value[frameIndex] = {
				...resetFrame,
				hasSourceMap: true,
				parseError: true,
			}
			ElMessage.warning(`无法解析第${frameIndex + 1}行堆栈，请检查SourceMap是否匹配`)
		}
	} catch (error) {
		console.error('解析SourceMap失败:', error)
		// 更新解析错误状态
		if (parsedStack.value[frameIndex]) {
			parsedStack.value[frameIndex] = {
				...parsedStack.value[frameIndex],
				hasSourceMap: true,
				parseError: true,
			}
		}
		ElMessage.error('解析SourceMap失败')
	} finally {
		uploading[frameIndex] = false
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
}

.original-stack {
	background-color: #f5f7fa;
	padding: 15px;
	border-radius: 4px;
	overflow-x: auto;
	max-height: 300px;
	line-height: 1.3;
	font-size: 13px;
	font-family: 'Courier New', monospace;
}

.parsed-stack {
	background-color: #f5f7fa;
	border-radius: 4px;
	overflow-x: auto;
	max-height: 600px;
}

.stack-frame {
	padding: 8px 10px;
	border-bottom: 1px solid #ebeef5;
	display: flex;
	flex-direction: column;
}

.stack-frame:last-child {
	border-bottom: none;
}

.frame-content {
	display: flex;
	flex-direction: column;
}

.frame-header {
	display: flex;
	align-items: center;
	margin-bottom: 3px;
}

.frame-number {
	width: 25px;
	color: #909399;
	font-weight: bold;
	margin-right: 5px;
}

.frame-function {
	font-weight: bold;
	color: #303133;
	font-size: 14px;
}

.frame-location {
	color: #606266;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 5px;
	font-size: 13px;
}

.file-link {
	color: #409eff;
}

.line-column {
	color: #f56c6c;
}

.frame-actions {
	display: flex;
	gap: 5px;
}

.source-code-container {
	margin-top: 6px;
	margin-bottom: 0;
	padding: 10px;
	background-color: #282c34;
	border-radius: 4px;
	overflow-x: auto;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.source-code {
	margin: 0;
	padding: 0;
	font-family: 'Courier New', Courier, monospace;
	font-size: 12px;
	line-height: 8px;
	color: #abb2bf;
}

.code-line {
	display: block;
	padding-left: 5px;
	white-space: pre;
}

.error-line {
	background-color: rgba(255, 0, 0, 0.2);
	color: #ff7875;
	font-weight: bold;
	border-left: 2px solid #ff4d4f;
}

.line-number {
	display: inline-block;
	min-width: 35px;
	color: #636d83;
	padding-right: 10px;
	text-align: right;
	user-select: none;
}

.line-content {
	white-space: pre;
}

.source-code-loading {
	padding: 5px;
}

.parse-error {
	padding: 5px;
}

.parse-error span {
	color: #f56c6c;
}
</style>
