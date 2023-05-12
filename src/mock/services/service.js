/* eslint-disable no-unused-vars */
import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
const serviceList = (options) => {
    const totalCount = 15
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      service_id: tmpKey,
      desc: '这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述这是一段描述',
      icon: 'wallet',
      name: 'xxx系统',
      front_url: 'xxx',
      back_url: 'aaaa',
      created_time: Mock.mock('@datetime')
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}
// Mock.mock(/\/service/, 'get', serviceList)
