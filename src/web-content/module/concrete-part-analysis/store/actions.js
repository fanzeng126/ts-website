export default {
  // 获取分部分项列表
  getProjectUnitWorks () {
    return this.$http.get('services/nontunnel-concrete-analysis/project-unit-works')
  },

  // 获取部位算量内容列表
  getConcreteAnalysis (context, params) {
    return this.$http.get({
      url: 'services/nontunnel-concrete-analysis',
      params,
      blocking: true
    })
  },

  // 查询部位节超分析-隧道类型
  async getTunnelConcreteAnalysis (context, params) {
    const result = await this.$http.post('services/tunnel-concrete-analysis', params)
    return result
  },

  // 查询部位节超分析-隧道类型-单位工程
  async getTunnelProjectUnitWorks (context, params) {
    const result = await this.$http.get({
      url: 'services/tunnel-concrete-analysis/project-unit-work',
      params,
      blocking: true
    })
    return result
  }
}
