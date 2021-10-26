export default {
  async getMixerNoAndMaterialName ({ commit }) {
    const result = await this.$http.get('services/concrete-produce-dosage')
    return result
  },
  async setMaterialMixingStationRelation ({ commit }, params) {
    const result = await this.$http.post('services/material-mixing-station-relation', params)
    return result
  },
  async getConcreteTheoreticalMixerRatio ({ commit }) {
    const result = await this.$http.get('services/concrete-theoretical-mixer-ratio')
    return result
  },
  async addConcreteTheoreticalMixerRatio ({ commit }, params) {
    const result = await this.$http.post('services/concrete-theoretical-mixer-ratio', {
      specModels: params
    })
    return result
  },
  async deleteConcreteTheoreticalMixerRatio ({ commit }, ids) {
    const result = await this.$http.post('services/concrete-theoretical-mixer-ratio/_remove', {
      ids
    })
    return result
  },
  async updateConcreteTheoreticalMixerRatio ({ commit }, data) {
    const result = await this.$http.patch('services/concrete-theoretical-mixer-ratio', {
      data
    })
    return result
  }
}
