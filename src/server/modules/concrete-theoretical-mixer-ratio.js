const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '查询机楼料仓列表',
    url: `${servicePath}/concrete-produce-dosage`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.get({
          path: '/cmb/concrete-produce-dosage'
        })
        return result
      }
    }
  },
  {
    description: '批量设置材料搅拌站料仓关联',
    url: `${servicePath}/material-mixing-station-relation`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', description: '主键id' },
                materialName: { type: 'string', description: '搅拌机组编号' },
                mixerNo: { type: 'number', description: '搅拌机组编号' },
                feedBin: { type: 'string', description: '料仓' }
              }
            }
          },
          ids: {
            type: 'array', description: '主键id'
          }
        },
        required: ['data', 'ids']
      }
    },
    res: {
      handler: async function (params, ctx, next) {
        const result = mbService.post({
          path: '/cmb/material-mixing-station-relation',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '查询理论设计等级',
    url: `${servicePath}/concrete-theoretical-mixer-ratio`,
    method: 'get',
    req: {},
    res: {
      handler: async function (params, ctx, next) {
        const result = mbService.get({
          path: '/cmb/concrete-theoretical-mixer-ratio'
        })
        return result
      }
    }
  },
  {
    description: '新增理论设计等级',
    url: `${servicePath}/concrete-theoretical-mixer-ratio`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          specModels: {
            type: 'array', description: '标号'
          }
        },
        required: ['specModels']
      }
    },
    res: {
      handler: async function (params, ctx, next) {
        const result = mbService.post({
          path: '/cmb/concrete-theoretical-mixer-ratio',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '删除设计等级',
    url: `${servicePath}/concrete-theoretical-mixer-ratio/_remove`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          ids: {
            type: 'array', description: '主键id'
          }
        },
        required: ['ids']
      }
    },
    res: {
      handler: async function (params, ctx, next) {
        const result = mbService.post({
          path: '/cmb/concrete-theoretical-mixer-ratio/_remove',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '修改理论配合比',
    url: `${servicePath}/concrete-theoretical-mixer-ratio`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', description: '主键id' }
              }
            }
          }
        },
        required: ['data']
      }
    },
    res: {
      handler: async function (params, ctx, next) {
        const result = mbService.patch({
          path: '/cmb/concrete-theoretical-mixer-ratio',
          body: params.$body
        })
        return result
      }
    }
  }
]
