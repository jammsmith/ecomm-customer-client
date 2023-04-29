import * as React from 'react'

import { CurrencyEnum } from '@/enums'
import { CurrencyContextType } from '@/types'

interface CurrencyContextProviderProps {
  children: React.ReactNode
}

export const CurrencyContext = React.createContext<CurrencyContextType | null>(
  null
)

export const CurrencyContextProvider = ({
  children,
}: CurrencyContextProviderProps) => {
  const [currency, setCurrency] = React.useState<CurrencyEnum>(CurrencyEnum.GBP)

  const url = 'https://ipapi.co/json/'

  const getLocale = React.useCallback(async () => {
    const response = await window.fetch(url)
    return await response.json()
  }, [url])

  const getLocaleCurrency = React.useCallback(async () => {
    const locale = await getLocale()

    switch (locale.continent_code) {
      case 'EU':
        setCurrency(
          locale.country_code === 'GB' ? CurrencyEnum.GBP : CurrencyEnum.EUR
        )
        break
      case 'NA':
        setCurrency(CurrencyEnum.USD)
        break
      default:
    }
  }, [getLocale])

  React.useEffect(() => {
    getLocaleCurrency()
  }, [getLocaleCurrency])

  const currencyContext: CurrencyContextType = {
    currency,
    setCurrency,
  }

  return (
    <CurrencyContext.Provider value={currencyContext}>
      {children}
    </CurrencyContext.Provider>
  )
}
