import axios from 'axios'
import { ANALYTICS_API_ENDPOINTS, SOLSCAN_BASE, localhost } from './constants'

export const getGofxHolders = async () => {
  try {
    const res = await axios(`${SOLSCAN_BASE}${ANALYTICS_API_ENDPOINTS.META_DATA}${ANALYTICS_API_ENDPOINTS.GOFX_TOKEN}`)
    return res.data
  } catch (err) {
    return err
  }
}

export const getTotalLiquidityVolume = async () => {
  try {
    const { data } = await axios(`${localhost}${ANALYTICS_API_ENDPOINTS.GET_LIQUIDITY}`)
    return data
  } catch (err) {
    return err
  }
}