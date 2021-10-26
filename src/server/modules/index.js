const basicApis = require('./basic-service')
const concretePartApis = require('./concrete-part')
const teamAnalysis = require('./team-analysis')
const concreteHistoryDataApis = require('./concrete-history-data')
const concretePartAnalysisApis = require('./concrete-part-analysis')
const mixerStationConfigApis = require('./mixer-station-config')
const theoreticalMixerRatioApis = require('./concrete-theoretical-mixer-ratio')
const concreteMaterialAnalyse = require('./concrete-material-analyse')

module.exports = {
  apis: [
    ...basicApis,
    ...concretePartApis,
    ...teamAnalysis,
    ...concreteHistoryDataApis,
    ...concretePartAnalysisApis,
    ...mixerStationConfigApis,
    ...theoreticalMixerRatioApis,
    ...concreteMaterialAnalyse
  ]
}
