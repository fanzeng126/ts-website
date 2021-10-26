const { mbService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'

module.exports = [
  {
    description: '获取项目下所有队伍',
    url: `${servicePath}/analysis-history/team`,
    method: 'get',
    res: {
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/analysis-history/team',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '获取补录数据',
    url: `${servicePath}/analysis-history`,
    method: 'get',
    res: {
      async handler (params, ctx, next) {
        const data = await mbService.get({
          path: '/cmb/analysis-history',
          body: params.$body
        })
        return data
      }
    }
  },
  {
    description: '保存历史数据补录(增删改)',
    url: `${servicePath}/analysis-history`,
    method: 'post',
    res: {
      async handler (params, ctx, next) {
        const data = await mbService.post({
          path: '/cmb/analysis-history',
          body: ctx.request.body
        })
        return data
      }
    }
  }
]
