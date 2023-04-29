import * as React from 'react'
import { useMutation } from '@apollo/client'
import { PaymentIntent } from '@stripe/stripe-js'
import { useElements, useStripe } from '@stripe/react-stripe-js'

import mutations from '@/graphql/mutations'
import { OrderContext, CurrencyContext } from '@/context'
import { RealmAppContext } from '@/realm-apollo-client'
import { getFreeDeliveryConstraints } from '@/helpers/offers'

type PaymentRequestType = {
  error: string | null
  status: string
  submit: (email: string) => (e: React.SyntheticEvent) => Promise<void>
}

const usePaymentRequest = (
  paymentIntent: PaymentIntent
): PaymentRequestType => {
  const app = React.useContext(RealmAppContext)
  const orderContext = React.useContext(OrderContext)
  const currencyContext = React.useContext(CurrencyContext)

  const [requestStatus, setRequestStatus] = React.useState('NOT_REQUESTED')

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  const [updateOrder] = useMutation(mutations.UpdateOrder)
  const [createAddress] = useMutation(mutations.CreateAddress)
  const [addDeliveryDetailsToOrder] = useMutation(
    mutations.AddDeliveryDetailsToOrder
  )

  // Submit a payment request
  const submitPaymentRequest =
    (email: string) =>
    async (e: React.SyntheticEvent): Promise<void> => {
      try {
        e.preventDefault()

        if (
          !stripe ||
          !elements ||
          !app ||
          !app.currentUser ||
          !paymentIntent ||
          !orderContext ||
          !orderContext.activeOrder ||
          !currencyContext ||
          !currencyContext.currency
        ) {
          return
        }

        setRequestStatus('PROCESSING')

        // Get address from Stripe AddressEl
        const addressEl = elements.getElement('address')

        if (!addressEl) {
          setRequestStatus('FAILED')
          setErrorMessage(
            'Payment unsuccessful. You have not been charged - please refresh the page and try again.'
          )
          console.error(
            '[submitPaymentRequest] exiting early. Could not find Stripe Address Element'
          )
          return
        }

        const { complete: addressComplete, value: addressValue } =
          await addressEl.getValue()

        if (!addressComplete) {
          setRequestStatus('FAILED')
          setErrorMessage(
            'Payment unsuccessful. Delivery details are not complete.'
          )
          console.error(
            '[submitPaymentRequest] exiting early. Delivery details are not complete.'
          )
          return
        }

        // Seperate address and delivery fields
        const addressFields = {
          line1: addressValue.address.line1,
          line2: addressValue.address.line2,
          city: addressValue.address.city,
          county: addressValue.address.state,
          postcode: addressValue.address.postal_code,
          country: addressValue.address.country,
        }
        const deliveryFields = {
          firstName: addressValue.firstName,
          lastName: addressValue.lastName,
          email: email,
          phone: addressValue.phone,
          price: 999, // need to change this!!!
        }

        // make sure payment intent is up-to-date with any changes
        const updatedTotals =
          await app.currentUser.functions.stripe_updatePaymentTotals(
            paymentIntent.id,
            orderContext.activeOrder.orderItems,
            'uk', // deliveryZone.current,
            currencyContext.currency,
            getFreeDeliveryConstraints()
          )

        deliveryFields.price = updatedTotals ? updatedTotals.deliveryTotal : 0

        // Update additional order info
        const variables = {
          id: orderContext.activeOrder._id,
          currency: currencyContext.currency,
          paymentIntentId: paymentIntent.id,
        }

        await updateOrder({ variables })

        // Add delivery address details and update user if necessary
        const buildId = (type: string) => `${type}-${self.crypto.randomUUID()}`

        const address_id = buildId('address')

        await Promise.resolve([
          // Add a new address
          createAddress({
            variables: {
              address_id,
              ...addressFields,
            },
          }),
          // Create a delivery with a link to the address and assign to the order
          addDeliveryDetailsToOrder({
            variables: {
              order_id: orderContext.activeOrder.order_id,
              delivery_id: buildId('delivery'),
              address_id,
              ...deliveryFields,
            },
          }),
        ])

        // Confirm payment with Stripe
        const { error: stripeError } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location}/summary`,
          },
        })

        // This will only be reached if an error has occurred.  Show the error
        // in a message for the customer. Otherwise, customer is redirected to 'return_url'
        if (
          (stripeError.type === 'card_error' ||
            stripeError.type === 'validation_error') &&
          stripeError.message
        ) {
          setRequestStatus('FAILED')
          setErrorMessage(stripeError.message)
        } else {
          setRequestStatus('FAILED')
          setErrorMessage(
            'An unexpected error occured. Please feel free to get in touch to check your order status'
          )
        }
      } catch (err) {
        setRequestStatus('FAILED')
        setErrorMessage(
          'An unexpected error occured. Please feel free to get in touch to check your order status'
        )
        console.error(err)
      }
    }

  return {
    error: errorMessage,
    status: requestStatus,
    submit: submitPaymentRequest,
  }
}

export default usePaymentRequest
