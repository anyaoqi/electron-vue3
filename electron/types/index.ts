export interface TypeData {
  typeName: string,
  englishFlag: string,
}

export interface apiFiledType {
  filedKey: string
  filedName: string,
  extractionKey: string,
  extractionName: string
}

export interface extrMappType {
  createdAt: string, // 创建时间
  updatedAt: string, // 更新时间
  filed: string,  // 接口字段key
  name: string,  // 接口字段名称
  filedValue: string,    // 对应字段key
  defaultValue: string, // 默认值
  description: string, // 描述
  englishFlag: string,  // 抽取类型key
  englishName: string   // 抽取类型名称
}
