
const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '查询申请单队伍',
    url: `${servicePath}/team-concrete-analysis/team`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/team-concrete-analysis/team',
          query: ctx.query
        })
        return data
      }
    }
  },
  {
    description: '查询队伍实时节超分析',
    url: `${servicePath}/team-concrete-analysis`,
    method: 'post',
    req: {
      $body: {
        properties: {
          dataType: { type: 'string' },
          dateTime: { type: 'string' },
          teamName: { type: 'array' }
        }
      }
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await mbService.post({
          path: '/cmb/team-concrete-analysis',
          body: params.$body
        })
        return data
      }
    }
  }
]
