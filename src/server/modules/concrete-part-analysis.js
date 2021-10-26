const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '获取分部分项列表',
    url: `${servicePath}/nontunnel-concrete-analysis/project-unit-works`,
    method: 'get',
    res: {
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/nontunnel-concrete-analysis/project-unit-works'
        })
        return data
      }
    }
  },
  {
    description: '获取部位（算量）内容列表',
    url: `${servicePath}/nontunnel-concrete-analysis`,
    method: 'get',
    res: {
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/nontunnel-concrete-analysis',
          query: ctx.query
        })
        return data
      }
    }
  },

  {
    description: '查询部位节超分析-隧道类型-单位工程',
    url: `${servicePath}/tunnel-concrete-analysis/project-unit-work`,
    method: 'get',
    res: {
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/tunnel-concrete-analysis/project-unit-work',
          query: ctx.query
        })
        return data
      }
    }
  },
  {
    description: '查询部位节超分析-隧道类型',
    url: `${servicePath}/tunnel-concrete-analysis`,
    method: 'post',
    req: {
      $body: {
        properties: {
          categroyType: {
            type: 'string',
            from: 'query',
            default: 'all',
            enum: ['rockGrade', 'pile'],
            description: '汇总方式'
          },
          projectUnitWorkId: { type: 'integer', from: 'body' }
        }
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.post({
          path: '/cmb/tunnel-concrete-analysis',
          body: params.$body
        })
        return data
      }
    }
  }
]
