import { gql } from '@apollo/client'

import {
  USER_DETAILS,
  CATEGORY_DETAILS,
  SUBCATEGORY_DETAILS,
  PRODUCT_DETAILS,
  ORDER_DETAILS,
  ORDER_ITEM_DETAILS,
  DELIVERY_DETAILS,
  ADDRESS_DETAILS,
  REFUND_DETAILS,
} from './fragments'

// Users
export const SINGLE_USER = gql`
  ${USER_DETAILS}
  query ($id: ObjectId!) {
    user(query: { _id: $id }) {
      ...UserDetails
    }
  }
`

export const SINGLE_USER_BY_EMAIL = gql`
  ${USER_DETAILS}
  query ($email: String!) {
    user(query: { email: $email }) {
      ...UserDetails
    }
  }
`

export const USER_DETAILED = gql`
  ${USER_DETAILS}
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}
  ${PRODUCT_DETAILS}
  ${ADDRESS_DETAILS}
  query ($id: ObjectId!) {
    user(query: { _id: $id }) {
      ...UserDetails
      addresses {
        ...AddressDetails
      }
      orders {
        ...OrderDetails
        orderItems {
          ...OrderItemDetails
          product {
            ...ProductDetails
          }
        }
      }
    }
  }
`

// Shop Categories
export const SINGLE_CATEGORY = gql`
  ${CATEGORY_DETAILS}
  ${SUBCATEGORY_DETAILS}
  query ($categoryId: String!) {
    category(query: { category_id: $categoryId }) {
      ...CategoryDetails
      subCategories {
        ...SubCategoryDetails
      }
    }
  }
`

export const SINGLE_CATEGORY_BY_NAME = gql`
  ${CATEGORY_DETAILS}
  ${SUBCATEGORY_DETAILS}
  query ($name: String!) {
    category(query: { name: $name }) {
      ...CategoryDetails
      subCategories {
        ...SubCategoryDetails
      }
    }
  }
`

export const SINGLE_CATEGORY_BY_PATH = gql`
  ${CATEGORY_DETAILS}
  ${SUBCATEGORY_DETAILS}
  query ($path: String!) {
    category(query: { path: $path }) {
      ...CategoryDetails
      subCategories {
        ...SubCategoryDetails
      }
    }
  }
`

export const ALL_CATEGORIES = gql`
  ${CATEGORY_DETAILS}
  query {
    categories {
      ...CategoryDetails
    }
  }
`

export const CATEGORY_SEARCH = gql`
  ${CATEGORY_DETAILS}
  query ($name: String) {
    categorySearch(input: $name) {
      ...CategoryDetails
    }
  }
`

export const ALL_CATEGORIES_AND_SUBCATEGORIES = gql`
  ${CATEGORY_DETAILS}
  ${SUBCATEGORY_DETAILS}
  query {
    categories {
      ...CategoryDetails
      subCategories {
        ...SubCategoryDetails
      }
    }
  }
`

export const SINGLE_SUBCATEGORY_BY_NAME = gql`
  ${SUBCATEGORY_DETAILS}
  ${PRODUCT_DETAILS}
  query ($name: String!, $category: String!) {
    subCategory(query: { AND: [{ name: $name }, { category: $category }] }) {
      ...SubCategoryDetails
      products {
        ...ProductDetails
      }
    }
  }
`

export const SINGLE_SUBCATEGORY_BY_PATH = gql`
  ${SUBCATEGORY_DETAILS}
  ${PRODUCT_DETAILS}
  query ($path: String!) {
    subCategory(query: { path: $path }) {
      ...SubCategoryDetails
      products {
        ...ProductDetails
      }
    }
  }
`

export const SINGLE_SUBCATEGORY = gql`
  ${SUBCATEGORY_DETAILS}
  ${PRODUCT_DETAILS}
  query ($subCategoryId: String!) {
    subCategory(query: { subCategory_id: $subCategoryId }) {
      ...SubCategoryDetails
      products {
        ...ProductDetails
      }
    }
  }
`

export const ALL_SUBCATEGORIES = gql`
  ${SUBCATEGORY_DETAILS}
  query {
    subCategories {
      ...SubCategoryDetails
    }
  }
`

export const SUBCATEGORY_SEARCH = gql`
  ${SUBCATEGORY_DETAILS}
  query ($name: String) {
    subCategorySearch(input: $name) {
      ...SubCategoryDetails
    }
  }
`

// Shop products
export const SINGLE_PRODUCT = gql`
  ${PRODUCT_DETAILS}
  query ($_id: ObjectId, $productId: String) {
    product(query: { _id: $_id, product_id: $productId }) {
      ...ProductDetails
    }
  }
`

export const ALL_PRODUCTS = gql`
  ${PRODUCT_DETAILS}
  query {
    products {
      ...ProductDetails
    }
  }
`

export const OFFSET_PRODUCTS = gql`
  ${PRODUCT_DETAILS}
  query ($category: String!, $offset: Int!, $limit: Int!) {
    offsetProducts(
      input: { category: $category, offset: $offset, limit: $limit }
    ) {
      ...ProductDetails
    }
  }
`

export const PRODUCTS_SEARCH = gql`
  ${PRODUCT_DETAILS}
  query ($name: String) {
    productSearch(input: $name) {
      ...ProductDetails
    }
  }
`

// Orders
export const SINGLE_ORDER_DETAILED = gql`
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}
  ${PRODUCT_DETAILS}
  ${USER_DETAILS}
  ${DELIVERY_DETAILS}
  ${ADDRESS_DETAILS}
  ${REFUND_DETAILS}
  query ($orderId: String!) {
    order(query: { order_id: $orderId }) {
      ...OrderDetails
      delivery {
        ...DeliveryDetails
        address {
          ...AddressDetails
        }
      }
      customer {
        ...UserDetails
      }
      orderItems {
        ...OrderItemDetails
        product {
          ...ProductDetails
        }
      }
      refunds {
        ...RefundDetails
      }
    }
  }
`

export const SINGLE_ORDER_BASIC = gql`
  ${ORDER_DETAILS}
  query ($id: ObjectId!) {
    order(query: { _id: $id }) {
      ...OrderDetails
    }
  }
`

export const ORDER_BY_PAYMENT_INTENT = gql`
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}
  ${PRODUCT_DETAILS}
  ${DELIVERY_DETAILS}
  ${ADDRESS_DETAILS}
  query ($paymentIntentId: String!) {
    order(query: { paymentIntentId: $paymentIntentId }) {
      ...OrderDetails
      delivery {
        ...DeliveryDetails
        address {
          ...AddressDetails
        }
      }
      orderItems {
        ...OrderItemDetails
        product {
          ...ProductDetails
        }
      }
    }
  }
`

export const ALL_ORDERS = gql`
  ${ORDER_DETAILS}
  query {
    orders {
      ...OrderDetails
    }
  }
`

export const ADMIN_ACTIVE_ORDERS = gql`
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}
  ${PRODUCT_DETAILS}
  ${USER_DETAILS}
  query {
    orders(
      query: {
        AND: [
          {
            OR: [{ paymentStatus: "successful" }, { paymentStatus: "refunded" }]
          }
          { orderStatus_ne: "archived" }
        ]
      }
      sortBy: DATEPAID_DESC
    ) {
      ...OrderDetails
      orderItems {
        ...OrderItemDetails
        product {
          ...ProductDetails
        }
      }
      customer {
        ...UserDetails
      }
    }
  }
`

export const ADMIN_ARCHIVED_ORDERS = gql`
  ${ORDER_DETAILS}
  ${ORDER_ITEM_DETAILS}
  ${PRODUCT_DETAILS}
  ${USER_DETAILS}
  query {
    orders(query: { orderStatus: "archived" }, sortBy: DATEPAID_DESC) {
      ...OrderDetails
      orderItems {
        ...OrderItemDetails
        product {
          ...ProductDetails
        }
      }
      customer {
        ...UserDetails
      }
    }
  }
`

export const DELIVERY_BY_ID = gql`
  ${DELIVERY_DETAILS}
  query ($delivery_id: String!) {
    delivery(query: { delivery_id: $delivery_id }) {
      ...DeliveryDetails
    }
  }
`

export const ADDRESSES_BY_ID = gql`
  ${ADDRESS_DETAILS}
  query ($addressIds: [String]!) {
    addresses(query: { address_id_in: $addressIds }) {
      ...AddressDetails
    }
  }
`

export default {
  ALL_CATEGORIES,
}
