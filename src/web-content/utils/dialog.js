import { Dialog, ModalMask } from 'vue-sparrow-ui'
import dlgProgress from './components/loading-data.vue'
import loading from './components/loading.vue'

let progressDialog
let loadingMask

export function showLoadingMask () {
  if (!loadingMask) {
    loadingMask = new ModalMask({
      modalComponent: loading,
      params: {
        width: 60,
        height: 60
      }
    })
  }
  loadingMask.show()
}

export function hideLoadingMask () {
  if (loadingMask) {
    loadingMask.hide()
  }
}

export function openProgressDialog (total = 0, message = '') {
  if (!progressDialog) {
    progressDialog = new Dialog({
      dialogComponent: dlgProgress,
      store: {},
      params: {
        total,
        current: 0,
        message
      },
      easyClose: false
    })
  }
  progressDialog.show()
  return progressDialog
}

export function setProgress (result) {
  if (progressDialog) {
    ['total', 'current', 'message'].forEach(key => {
      if (result[key]) {
        progressDialog['params'][key] = result[key]
      }
    })
  }
}

export function closeProgressDialog () {
  if (progressDialog) {
    progressDialog.hide()
  }
  return progressDialog
}
