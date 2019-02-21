import * as api_file from './file'
import * as api_table from './table'
import * as api_user from './user'
import * as monitorApi from './monitor'
import * as alarmApi from './alarm'
import * as triggerApi from './strategy'
import * as targetApi from './target'

const apiObj = {
  api_file,
  api_table,
  api_user,
  monitorApi,
  alarmApi,
  triggerApi,
  targetApi
}

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  //定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $fetch: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}
