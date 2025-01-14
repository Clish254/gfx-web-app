/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import {
  INewOrderAccounts,
  IDepositFundsAccounts,
  IDepositFundsParams,
  IWithdrawFundsAccounts,
  IWithdrawFundsParams,
  IConsumeOB,
  ICancelOrderAccounts
} from '../../../types/dexterity_instructions'
import {
  buildTransaction,
  sendPerpsTransaction,
  sendPerpsTransactions
} from '../../NFTs/launchpad/candyMachine/connection'
import { getDexProgram, getFeeModelConfigAcct, getMarketSigner, getRiskSigner, getTraderFeeAcct } from './utils'
import * as anchor from '@project-serum/anchor'
import {
  DEX_ID,
  FEES_ID,
  MPG_ID as MAINNET_MPG_ID,
  RISK_ID,
  VAULT_MINT as MAINNET_VAULT_MINT
} from './perpsConstants'
import { VAULT_MINT as DEVNET_VAULT_MINT, MPG_ID as DEVNET_MPG_ID } from './perpsConstantsDevnet'
import { findAssociatedTokenAddress } from '../../../web3'
import { createAssociatedTokenAccountInstruction } from '@solana/spl-token-v2'
import { struct, u8 } from '@solana/buffer-layout'
import { notify } from '../../../utils'
import { createRandom, getProgramId, getRemainingAccountsForTransfer } from '../../../hooks/useReferrals'
import { TraderRiskGroup } from './dexterity/accounts'

export const newOrderIx = async (
  newOrderAccounts: INewOrderAccounts,
  newOrderParams,
  wallet,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)

  //instructions.push(await consumeOBIx(wallet, connection, consumeAccounts))
  instructions.push(
    await dexProgram.instruction.newOrder(newOrderParams, {
      accounts: {
        user: wallet.publicKey,
        traderRiskGroup: newOrderAccounts.traderRiskGroup,
        marketProductGroup: newOrderAccounts.marketProductGroup,
        product: newOrderAccounts.product,
        aaobProgram: newOrderAccounts.aaobProgram,
        orderbook: newOrderAccounts.orderbook,
        marketSigner: newOrderAccounts.marketSigner,
        eventQueue: newOrderAccounts.eventQueue,
        bids: newOrderAccounts.bids,
        asks: newOrderAccounts.asks,
        systemProgram: newOrderAccounts.systemProgram,
        feeModelProgram: newOrderAccounts.feeModelProgram,
        feeModelConfigurationAcct: newOrderAccounts.feeModelConfigurationAcct,
        traderFeeStateAcct: newOrderAccounts.traderFeeStateAcct,
        feeOutputRegister: newOrderAccounts.feeOutputRegister,
        riskEngineProgram: newOrderAccounts.riskEngineProgram,
        riskModelConfigurationAcct: newOrderAccounts.riskModelConfigurationAcct,
        riskOutputRegister: newOrderAccounts.riskOutputRegister,
        traderRiskStateAcct: newOrderAccounts.traderRiskStateAcct,
        riskAndFeeSigner: newOrderAccounts.riskAndFeeSigner
      }
    })
  )
  try {
    //perpsNotify({
    //  action: 'open',
    //  message: 'placing order hehehe',
    //  key: 12,
    //  styles: {}
    //})
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'New Order',
        description: 'Sign the transaction to place a new order!'
      },
      progressMessage: {
        header: 'New Order',
        description: 'Submitting new order on the network..'
      },
      endMessage: {
        header: 'New Order',
        description: 'New order successfully placed'
      },
      errorMessage: {
        header: 'New Order',
        description: 'There was an error in placing the order'
      }
    })
    if (response && response.txid) {
      //  perpsNotify({
      //    action: 'close',
      //    message: 'Order placed Successfully!',
      //    key: 12,
      //    styles: {}
      //  })
    }
    return response
  } catch (e) {
    console.log(e)
    //notify({
    //  message: 'Order failed!',
    //  type: 'error'
    //})
  }
  return null
}

export const newTakeProfitOrderIx = async (
  newOrderAccounts: INewOrderAccounts,
  newOrderParams,
  newTakeProfitOrderParams,
  wallet,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)

  //instructions.push(await consumeOBIx(wallet, connection, consumeAccounts))
  instructions.push(
    await dexProgram.instruction.newOrder(newOrderParams, {
      accounts: {
        user: wallet.publicKey,
        traderRiskGroup: newOrderAccounts.traderRiskGroup,
        marketProductGroup: newOrderAccounts.marketProductGroup,
        product: newOrderAccounts.product,
        aaobProgram: newOrderAccounts.aaobProgram,
        orderbook: newOrderAccounts.orderbook,
        marketSigner: newOrderAccounts.marketSigner,
        eventQueue: newOrderAccounts.eventQueue,
        bids: newOrderAccounts.bids,
        asks: newOrderAccounts.asks,
        systemProgram: newOrderAccounts.systemProgram,
        feeModelProgram: newOrderAccounts.feeModelProgram,
        feeModelConfigurationAcct: newOrderAccounts.feeModelConfigurationAcct,
        traderFeeStateAcct: newOrderAccounts.traderFeeStateAcct,
        feeOutputRegister: newOrderAccounts.feeOutputRegister,
        riskEngineProgram: newOrderAccounts.riskEngineProgram,
        riskModelConfigurationAcct: newOrderAccounts.riskModelConfigurationAcct,
        riskOutputRegister: newOrderAccounts.riskOutputRegister,
        traderRiskStateAcct: newOrderAccounts.traderRiskStateAcct,
        riskAndFeeSigner: newOrderAccounts.riskAndFeeSigner
      }
    })
  )
  instructions.push(
    await dexProgram.instruction.newOrder(newTakeProfitOrderParams, {
      accounts: {
        user: wallet.publicKey,
        traderRiskGroup: newOrderAccounts.traderRiskGroup,
        marketProductGroup: newOrderAccounts.marketProductGroup,
        product: newOrderAccounts.product,
        aaobProgram: newOrderAccounts.aaobProgram,
        orderbook: newOrderAccounts.orderbook,
        marketSigner: newOrderAccounts.marketSigner,
        eventQueue: newOrderAccounts.eventQueue,
        bids: newOrderAccounts.bids,
        asks: newOrderAccounts.asks,
        systemProgram: newOrderAccounts.systemProgram,
        feeModelProgram: newOrderAccounts.feeModelProgram,
        feeModelConfigurationAcct: newOrderAccounts.feeModelConfigurationAcct,
        traderFeeStateAcct: newOrderAccounts.traderFeeStateAcct,
        feeOutputRegister: newOrderAccounts.feeOutputRegister,
        riskEngineProgram: newOrderAccounts.riskEngineProgram,
        riskModelConfigurationAcct: newOrderAccounts.riskModelConfigurationAcct,
        riskOutputRegister: newOrderAccounts.riskOutputRegister,
        traderRiskStateAcct: newOrderAccounts.traderRiskStateAcct,
        riskAndFeeSigner: newOrderAccounts.riskAndFeeSigner
      }
    })
  )
  try {
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'New Order',
        description: 'Sign the transaction to place a new order!'
      },
      progressMessage: {
        header: 'New Order',
        description: 'Submitting new order on the network..'
      },
      endMessage: {
        header: 'New Order',
        description: 'New order successfully placed'
      },
      errorMessage: {
        header: 'New Order',
        description: 'There was an error in placeing the order'
      }
    })
    return response
  } catch (e) {
    console.log(e)
  }
  return null
}

export const cancelOrderIx = async (
  cancelOrderAccounts: ICancelOrderAccounts,
  cancelOrderParams,
  wallet,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.cancelOrder(cancelOrderParams, {
      accounts: {
        user: wallet.publicKey,
        traderRiskGroup: cancelOrderAccounts.traderRiskGroup,
        marketProductGroup: cancelOrderAccounts.marketProductGroup,
        product: cancelOrderAccounts.product,
        aaobProgram: cancelOrderAccounts.aaobProgram,
        orderbook: cancelOrderAccounts.orderbook,
        marketSigner: cancelOrderAccounts.marketSigner,
        eventQueue: cancelOrderAccounts.eventQueue,
        bids: cancelOrderAccounts.bids,
        asks: cancelOrderAccounts.asks,
        systemProgram: cancelOrderAccounts.systemProgram,
        riskEngineProgram: cancelOrderAccounts.riskEngineProgram,
        riskModelConfigurationAcct: cancelOrderAccounts.riskModelConfigurationAcct,
        riskOutputRegister: cancelOrderAccounts.riskOutputRegister,
        traderRiskStateAcct: cancelOrderAccounts.traderRiskStateAcct,
        riskSigner: cancelOrderAccounts.riskAndFeeSigner
      }
    })
  )
  try {
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Cancel Order',
        description: 'Sign the transaction to cancel the order!'
      },
      progressMessage: {
        header: 'Cancel Order',
        description: 'Cancelling order on the network..'
      },
      endMessage: {
        header: 'Cancel Order',
        description: 'Order cancelled'
      },
      errorMessage: {
        header: 'Cancel Order',
        description: 'There was an error in cancelling the order'
      }
    })
    return response
  } catch (e) {
    console.log(e)
    notify({
      message: 'Order cancel failed!',
      type: 'error'
    })
    return null
  }
}

export const depositFundsIx = async (
  depositFundsAccounts: IDepositFundsAccounts,
  depositFundsParams: IDepositFundsParams,
  wallet: any,
  connection: Connection
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.depositFunds(depositFundsParams, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        user: wallet.publicKey,
        userTokenAccount: depositFundsAccounts.userTokenAccount,
        traderRiskGroup: depositFundsAccounts.traderRiskGroup,
        marketProductGroup: depositFundsAccounts.marketProductGroup,
        marketProductGroupVault: depositFundsAccounts.marketProductGroupVault
      }
    })
  )
  try {
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Deposit funds',
        description: 'Sign the transaction to deposit funds!'
      },
      progressMessage: {
        header: 'Deposit funds',
        description: 'Depositing funds to your account..'
      },
      endMessage: {
        header: 'Deposit funds',
        description: 'Funds successfully deposited'
      },
      errorMessage: {
        header: 'Deposit funds',
        description: 'There was an error in depositing the funds'
      }
    })
    return response
  } catch (e) {
    //notify({
    //  message: 'Deposit of ' + displayFractional(depositFundsParams.quantity) + ' failed',
    //  type: 'error'
    //})
    return e
  }
}

export const initTrgDepositIx = async (
  depositFundsAccounts: IDepositFundsAccounts,
  depositFundsParams: IDepositFundsParams,
  wallet: any,
  connection: Connection,
  trg?: Keypair,
  isDevnet?: boolean
) => {
  const [instructions, buddyInstructions, signers] = await initTrgIx(connection, wallet, trg, isDevnet)
  const buddyTransaction = isDevnet ? null : await buildTransaction(connection, wallet, buddyInstructions, [])
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.depositFunds(depositFundsParams, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        user: wallet.publicKey,
        userTokenAccount: depositFundsAccounts.userTokenAccount,
        traderRiskGroup: depositFundsAccounts.traderRiskGroup,
        marketProductGroup: depositFundsAccounts.marketProductGroup,
        marketProductGroupVault: depositFundsAccounts.marketProductGroupVault
      }
    })
  )

  const transaction = await buildTransaction(connection, wallet, instructions, signers)
  const response = await sendPerpsTransactions(
    connection,
    wallet,
    buddyTransaction && !isDevnet ? [transaction, buddyTransaction] : [transaction],
    {
      startMessage: {
        header: 'Deposit funds',
        description: 'Sign the transaction to deposit funds!'
      },
      progressMessage: {
        header: 'Deposit funds',
        description: 'Depositing funds to your account..'
      },
      endMessage: {
        header: 'Deposit funds',
        description: 'Funds successfully deposited'
      },
      errorMessage: {
        header: 'Deposit funds',
        description: 'There was an error in depositing the funds'
      }
    }
  )

  localStorage.removeItem('referrer')

  // Only return trgIx reponse
  return response[0]
}

export const withdrawFundsIx = async (
  withdrawFundsAccounts: IWithdrawFundsAccounts,
  withdrawFundsParams: IWithdrawFundsParams,
  wallet: any,
  connection: Connection,
  referral: PublicKey
) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)

  const buddyProgramId = getProgramId(connection, wallet.publicKey)

  const remainingAccounts = await getRemainingAccountsForTransfer(connection, wallet.publicKey, referral)

  instructions.push(
    await dexProgram.instruction.withdrawFunds(withdrawFundsParams, {
      accounts: {
        tokenProgram: TOKEN_PROGRAM_ID,
        bubdyLinkProgram: buddyProgramId,
        user: wallet.publicKey,
        userTokenAccount: withdrawFundsAccounts.userTokenAccount,
        traderRiskGroup: withdrawFundsAccounts.traderRiskGroup,
        marketProductGroup: withdrawFundsAccounts.marketProductGroup,
        marketProductGroupVault: withdrawFundsAccounts.marketProductGroupVault,
        riskEngineProgram: withdrawFundsAccounts.riskEngineProgram,
        riskModelConfigurationAcct: withdrawFundsAccounts.riskModelConfigurationAcct,
        riskOutputRegister: withdrawFundsAccounts.riskOutputRegister,
        traderRiskStateAcct: withdrawFundsAccounts.traderRiskStateAcct,
        riskSigner: withdrawFundsAccounts.riskSigner
      },
      remainingAccounts: remainingAccounts
    })
  )
  try {
    const response = await sendPerpsTransaction(connection, wallet, instructions, [], {
      startMessage: {
        header: 'Withdraw funds',
        description: 'Sign the transaction to withdraw funds!'
      },
      progressMessage: {
        header: 'Withdraw funds',
        description: 'Withdrawing funds to your account..'
      },
      endMessage: {
        header: 'Withdraw funds',
        description: 'Funds successfully withdrawn'
      },
      errorMessage: {
        header: 'Withdraw funds',
        description: 'There was an error in withdrawing the funds'
      }
    })
    //if (response && response.txid) {
    //  notify({
    //    message: 'Funds withdrawn Successfully!'
    //  })
    //}
    return response
  } catch (e) {
    console.log(e)
    //notify({
    //  message: 'Withdrawl failed. Please try again with a smaller amount',
    //  type: 'error'
    //})
    return null
  }
}

function createFirstInstructionData() {
  const aa = u8('instruction')
  const dataLayout = struct([aa as any])

  const data = Buffer.alloc(dataLayout.span)
  dataLayout.encode(
    {
      instruction: 1
    },
    data
  )

  return data
}

export const initializeTraderFeeAcctIx = (args) => {
  const keys = [
    {
      pubkey: args.payer,
      isSigner: true,
      isWritable: false
    },
    //{
    //  pubkey: args.feeModelConfigAcct,
    //  isSigner: false,
    //  isWritable: false
    //},
    {
      pubkey: args.traderFeeAcct,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: new PublicKey(args.MPG_ID),
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: args.traderRiskGroup.publicKey,
      isSigner: false,
      isWritable: false
    },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false
    }
  ]
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: new PublicKey(FEES_ID),
    data: createFirstInstructionData()
  })
}

export const initTrgIx = async (connection: Connection, wallet: any, trgKey?: Keypair, isDevnet?: boolean) => {
  const instructions = []
  const riskStateAccount = anchor.web3.Keypair.generate()
  const traderRiskGroup = trgKey ?? anchor.web3.Keypair.generate()
  const traderFeeAcct = getTraderFeeAcct(traderRiskGroup.publicKey, isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID)
  const riskSigner = getRiskSigner(isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID)
  const referrer = localStorage.getItem('referrer') || ''
  const mint = new PublicKey(isDevnet ? DEVNET_VAULT_MINT : MAINNET_VAULT_MINT)
  const associatedTokenAddress = await findAssociatedTokenAddress(wallet.publicKey, mint)
  const res = await connection.getAccountInfo(associatedTokenAddress)
  if (!res) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey, // payer
        associatedTokenAddress, // ata
        wallet.publicKey, // owner
        mint,
        TOKEN_PROGRAM_ID // mint
      )
    )
    //const res = await sendPerpsTransaction(connection, wallet, instructions, [])
    //console.log(res)
  }
  //instructions = []
  instructions.push(
    initializeTraderFeeAcctIx({
      payer: wallet.publicKey,
      traderFeeAcct: traderFeeAcct,
      traderRiskGroup: traderRiskGroup,
      feeModelConfigAcct: getFeeModelConfigAcct(isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID),
      MPG_ID: isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID
    })
  )

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: traderRiskGroup.publicKey,
      lamports: 96600000, //Need to change
      space: 13744, //Need to change
      programId: new PublicKey(DEX_ID)
    })
  )

  const dexProgram = await getDexProgram(connection, wallet)
  if (!isDevnet) {
    const createBuddy = await createRandom(connection, wallet.publicKey, referrer)
    const referralKey = createBuddy.memberPDA
    const buddyInstructions = [...createBuddy.instructions]

    const ix = await dexProgram.instruction.initializeTraderRiskGroup({
      accounts: {
        owner: wallet.publicKey,
        traderRiskGroup: traderRiskGroup.publicKey,
        marketProductGroup: new PublicKey(isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID),
        riskSigner: riskSigner,
        traderRiskStateAcct: riskStateAccount.publicKey,
        traderFeeStateAcct: traderFeeAcct,
        riskEngineProgram: new PublicKey(RISK_ID),
        systemProgram: SystemProgram.programId,
        referralKey: referralKey
      }
    })
    instructions.push(ix)

    return [instructions, buddyInstructions, [riskStateAccount, traderRiskGroup]]
  } else {
    const ix = await dexProgram.instruction.initializeTraderRiskGroup({
      accounts: {
        owner: wallet.publicKey,
        traderRiskGroup: traderRiskGroup.publicKey,
        marketProductGroup: new PublicKey(isDevnet ? DEVNET_MPG_ID : MAINNET_MPG_ID),
        riskSigner: riskSigner,
        traderRiskStateAcct: riskStateAccount.publicKey,
        traderFeeStateAcct: traderFeeAcct,
        riskEngineProgram: new PublicKey(RISK_ID),
        systemProgram: SystemProgram.programId,
        referralKey: PublicKey.default
      }
    })
    instructions.push(ix)

    return [instructions, null, [riskStateAccount, traderRiskGroup]]
  }
}

export const initializeTRG = async (wallet: any, connection: Connection) => {
  const [instructions, buddyInstructions, signers] = await initTrgIx(connection, wallet)
  const transaction = await buildTransaction(connection, wallet, instructions, signers)
  const buddyTransaction = await buildTransaction(connection, wallet, buddyInstructions, [])

  const res = await sendPerpsTransactions(
    connection,
    wallet,
    buddyTransaction ? [transaction, buddyTransaction] : [transaction]
  )
  console.log(res)
  return res
}

export const consumeOBIx = async (wallet: any, connection: Connection, accounts: IConsumeOB) => {
  const instructions = []
  const dexProgram = await getDexProgram(connection, wallet)
  instructions.push(
    await dexProgram.instruction.consumeOrderbookEvents(
      { maxIterations: new anchor.BN(1) },
      {
        accounts: {
          aaobProgram: accounts.aaobProgram,
          marketProductGroup: accounts.marketProductGroup,
          product: accounts.product,
          marketSigner: accounts.marketSigner,
          orderbook: accounts.orderbook,
          eventQueue: accounts.eventQueue,
          rewardTarget: accounts.rewardTarget,
          feeModelProgram: accounts.feeModelProgram,
          feeModelConfigurationAcct: accounts.feeModelConfigurationAcct,
          feeOutputRegister: accounts.feeOutputRegister,
          riskAndFeeSigner: accounts.riskAndFeeSigner
        }
      }
    )
  )
  return instructions[0]
}
