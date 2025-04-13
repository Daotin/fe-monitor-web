import Mock from 'mockjs'
import { formatDate } from '../utils'

const Random = Mock.Random

// 生成过去n天的日期数组
const generateDates = (days: number): string[] => {
	const dates: string[] = []
	const today = new Date()

	for (let i = days - 1; i >= 0; i--) {
		const date = new Date()
		date.setDate(today.getDate() - i)
		dates.push(formatDate(date, 'YYYY-MM-DD'))
	}

	return dates
}

// 模拟核心统计指标数据
Mock.mock(/\/api\/v1\/stats\/summarize/, 'get', (options: any) => {
	console.log('Mock: 请求核心统计指标', options)

	return {
		pvCount: Random.integer(5000, 50000),
		uvCount: Random.integer(1000, 10000),
		jsErrorCount: Random.integer(50, 500),
		lcpAvg: Random.float(1000, 3000, 0, 2),
	}
})

// 模拟JS错误趋势数据
Mock.mock(/\/api\/v1\/stats\/error-trend/, 'get', (options: any) => {
	console.log('Mock: 请求JS错误趋势数据', options)

	// 解析请求体中的参数
	let days = 7

	// 根据时间范围决定生成多少天的数据
	// 在真实场景中应该使用startTime和endTime计算
	const dates = generateDates(days)

	// 生成每天的错误数量
	const result = dates.map(date => ({
		date,
		count: Random.integer(5, 100),
	}))

	console.log('Mock error-trend 返回数据:', result)

	return result
})

// 模拟Top 5 JS错误列表数据
Mock.mock(/\/api\/v1\/stats\/errors/, 'get', (options: any) => {
	console.log('Mock: 请求JS错误列表数据', options)

	// 解析请求参数
	const limit = 5 // 默认取前5条

	const errorTypes = ['TypeError', 'ReferenceError', 'SyntaxError', 'RangeError', 'URIError']

	const errorMessages = [
		'Cannot read property of undefined',
		'Object is not a function',
		'Unexpected token',
		'Maximum call stack size exceeded',
		'Invalid regular expression',
		'Failed to fetch',
		'Network error',
		'Script error',
		'Out of memory',
		'Uncaught exception',
	]

	const items = Array.from({ length: limit }, () => {
		const errorType = Random.pick(errorTypes)
		const errorMessage = Random.pick(errorMessages)
		const count = Random.integer(10, 1000)
		const userCount = Random.integer(5, Math.min(count, 500))

		return {
			fingerprint: Random.guid(),
			message: `${errorType}: ${errorMessage}`,
			type: errorType,
			count,
			userCount,
			firstSeen: formatDate(Random.date('yyyy-MM-dd'), 'YYYY-MM-DD HH:mm:ss'),
			lastSeen: formatDate(Random.date('yyyy-MM-dd'), 'YYYY-MM-DD HH:mm:ss'),
			sampleEventId: Random.guid(),
		}
	})

	// 按count降序排序
	items.sort((a, b) => b.count - a.count)

	return {
		items,
		total: Random.integer(items.length, 100),
	}
})
