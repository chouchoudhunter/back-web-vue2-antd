import request from '@/utils/request'

const api = {
  service: '/service'
}

export default api

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}
