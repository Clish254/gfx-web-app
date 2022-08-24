import React from 'react'
import styled from 'styled-components'
import { GofxHolders } from './GofxHolders'
import { TotalLiquidityVolume } from './TotalLiquidityVolume'

const WRAPPER = styled.div`
  font-size: 25px;
  font-weight: 600;
  color: #eeeeee;
`

export const AnalyticsStats = () => {
  return (
    <WRAPPER>
      <TotalLiquidityVolume />
      <GofxHolders />
    </WRAPPER>
  )
}