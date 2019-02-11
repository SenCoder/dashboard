
import fetch from 'common/fetch'
import { port_table } from 'common/port_uri'


//添加或修改数据
export function save(data) {
    return fetch({
        url: port_table.saveMonitorApp,
        method: 'post',
        data
    })
}


//根据id查询数据
export function get(data) {
    return fetch({
        url: port_table.getMonitorApp + "/" + data.id,
        method: 'get',
        // params
    })
}

//根据id删除数据
export function del(data) {
    console.log(data)
    return fetch({
        url: port_table.delMonitorApp + "/" + data.id,
        method: 'delete',
        // data
    })
}


//数据列表
export function list(params) {
    console.log(port_table)
    return fetch({
        url: port_table.listMonitorApp,
        method: 'get',
        params
    })
}
