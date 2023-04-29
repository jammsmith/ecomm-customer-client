import * as React from 'react'
import {
  Accordion as ChakraAccordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { HiCheck } from 'react-icons/hi2'

import { StripeElementStatusEnum } from '@/enums'

interface AccItem {
  content: React.ReactNode
  minHeight?: string
  status?: StripeElementStatusEnum
  title: string
  titleIcon?: IconType
}

interface AccordionProps {
  defaultIndex: number
  id: string
  items: Array<AccItem>
}

const Accordion: React.FC<AccordionProps> = ({ defaultIndex, id, items }) => {
  return (
    <ChakraAccordion allowMultiple defaultIndex={[defaultIndex]}>
      {items.map((item, i) => (
        <AccordionItem key={`${id}-item--${i}`}>
          <h2>
            <AccordionButton>
              <Flex
                as='span'
                flex='1'
                align='center'
                justify='flex-start'
                gap={4}
              >
                <Icon as={item.titleIcon} />
                <Text as='b'>{item.title}</Text>
              </Flex>
              {item.status === StripeElementStatusEnum.COMPLETE && (
                <Flex
                  as='span'
                  align='center'
                  justify='center'
                  gap={2}
                  color='brand.success'
                  mr={4}
                >
                  <Text as='b'>Complete</Text>
                  <Icon as={HiCheck} />
                </Flex>
              )}
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} minHeight={item.minHeight}>
            {item.content}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </ChakraAccordion>
  )
}

export default Accordion
