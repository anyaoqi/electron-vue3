import { columnType } from '@type/index'

/**
 * 将数据按照字段映射规则进行转换
 * 根据提供的字段映射规则，将查询数据转换为符合指定接口的上传数据格式。
 * @template T 泛型参数，表示最终转换后的数据项类型
 * @param datas 查询数据数组
 * @param fileds 字段映射规则，包含源字段和目标字段的对应关系
 * @returns 转换后的符合指定接口格式的数据数组
 */
export const findFiledValues = <T>(datas: Array<any>, fileds: columnType[]):T[] => {
  // 创建字段映射关系对象
  const mapping: Record<string, string> = {};
  for (const filedData of fileds) {
    mapping[filedData.filed] = filedData.filedValue
  }
  // 根据映射关系将数据转换为目标格式
  const result:T[] = datas.map((data: any) => {
    // 创建一个新对象，根据映射关系赋值
    const newItem: any = {};
    for (const key in mapping) {
      newItem[key] = data[mapping[key]]||''
    }
    newItem.created_at = data.createDate
    newItem.updated_at = data.modifyDate
    return newItem as T
  })
  return result
}