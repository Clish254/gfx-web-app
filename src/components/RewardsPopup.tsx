import React, { FC, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { RewardInfoComponent, RewardRedirectComponent } from './RewardDetails'
import { useDarkMode, useRewardToggle } from '../context'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../hooks/useBreakPoint'
// import { useRewardToggle } from '../context/reward_toggle'
// import useRiveAnimations, { RiveAnimationWrapper } from '../hooks/useRiveAnimations'
// import useRiveThemeToggle from '../hooks/useRiveThemeToggle'

const REWARD_INFO = styled.div`
  ${tw`w-full min-w-[65%]  rounded-bigger`}
`

const REWARD_REDIRECT = styled.div<{ $index: number }>`
  ${tw`flex flex-col min-w-max w-[35%] justify-center w-full sm:rounded-t-bigger rounded-tr-bigger`}
  background-image: ${({ theme, $index }) => {
    switch ($index) {
      case 0:
        return theme.bgEarn
      case 1:
        return theme.bgRefer
    }
  }};
`

const Wrapper = styled.div`
  ${tw`h-full min-h-[500px] w-full flex flex-row sm:flex-col-reverse rounded-t-bigger`}
  font-family: Montserrat !important;
  background-color: ${({ theme }) => theme.bg9};
`
// const REWARDS_BTN = styled.button`
//   ${tw`w-[111px] h-9 text-xs !font-semibold rounded-circle cursor-pointer text-white
//   border-none border-0 sm:h-[70px] sm:w-full sm:text-regular  sm:rounded-none sm:rounded-t-bigger sm:p-4 sm:mb-32`}
//   background-image: linear-gradient(90deg, #8ade75 0%, #4b831d 100%);
//   line-height: inherit;
// `
// const REWARDS_WITH_IMG = styled.img`
//   ${tw`h-4 w-4 ml-2`}
// `

// const REWARD_BTN_TITLE = styled.span`
//   ${tw`text-smallest font-semibold sm:text-sm`}
//
//   @media (max-width: 500px) {
//     line-height: inherit;
//   }
// `

  return (
    <div css={tw`relative h-[30px] w-[30px]`}>
      <RiveComponent
        style={{
          width: '30px',
          height: '30px'
        }}
      />
      {rewards.user.staking.claimable ||
        (rewards.user.staking.unstakeableTickets.length > 0 && (
          <img css={tw`absolute top-[5px] right-0`} src={'img/assets/red-notification-circle.svg'} />
        ))}
    </div>
  )
}
export const RewardsButton: FC = () => {
  const { mode } = useDarkMode()
  const { rewardToggle } = useRewardToggle()
  const breakpoint = useBreakPoint()
  // const rewardsAnimation = useRiveAnimations({
  //   animation: 'rewards',
  //   autoplay: true,
  //   canvasWidth: breakpoint.isMobile || breakpoint.isTablet ? 31 : 20,
  //   canvasHeight: breakpoint.isMobile || breakpoint.isTablet ? 35 : 22.32
  // })
  // useRiveThemeToggle(rewardsAnimation.rive, 'rewards', 'Rewards')

  const hasRewards = false // TODO: hook into useRewards hook

  // const breakpointWidth = breakpoint.isMobile || breakpoint.isTablet ? 31 : 20
  // const breakpointHeight = breakpoint.isMobile || breakpoint.isTablet ? 35 : 22.32
  const riveComponent = useMemo(
    () => (
      <div css={[tw`relative`]}>
        {/* <RiveAnimationWrapper
          setContainerRef={rewardsAnimation.setContainerRef}
          width={breakpointWidth}
          height={breakpointHeight}
        >
          <rewardsAnimation.RiveComponent />
        </RiveAnimationWrapper> */}

        <img css={breakpoint.isMobile ? [tw`h-[30px]`] : [tw`h-[24px]`]} src={`img/mainnav/rewards-${mode}.svg`} />

        {hasRewards && (
          <img
            css={tw`absolute top-[5px] min-md:top-[1px] right-0`}
            src={'img/assets/red-notification-circle.svg'}
          />
        )}
      </div>
    ),
    [mode, breakpoint, hasRewards]
  )
  const handleClick = useCallback(() => rewardToggle(true), [])
  if (breakpoint.isMobile || breakpoint.isTablet) {
    return <div css={[tw`cursor-pointer`]}>{riveComponent}</div>
  }
  return (
    <div
      css={[
        tw`h-7.5 w-27.5 border-1 border-solid border-grey-1 dark:border-white rounded-full
       bg-grey-5 dark:bg-black-1 pl-1 pr-2.25 py-0.5 flex flex-row items-center gap-1.75 cursor-pointer
       text-tiny font-semibold text-black-4 dark:text-white
       `
      ]}
      onClick={handleClick}
    >
      {riveComponent}
      <span>Rewards</span>
    </div>
  )
}

export const RewardsPopup: FC = () => {
  const [panelIndex, setPanelIndex] = useState(0)

  return (
    <Wrapper>
      <REWARD_INFO>
        <RewardInfoComponent panelIndex={panelIndex}>
          <PanelSelector panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
        </RewardInfoComponent>
      </REWARD_INFO>
      <REWARD_REDIRECT $index={panelIndex}>
        <RewardRedirectComponent panelIndex={panelIndex}>
          <PanelSelector panelIndex={panelIndex} setPanelIndex={setPanelIndex} />
        </RewardRedirectComponent>
      </REWARD_REDIRECT>
    </Wrapper>
  )
}

export default RewardsPopup
