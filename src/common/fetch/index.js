//导入模块
import axios from 'axios'
import { port_code } from 'common/port_uri'
import router from 'src/router'
import { Message } from 'element-ui'
import store from 'store'
import { SET_USER_INFO } from 'store/actions/type'
// import { server_base_url } from 'common/config'

//设置用户信息action
const setUserInfo = function (user) {
  store.dispatch(SET_USER_INFO, user)
}

export default function fetch(options) {
  return new Promise((resolve, reject) => {

    //创建一个axios实例
    const instance = axios.create({
      //设置默认根地址
      // baseURL: server_base_url,
      // baseURL: "http://127.0.0.1:8000",
      baseURL: "http://hidba.paic.com.cn/monitornew",
      //设置请求超时设置
      timeout: 2000,
      headers: {
        'Authorization': '%8ZdSJ7dW!'
      }
    })

    //请求处理
    instance(options)
      .then(({ data: { Code, Description, Body } }) => {
        //请求成功时,根据业务判断状态
        if (Code === port_code.success) {
          resolve({ Code, Description, Body })
          return false

        } else if (Code === port_code.unlogin) {
          setUserInfo(null)
          router.replace({ name: "login" })

        }
        Message.warning(Description)
        reject({ Code, Description, Body })
      })
      .catch(error => {
        //请求失败时,根据业务判断状态
        console.log("fetch catch error", error)
        Message.error('操作失败!')
        if (error.response) {
          // let resError = error.response
          // let resCode = resError.status
          // let resMsg = error.message
          reject({ Code: resCode, Description: resMsg })

        } else {
          reject(error)
        }
      })
  })
}
