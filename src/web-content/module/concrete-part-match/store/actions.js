export default {

  async queryApplicationPartsUnitWorksOption ({ commit }) {
    const result = await this.$http.get('services/non-tunnel/application-parts/unit-work')
    return result
  },

  async queryUnitWorksOption ({ commit, dispatch }) {
    const result = await this.$http.get('services/non-tunnel/concrete-parts/unit-work')

    commit('setUnitWorks', result)
    return result
  },

  // 非混凝土算量部位根据单位工程查询分部分项
  async queryEntryWorksOption ({ commit }, params) {
    const result = await this.$http.post('services/non-tunnel/concrete-parts/entry-work', params)

    commit('setEntryWorks', result)
    return result
  },

  // 非混凝土申请部位根据单位工程查询分部分项
  async queryApplyEntryWorksOption ({ commit }, params) {
    const result = await this.$http.post('services/non-tunnel/application-parts/entry-work', params)

    commit('setApplyEntryWorks', result)
    return result
  },

  async querySqPartList ({ commit }, params) {
    const result = await this.$http.post('services/non-tunnel/concrete-parts', params)
    const specModel = await this.$http.get('services/non-tunnel/custom-parts/spec-model')
    result.data.forEach(element => {
      element.isRelated = element.applicationCount > 0 || element.produceCount > 0
    })
    commit('setSqPartList', result)
    commit('setSqPartSpecModel', specModel)
    return result
  },

  async querySqPartTotal ({ commit }, params) {
    const result = await this.$http.post('services/non-tunnel/concrete-parts/count', params)
    return result
  },

  async queryApplyPartList ({ commit }, params) {
    const result = await this.$http.post('services/non-tunnel/application-parts', params)
    const specModel = await this.$http.get('services/non-tunnel/application-parts/spec-model')
    commit('setApplyPartList', result)
    commit('setApplyPartSpecModel', specModel)
    return result
  },

  async queryApplyPartTotal ({ commit }, params) {
    const result = await this.$http.post('services/non-tunnel/application-parts/count', params)
    return result
  },

  async queryApplyUnitWorksOption ({ commit, dispatch }) {
    const result = await this.$http.get('services/non-tunnel/application-parts/unit-work')

    commit('setApplyUnitWorks', result)
    return result
  },

  async applyPartRelated ({ commit }, params) {
    const result = await this.$http.patch({
      url: 'services/non-tunnel/application-parts/related',
      data: params
    })
    return result
  },

  async applyPartCancelRelated ({ commit }, params) {
    const result = await this.$http.patch({
      url: 'services/non-tunnel/application-parts/cancel-related',
      data: params
    })
    return result
  },

  async applyPartAdd ({ commit }, params) {
    const result = await this.$http.patch({
      url: 'services/non-tunnel/application-parts/add',
      data: params
    })
    return result
  },

  async applyPartCancelAdd ({ commit }, params) {
    const result = await this.$http.patch({
      url: 'services/non-tunnel/application-parts/cancel-add',
      data: params
    })
    return result
  },

  async getTunnelParts ({ commit }, params) {
    const result = await this.$http.post({
      url: 'services/tunnel/concrete-parts',
      data: params
    })
    result.forEach(item => {
      if (item.isLeaf) {
        item.rockGradeName = item.remark
      } else {
        item.rockGradeName = item.rockGrade
      }
    })
    return result
  }

}
