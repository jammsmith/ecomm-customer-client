import * as React from 'react'
import Image from 'next/image'
import { HStack, SimpleGrid, VStack, Text } from '@chakra-ui/react'

import { getPriceInCurrency, convertStripeAmountToPrice } from '@/helpers/price'
import { OrderItemType } from '@/types'
import { CurrencyEnum } from '@/enums'

interface SuccessSummaryProps {
  orderItems: Array<OrderItemType>
  currency: CurrencyEnum
  currencySymbol: string
  subtotal: number
  stripeAmountPaid: number
}

const SuccessSummary: React.FC<SuccessSummaryProps> = ({
  orderItems,
  currency,
  currencySymbol,
  subtotal,
  stripeAmountPaid,
}) => {
  return (
    <SimpleGrid pb={4} alignSelf='start' gap={6} w='100%'>
      {orderItems.map((oi, i) => (
        <HStack
          key={`checkoutItem-${i}`}
          justify='space-between'
          align='flex-end'
        >
          <HStack justify='space-between' align='flex-end'>
            <Image
              src={oi.product.images?.[0]}
              alt={oi.product.name}
              height={150}
              width={150}
            />
            <Text as='b' maxWidth={150}>
              {oi.product.name}
            </Text>
          </HStack>
          <VStack align='start' w={150}>
            <HStack justify='space-between' w='100%'>
              <Text>Qty:</Text>
              <Text>{oi.quantity}</Text>
            </HStack>
            <HStack justify='space-between' w='100%'>
              <Text>Unit Price:</Text>
              <Text>{getPriceInCurrency(oi.product, currency || 'GBP')}</Text>
            </HStack>
            <HStack justify='space-between' w='100%'>
              <Text as='b'>Item Total:</Text>
              <Text as='b'>
                {currencySymbol}
                {Number(
                  currency
                    ? oi.product[`price${currency}`]
                    : oi.product.priceGBP
                ) * oi.quantity}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      ))}
      <VStack
        align='flex-end'
        borderTop='1px solid'
        borderColor='brand.disabled'
        pt={4}
      >
        <HStack w={150} justify='space-between'>
          <Text>Subtotal:</Text>
          <Text>
            {currencySymbol}
            {subtotal}
          </Text>
        </HStack>
        <HStack w={150} justify='space-between'>
          <Text>Delivery:</Text>
          <Text>{currencySymbol} --</Text>
        </HStack>
        <HStack w={150} justify='space-between'>
          <Text fontSize='xl' as='b'>
            Total Paid:
          </Text>
          <Text fontSize='xl' as='b'>
            {currencySymbol}
            {convertStripeAmountToPrice(stripeAmountPaid)}
          </Text>
        </HStack>
      </VStack>
    </SimpleGrid>
  )
}

export default SuccessSummary
