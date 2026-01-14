import request from '@/utils/request'

export function getCode(data) {
  return request({
    url: '/get/code',
    method: 'post',
    data
  })
}