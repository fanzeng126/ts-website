
const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '导出令牌',
    url: `${servicePath}/mixer-station-config/download-license`,
    method: 'get',
    req: {
      orgId: {
        type: 'integer',
        from: 'query',
        required: true
      },
      orgName: {
        type: 'string',
        from: 'query',
        required: true
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/mixer-station-config/download-license',
          query: ctx.query
        })
        ctx.res.setHeader(
          'content-Disposition',
          `attachment;filename=${encodeURI('mctech-mixer.lic')}`
        )
        return data
      }
    }
  },
  {
    description: '查询搅拌站机组配置',
    url: `${servicePath}/mixer-station-config`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/mixer-station-config'
        })
        return data
      }
    }
  },
  {
    description: '修改搅拌站机组配置',
    url: `${servicePath}/mixer-station-config`,
    method: 'patch',
    req: {
      $body: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: '配置id' },
          mixerNo: { type: 'integer', description: '搅拌机组编号' },
          mixerSystem: { type: 'string', description: '系统名称' },
          config: { type: 'string', description: '配置' },
          isIssue: { type: 'boolean', description: '是否主动下发' }
        },
        required: ['id', 'mixerNo', 'mixerSystem', 'isIssue', 'config']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const body = params.$body
        const data = await mbService.patch({
          path: '/cmb/mixer-station-config',
          body
        })
        return data
      }
    }
  },
  {
    description: '保存搅拌站机组配置',
    url: `${servicePath}/mixer-station-config`,
    method: 'post',
    req: {
      $body: {
        type: 'object',
        properties: {
          mixerNo: { type: 'integer', description: '搅拌机组编号' },
          mixerSystem: { type: 'string', description: '系统名称' },
          config: { type: 'string', description: '配置' },
          isIssue: { type: 'boolean', description: '是否主动下发' }
        },
        required: ['mixerNo', 'mixerSystem', 'isIssue', 'config']
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const body = params.$body
        const data = await mbService.post({
          path: '/cmb/mixer-station-config',
          body
        })
        return data
      }
    }
  },
  {
    description: '删除搅拌站机组配置',
    url: `${servicePath}/mixer-station-config/:id`,
    method: 'delete',
    req: {
      id: {
        type: 'integer',
        from: 'path',
        required: true
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.delete({
          path: `/cmb/mixer-station-config/${ctx.params.id}`
        })
        return data
      }
    }
  },
  {
    description: '查询redis搅拌站机组配置',
    url: `${servicePath}/default-mixer-station-config`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/default-mixer-station-config'
        })
        return data
      }
    }
  }
]
