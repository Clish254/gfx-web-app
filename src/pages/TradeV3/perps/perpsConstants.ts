import { Fractional } from '../perps/dexterity/types'
import * as anchor from '@project-serum/anchor'
import { MarketType } from '../../../context'

// export const DEX_ID = 'AEWt3M4zHBPXGieh6Y1PXAFnEZpz1pF1EUuUWyXtdkfd'

// export const INSTRUMENTS_ID = '2bEbbbQ9exihNsik8CUyeqN9BsFKWbdjPNhE7a9xDVqy'

// export const FEES_ID = 'C5PSiaCxUk3YpLxYEJ3VRBHBFeV2WbK3xEHPyXMdAozN'

// export const RISK_ID = 'GDQCED2bSKi7fsHFPANQt3vBAFREbAYw7otCxt5rw7sY'

// export const ORDERBOOK_P_ID = 'A83oDxWdJBDE5LdDXDDcZeuZZSQtV1X1YnbFRDHQjBeZ'

export const DEX_ID = 'BjpU1ACJY2bFj7aVTiMJLhM7H1ePxwkfDhjyY9dW9dbo'

export const INSTRUMENTS_ID = 'VXD2JfYWTiLuQLZA4jXN58cCxQe1XhaquNHAA1FEDWW'

export const FEES_ID = '2o2VABUDicRrLSzb5U4VvBrnVbtnDdCMowrMg9x7RGnD'

export const RISK_ID = 'GW31SEFBLtoEhBYFJi2KUdmdnBG4xapjE7ARBWB5MQT2'

export const ORDERBOOK_P_ID = 'A83oDxWdJBDE5LdDXDDcZeuZZSQtV1X1YnbFRDHQjBeZ'

export const VAULT_SEED = 'market_vault'

export const FEES_SEED = 'fee_model_config_acct'

export const DERIVATIVE_SEED = 'derivative'

export const TRADER_FEE_ACCT_SEED = 'trader_fee_acct'

export const VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT = new Uint8Array([39, 180, 199, 236, 99, 54, 132, 232])
export const VALIDATE_ACCOUNT_LIQUIDATION_DISCRIMINANT = new Uint8Array([48, 105, 196, 158, 218, 122, 149, 186])
export const CREATE_RISK_STATE_ACCOUNT_DISCRIMINANT = new Uint8Array([200, 248, 111, 36, 67, 124, 215, 7])
export const VALIDATE_ACCOUNT_HEALTH_DISCRIMINANT_LEN = 8
export const VALIDATE_ACCOUNT_LIQUIDATION_DISCRIMINANT_LEN = 1
export const FIND_FEES_DISCRIMINANT = 0
export const FIND_FEES_DISCRIMINANT_LEN = 1
export const MINT_DECIMALS = 6

export const VAULT_MINT = 'Bg2f3jstf2Co4Hkrxsn7evzvRwLbWYmuzaLUPGnjCwAA'

//export const MPG_ID = '7EUw8KH3KHoNNtMrKGswab3gWwM5tBqBbHKZ8eUiSQWP'
//export const MPG_ID = '33dgY7mZmMybc5CKEmnPk9G5T2Njr1oBJTeiG9aVfoRB'
//export const RISK_OUTPUT_REGISTER = '6bsx3FYadj5UaUegNdSFnJ27RrWvHAN9REGq9suNuvDJ'
// export const FEE_OUTPUT_REGISTER = 'GChviJ5JKFzEnnxG2cQvZVTdfGsEEgA4FgcWvVmZFajk'
// export const RISK_MODEL_CONFIG_ACCT = 'F9GZrXtg9Ssk4tDx3CBaWxyVXYin9zYgyJWDrY3FgNAj'
// export const MPG_ID = 'Ft1NJVw1oTdk1DhqSE4cwDqpteMcZQeKraq5vy43Ed9b'

// export const RISK_OUTPUT_REGISTER = 'CVLyxaB5c6cNScbVBHnB9Wg6ux4916N4PfjVhn7cnthz'
// export const FEE_OUTPUT_REGISTER = '8wca9RPSqBURHo2VU2gDaz5pmnYpj2dXPkS88mVdfoTy'
// export const RISK_MODEL_CONFIG_ACCT = '9uEGTZRoDwZa4N1asf1p1pnF4HEuUtG2BZBVY26feBDM'

export const MPG_ID = '82iVHHceAWNQig1MQnka149pVGkyc4GvQ6hE8fjVRASd'

export const RISK_OUTPUT_REGISTER = '7BDdpHxVx88y6N9Z4AypLYj8VQVVXyAWB1eKiKUTR2F1'
export const FEE_OUTPUT_REGISTER = 'HNPBKzjAWH1b4WUgoCo211HKqdKtLTitvQN5xUc7ZWxN'
export const RISK_MODEL_CONFIG_ACCT = 'H7CrwxNuUgpAZgD5ELThogUz1b6J6kQCXoSnQdaQ6qkL'

export const MPG_ACCOUNT_SIZE = 143864
export const OUT_REGISTER_SIZE = 432

export const PYTH_MAINNET = 'AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J'

export const PYTH_DEVNET = '38xoQ4oeJCBrcVvca2cGk7iV1dAfrmTR1kmhSCJQ8Jto'

export const PERPS_COLLATERAL = [
  {
    token: 'USDC',
    type: 'perps' as MarketType,
    marketAddress: 'Bg2f3jstf2Co4Hkrxsn7evzvRwLbWYmuzaLUPGnjCwAA',
    pythProduct: 'Crypto.USDT/USD'
  }
  // {
  //   token: 'ETH',
  //   type: 'perps' as MarketType,
  //   marketAddress: 'HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J'
  // },
  // {
  //   token: 'GOFX',
  //   type: 'perps' as MarketType,
  //   marketAddress: 'Bg2f3jstf2Co4Hkrxsn7evzvRwLbWYmuzaLUPGnjCwAA'
  // },
  // {
  //   token: 'USDC',
  //   type: 'perps' as MarketType,
  //   marketAddress: 'AHtgzX45WTKfkPG53L6WYhGEXwQkN1BVknET3sVsLL8J'
  // }
]

//export const MPs = [
//  {
//    id: 'FchYNgp9knsVWuv9WEYcidpHaNqwS2jQKEsc29EKokbh',
//    orderbook_id: 'AzHnotqZ23EqqMCXSt1ZTEQUZDDguBdYucaVNQhSrJE6',
//    bids: 'HFQtaDnaXbS9JQUuvuVkyvGK77qDZEuXXvxuvqJMStBY',
//    asks: 'Gh6xsRf99FkZh4TENEeWhHTmWRBp8JuVHYRh32W4MBUC',
//    event_queue: 'CM7gqpuCKoHtshguh7mXGLLXKXDb9tcFpyY6mHiyVuaH',
//    tick_size: 0.01,
//    decimals: 7
//  }
//]

// export const MPs = [
//   {
//     id: '9gVLq3Gg6M1NxhM25rKTS4njhfMx1NoGXX7ktvvHWs4k',
//     orderbook_id: 'EWi9j1bPPM7KjudL3RsigRAg8uMLd1pPBULM2MvUFNQC',
//     bids: '4pfS4oeuwWXvmecuE7YypC3N2DcYaoYgVdewRtPHYvZy',
//     asks: '9jE7rJTUyhgtbf8Vsyyq8kcnJc9NcHigqzoa23fMjzWN',
//     event_queue: 'Hj7LiqPd8Uqkyvz8VntBjNFEWSV3JmD44zQNwA5eTcfW',
//     tick_size: 100,
//     decimals: 7
//   }
// ]

// export const MPs = [
//   {
//     id: 'FAywzzHNxt7snJwM145uDFhv81SbeXTDSiebQUjx7SMg',
//     orderbook_id: '4soawRtgsNp1VVw2DXUEnFAv6E36mQDkvDHz6qX4NPVe',
//     bids: '91WyAc56BbjQTVrsm4YKA2NcryJ3AozFJsSKC2CAPcbD',
//     asks: '14Ty2G1wDyQsuARePQooQBC53nZ5GCvzoUTWMFkXYG4h',
//     event_queue: '36G7UgfijGecvZEXUiwhmUaivb2a2RRikj446SjP5Y97',
//     tick_size: 100,
//     decimals: 7
//   }
// ]

export const MPs = [
  {
    id: '8kbdxTuwRbNnGzjgkyNh6P2VjqC6KrkgVjh9pQuKJifz',
    orderbook_id: 'GJsUqB5wmBUMsfJXJCVyUP5NV9TanwkrLQfsUnqW5uUF',
    bids: 'F6fZs5XeJPGWJC3LUiAZnS8uvUfSfRAgTBV7cttDc9Fi',
    asks: 'JA9T2Fd5zpfz8Z6NAyrn2D68kP4PcucGMrzBahcZw1DT',
    event_queue: '6wQqi6Ud3NNazAin8y4RHffivyMncDG9RciEiei97CSv',
    tick_size: 100,
    decimals: 7
  }
]

export const PERPS_FEES = [
  {
    tier: 'Tier',
    stake: 'Stake',
    taker: 'Taker',
    maker: 'Maker'
  },
  {
    tier: '1',
    stake: '100 GOFX',
    taker: '0.05%',
    maker: '0%'
  },
  {
    tier: '2',
    stake: '1,000 GOFX',
    taker: '0.04%',
    maker: '0%'
  },
  {
    tier: '3',
    stake: '10,000 GOFX',
    taker: '0.03%',
    maker: '0%'
  },
  {
    tier: '4',
    stake: '100,000 GOFX',
    taker: '0.02%',
    maker: '0%'
  },
  {
    tier: '5',
    stake: '1,000,000 GOFX',
    taker: '0.01%',
    maker: '0%'
  }
]

export const MAX_FRACTIONAL_M_LENGTH = 17
export const ZERO_FRACTIONAL = new Fractional({ m: new anchor.BN(0), exp: new anchor.BN(0) })
export const ALPHA = new Fractional({ m: new anchor.BN(9), exp: new anchor.BN(1) })
export const BETA = new Fractional({ m: new anchor.BN(2), exp: new anchor.BN(1) })
export const GAMMA = new Fractional({ m: new anchor.BN(1), exp: new anchor.BN(1) })