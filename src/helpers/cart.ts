import { OrderType, OrderItemType } from '@/types'
import { CurrencyEnum } from '@/enums'

export const getCartSubTotal = (
  order: OrderType,
  currency: string
): number | void => {
  let subTotal

  const currencyEnum = CurrencyEnum[currency as keyof typeof CurrencyEnum]

  if (!currencyEnum) {
    console.error(`${currency} is not a valid currency`)
    return
  }

  const productTotals = order.orderItems.map(
    (item: OrderItemType) =>
      Number(item.quantity) * Number(item.product[`price${currencyEnum}`])
  )

  if (productTotals) {
    subTotal = productTotals.reduce((acc, curr) => acc + curr)
  }

  return subTotal
}
