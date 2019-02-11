
import fetch from 'common/fetch'
import { port_table } from 'common/port_uri'

//数据列表
export function list(params) {
  console.log(port_table)
  return fetch({
    url: port_table.listAlarmApp,
    method: 'get',
    params
  })
}

//根据id查询数据
export function get(params) {
  return fetch({
    url: port_table.get,
    method: 'get',
    params
  })
}

//根据id删除数据
export function del(data) {
  console.log(data)
  return fetch({
    url: port_table.delAlarmApp + "/" + data.id,
    method: 'delete',
    // data
  })
}

//添加或修改数据
export function save(data) {
  return fetch({
    url: port_table.saveAlarmApp,
    method: 'post',
    data
  })
}

//批量删除
export function batch_del(data) {
  return fetch({
    url: port_table.batch_del,
    method: 'post',
    data
  })
}
