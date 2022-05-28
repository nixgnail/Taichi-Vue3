import request from '@/utils/request'

// 查询快捷键列表
export function listShortcukey(query) {
  return request({
    url: '/bee/shortcutkey/list',
    method: 'get',
    params: query
  })
}

// 查询快捷键详细
export function getShortcukey(id) {
  return request({
    url: '/bee/shortcutkey/' + id,
    method: 'get'
  })
}

// 新增快捷键
export function addShortcukey(data) {
  return request({
    url: '/bee/shortcutkey',
    method: 'post',
    data: data
  })
}

// 修改快捷键
export function updateShortcukey(data) {
  return request({
    url: '/bee/shortcutkey',
    method: 'put',
    data: data
  })
}

// 删除快捷键
export function delShortcukey(id) {
  return request({
    url: '/bee/shortcutkey/' + id,
    method: 'delete'
  })
}