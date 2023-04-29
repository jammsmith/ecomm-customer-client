// import '@/styles/globals.scss'

import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'

import apolloClient, { RealmAppContextProvider } from '@/realm-apollo-client'
import { OrderContextProvider, CurrencyContextProvider } from '@/context'
import theme from '../styles/chakra/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RealmAppContextProvider>
      <ApolloProvider client={apolloClient}>
        <CurrencyContextProvider>
          <OrderContextProvider>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </OrderContextProvider>
        </CurrencyContextProvider>
      </ApolloProvider>
    </RealmAppContextProvider>
  )
}
