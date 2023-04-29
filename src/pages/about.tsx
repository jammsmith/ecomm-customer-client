import * as React from 'react'
import Head from 'next/head'

import { Header } from '../components'

const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <Header page='About' />
    </>
  )
}

export default About
