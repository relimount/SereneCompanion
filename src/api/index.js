import request from '@/utils/request'

//获取验证码
export function getCode(data) {
  return request({
    url: '/get/code',
    method: 'post',
    data
  })
}

//用户注册
export function userAuthentication(data) {
    return request({
        url: '/user/authentication',
        method: 'post',
        data
    })
}