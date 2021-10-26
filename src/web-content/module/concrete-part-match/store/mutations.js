export default {
  setUnitWorks (state, data) {
    state.unitWorksOptions = data
  },
  setEntryWorks (state, data) {
    state.entryWorksOptions = data
  },
  setApplyEntryWorks (state, data) {
    state.applyEntryWorksOptions = data
  },
  setLabels (state, data) {
    state.labelsOptions = data
  },
  setSqPartList (state, data) {
    state.sqPartList = data.data
    state.sqPartCount = data.count
  },
  setSqPartSpecModel (state, data) {
    const specModel = [
      'C10', 'C15', 'C20', 'C25', 'C30', 'C35', 'C40',
      'C45', 'C50', 'C55', 'C60', 'C65', 'C70', 'C75',
      'C80', 'C85', 'C90', 'C20喷射', 'C25喷射', 'C30喷射',
      'C30水下', 'C30抗渗', 'C35水下', 'C35抗渗', 'C40水下',
      'C45水下', 'C40细石', '砂浆'
    ]
    let newSpecModel = specModel.concat(data.map(item => item.specModel))
    newSpecModel = [...new Set(newSpecModel)]
    const arr = []
    newSpecModel.forEach(item => {
      arr.push({
        label: item,
        value: item
      })
    })
    state.sqPartSpecModel = arr
  },
  setApplyPartList (state, data) {
    state.applyPartList = data.data
    state.applyPartCount = data.count
  },

  setApplyUnitWorks (state, data) {
    state.applyUnitWorksOptions = data
  },
  setApplyPartSpecModel (state, data) {
    const arr = []
    data.forEach(item => {
      if (item.specModel) {
        arr.push({
          label: item.specModel,
          value: item.specModel
        })
      }
    })
    state.applyPartSpecModel = arr
  },
  setStatMonth (state, date) {
    state.statMonth = date
  },
  setActiveTabName (state, data) {
    state.activeTabName = data
  }
}
