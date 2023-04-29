import * as React from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Icon,
  Flex,
  HStack,
  VStack,
  StackDivider,
  SimpleGrid,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { HiMinus, HiOutlineTrash, HiPlus } from 'react-icons/hi2'

import { getCurrencySymbol, getPriceInCurrency } from '@/helpers/price'
import { useCurrency, useOrder } from '@/hooks'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const router = useRouter()

  const orderContext = useOrder()
  const currencyContext = useCurrency()

  const cartItems = orderContext?.activeOrder?.orderItems || []

  const subtotal = orderContext?.subtotal || 0

  return (
    <>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='md'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Cart</DrawerHeader>

          <DrawerBody>
            {!orderContext ||
              (!currencyContext && (
                <Flex align='center' justify='center' h='100%' w='100%'>
                  <Spinner color='brand.primary' />
                </Flex>
              ))}
            {orderContext && currencyContext && !cartItems.length && (
              <Flex align='center' justify='center' h='100%' w='100%'>
                Nothing to show yet!
              </Flex>
            )}
            {orderContext && currencyContext && cartItems.length && (
              <VStack
                divider={<StackDivider borderColor='brand.disabled' />}
                align='space-between'
                spacing={4}
              >
                {cartItems.length ? (
                  cartItems.map((ci, i) => (
                    <VStack key={`cart-item-${i}`} align='space-between'>
                      <SimpleGrid columns={2}>
                        <VStack align='start' spacing={2}>
                          <Text noOfLines={1} as='b'>
                            {ci.product.name}
                          </Text>
                          <Text noOfLines={1} fontSize='sm'>
                            Unit price:{' '}
                            {currencyContext.currency &&
                              getPriceInCurrency(
                                ci.product,
                                currencyContext.currency
                              )}
                          </Text>
                        </VStack>
                        <VStack align='end' spacing={2}>
                          <Text noOfLines={1} as='b'>
                            {currencyContext.currency
                              ? getCurrencySymbol(currencyContext.currency)
                              : '£'}
                            {Number(
                              currencyContext.currency
                                ? ci.product[`price${currencyContext.currency}`]
                                : ci.product.priceGBP
                            ) * ci.quantity}
                          </Text>
                          <Text noOfLines={1} fontSize='sm'>
                            Qty: {ci.quantity}
                          </Text>
                        </VStack>
                      </SimpleGrid>
                      <HStack justify='center'>
                        <Button
                          isDisabled={orderContext.status === 'inProgress'}
                          onClick={orderContext.updateOrderItemQuantity(
                            'ADD',
                            ci.orderItem_id
                          )}
                        >
                          <Icon as={HiPlus} color='brand.secondary' />
                        </Button>
                        <Button
                          isDisabled={orderContext.status === 'inProgress'}
                          onClick={orderContext.updateOrderItemQuantity(
                            'SUBTRACT',
                            ci.orderItem_id
                          )}
                        >
                          <Icon as={HiMinus} color='brand.secondary' />
                        </Button>
                        <Button
                          isDisabled={orderContext.status === 'inProgress'}
                          onClick={orderContext.removeOrderItem(
                            ci.orderItem_id
                          )}
                        >
                          <Icon as={HiOutlineTrash} color='brand.secondary' />
                        </Button>
                      </HStack>
                    </VStack>
                  ))
                ) : (
                  <></>
                )}
              </VStack>
            )}
          </DrawerBody>

          <DrawerFooter w='100%'>
            <Button
              isDisabled={
                !cartItems.length || orderContext?.status === 'inProgress'
              }
              onClick={() => {
                onClose()
                router.push('/checkout')
              }}
              variant='primary'
              w='100%'
            >
              Checkout{' '}
              {subtotal > 0 &&
                `${
                  currencyContext.currency
                    ? getCurrencySymbol(currencyContext.currency)
                    : '£'
                }${subtotal}`}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Cart
