import request from '@/utils/request'

const api = {
  section: '/section'
}

export default api

export function getSectionList (parameter) {
  return request({
    url: api.section,
    method: 'get',
    params: parameter
  })
}

export function addSection (data) {
  return request({
    url: api.section,
    method: 'post',
    data: data
  })
}

export function updateSection (data, id) {
  return request({
    url: api.section + '/' + id,
    method: 'put',
    params: data
  })
}

export function deleteSection (id) {
  return request({
    url: api.section + '/' + id,
    method: 'delete'
  })
}
