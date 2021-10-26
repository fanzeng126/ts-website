const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '查询申请部位',
    url: `${servicePath}/non-tunnel/application-parts`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          unitWorkIds: { type: 'array' },
          entryWorkIds: { type: 'array' },
          partName: { type: 'string' },
          specModels: { type: 'array' },
          relatedStatus: { type: 'integer' },
          projectEntryWorkId: { type: 'integer' },
          partSpecModel: { type: 'string' },
          offset: { type: 'integer' },
          limit: { type: 'integer' }
        },
        required: ['offset', 'limit']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const fnList = mbService.post({
          path: '/cmb/non-tunnel/application-parts',
          body: params.$body
        })
        const fnCount = mbService.post({
          path: '/cmb/non-tunnel/application-parts/count',
          body: params.$body
        })
        const data = await Promise.all([fnList, fnCount])
        return {
          data: data[0],
          count: data[1]
        }
      }
    }
  },
  {
    description: '关联当前算量部位',
    url: `${servicePath}/non-tunnel/application-parts/related`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          partId: { type: 'integer' },
          entryWorkId: { type: 'integer' },
          projectUnitWorkId: { type: 'integer' },
          specModel: { type: 'string' },
          isNewPart: { type: 'boolean' },
          applicationRecordIds: { type: 'array' }
        }
      },
      required: ['partId', 'specModel', 'isNewPart', 'applicationRecordIds']
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/non-tunnel/application-parts/related',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '取消当前算量部位',
    url: `${servicePath}/non-tunnel/application-parts/cancel-related`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          ticketRefIds: { type: 'array' }
        }
      },
      required: ['ticketRefIds']
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/non-tunnel/application-parts/cancel-related',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '设置新增部位',
    url: `${servicePath}/non-tunnel/application-parts/add`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          applicationPartIds: { type: 'array' }
        }
      },
      required: ['applicationRecordIds']
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/non-tunnel/application-parts/add',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '取消设置部位',
    url: `${servicePath}/non-tunnel/application-parts/cancel-add`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          partId: { type: 'integer' }
        }
      },
      required: ['partId']
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/non-tunnel/application-parts/cancel-add',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '查询拌合站机楼部位',
    url: `${servicePath}/non-tunnel/machine-parts`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          partName: { type: 'string' },
          specModels: { type: 'array' },
          relatedStatus: { type: 'integer' },
          projectEntryWorkId: { type: 'integer' },
          partSpecModel: { type: 'string' },
          offset: { type: 'integer' },
          limit: { type: 'integer' }
        },
        required: ['offset', 'limit']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const fnList = mbService.post({
          path: '/cmb/non-tunnel/machine-parts',
          body: params.$body
        })
        const fnCount = mbService.post({
          path: '/cmb/non-tunnel/machine-parts/count',
          body: params.$body
        })
        const data = await Promise.all([fnList, fnCount])
        return {
          data: data[0],
          count: data[1]
        }
      }
    }
  },
  {
    description: '算量部位关联机楼部位',
    url: `${servicePath}/non-tunnel/machine-parts/related`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          partId: { type: 'integer' },
          entryWorkId: { type: 'integer' },
          projectUnitWorkId: { type: 'integer' },
          specModel: { type: 'string' },
          isNewPart: { type: 'boolean' },
          concretePartIds: { type: 'array' }
        },
        required: ['partId', 'concretePartIds', 'specModel', 'isNewPart']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/non-tunnel/machine-parts/related',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '算量部位取消关联机楼部位',
    url: `${servicePath}/non-tunnel/machine-parts/cancel-related`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          relatedRefIds: { type: 'array' }
        },
        required: ['relatedRefIds']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/non-tunnel/machine-parts/cancel-related',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '算量部位单位工程查询',
    url: `${servicePath}/non-tunnel/concrete-parts/unit-work`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/non-tunnel/concrete-parts/unit-work'
        })
        return data
      }
    }
  },
  {
    description: '算量部位分部分项查询',
    url: `${servicePath}/non-tunnel/concrete-parts/entry-work`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          unitWorkIds: { type: 'array' }
        }
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.post({
          path: '/cmb/non-tunnel/concrete-parts/entry-work',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '申请部位查询单位工程',
    url: `${servicePath}/non-tunnel/application-parts/unit-work`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/non-tunnel/application-parts/unit-work'
        })
        return data
      }
    }
  },
  {
    description: '申请部位查询单位工程',
    url: `${servicePath}/non-tunnel/application-parts/entry-work`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          unitWorkIds: { type: 'array' }
        }
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.post({
          path: '/cmb/non-tunnel/application-parts/entry-work',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '申请部位查询标号',
    url: `${servicePath}/non-tunnel/application-parts/spec-model`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/non-tunnel/application-parts/spec-model'
        })
        return data
      }
    }
  },
  {
    description: '机楼部位查询标号',
    url: `${servicePath}/non-tunnel/machine-parts/spec-model`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/non-tunnel/machine-parts/spec-model'
        })
        return data
      }
    }
  },
  {
    description: '查询新增部位标号',
    url: `${servicePath}/non-tunnel/custom-parts/spec-model`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/non-tunnel/custom-parts/spec-model'
        })
        return data
      }
    }
  },
  {
    description: '算量部位查询',
    url: `${servicePath}/non-tunnel/concrete-parts`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          projectUnitWorkIds: { type: 'array' },
          entryWorkIds: { type: 'array' },
          partName: { type: 'string' },
          specModels: { type: 'array' },
          relatedStatus: { type: 'string' },
          offset: { type: 'integer' },
          limit: { type: 'integer' }
        },
        required: ['projectUnitWorkIds', 'entryWorkIds', 'specModels', 'relatedStatus', 'offset', 'limit']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const fnList = mbService.post({
          path: '/cmb/non-tunnel/concrete-parts',
          body: params.$body
        })
        const fnCount = mbService.post({
          path: '/cmb/non-tunnel/concrete-parts/count',
          body: params.$body
        })
        const data = await Promise.all([fnList, fnCount])
        return {
          data: data[0],
          count: data[1].totalCount
        }
      }
    }
  },
  {
    description: '查询隧道部位',
    url: `${servicePath}/tunnel/concrete-parts`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          projectUnitWorkIds: {
            type: 'array',
            items: { type: 'integer', description: '单位工程id' }
          },
          specModels: {
            type: 'array',
            items: { type: 'string', description: '标号' }
          },
          startPile: { type: 'string' },
          endPile: { type: 'string' }
        },
        required: []
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.post({
          path: '/cmb/tunnel/concrete-parts',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '隧道关联机楼部位',
    url: `${servicePath}/tunnel/machine-parts/related`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          projectUnitWorkId: { type: 'integer' },
          specModel: { type: 'string' },
          viewId: { type: 'integer' },
          produceRecordIds: { type: 'array' }
        }
      },
      required: ['viewId', 'specModel', 'produceRecordIds']
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/tunnel/machine-parts/related',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '隧道取消关联机楼部位',
    url: `${servicePath}/tunnel/machine-parts/cancel-related`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          recordRefIds: { type: 'array' }
        }
      },
      required: ['recordRefIds']
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.patch({
          path: '/cmb/tunnel/machine-parts/cancel-related',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '隧道查询拌合站机楼部位',
    url: `${servicePath}/tunnel/machine-parts`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          partName: { type: 'string' },
          specModels: { type: 'array' },
          relatedStatus: { type: 'integer' },
          viewId: { type: 'integer' },
          offset: { type: 'integer' },
          limit: { type: 'integer' }
        },
        required: ['offset', 'limit']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const fnList = mbService.post({
          path: '/cmb/tunnel/machine-parts',
          body: params.$body
        })
        const fnCount = mbService.post({
          path: '/cmb/tunnel/machine-parts/count',
          body: params.$body
        })
        const data = await Promise.all([fnList, fnCount])
        return {
          data: data[0],
          count: data[1]
        }
      }
    }
  },
  {
    description: '隧道部位查询单位工程',
    url: `${servicePath}/tunnel/concrete-parts/unit-work`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/tunnel/concrete-parts/unit-work'
        })
        return data
      }
    }
  },
  {
    description: '隧道部位查询标号',
    url: `${servicePath}/tunnel/concrete-parts/spec-model`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/tunnel/concrete-parts/spec-model'
        })
        return data
      }
    }
  },
  {
    description: '隧道查询机楼部位标号',
    url: `${servicePath}/tunnel/machine-parts/spec-model`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/tunnel/machine-parts/spec-model'
        })
        return data
      }
    }
  }
]
