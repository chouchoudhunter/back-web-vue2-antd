import request from '@/utils/request'

const api = {
  menu: '/menu'
}

export default api

export function getMenuList (parameter) {
  return request({
    url: api.menu,
    method: 'get',
    params: parameter
  })
}

export function addMenu (data) {
    return request({
        url: api.menu,
        method: 'post',
        data: data
      })
}
