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
				<p>1. 先点击下方按钮触发不同类型的错误，控制台可以看到"捕获数据已入队"，表示数据已被捕获。</p>
				<p>2. 点击"获取错误列表"按钮，可以看到错误列表，点击错误列表中的错误详情按钮，可以查看错误详情。</p>
				<p>3. 点击错误列表中的播放录屏按钮，可以播放录屏，查看错误发生时的操作行为。</p>
				<p>4. 点击错误列表中的行为记录按钮，可以查看行为记录，包括用户行为记录、页面加载记录、资源加载记录等。</p>

				<div class="error-buttons">
					<el-button type="danger" @click="triggerTypeError">触发类型错误</el-button>
					<el-button type="danger" @click="triggerReferenceError">触发引用错误</el-button>
					<el-button type="danger" @click="triggerSyntaxError">触发语法错误</el-button>
					<el-button type="danger" @click="triggerPromiseError">触发Promise错误</el-button>
					<el-button type="danger" @click="triggerResourceError">触发资源加载错误</el-button>
					<el-button type="danger" @click="triggerHttpError">触发HTTP错误</el-button>
					<el-button type="danger" @click="triggerCustomError">触发自定义错误</el-button>
				</div>
			</div>

			<!-- 新增：用户行为监控测试区域 -->
			<div class="behavior-test-section">
				<h3>用户行为监控测试</h3>
				<p>通过以下交互测试用户行为监控功能，所有行为将被记录并可以在发生错误时回放：</p>

				<!-- 点击行为测试 -->
				<el-card class="behavior-card">
					<template #header>
						<div class="card-header">
							<h4>点击行为测试</h4>
						</div>
					</template>
					<p>点击下面的按钮，测试点击行为收集功能：</p>
					<div class="behavior-buttons">
						<el-button id="normal-button">普通按钮</el-button>
						<el-button id="data-button" data-test="test-data">带数据属性的按钮</el-button>
						<el-button class="monitor-ignore" type="danger">被忽略的按钮</el-button>
						<el-button data-monitor-ignore type="danger">被忽略的按钮 (属性)</el-button>
					</div>

					<div class="form-group">
						<el-form :model="formData" label-width="120px">
							<el-form-item label="测试输入框：">
								<el-input v-model="formData.input" placeholder="在此输入文本" />
							</el-form-item>

							<el-form-item label="密码输入框：">
								<el-input v-model="formData.password" type="password" placeholder="在此输入密码" show-password />
							</el-form-item>

							<el-form-item label="测试文本区域：">
								<el-input v-model="formData.textarea" type="textarea" placeholder="在此输入多行文本" :rows="3" />
							</el-form-item>
						</el-form>
					</div>
				</el-card>

				<!-- 页面跳转测试 -->
				<el-card class="behavior-card">
					<template #header>
						<div class="card-header">
							<h4>页面跳转测试</h4>
						</div>
					</template>
					<p>点击下面的链接，测试页面跳转收集功能：</p>
					<div class="history-buttons">
						<el-button id="push-state" @click="usePushState">使用 pushState</el-button>
						<el-button id="replace-state" @click="useReplaceState">使用 replaceState</el-button>
						<el-button id="go-back" @click="goBack">后退</el-button>
					</div>
				</el-card>
			</div>

			<!-- 错误列表区域 -->
			<div class="error-list-section">
				<h3>
					采集数据列表
					<el-button type="primary" @click="getErrorList">获取错误列表</el-button>
				</h3>

				<el-table v-if="errorList.length" :data="errorList" style="width: 100%" border>
					<el-table-column prop="timestamp" label="时间" width="180" />
					<el-table-column prop="subType" label="错误类型" width="150" />
					<el-table-column prop="message" label="错误信息" />
					<el-table-column label="操作" width="300">
						<template #default="scope">
							<el-button type="primary" size="small" @click="showErrorDetail(scope.row)">错误详情</el-button>
							<el-button type="primary" size="small" @click="showRrwebPlayer(scope.row)">播放录屏</el-button>
							<el-button type="primary" size="small" @click="showBehaviorStack(scope.row)">行为记录</el-button>
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
import { ref, onMounted, onUnmounted, reactive } from 'vue'
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

// 表单数据
const formData = reactive({
	input: '',
	password: '',
	textArea: '',
})

// 触发类型错误
const triggerTypeError = () => {
	const obj = null
	obj.nonExistentMethod()
}

// 触发引用错误
const triggerReferenceError = () => {
	console.log(undefinedVariable)
}

// 触发语法错误
const triggerSyntaxError = () => {
	eval('if(true) {')
}

// 触发Promise错误
const triggerPromiseError = () => {
	Promise.reject(new Error('这是一个Promise错误'))
}

// 触发资源加载错误
const triggerResourceError = () => {
	const img = new Image()
	img.src = '/non-existent-image.jpg'
	document.body.appendChild(img)
}

// 触发HTTP错误
const triggerHttpError = () => {
	fetch('https://example.com/non-existent-api')
		.then(response => {
			console.log('HTTP 响应状态:', response.status)
			return response.json()
		})
		.catch(error => {
			console.error('捕获到 fetch 错误:', error)
		})
}

// 触发自定义错误
const triggerCustomError = () => {
	try {
		throw new Error('这是一个自定义错误')
	} catch (error) {
		if (window.monitor && typeof window.monitor.reportError === 'function') {
			// @ts-ignore
			window.monitor.reportError(error, {
				component: 'ErrorExample',
				action: 'triggerCustomError',
			})
		} else {
			console.error('monitor未初始化或reportError方法不可用')
		}
	}
}

const getErrorList = () => {
	if (window.monitor && typeof window.monitor.getQueue === 'function') {
		// @ts-ignore
		const errors = window.monitor.getQueue()
		console.log('errors==>', errors)
		errorList.value = errors.filter((error: any) => {
			return (
				error.type === 'error' ||
				(error.type === 'behavior' && (error.subType === 'stack' || error.subType === 'rrweb'))
			)
		})
	} else {
		console.error('monitor未初始化或getQueue方法不可用')
		ElMessage.error('monitor未初始化或getQueue方法不可用')
	}
}

// 页面跳转测试
const usePushState = () => {
	history.pushState({}, 'Push State Page', '#/push-state-page')
	console.log('已使用 pushState 跳转到 #/push-state-page')
}

const useReplaceState = () => {
	history.replaceState({}, 'Replace State Page', '#/replace-state-page')
	console.log('已使用 replaceState 跳转到 #/replace-state-page')
}

const goBack = () => {
	history.back()
	console.log('已触发后退操作')
}

// 手动控制功能
const flushQueue = () => {
	if (window.monitor && typeof window.monitor.flush === 'function') {
		// @ts-ignore
		window.monitor.flush()
		console.log('已手动发送数据队列')
		ElMessage.success('已手动发送数据队列')
	} else {
		console.error('monitor未初始化或flush方法不可用')
		ElMessage.error('monitor未初始化或flush方法不可用')
	}
}

const clearConsole = () => {
	console.clear()
	console.log('控制台已清空')
	ElMessage.success('控制台已清空')
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

declare global {
	interface Window {
		monitor?: any
	}
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

.behavior-test-section {
	margin-bottom: 30px;
}

.behavior-card {
	margin-bottom: 20px;
}

.behavior-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 20px;
}

.monitor-ignore {
	background-color: #f56c6c;
}

.monitor-ignore:hover {
	background-color: #e64242;
}

.form-group {
	margin: 15px 0;
}

.navigation {
	margin: 15px 0;
	display: flex;
	gap: 20px;
}

.nav-link {
	font-size: 14px;
}

.history-buttons {
	margin-top: 15px;
	display: flex;
	gap: 10px;
}

.control-buttons {
	display: flex;
	gap: 10px;
}

.error-list-section {
	margin-top: 20px;
}
</style>
