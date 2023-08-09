import { FC, useState } from 'react'
import { faqs } from './constants'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../context'
import { checkMobile } from '../../utils'

const FAQ_WRAPPER = styled.div`
  ${tw`sm:w-[calc(100% - 15px)]`}
  .faqs {
    ${tw`flex flex-row cursor-pointer items-center h-[52px] sm:h-14 p-3.75 w-full
     border border-solid dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`}
  }
  .last-faq {
    ${tw`!border-0`}
  }
  .faq-open {
    ${tw`!border-0 !pb-0`}
  }
  .faq-answer {
    ${tw`px-6 pb-3 mt-[10px] text-tiny font-medium dark:text-grey-2 text-grey-1 border border-solid 
    dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`}
    transition: transform 500ms ease-out;
  }
  .faq-answer:last-child {
    ${tw`!border-0`}
  }
  a:hover {
    ${tw`text-white`}
  }
  .invertArrow {
    transform: rotate(180deg);
    transition: transform 500ms ease-out;
  }
  .dontInvert {
    transition: transform 500ms ease-out;
  }
  .doc-link {
    ${tw`dark:text-white text-black font-semibold underline`}
  }
  .doc-link:hover {
    ${tw`dark:text-white text-black`}
  }
`

export const Faqs: FC = () => (
  <FAQ_WRAPPER>
    <div tw="flex flex-row items-center mt-5">
      <h2 tw="mr-auto text-[30px] font-semibold dark:text-grey-5 text-black-4 sm:text-lg sm:pl-2">
        {checkMobile() ? 'FAQs' : 'Frequently Asked Questions'}
      </h2>
      <a
        tw="w-[140px] h-[35px] bg-blue-1 mb-5 cursor-pointer text-white font-semibold
         text-average flex flex-row justify-center items-center rounded-circle sm:w-1/3 sm:text-tiny"
        href="https://docs.goosefx.io/features/farm/single-sided-liquidity-pools"
        target="_blank"
        rel="noreferrer"
      >
        Go To Docs
      </a>
    </div>
    <div tw="rounded-[18px] dark:bg-black-2 bg-white ">
      {faqs.map((item, index) => (
        <FaqRow item={item} key={index} index={index} />
      ))}
    </div>
  </FAQ_WRAPPER>
)

export const FaqRow: FC<{ item; index }> = ({ item, index }) => {
  const { mode } = useDarkMode()
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false)
  const lastElement = index === faqs.length - 1

  return (
    <>
      <div
        className={`faqs ${isFaqOpen ? 'faq-open' : ''} ${lastElement ? 'last-faq' : ''}`}
        onClick={() => {
          setIsFaqOpen((prev) => !prev)
        }}
      >
        <div tw="mr-auto font-semibold text-average dark:text-grey-5 text-black-4 sm:text-regular">
          {item.question}
        </div>
        <img
          src={`/img/assets/arrow-down-${mode}.svg`}
          alt="arrow-icon"
          className={isFaqOpen ? 'invertArrow' : 'dontInvert'}
        />
      </div>

      <div
        css={[
          tw`duration-300`,
          isFaqOpen
            ? tw`h-[fit] text-tiny px-3.75 pb-3.75 font-medium dark:text-grey-2 text-grey-1 border 
            border-solid dark:border-black-4 border-grey-4 border-r-0 border-t-0 border-l-0`
            : tw`h-0 !text-[0px] invisible opacity-0 `,
          lastElement && tw`!border-0`
        ]}
      >
        {item.answer}
      </div>
    </>
  )
}