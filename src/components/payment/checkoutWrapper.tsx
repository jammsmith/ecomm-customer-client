import * as React from 'react'
import { Box, Button, HStack, VStack, Text } from '@chakra-ui/react'
import { HiOutlineTruck, HiOutlineCreditCard } from 'react-icons/hi2'
import { PaymentIntent } from '@stripe/stripe-js'

import {
  Accordion,
  AddressInput,
  PaymentInput,
  OrderSummary,
} from '@/components'
import { StripeInputStatusType, OrderItemType } from '@/types'
import { usePaymentRequest } from '@/hooks'
import { StripeElementStatusEnum, CurrencyEnum } from '@/enums'
import { getCurrencySymbol } from '@/helpers/price'

interface CheckoutWrapperProps {
  checkoutItems: Array<OrderItemType>
  currency: CurrencyEnum
  deliveryPrice: number
  subtotal: number
  paymentIntent: PaymentIntent
  updateDeliveryCountry: React.Dispatch<React.SetStateAction<string>>
}

const CheckoutWrapper: React.FC<CheckoutWrapperProps> = ({
  checkoutItems,
  currency,
  deliveryPrice,
  subtotal,
  paymentIntent,
  updateDeliveryCountry,
}) => {
  const paymentRequest = usePaymentRequest(paymentIntent)

  const [email, setEmail] = React.useState<string>('')

  const [StripeInputStatus, setStripeInputStatus] =
    React.useState<StripeInputStatusType>({
      addressEl: StripeElementStatusEnum.LOADING,
      paymentEl: StripeElementStatusEnum.LOADING,
    })

  const submitActive: boolean =
    StripeInputStatus.addressEl === StripeElementStatusEnum.COMPLETE &&
    StripeInputStatus.paymentEl === StripeElementStatusEnum.COMPLETE &&
    paymentRequest.status !== 'PROCESSING'

  const currencySymbol = currency ? getCurrencySymbol(currency) : '£'

  return currencySymbol ? (
    <VStack align='center' mb={6}>
      <HStack w='100%' p='1rem 2rem' gap={12} align='flex-start'>
        <Box w='50%'>
          <OrderSummary
            checkoutItems={checkoutItems}
            currency={currency}
            currencySymbol={currencySymbol}
            deliveryPrice={deliveryPrice}
            subtotal={subtotal}
          />
        </Box>
        <Box w='50%'>
          <Accordion
            defaultIndex={0}
            id='checkout-accordion'
            items={[
              {
                content: (
                  <AddressInput
                    email={email}
                    status={StripeInputStatus}
                    updateEmail={setEmail}
                    updateStatus={setStripeInputStatus}
                    updateDeliveryCountry={updateDeliveryCountry}
                  />
                ),
                minHeight: '612.2px',
                status: StripeInputStatus.addressEl,
                title: 'Delivery Details',
                titleIcon: HiOutlineTruck,
              },
              {
                content: (
                  <>
                    <PaymentInput
                      status={StripeInputStatus}
                      updateStatus={setStripeInputStatus}
                    />
                    {paymentRequest.status === 'FAILED' &&
                      paymentRequest.error && (
                        <Text
                          color='brand.error'
                          as='b'
                          position='relative'
                          top='0.5rem'
                          fontSize='sm'
                        >
                          {paymentRequest.error}
                        </Text>
                      )}
                  </>
                ),
                status: StripeInputStatus.paymentEl,
                title: 'Payment Details',
                titleIcon: HiOutlineCreditCard,
              },
            ]}
          />
        </Box>
      </HStack>
      <Button
        variant='primary'
        w='calc(100% - 4rem)'
        isDisabled={!submitActive}
        isLoading={paymentRequest.status === 'PROCESSING'}
        onClick={paymentRequest.submit(email)}
      >
        submit payment
      </Button>
    </VStack>
  ) : (
    <></>
  )
}

export default CheckoutWrapper
