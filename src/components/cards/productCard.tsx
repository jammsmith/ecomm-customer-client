import * as React from 'react'
import Link from 'next/link'
import { Box, Image, Badge } from '@chakra-ui/react'

import { ShopProductType } from '@/types'
import { getPriceInCurrency } from '@/helpers/price'
import { useCurrency } from '@/hooks'

interface ProductCardProps {
  isLast: boolean
  product: ShopProductType
  updateProductLimit: Function
}

const ProductCard: React.FC<ProductCardProps> = ({
  isLast,
  product,
  updateProductLimit,
}) => {
  const currencyContext = useCurrency()

  const cardRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!cardRef?.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (isLast && entry.isIntersecting) {
        updateProductLimit()
        observer.unobserve(entry.target)
      }
    })

    observer.observe(cardRef.current)
  }, [isLast, updateProductLimit])

  return (
    <div ref={cardRef}>
      <Link href={product.path}>
        <Box
          maxW='sm'
          borderWidth='1px'
          borderRadius='0 0 12px 12px'
          overflow='hidden'
        >
          <Image src={product.images[0]} alt={product.name} />

          <Box p='6' display='flex' flexDirection='column' gap='0.25rem'>
            <Box display='flex' alignItems='baseline'>
              <Badge
                borderRadius='full'
                px='2'
                backgroundColor='brand.primary'
                color='brand.white'
              >
                New
              </Badge>
              <Box
                color='brand.secondary'
                fontWeight='semibold'
                letterSpacing='wide'
                fontSize='xs'
                textTransform='uppercase'
                ml='2'
              >
                {product.category}
                {product.subCategory && (
                  <span> &bull; {product.subCategory}</span>
                )}
              </Box>
            </Box>

            <Box
              mt='1'
              fontWeight='semibold'
              as='h4'
              lineHeight='tight'
              noOfLines={1}
            >
              {product.name}
            </Box>

            <Box>
              {getPriceInCurrency(product, currencyContext?.currency || 'GBP')}
            </Box>
          </Box>
        </Box>
      </Link>
    </div>
  )
}

export default ProductCard
