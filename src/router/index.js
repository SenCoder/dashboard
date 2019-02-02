
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const monitor = r => require.ensure([], () => r(require('@/page/monitor')), 'monitor');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const pod = r => require.ensure([], () => r(require('@/page/pod')), 'pod');
const strategy = r => require.ensure([], () => r(require('@/page/strategy')), 'strategy');
const instance = r => require.ensure([], () => r(require('@/page/instance')), 'instance');
const alert = r => require.ensure([], () => r(require('@/page/alert')), 'alert');


const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/monitor',
		component: monitor,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		}, {
			path: '/pod',
			component: pod,
			meta: ['监控服务', '监控组件'],
		}, {
			path: '/instance',
			component: instance,
			meta: ['监控服务', '监控实例'],
		}, {
			path: '/strategy',
			component: strategy,
			meta: ['监控服务', '报警配置'],
		}, {
			path: '/alert',
			component: alert,
			meta: ['消息推送', '第三方组件'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
