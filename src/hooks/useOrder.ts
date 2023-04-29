import * as React from 'react'
import { useMutation, useLazyQuery } from '@apollo/client'

import mutations from '@/graphql/mutations'
import { ORDER_BY_PAYMENT_INTENT } from '@/graphql/queries'
import { OrderContext, CurrencyContext } from '@/context'
import { DbUserContext, RealmUserContext } from '@/realm-apollo-client'
import { OrderType } from '@/types'

enum StatusEnum {
  IDLE = 'idle',
  IN_PROGRESS = 'inProgress',
  FAILED = 'failed',
}

const useOrder = () => {
  // State
  const [status, setStatus] = React.useState<StatusEnum>(StatusEnum.IDLE)

  // Order mutations
  const [createGuestOrder] = useMutation(mutations.CreateGuestOrder)
  const [createOrderForExistingCustomer] = useMutation(
    mutations.CreateOrderForExistingCustomer
  )
  const [createNewOrderItem] = useMutation(mutations.CreateNewOrderItem)
  const [updateOrderItemsInOrder] = useMutation(
    mutations.UpdateOrderItemsInOrder
  )
  const [updateUserOrders] = useMutation(mutations.UpdateUserOrders)
  const [deleteOrderItem] = useMutation(mutations.DeleteOrderItem)
  const [updateItemInOrder] = useMutation(mutations.UpdateItemInOrder)

  // Consume context
  const orderContext = React.useContext(OrderContext)
  const dbUserContext = React.useContext(DbUserContext)
  const realmUserContext = React.useContext(RealmUserContext)
  const currencyContext = React.useContext(CurrencyContext)

  // Lazy query to retrieve order details after a payment request
  const [updateActiveOrder] = useLazyQuery(ORDER_BY_PAYMENT_INTENT, {
    onCompleted: (data) => {
      if (data?.order) orderContext?.setActiveOrder(data.order)
    },
  })

  if (!realmUserContext) {
    console.error('No Realm User available')
    return
  }

  const userType = dbUserContext?.dbUser?.type || 'ANON'

  // Handlers
  const addProductToOrder = async (product_id: string) => {
    setStatus(StatusEnum.IN_PROGRESS)

    // -- User has previously been added to DB and has an active order -- //
    if (
      (userType === 'GUEST' || userType === 'CUSTOMER') &&
      orderContext?.activeOrder?.order_id
    ) {
      try {
        const { activeOrder } = orderContext

        const newOrderItemId = `orderItem-${self.crypto.randomUUID()}`

        await createNewOrderItem({
          variables: {
            orderItem_id: newOrderItemId,
            order_id: activeOrder.order_id,
            product_id,
          },
        })

        const orderItemIds = activeOrder.orderItems.map(
          (item) => item.orderItem_id
        )

        orderItemIds.push(newOrderItemId)

        const { data } = await updateOrderItemsInOrder({
          variables: {
            order_id: activeOrder.order_id,
            orderItems: orderItemIds,
          },
        })

        orderContext.setActiveOrder(data.updateOneOrder)

        setStatus(StatusEnum.IDLE)
      } catch (err) {
        setStatus(StatusEnum.FAILED)

        console.error(`Failed to add item to existing order. Error: ${err}`)
      }
    }

    // -- User has previously been added to DB but has no active order -- //
    if (
      (userType === 'GUEST' || userType === 'CUSTOMER') &&
      orderContext &&
      !orderContext.activeOrder?.order_id
    ) {
      try {
        const newOrderId: string =
          await realmUserContext.realmUser?.functions.helper_createOrderId()

        const newOrderItemId = `orderItem-${self.crypto.randomUUID()}`

        const { data } = await createOrderForExistingCustomer({
          variables: {
            order_id: newOrderId,
            user_id: dbUserContext?.dbUser?.user_id,
            orderItem_id: newOrderItemId,
            product_id: product_id,
            dateCreated: new Date(Date.now()),
          },
        })

        const existingOrderIds: Array<string> =
          data.insertOneOrder.customer.orders.map(
            (order: OrderType) => order.order_id
          )

        await updateUserOrders({
          variables: {
            user_id: dbUserContext?.dbUser?.user_id,
            orders: [...existingOrderIds, newOrderId],
          },
        })

        orderContext.setActiveOrder(data.insertOneOrder)

        setStatus(StatusEnum.IDLE)
      } catch (err) {
        setStatus(StatusEnum.FAILED)

        console.error(
          `Failed to add new order for existing customer. Error: ${err}`
        )
      }
    }

    // -- Only an anonymous Realm user -- //
    if (
      userType === 'ANON' &&
      realmUserContext?.realmUser &&
      orderContext &&
      dbUserContext
    ) {
      try {
        const { realmUser } = realmUserContext

        const newOrderId = await realmUser.functions.helper_createOrderId()
        const newOrderItemId = `orderItem-${self.crypto.randomUUID()}`
        const newUserId = `user-${self.crypto.randomUUID()}`

        const { data } = await createGuestOrder({
          variables: {
            order_id: newOrderId,
            user_ObjectId: realmUser.id,
            user_id: newUserId,
            orderItem_id: newOrderItemId,
            product_id: product_id,
            dateCreated: new Date(Date.now()),
          },
        })

        orderContext.setActiveOrder(data.insertOneOrder.customer.orders[0])

        dbUserContext.setDbUser(data.insertOneOrder.customer)

        setStatus(StatusEnum.IDLE)
      } catch (err) {
        setStatus(StatusEnum.FAILED)

        console.error(`Failed to create guest order. Error: ${err}`)
      }
    }
  }

  const removeOrderItem =
    (orderItem_id: string) =>
    async (e?: React.MouseEvent<HTMLButtonElement>) => {
      try {
        if (e) e.preventDefault()

        if (
          !orderContext ||
          !orderContext.activeOrder ||
          !orderContext.activeOrder.orderItems
        ) {
          console.error('No active order available to update')
          return
        }

        const orderItemIds = orderContext.activeOrder.orderItems
          .filter((oi) => oi.orderItem_id !== orderItem_id)
          .map((oi) => oi.orderItem_id)

        await deleteOrderItem({
          variables: {
            orderItem_id: orderItem_id,
          },
        })

        const { data } = await updateOrderItemsInOrder({
          variables: {
            order_id: orderContext.activeOrder.order_id,
            orderItems: orderItemIds,
          },
        })

        orderContext.setActiveOrder(data.updateOneOrder)
      } catch (err) {
        console.error('Failed to delete item from order', err)
      }
    }

  enum QtyUpdateTypeEnum {
    ADD = 'ADD',
    SUBTRACT = 'SUBTRACT',
  }

  const updateOrderItemQuantity =
    (updateType: string, orderItem_id: string) =>
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        e.preventDefault()

        if (
          !orderContext ||
          !orderContext.activeOrder ||
          !orderContext.activeOrder.orderItems
        ) {
          console.error('No active order available to update')
          return
        }

        const type =
          QtyUpdateTypeEnum[updateType as keyof typeof QtyUpdateTypeEnum]

        if (!type) {
          console.error(`${updateType} is not a valid update type`)
          return
        }

        const oi = orderContext.activeOrder.orderItems.find(
          (oi) => oi.orderItem_id === orderItem_id
        )

        if (!oi) {
          console.error(`No order item with orderItem_id: ${orderItem_id}`)
          return
        }

        let qty = Number(oi.quantity)

        if (type === 'ADD') qty += 1
        if (type === 'SUBTRACT') qty -= 1

        if (qty !== 0) {
          const { data } = await updateItemInOrder({
            variables: {
              id: oi._id,
              quantity: qty,
            },
          })

          orderContext.setActiveOrder(data.updateOneOrderItem.order)
        } else {
          removeOrderItem(orderItem_id)()
        }
      } catch (err) {
        console.error('Failed to update item in order', err)
      }
    }

  // Retrieve a specific payment intent by paymentIntent_id
  const updateActiveOrderAfterStripeRedirect = async () => {
    try {
      if (!realmUserContext?.realmUser) {
        console.error('No realm user available')
        return
      }

      if (!orderContext) {
        console.error('Order context not available')
        return
      }

      if (!currencyContext) {
        console.error('Currency context not available')
        return
      }

      const { realmUser } = realmUserContext

      const paymentIntentId = new URLSearchParams(window.location.search).get(
        'payment_intent'
      )

      if (paymentIntentId) {
        const intent = await realmUser.functions.stripe_retrievePaymentIntent(
          paymentIntentId
        )

        currencyContext.setCurrency(intent.currency.toUpperCase())

        updateActiveOrder({
          variables: { paymentIntentId: intent.id },
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    activeOrder: orderContext?.activeOrder || null,
    addProductToOrder,
    deliveryPrice: orderContext?.deliveryPrice || 0,
    updateActiveOrderAfterStripeRedirect,
    updateDeliveryCountry: orderContext?.setDeliveryCountry || null,
    updateOrderItemQuantity,
    removeOrderItem,
    setActiveOrder: orderContext?.setActiveOrder,
    status,
    subtotal: orderContext?.subtotal || null,
  }
}

export default useOrder
