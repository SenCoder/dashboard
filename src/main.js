
//导入样式
import 'normalize.css'
import 'font-awesome/scss/font-awesome.scss'
import 'element-ui/lib/theme-default/index.css'

import Vue from 'vue'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import router from './router'
import store from 'store'

//导入请求框架
import api from './api'
//导入自定义插件
import Plugins from 'plugins'
import App from './App'
import './mock'

//使用element-ui
Vue.use(ElementUI)

//使用自定义插件
Vue.use(Plugins)

// Fully import
Vue.use(VCharts)

//使用api
Vue.use(api)

//发布后是否显示提示
Vue.config.productionTip = false

//是否开启工具调试
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  ...App
}).$mount('mainbody')
