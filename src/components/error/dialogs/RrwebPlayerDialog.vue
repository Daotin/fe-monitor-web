<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getEventDetail } from '../../../api'
import type { EventDetail } from '../../../api'

import Replayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'

const props = defineProps<{
	visible: boolean
	errorId: string
}>()

const emit = defineEmits(['update:visible'])

// 错误详情数据
const errorDetail = ref<EventDetail | null>(null)
// 加载状态
const loading = ref(false)
// 播放器容器引用
const playerContainer = ref<HTMLDivElement | null>(null)
// 播放器实例
const playerInstance = ref<any>(null)

// 判断是否有录屏数据
const hasRrwebData = computed(() => {
	return errorDetail.value?.payload.rrwebData && errorDetail.value.payload.rrwebData.length > 0
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

		// 获取数据后初始化播放器
		if (data.payload.rrwebData && data.payload.rrwebData.length > 0) {
			// 延迟初始化，确保DOM已更新
			setTimeout(() => {
				initPlayer()
			}, 100)
		}
	} catch (error) {
		console.error('获取错误详情数据失败:', error)
		ElMessage.error('获取错误详情数据失败')
	} finally {
		loading.value = false
	}
}

// 初始化播放器
const initPlayer = async () => {
	if (!hasRrwebData.value || !playerContainer.value || !errorDetail.value) return

	try {
		// 销毁旧的播放器实例
		if (playerInstance.value) {
			playerInstance.value.$destroy()
			playerInstance.value = null
		}

		// 创建新的播放器实例
		playerInstance.value = new Replayer({
			target: playerContainer.value,
			props: {
				events: errorDetail.value.payload?.rrwebData || [],
				showController: true,
				autoPlay: false,
				width: playerContainer.value.clientWidth,
				height: Math.min(window.innerHeight * 0.6, 600),
			},
		})

		console.log('rrweb播放器初始化成功')
	} catch (error) {
		console.error('初始化rrweb播放器失败:', error)
		ElMessage.error('初始化rrweb播放器失败')
	}
}

// 监听弹窗可见性变化
watch(
	() => props.visible,
	newVal => {
		console.log('⭐==>', 111)
		if (newVal && props.errorId) {
			fetchErrorDetail()
		} else if (!newVal && playerInstance.value) {
			// 关闭弹窗时销毁播放器实例
			playerInstance.value.$destroy()
			playerInstance.value = null
		}
	},
)

onMounted(() => {})

onBeforeUnmount(() => {
	// 销毁播放器实例
	if (playerInstance.value) {
		playerInstance.value.$destroy()
		playerInstance.value = null
	}
})
</script>

<template>
	<el-dialog
		title="会话录屏回放"
		v-model="props.visible"
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

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style scoped lang="less">
.rrweb-player-dialog {
	.player-container-wrapper {
		display: flex;
		justify-content: center;

		.player-container {
			width: 100%;
			min-height: 400px;
			background-color: #f5f7fa;
			border-radius: 4px;
		}
	}

	.empty-tip {
		font-size: 12px;
		color: #909399;
		margin-top: 10px;
	}
}
</style>
