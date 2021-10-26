const { mountAll } = require('@mctech/koa-mount-api')
const { apis } = require('./modules')
const { parse, resolve } = require('path')

function mountResources (config, service) {
  service.useStatic(
    '/',
    parse(__dirname).base === 'server'
      ? resolve(__dirname, '../../dist/web-content')
      : resolve(__dirname, 'web-content')
  )
  service.use(
    mountAll([
      ...apis
    ])
  )
}

module.exports = mountResources
