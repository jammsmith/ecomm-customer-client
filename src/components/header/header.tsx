import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Flex, Icon, useDisclosure } from '@chakra-ui/react'
import { HiOutlineShoppingCart } from 'react-icons/hi2'
import { OnChangeValue } from 'react-select'

import Select from '../select/select'
import { getCurrencySymbol } from '../../helpers/price'
import s from './header.module.scss'
import { PageEnum, CurrencyEnum } from '@/enums'
import { useClassNames, useOrder, useCurrency } from '@/hooks'
import { Cart } from '../'

interface HeaderProps {
  page: string
  subtitle?: string
}

const Header: React.FC<HeaderProps> = ({ page, subtitle }) => {
  const c = useClassNames('header', s)

  const orderContext = useOrder()
  const currencyContext = useCurrency()

  const {
    isOpen: cartOpen,
    onOpen: onOpenCart,
    onClose: onCloseCart,
  } = useDisclosure()

  const pageEnum = PageEnum[page as keyof typeof PageEnum]

  if (!pageEnum) {
    console.error(`Prop { page=${page} } is not a valid PageEnum`)
    return <></>
  }

  type CurrencyOption = {
    label: string
    value: CurrencyEnum
  }

  const currencyOptions: Array<CurrencyOption> = Object.keys(CurrencyEnum).map(
    (key) => ({
      label: `${getCurrencySymbol(key)}`,
      value: CurrencyEnum[key as keyof typeof CurrencyEnum],
    })
  )

  const cartItems = orderContext?.activeOrder?.orderItems || []

  return (
    <div className={c()}>
      <div className={c(['linkGroup'])}>
        <Link href='/shop' className={c(['linkGroup', 'link'])}>
          Shop
        </Link>
        <Link href='/about' className={c(['linkGroup', 'link'])}>
          About
        </Link>
        <Link href='/contact' className={c(['linkGroup', 'link'])}>
          Contact
        </Link>
      </div>
      <Link href='/' className={c(['logo'])}>
        <Image
          src='/images/melon-logo.png'
          height={116}
          width={143}
          alt='Melon logo'
        />
      </Link>
      <div className={c(['currency'])}>
        <Select
          onChange={(option: OnChangeValue<any, false>) => {
            if (option?.value) {
              currencyContext.updateCurrency(option.value)
            }
          }}
          options={currencyOptions}
          value={
            {
              label: currencyContext?.currency,
              value: currencyContext?.currency,
            } as CurrencyOption
          }
        />
      </div>
      <div className={c(['cart'])}>
        <Button variant='primary' onClick={onOpenCart} mr={4}>
          <Flex align='center' gap='0.5rem'>
            <Icon
              as={HiOutlineShoppingCart}
              boxSize='1.25rem'
              fontWeight='bold'
            />
            {cartItems.length !== 0 && <span>({cartItems.length})</span>}
          </Flex>
        </Button>
        <Cart isOpen={cartOpen} onClose={onCloseCart} />
      </div>
      <div
        className={c(
          ['banner'],
          [{ type: 'shop', condition: pageEnum !== 'Home' }]
        )}
      >
        {pageEnum === 'Home' && (
          <>
            <h1
              className={c(
                ['banner', 'heroText'],
                [{ type: 'underline', condition: true }]
              )}
            >
              Artist and Climbing Instructor.
            </h1>
            <Link href='/shop'>
              <Button variant='primary' size='xl'>
                Visit My Shop
              </Button>
            </Link>
          </>
        )}
        {pageEnum === 'About' && <></>}
        {pageEnum === 'Contact' && (
          <h1 className={c(['banner', 'heroText'])}>
            Melon’s Ceramics are created and fired in her home in South
            Yorkshire.
          </h1>
        )}
        {pageEnum === 'Shop' && (
          <h1 className={c(['banner', 'heroText'])}>
            Please Select Products from below, and questions or queries please
            don’t hesitate to ask.
          </h1>
        )}
        {pageEnum === 'Category' && (
          <h1 className={c(['banner', 'heroText'])}>{subtitle}</h1>
        )}
      </div>
    </div>
  )
}

export default Header
