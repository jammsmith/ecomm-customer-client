import * as React from 'react'
import { User as RealmUser } from 'realm-web'
import { OrderType } from './order'

export type DbUserType = {
  _id: string
  user_id: string
  type: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  orders: Array<OrderType>
}

export type DbUserContextType = {
  dbUser: DbUserType | null
  setDbUser: React.Dispatch<React.SetStateAction<DbUserType | null>>
}

export type RealmUserContextType = {
  realmUser: RealmUser | null
  setRealmUser: (value: RealmUser) => void
  logIn: (email: string, password: string) => Promise<RealmUser | undefined>
  logOut: () => Promise<void>
}
