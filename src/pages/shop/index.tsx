import * as React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { Fade } from '@chakra-ui/react'

import {
  ShopCategoryType,
  ShopProductType,
  ApolloQueryResponseType,
} from '@/types'
import { ALL_CATEGORIES, OFFSET_PRODUCTS } from '@/graphql/queries'
import apolloClient from '@/realm-apollo-client'
import { Header, ProductBanner } from '@/components'

interface ShopProps {
  initialProducts: Record<string, Array<ShopProductType>>
}

const Shop: React.FC<ShopProps> = ({ initialProducts = {} }) => {
  return (
    <>
      <Head>
        <title>Mel Talbot || Shop</title>
      </Head>
      <Header page='Shop' />
      {Object.entries(initialProducts).map(
        ([type, products]) =>
          type &&
          products && (
            <Fade key={`product-banner--${type}`} in>
              <ProductBanner items={products} />
            </Fade>
          )
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const {
    data: { categories },
  } = await apolloClient.query({
    query: ALL_CATEGORIES,
  })

  const categoryNames: Array<string> = []

  const initialProductsQueries = categories.map((cat: ShopCategoryType) => {
    categoryNames.push(cat.name)

    return apolloClient.query({
      query: OFFSET_PRODUCTS,
      variables: {
        category: cat.name,
        offset: 0,
        limit: 4,
      },
    })
  })

  const initialProductsResponse: Array<ApolloQueryResponseType> =
    await Promise.all(initialProductsQueries)

  const initialProducts = initialProductsResponse.reduce((acc, item, index) => {
    if (item) {
      const value = Object.values(item.data)[0]

      if (value && categoryNames.length >= index) {
        acc[categoryNames[index].toLowerCase()] = value
      }
    }
    return acc
  }, {} as Record<string, Array<ShopProductType>>)

  // cache categories up to 10 mins
  res.setHeader('Cache-Control', process.env.CACHE_CONTROL_INVENTORY || '')

  return {
    props: {
      initialProducts,
    },
  }
}

export default Shop
