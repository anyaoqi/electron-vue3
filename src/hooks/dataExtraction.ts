import { columnType, TypeData } from '@type/index'
import { ElLoading } from 'element-plus'
import { FieldPacket } from 'mysql2'

interface SaveDataType {
  englishFlag: string,
  englishName: string,
  sqlContent: string,
  createTimeField: string,
  updateTimeField: string
  tableData: columnType[]
}

// 定义字段类型接口
interface columnsType {
  "key": string,
  "dataKey": string,
  "title": string,
  "width"?: number
}

const formatSql = (extrData:TypeData,  updateDateTime: string) => {
  let querySql = extrData.sql
  let updateTimeField = extrData.updateTimeField
  let createTimeField = extrData.createTimeField
  // 上次抽取成功时间占位符替换成真正的时间
  // 上次更新时间占位符名称：$lastUploadTime
  let sq = `COALESCE(${updateTimeField}, ${createTimeField}) > '${updateDateTime}'`
  if(querySql.indexOf('$lastUploadTime') !== -1) {
    if(updateDateTime) {
      if(querySql.indexOf('where') == -1) {
        sq = `where ${sq}`
      } else {
        sq = `and ${sq}`
      }
    } else {
      sq = ''
    }
    querySql = querySql.replaceAll('$lastUploadTime', `${sq}`)
  }
  return querySql
}


export const useData = () => {
  const saveData = ({englishFlag, englishName, sqlContent, tableData, createTimeField, updateTimeField}: SaveDataType) => {
    let isError:boolean = false
    // 保存sql
    window.sqliteAPI.saveExtrSqlData({
      englishFlag: englishFlag,
      sql: sqlContent,
      createTimeField: createTimeField,
      updateTimeField: updateTimeField,
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
      if(!row.filedValue) {
        row.filedValue = ""
      }
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
  const getSql = (key: string, updateDateTime?: string, params?:any): Promise<string> => {
    return new Promise((resolve, reject) => {
      window.sqliteAPI.getExtrSqlData(key).then(async (data: TypeData) => {
        let querySql = data.sql
        querySql = formatSql(data, updateDateTime||'')
        if(key == 'day_invoicing') {
          let bizdate = "", license;
          if(!params){
            // 获取当前日期
            const today = new Date();
            // 获取昨天的日期
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            // 两个日期字符串
            const date1String = localStorage.getItem('startDate')||yesterday
            const date1 = new Date(date1String)
             bizdate = date1.toISOString().split('T')[0]
             license = localStorage.getItem('license')||''
          }
          if(params && params.bizdate) {
             bizdate = params.bizdate
             license = params.license
          }

         if(querySql.indexOf('$bizdate')!== -1) {
            querySql = querySql.replaceAll('$bizdate', `'${bizdate}'`)
         }
         if(querySql.indexOf('$license')!== -1) {
            querySql = querySql.replaceAll('$license', `'${license}'`)
         }

        }
        resolve(querySql)
      }).catch((err: any) => reject(err))
    })
  }
  const getExtrSqlData = (key: string, updateDateTime?: string): Promise<TypeData> => {
    return new Promise((resolve, reject) => {
      window.sqliteAPI.getExtrSqlData(key).then((data: any) => {
        // sql拼接时间条件，防止查询数据量过大导致程序崩溃
        if(updateDateTime) {
          data.sql = formatSql(data, updateDateTime)
        }
        resolve(data)
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
      window.serverAPI.queryTableDatas(sql).then(({results, columns}: any) => {
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
    viewData,
    getExtrSqlData
  }
}