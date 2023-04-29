import gql from 'graphql-tag'
import {
  USER_DETAILS,
  ORDER_DETAILS,
  ORDER_ITEM_DETAILS,
  PRODUCT_DETAILS,
  SUBCATEGORY_DETAILS,
  CATEGORY_DETAILS,
  DELIVERY_DETAILS,
  ADDRESS_DETAILS,
} from './fragments'

const mutations = {
  //
  // Users -->
  AddUser: gql`
    ${USER_DETAILS}
    mutation (
      $_id: ObjectId!
      $user_id: String!
      $type: String!
      $email: String
    ) {
      insertOneUser(
        data: { _id: $_id, user_id: $user_id, type: $type, email: $email }
      ) {
        ...UserDetails
      }
    }
  `,
  AddUserWithOrders: gql`
    ${USER_DETAILS}
    ${ORDER_DETAILS}
    ${ORDER_ITEM_DETAILS}
    ${PRODUCT_DETAILS}
    ${DELIVERY_DETAILS}
    ${ADDRESS_DETAILS}
    mutation (
      $_id: ObjectId!
      $user_id: String!
      $firstName: String
      $lastName: String
      $email: String
      $phone: String
      $type: String!
      $orders: [String]
    ) {
      insertOneUser(
        data: {
          _id: $_id
          user_id: $user_id
          firstName: $firstName
          lastName: $lastName
          email: $email
          phone: $phone
          type: $type
          orders: { link: $orders }
        }
      ) {
        ...UserDetails
        orders {
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
    }
  `,
  UpdateUser: gql`
    ${USER_DETAILS}
    ${ORDER_DETAILS}
    ${ORDER_ITEM_DETAILS}
    ${PRODUCT_DETAILS}
    ${ADDRESS_DETAILS}
    mutation (
      $id: ObjectId!
      $firstName: String
      $lastName: String
      $email: String
      $phone: String
      $type: String
    ) {
      updateOneUser(
        query: { _id: $id }
        set: {
          firstName: $firstName
          lastName: $lastName
          email: $email
          phone: $phone
          type: $type
        }
      ) {
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
  `,
  UpdateUserAddresses: gql`
    ${USER_DETAILS}
    ${ORDER_DETAILS}
    ${ORDER_ITEM_DETAILS}
    ${PRODUCT_DETAILS}
    ${ADDRESS_DETAILS}
    mutation ($id: ObjectId!, $addresses: [String!]) {
      updateOneUser(
        query: { _id: $id }
        set: { addresses: { link: $addresses } }
      ) {
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
  `,
  UpdateUserOrders: gql`
    ${USER_DETAILS}
    mutation ($user_id: String!, $orders: [String!]) {
      updateOneUser(
        query: { user_id: $user_id }
        set: { orders: { link: $orders } }
      ) {
        ...UserDetails
      }
    }
  `,
  DeleteUser: gql`
    ${USER_DETAILS}
    mutation ($id: ObjectId!) {
      deleteOneUser(query: { _id: $id }) {
        ...UserDetails
      }
    }
  `,
  // Shop Inventory -->
  UpsertProduct: gql`
    ${PRODUCT_DETAILS}
    mutation (
      $_id: ObjectId
      $product_id: String!
      $name: String!
      $images: [String]!
      $category: String!
      $subCategory: String
      $description: String!
      $path: String!
      $priceGBP: Int!
      $priceUSD: Int!
      $priceEUR: Int!
      $numInStock: Int!
      $deliveryLevel: Int!
    ) {
      upsertProduct(
        input: {
          _id: $_id
          product_id: $product_id
          name: $name
          images: $images
          category: $category
          subCategory: $subCategory
          description: $description
          path: $path
          priceGBP: $priceGBP
          priceUSD: $priceUSD
          priceEUR: $priceEUR
          numInStock: $numInStock
          deliveryLevel: $deliveryLevel
        }
      ) {
        ...ProductDetails
      }
    }
  `,
  DeleteProduct: gql`
    mutation ($product_id: String!) {
      deleteProduct(input: $product_id) {
        productId
        isDeleted
      }
    }
  `,
  UpsertSubCategory: gql`
    ${SUBCATEGORY_DETAILS}
    mutation (
      $_id: ObjectId
      $subCategory_id: String!
      $name: String!
      $description: String!
      $image: String!
      $category: String!
      $path: String!
    ) {
      upsertSubCategory(
        input: {
          _id: $_id
          subCategory_id: $subCategory_id
          name: $name
          description: $description
          image: $image
          category: $category
          path: $path
        }
      ) {
        ...SubCategoryDetails
      }
    }
  `,
  DeleteSubCategory: gql`
    mutation ($subCategory_id: String!) {
      deleteSubCategory(input: $subCategory_id) {
        subCategoryId
        isDeleted
      }
    }
  `,
  UpsertCategory: gql`
    ${CATEGORY_DETAILS}
    mutation (
      $_id: ObjectId
      $category_id: String!
      $name: String!
      $description: String!
      $image: String!
      $path: String!
    ) {
      upsertCategory(
        input: {
          _id: $_id
          category_id: $category_id
          name: $name
          description: $description
          image: $image
          path: $path
        }
      ) {
        ...CategoryDetails
      }
    }
  `,
  DeleteCategory: gql`
    ${CATEGORY_DETAILS}
    mutation ($category_id: String!) {
      deleteOneCategory(query: { category_id: $category_id }) {
        ...CategoryDetails
      }
    }
  `,
  //
  // Orders ->
  CreateGuestOrder: gql`
    ${USER_DETAILS}
    ${PRODUCT_DETAILS}
    ${ORDER_DETAILS}
    ${ORDER_ITEM_DETAILS}
    mutation (
      $order_id: String!
      $user_ObjectId: ObjectId!
      $user_id: String!
      $orderItem_id: String!
      $product_id: String!
      $dateCreated: DateTime!
    ) {
      insertOneOrder(
        data: {
          order_id: $order_id
          orderStatus: "pendingInCart"
          paymentStatus: "notAttempted"
          dateCreated: $dateCreated
          customer: {
            link: "user_id"
            create: {
              _id: $user_ObjectId
              user_id: $user_id
              type: "GUEST"
              orders: { link: [$order_id] }
            }
          }
          orderItems: {
            link: ["orderItem_id"]
            create: [
              {
                orderItem_id: $orderItem_id
                quantity: 1
                order: { link: $order_id }
                product: { link: $product_id }
              }
            ]
          }
        }
      ) {
        customer {
          ...UserDetails
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
    }
  `,
  CreateOrderForExistingCustomer: gql`
    ${USER_DETAILS}
    ${PRODUCT_DETAILS}
    ${ORDER_DETAILS}
    ${ORDER_ITEM_DETAILS}
    mutation (
      $order_id: String!
      $user_id: String!
      $orderItem_id: String!
      $product_id: String!
      $dateCreated: DateTime!
    ) {
      insertOneOrder(
        data: {
          order_id: $order_id
          orderStatus: "pendingInCart"
          paymentStatus: "notAttempted"
          dateCreated: $dateCreated
          customer: { link: $user_id }
          orderItems: {
            link: ["orderItem_id"]
            create: [
              {
                orderItem_id: $orderItem_id
                quantity: 1
                order: { link: $order_id }
                product: { link: $product_id }
              }
            ]
          }
        }
      ) {
        ...OrderDetails
        customer {
          ...UserDetails
          orders {
            ...OrderDetails
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
  `,
  CreateNewOrderItem: gql`
    ${ORDER_ITEM_DETAILS}
    ${ORDER_DETAILS}
    ${PRODUCT_DETAILS}
    mutation (
      $orderItem_id: String!
      $order_id: String!
      $product_id: String!
      $info: String
      $quantity: Int = 1
    ) {
      insertOneOrderItem(
        data: {
          orderItem_id: $orderItem_id
          info: $info
          quantity: $quantity
          order: { link: $order_id }
          product: { link: $product_id }
        }
      ) {
        ...OrderItemDetails
        order {
          ...OrderDetails
        }
        product {
          ...ProductDetails
        }
      }
    }
  `,
  UpdateOrder: gql`
    ${ORDER_DETAILS}
    ${ORDER_ITEM_DETAILS}
    ${PRODUCT_DETAILS}
    mutation (
      $id: ObjectId!
      $extraInfo: String
      $paymentIntentId: String
      $orderStatus: String
      $paymentStatus: String
      $dateCreated: DateTime
      $datePaid: DateTime
      $dateAccepted: DateTime
      $dateDispatched: DateTime
      $currency: String
    ) {
      updateOneOrder(
        query: { _id: $id }
        set: {
          extraInfo: $extraInfo
          paymentIntentId: $paymentIntentId
          orderStatus: $orderStatus
          paymentStatus: $paymentStatus
          dateCreated: $dateCreated
          datePaid: $datePaid
          dateAccepted: $dateAccepted
          dateDispatched: $dateDispatched
          currency: $currency
        }
      ) {
        ...OrderDetails
        orderItems {
          ...OrderItemDetails
          product {
            ...ProductDetails
          }
        }
      }
    }
  `,
  DeleteOrder: gql`
    ${ORDER_DETAILS}
    mutation ($id: ObjectId!) {
      deleteOneOrder(query: { _id: $id }) {
        ...OrderDetails
      }
    }
  `,
  UpdateItemInOrder: gql`
    ${ORDER_ITEM_DETAILS}
    ${ORDER_DETAILS}
    ${PRODUCT_DETAILS}
    mutation ($id: ObjectId!, $info: String, $quantity: Int) {
      updateOneOrderItem(
        query: { _id: $id }
        set: { info: $info, quantity: $quantity }
      ) {
        ...OrderItemDetails
        order {
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
  `,
  DeleteOrderItem: gql`
    ${ORDER_ITEM_DETAILS}
    mutation ($orderItem_id: String!) {
      deleteOneOrderItem(query: { orderItem_id: $orderItem_id }) {
        ...OrderItemDetails
      }
    }
  `,
  UpdateOrderItemsInOrder: gql`
    ${ORDER_ITEM_DETAILS}
    ${ORDER_DETAILS}
    ${PRODUCT_DETAILS}
    mutation ($order_id: String!, $orderItems: [String!]) {
      updateOneOrder(
        query: { order_id: $order_id }
        set: { orderItems: { link: $orderItems } }
      ) {
        ...OrderDetails
        orderItems {
          ...OrderItemDetails
          product {
            ...ProductDetails
          }
        }
      }
    }
  `,
  // Addresses ->
  CreateAddress: gql`
    ${ADDRESS_DETAILS}
    mutation (
      $address_id: String!
      $line1: String!
      $line2: String
      $city: String!
      $county: String!
      $postcode: String!
      $country: String = "UK"
      $isDefault: Boolean = false
    ) {
      insertOneAddress(
        data: {
          address_id: $address_id
          line1: $line1
          line2: $line2
          city: $city
          county: $county
          postcode: $postcode
          country: $country
          isDefault: $isDefault
        }
      ) {
        ...AddressDetails
      }
    }
  `,
  UpdateAddress: gql`
    ${ADDRESS_DETAILS}
    mutation (
      $address_id: String!
      $line1: String
      $line2: String
      $city: String
      $county: String
      $postcode: String
      $country: String
      $isDefault: Boolean
    ) {
      updateOneAddress(
        query: { address_id: $address_id }
        set: {
          line1: $line1
          line2: $line2
          city: $city
          county: $county
          postcode: $postcode
          country: $country
          isDefault: $isDefault
        }
      ) {
        ...AddressDetails
      }
    }
  `,
  //
  // Deliveries -->
  AddDeliveryDetailsToOrder: gql`
    ${ORDER_DETAILS}
    ${DELIVERY_DETAILS}
    mutation (
      $order_id: String!
      $delivery_id: String!
      $firstName: String!
      $lastName: String!
      $email: String!
      $address_id: String
      $phone: String
      $price: Int
    ) {
      updateOneOrder(
        query: { order_id: $order_id }
        set: {
          delivery: {
            link: "delivery_id"
            create: {
              delivery_id: $delivery_id
              firstName: $firstName
              lastName: $lastName
              email: $email
              phone: $phone
              price: $price
              address: { link: $address_id }
            }
          }
        }
      ) {
        ...OrderDetails
        delivery {
          ...DeliveryDetails
        }
      }
    }
  `,
  AddPickUpDetailsToOrder: gql`
    ${ORDER_DETAILS}
    ${DELIVERY_DETAILS}
    mutation (
      $order_id: String!
      $delivery_id: String!
      $firstName: String!
      $lastName: String!
      $email: String!
      $phone: String
    ) {
      updateOneOrder(
        query: { order_id: $order_id }
        set: {
          delivery: {
            link: "delivery_id"
            create: {
              delivery_id: $delivery_id
              firstName: $firstName
              lastName: $lastName
              email: $email
              phone: $phone
            }
          }
        }
      ) {
        ...OrderDetails
        delivery {
          ...DeliveryDetails
        }
      }
    }
  `,
}

export default mutations
