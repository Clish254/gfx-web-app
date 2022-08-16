import React, { FC, useEffect, useState, useCallback, MouseEventHandler } from 'react'
import { Row, Col, Progress } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import ModalMint from './MintNest'
import { useWalletModal, useAccounts, useConnectionConfig } from '../../../context'
import { WRAPPED_SOL_MINT, fetchAvailableNft, ADDRESSES } from '../../../web3'
import { MintItemViewStatus, INFTMetadata } from '../../../types/nft_details'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { MainButton } from '../../../components/MainButton'
import { SOCIAL_MEDIAS } from '../../../constants'
import { SVGDynamicReverseMode } from '../../../styles/utils'
import { FloatingActionButton } from '../../../components'
import { Tabs } from 'antd'
import { TokenToggle } from '../../../components/TokenToggle'
import { Share } from '../Share'
import { generateTinyURL } from '../../../api/tinyUrl'
import { notify } from '../../../utils'
import { GatewayProvider } from '@civic/solana-gateway-react'
import { Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js'
import tw from 'twin.macro'

const { TabPane } = Tabs

//#region styles
const IMAGE = styled.div`
  width: 100%;
  padding: 3px;
  border-radius: 20px;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);

  ${({ theme }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${theme.text1};

    .ls-image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      border-radius: 20px;
      z-index: 0;
    }

    .ls-video {
      border-radius: 20px;
      box-shadow: 3px 3px 14px 0px rgb(0 0 0 / 43%);
      z-index: 10;
    }
  `}
`
const NFT_DETAILS = styled.div`
  position: relative;
  height: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.margin(6)} 0;

  .nd-content {
    height: 100%;
  }

  .icon-image {
    height: 24px;
    width: auto;
    margin-left: 5px;
    margin-right: 5px;
  }

  .ant-tabs-top {
    overflow: initial;
    > .ant-tabs-nav {
      margin-bottom: 0;
      border-bottom: 0px solid #575757;
      padding-bottom: 0px;

      &::before {
        border: none;
      }

      .ant-tabs-nav-wrap {
        overflow: initial;
        display: block;

        .ant-tabs-nav-list {
          position: relative;
          display: flex;
          justify-content: space-around;
          transition: transform 0.3s;
          width: 100%;
          margin-left: auto;
          padding-right: 0px;
        }
      }
    }
  }

  .ant-tabs-nav {
    padding: 0px !important;
    border: 0px;
    background-color: ${({ theme }) => theme.bg1};
    border-radius: 20px 20px 0px 0px;
  }

  .ant-tabs-content {
    background-color: ${({ theme }) => theme.bg1};
    min-height: 300px;
    text-align: center;
    display: grid;
    place-items: center;
    font-size: 20px;
    margin-bottom: 2px;
    border-radius: 0px 0px 0px 0px;
    padding: 1rem;
  }

  .ant-tabs-nav-list {
    height: 75px;
    background-color: ${({ theme }) => theme.bg5};
    display: flex;
    justify-content: space-around;
    width: 100%;
    border-radius: 20px;
  }

  .ant-tabs-tab {
    color: ${({ theme }) => theme.tabNameColor};
    font-size: 20px;
    font-family: Montserrat;
    padding: 0;
    margin: 0;

    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.text7};
        font-weight: 600;
        position: relative;

        &:before {
          position: absolute;
          content: '';
          height: 0px;
          width: 0px;
          bottom: -28px;
          left: 0%;
          background: rgba(0, 0, 0);
          z-index: 0;
          display: inline-block;
          border-radius: 8px 8px 0 0;
          transform: translate(-50%, 0);
        }
      }
    }
  }
`

const YELLOW = styled.h3`
  font-weight: 700;
  font-size: 30px;
  line-height: 36.57px;
  background: linear-gradient(92.45deg, #ea7e00 6.46%, #f1c52a 107.94%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin: 0;
`

const TITLE = styled.h1`
  font-weight: 700;
  font-size: 60px;
  line-height: 73px;
  margin: 0;
  color: ${({ theme }) => theme.text1};
`

const SUBTITLE = styled.h2`
  font-weight: 700;
  font-size: 35px;
  line-height: 43px;
  margin: 0;
  color: ${({ theme }) => theme.text1};
`

const PILL_SECONDARY = styled.div`
  background: linear-gradient(90deg, rgba(247, 147, 26, 0.5) 0%, rgba(220, 31, 255, 0.5) 100%);
  border-radius: 50px;
  width: 48%;
  height: 45px;
  padding: 2px;
  color: white;

  div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    background: #3c3b3ba6;
    border-radius: 50px;
    filter: drop-shadow(0px 6px 9px rgba(36, 36, 36, 0.15));
  }
`

const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;
  width: 100%;

  img {
    width: 24px;
  }
`

const NQ_LOGO = styled(SOCIAL_ICON)`
  width: 100%;
  img {
    width: 52px;
  }
`

const DESCRIPTION = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.text4};
`

const REMNANT = styled.p`
  font-size: 18px;
  line-height: 22px;
  color: ${({ theme }) => theme.text1};
  margin: 0px;

  span {
    color: #7d7d7d;
  }
`

const MINT_PROGRESS = styled(Progress)<{ num: number }>`
  width: 75%;
  .ant-progress-outer {
    height: 50px;
    margin-right: 0;
    padding-right: 0;
    .ant-progress-inner {
      height: 100%;
      background-color: ${({ theme }) => theme.bg1};

      .ant-progress-bg {
        height: 100% !important;
        background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
      }
    }
  }
  .ant-progress-text {
    position: absolute;
    top: 19px;
    left: calc(${({ num }) => num}% - 64px);
  }
`

const MINT_PROGRESS_WRAPPER = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg18};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 15px;
`

const CONNECT = styled(MainButton)`
  height: 50px;
  width: 50%;
  background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
`

const DISABLED = styled(MainButton)`
  height: 50px;
  width: 50%;
  background: grey;
  cursor: not-allowed;
`

const Live = styled.div`
  ${tw`absolute top-4 right-4 bg-black h-[40px] w-[120px] flex justify-center items-center rounded-[10px]`}
  border: 1.5px solid #fff;
  z-index: 10;

  span {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
`

const ACTION_BELOW = styled.div`
  width: 100%;
  height: 80px;
  padidng: 1rem;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 0px 0px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SHARE_BUTTON = styled.button`
  position: absolute;
  bottom: 12px;
  right: 48px;
  background: black;
  border: transparent;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;

  &:hover {
    background-color: black;
  }

  img {
    &:hover {
      opacity: 0.8;
    }
  }
`

const ORANGE_BTN = styled(MainButton)`
  height: 50px;
  width: 50%;
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  color: white !important;
  font-weight: 700;

  &:disabled {
    background: linear-gradient(96.79deg, #5855ff 4.25%, #dc1fff 97.61%);
  }
`

export const SpaceBetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const FLOATING_ACTION_ICON = styled.img`
  transform: rotate(90deg);
  width: 16px;
  filter: ${({ theme }) => theme.filterBackIcon};
`
//#endregion

export const onShare = async (social: string): Promise<void> => {
  if (social === 'copy link') {
    await navigator.clipboard.writeText(window.location.href)
    return
  }

  const res = await generateTinyURL(
    `https://${process.env.NODE_ENV !== 'production' ? 'app.staging.goosefx.io' : window.location.host}${
      window.location.pathname
    }`,
    ['gfx', 'nest-exchange', social]
  )

  if (res.status !== 200) {
    notify({ type: 'error', message: 'Error creating sharing url' })
    return
  }

  const tinyURL = res.data.data.tiny_url

  switch (social) {
    case 'twitter':
      window.open(
        `https://twitter.com/intent/tweet?text=Check%20out%20this%20item%20on%20Nest%20NFT%20Exchange&url=${tinyURL}&via=GooseFX1&original_referer=${window.location.host}${window.location.pathname}`,
        '_blank'
      )
      break
    case 'telegram':
      window.open(
        `https://t.me/share/url?url=${tinyURL}&text=Check%20out%20this%20item%20on%20Nest%20NFT%20Exchange`,
        '_blank'
      )
      break
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${tinyURL}`, '_blank')
      break
    default:
      break
  }
}

export const NestQuestSingleListing: FC<{
  handleClickPrimaryButton?: (type: string) => void
  status?: MintItemViewStatus
  backUrl?: string
  arbData?: INFTMetadata
}> = ({ status = '', backUrl, handleClickPrimaryButton, ...rest }) => {
  const history = useHistory()
  // total supply, amount distr, yet to be sold
  const totalEggs = 10
  const { connected, publicKey, signTransaction } = useWallet()
  const { setVisible: setModalVisible } = useWalletModal()
  const { connection, endpoint, network } = useConnectionConfig()
  //const { candyMachine } = useNFTLPSelected()
  const { getUIAmount } = useAccounts()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [token, setToken] = useState<string>('SOL')
  const [mintModalVisible, setMintModalVisible] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const [mintDisabled, setMintDisabled] = useState<boolean>(false)
  const [insufficientToken, setInsufficientToken] = useState<boolean>(false)
  const [mintPrice, setMintPrice] = useState<number>(2)
  const [availableEggs, setAvailableEggs] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  useEffect(() => {
    if (connection) {
      fetchAvailableNft(connection)
        .then((res) => {
          if (!res.nft) {
            throw new Error('NFT sold out')
          } else {
            setMintDisabled(false)
            setAvailableEggs(res.length)
          }
        })
        .catch((err) => {
          console.log("Couldn't fetch eggs from contract", err)
          notify({ type: 'error', message: "Couldn't fetch eggs from contract" })
          setMintDisabled(true)
        })
    }
  }, [connection, mintPrice, network, token, mintModalVisible, mintDisabled])

  useEffect(() => {
    if (publicKey && connected) {
      if (token === 'SOL') {
        setInsufficientToken(mintPrice >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false)
      } else {
        setInsufficientToken(mintPrice >= getUIAmount(ADDRESSES[network].mints.GOFX.address.toBase58()) ? true : false)
      }
    }

    if (network === 'devnet') {
      setMintDisabled(true)
    }
  }, [connected, publicKey, getUIAmount, mintPrice, network, token])

  const handleWalletModal: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      setModalVisible(true)
    },
    [setModalVisible]
  )

  async function CivicTransaction(transaction: Transaction) {
    const userMustSign = transaction.signatures.find((sig) => sig.publicKey.equals(publicKey!))
    if (userMustSign) {
      notify({
        message: 'Please sign one-time Civic Pass issuance'
      })
      try {
        transaction = await signTransaction!(transaction)
      } catch (e) {
        notify({
          type: 'error',
          message: 'User cancelled signing'
        })
        throw e
      }
    } else {
      notify({
        message: 'Refreshing Civic Pass, Please reload page if unresponsive'
      })
    }

    try {
      notify({
        message: 'Please sign minting for civic token pass'
      })
      await sendAndConfirmRawTransaction(connection, transaction.serialize())
    } catch (e) {
      notify({
        type: 'error',
        message: 'Solana dropped the transaction, please try again'
      })
      console.error(e)
      throw e
    }
    setMintModalVisible(true)
  }

  return (
    <GatewayProvider
      broadcastTransaction={false}
      options={{ autoShowModal: false }}
      wallet={{
        publicKey: publicKey,
        signTransaction: signTransaction
      }}
      clusterUrl={endpoint}
      cluster={network}
      handleTransaction={CivicTransaction}
      gatekeeperNetwork={ADDRESSES[network].programs.nestquestSale.civic_gatekeeper}
    >
      <NFT_DETAILS {...rest}>
        <div style={{ position: 'absolute', top: '48px', left: '24px' }}>
          <FloatingActionButton height={50} onClick={() => history.goBack()}>
            <FLOATING_ACTION_ICON src={`/img/assets/arrow.svg`} alt="back" />
          </FloatingActionButton>
        </div>

        <Row gutter={[64, 64]} className="nd-content" justify="center" align="top">
          <Col sm={10} xl={10} xxl={9} className="nd-details">
            <div>
              {isLoading ? (
                <>
                  <SkeletonCommon width="100%" height="75px" borderRadius="10px" />
                  <br />
                  <SkeletonCommon width="100%" height="350px" borderRadius="10px" />
                  <br />
                </>
              ) : (
                <div>
                  <YELLOW>Featured Launch</YELLOW>
                  <TITLE className="rs-name">NestQuest</TITLE>
                  <SUBTITLE>Tier #1 "The Egg"</SUBTITLE>
                  <br />
                  <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col span={16}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <PILL_SECONDARY>
                          <div>Items 10,018</div>
                        </PILL_SECONDARY>

                        <PILL_SECONDARY>
                          <div>
                            {mintPrice} <img className="icon-image" src={`/img/crypto/${token}.svg`} alt="" /> {token}
                          </div>
                        </PILL_SECONDARY>
                      </div>
                    </Col>
                    <Col span={8}>
                      <Row align="middle">
                        <Col span={10}>
                          <NQ_LOGO onClick={() => window.open(SOCIAL_MEDIAS.nestquest)}>
                            <SVGDynamicReverseMode src="/img/assets/nestquest_logo.png" alt="domain-icon" />
                          </NQ_LOGO>
                        </Col>
                        <Col span={7}>
                          <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.discord)}>
                            <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
                          </SOCIAL_ICON>
                        </Col>
                        <Col span={7}>
                          <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.twitter)}>
                            <SVGDynamicReverseMode src="/img/assets/twitter_small.svg" alt="twitter-icon" />
                          </SOCIAL_ICON>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />

                  <div>
                    <Tabs className={'collection-tabs'} defaultActiveKey="1" centered>
                      <TabPane tab="Summary" key="1">
                        <DESCRIPTION>
                          NestQuest is an interactive platform tutorial designed to reward participants for using the
                          GooseFX platform. There will be six total levels and tiers of NFTs as you evolve through the
                          process. Higher tier NFTs will be extremely limited and the rewards will be vast. The first
                          step is to connect your Tier 1 Egg NFT and incubate it for 30 days. We will be tracking usage
                          amongst our platform with on-chain analytics. The training has paid off and the Hatchling has
                          evolved into a much stronger Gosling. The Gosling still emits a dangerous flame from its mouth
                          which appears to be related to its prior Aura. Additional training is required to evolve
                          again.
                        </DESCRIPTION>
                      </TabPane>
                      <TabPane tab="Team" key="2">
                        <DESCRIPTION>The Nestquest project is created and maintained by the GooseFX team.</DESCRIPTION>
                      </TabPane>
                    </Tabs>
                    <ACTION_BELOW>
                      {publicKey ? (
                        !mintDisabled && !insufficientToken ? (
                          <ORANGE_BTN status="action" onClick={() => setMintModalVisible(true)} disabled={mintDisabled}>
                            Mint
                          </ORANGE_BTN>
                        ) : (
                          <DISABLED>
                            <span>{insufficientToken ? 'Insufficient Balance' : 'Sold Out'}</span>
                          </DISABLED>
                        )
                      ) : (
                        <CONNECT onClick={handleWalletModal}>
                          <span>Connect Wallet</span>
                        </CONNECT>
                      )}

                      <SHARE_BUTTON onClick={() => setShareModal(true)}>
                        <img src={`/img/assets/share.svg`} alt="share-icon" />
                      </SHARE_BUTTON>
                    </ACTION_BELOW>
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col sm={9} xl={9} xxl={9}>
            <TokenToggle
              token={token}
              toggleToken={() => {
                token === 'SOL' ? setToken('GOFX') : setToken('SOL')
                token === 'SOL' ? setMintPrice(750) : setMintPrice(2)
              }}
            />
            {!isLoading ? (
              <IMAGE>
                <video
                  className="ls-video"
                  autoPlay
                  loop
                  src={'https://gfxnestquest.s3.ap-south-1.amazonaws.com/Egg.mov'}
                ></video>
                {!mintDisabled && (
                  <Live>
                    <span>Live</span>
                  </Live>
                )}
              </IMAGE>
            ) : (
              <SkeletonCommon width="100%" height="550px" borderRadius="10px" />
            )}
            <br />

            {!isLoading ? (
              <Row gutter={8}>
                <Col span={7}></Col>
                <MINT_PROGRESS_WRAPPER>
                  {/*  */}
                  <MINT_PROGRESS
                    percent={((totalEggs - availableEggs) / totalEggs) * 100}
                    status="active"
                    num={((totalEggs - availableEggs) / totalEggs) * 100}
                  />
                  <REMNANT>
                    <span>{totalEggs - availableEggs}</span>/{totalEggs}
                  </REMNANT>
                </MINT_PROGRESS_WRAPPER>
              </Row>
            ) : (
              <SkeletonCommon width="100%" height="50px" borderRadius="50px" />
            )}
          </Col>
        </Row>

        {shareModal && (
          <Share
            visible={shareModal}
            handleCancel={() => setShareModal(false)}
            socials={['twitter', 'telegram', 'facebook', 'copy link']}
            handleShare={onShare}
          />
        )}
        {mintModalVisible && !mintDisabled && (
          <ModalMint
            modalVisible={mintModalVisible}
            setModalOpen={setMintModalVisible}
            nestQuestData={{ name: 'Tier #1 “The Egg”', project: 'NestQuest', token }}
          />
        )}
      </NFT_DETAILS>
    </GatewayProvider>
  )
}
