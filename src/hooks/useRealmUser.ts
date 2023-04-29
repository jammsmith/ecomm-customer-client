import { useContext } from 'react'

import { RealmUserContext } from '../realm-apollo-client'

export default function useRealmUser() {
  const user = useContext(RealmUserContext)

  if (!user) {
    console.error('[useRealmUser]: No user found in RealmUserContext')
    return {}
  }

  return {
    currentUser: user.realmUser,
    setCurrentUser: user.setRealmUser,
    logIn: user.logIn,
    logOut: user.logOut,
  }
}
