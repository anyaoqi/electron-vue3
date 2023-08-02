import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios'

// 创建请求实例
const instance:AxiosInstance = axios.create({
  baseURL: 'http://localhost:5354', // 设置统一的请求前缀
  timeout: 10000, // 设置统一的超时时长
})

// 请求拦截
instance.interceptors.request.use(
  (config:InternalAxiosRequestConfig<any>) => {
    // 请求拦截添加token，用于后端的验证
    const token = localStorage.getItem('token') as string
    if(token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (err: any) => {
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(err)
  },
)

// 响应拦截
instance.interceptors.response.use(
  (response:AxiosResponse<any, any>) => {
    return  response.data
  },
  (err:any ) => {
    return Promise.reject(err.response)
  }
)

// 封装公共请求方法
export function request(config: AxiosRequestConfig): Promise<AxiosResponse>{
  return instance.request(config)
}

// 封装POST请求方法
export function post(url:string, data?:any, config?:AxiosRequestConfig<any>): Promise<AxiosResponse> {
  return instance.post(url, data, config);
}

// 封装GET请求方法
export function get(url:string, config?: AxiosRequestConfig): Promise<AxiosResponse>{
  return instance.get(url, config)
}

// 导出axios实例
export default instance