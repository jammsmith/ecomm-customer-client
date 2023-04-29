const path = require('path')

/**
 * @type {import('next').NextConfig}
 */

module.exports = () => {
  return {
    reactStrictMode: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'src', 'styles')],
      prependData: '@import "variables.module.scss";',
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'placedog.net',
          port: '',
          pathname: '/400/**',
        },
        {
          protocol: 'https',
          hostname: process.env.NEXT_PUBLIC_S3_BUCKET_LOCATION,
          port: '',
          pathname: '/*',
        },
      ],
    },
  }
}
