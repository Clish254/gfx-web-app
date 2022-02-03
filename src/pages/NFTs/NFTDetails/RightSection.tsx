import React, { useMemo, FC } from 'react'
import { Col, Row } from 'antd'
import styled, { css } from 'styled-components'
import { moneyFormatter } from '../../../utils'
import { RightSectionTabs } from './RightSectionTabs'
import { useNFTDetails } from '../../../context'
import { MintItemViewStatus, NFTDetailsProviderMode } from '../../../types/nft_details'

const RIGHT_SECTION = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};
    text-align: left;

    .rs-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: ${theme.margins['1x']};
      color: ${theme.text7};
    }

    .rs-type {
      font-size: 14px;
      font-weight: 600;
    }

    .rs-prices {
      margin-bottom: ${theme.margins['1x']};

      .rs-solana-logo {
        width: 43px;
        height: 43px;
      }

      .rs-price {
        font-size: 25px;
        font-weight: bold;
        color: ${theme.text8};
      }

      .rs-fiat {
        font-size: 14px;
        font-weight: 500;
        color: ${theme.text8};
      }

      .rs-percent {
        font-size: 11px;
        font-weight: 600;
        margin-left: ${theme.margins['0.5x']};
        color: ${theme.text8};
      }
    }

    .rs-name {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: ${theme.margins['0.5x']};
      color: ${theme.text7};
    }

    .rs-intro {
      font-size: 12px;
      font-weight: 500;
      max-width: 300px;
      margin-bottom: ${theme.margins['1.5x']};
      color: ${theme.text8};
    }

    .rs-charity-text {
      font-size: 12px;
      font-weight: 600;
      max-width: 64px;
      margin-left: ${theme.margins['1.5x']};
      color: ${theme.text8};
    }
  `}
`

const GRID_INFO = styled(Row)`
  ${({ theme }) => css`
  width: 100%;
  max-width: 384px;
  margin-bottom: ${theme.margins['3x']};

  .gi-item {
    .gi-item-category-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: ${theme.margins['1x']};
      color: ${theme.text7};
    }

    .gi-item-thumbnail-wrapper {
      position: relative;

      .gi-item-check-icon {
        position: absolute;
        right: 4px;
        bottom: -3px;
        width: 15px;
        height: 15px;
      }
    }

    .gi-item-thumbnail {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: ${theme.margins['1x']};
    }

    .gi-item-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: ${theme.margins['1x']};
      background: ${theme.bg1};
      display: flex;
      justify-content: center;
      align-items: center;
      
      img {
        width: 16px;
        height: 16px;
      }
    }

    .gi-item-title {
      font-size: 14px;
      font-weight: 500;
      color: ${theme.text8};
      text-transform: capitalize;
    }
  `}
`

export const RightSection: FC<{
  mode: NFTDetailsProviderMode
  status: MintItemViewStatus
  handleClickPrimaryButton: () => void
}> = ({ mode, status, handleClickPrimaryButton, ...rest }) => {
  const { general, nftMetadata } = useNFTDetails()
  console.log({ nftMetadata, general })
  const creator = useMemo(() => {
    if (nftMetadata?.properties?.creators?.length > 0) {
      const addr = nftMetadata?.properties?.creators?.[0]?.address
      return `${addr.substr(0, 4)}...${addr.substr(-4, 4)}`
    } else {
      return nftMetadata.collection.name
    }
  }, [nftMetadata])

  const price = 150
  const fiat = '21,900 USD aprox'
  const percent = '+ 1.15 %'
  const isForCharity = true

  const isMintItemView = mode === 'mint-item-view'

  if (nftMetadata === null) {
    return <div>Error loading metadata</div>
  }

  return nftMetadata === undefined ? (
    <div>...loading metadata</div>
  ) : (
    <RIGHT_SECTION {...rest}>
      <Row justify="space-between">
        <Col className="rs-title">{isMintItemView ? 'Price' : 'Current Bid'}</Col>
      </Row>
      <Row align="middle" gutter={8} className="rs-prices">
        <Col>
          <img className="rs-solana-logo" src={`/img/assets/solana-logo.png`} alt="" />
        </Col>
        <Col className="rs-price">{`${moneyFormatter(price)} SOL`}</Col>
        <Col className="rs-fiat">{`(${fiat})`}</Col>
        {!isMintItemView && (
          <Col>
            <Row>
              <img src={`/img/assets/increase-arrow.svg`} alt="" />
              <div className="rs-percent">{percent}</div>
            </Row>
          </Col>
        )}
      </Row>
      <Row justify="space-between" align="middle">
        <Col>
          {mode !== 'mint-item-view' && (
            <>
              <div className="rs-name">{general?.nft_name || nftMetadata?.name}</div>
              <div className="rs-intro">{nftMetadata.description}</div>
            </>
          )}
        </Col>
        {isForCharity && (
          <Row align="middle">
            <img src={`/img/assets/heart-charity.svg`} alt="" />
            <div className="rs-charity-text">Auction for charity</div>
          </Row>
        )}
      </Row>
      <GRID_INFO justify="space-between">
        {nftMetadata.collection && (
          <Col className="gi-item">
            <div className="gi-item-category-title">Creator</div>
            <Row align="middle">
              <div className="gi-item-thumbnail-wrapper">
                <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
                <img className="gi-item-check-icon" src={`/img/assets/check-icon.png`} alt="" />
              </div>
              <div className="gi-item-title">{creator}</div>
            </Row>
          </Col>
        )}
        {nftMetadata.collection && (
          <Col className="gi-item">
            <div className="gi-item-category-title">Collection</div>
            <Row align="middle">
              <img className="gi-item-thumbnail" src="https://placeimg.com/30/30" alt="" />
              <div className="gi-item-title">{nftMetadata.collection.name}</div>
            </Row>
          </Col>
        )}
        <Col className="gi-item">
          <div className="gi-item-category-title">Category</div>
          <Row align="middle">
            <div className="gi-item-icon">
              <img
                src={`/img/assets/${
                  nftMetadata.properties.category === 'image' ? 'art' : nftMetadata.properties.category
                }.svg`}
                alt=""
              />
            </div>
            <div className="gi-item-title">{nftMetadata.properties.category}</div>
          </Row>
        </Col>
      </GRID_INFO>
      <RightSectionTabs mode={mode} status={status} handleClickPrimaryButton={handleClickPrimaryButton} />
    </RIGHT_SECTION>
  )
}
