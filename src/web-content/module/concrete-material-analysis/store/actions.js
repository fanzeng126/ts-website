import dayjs from 'dayjs'

export default {
  async getConcreteTheoreticalMixerRatio ({ commit }) {
    const result = await this.$http.get('services/concrete-theoretical-mixer-ratio')
    return result
  },
  async addConcreteStatPeriod ({ commit }, params) {
    const result = await this.$http.post('services/concrete-stat-period', params)
    return result
  },
  async getStatMixerRatio ({ commit }, params) {
    const result = await this.$http.get('services/concrete-stat-mixer-ratio', { params })
    return result
  },
  async getConcreteStatPeriod ({ commit }) {
    const result = await this.$http.get('services/concrete-stat-period')
    if (result.length) result[0].isLast = true
    const map = new Map()
    result.forEach(element => {
      const value = {
        ...element,
        startDate: dayjs(element.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(element.endDate).format('YYYY-MM-DD'),
        value: `${element.month}月(${dayjs(element.startDate).format('MM-DD')}~${dayjs(element.endDate).format('MM-DD')})`
      }
      if (map.has(element.year)) {
        map.get(element.year).push(value)
      } else {
        map.set(element.year, [value])
      }
    })
    return Array.from(map.entries())
  },
  async deleteConcreteStatPeriod ({ commit }, params) {
    const result = await this.$http.delete('services/concrete-stat-period/_remove', { params })
    return result
  },
  async updateConcreteStatPeriod ({ commit }, data) {
    const result = await this.$http.patch('services/concrete-stat-period', data)
    return result
  },
  async getMaterialAnalyseDesignQuantity ({ commit }, params) {
    const result = await this.$http.get('services/concrete-material-analyse/design-quantity', { params })
    result.sort((a, b) => a.specModel.localeCompare(b.specModel))
    return result
  },
  async getConcreteMaterialAnalyse ({ commit }, params) {
    const result = await this.$http.get('services/concrete-material-analyse', { params })
    for (let i = 0; i < result.length; i++) {
      if (i < 3) {
        result[i].unit = 't'
      } else {
        result[i].unit = params.unit
      }
    }
    return result
  },
  async addConcreteMaterialAnalyse ({ commit }, data) {
    const result = await this.$http.post('services/concrete-material-analyse', data)
    return result
  },
  async updateConcreteMaterialAnalyse ({ commit }, data) {
    const result = await this.$http.patch('services/concrete-material-analyse', data)
    return result
  },
  async syncDesignQuantity ({ commit }, data) {
    const result = await this.$http.patch('services/concrete-material-analyse/sync-design-quantity', data)
    return result
  },
  async getMaterialAnalyseAndSyncDesignQuantity ({ commit }, params) {
    const fn1 = this.$http.get('services/concrete-material-analyse', { params })
    const fn2 = this.$http.get('services/concrete-material-analyse/design-quantity', { params })
    const [analyseData, designData] = await Promise.all([fn1, fn2])
    for (let i = 0; i < analyseData.length; i++) {
      if (i < 3) {
        analyseData[i].unit = 't'
      } else {
        analyseData[i].unit = params.unit
      }
    }
    const analyseDataMap = new Map()
    analyseData.forEach(item => {
      analyseDataMap.set(item.materialName, {
        id: item.id,
        periodDesignQuantity: item.periodDesignQuantity,
        yearDesignQuantity: item.yearDesignQuantity,
        totalDesignQuantity: item.totalDesignQuantity
      })
    })
    const disabledSyncArr = this._vm._judgeMaterialData(analyseDataMap, designData)
    return { analyseData, analyseDataMap, disabledSyncArr }
  },
  async getOrgParams ({ commit }) {
    const item = await this.$http.get('services/org-params')
    let month = 26
    if (item) {
      const { monthEnd = 26 } = item['sm-stat-cycle'] || {}
      month = monthEnd || 26
    }
    if (new Date(dayjs().date(month).format('YYYY-MM-DD')).getTime() < new Date(dayjs().format('YYYY-MM-DD')).getTime()) {
      return {
        startDate: dayjs().date(month).add(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'month').date(month).format('YYYY-MM-DD')
      }
    } else {
      return {
        startDate: dayjs().subtract(1, 'month').date(month).add(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().date(month).format('YYYY-MM-DD')
      }
    }
  }
}
