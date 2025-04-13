import Mock from 'mockjs'
import { formatDate } from '../utils'

const Random = Mock.Random

// 错误类型列表
const errorTypes = [
	'TypeError',
	'ReferenceError',
	'SyntaxError',
	'RangeError',
	'URIError',
	'EvalError',
	'InternalError',
]

// 错误消息模板
const errorMessages = [
	"Cannot read property '{{property}}' of {{value}}",
	'{{variable}} is not defined',
	'Unexpected token {{token}}',
	'Maximum call stack size exceeded',
	'Invalid regular expression: /{{regex}}/',
	'Failed to fetch resource: {{url}}',
	'Network error when attempting to fetch resource',
	'Script error',
	'Out of memory',
	'Uncaught exception: {{message}}',
	'The operation is insecure',
	'Permission denied to access property "{{property}}"',
	'The operation is not supported',
	'Invalid argument',
	"Object doesn't support property or method '{{method}}'",
]

// 浏览器列表
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'IE', 'Opera']

// 操作系统列表
const operatingSystems = ['Windows', 'MacOS', 'Linux', 'iOS', 'Android']

// 设备类型列表
const deviceTypes = ['Desktop', 'Mobile', 'Tablet']

// 页面URL列表
const pageUrls = [
	'https://example.com/',
	'https://example.com/login',
	'https://example.com/dashboard',
	'https://example.com/profile',
	'https://example.com/settings',
	'https://example.com/products',
	'https://example.com/cart',
	'https://example.com/checkout',
]

// 生成随机错误消息
const generateErrorMessage = () => {
	const template = Random.pick(errorMessages)
	return template
		.replace('{{property}}', Random.word())
		.replace('{{value}}', Random.pick(['undefined', 'null', 'NaN', '{}', '[]']))
		.replace('{{variable}}', Random.word())
		.replace('{{token}}', Random.pick([')', '}', ']', ',', '.', ':', ';']))
		.replace('{{regex}}', Random.pick(['[', '(', '*', '+', '?', '{']))
		.replace('{{url}}', Random.url())
		.replace('{{message}}', Random.sentence(3, 8))
		.replace('{{method}}', Random.word())
}

// 生成随机错误堆栈
const generateErrorStack = (errorType: string, errorMessage: string, url: string) => {
	const stackFrames = Random.integer(3, 8)
	let stack = `${errorType}: ${errorMessage}\n`

	for (let i = 0; i < stackFrames; i++) {
		const isMinified = i === 0 ? false : Random.boolean()
		const fileName = isMinified ? `${url.split('/').pop()?.split('.')[0]}.min.js` : `${Random.word()}.js`
		const functionName = isMinified ? Random.string('lower', 1, 3) : Random.word(3, 10)
		const line = Random.integer(1, 5000)
		const column = Random.integer(1, 500)

		stack += `    at ${functionName} (${url.replace(/\/$/, '')}/${fileName}:${line}:${column})\n`
	}

	return stack
}

// 生成解析后的堆栈信息
const generateParsedStack = (stack: string) => {
	const lines = stack.split('\n')
	const parsedStack = []

	// 跳过第一行（错误消息）
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim()
		if (!line) continue

		// 解析堆栈行
		const match = line.match(/at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/)
		if (match) {
			parsedStack.push({
				func: match[1],
				file: match[2],
				line: parseInt(match[3]),
				column: parseInt(match[4]),
			})
		}
	}

	return parsedStack
}

// 生成用户行为栈
const generateBehaviorStack = () => {
	const behaviorTypes = ['click', 'input', 'navigation', 'api', 'pageview', 'scroll', 'resize', 'keypress']

	const stackSize = Random.integer(5, 15)
	const now = new Date().getTime()
	const behaviors = []

	for (let i = 0; i < stackSize; i++) {
		const type = Random.pick(behaviorTypes)
		const timestamp = now - (stackSize - i) * Random.integer(1000, 5000)

		let behavior: any = {
			type,
			timestamp,
		}

		switch (type) {
			case 'click':
				behavior.element = Random.pick(['button', 'a', 'div', 'span', 'img'])
				behavior.text = Random.sentence(1, 3)
				behavior.position = { x: Random.integer(0, 1000), y: Random.integer(0, 800) }
				break
			case 'input':
				behavior.element = 'input'
				behavior.value = '[MASKED]' // 敏感信息已脱敏
				break
			case 'navigation':
				behavior.from = Random.pick(pageUrls)
				behavior.to = Random.pick(pageUrls)
				break
			case 'api':
				behavior.method = Random.pick(['GET', 'POST', 'PUT', 'DELETE'])
				behavior.url = `/api/${Random.word()}`
				behavior.status = Random.pick([200, 201, 400, 401, 403, 404, 500])
				break
			case 'pageview':
				behavior.url = Random.pick(pageUrls)
				behavior.title = Random.sentence(2, 5)
				break
			case 'scroll':
				behavior.position = { x: Random.integer(0, 100), y: Random.integer(0, 1000) }
				break
		}

		behaviors.push(behavior)
	}

	return behaviors
}

// 生成rrweb录屏数据（简化版，实际数据结构更复杂）
const generateRrwebData = () => {
	const eventCount = Random.integer(50, 200)
	const now = new Date().getTime()
	const events = []

	for (let i = 0; i < eventCount; i++) {
		const timestamp = now - (eventCount - i) * Random.integer(50, 200)

		// 这里只是模拟rrweb数据结构，实际数据更复杂
		events.push({
			type: Random.integer(0, 5),
			data: {},
			timestamp,
		})
	}

	return events
}

// 生成错误详情数据
const generateErrorDetail = (id: string) => {
	const errorType = Random.pick(errorTypes)
	const errorMessage = generateErrorMessage()
	const url = Random.pick(pageUrls)
	const stack = generateErrorStack(errorType, errorMessage, url)
	const parsedStack = generateParsedStack(stack)
	// const parsedStack = []
	const behaviorStack = generateBehaviorStack()
	const rrwebData = Random.boolean(0.7) ? generateRrwebData() : undefined // 70%的概率有录屏数据

	return {
		id,
		appId: 'demo-app',
		userId: `user-${Random.integer(1000, 9999)}`,
		type: 'error',
		subType: 'jsError',
		timestamp: formatDate(Random.date('yyyy-MM-dd HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
		payload: {
			message: errorMessage,
			stack,
			parsedStack,
			meta: {
				url,
				browser: `${Random.pick(browsers)} ${Random.integer(70, 120)}`,
				os: `${Random.pick(operatingSystems)} ${Random.integer(10, 15)}.${Random.integer(0, 9)}`,
				device: Random.pick(deviceTypes),
				screenSize: `${Random.integer(1024, 3840)}x${Random.integer(768, 2160)}`,
				language: Random.pick(['en-US', 'zh-CN', 'es-ES', 'fr-FR', 'de-DE']),
				userAgent: Random.sentence(10, 20),
			},
			behaviorStack,
			rrwebData,
		},
		createdAt: formatDate(Random.date('yyyy-MM-dd HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss'),
	}
}

// 生成错误列表数据
const generateErrorList = (page: number, limit: number, sortBy: string) => {
	const total = 100 // 总错误数
	const items = []

	for (let i = 0; i < limit; i++) {
		const index = (page - 1) * limit + i
		if (index >= total) break

		const errorType = Random.pick(errorTypes)
		const errorMessage = generateErrorMessage()
		const count = Random.integer(10, 1000)
		const userCount = Random.integer(5, Math.min(count, 500))
		const firstSeen = formatDate(Random.date('yyyy-MM-dd'), 'YYYY-MM-DD HH:mm:ss')
		const lastSeen = formatDate(Random.date('yyyy-MM-dd'), 'YYYY-MM-DD HH:mm:ss')
		const sampleEventId = Random.guid()

		items.push({
			fingerprint: Random.guid(),
			message: `${errorType}: ${errorMessage}`,
			type: errorType,
			count,
			userCount,
			firstSeen,
			lastSeen,
			sampleEventId,
		})
	}

	// 根据排序参数排序
	if (sortBy) {
		const [field, order] = sortBy.split('_')
		items.sort((a: any, b: any) => {
			let result = 0

			switch (field) {
				case 'count':
					result = a.count - b.count
					break
				case 'userCount':
					result = a.userCount - b.userCount
					break
				case 'firstSeen':
					result = new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime()
					break
				case 'lastSeen':
					result = new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime()
					break
			}

			return order === 'desc' ? -result : result
		})
	}

	return {
		items,
		total,
		page,
		limit,
	}
}

// 模拟错误列表接口
Mock.mock(/\/api\/v1\/stats\/errors/, 'get', (options: any) => {
	console.log('Mock: 请求JS错误列表数据', options)

	// 解析URL参数
	const url = new URL(options.url, 'http://localhost')
	const page = parseInt(url.searchParams.get('page') || '1')
	const limit = parseInt(url.searchParams.get('limit') || '20')
	const sortBy = url.searchParams.get('sortBy') || 'lastSeen_desc'

	const result = generateErrorList(page, limit, sortBy)
	console.log(`Mock: 返回${result.items.length}条错误数据，总数${result.total}`)

	return result
})

// 模拟错误详情接口
Mock.mock(/\/api\/v1\/events\/.*/, 'get', (options: any) => {
	console.log('Mock: 请求错误详情数据', options)

	// 从URL中提取错误ID
	const matches = options.url.match(/\/events\/([^/?]+)/)
	const errorId = matches ? matches[1] : 'unknown'

	const result = generateErrorDetail(errorId)
	console.log('Mock: 返回错误详情数据', errorId)

	return result
})
