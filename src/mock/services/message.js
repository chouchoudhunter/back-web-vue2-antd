/* eslint-disable no-unused-vars */
import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
const serviceList = (options) => {
    const totalCount = 2450
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
      message_id: tmpKey,
      content: '这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容这是消息内容',
      title: '入职通知',
      created_by: '张三',
      created_time: Mock.mock('@datetime'),
      inform_user: {
        roles: [],
        users: []
      }
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
// Mock.mock(/\/message/, 'get', serviceList)
