const infraCloud = require('@mctech/infra-cloud')
const casClient = require('@mctech/cas-client')
const mountResources = require('./mount-resources')
const server = infraCloud.appServer({
  servicePath: '/cmb/',
  compress: true
})

// 用户登录验证
casClient.load(server, {
  ignorePathes: ['/cmb/lib/**', '/cmb/assets/**', '/cmb/jwt/**']
})

const startPromise = server
  .use(mountResources)
  .start()

module.exports = startPromise
