/**
 * Created by zzmhot on 2017/3/23.
 *
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//view page warp component
import viewPageComponent from 'pages/App'

//home
import homeComponent from 'pages/home'
import noPageComponent from 'pages/error/404'
import loginComponent from 'pages/user/login'
import baseTableComponent from 'pages/table/base'
import sortTableComponent from 'pages/table/sort'
import saveTableComponent from 'pages/table/save'
import saveStrategy from 'pages/table/saveStrategy'
import saveAlertApp from 'pages/table/saveAlertApp'

import strategy from 'pages/table/strategy'
import alert from 'pages/table/alert'
import sendMessage from 'pages/message'

import barChartsComponent from 'pages/charts/bar'

Vue.use(VueRouter)

//使用AMD方式加载
// component: resolve => require(['pages/home'], resolve),
const routes = [
  {
    path: '/404',
    name: 'notPage',
    component: noPageComponent
  },
  {
    path: '*',
    redirect: '/404'
  },
  {
    path: '/user/login',
    name: 'login',
    component: loginComponent
  },
  {
    path: '/',
    redirect: '/home',
    component: viewPageComponent,
    children: [{
      path: '/home',
      name: 'home',
      component: homeComponent,
      meta: {
        title: "主页",
        auth: true
      }
    },
    {
      path: '/monitor/pod',
      name: 'pod',
      component: baseTableComponent,
      meta: {
        title: "监控组件",
        auth: true
      }
    },
    {
      path: '/monitor/instance',
      name: 'instance',
      component: sortTableComponent,
      meta: {
        title: "监控实例",
        auth: true
      }
    },
    {
      path: '/monitor/strategy',
      name: 'strategy',
      component: strategy,
      meta: {
        title: "告警配置",
        auth: true
      }
    },
    {
      path: '/monitor/pod/update/:id',
      name: 'tableUpdate',
      component: saveTableComponent,
      meta: {
        title: "组件修改",
        auth: true
      }
    },
    {
      path: '/monitor/pod/add',
      name: 'tableAdd',
      component: saveTableComponent,
      meta: {
        title: "新增组件",
        auth: true
      }
    },
    {
      path: '/monitor/strategy/add',
      name: 'strategyAdd',
      component: saveStrategy,
      meta: {
        title: "新增告警策略",
        auth: true
      }
    },
    {
      path: '/alert/chart',
      name: 'chartsBar',
      component: barChartsComponent,
      meta: {
        title: "数据统计",
        auth: true
      }
    },
    {
      path: '/alert/app',
      name: 'chartsBar',
      component: alert,
      meta: {
        title: "应用接入",
        auth: true
      }
    },
    {
      path: '/alert/app/add',
      name: 'alertAppAdd',
      component: saveAlertApp,
      meta: {
        title: "新增应用",
        auth: true
      }
    },
    {
      path: '/alert/mock',
      name: 'sendMessage',
      component: sendMessage,
      meta: {
        title: "一键报警",
        auth: true
      }
    }]
  }]

const router = new VueRouter({
  routes,
  mode: 'hash', //default: hash ,history
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

//全局路由配置
//路由开始之前的操作
router.beforeEach((to, from, next) => {
  NProgress.done().start()
  let toName = to.name
  // let fromName = from.name
  let is_login = store.state.user_info.login

  if (!is_login && toName !== 'login') {
    next({
      name: 'login'
    })
  } else {
    if (is_login && toName === 'login') {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})

//路由完成之后的操作
router.afterEach(route => {
  NProgress.done()
})

export default router
