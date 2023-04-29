import { CurrencyEnum } from '@/enums'

export type CurrencyContextType = {
  currency: CurrencyEnum
  setCurrency: React.Dispatch<React.SetStateAction<CurrencyEnum>>
}
