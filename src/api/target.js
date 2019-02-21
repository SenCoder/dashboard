
import fetch from 'common/fetch'
import { port_table } from 'common/port_uri'


//添加数据
export function save(data) {
    return fetch({
        url: port_table.saveTarget,
        method: 'post',
        data
    })
}


//根据id修改数据
export function put(params, data) {
    return fetch({
        url: port_table.putTarget + "/" + data.id,
        method: 'put',
        params,
        data
    })
}


//根据id查询数据
export function get(data) {
    return fetch({
        url: port_table.getTarget + "/" + data.id,
        method: 'get',
        // params
    })
}

//根据id查询监控数据
export function getMetric(params, data) {
    return fetch({
        url: "/api/target/" + data.id + "/query",
        method: 'get',
        params
    })
    // url: "http://127.0.0.1:8086/query?db=mydb&q=select * from cpu",
}


//数据列表
export function list(params) {
    // console.log(port_table)
    return fetch({
        url: port_table.listTarget,
        method: 'get',
        params
    })
}
