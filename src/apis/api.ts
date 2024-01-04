
// 封装请求方法
export const requestSoap = async (code: string, params: any) => {
  let res:any = null
  try {
    console.log('触发接口：', code, params);
    res = await window.electronAPI.requestSoap(code, params)
  } catch (err: any) {
    console.warn(err.message);
    console.log('请求接口：', code, params);
    throw Error(err.message)
  }
  return res
}