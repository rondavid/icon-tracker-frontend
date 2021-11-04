import { makeUrl } from '../../../utils/utils'
import { trackerApiInstance, walletApiInstance } from './config'
import { randomUint32 } from '../../../utils/utils'
import { prefixes } from '../../../utils/const'

const { CONTRACTS_PREFIX, ADDRESSES_PREFIX, TRANSACTIONS_PREFIX } = prefixes

export async function contractList(payload) {
  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(makeUrl(`${ADDRESSES_PREFIX}/contracts`, payload))
      .then(result => {
      
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export async function contractInfo(payload) {
  console.log(payload, "the contract info payload")
  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(`${ADDRESSES_PREFIX}/details/${payload}`)
      .then(result => {
        console.log(result, "the contract info payload")
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export async function contractDetail(payload) {

  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(makeUrl(`${CONTRACTS_PREFIX}/detail`, payload))
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export async function contractTxList(payload) {
  console.log(payload, "contract tx payload")
  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(`${TRANSACTIONS_PREFIX}/address/${payload.addr}`)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export async function contractTokenTxList(payload) {
  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(`${TRANSACTIONS_PREFIX}/token-transfers/token-contract/${payload.addr}`)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export async function contractEventLogList(payload) {
  console.log(payload, "contract log payload")
  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(`/api/v1/logs?score_address=${payload.contractAddr}`)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export async function contractInternalTxList(payload) {
  const trackerApi = await trackerApiInstance()
  return new Promise((resolve, reject) => {
    trackerApi.get(`${TRANSACTIONS_PREFIX}/internal/address/${payload.addr}`)
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// export async function getScoreStatus(address) {
//   const walletApi = await walletApiInstance()
//   return new Promise(resolve => {
//     const param = {
//       jsonrpc: "2.0",
//       id: randomUint32(),
//       "method": "icx_call",
//       "params": {
//         "to": "cx0000000000000000000000000000000000000001",
//         "dataType": "call",
//         "data": {
//           "method": "getScoreStatus",
//           "params": {
//             address
//           }
//         }
//       }
//     }
//     walletApi.post(`/api/v3`, JSON.stringify(param))
//       .then(response => {
//         resolve(response.data.result);
//       })
//       .catch(error => {
//         if (!!error.response) {
//           resolve(error.response.data);
//         }
//         else {
//           resolve({
//             error: {
//               message: error.message
//             }
//           })
//         }
//       })
//   });
// }