import request from '@/utils/request'

const api = {
  message: '/message'
}

export default api

export function getMessageList (parameter) {
  return request({
    url: api.message,
    method: 'get',
    params: parameter
  })
}
