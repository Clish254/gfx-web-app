import { useWallet } from '@solana/wallet-adapter-react'
import React, { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useNFTCreator } from '../../../../context/nft_creator'
import { ICreatorParams } from '../../../../types/nft_launchpad'
import { StepsWrapper } from './StepsWrapper'

const WRAPPER = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  .first-line {
    font-size: 30px;
    margin-top: 35px;
    font-weight: 600;
    color: ${({ theme }) => theme.text7};
  }
  .second-line {
    font-size: 18px;
    margin-top: 25px;
    width: 350px;
    text-align: center;
    font-weight: 500;
    color: ${({ theme }) => theme.text8};
    .email-style {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`

export const CreatorWrapper: FC = () => {
  const routeParam = useParams<ICreatorParams>()
  const walletAddress = routeParam.walletAddress
  const wallet = useWallet()
  const { isAllowed } = useNFTCreator()
  console.log(isAllowed)

  return !wallet.connected ? (
    <WRAPPER>
      <img src="/img/assets/launchpad-logo.svg" alt="Launchpad Logo" />
      <div className="first-line">Welcome to GFX Launchpad!</div>
      <div className="second-line">Please connect your wallet to finish your collection and list it!</div>
    </WRAPPER>
  ) : !isAllowed ? (
    <WRAPPER>
      <img src="/img/assets/launchpad-logo.svg" alt="Launchpad Logo" />
      <div className="first-line">Ups, wallet not supported!</div>
      <div className="second-line">
        Please contact <span className="email-style">hello@goosefx.io</span> or try again.
      </div>
    </WRAPPER>
  ) : (
    <StepsWrapper />
  )
}
