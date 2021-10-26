export default {
  async getTeams ({ commit }) {
    const result = await this.$http.get('services/team-concrete-analysis/team')
    return result
  },

  async getTeamConcreteAnalysis ({ commit }, params) {
    const result = await this.$http.post('services/team-concrete-analysis', params)
    return result
  }
}
