import * as React from 'react'

import { CurrencyContext } from '@/context'
import { CurrencyEnum } from '@/enums'

const useCurrency = () => {
  const currencyContext = React.useContext(CurrencyContext)

  const updateCurrency = (c: string | null): void => {
    if (!currencyContext) {
      console.error('currency context is not available')
      return
    }

    if (c) {
      const currencyEnum = CurrencyEnum[c as keyof typeof CurrencyEnum]

      if (!currencyEnum) {
        console.error(`${c} is not a valid currency`)
        return
      }

      currencyContext.setCurrency(currencyEnum)
    }
  }

  return {
    currency: currencyContext?.currency,
    updateCurrency,
  }
}

export default useCurrency
