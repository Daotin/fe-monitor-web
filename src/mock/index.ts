import Mock from 'mockjs'
import './dashboard'
import './error'

// 设置延迟时间，模拟网络请求
Mock.setup({
	timeout: '300-600',
})

console.log('Mock服务已启动')
