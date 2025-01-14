import { FC, useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { Button } from '../../components/Button'
import { useCrypto, useOrder } from '../../context'
import { useTraderConfig } from '../../context/trader_risk_group'
import { checkMobile } from '../../utils'

const WRAPPER = styled.div``

const ROW = styled.div`
  ${tw`flex flex-row justify-between items-start mb-2.5 sm:mb-2`}
  > span {
    ${tw`text-average font-semibold text-grey-2 sm:text-regular`}
  }
  .value {
    ${tw`text-black-4 dark:text-white font-semibold sm:text-regular`}
  }
  .spacing {
    ${tw`mb-[25px] sm:mb-3.75`}
  }
`

export const TradeConfirmation: FC<{ setVisibility: any; takeProfit?: any }> = ({ setVisibility, takeProfit }) => {
  const { order } = useOrder()
  const { selectedCrypto, getAskSymbolFromPair } = useCrypto()
  const { newOrder, newOrderTakeProfit } = useTraderConfig()

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )

  const notionalValue = useMemo(() => {
    if (Number(order.price) && Number(order.size)) return (Number(order.price) * Number(order.size)).toFixed(2)
    else return '-'
  }, [order])

  const fee = useMemo(() => {
    if (Number(notionalValue)) return (Number(notionalValue) / 10000).toFixed(2)
    else return '-'
  }, [notionalValue])

  const total = useMemo(() => {
    if (Number(notionalValue) && !Number.isNaN(Number(fee)))
      return (Number(notionalValue) + Number(fee)).toFixed(2)
    else return '-'
  }, [notionalValue, fee])

  const handleClick = async () => {
    !takeProfit ? await newOrder() : await newOrderTakeProfit(takeProfit.toString())
    setVisibility(false)
  }

  const cssStyle = useMemo(() => {
    if (order.side === 'buy') return tw`bg-green-3 text-white font-semibold border-0 rounded-circle text-regular`
    else return tw`bg-red-2 text-white font-semibold border-0 rounded-circle text-regular`
  }, [order.side])

  return (
    <WRAPPER>
      <div tw="mt-[30px] mb-7 sm:my-0">
        <ROW>
          <span>Order Type</span>
          <span className="value">{order.display === 'limit' ? 'Limit' : 'Market'}</span>
        </ROW>
        <ROW>
          <span>Trade Size</span>
          <span className="value spacing">
            {order.size} {symbol}
          </span>
        </ROW>
        <ROW>
          <span>Est. Entry Price</span>
          <span className="value">${order.price}</span>
        </ROW>
        <ROW>
          <span>Est. Price Impact</span>
          <span className="value">0.0000%</span>
        </ROW>
        <ROW>
          <span>Slippage Tolerance</span>
          <span className="value spacing">{'0.1%'}</span>
        </ROW>
        <ROW>
          <span>Trade Notional Size</span>
          <span className="value">{notionalValue} USDC</span>
        </ROW>
        <ROW>
          <span>Fee (0.1%)</span>
          <span className="value">{fee} USDC</span>
        </ROW>
        <ROW>
          <span>Total Cost</span>
          <span tw="mb-7" className="value">
            {total} USDC
          </span>
        </ROW>
        {/* <ROW>
          <span>Est. Liquidation Price</span>
          <span className="value">$14.9628</span>
        </ROW> */}
      </div>
      <Button
        onClick={() => handleClick()}
        width="100%"
        height={checkMobile() ? '45px' : '50px'}
        cssStyle={cssStyle}
      >
        {order.side === 'buy' ? 'Long' : 'Short'} {Number(order.size).toFixed(3)} {symbol}
      </Button>
    </WRAPPER>
  )
}
