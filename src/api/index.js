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

//用户登录
export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}

//权限管理列表
export function authAdmin(data) {
    return request({
        url: '/auth/admin',
        method: 'get',
        params: data
    })
}

//菜单权限数据获取
export function getMenu(data) {
    return request({
        url: '/user/getmenu',
        method: 'get',
        params: data
    })
}

//菜单权限修改
export function setMenu(data) {
    return request({
        url: '/user/setmenu',
        method: 'post',
        data
    })
}

//菜单权限列表
export function menuList(data) {
    return request({
        url: '/menu/list',
        method: 'get',
        params: data
    })
}

//菜单权限下拉列表
export function menuSelectList() {
    return request({
        url: '/menu/selectlist',
        method: 'get',
    })
}

//用户信息更新
export function updateUser(data) {
    return request({
        url: '/update/user',
        method: 'post',
        data
    })
}

//用户菜单权限详情
export function menuPermissions() {
    return request({
        url: '/menu/permissions',
        method: 'get',
    })
}

// 陪护师创建
export function companion(data) {
    return request({
        url: '/companion',
        method: 'post',
        data
    })
}
