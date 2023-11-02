import { FC, useMemo, useState, useEffect } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button } from '../../components'
import { useConnectionConfig, usePriceFeedFarm, useSSLContext } from '../../context'
import { executeClaimRewards, executeDeposit, executeWithdraw, getPriceObject } from '../../web3'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '../../layouts'
import {
  ModeOfOperation,
  insufficientSOLMsg,
  invalidDepositErrMsg,
  invalidInputErrMsg,
  genericErrMsg,
  invalidWithdrawErrMsg,
  sslSuccessfulMessage,
  sslErrorMessage,
  SSLToken,
  BONK_MINT
} from './constants'
import { checkMobile, notify, truncateBigNumber } from '../../utils'
import useBreakPoint from '../../hooks/useBreakPoint'
import { toPublicKey } from '@metaplex-foundation/js'
import { SkeletonCommon } from '../NFTs/Skeleton/SkeletonCommon'
import { ActionModal } from './ActionModal'

const CLAIM = styled.div`
  ${tw`h-8.75 w-[140px] rounded-circle flex items-center justify-center text-white cursor-pointer ml-2 sm:w-[33%]`};
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
`

export const ExpandedView: FC<{ isExpanded: boolean; coin: SSLToken; userDepositedAmount: number }> = ({
  isExpanded,
  coin,
  userDepositedAmount
}) => {
  const { wallet } = useWallet()
  const wal = useWallet()
  const { connection } = useConnectionConfig()
  const breakpoint = useBreakPoint()
  const { prices, SSLProgram } = usePriceFeedFarm()
  const {
    pool,
    operationPending,
    isTxnSuccessfull,
    setOperationPending,
    setIsTxnSuccessfull,
    filteredLiquidityAccounts,
    liquidityAmount,
    sslTableData,
    rewards
  } = useSSLContext()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const tokenMintAddress = useMemo(() => coin?.mint?.toBase58(), [coin])
  const [userSolBalance, setUserSOLBalance] = useState<number>()
  const [userBonkBalance, setUserBonkBalance] = useState<number>()
  const [depositAmount, setDepositAmount] = useState<number>()
  const [withdrawAmount, setWithdrawAmount] = useState<number>()
  const [modeOfOperation, setModeOfOperation] = useState<string>(ModeOfOperation.DEPOSIT)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0)
  const [actionModal, setActionModal] = useState<boolean>(false)
  const [actionType, setActionType] = useState<string>(null)

  useEffect(() => {
    ;(async () => {
      if (wallet?.adapter?.publicKey) {
        const account = await connection.getTokenAccountsByOwner(wallet?.adapter?.publicKey, {
          mint: toPublicKey(tokenMintAddress)
        })
        if (account.value[0]) {
          const balance = await connection.getTokenAccountBalance(account.value[0].pubkey, 'confirmed')
          setUserTokenBalance(balance?.value?.uiAmount)
        }
        if (coin.token === 'SOL') setUserTokenBalance(userSolBalance)
      }
    })()
  }, [tokenMintAddress, userPublicKey, isTxnSuccessfull, userSolBalance])

  useEffect(() => {
    ;(async () => {
      if (wallet?.adapter?.publicKey) {
        const account = await connection.getTokenAccountsByOwner(wallet?.adapter?.publicKey, {
          mint: toPublicKey(BONK_MINT)
        })
        if (account.value[0]) {
          const balance = await connection.getTokenAccountBalance(account.value[0].pubkey, 'confirmed')
          setUserBonkBalance(balance?.value?.uiAmount)
        }
      }
    })()
  }, [userBonkBalance, userPublicKey, isTxnSuccessfull])

  useEffect(() => {
    ;(async () => {
      if (wallet?.adapter?.publicKey) {
        const solAmount = await connection.getBalance(wallet?.adapter?.publicKey)
        setUserSOLBalance(solAmount / LAMPORTS_PER_SOL)
      }
    })()
  }, [wallet?.adapter?.publicKey, isTxnSuccessfull])

  const liquidity = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current &&
      prices[getPriceObject(coin?.token)]?.current * liquidityAmount?.[tokenMintAddress],
    [liquidityAmount, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const apiSslData = useMemo(() => {
    try {
      if (sslTableData) {
        const key = coin.token === 'SOL' ? 'WSOL' : coin.token
        const decimal = coin.mintDecimals
        return {
          apy: sslTableData[key]?.apy,
          fee: sslTableData[key]?.fee / 10 ** decimal,
          volume: sslTableData[key]?.volume / 1_000_000
        }
      } else
        return {
          apy: 0,
          fee: 0,
          volume: 0
        }
    } catch (e) {
      console.log('error in ssl api data: ', e)
    }
  }, [coin, sslTableData])

  const formattedapiSslData = useMemo(
    () => ({
      apy: apiSslData?.apy,
      fee: apiSslData?.fee,
      volume: apiSslData?.volume
    }),
    [apiSslData]
  )

  const totalEarned = useMemo(
    () => filteredLiquidityAccounts[tokenMintAddress]?.totalEarned?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [filteredLiquidityAccounts, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const claimableReward = useMemo(
    () => rewards[tokenMintAddress]?.toNumber() / Math.pow(10, coin?.mintDecimals),
    [rewards, tokenMintAddress, isTxnSuccessfull, coin]
  )

  const totalEarnedInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * totalEarned
        : 0,
    [totalEarned]
  )

  const claimableRewardInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * claimableReward
        : 0,
    [claimableReward]
  )

  console.log('******', claimableReward, coin.token)

  const userTokenBalanceInUSD = useMemo(
    () =>
      prices[getPriceObject(coin?.token)]?.current
        ? prices[getPriceObject(coin?.token)]?.current * userTokenBalance
        : 0,
    [prices, coin, prices[getPriceObject(coin?.token)], userTokenBalance]
  )
  const enoughSOLInWallet = (): boolean => {
    if (userSolBalance < 0.000001) {
      notify(insufficientSOLMsg())
      return false
    }
    return true
  }

  const goToTwitter = () => {
    window.open('https://twitter.com/GooseFX1/status/1719447919437533535', '_blank')
  }

  const openActionModal = (actionValue: string) => {
    setActionType(actionValue)
    setActionModal(true)
  }

  // Disable action button when deposit mode with zero user balance or no deposit amount,
  // or withdraw mode with zero user deposited amount or no withdraw amount
  const disableActionButton = useMemo(
    () =>
      (modeOfOperation === ModeOfOperation.DEPOSIT && liquidity > coin?.cappedDeposit) ||
      (modeOfOperation === ModeOfOperation.DEPOSIT && (userTokenBalance === 0 || !depositAmount)) ||
      (modeOfOperation === ModeOfOperation.WITHDRAW && (userDepositedAmount === 0 || !withdrawAmount)),
    [userTokenBalance, modeOfOperation, pool, coin, depositAmount, withdrawAmount, liquidity]
  )

  // Deposit mode and user has not token balance OR has not yet given input OR Withdraw has not deposited anything
  const actionButtonText = useMemo(() => {
    if (modeOfOperation === ModeOfOperation.DEPOSIT) {
      if (liquidity > coin?.cappedDeposit) return `${coin?.token} Temporarily Closed`
      if (userTokenBalance === 0) return `Insufficient ${coin?.token}`
      if (depositAmount) return modeOfOperation
      if (!depositAmount) return `Enter Amount`
    }
    if (modeOfOperation === ModeOfOperation.WITHDRAW) {
      if (userDepositedAmount > 0) return modeOfOperation
      if (userDepositedAmount === 0) return `Insufficient ${coin?.token}`
      if (withdrawAmount) return modeOfOperation
      if (!withdrawAmount) return `Enter Amount`
    }
  }, [modeOfOperation, pool, coin, userTokenBalance, depositAmount, withdrawAmount, liquidity])

  const checkConditionsForDepositWithdraw = (isDeposit: boolean) => {
    if (!enoughSOLInWallet()) return true
    if (isDeposit) {
      if (!userTokenBalance) {
        notify(genericErrMsg(`You have 0 ${coin.token} to deposit!`))
        setDepositAmount(0)
        return true
      } else if (isNaN(depositAmount) || depositAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setDepositAmount(0)
        return true
      } else if (depositAmount > userTokenBalance) {
        notify(invalidDepositErrMsg(userTokenBalance, coin?.token))
        setDepositAmount(0)
        return true
      }
      return false
    } else {
      if (!userDepositedAmount) {
        notify(genericErrMsg(`You have 0 ${coin.token} to withdraw!`))
        setWithdrawAmount(0)
        return true
      } else if (isNaN(withdrawAmount) || withdrawAmount < 0.000001) {
        notify(invalidInputErrMsg(coin?.token))
        setWithdrawAmount(0)
        return true
      } else if (userDepositedAmount < withdrawAmount) {
        notify(invalidWithdrawErrMsg(userDepositedAmount, coin?.token))
        return true
      }
      return false
    }
  }

  const handleDeposit = (): void => {
    if (checkConditionsForDepositWithdraw(true)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      const confirm = executeDeposit(SSLProgram, wal, connection, depositAmount, coin, userPublicKey)
      confirm.then((con) => {
        setOperationPending(false)
        setIsButtonLoading(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('deposited', depositAmount, coin?.token))
          setTimeout(() => setDepositAmount(0), 500)
          setIsTxnSuccessfull(true)
        } else {
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (error) {
      setOperationPending(false)
      setIsButtonLoading(false)
      notify(genericErrMsg(error))
      setIsTxnSuccessfull(false)
    }
  }
  const handleWithdraw = (): void => {
    if (checkConditionsForDepositWithdraw(false)) return
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      executeWithdraw(SSLProgram, wal, connection, coin, withdrawAmount, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('withdrawn', withdrawAmount, coin?.token))
          setTimeout(() => setWithdrawAmount(0), 500)
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (err) {
      setIsButtonLoading(false)
      setOperationPending(false)
      notify(genericErrMsg(err))
      setIsTxnSuccessfull(false)
    }
  }
  const handleClaim = () => {
    try {
      setIsButtonLoading(true)
      setOperationPending(true)
      setIsTxnSuccessfull(false)
      executeClaimRewards(SSLProgram, wal, connection, coin, userPublicKey).then((con) => {
        setIsButtonLoading(false)
        setOperationPending(false)
        const { confirm } = con
        if (confirm && confirm?.value && confirm.value.err === null) {
          notify(sslSuccessfulMessage('claimed', claimableReward, coin?.token))
          setActionModal(false)
          setIsTxnSuccessfull(true)
        } else {
          notify(sslErrorMessage())
          setIsTxnSuccessfull(false)
          return
        }
      })
    } catch (err) {
      setIsButtonLoading(false)
      setOperationPending(false)
      notify(genericErrMsg(err))
      setIsTxnSuccessfull(false)
    }
  }
  const handleInputChange = (input: string) => {
    // handle if the user sends '' or undefined in input box
    if (input === '') {
      if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(null)
      else setWithdrawAmount(null)
      return
    }
    const inputValue = +input
    if (!isNaN(inputValue)) {
      if (modeOfOperation === ModeOfOperation.DEPOSIT) setDepositAmount(inputValue)
      else setWithdrawAmount(inputValue)
    }
  }

  return (
    <div
      css={[
        tw`dark:bg-black-2 bg-white mx-3.75 sm:mx-3 rounded-[0 0 15px 15px] duration-300 
            flex justify-between sm:flex-col sm:justify-around sm:w-[calc(100vw - 50px)] `,
        isExpanded ? tw`h-[115px] sm:h-[366px] visible p-3.5 sm:p-4` : tw`h-0 invisible p-0 opacity-0 w-0`
      ]}
    >
      {actionModal && (
        <ActionModal
          actionModal={actionModal}
          setActionModal={setActionModal}
          handleWithdraw={handleWithdraw}
          handleDeposit={handleDeposit}
          handleClaim={handleClaim}
          isButtonLoading={isButtonLoading}
          withdrawAmount={withdrawAmount}
          depositAmount={depositAmount}
          claimAmount={claimableReward}
          actionType={actionType}
          token={coin}
        />
      )}
      <div tw="flex flex-col">
        {breakpoint.isMobile && isExpanded && (
          <div tw="flex flex-col">
            <FarmStats
              keyStr="Liquidity"
              value={
                <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                  {liquidity ? '$' + truncateBigNumber(liquidity) : <SkeletonCommon height="100%" />}
                </span>
              }
            />
            <FarmStats
              keyStr="24H Volume"
              value={
                <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                  ${truncateBigNumber(formattedapiSslData?.volume)} {coin?.token}
                </span>
              }
            />
            <FarmStats
              keyStr="24H Fees"
              value={
                <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                  {' '}
                  ${truncateBigNumber(
                    formattedapiSslData?.fee * prices?.[getPriceObject(coin?.token)]?.current
                  )}{' '}
                </span>
              }
            />
            <FarmStats
              keyStr="My Balance"
              value={
                userDepositedAmount ? (
                  <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                    {truncateBigNumber(userDepositedAmount)}
                  </span>
                ) : (
                  <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">0.00</span>
                )
              }
            />
            <FarmStats
              keyStr="Wallet Balance"
              value={
                <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                  {truncateBigNumber(userTokenBalance)} {coin?.token}
                </span>
              }
            />
            <FarmStats
              keyStr="Total Earned"
              value={
                totalEarned ? (
                  <div tw="text-right">
                    <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                      {`${totalEarned.toFixed(3)} ($${totalEarnedInUSD?.toFixed(2)} USD)`}
                    </span>
                  </div>
                ) : (
                  <div tw="text-right">
                    <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                      0.00 {coin?.token} ($0.00 USD)
                    </span>
                  </div>
                )
              }
            />
            <FarmStats
              keyStr="Pending Rewards"
              value={
                claimableReward ? (
                  <div tw="text-right">
                    <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                      {`${claimableReward?.toFixed(4)} ($${claimableRewardInUSD?.toFixed(4)} USD)`}
                    </span>
                  </div>
                ) : (
                  <div tw="text-right">
                    <span tw="dark:text-grey-1 text-grey-2 font-semibold text-regular">
                      0.00 {coin?.token} ($0.00 USD)
                    </span>
                  </div>
                )
              }
            />
          </div>
        )}
        {isExpanded && (
          <>
            <div tw="flex font-semibold duration-500 relative sm:mt-2">
              <div
                css={[
                  tw`bg-blue-1 h-8.75 w-[100px] sm:w-[33%] rounded-full`,
                  modeOfOperation === ModeOfOperation.WITHDRAW
                    ? tw`absolute ml-[100px] sm:ml-[33%] duration-500`
                    : tw`absolute ml-0 duration-500`
                ]}
              ></div>
              <div
                css={[
                  tw`h-8.75 w-[100px] sm:w-[33%] z-10 flex items-center justify-center 
                  cursor-pointer dark:text-white text-grey-1`,
                  modeOfOperation === ModeOfOperation.DEPOSIT && tw`!text-white`
                ]}
                onClick={() => (operationPending ? null : setModeOfOperation(ModeOfOperation.DEPOSIT))}
              >
                Deposit
              </div>
              <div
                css={[
                  tw`h-8.75 w-[100px] sm:w-[33%] z-10 flex items-center justify-center 
                  cursor-pointer dark:text-white text-grey-1`,
                  modeOfOperation === ModeOfOperation.WITHDRAW && tw`!text-white`
                ]}
                onClick={() => (operationPending ? null : setModeOfOperation(ModeOfOperation.WITHDRAW))}
              >
                Withdraw
              </div>
              <CLAIM onClick={() => openActionModal('claim')}>{checkMobile() ? 'Claim' : 'Claim Rewards'}</CLAIM>
            </div>
          </>
        )}
        {breakpoint.isDesktop && isExpanded && (
          <div tw="mt-4">
            <FarmStats
              keyStr="Wallet Balance"
              value={
                <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                  {truncateBigNumber(userTokenBalance)} {coin?.token} (${truncateBigNumber(userTokenBalanceInUSD)}{' '}
                  USD)
                </span>
              }
            />
          </div>
        )}
      </div>

      <div>
        <div tw="flex relative">
          {isExpanded && (
            <div tw="absolute flex z-[100]">
              <div
                onClick={() =>
                  modeOfOperation === ModeOfOperation.DEPOSIT
                    ? setDepositAmount(userTokenBalance ? 0.01 : 0)
                    : setWithdrawAmount(userDepositedAmount ? 0.01 : 0)
                }
                tw="font-semibold text-grey-1 dark:text-grey-2 mt-1.5 ml-4 cursor-pointer"
              >
                Min
              </div>
              <div
                onClick={() =>
                  modeOfOperation === ModeOfOperation.DEPOSIT
                    ? setDepositAmount(userTokenBalance ? userTokenBalance : 0)
                    : setWithdrawAmount(userDepositedAmount ? userDepositedAmount : 0)
                }
                tw="font-semibold text-grey-1 dark:text-grey-2 mt-1.5 ml-2 cursor-pointer"
              >
                Max
              </div>
            </div>
          )}

          {isExpanded && (
            <>
              <input
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`0.00`}
                value={modeOfOperation === ModeOfOperation.DEPOSIT ? depositAmount : withdrawAmount}
                css={[
                  tw`duration-500 rounded-[50px] relative !text-regular font-semibold outline-none dark:bg-black-1 
                bg-grey-5 border-none dark:text-white text-black-4`,
                  isExpanded
                    ? tw`w-[400px] h-8.75 sm:w-[100%] p-4 pl-[100px] pr-[64px] text-right`
                    : tw`h-0 w-0 pl-0 invisible`
                ]}
                type="number"
                key={modeOfOperation}
              />
              <div tw="font-semibold text-grey-1 dark:text-grey-2 absolute mt-1.5 ml-[345px] sm:ml-[85%] sm:mt-[6.5px]">
                {coin?.token}
              </div>
            </>
          )}
        </div>
        {isExpanded && (
          <div tw="mt-4">
            {wallet?.adapter?.publicKey ? (
              <div>
                <Button
                  height="35px"
                  disabledColor={tw`dark:bg-black-1 bg-grey-5 !text-grey-1 opacity-70`}
                  disabled={isButtonLoading || disableActionButton}
                  cssStyle={tw`duration-500 w-[400px] sm:w-[100%] !h-8.75 bg-blue-1 text-regular border-none
                    !text-white font-semibold rounded-[50px] flex items-center justify-center outline-none`}
                  onClick={
                    modeOfOperation === ModeOfOperation.WITHDRAW && userDepositedAmount > 0
                      ? () => {
                          openActionModal('withdraw')
                        }
                      : modeOfOperation === ModeOfOperation.DEPOSIT
                      ? () => {
                          openActionModal('deposit')
                        }
                      : null
                  }
                  loading={actionModal ? false : isButtonLoading ? true : false}
                >
                  {actionButtonText}
                </Button>
              </div>
            ) : (
              <Connect customButtonStyle={[tw`sm:w-[80vw] w-[400px] !h-8.75`]} />
            )}
          </div>
        )}
      </div>

      {breakpoint.isDesktop && isExpanded && (
        <div tw="mt-1 flex flex-col">
          <FarmStats
            alignRight={true}
            keyStr="Total Earned"
            value={
              totalEarned ? (
                <div tw="text-right">
                  <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular text-right">
                    {`${totalEarned?.toFixed(3)} ($${totalEarnedInUSD?.toFixed(2)} USD)`}
                  </span>
                </div>
              ) : (
                <span tw="dark:text-grey-1 text-grey-2 font-semibold text-regular">
                  0.00 {coin?.token} ($0.00 USD)
                </span>
              )
            }
          />
          <div tw="mt-2">
            <FarmStats
              alignRight={true}
              keyStr="Pending Rewards"
              value={
                claimableReward ? (
                  <div tw="text-right">
                    <span tw="dark:text-grey-5 text-black-4 font-semibold text-regular">
                      {`${claimableReward?.toFixed(4)} ($${claimableRewardInUSD?.toFixed(4)} USD)`}
                    </span>
                  </div>
                ) : (
                  <div tw="text-right">
                    <span tw="dark:text-grey-1 text-grey-2 font-semibold text-regular">
                      0.00 {coin?.token} ($0.00 USD)
                    </span>
                  </div>
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

const FarmStats: FC<{
  keyStr: string
  value: string | JSX.Element
  alignRight?: boolean
}> = ({ keyStr, value, alignRight }) => (
  <div css={[tw`font-semibold duration-500 sm:flex sm:w-[100%] sm:justify-between leading-[18px] sm:mb-2`]}>
    <div tw="dark:text-grey-2 text-grey-1" css={[!!alignRight && tw`text-right`]}>
      {keyStr}
    </div>
    <div>{value}</div>
  </div>
)
