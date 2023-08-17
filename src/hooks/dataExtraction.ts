import { columnType } from '@/types'
import { ElLoading } from 'element-plus'
import { FieldPacket } from 'mysql2'

interface SaveDataType {
  englishFlag: string,
  englishName: string,
  sqlContent: string,
  tableData: columnType[]
}

// 定义字段类型接口
interface columnsType {
  "key": string,
  "dataKey": string,
  "title": string,
  "width"?: number
}

export const useData = () => {
  const saveData = ({englishFlag, englishName, sqlContent, tableData}: SaveDataType) => {
    let isError:boolean = false
    // 保存sql
    window.sqliteAPI.saveExtrSqlData({
      englishFlag: englishFlag,
      sql: sqlContent,
    }).catch((err: any) => {
      isError = true
      ElMessage({
        type: 'error',
        message: err
      })
    })
    // 循环保存接口对照
    console.log('tableData', tableData);
    
    for (const row of tableData) {
      console.log('row', row);
      
      window.sqliteAPI.saveExtrMappData({
        filed: row.filed,  // 接口字段key
        name: row.name,  // 接口字段名称
        filedValue: row.filedValue,    // 对应字段key
        defaultValue: row.defaultValue, // 默认值
        description: row.description, // 描述
        englishFlag: englishFlag,  // 抽取类型key
        englishName: englishName   // 抽取类型名称
      }).catch((err: any) => {
        isError = true
        ElMessage({
          type: 'error',
          message: err
        })
      })
    }
  
    !isError && ElMessage.success('保存成功！')
  }
  // 获取sql语句
  const getSql = (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      window.sqliteAPI.getExtrSqlData(key).then((data: any) => {
        resolve(data.sql)
      }).catch((err: any) => reject(err))
    })
  }
  const getTableData = (key: string): Promise<columnType[]> => {
    return new Promise((resolve, reject) => {
      // 获取之前配置的数据
      window.sqliteAPI.getExtrMappData(key).then((rows: any) => {
        if(rows && rows.length) {
          const tableData = rows.map((row: any) => {
            return {
              filed: row.filed,
              name: row.name,
              filedValue: row.filed_value,
              defaultValue: row.default_value,
              description: row.description,
            }
          })
          resolve(tableData)
        } else {
          resolve([])
        }
      }).catch((err: any) => reject(err))
    })
    
  }

  // 预览视图
  const viewData = (sql: string) => {
    const loading = ElLoading.service({
      lock: true,
      text: '数据查询中,请稍候...',
      background: 'rgba(255,255,255,0.8)',
    })

    return new Promise((resolve, reject) => {
      window.serverAPI.getShopInfos(sql).then(({results, columns}: any) => {
        const tableData = results
        const tableColumns:columnsType[] = columns.map((column: FieldPacket) => {
          return {
              "key": column.name,
              "dataKey": column.name,
              "title": column.name,
              "width": column.name.length * 18
          }
        })
        const filedList = columns.map((column:FieldPacket) => ({ Field: column.name }))
        loading.close()
        resolve({
          tableData,
          tableColumns,
          filedList
        })
      }).catch((err: any) => {
        ElMessage.warning(err.message)
        loading.close()
        reject(err)
      })
    })
  }

  return {
    saveData,
    getSql,
    getTableData,
    viewData
  }
}