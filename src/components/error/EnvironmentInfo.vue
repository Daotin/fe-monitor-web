<script setup lang="ts">
import type { EventDetail } from '../../api'

// 定义组件属性
interface Props {
	data: EventDetail
	loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
})

// 环境信息项
const envItems = [
	{ key: 'browser', label: '浏览器', icon: 'Chrome' },
	{ key: 'os', label: '操作系统', icon: 'Monitor' },
	{ key: 'device', label: '设备类型', icon: 'Cellphone' },
	{ key: 'screenSize', label: '屏幕尺寸', icon: 'FullScreen' },
	{ key: 'language', label: '语言', icon: 'ChatDotRound' },
]
</script>

<template>
	<el-card class="env-info-card" shadow="hover" v-loading="loading">
		<template #header>
			<div class="card-header">
				<span class="header-title">环境信息</span>
			</div>
		</template>

		<div class="env-info-content">
			<div class="env-grid">
				<div v-for="item in envItems" :key="item.key" class="env-item">
					<el-icon class="env-icon"><component :is="item.icon" /></el-icon>
					<div class="env-details">
						<div class="env-label">{{ item.label }}</div>
						<div class="env-value">{{ data.payload.meta[item.key] || '未知' }}</div>
					</div>
				</div>
			</div>

			<!-- 用户代理信息 -->
			<div class="user-agent-container" v-if="data.payload.meta.userAgent">
				<div class="user-agent-label">User Agent</div>
				<div class="user-agent-value">{{ data.payload.meta.userAgent }}</div>
			</div>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.env-info-card {
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

	.env-info-content {
		padding: 10px 0;

		.env-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 20px;
			margin-bottom: 20px;

			.env-item {
				display: flex;
				align-items: center;

				.env-icon {
					font-size: 24px;
					color: #409eff;
					margin-right: 15px;
				}

				.env-details {
					flex: 1;

					.env-label {
						font-size: 14px;
						color: #909399;
						margin-bottom: 5px;
					}

					.env-value {
						font-size: 14px;
						color: #303133;
						font-weight: 500;
					}
				}
			}

			@media (max-width: 768px) {
				grid-template-columns: 1fr;
			}
		}

		.user-agent-container {
			margin-top: 20px;
			padding-top: 20px;
			border-top: 1px solid #ebeef5;

			.user-agent-label {
				font-size: 14px;
				color: #909399;
				margin-bottom: 5px;
			}

			.user-agent-value {
				font-size: 14px;
				color: #303133;
				background-color: #f5f7fa;
				padding: 10px;
				border-radius: 4px;
				word-break: break-all;
			}
		}
	}
}
</style>
