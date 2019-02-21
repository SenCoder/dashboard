
import fetch from 'common/fetch'
import { port_table } from 'common/port_uri'


//添加数据
export function save(data) {
    return fetch({
        url: port_table.saveTemplate,
        method: 'post',
        data
    })
}

//根据id修改数据
export function put(data) {
    return fetch({
        url: port_table.saveTemplate + "/" + data.id,
        method: 'put',
        data
    })
}


//根据id查询数据
export function get(data) {
    console.log("debug get tpl by id")
    return fetch({
        url: port_table.getTemplate + "/" + data.id,
        method: 'get',
    })
}

//根据id删除数据
export function del(data) {
    console.log(data)
    return fetch({
        url: port_table.delTemplate + "/" + data.id,
        method: 'delete',
    })
}


//数据列表
export function list(params) {
    // console.log(port_table)
    return fetch({
        url: port_table.listTemplate,
        method: 'get',
        params
    })
}


//批量删除
export function batchDel(data) {
    return fetch({
      url: port_table.batchDelTemplate,
      method: 'post',
      data
    })
  }
  
  