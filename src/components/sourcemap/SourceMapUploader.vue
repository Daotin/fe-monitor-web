<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus'
import { uploadSourceMap } from '../../api'

interface Props {
	appId: string
	onSuccess?: () => void
}

const props = defineProps<Props>()

// 上传组件引用
const uploadRef = ref<UploadInstance>()

// 版本号
const version = ref('')

// 上传状态
const uploading = ref(false)

// 文件列表
const fileList = ref<UploadFile[]>([])

// 上传前验证
const beforeUpload = (file: File) => {
	// 验证文件类型
	if (!file.name.endsWith('.map') && !file.name.endsWith('.js.map')) {
		ElMessage.error('请上传.map或.js.map后缀的SourceMap文件')
		return false
	}

	// 验证文件大小 (限制为20MB)
	const maxSize = 20 * 1024 * 1024
	if (file.size > maxSize) {
		ElMessage.error('文件大小不能超过20MB')
		return false
	}

	// 验证版本号
	if (!version.value) {
		ElMessage.warning('请输入版本号')
		return false
	}

	return true
}

// 自定义上传方法
const customUpload = async (file: File) => {
	if (!props.appId) {
		ElMessage.warning('请先选择应用')
		return
	}

	try {
		uploading.value = true
		console.log('上传文件:', file.name)
		console.log('应用ID:', props.appId)
		console.log('版本号:', version.value)

		const response = await uploadSourceMap(props.appId, file, version.value)
		console.log('上传成功:', response)

		ElMessage.success(`文件 ${file.name} 上传成功`)

		// 清空文件列表和版本号
		fileList.value = []
		version.value = ''

		// 调用成功回调
		if (props.onSuccess) {
			props.onSuccess()
		}
	} catch (error) {
		console.error('上传失败:', error)
		ElMessage.error('文件上传失败，请重试')
	} finally {
		uploading.value = false
	}
}

// 处理文件选择变化
const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	console.log('文件变化:', uploadFile.name)
	fileList.value = uploadFiles
}

// 处理文件移除
const handleFileRemove = () => {
	fileList.value = []
}

// 提交上传
const submitUpload = () => {
	if (fileList.value.length === 0) {
		ElMessage.warning('请先选择文件')
		return
	}

	if (!version.value) {
		ElMessage.warning('请输入版本号')
		return
	}

	const file = fileList.value[0].raw as File
	customUpload(file)
}
</script>

<template>
	<el-card class="sourcemap-uploader">
		<template #header>
			<div class="card-header">
				<span class="title">上传SourceMap文件</span>
			</div>
		</template>

		<div class="upload-form">
			<el-form label-position="top">
				<el-form-item label="应用ID">
					<el-input :model-value="props.appId" disabled placeholder="应用ID" />
				</el-form-item>

				<el-form-item label="版本号">
					<el-input v-model="version" placeholder="请输入版本号，例如: 1.0.0" :disabled="uploading" />
				</el-form-item>

				<el-form-item label="SourceMap文件">
					<el-upload
						ref="uploadRef"
						class="sourcemap-upload"
						action="#"
						:auto-upload="false"
						:limit="1"
						:file-list="fileList"
						:before-upload="beforeUpload"
						:on-change="handleFileChange"
						:on-remove="handleFileRemove"
						:disabled="uploading">
						<template #trigger>
							<el-button type="primary" :disabled="uploading">选择文件</el-button>
						</template>

						<template #tip>
							<div class="el-upload__tip">请上传.map或.js.map后缀的SourceMap文件，大小不超过20MB</div>
						</template>
					</el-upload>
				</el-form-item>

				<el-form-item>
					<el-button
						type="success"
						@click="submitUpload"
						:loading="uploading"
						:disabled="fileList.length === 0 || !version">
						{{ uploading ? '上传中...' : '上传文件' }}
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-card>
</template>

<style scoped lang="less">
.sourcemap-uploader {
	margin-bottom: 20px;

	.card-header {
		.title {
			font-size: 16px;
			font-weight: 600;
		}
	}

	.upload-form {
		.sourcemap-upload {
			width: 100%;
		}

		.el-upload__tip {
			color: #909399;
			font-size: 12px;
			margin-top: 5px;
		}
	}
}
</style>
