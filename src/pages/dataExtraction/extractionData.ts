export default [
 { 
    key: 'store',
    name: '门店信息抽取',
    apiFilds: [
      {
        filed: 'key1',
        name: '门店ID',
      },
      {
        filed: 'key2',
        name: '门店名称',
      },
      {
        filed: 'key3',
        name: '法人',
      },
      {
        filed: 'key4',
        name: '手机号码',
      },
      {
        filed: 'key5',
        name: '地址',
      },
      {
        filed: 'key6',
        name: '注册时间',
      },
    ]
  },
  {
    key: 'goods',
    name: '商品信息抽取',
    apiFilds: []
  },
  {
    key: 'member',
    name: '会员信息抽取',
    apiFilds: []
  },
  {
    key: 'inStash',
    name: '入库单据抽取',
    apiFilds: []
  },
  {
    key: 'day',
    name: '日结进销存',
    apiFilds: []
  },
]