const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '新增统计周期',
    url: `${servicePath}/concrete-stat-period`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            from: 'query'
          },
          endDate: {
            type: 'string',
            from: 'query'
          },
          unit: {
            type: 'string',
            from: 'query'
          }
        },
        required: ['startDate', 'endDate', 'unit']
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.post({
          path: '/cmb/concrete-stat-period',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '查询周期所在的理论配合比记录',
    url: `${servicePath}/concrete-stat-mixer-ratio`,
    method: 'get',
    req: {
      statId: {
        type: 'number',
        from: 'query',
        require: true
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.get({
          path: '/cmb/concrete-stat-mixer-ratio',
          query: ctx.query
        })
        return result
      }
    }
  },
  {
    description: '查询统计周期',
    url: `${servicePath}/concrete-stat-period`,
    method: 'get',
    req: {},
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.get({
          path: '/cmb/concrete-stat-period'
        })
        return result
      }
    }
  },
  {
    description: '删除统计周期',
    url: `${servicePath}/concrete-stat-period/_remove`,
    method: 'delete',
    req: {
      id: {
        type: 'number',
        from: 'query',
        require: true
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.delete({
          path: '/cmb/concrete-stat-period/_remove',
          query: ctx.query
        })
        return result
      }
    }
  },
  {
    description: '修改统计周期',
    url: `${servicePath}/concrete-stat-period`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            from: 'query'
          },
          unit: {
            type: 'string',
            from: 'query'
          }
        },
        required: ['id', 'unit']
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.patch({
          path: '/cmb/concrete-stat-period',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '查询地材节超分析设计量明细',
    url: `${servicePath}/concrete-material-analyse/design-quantity`,
    method: 'get',
    req: {
      id: {
        type: 'number',
        from: 'query',
        require: true
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.get({
          path: '/cmb/concrete-material-analyse/design-quantity',
          query: ctx.query
        })
        return result
      }
    }
  },
  {
    description: '查询地材节超分析记录',
    url: `${servicePath}/concrete-material-analyse`,
    method: 'get',
    req: {
      id: {
        type: 'number',
        from: 'query',
        require: true
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.get({
          path: '/cmb/concrete-material-analyse',
          query: ctx.query
        })
        return result
      }
    }
  },
  {
    description: '新增地材节超分析统计',
    url: `${servicePath}/concrete-material-analyse`,
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
                materialName: { type: 'string', description: '材料名称' }
              }
            }
          },
          concreteStatPeriodId: { type: 'number' }
        },
        required: ['data', 'concreteStatPeriodId']
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.post({
          path: '/cmb/concrete-material-analyse',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '修改地材节超分析统计',
    url: `${servicePath}/concrete-material-analyse`,
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
                id: { type: 'number', description: '主键id' },
                materialName: { type: 'string', description: '材料名称' }
              }
            }
          }
        },
        required: ['data']
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.patch({
          path: '/cmb/concrete-material-analyse',
          body: params.$body
        })
        return result
      }
    }
  },
  {
    description: '同步地材节超分析设计量',
    url: `${servicePath}/concrete-material-analyse/sync-design-quantity`,
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
                id: { type: 'number', description: '主键id' },
                periodDesignQuantity: { type: 'number', description: '本期设计量' }
              }
            }
          },
          statId: { type: 'number', description: '统计周期id' },
          year: { type: 'number', description: '统计年' },
          isLast: { type: 'boolean', description: '是否最新数据' },
          unit: { type: 'string', description: '单位' },
          periodDesignChangeQuantity: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                materialName: { type: 'string', description: '材料名称' },
                changeQuantity: { type: 'number', description: '材料本期设计量增减值' }
              }
            }
          }
        },
        required: ['data', 'statId', 'isLast', 'unit', 'periodDesignChangeQuantity', 'year']
      }
    },
    res: {
      schema,
      handler: async function (params, ctx, next) {
        const result = await mbService.patch({
          path: '/cmb/concrete-material-analyse/sync-design-quantity',
          body: params.$body
        })
        return result
      }
    }
  }
]
