import request from '@/utils/request'

const api = {
  user: '/user',
  changePassword: '/user/password'
}

export default api

export function changePassword (data) {
  return request({
    url: api.changePassword,
    method: 'post',
    data: data
  })
}

export function getUserList (params) {
  return request({
    url: api.user,
    method: 'get',
    params: params
  })
}
export function addUser (data) {
  return request({
    url: api.user,
    method: 'post',
    data: data
  })
}

export function deleteUser (id) {
  return request({
    url: api.user + '/' + id,
    method: 'delete'
  })
}

export function updateUser (data, id) {
  return request({
    url: api.user + '/' + id,
    method: 'put',
    params: data
  })
}
