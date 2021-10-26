
import Vue from 'vue'
import VueRouter from 'vue-router'

import '../../include'
import index from './view/index.vue'
import main from './view/main.vue'
import store from './store'

const router = new VueRouter({
  routes: [
    { name: '/', path: '/', component: main }
  ]
})

Vue.prototype._calcRatio = function (item, property) {
  const designQuantity = item[`${property}DesignQuantity`] || 0
  const checkActualQuantity = item[`${property}CheckActualQuantity`]
  const produceActualQuantity = item[`${property}ProduceActualQuantity`]

  const checkSubQuantity = checkActualQuantity === null ? null : designQuantity - checkActualQuantity
  const checkSubRatio = checkSubQuantity === null ? null : checkSubQuantity / designQuantity * 100
  item[`${property}CheckSubQuantity`] = checkSubQuantity
  item[`${property}CheckSubRatio`] = [-Infinity, Infinity, NaN].includes(checkSubRatio) ? 0 : checkSubRatio

  const produceSubQuantity = produceActualQuantity === null ? null : designQuantity - produceActualQuantity
  const produceSubRatio = produceSubQuantity === null ? null : produceSubQuantity / designQuantity * 100
  item[`${property}ProduceSubQuantity`] = produceSubQuantity
  item[`${property}ProduceSubRatio`] = [-Infinity, Infinity, NaN].includes(produceSubRatio) ? 0 : produceSubRatio
}

Vue.prototype._judgeMaterialData =
  function _judgeMaterialAnalysisData (analyseDataMap, designData) {
    function withinErrorMargin (left, right) {
      return Math.abs(left - right) > Number.EPSILON * Math.pow(2, 2)
    }
    const arr = []
    if (designData.length) {
      const {
        cement = 0,
        flyAsh = 0,
        coarseAggregateLevel1 = 0,
        coarseAggregateLevel2 = 0,
        coarseAggregateLevel3 = 0,
        fineAggregate = 0,
        waterReducer = 0
      } = designData[0]
      const coarseAggregate = coarseAggregateLevel1 + coarseAggregateLevel2 + coarseAggregateLevel3

      const cementValue = analyseDataMap.get('水泥')
      if (withinErrorMargin(cement, cementValue?.periodDesignQuantity)) {
        const changeQuantity = cement - cementValue?.periodDesignQuantity
        arr.push({
          materialName: '水泥',
          changeQuantity,
          id: cementValue.id,
          periodDesignQuantity: cement,
          yearDesignQuantity: cementValue.yearDesignQuantity + changeQuantity,
          totalDesignQuantity: cementValue.totalDesignQuantity + changeQuantity
        })
      }

      const flyAshValue = analyseDataMap.get('粉煤灰')
      if (withinErrorMargin(flyAsh, flyAshValue?.periodDesignQuantity)) {
        const changeQuantity = flyAsh - flyAshValue?.periodDesignQuantity
        arr.push({
          materialName: '粉煤灰',
          changeQuantity,
          id: flyAshValue.id,
          periodDesignQuantity: flyAsh,
          yearDesignQuantity: flyAshValue.yearDesignQuantity + changeQuantity,
          totalDesignQuantity: flyAshValue.totalDesignQuantity + changeQuantity
        })
      }
      const waterReducerValue = analyseDataMap.get('减水剂')
      if (withinErrorMargin(waterReducer, waterReducerValue?.periodDesignQuantity)) {
        const changeQuantity = waterReducer - waterReducerValue?.periodDesignQuantity
        arr.push({
          materialName: '减水剂',
          changeQuantity,
          id: waterReducerValue.id,
          periodDesignQuantity: waterReducer,
          yearDesignQuantity: waterReducerValue.yearDesignQuantity + changeQuantity,
          totalDesignQuantity: waterReducerValue.totalDesignQuantity + changeQuantity
        })
      }
      const coarseAggregateValue = analyseDataMap.get('砂子')
      if (withinErrorMargin(coarseAggregate, coarseAggregateValue?.periodDesignQuantity)) {
        const changeQuantity = coarseAggregate - coarseAggregateValue?.periodDesignQuantity
        arr.push({
          materialName: '砂子',
          changeQuantity,
          id: coarseAggregateValue.id,
          periodDesignQuantity: coarseAggregate,
          yearDesignQuantity: coarseAggregateValue.yearDesignQuantity + changeQuantity,
          totalDesignQuantity: coarseAggregateValue.totalDesignQuantity + changeQuantity
        })
      }
      const fineAggregateValue = analyseDataMap.get('碎石')
      if (withinErrorMargin(fineAggregate, fineAggregateValue?.periodDesignQuantity)) {
        const changeQuantity = fineAggregate - fineAggregateValue?.periodDesignQuantity
        arr.push({
          materialName: '碎石',
          changeQuantity,
          id: fineAggregateValue.id,
          periodDesignQuantity: fineAggregate,
          yearDesignQuantity: fineAggregateValue.yearDesignQuantity + changeQuantity,
          totalDesignQuantity: fineAggregateValue.totalDesignQuantity + changeQuantity
        })
      }
    }
    return arr
  }

const app = new Vue({
  store,
  router,
  render: h => h(index)
})
app.$mount('#app')
