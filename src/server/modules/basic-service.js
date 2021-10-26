
const { taskService } = require('../lib/rpc-services')
const servicePath = '/cmb/services'
const schema = {}

module.exports = [
  {
    description: '查询分包参数设置月份',
    url: `${servicePath}/org-params`,
    method: 'get',
    req: {
    },
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await taskService.get({
          path: `/org/${ctx.extras.orgId}/org-params`,
          query: ctx.query
        })
        return data
      }
    }
  },
  {
    description: '保存分包参数设置',
    url: `${servicePath}/org-params`,
    method: 'put',
    res: {
      schema,
      async handler (params, ctx, next) {
        const data = await taskService.put({
          path: `/org/${ctx.extras.orgId}/org-params`,
          body: ctx.request.body
        })
        return data
      }
    }
  }
]
