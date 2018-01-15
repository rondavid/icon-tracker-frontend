import axios from 'axios'

let axiosApi = axios.create({
  baseURL: 'http://13.125.99.181:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export function getMainInfo() {
  return new Promise((resolve, reject) => {
    axiosApi.get('/v0/main/mainInfo')
      .then(result => {
        resolve(result.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getBlocksApi(payload) {
  const pageNum = payload || 0
  return new Promise((resolve, reject) => {
    axiosApi.get('/v0/block/recentBlock?page=' + pageNum)
      .then(result => {
        resolve(result.data.data)
      })
      .catch(error => {
        alert(error)
        reject(error)
      })
  })
}

export function getBlockApi(payload) {
  const height = payload.height;
  const pageNum = payload.pageNum || 0;

  return new Promise((resolve, reject) => {
    axiosApi.get('/v0/block/blockDetail?height='+height+'&page='+pageNum )
      .then(result => {
        resolve(result.data)
      })
      .catch(error => {
        alert(error)
        reject(error)
      })
  })
}
