import Mock from 'mockjs'
import { formatDate } from '../utils'

const Random = Mock.Random

// 模拟已上传的SourceMap文件列表
Mock.mock(/\/api\/v1\/sourcemaps/, 'get', (options: any) => {
	console.log('Mock: 请求SourceMap文件列表', options)

	// 解析URL参数
	const url = new URL(options.url, 'http://localhost')
	const appId = url.searchParams.get('appId') || 'demo-app'

	// 生成随机文件列表
	const fileCount = Random.integer(3, 10)
	const result = []

	for (let i = 0; i < fileCount; i++) {
		const version = `${Random.integer(1, 9)}.${Random.integer(0, 9)}.${Random.integer(0, 9)}`
		const hash = Random.string('lower', 8)
		
		result.push({
			id: Random.guid(),
			appId,
			fileName: `main.${hash}.js.map`,
			originalFileName: `main.${hash}.js`,
			version,
			size: Random.integer(500000, 5000000), // 文件大小(字节)
			uploadTime: formatDate(Random.date('yyyy-MM-dd HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
			status: Random.pick(['active', 'inactive']),
		})
	}

	// 按上传时间降序排序
	result.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())

	return result
})

// 模拟上传SourceMap文件
Mock.mock(/\/api\/v1\/sourcemaps\/upload/, 'post', (options: any) => {
	console.log('Mock: 上传SourceMap文件', options)

	// 模拟上传成功
	return {
		success: true,
		id: Random.guid(),
		fileName: options.body ? JSON.parse(options.body).fileName || 'unknown.js.map' : 'unknown.js.map',
		uploadTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
	}
})

// 模拟删除SourceMap文件
Mock.mock(/\/api\/v1\/sourcemaps\/\w+/, 'delete', (options: any) => {
	console.log('Mock: 删除SourceMap文件', options)

	// 从URL中提取文件ID
	const matches = options.url.match(/\/sourcemaps\/([^/?]+)/)
	const fileId = matches ? matches[1] : 'unknown'

	// 模拟删除成功
	return {
		success: true,
		id: fileId,
	}
})
