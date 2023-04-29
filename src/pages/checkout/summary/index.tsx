import * as React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PaymentIntent } from '@stripe/stripe-js'
import { useLazyQuery } from '@apollo/client'
import { Box, SimpleGrid, Spinner, Text } from '@chakra-ui/react'

import { Header, SuccessSummary } from '@/components'
import { useCurrency, useRealmUser } from '@/hooks'
import { ORDER_BY_PAYMENT_INTENT } from '@/graphql/queries'
import { OrderType } from '@/types'
import { getCartSubTotal } from '@/helpers/cart'

function Summary() {
  const realmUserContext = useRealmUser()
  const currencyContext = useCurrency()

  const [order, setOrder] = React.useState<OrderType | null>(null)

  const [message, setMessage] = React.useState('')

  const subtotalRef = React.useRef<number | null>(null)

  const router = useRouter()

  const [getOrderDB] = useLazyQuery(ORDER_BY_PAYMENT_INTENT, {
    onCompleted: (data) => {
      if (data?.order && currencyContext?.currency) {
        const subtotal = getCartSubTotal(data.order, currencyContext.currency)
        subtotalRef.current = subtotal ?? null

        setOrder(data.order)
        router.replace('/checkout/summary')
      }
    },
  })

  // Retrieve a specific payment intent by paymentIntent_id
  const retrieveOrder = React.useCallback(async () => {
    try {
      if (!realmUserContext?.currentUser) {
        console.error('No realm user available')
        return
      }

      if (!currencyContext) {
        console.error('Currency context not available')
        return
      }

      const { currentUser } = realmUserContext

      const paymentIntentId = new URLSearchParams(window.location.search).get(
        'payment_intent'
      )

      if (!paymentIntentId) {
        router.push('/shop')
        return
      }

      const intent: PaymentIntent =
        await currentUser.functions.stripe_retrievePaymentIntent(
          paymentIntentId
        )

      if (!intent) {
        router.push('/shop')
        return
      }

      getOrderDB({ variables: { paymentIntentId: intent.id } })

      switch (intent.status) {
        case 'succeeded':
          setMessage('Thank you! Your payment was successful!')
          break
        case 'processing':
          setMessage('Your payment is processing.')
          break
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.')
          break
        default:
          setMessage(
            'Something unusual happened. Please contact Doves and Dandys to check the status of your payment.'
          )
          break
      }

      currencyContext.updateCurrency(intent.currency.toUpperCase())
    } catch (err) {
      console.error(err)
    }
  }, [currencyContext, realmUserContext, getOrderDB, router])

  React.useEffect(() => {
    if (!order) retrieveOrder()
  }, [order, retrieveOrder])

  return (
    <>
      <Head>
        <title>Mel Talbot || Summary</title>
      </Head>

      <Header page='Summary' />

      <SimpleGrid columns={2} justifyItems='center' w='100%' p='1rem 2rem'>
        {order?.orderItems &&
        order.stripeAmountPaid &&
        order.paymentStatus === 'successful' &&
        subtotalRef.current &&
        currencyContext.currency ? (
          <SuccessSummary
            orderItems={order.orderItems}
            currency={currencyContext.currency}
            currencySymbol={'£'}
            subtotal={subtotalRef.current}
            stripeAmountPaid={order.stripeAmountPaid}
          />
        ) : (
          <></>
        )}
        {message ? (
          <Box>
            <Text fontSize='xl' as='b'>
              {message}
            </Text>
            <Text mt={4}>Order Number: {order?.order_id}</Text>
          </Box>
        ) : (
          <Spinner />
        )}
      </SimpleGrid>
    </>
  )
}

export default Summary
