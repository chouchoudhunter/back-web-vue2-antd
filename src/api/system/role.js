import request from '@/utils/request'

const api = {
  role: '/role'
}

export default api

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}
export function addRole (data) {
  return request({
    url: api.role,
    method: 'post',
    data: data
  })
}
export function deleteRole (id) {
  return request({
    url: api.role + '/' + id,
    method: 'delete'
  })
}
