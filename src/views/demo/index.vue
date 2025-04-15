<template>
	<div class="demo-container">
		<el-card class="demo-card">
			<template #header>
				<div class="card-header">
					<h2>错误采集和还原定位演示</h2>
					<p class="description">
						本页面用于演示前端监控SDK的错误采集和还原定位功能，包括sourcemap定位源码、播放录屏和记录用户行为记录。
					</p>
				</div>
			</template>

			<!-- 错误触发区域 -->
			<div class="error-trigger-section">
				<h3>触发错误</h3>
				<p>点击下方按钮触发不同类型的错误，错误将被自动捕获并显示在下方列表中。</p>

				<div class="error-buttons">
					<el-button type="danger" @click="triggerTypeError">触发类型错误</el-button>
					<el-button type="danger" @click="triggerReferenceError">触发引用错误</el-button>
					<el-button type="danger" @click="triggerSyntaxError">触发语法错误</el-button>
					<el-button type="danger" @click="triggerPromiseError">触发Promise错误</el-button>
					<el-button type="danger" @click="triggerResourceError">触发资源加载错误</el-button>
					<el-button type="danger" @click="triggerCustomError">触发自定义错误</el-button>
				</div>
			</div>

			<!-- 错误列表区域 -->
			<div class="error-list-section">
				<h3>错误列表</h3>

				<el-table v-if="errorList.length" :data="errorList" style="width: 100%" border>
					<el-table-column prop="timestamp" label="时间" width="180" />
					<el-table-column prop="type" label="错误类型" width="150" />
					<el-table-column prop="message" label="错误信息" />
					<el-table-column label="操作" width="300">
						<template #default="scope">
							<el-button size="small" @click="showErrorDetail(scope.row)">错误详情</el-button>
							<el-button size="small" @click="showRrwebPlayer(scope.row)">播放录屏</el-button>
							<el-button size="small" @click="showBehaviorStack(scope.row)">行为记录</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-empty v-else description="暂无错误，请点击上方按钮触发错误"></el-empty>
			</div>
		</el-card>

		<!-- 错误详情弹窗 -->
		<error-detail-dialog v-model:visible="errorDetailVisible" :error="currentError" />

		<!-- 录屏回放弹窗 -->
		<rrweb-player-dialog v-model:visible="rrwebPlayerVisible" :error="currentError" />

		<!-- 用户行为记录弹窗 -->
		<behavior-stack-dialog v-model:visible="behaviorStackVisible" :error="currentError" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import ErrorDetailDialog from './components/ErrorDetailDialog.vue'
import RrwebPlayerDialog from './components/RrwebPlayerDialog.vue'
import BehaviorStackDialog from './components/BehaviorStackDialog.vue'

// 定义错误对象接口
interface ErrorItem {
	id: string
	timestamp: string
	type: string
	message: string
	stack: string
	parsedStack?: Array<{
		file: string
		line: number
		column: number
		func: string
	}>
	rrwebData?: any[]
	behaviorStack?: any[]
}

// 错误列表
const errorList = ref<ErrorItem[]>([])

// 当前选中的错误
const currentError = ref<ErrorItem | Record<string, any> | null>(null)

// 弹窗可见性
const errorDetailVisible = ref(false)
const rrwebPlayerVisible = ref(false)
const behaviorStackVisible = ref(false)

// 初始化监控SDK
onMounted(() => {
	// 监听SDK捕获的错误
	window.addEventListener('monitor-error', handleMonitorError)
})

// 清理事件监听
onUnmounted(() => {
	window.removeEventListener('monitor-error', handleMonitorError)
})

// 处理SDK捕获的错误
const handleMonitorError = (event: any) => {
	console.log('捕获到错误:', event.detail)

	// 将错误添加到列表
	const errorData = event.detail

	const newError: ErrorItem = {
		id: generateId(),
		timestamp: new Date().toLocaleString(),
		type: errorData.type || '未知错误',
		message: errorData.message || '未知错误信息',
		stack: errorData.stack || '',
		parsedStack: errorData.parsedStack,
		rrwebData: errorData.rrwebData,
		behaviorStack: errorData.behaviorStack,
	}

	errorList.value.unshift(newError)

	ElMessage.success('错误已捕获并添加到列表')
}

// 生成唯一ID
const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// 触发类型错误
const triggerTypeError = () => {
	console.log('即将触发JS加载错误...')
	let a = null
	if (a.b) {
		console.log('触发JS加载错误')
	}
}

// 触发引用错误
const triggerReferenceError = () => {
	try {
		// @ts-ignore
		console.log(undefinedVariable)
	} catch (error) {
		console.error('手动触发引用错误:', error)
	}
}

// 触发语法错误
const triggerSyntaxError = () => {
	try {
		// 通过eval执行错误的语法
		eval('if(true) {')
	} catch (error) {
		console.error('手动触发语法错误:', error)
	}
}

// 触发Promise错误
const triggerPromiseError = () => {
	Promise.reject(new Error('这是一个Promise错误')).catch(error => {
		console.error('手动触发Promise错误:', error)
	})
}

// 触发资源加载错误
const triggerResourceError = () => {
	const img = new Image()
	img.src = '/non-existent-image.jpg'
}

// 触发自定义错误
const triggerCustomError = () => {
	try {
		throw new Error('这是一个自定义错误')
	} catch (error) {
		console.error('手动触发自定义错误:', error)
	}
}

// 显示错误详情
const showErrorDetail = (error: ErrorItem) => {
	currentError.value = error
	errorDetailVisible.value = true
}

// 显示录屏回放
const showRrwebPlayer = (error: ErrorItem) => {
	currentError.value = error
	rrwebPlayerVisible.value = true
}

// 显示用户行为记录
const showBehaviorStack = (error: ErrorItem) => {
	currentError.value = error
	behaviorStackVisible.value = true
}
</script>

<style scoped>
.demo-container {
	padding: 20px;
}

.demo-card {
	margin-bottom: 20px;
}

.card-header {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.description {
	color: #666;
	margin-top: 10px;
}

.error-trigger-section {
	margin-bottom: 30px;
	padding: 20px;
	background-color: #f8f9fa;
	border-radius: 4px;
}

.error-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 15px;
}

.error-list-section {
	margin-top: 20px;
}
</style>
