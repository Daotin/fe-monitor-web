import Mock from 'mockjs'
import { formatDate } from '../utils'

const Random = Mock.Random

// 模拟核心Web Vitals性能指标概览
Mock.mock(/\/api\/v1\/performance\/summary/, 'get', (options: any) => {
	console.log('Mock: 请求性能指标概览数据', options)

	return {
		lcp: {
			avg: Random.float(1500, 3000, 0, 2),
			p75: Random.float(2000, 4000, 0, 2),
		},
		fcp: {
			avg: Random.float(500, 1500, 0, 2),
			p75: Random.float(800, 2000, 0, 2),
		},
	}
})

// 模拟慢页面列表数据
Mock.mock(/\/api\/v1\/performance\/slow-pages/, 'get', (options: any) => {
	console.log('Mock: 请求慢页面列表数据', options)

	// 解析URL参数
	const url = new URL(options.url, 'http://localhost')
	const metric = url.searchParams.get('metric') || 'lcp'
	const limit = parseInt(url.searchParams.get('limit') || '5')

	// 页面URL列表
	const pageUrls = [
		'/user/profile',
		'/product/detail/123',
		'/checkout',
		'/cart',
		'/search?q=product',
		'/category/electronics',
		'/blog/article/10',
		'/account/settings',
		'/order/history',
		'/wishlist',
	]

	// 生成慢页面数据
	const result = []
	for (let i = 0; i < limit; i++) {
		const url = pageUrls[i % pageUrls.length]
		let value
		
		if (metric === 'lcp') {
			value = Random.float(2000, 6000, 0, 2)
		} else {
			value = Random.float(800, 3000, 0, 2)
		}
		
		result.push({
			url,
			value,
		})
	}

	// 按性能指标值降序排序（值越大表示越慢）
	result.sort((a, b) => b.value - a.value)

	return result
})

// 模拟资源加载错误列表数据
Mock.mock(/\/api\/v1\/performance\/resource-errors/, 'get', (options: any) => {
	console.log('Mock: 请求资源加载错误列表数据', options)

	// 解析URL参数
	const url = new URL(options.url, 'http://localhost')
	const limit = parseInt(url.searchParams.get('limit') || '20')

	// 资源URL模板
	const resourceUrlTemplates = [
		'https://cdn.example.com/js/main.{hash}.js',
		'https://cdn.example.com/css/styles.{hash}.css',
		'https://cdn.example.com/images/banner.{hash}.png',
		'https://api.example.com/data',
		'https://fonts.googleapis.com/css?family=Roboto',
		'https://analytics.example.com/tracker.js',
		'https://maps.example.com/api.js',
		'https://video.example.com/player.js',
		'https://ads.example.com/display.js',
		'https://cdn.example.com/vendor.{hash}.js',
	]

	// 错误类型
	const errorTypes = [
		'404 Not Found',
		'net::ERR_CONNECTION_REFUSED',
		'net::ERR_CONNECTION_TIMED_OUT',
		'net::ERR_NAME_NOT_RESOLVED',
		'net::ERR_ABORTED',
		'net::ERR_INTERNET_DISCONNECTED',
		'net::ERR_CERT_COMMON_NAME_INVALID',
		'net::ERR_FAILED',
	]

	// 标签类型
	const tagNames = ['script', 'link', 'img', 'video', 'audio', 'iframe']

	// 生成资源错误数据
	const result = []
	for (let i = 0; i < limit; i++) {
		const urlTemplate = Random.pick(resourceUrlTemplates)
		const hash = Random.string('lower', 8)
		const url = urlTemplate.replace('{hash}', hash)
		
		result.push({
			eventId: Random.guid(),
			url,
			type: Random.pick(errorTypes),
			tagName: Random.pick(tagNames),
			status: Random.boolean(0.7) ? Random.pick([404, 500, 502, 503]) : null, // 70%概率有状态码
			timestamp: formatDate(Random.date('yyyy-MM-dd HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
		})
	}

	return result
})
