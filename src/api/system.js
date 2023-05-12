import request from '@/utils/request'

const api = {
  user: '/member',
  role: '/role',
  section: '/section',
  menu: '/menu'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getSectionList (parameter) {
  return request({
    url: api.section,
    method: 'get',
    params: parameter
  })
}
