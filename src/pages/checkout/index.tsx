import * as React from 'react'
import Head from 'next/head'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, Appearance, PaymentIntent } from '@stripe/stripe-js'

import appearance from '../../components/payment/stripeElementStyles.json'
import { Header, CheckoutWrapper } from '@/components'
import { useOrder, useCurrency, useRealmUser } from '@/hooks'
import { Text } from '@chakra-ui/react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!)

function Checkout() {
  const realmUserContext = useRealmUser()
  const orderContext = useOrder()
  const currencyContext = useCurrency()

  const [stripeReady, setStripeReady] = React.useState(false)

  const paymentIntentRef = React.useRef<PaymentIntent | null>(null)

  const checkoutItems = orderContext?.activeOrder?.orderItems || null

  // Get a new payment intent if one does not already exist, or retrieve the existing one if it does -->
  const getPaymentIntent = React.useCallback(async () => {
    try {
      if (
        realmUserContext?.currentUser &&
        currencyContext?.currency &&
        orderContext?.activeOrder?.orderItems
      ) {
        const pi: PaymentIntent =
          await realmUserContext.currentUser.functions.stripe_createPaymentIntent(
            {
              ...orderContext.activeOrder,
              currency: currencyContext.currency,
            }
          )

        if (pi && !paymentIntentRef.current?.client_secret) {
          paymentIntentRef.current = pi
          setStripeReady(true)
        }
      }
    } catch (err) {
      console.error('Failed to create payment intent', err)
    }
  }, [paymentIntentRef, realmUserContext, orderContext, currencyContext])

  React.useEffect(() => {
    getPaymentIntent()
  }, [getPaymentIntent])

  return (
    <>
      <Head>
        <title>Mel Talbot || Checkout</title>
      </Head>
      <Header page='Checkout' />

      {!checkoutItems?.length && <Text>No products in cart yet!</Text>}

      {stripeReady &&
        paymentIntentRef.current?.client_secret &&
        orderContext &&
        orderContext.updateDeliveryCountry &&
        checkoutItems &&
        currencyContext &&
        currencyContext.currency && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentIntentRef.current.client_secret,
              appearance: appearance as Appearance,
            }}
          >
            <CheckoutWrapper
              checkoutItems={checkoutItems}
              currency={currencyContext.currency}
              deliveryPrice={orderContext.deliveryPrice}
              subtotal={orderContext.subtotal || 0}
              paymentIntent={paymentIntentRef.current}
              updateDeliveryCountry={orderContext.updateDeliveryCountry}
            />
          </Elements>
        )}
    </>
  )
}

export default Checkout
