import * as React from 'react'
import { PaymentElement, useElements } from '@stripe/react-stripe-js'

import { StripeElementStatusEnum } from '@/enums'
import { StripeInputStatusType } from '@/types'

interface PaymentInputProps {
  status: StripeInputStatusType
  updateStatus: React.Dispatch<React.SetStateAction<StripeInputStatusType>>
}

const PaymentInput: React.FC<PaymentInputProps> = ({
  status,
  updateStatus,
}) => {
  const elements = useElements()

  React.useEffect(() => {
    if (elements) {
      const paymentEl = elements.getElement('payment')

      if (paymentEl) {
        paymentEl.on('ready', () => {
          updateStatus((s) => ({
            ...s,
            paymentEl: StripeElementStatusEnum.READY,
          }))
        })

        paymentEl.on('change', (e) => {
          const isCompleteCurrent = Boolean(
            status.paymentEl === StripeElementStatusEnum.COMPLETE
          )

          if (e.complete !== isCompleteCurrent) {
            updateStatus((s) => ({
              ...s,
              paymentEl: e.complete
                ? StripeElementStatusEnum.COMPLETE
                : StripeElementStatusEnum.READY,
            }))
          }
        })
      }
    }
  }, [elements, status, updateStatus])

  if (!elements) {
    console.error(
      'Cannot access stripe elements (make sure component is wrapped in a StripeLoader)'
    )
    return <></>
  }

  return <PaymentElement />
}

export default PaymentInput
