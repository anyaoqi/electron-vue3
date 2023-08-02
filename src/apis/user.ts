import { request } from '@/apis/axios'

// 获取用户
export function getUser(url: string) {
  return request({
    url: url,
  })
}