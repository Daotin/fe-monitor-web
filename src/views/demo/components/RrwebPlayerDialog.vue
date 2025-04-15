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

// 是否有录屏数据
const hasRrwebData = computed(() => {
	return props.error?.rrwebData && props.error.rrwebData.length > 0
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

		// 销毁旧的播放器实例
		if (playerInstance.value) {
			playerInstance.value.destroy()
			playerInstance.value = null
		}

		// 创建新的播放器实例
		playerInstance.value = new Replayer({
			target: playerContainer.value,
			props: {
				events: props.error.rrwebData,
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
	if (playerInstance.value) {
		playerInstance.value.destroy()
		playerInstance.value = null
	}
}

// 组件卸载时清理资源
onUnmounted(() => {
	if (playerInstance.value) {
		playerInstance.value.destroy()
		playerInstance.value = null
	}
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
</style>
