<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEventDetail } from '../../api'
import { ElMessage } from 'element-plus'
import ErrorInfo from '../../components/error/ErrorInfo.vue'
import EnvironmentInfo from '../../components/error/EnvironmentInfo.vue'
import StackTrace from '../../components/error/StackTrace.vue'
import BehaviorStack from '../../components/error/BehaviorStack.vue'
// import RrwebPlayer from '../../components/error/RrwebPlayer.vue'
import type { EventDetail } from '../../api'

const route = useRoute()
const router = useRouter()
const errorId = ref(route.params.id as string)

// 错误详情数据
const errorDetail = ref<EventDetail | null>(null)
// 加载状态
const loading = ref(true)

// 获取错误详情数据
const fetchErrorDetail = async () => {
	try {
		loading.value = true
		console.log('获取错误详情数据，错误ID:', errorId.value)

		const data = await getEventDetail(errorId.value)
		errorDetail.value = data
		console.log('错误详情数据:', data)
	} catch (error) {
		console.error('获取错误详情数据失败:', error)
		ElMessage.error('获取错误详情数据失败')
	} finally {
		loading.value = false
	}
}

// 返回错误列表页面
const goBack = () => {
	router.push('/error')
}

onMounted(() => {
	console.log('Error Detail页面已挂载')
	console.log('错误ID:', errorId.value)
	fetchErrorDetail()
})
</script>

<template>
	<div class="error-detail-container">
		<!-- 页面头部 -->
		<div class="error-detail-header">
			<div class="header-left">
				<el-button @click="goBack" icon="Back" plain>返回错误列表</el-button>
				<h2 class="page-title">错误详情</h2>
			</div>
			<div class="header-right">
				<el-tag size="large">错误ID: {{ errorId }}</el-tag>
			</div>
		</div>

		<!-- 加载中 -->
		<div v-if="loading" class="loading-container">
			<el-skeleton :rows="10" animated />
		</div>

		<!-- 加载失败 -->
		<div v-else-if="!errorDetail" class="error-container">
			<el-empty description="加载错误详情失败">
				<template #description>
					<p>无法加载错误ID为 {{ errorId }} 的详细信息</p>
				</template>
				<el-button type="primary" @click="fetchErrorDetail">重试</el-button>
			</el-empty>
		</div>

		<!-- 错误详情内容 -->
		<template v-else>
			<!-- 错误基本信息 -->
			<ErrorInfo :data="errorDetail" />

			<!-- 错误堆栈 -->
			<StackTrace :data="errorDetail" />

			<el-row :gutter="20">
				<el-col :xs="24" :lg="12">
					<!-- 用户行为栈 -->
					<BehaviorStack :data="errorDetail" />
				</el-col>

				<el-col :xs="24" :lg="12">
					<!-- 环境信息 -->
					<EnvironmentInfo :data="errorDetail" />
				</el-col>
			</el-row>

			<!-- 会话录屏回放 -->
			<!-- <RrwebPlayer :data="errorDetail" />  -->
		</template>
	</div>
</template>

<style scoped lang="less">
.error-detail-container {
	padding: 20px;

	.error-detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		.header-left {
			display: flex;
			align-items: center;

			.page-title {
				margin: 0 0 0 15px;
				font-size: 24px;
				font-weight: 600;
				color: #303133;
			}
		}
	}

	.loading-container {
		padding: 20px;
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}

	.error-container {
		padding: 40px 0;
	}

	@media (max-width: 768px) {
		.error-detail-header {
			flex-direction: column;
			align-items: flex-start;

			.header-left {
				margin-bottom: 10px;

				.page-title {
					font-size: 20px;
				}
			}
		}
	}
}
</style>
