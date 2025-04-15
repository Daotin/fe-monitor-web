<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import type { EventDetail } from '../../api'

// 定义组件属性
interface Props {
	data: EventDetail
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
})

// 播放器容器引用
const playerContainer = ref<HTMLDivElement | null>(null)
// 播放器实例
const playerInstance = ref<any>(null)

// 判断是否有录屏数据
const hasRrwebData = computed(() => {
	return props.data.payload.rrwebData && props.data.payload.rrwebData.length > 0
})

// 初始化播放器
const initPlayer = async () => {
	if (!hasRrwebData.value || !playerContainer.value) return

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
				events: props.data.payload.rrwebData as any,
				showController: true,
				autoPlay: false,
				width: playerContainer.value.clientWidth,
				height: Math.min(window.innerHeight * 0.6, 600),
			},
		})

		console.log('rrweb播放器初始化成功')
	} catch (error) {
		console.error('初始化rrweb播放器失败:', error)
	}
}

// 监听数据变化，重新初始化播放器
watch(
	() => props.data,
	() => {
		if (hasRrwebData.value) {
			// 延迟初始化，确保DOM已更新
			setTimeout(() => {
				initPlayer()
			}, 100)
		}
	},
	{ deep: true },
)

// 监听窗口大小变化，调整播放器大小
const handleResize = () => {
	if (playerInstance.value && playerContainer.value) {
		playerInstance.value.updateConfig({
			width: playerContainer.value.clientWidth,
			height: Math.min(window.innerHeight * 0.6, 600),
		})
	}
}

onMounted(() => {
	if (hasRrwebData.value) {
		initPlayer()
	}

	window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
	// 销毁播放器实例
	if (playerInstance.value) {
		playerInstance.value.destroy()
		playerInstance.value = null
	}

	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<el-card class="rrweb-player-card" shadow="hover" v-loading="loading">
		<template #header>
			<div class="card-header">
				<span class="header-title">会话录屏回放</span>
			</div>
		</template>

		<div class="rrweb-player-content">
			<!-- 有录屏数据 -->
			<template v-if="hasRrwebData">
				<div ref="playerContainer" class="player-container"></div>
			</template>

			<!-- 无录屏数据 -->
			<template v-else>
				<el-empty description="暂无会话录屏数据">
					<template #description>
						<p>该错误事件未包含会话录屏数据</p>
						<p class="empty-tip">提示: 确保SDK配置中启用了rrweb插件，并设置了适当的录制模式</p>
					</template>
				</el-empty>
			</template>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.rrweb-player-card {
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

	.rrweb-player-content {
		padding: 10px 0;

		.player-container {
			width: 100%;
			min-height: 400px;
			background-color: #f5f7fa;
			border-radius: 4px;
		}

		.empty-tip {
			font-size: 12px;
			color: #909399;
			margin-top: 10px;
		}
	}
}
</style>
