export default {
  // 获取项目下所有队伍
  getLaborTeam () {
    return this.$http.get('services/analysis-history/team')
  },

  // 保存历史数据补录(增删改)
  updateAnalysisHistory (context, body) {
    return this.$http.post('services/analysis-history', body)
  },

  // 获取补录数据
  getAnalysisHistory () {
    return this.$http.get('services/analysis-history')
  }
}
