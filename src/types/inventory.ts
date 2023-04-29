export type ShopCategoryType = {
  _id: string
  category_id: string
  name: string
  description: string
  image: string
  path: string
  subCategories?: Array<ShopSubCategoryType>
}

export type ShopSubCategoryType = {
  _id: string
  subCategory_id: string
  name: string
  description: string
  image: string
  category: string
  path: string
  products?: Array<ShopProductType>
}

export type ShopProductType = {
  _id: string
  product_id: string
  name: string
  images: Array<string>
  category: string
  subCategory: string
  description: string
  path: string
  priceGBP: number
  priceUSD: number
  priceEUR: number
  numInStock: number
  deliveryLevel: number
}
