import * as React from 'react'

import { DbUserContext, RealmUserContext } from '@/realm-apollo-client'
import { getCartSubTotal } from '@/helpers/cart'
import {
  DbUserContextType,
  OrderType,
  CurrencyContextType,
  OrderContextType,
  RealmUserContextType,
} from '@/types'
import { CurrencyEnum, DeliveryZoneEnum } from '@/enums'
import { CurrencyContext } from '.'
import countries from './countries.json'

interface OrderContextProviderProps {
  children: React.ReactNode
}

export const OrderContext = React.createContext<OrderContextType | null>(null)

export const OrderContextProvider = ({
  children,
}: OrderContextProviderProps) => {
  const dbUserContext: DbUserContextType | null =
    React.useContext(DbUserContext)
  const realmUserContext: RealmUserContextType | null =
    React.useContext(RealmUserContext)
  const currencyContext: CurrencyContextType | null =
    React.useContext(CurrencyContext)

  const [activeOrder, setActiveOrder] = React.useState<OrderType | null>(null)
  const [subtotal, setSubtotal] = React.useState<number>(0)
  const [deliveryCountry, setDeliveryCountry] = React.useState<string>('GB')
  const [deliveryPrice, setDeliveryPrice] = React.useState<number>(0)

  const deliveryZone = React.useRef<DeliveryZoneEnum>(DeliveryZoneEnum.uk)

  const dbUser = dbUserContext?.dbUser || null
  const realmUser = realmUserContext?.realmUser || null
  const currency = currencyContext?.currency || CurrencyEnum.GBP

  const getActiveOrder = React.useCallback(async () => {
    if (!activeOrder || !Object.keys(activeOrder).length) {
      if (realmUser && dbUser) {
        const userActiveOrder = await realmUser.functions.db_getActiveOrder(
          dbUser.user_id
        )
        if (userActiveOrder !== activeOrder) {
          setActiveOrder(userActiveOrder)
        }
      }
    }
  }, [realmUser, dbUser, activeOrder])

  const getDeliveryPrice = React.useCallback(async () => {
    if (realmUser && activeOrder) {
      const requestedCountry = countries.find(
        (item) => item.isoCode === deliveryCountry
      )

      if (requestedCountry) {
        const price = await realmUser.functions.helper_getDeliveryPrice(
          currency,
          requestedCountry.deliveryZone,
          activeOrder.orderItems
        )

        deliveryZone.current =
          DeliveryZoneEnum[
            requestedCountry.deliveryZone as keyof typeof DeliveryZoneEnum
          ]

        setDeliveryPrice(price)
      }
    }
  }, [deliveryCountry, deliveryZone, activeOrder, realmUser, currency])

  // Set the subtotal whenever the order is updated
  React.useEffect(() => {
    if (!activeOrder) getActiveOrder()
    else if (
      activeOrder &&
      activeOrder.orderItems &&
      activeOrder.orderItems.length
    ) {
      const subtotal = getCartSubTotal(activeOrder, currency)
      setSubtotal(subtotal || 0)
    } else {
      setSubtotal(0)
    }
  }, [activeOrder, getActiveOrder, currency])

  // Set the delivery price whenever the delivery country is updated
  React.useEffect(() => {
    if (deliveryCountry && deliveryCountry.length) getDeliveryPrice()
  }, [getDeliveryPrice, deliveryCountry])

  const orderContext: OrderContextType = {
    activeOrder,
    setActiveOrder,
    subtotal,
    deliveryCountry,
    setDeliveryCountry,
    deliveryPrice,
    deliveryZone: deliveryZone.current,
  }

  return (
    <OrderContext.Provider value={orderContext}>
      {children}
    </OrderContext.Provider>
  )
}
