import * as React from 'react'
import { Box, Flex, Heading, Spacer, Link } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

import { ProductCardBasic } from '../'
import { ShopProductType } from '@/types'

interface ProductBannerProps {
  items: Array<ShopProductType>
}

const ProductBanner: React.FC<ProductBannerProps> = ({ items = [] }) => {
  const category = items[0]?.category || ''
  const categoryLowerCase = category.toLowerCase()

  return (
    <Box m='5'>
      <Flex align='end' mb='2'>
        <Heading as='h4' size='lg' fontWeight='normal'>
          {category}
        </Heading>
        <Spacer />
        <Link href={`/shop/${categoryLowerCase}`}>
          View all {categoryLowerCase} products <ChevronRightIcon />
        </Link>
      </Flex>
      <Flex gap='2'>
        {items.map((item) => (
          <ProductCardBasic key={item._id} product={item} />
        ))}
      </Flex>
    </Box>
  )
}

export default ProductBanner
