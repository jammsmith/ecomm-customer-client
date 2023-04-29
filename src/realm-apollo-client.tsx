import React, { createContext, useState, useCallback } from 'react'
import * as Realm from 'realm-web'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { RealmUserContextType, DbUserType, DbUserContextType } from '@/types'

const appId = process.env.NEXT_PUBLIC_APP_ID || ''
const region = process.env.NEXT_PUBLIC_APP_REGION || ''

const graphqlUri = `https://${region}.aws.realm.mongodb.com/api/client/v2.0/app/${appId}/graphql`

// Create the app instance
const app = new Realm.App(appId)

// Guarantee that there's a logged in user with a valid access token
type GetValidAccessToken = () => Promise<string | null>

const getValidAccessToken: GetValidAccessToken = async () => {
  try {
    if (!app) throw 'No app object found'

    let token: string | null = null

    if (!app.currentUser) {
      const newUser = await app.logIn(Realm.Credentials.anonymous())
      token = newUser.accessToken
    } else {
      await app.currentUser.refreshCustomData()
      token = app.currentUser.accessToken
    }

    return token
  } catch (err) {
    throw new Error(`Failed to get valid access token. Error: ${err}`)
  }
}

// Setup Graphql Apollo client
const apolloClientInstance = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUri,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken()

      if (options && options.headers) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        }
      }

      return fetch(uri, options)
    },
  }),
  cache: new InMemoryCache({
    // Custom merge function for Order.orderItems
    // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-arrays
    typePolicies: {
      Order: {
        fields: {
          orderItems: {
            merge(existing = [], incoming: any[]) {
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  }),
})

// Setup Realm App context
interface RealmAppProviderProps {
  children: React.ReactElement
}

export const RealmAppContext = createContext<Realm.App | null>(null)
export const RealmUserContext = createContext<RealmUserContextType | null>(null)
export const DbUserContext = createContext<DbUserContextType | null>(null)

export const RealmAppContextProvider: React.FC<RealmAppProviderProps> = ({
  children,
}) => {
  const [realmUser, setRealmUser] = useState<Realm.User | null>(
    app?.currentUser || null
  )

  const [dbUser, setDbUser] = useState<DbUserType | null>(null)

  const loginAnon = useCallback(async () => {
    const user = await app?.logIn(Realm.Credentials.anonymous())
    user && setRealmUser(user)
  }, [])

  type LogIn = (
    email: string,
    password: string
  ) => Promise<Realm.User | undefined>

  const logIn: LogIn = async (email, password) => {
    try {
      if (!app || !app.logIn) throw 'Invalid logIn function found on app object'

      const credentials = Realm.Credentials.emailPassword(email, password)
      const user = await app.logIn(credentials)

      setRealmUser(user)
      return user
    } catch (err) {
      throw `[logIn] Failed. ${err}`
    }
  }

  type LogOut = () => Promise<void>

  const logOut: LogOut = async () => {
    try {
      if (app && app.currentUser) {
        await app.currentUser.logOut()

        if (app.currentUser) {
          // If another user was logged in too, they're now the current user.
          await app.currentUser.refreshCustomData()
          setRealmUser(app.currentUser)
        } else {
          // Otherwise, create a new anonymous user and log them in.
          await loginAnon()
        }
      }
    } catch (err) {
      throw `[logOut] Failed. ${err}`
    }
  }

  // Get the users db object and attach to Realm current user object
  type GetDbUser = () => Promise<void>

  const getDbUser: GetDbUser = useCallback(async () => {
    try {
      if (
        !app.currentUser?.functions?.db_getFullUser ||
        typeof app.currentUser.functions.db_getFullUser !== 'function'
      )
        throw new Error(
          'app.currentUser.functions.db_getFullUser in invalid or does not exist'
        )

      const userDoc = await app.currentUser.functions.db_getFullUser(
        app.currentUser.id
      )

      if (userDoc && JSON.stringify(dbUser) !== JSON.stringify(userDoc)) {
        setDbUser(userDoc)
      }
    } catch (err) {
      console.error('[getDbUser] Failed. Error:', err)
    }
  }, [dbUser])

  React.useEffect(() => {
    if (app && !app.currentUser) {
      loginAnon()
    } else if (!dbUser) {
      getDbUser()
    }
  }, [dbUser, getDbUser, loginAnon])

  const realmUserContext: RealmUserContextType = {
    realmUser,
    setRealmUser,
    logIn,
    logOut,
  }

  const dbUserContext: DbUserContextType = {
    dbUser,
    setDbUser,
  }

  return (
    <RealmAppContext.Provider value={app}>
      <RealmUserContext.Provider value={realmUserContext}>
        <DbUserContext.Provider value={dbUserContext}>
          {children}
        </DbUserContext.Provider>
      </RealmUserContext.Provider>
    </RealmAppContext.Provider>
  )
}

export default apolloClientInstance
