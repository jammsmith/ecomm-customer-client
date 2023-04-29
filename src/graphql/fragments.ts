import { gql } from '@apollo/client'

export const USER_DETAILS = gql`
  fragment UserDetails on User {
    _id
    user_id
    firstName
    lastName
    email
    phone
    type
  }
`

export const CATEGORY_DETAILS = gql`
  fragment CategoryDetails on Category {
    _id
    category_id
    description
    image
    name
    path
  }
`

export const SUBCATEGORY_DETAILS = gql`
  fragment SubCategoryDetails on SubCategory {
    _id
    subCategory_id
    category
    description
    image
    name
    path
  }
`

export const PRODUCT_DETAILS = gql`
  fragment ProductDetails on Product {
    _id
    product_id
    category
    description
    images
    name
    numInStock
    path
    priceGBP
    priceUSD
    priceEUR
    deliveryLevel
    category
    subCategory
  }
`

export const ORDER_DETAILS = gql`
  fragment OrderDetails on Order {
    _id
    order_id
    extraInfo
    paymentIntentId
    orderStatus
    paymentStatus
    dateCreated
    datePaid
    dateAccepted
    dateDispatched
    stripeAmountPaid
    currency
  }
`

export const ORDER_ITEM_DETAILS = gql`
  fragment OrderItemDetails on OrderItem {
    _id
    orderItem_id
    info
    quantity
  }
`

export const DELIVERY_DETAILS = gql`
  fragment DeliveryDetails on Delivery {
    _id
    delivery_id
    firstName
    lastName
    email
    phone
    price
  }
`

export const ADDRESS_DETAILS = gql`
  fragment AddressDetails on Address {
    _id
    address_id
    line1
    line2
    city
    county
    postcode
    country
    isDefault
  }
`

export const REFUND_DETAILS = gql`
  fragment RefundDetails on Refund {
    _id
    refund_id
    amount
    reason
    date
    status
  }
`
