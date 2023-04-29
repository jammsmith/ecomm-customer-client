import { DeliveryZoneEnum } from '@/enums'
import { ShopProductType } from './inventory'
import { DbUserType } from './user'

export type RefundType = {
  _id: string
  refund_id: string
  amount: number
  date: Date
  reason: string
  status: string
}

export type OrderItemType = {
  _id: string
  orderItem_id: string
  quantity: number
  info: string
  product: ShopProductType
}

export type OrderType = {
  _id: string
  order_id: string
  customer: DbUserType
  orderStatus: string
  paymentIntentId: string
  paymentStatus: string
  orderItems: Array<OrderItemType>
  refunds: Array<RefundType>
  stripeAmountPaid?: number
  dateCreated?: Date
  datePaid?: Date
  dateAccepted?: Date
  dateDispatched?: Date
  delivery?: string // DeliveryType
  extraInfo?: string
}

export type OrderContextType = {
  activeOrder: OrderType | null
  setActiveOrder: React.Dispatch<React.SetStateAction<OrderType | null>>
  subtotal: number
  deliveryCountry: string
  setDeliveryCountry: React.Dispatch<React.SetStateAction<string>>
  deliveryPrice: number
  deliveryZone: DeliveryZoneEnum | null
}
