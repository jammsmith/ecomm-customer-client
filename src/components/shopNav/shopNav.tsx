import * as React from 'react'
import Link from 'next/link'
import { Button, Stack } from '@chakra-ui/react'

import s from './ShopNav.module.scss'
import { useClassNames } from '../../hooks'
import { ShopPageEnum } from '../../enums'
import { capitalise } from '../../helpers/text'

interface ShopNavProps {
  activeFilter?: string
  currentPath: string
  filterOptions?: Array<string>
  title: string
  type: string
  updateFilter?: React.Dispatch<React.SetStateAction<string>>
}

const ShopNav: React.FC<ShopNavProps> = ({
  activeFilter,
  currentPath,
  filterOptions = [],
  title,
  type,
  updateFilter,
}) => {
  const c = useClassNames('shop-link-group', s)

  let currentPathItems = currentPath ? currentPath.split('/') : []
  currentPathItems.length && currentPathItems.shift()

  const typeEnum = ShopPageEnum[type as keyof typeof ShopPageEnum]

  if (!typeEnum) {
    console.error(`Prop { type=${type} } is not a valid ShopPageEnum`)
    return <></>
  }

  return (
    <div className={c()}>
      <div className={c(['inner-container'])}>
        <Stack spacing={4} direction='row' align='center' justify='center'>
          {activeFilter &&
            updateFilter &&
            typeof updateFilter === 'function' &&
            filterOptions &&
            filterOptions.map((fo, i) => (
              <Button
                key={`filterOption-${fo}`}
                variant={
                  activeFilter === fo ? 'primarySelected' : 'primaryOutline'
                }
                fontWeight='normal'
                onClick={() => updateFilter(fo)}
              >
                {fo}
              </Button>
            ))}
        </Stack>
        {title !== 'Shop' && (
          <div className={c(['breadcrumbs'])}>
            {currentPathItems.map((section, i) => {
              const isLastItem: boolean = !(i < currentPathItems.length - 1)

              // Build link for each breadcrumb item
              const href = currentPathItems.reduce((acc, item, j) => {
                if (j <= i) acc += `/${item}`
                return acc
              }, '')

              // If product page then replace _id with product name in breadcrumb label
              if (isLastItem && typeEnum === 'Product') section = title

              return (
                <React.Fragment key={`ShopNav__breadcrumbs--${i}`}>
                  <Link
                    href={href}
                    className={c(
                      ['breadcrumbs', 'breadcrumb'],
                      [{ type: 'current-page', condition: isLastItem }],
                      [currentPathItems]
                    )}
                  >
                    {capitalise(section)}
                  </Link>
                  {!isLastItem && <span>/</span>}
                </React.Fragment>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopNav
