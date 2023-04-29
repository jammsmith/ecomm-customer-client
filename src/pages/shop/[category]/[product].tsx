import * as React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import {
  SimpleGrid,
  Flex,
  Heading,
  Text,
  Stack,
  Button,
} from '@chakra-ui/react'

import apolloClient from '@/realm-apollo-client'
import { SINGLE_PRODUCT } from '@/graphql/queries'
import { ShopProductType } from '@/types'
import { Header, ShopNav } from '@/components'
import { useCurrency, useOrder } from '@/hooks'
import { getPriceInCurrency } from '@/helpers/price'

interface ProductProps {
  product: ShopProductType
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [activeImage, setActiveImage] = React.useState<number>(0)

  const orderContext = useOrder()
  const currencyContext = useCurrency()

  const isInCart = !!orderContext?.activeOrder?.orderItems?.find(
    (oi) => oi?.product?.product_id === product.product_id
  )

  return (
    <>
      <Head>
        <title>{`Shop || ${product.name}`}</title>
      </Head>
      <Header page='Product' />
      <ShopNav currentPath={product.path} title={product.name} type='Product' />
      <SimpleGrid
        columns={2}
        h='500px'
        w='calc(100% - 2rem)'
        mt={0}
        mb={6}
        ml={4}
        mr={4}
      >
        <Flex h='500px'>
          <Image
            alt={product.name}
            src={product.images[activeImage]}
            height={500}
            width={500}
            style={{ width: '500px', height: '500px' }}
          />
          <SimpleGrid columns={1} gap={2} ml={2} overflowY='scroll'>
            {product.images.map((img, i) => (
              <Image
                key={img}
                alt={product.name}
                src={img}
                height={150}
                width={150}
                style={{
                  cursor: 'pointer',
                  width: '119px',
                  height: '119px',
                }}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </SimpleGrid>
        </Flex>
        <Flex direction='column' gap={4} justifyContent='space-between'>
          <Stack>
            <Heading>{product.name}</Heading>
            <Text fontSize='lg'>{product.description}</Text>
            {product.numInStock === 0 ? (
              <Text color='brand.error' fontSize='lg'>
                Out of Stock - please get in touch of you would like to request
                this item
              </Text>
            ) : (
              <Text color='brand.primary' fontSize='lg'>
                In Stock Now!
              </Text>
            )}
            <Text fontSize='2xl'>
              {getPriceInCurrency(product, currencyContext?.currency || 'GBP')}
            </Text>
          </Stack>
          <Button
            isDisabled={isInCart || product.numInStock === 0}
            onClick={() => orderContext?.addProductToOrder(product.product_id)}
            variant='primary'
          >
            {isInCart ? 'Item In Cart!' : 'Add To Cart'}
          </Button>
        </Flex>
      </SimpleGrid>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  res,
  resolvedUrl,
}) => {
  const urlSections = resolvedUrl.split('/')
  const _id = urlSections[urlSections.length - 1]

  const { data } = await apolloClient.query({
    query: SINGLE_PRODUCT,
    variables: {
      _id,
    },
  })

  res.setHeader('Cache-Control', process.env.CACHE_CONTROL_INVENTORY || '')

  return {
    props: {
      product: data.product,
    },
  }
}

export default Product
