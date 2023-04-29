import * as React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { Box, Center, Fade, SimpleGrid, Spinner } from '@chakra-ui/react'
import { useLazyQuery } from '@apollo/client'

import { Header, ShopNav, ProductCard } from '@/components'
import { ShopCategoryType, ShopSubCategoryType, ShopProductType } from '@/types'
import { SINGLE_CATEGORY_BY_PATH, OFFSET_PRODUCTS } from '@/graphql/queries'
import apolloClient from '@/realm-apollo-client'
import { capitalise } from '@/helpers/text'

interface CategoryProps {
  category: ShopCategoryType
  subCategories: Array<ShopSubCategoryType>
  initialProducts: Array<ShopProductType>
}

enum pageStatusEnum {
  'idle',
  'loading',
  'error',
}

const Category: React.FC<CategoryProps> = ({
  category,
  subCategories,
  initialProducts,
}) => {
  // State
  const [filter, setFilter] = React.useState<string>('all')

  const [productLimit, setProductLimit] = React.useState<number>(12)

  const [products, setProducts] =
    React.useState<Array<ShopProductType>>(initialProducts)

  const [pageStatus, setPageStatus] =
    React.useState<keyof typeof pageStatusEnum>('idle')

  // Queries
  const [getNextProducts] = useLazyQuery(OFFSET_PRODUCTS, {
    onCompleted: (data) => {
      if (data && data.offsetProducts && data.offsetProducts.length) {
        setProducts([...products, ...data.offsetProducts])
      }
      setPageStatus('idle')
    },
    onError: () => {
      setPageStatus('error')
    },
  })

  // Effects
  React.useEffect(() => {
    if (productLimit && productLimit > 12) {
      setPageStatus('loading')

      getNextProducts({
        variables: {
          category: category.name,
          offset: productLimit - 12,
          limit: 12,
        },
      })
    }
  }, [productLimit, category, getNextProducts])

  // Setup props
  let filterOptions = subCategories.map(({ name }) => name)
  filterOptions.unshift('all')

  const filteredProducts: Record<
    string,
    Array<ShopProductType>
  > = React.useMemo(() => {
    const productsBySC = subCategories.reduce((acc, sc, i) => {
      if (!sc || !sc.name) return acc

      acc[sc.name] = products.filter((p) => sc.name === p.subCategory)

      return acc
    }, {} as Record<string, Array<ShopProductType>>)

    return { all: products, ...productsBySC }
  }, [subCategories, products])

  return (
    <>
      <Head>
        <title>{`Shop || ${category.name}`}</title>
      </Head>
      <Header
        page='Category'
        subtitle={`Category specific subtitle for ${category.name}`}
      />
      <ShopNav
        activeFilter={filter}
        currentPath={category.path}
        filterOptions={filterOptions}
        title={category.name}
        type='Category'
        updateFilter={setFilter}
      />
      <Fade in>
        <SimpleGrid minChildWidth='300px' spacing='1rem' m='1rem'>
          {filteredProducts[filter].map((p, i) => (
            <ProductCard
              key={p._id}
              isLast={Number(productLimit) - 5 === i}
              product={p}
              updateProductLimit={() => setProductLimit(productLimit + 12)}
            />
          ))}
        </SimpleGrid>
      </Fade>
      {pageStatus === 'loading' && (
        <Center>
          <Spinner
            color='brand.primaryHover'
            size='lg'
            thickness='4px'
            speed='0.65s'
            emptyColor='brand.primary'
            m='4'
          />
        </Center>
      )}
      {pageStatus === 'error' && (
        <Box bg='tomato' w='100%' p={4} color='white' textAlign='center'>
          Failed to load next products. Please refresh the page or feel free to
          get in touch to let me know!
        </Box>
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
  resolvedUrl,
}) => {
  const categoryResponse = await apolloClient.query({
    query: SINGLE_CATEGORY_BY_PATH,
    variables: {
      path: resolvedUrl,
    },
  })

  const productsResponse =
    params && params.category && typeof params.category === 'string'
      ? await apolloClient.query({
          query: OFFSET_PRODUCTS,
          variables: {
            category: capitalise(params.category),
            offset: 0,
            limit: 12,
          },
        })
      : { data: { offsetProducts: [] } }

  res.setHeader('Cache-Control', process.env.CACHE_CONTROL_INVENTORY || '')

  const { subCategories, ...category } = categoryResponse.data.category

  return {
    props: {
      category,
      subCategories,
      initialProducts: productsResponse.data.offsetProducts,
    },
  }
}

export default Category
