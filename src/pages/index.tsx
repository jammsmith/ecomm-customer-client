import Head from 'next/head'

import { Header } from '../components'

export default function Home() {
  return (
    <>
      <Head>
        <title>Mel Talbot</title>
        <meta name="description" content="Mel Talbots wonderful site of stuff!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header page='Home' />
      </main>
    </>
  )
}
