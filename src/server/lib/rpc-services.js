const client = require('@mctech/infra-cloud').getRpcClient()

module.exports = {
  mbService: client.bind({ serviceId: 'common-mb-service' }),
  taskService: client.bind({ serviceId: 'itask-service-v2' })
}
