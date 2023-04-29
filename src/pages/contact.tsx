import * as React from 'react'
import Head from 'next/head'

import { Header } from '../components'

const Contact: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact</title>
      </Head>
      <Header page='Contact' />
    </>
  )
}

export default Contact
