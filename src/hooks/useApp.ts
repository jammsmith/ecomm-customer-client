import { useContext } from 'react'

import { RealmAppContext } from '@/realm-apollo-client'

export default function useApp() {
  const app = useContext(RealmAppContext)

  if (!app) {
    console.error('[useApp]: No app found in RealmAppContext')
    return {}
  }

  return app
}
