import * as React from 'react'
import Link from 'next/link'
import { Box, Image, Badge } from '@chakra-ui/react'

import { ShopProductType } from '@/types'

interface ProductCardProps {
  product: ShopProductType
}

const ProductCardBasic: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={product.path}>
      <Box
        maxW='sm'
        borderWidth='1px'
        borderRadius='0 0 8px 8px'
        boxShadow='sm'
        overflow='hidden'
        position='relative'
      >
        <Image src={product.images[0]} alt={product.name} />
        <Box
          display='flex'
          alignItems='baseline'
          position='absolute'
          top='.5rem'
          left='.5rem'
        >
          <Badge
            borderRadius='full'
            px='2'
            backgroundColor='brand.primary'
            color='brand.white'
          >
            New
          </Badge>
        </Box>

        <Box
          px='3'
          py='3'
          mt='1'
          fontWeight='semibold'
          as='h4'
          lineHeight='tight'
          noOfLines={1}
        >
          {product.name}
        </Box>
      </Box>
    </Link>
  )
}

export default ProductCardBasic
