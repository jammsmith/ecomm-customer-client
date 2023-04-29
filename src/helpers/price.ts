import { CurrencyEnum } from '@/enums'
import { ShopProductType } from '@/types'

export const convertStripeAmountToPrice = (amount: number): number => {
  // 50200 --> 502.00

  const stringified = amount.toString()
  const length = stringified.length
  const section1 = stringified.substring(0, length - 2)
  const section2 = stringified.substring(length, length - 2)

  return parseFloat(`${section1}.${section2}`)
}

export const convertPriceToStripeAmount = (price: number): number => {
  // 502.00 --> 50200
  const sections = price.toString().split('.')
  return sections[1]
    ? parseInt(`${sections[0]}${sections[1]}`)
    : parseInt(sections[0])
}

export const toTwoDecimalPlaces = (value: number): number => {
  return parseFloat(value.toFixed(2))
}

export const getCurrencySymbol = (currency: string): string | undefined => {
  const currencyEnum = CurrencyEnum[currency as keyof typeof CurrencyEnum]

  if (!currencyEnum) {
    console.error(`${currency} is not a valid currency`)
    return
  }

  const currencySymbols = {
    GBP: '£',
    USD: '$',
    EUR: '€',
  }
  return currencySymbols[currencyEnum]
}

export const getPriceInCurrency = (
  product: ShopProductType,
  currency: string
): string | undefined => {
  const currencyEnum = CurrencyEnum[currency as keyof typeof CurrencyEnum]

  if (!currencyEnum) {
    console.error(`${currency} is not a valid currency`)
    return
  }

  return `${getCurrencySymbol(currency)}${product[`price${currencyEnum}`]}`
}
