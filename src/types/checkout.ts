import { StripeElementStatusEnum } from '@/enums'

export type StripeInputStatusType = {
  addressEl: StripeElementStatusEnum
  paymentEl: StripeElementStatusEnum
}
