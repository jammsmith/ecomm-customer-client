import * as React from 'react'
import Image from 'next/image'
import { HStack, SimpleGrid, VStack, Text } from '@chakra-ui/react'

import { getPriceInCurrency } from '@/helpers/price'
import { OrderItemType } from '@/types'
import { CurrencyEnum } from '@/enums'

interface OrderSummaryProps {
  checkoutItems: Array<OrderItemType>
  currency: CurrencyEnum
  currencySymbol: string
  deliveryPrice: number
  subtotal: number
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  checkoutItems,
  currency,
  currencySymbol,
  deliveryPrice,
  subtotal,
}) => {
  return (
    <SimpleGrid pb={4} alignSelf='start' gap={6} w='100%'>
      {checkoutItems.map((ci, i) => (
        <HStack
          key={`checkoutItem-${i}`}
          justify='space-between'
          align='flex-end'
        >
          <HStack justify='space-between' align='flex-end'>
            <Image
              src={ci.product.images?.[0]}
              alt={ci.product.name}
              height={150}
              width={150}
            />
            <Text as='b' maxWidth={150}>
              {ci.product.name}
            </Text>
          </HStack>
          <VStack align='start' w={150}>
            <HStack justify='space-between' w='100%'>
              <Text>Qty:</Text>
              <Text>{ci.quantity}</Text>
            </HStack>
            <HStack justify='space-between' w='100%'>
              <Text>Unit Price:</Text>
              <Text>{getPriceInCurrency(ci.product, currency || 'GBP')}</Text>
            </HStack>
            <HStack justify='space-between' w='100%'>
              <Text as='b'>Item Total:</Text>
              <Text as='b'>
                {currencySymbol}
                {Number(
                  currency
                    ? ci.product[`price${currency}`]
                    : ci.product.priceGBP
                ) * ci.quantity}
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
          <Text>
            {currencySymbol}
            {deliveryPrice}
          </Text>
        </HStack>
        <HStack w={150} justify='space-between'>
          <Text fontSize='xl' as='b'>
            Total:
          </Text>
          <Text fontSize='xl' as='b'>
            {currencySymbol}
            {subtotal + deliveryPrice}
          </Text>
        </HStack>
      </VStack>
    </SimpleGrid>
  )
}

export default OrderSummary
