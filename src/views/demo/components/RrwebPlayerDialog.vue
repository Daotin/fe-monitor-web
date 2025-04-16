<template>
	<el-dialog
		title="错误录屏回放"
		v-model="dialogVisible"
		width="80%"
		destroy-on-close
		@close="handleClose"
		class="rrweb-player-dialog">
		<div v-loading="loading">
			<!-- 有录屏数据 -->
			<template v-if="hasRrwebData">
				<div class="record-info" v-if="recordInfo">
					<p><strong>录制信息：</strong></p>
					<p>开始时间：{{ formatTime(recordInfo.startTime) }}</p>
					<p>结束时间：{{ formatTime(recordInfo.endTime) }}</p>
					<p>持续时间：{{ formatDuration(recordInfo.duration) }}</p>
					<p>事件数量：{{ recordInfo.eventsCount }}</p>
				</div>

				<div class="player-container-wrapper">
					<div ref="playerContainer" class="player-container"></div>
				</div>
			</template>

			<!-- 无录屏数据 -->
			<template v-else-if="!loading">
				<el-empty description="暂无会话录屏数据">
					<template #description>
						<p>该错误事件未包含会话录屏数据</p>
						<p class="empty-tip">提示: 确保SDK配置中启用了rrweb插件，并设置了适当的录制模式</p>
					</template>
				</el-empty>
			</template>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

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

// 播放器容器
const playerContainer = ref<HTMLElement | null>(null)

// 播放器实例
const playerInstance = ref<any>(null)

// 加载状态
const loading = ref(false)

// 录制信息
const recordInfo = computed(() => {
	if (!props.error) return null

	return {
		startTime: props.error.startTime,
		endTime: props.error.endTime,
		duration: props.error.duration,
		eventsCount: props.error.eventsCount,
	}
})

// 格式化时间
const formatTime = (timestamp: number) => {
	if (!timestamp) return '未知'
	const date = new Date(timestamp)
	return date.toLocaleString()
}

// 格式化持续时间
const formatDuration = (duration: number) => {
	if (!duration) return '未知'
	const seconds = Math.floor(duration / 1000)
	if (seconds < 60) {
		return `${seconds}秒`
	}
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}分${remainingSeconds}秒`
}

// 是否有录屏数据
const hasRrwebData = computed(() => {
	console.log('检查录屏数据:', props.error)
	return props.error?.events && props.error.events.length > 0
})

// 监听对话框可见性变化
watch(
	() => dialogVisible.value,
	async newVal => {
		if (newVal && hasRrwebData.value) {
			loading.value = true
			try {
				// 等待DOM更新
				await new Promise(resolve => setTimeout(resolve, 100))
				await initPlayer()
			} catch (error) {
				console.error('初始化播放器失败:', error)
				ElMessage.error('初始化播放器失败')
			} finally {
				loading.value = false
			}
		}
	},
)

// 初始化播放器
const initPlayer = async () => {
	if (!hasRrwebData.value || !playerContainer.value || !props.error) return

	try {
		// 动态导入rrweb-player
		const rrwebPlayer = await import('rrweb-player')
		// 导入CSS
		await import('rrweb-player/dist/style.css')

		const Replayer = rrwebPlayer.default

		console.log('创建播放器，使用的录制数据:', props.error.events)

		// 销毁旧的播放器实例
		destroyPlayer()

		// 创建新的播放器实例
		playerInstance.value = new Replayer({
			target: playerContainer.value,
			props: {
				events: props.error.events, // 使用新的数据结构中的events
				showController: true,
				autoPlay: false,
				width: playerContainer.value.clientWidth,
				height: Math.min(window.innerHeight * 0.6, 600),
			},
		})

		console.log('rrweb播放器初始化成功')
	} catch (error) {
		console.error('初始化rrweb播放器失败:', error)
		throw error
	}
}

// 关闭弹窗
const handleClose = () => {
	dialogVisible.value = false

	// 销毁播放器实例
	destroyPlayer()
}

const destroyPlayer = () => {
	if (playerInstance.value) {
		playerInstance.value.destroy?.()
		playerInstance.value = null
	}
}

// 组件卸载时清理资源
onUnmounted(() => {
	destroyPlayer()
})
</script>

<style scoped>
.player-container-wrapper {
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 20px 0;
}

.player-container {
	width: 100%;
	min-height: 400px;
}

.empty-tip {
	color: #909399;
	font-size: 14px;
	margin-top: 10px;
}

.record-info {
	margin-bottom: 20px;
	padding: 15px;
	background-color: #f8f9fa;
	border-radius: 4px;
	font-size: 14px;
}

.record-info p {
	margin: 5px 0;
}
</style>
